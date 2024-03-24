import { User } from "../shared/User";
import { ApiError } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import { remult } from "remult";
import jwt from "jsonwebtoken";
import { MY_SECRET_KEY } from "../constants";
import { excludeSensitiveInfo } from "../controller/User.controller";

// Augment the Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: any; // Modify 'any' to the actual type of your user object
        }
    }
}

const secretKey = process.env.REACT_APP_AUTH_TOKEN ?? MY_SECRET_KEY;

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") || req.cookies.AUTH_TOKEN;

    if (!token) {
        return res.json(new ApiError(401, "Unauthorized request."));
    }

    try {
        // Verify and decode the JWT token
        const decodedToken = jwt.verify(token, secretKey) as { id: number };

        // Retrieve the user details from the database
        const user = await remult.repo(User).findOne({ where: { id: decodedToken.id } });

        if (!user) {
            return res.json(new ApiError(404, "User not found."));
        }

        // Attach user details to the request object
        req.user = excludeSensitiveInfo({ userInfo: user });
        next();
    } catch (error) {
        // Handle JWT verification errors
        return res.json(new ApiError(401, "Invalid or expired token."));
    }
})

export {
    verifyJWT
}