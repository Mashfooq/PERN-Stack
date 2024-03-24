import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiErrors';

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        // Properly handle the error
        const err = error as { code?: number, message: string };
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        });
        res.json(new ApiError(500, "Something went wrong."));
    }
}

export { asyncHandler };
