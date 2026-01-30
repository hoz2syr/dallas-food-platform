export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
  tags?: string[];
  isNew?: boolean;
  isPopular?: boolean;
}

export interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface CreateMenuRequest {
  menuId: string;
  name: string;
  items: MenuItem[];
}

export interface UpdateMenuRequest {
  name: string;
  items: MenuItem[];
}
