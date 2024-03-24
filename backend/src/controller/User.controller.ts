import { remult } from "remult";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from 'bcryptjs';

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
import { httpOnlyAndSecureOption } from "../utils/Utility";

const userRepo = remult.repo(User);
const secretKey = process.env.REACT_APP_AUTH_TOKEN ?? MY_SECRET_KEY;

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
        // Compare the entered password with the hashed password
        return await bcrypt.compare(enteredPassword, hashedPassword);
    } catch (error) {
        // Handle any errors that occur during the comparison process
        console.error("Error occurred while validating password:", error);
        return false; // Return false in case of error
    }
}

function excludeSensitiveInfo({ userInfo }: UserinformationParams) {
    const { password, refreshToken, ...userWithoutSensitiveData } = userInfo;

    return userWithoutSensitiveData;
}

const generateAccessAndRefereshTokens = (user: User) => {
    try {
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user.id);

        return { newAccessToken, newRefreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const generateAccessToken = (user: User) => {
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

const generateRefreshToken = (userId: number) => {
    return jwt.sign(
        {
            id: userId,

        },
        secretKey,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "1d"
        }
    )
}

const userLogin = asyncHandler(async (req, res) => {
    // req body -> data
    // Validate email
    // find the user
    // validate password
    // access and referesh token
    // send res with cookie

    const { userEmail, password } = req.body;

    if (!userEmail && !password) {
        return res.json(new ApiError(400, "username or email is required"));
    }

    const user = await userRepo.findOne({ where: { userEmail: userEmail } });

    if (!user) {
        return res.json(new ApiError(404, "User does not exist"));
    }

    // TODO: Remove this on impleenting Sign up
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const isPasswordValid = await validatePassword({
        enteredPassword: user.password, 
        hashedPassword: hashedPassword // change to password on implementing sign up
    });

    if (!isPasswordValid) {
        return res.json(new ApiError(401, "Invalid user credentials"));
    }

    const { newAccessToken, newRefreshToken } = generateAccessAndRefereshTokens(user)

    await userRepo.save({ ...user, refreshToken: newRefreshToken });

    // Exclude the sensitive fields from the user details.
    const userDetails = excludeSensitiveInfo({ userInfo: user });

    return res
        .status(200)
        .cookie("accessToken", newAccessToken, httpOnlyAndSecureOption())
        .json(
            new ApiResponse(
                200,
                {
                    user: userDetails, newAccessToken
                },
                "User logged In Successfully"
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    // Await the req.user Promise
    const user = await req.user;

    // Ensure user is defined and contains the necessary properties
    if (!user || !user.id || !user.userEmail || !user.userName || !user.updatedAt || !user.createdAt) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid user data"));
    }

    // Extract only the desired properties
    const { id, userEmail, userName, updatedAt, createdAt } = user;

    // Create a new object with the extracted properties
    const userDetails = {
        id,
        userEmail,
        userName,
        updatedAt,
        createdAt
    };

    return res.status(200).json(new ApiResponse(
        200,
        {
            user: userDetails
        },
        "User fetched successfully"
    ));
});

export {
    userLogin,
    getCurrentUser,
    excludeSensitiveInfo
}