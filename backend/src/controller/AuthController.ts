import { RequestHandler } from 'express';
import { remult } from "remult";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// import shared or model
import { User } from "../shared/User"
import { MY_SECRET_KEY } from '../constants';

const userRepo = remult.repo(User);
const secretKey = process.env.AUTH_TOKEN || MY_SECRET_KEY;

export class AuthController {

    public static readonly signInHandler: RequestHandler = async (req, res) => {
        const { userEmail, password } = req.body;

        try {
            const user = await userRepo.findOne({ where: { userEmail: userEmail } });

            if (user && password === user.password) {
                const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

                res.status(200).json({ token: token, message: "User is authenticated." });
            } else {
                res.status(401).json({ message: "Invalid username or password" });
            }
        }
        catch (error) {
            console.error("Error occurred:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public static readonly getCurrentUser: RequestHandler = async (req, res) => {
        console.log("requested getCurrentUser");
        // Extract the token from the request headers
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authorization token not provided' });
        }

        try {
            // Decode the token to get the user ID
            const decodedToken = jwt.verify(token, secretKey) as { userId : number };
            const userId = decodedToken.userId;

            // Retrieve the user details from the database
            const user = await remult.repo(User).findOne({ where:{ id: userId }});

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Return the user details in the response
            res.status(200).json({ user });
        } catch (error) {
            console.error('Error occurred:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}