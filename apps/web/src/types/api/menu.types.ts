export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
}
