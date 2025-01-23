import * as dotenv from 'dotenv';

// بارگذاری متغیرهای محیطی
dotenv.config();

export const ENV = process.env; // اکسپورت کردن متغیرها برای استفاده در کل پروژه
