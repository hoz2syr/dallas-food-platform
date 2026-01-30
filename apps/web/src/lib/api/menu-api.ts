import { httpFetch } from './http-client';
import { Menu, CreateMenuRequest, UpdateMenuRequest } from '../../types/api/menu.types';
import { HttpError } from '../../types/api/error.types';

async function handleResponse(res: Response) {
  const text = await res.text();
  let parsed: unknown = text;
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
  const res = await httpFetch('/api/menu/', { method: 'GET' });
  const data = await handleResponse(res);
  // normalize to Menu[]
  if (Array.isArray(data)) return data as Menu[];
  if (data && Array.isArray(data.items)) return [data as Menu];
  return [];
}

export async function fetchMenu(id: string): Promise<Menu> {
  const res = await httpFetch(`/api/menu/${encodeURIComponent(id)}`, { method: 'GET' });
  const data = await handleResponse(res);
  return data as Menu;
}

export async function createMenu(menu: CreateMenuRequest): Promise<Menu> {
  const res = await httpFetch('/api/menu/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(menu),
  });
  return handleResponse(res) as Promise<Menu>;
}

export async function updateMenu(id: string, menu: UpdateMenuRequest): Promise<Menu> {
  const res = await httpFetch(`/menus/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(menu),
  });
  return handleResponse(res) as Promise<Menu>;
}

export async function deleteMenu(id: string): Promise<void> {
  const res = await httpFetch(`/menus/${encodeURIComponent(id)}`, { method: 'DELETE' });
  await handleResponse(res);
}
