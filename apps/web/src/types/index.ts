export type MenuItem = {
  id: string;
  name: string;
  price: number;
};

export type Menu = {
  id: string;
  name: string;
  items: MenuItem[];
  createdAt: string;
};

export type Order = {
  id: string;
  status: string;
  createdAt: string;
};
