import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express'
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DosSaverMiddleware implements NestMiddleware {
  private readonly MAX_REQUESTS = 100; // حداکثر تعداد درخواست مجاز در بازه زمانی
  private readonly TIME_WINDOW = 60 * 60 * 1000; // بازه زمانی به میلی‌ثانیه (اینجا 1 ساعت)
  private readonly STORAGE_FILE = path.join(__dirname, 'requests.json'); // مسیر فایل JSON
 
  constructor() {
    // اطمینان از وجود فایل ذخیره‌سازی
    if (!fs.existsSync(this.STORAGE_FILE)) {
      fs.writeFileSync(this.STORAGE_FILE, JSON.stringify({}));
    }
  }
  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip; // گرفتن IP کاربر
    const now = Date.now(); // زمان فعلی
    const requestData = this.loadRequestData(); // بارگذاری اطلاعات درخواست‌ها

    if (!requestData[ip]) {
      requestData[ip] = { count: 1, firstRequestTime: now };
    } else {
      const elapsedTime = now - requestData[ip].firstRequestTime;

      if (elapsedTime > this.TIME_WINDOW) {
        // اگر بازه زمانی تمام شده باشد، شمارنده را ریست کن
        requestData[ip] = { count: 1, firstRequestTime: now };
      } else {
        // در غیر این صورت شمارنده را افزایش بده
        requestData[ip].count++;
      }
    }

    // اگر تعداد درخواست‌ها از حد مجاز بیشتر شد
    if (requestData[ip].count > this.MAX_REQUESTS) {
      console.warn(`IP ${ip} blocked due to excessive requests.`);
      return res.status(429).send('Too Many Requests');
    }

    // ذخیره‌سازی داده‌های به‌روزرسانی‌شده
    this.saveRequestData(requestData);

    // ادامه پردازش درخواست
    next();
  }


  private loadRequestData(): Record<string, { count: number; firstRequestTime: number }> {
    try {
      const data = fs.readFileSync(this.STORAGE_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading request data:', err);
      return {};
    }
  }

  private saveRequestData(data: Record<string, { count: number; firstRequestTime: number }>): void {
    try {
      fs.writeFileSync(this.STORAGE_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error saving request data:', err);
    }
  }
}
