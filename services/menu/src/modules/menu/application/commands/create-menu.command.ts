export interface CreateMenuCommand {
  menuId: string;
  name: string;
  items: Array<{ id: string; name: string; price: number }>;
}
