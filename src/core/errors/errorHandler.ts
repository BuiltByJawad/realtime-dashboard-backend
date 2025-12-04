import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError';

export function errorHandler(
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
){
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = statusCode === 500 && process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

    if(process.env.NODE_ENV !== 'test')
    {
        console.error(err);
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
}