export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
}
