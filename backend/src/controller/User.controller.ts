import { remult } from "remult";
import  jwt  from "jsonwebtoken"
import dotenv from "dotenv"


dotenv.config({
    path: './.env'
})

// import utils
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiErrors";

// Import model
import { User } from "../shared/User"
import { ApiResponse } from "../utils/ApiResponse";
import { MY_SECRET_KEY } from "../constants";

const userRepo = remult.repo(User);

interface PasswordValidationParams {
    enteredPassword: string;
    hashedPassword: string;
}

interface UserinformationParams {
    userInfo: { [key: string]: any };
}

// Method to validate user password.
async function validatePassword({ enteredPassword, hashedPassword }: PasswordValidationParams) {
    try {
        // TODO: Bycrpt
        // Compare the entered password with the hashed password
        // return await bcrypt.compare(enteredPassword, hashedPassword);
        return enteredPassword === hashedPassword;
    } catch (error) {
        // Handle any errors that occur during the comparison process
        console.error("Error occurred while validating password:", error);
        return false; // Return false in case of error
    }
}

async function excludeSensitiveInfo({ userInfo }:UserinformationParams) {
    const { password, excludeRefreshToken, ...userWithoutSensitiveData } = userInfo;

    return userWithoutSensitiveData;
}

const generateAccessAndRefereshTokens = async(userId: number) =>{
    try {
        const user = await userRepo.findId(userId);

        const newAccessToken = await generateAccessToken(user);
        const newRefreshToken = await generateRefreshToken(user.id);

        await userRepo.save({...user, refreshToken: newRefreshToken});

        return {newAccessToken, newRefreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const generateAccessToken = async(user: User) =>{
    return jwt.sign(
        {
            id: user.id,
            userEmail: user.userEmail,
            userName: user.userName
        },
        process.env.REACT_APP_AUTH_TOKEN || MY_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h"
        }
    )
}

const generateRefreshToken = async(userId: number) =>{
    return jwt.sign(
        {
            id: userId,
            
        },
        process.env.REACT_APP_REFRESH_TOKEN || MY_SECRET_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "1d"
        }
    )
}

const userLogin = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const { userEmail, password } = req.body;

    if (!userEmail && !password) {
        return res.json(new ApiError(400, "username or email is required"));
    }

    const user = await userRepo.findOne({ where: { userEmail: userEmail } });

    if (!user) {
        return res.json(new ApiError(404, "User does not exist"));
    }

    const isPasswordValid = await validatePassword({
        enteredPassword: password,
        hashedPassword: user.password
    });

    if (!isPasswordValid) {
        return res.json(new ApiError(401, "Invalid user credentials"));
    }

    const loggedInUser = await userRepo.findId(user.id);

    // Exclude the sensitive fields from the user details.
    const userDetails = await excludeSensitiveInfo({ userInfo: loggedInUser });

    const { newAccessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user.id)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", newAccessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: userDetails, newAccessToken, newRefreshToken
                },
                "User logged In Successfully"
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
});

export {
    userLogin,
    getCurrentUser,
    excludeSensitiveInfo
}