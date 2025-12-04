import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

type Location = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, location: Location = 'body')
{
    return (req: Request, res: Response, next: NextFunction) => {
        const data = (req as any) [location];
        const result = schema.safeParse(data);

        if(!result.success)
        {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: result.error.flatten(),
            });
        }

        (req as any) [location] = result.data;
        next();
    };
}