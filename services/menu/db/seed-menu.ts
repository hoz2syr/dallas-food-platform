import { client } from "../postgres.client";

async function seedMenus() {
  // Example menu and items
  const menuId = "main-menu";
  const menuName = "Main Menu";
  const createdAt = new Date();
  const items = [
    { id: "item-burger", name: "Classic Burger", price: 25 },
    { id: "item-pizza", name: "Margherita Pizza", price: 30 },
    { id: "item-salad", name: "Caesar Salad", price: 18 },
    { id: "item-steak", name: "Grilled Steak", price: 55 },
    { id: "item-juice", name: "Fresh Orange Juice", price: 10 },
    { id: "item-dessert", name: "Chocolate Cake", price: 15 },
  ];

  await client.connect();
  await client.query('INSERT INTO menus (id, name, created_at) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING', [menuId, menuName, createdAt]);
  for (const item of items) {
    await client.query('INSERT INTO menu_items (id, menu_id, name, price) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING', [item.id, menuId, item.name, item.price]);
  }
  await client.end();
  console.log('Seeded menu and items successfully!');
}

seedMenus().catch(e => { console.error(e); process.exit(1); });
