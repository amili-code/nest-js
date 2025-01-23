import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/environment';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  private isDebugMode = ENV.DEBUG === 'true'; // بررسی مقدار DEBUG

  use(req: Request, res: Response, next: NextFunction) {
    if (!this.isDebugMode) {
      // اگر DEBUG فعال نبود، به درخواست بعدی منتقل شود
      return next();
    }

    const { ip, method, baseUrl, hostname } = req;
    const userAgent = req.get('user-agent') || '';
    const startAt = process.hrtime();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const dif = process.hrtime(startAt);
      const responseTime = dif[0] * 1e3 + dif[1] * 1e-6;

      this.logger.log({
        ip,
        method,
        baseUrl,
        hostname,
        userAgent,
        statusCode,
        contentLength,
        responseTime,
      });
    });

    next();
  }
}
