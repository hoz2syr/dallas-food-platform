import { httpFetch } from './http-client';
import { Menu } from '../../types/api/menu.types';
import { HttpError } from '../../types/api/error.types';

async function handleResponse(res: Response) {
  const text = await res.text();
  let parsed: any = text;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch (_e) {
    // leave as text
  }

  if (!res.ok) {
    throw new HttpError(res.status, parsed);
  }

  return parsed;
}

export async function fetchMenus(): Promise<Menu[]> {
  const res = await httpFetch('/menus', { method: 'GET' });
  const data = await handleResponse(res);
  // normalize to Menu[]
  if (Array.isArray(data)) return data as Menu[];
  if (data && Array.isArray(data.items)) return [data as Menu];
  return [];
}

export async function fetchMenu(id: string): Promise<Menu> {
  const res = await httpFetch(`/menus/${encodeURIComponent(id)}`, { method: 'GET' });
  const data = await handleResponse(res);
  return data as Menu;
}
