// lib/api/menu.ts
// دوال استدعاء قائمة الطعام من Menu Service

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
}

// يمكنك ضبط العنوان حسب البيئة
const MENU_SERVICE_URL = process.env.NEXT_PUBLIC_MENU_SERVICE_URL || 'http://localhost:3002';

export async function fetchMenus(): Promise<Menu[]> {
  const res = await fetch(`${MENU_SERVICE_URL}/menus`, {
    headers: {
      'Content-Type': 'application/json',
      // أضف API_KEY إذا كان مطلوباً
      // 'x-api-key': process.env.NEXT_PUBLIC_MENU_API_KEY || ''
    },
    next: { revalidate: 60 }, // دعم ISR في Next.js إذا لزم الأمر
  });
  if (!res.ok) throw new Error('فشل في جلب القوائم');
  return res.json();
}
