import React, { useState, useEffect } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
}

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockMenus: Menu[] = [
        {
          id: 'm1',
          name: 'Burgers',
          items: [
            { id: 'i1', name: 'Classic Cheeseburger', price: 8.99, stock: 10 },
            { id: 'i2', name: 'Bacon Deluxe Burger', price: 12.99, stock: 5 },
            { id: 'i3', name: 'Double Patty Burger', price: 14.99, stock: 0 },
            { id: 'i7', name: 'Spicy Chicken Burger', price: 10.99, stock: 8 },
            { id: 'i8', name: 'Veggie Supreme Burger', price: 9.99, stock: 6 },
            { id: 'i9', name: 'Texas BBQ Burger', price: 13.99, stock: 4 },
          ],
        },
        {
          id: 'm2',
          name: 'Beverages',
          items: [
            { id: 'i4', name: 'Coca-Cola', price: 2.49, stock: 20 },
            { id: 'i5', name: 'Fresh Orange Juice', price: 3.99, stock: 15 },
            { id: 'i6', name: 'Iced Coffee', price: 2.99, stock: 0 },
            { id: 'i10', name: 'Strawberry Milkshake', price: 4.99, stock: 12 },
            { id: 'i11', name: 'Chocolate Milkshake', price: 4.99, stock: 18 },
            { id: 'i12', name: 'Bottled Water', price: 1.49, stock: 30 },
          ],
        },
        {
          id: 'm3',
          name: 'Sides & Snacks',
          items: [
            { id: 'i13', name: 'French Fries', price: 3.99, stock: 15 },
            { id: 'i14', name: 'Onion Rings', price: 4.99, stock: 20 },
            { id: 'i15', name: 'Chicken Nuggets (6pc)', price: 5.99, stock: 25 },
            { id: 'i16', name: 'Mozzarella Sticks', price: 6.99, stock: 10 },
          ],
        },
        {
          id: 'm4',
          name: 'Desserts',
          items: [
            { id: 'i17', name: 'Chocolate Chip Cookie', price: 2.49, stock: 8 },
            { id: 'i18', name: 'Apple Pie', price: 3.99, stock: 6 },
            { id: 'i19', name: 'Vanilla Ice Cream', price: 2.99, stock: 22 },
            { id: 'i20', name: 'Chocolate Brownie', price: 3.49, stock: 12 },
          ],
        },
      ];
      setMenus(mockMenus);
      setLoading(false);
    } catch (err) {
      setError('Failed to load menu');
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    // In a real app, this would add to cart state/context
    alert(`تم إضافة ${item.name} إلى السلة`);
  };

  if (loading) {
    return (
      <div className="menu-page">
        <h2>قائمة الطعام</h2>
        <p>جاري تحميل القائمة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-page">
        <h2>قائمة الطعام</h2>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <h2>قائمة الطعام</h2>
      {menus.map((menu) => (
        <div key={menu.id} className="menu-category">
          <h3>{menu.name}</h3>
          <div className="menu-items">
            {menu.items.map((item) => (
              <div key={item.id} className="menu-item">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <div className="price">{item.price} ريال</div>
                  <div className={`stock ${item.stock > 0 ? 'available' : 'unavailable'}`}>
                    {item.stock > 0 ? `متوفر (${item.stock})` : 'غير متوفر'}
                  </div>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(item)}
                  disabled={item.stock === 0}
                >
                  {item.stock > 0 ? 'أضف للسلة' : 'غير متوفر'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
