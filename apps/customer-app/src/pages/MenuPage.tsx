

import React, { useState, useEffect } from 'react';
import { fetchMenus, Menu, MenuItem } from '../lib/api/menu';
import { useCart } from '../lib/context/CartContext';

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    fetchMenusFromApi();
  }, []);

  const fetchMenusFromApi = async () => {
    try {
      const data = await fetchMenus();
      setMenus(data);
      setLoading(false);
    } catch (err) {
      setError('فشل في تحميل القائمة');
      setLoading(false);
    }
  };


  const { addToCart } = useCart();

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
