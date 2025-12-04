import { Request, Response } from 'express';
import { getOverviewAnalytics } from './analytics.service';

export const getOverviewHandler = async (req: Request, res: Response) => {
    const overview = await getOverviewAnalytics();
    res.json({ success: true, data: overview });
};