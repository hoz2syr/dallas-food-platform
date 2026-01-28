// ملف تعريف TypeScript لـ Express
// لا تستخدم import هنا

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export {};
