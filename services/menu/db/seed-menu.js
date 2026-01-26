const { Client } = require('pg');

const client = new Client({
  host: process.env.POSTGRES_HOST || process.env.POSTGRES_SERVICE || 'localhost',
  port: Number(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || 'dallas',
  user: process.env.POSTGRES_USER || 'dallas',
  password: process.env.POSTGRES_PASSWORD || 'dallas',
});

async function seedMenus() {
  // Example menu and items
  const menuId = "main-menu";
  const menuName = "Main Menu";
  const createdAt = new Date();
  const items = [
    { id: "item-burger", name: "Classic Burger", price: 25, image: "/images/burger.jpg" },
    { id: "item-pizza", name: "Margherita Pizza", price: 30, image: "/images/pizza.jpg" },
    { id: "item-salad", name: "Caesar Salad", price: 18, image: "/images/salad.jpg" },
    { id: "item-steak", name: "Grilled Steak", price: 55, image: "/images/steak.jpg" },
    { id: "item-juice", name: "Fresh Orange Juice", price: 10, image: "/images/juice.jpg" },
    { id: "item-dessert", name: "Chocolate Cake", price: 15, image: "/images/cake.jpg" },
    { id: "item-shawarma", name: "Chicken Shawarma", price: 22, image: "/images/shawarma.jpg" },
    { id: "item-kabsa", name: "Kabsa Rice", price: 35, image: "/images/kabsa.jpg" },
    { id: "item-tabouleh", name: "Tabouleh Salad", price: 16, image: "/images/tabouleh.jpg" },
    { id: "item-molokhia", name: "Molokhia", price: 28, image: "/images/molokhia.jpg" },
    { id: "item-mansaf", name: "Jordanian Mansaf", price: 60, image: "/images/mansaf.jpg" },
    { id: "item-mixedgrill", name: "Mixed Grill", price: 48, image: "/images/mixedgrill.jpg" },
  ];

  await client.connect();
  await client.query('INSERT INTO menus (id, name, created_at) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING', [menuId, menuName, createdAt]);
  // أضف عمود image إذا لم يكن موجودًا
  await client.query('ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS image TEXT');
  for (const item of items) {
    await client.query('INSERT INTO menu_items (id, menu_id, name, price, image) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING', [item.id, menuId, item.name, item.price, item.image]);
  }
  await client.end();
  console.log('Seeded menu and items successfully!');
}

seedMenus().catch(e => { console.error(e); process.exit(1); });
