import express from 'express';
import cookieParser from 'cookie-parser';
import { securityMiddleware } from './config/security';
import { requestLogger } from './core/middleware/requestLogger';
import router from './routes';
import { errorHandler } from './core/errors/errorHandler';


const app = express();

app.use(securityMiddleware.helmet);
app.use(securityMiddleware.cors);
app.use(securityMiddleware.rateLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use('/api', router);

app.use((req, res) => {
    res.status(404).json({ success: false, mesage: 'Not Found' });
});

app.use(errorHandler);

export default app;
