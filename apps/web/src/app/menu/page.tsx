import React, { useEffect, useState } from 'react';
import { fetchMenus } from '../../lib/api/menu-api';
import { addItem } from '../../lib/cart/cart-store';

type Item = { id: string; name: string; price: number; };

export default function MenuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchMenus()
      .then((menus) => {
        if (!mounted) return;
        // flatten items from menus
        const all = menus.flatMap((m: any) => m.items || []);
        setItems(all.map((it: any) => ({ id: it.id, name: it.name, price: it.price })));
      })
      .catch((err: any) => setError(err && err.message ? err.message : String(err)))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>Menu</h2>
      <ul>
        {items.map((it) => (
          <li key={it.id} style={{ marginBottom: 8 }}>
            <strong>{it.name}</strong> — ${it.price}{' '}
            <button onClick={() => { try { addItem({ id: it.id, name: it.name, price: it.price }); } catch (e) { /* noop */ } }}>
              Add to cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
