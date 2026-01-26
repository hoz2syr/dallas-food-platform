"use client";

import React, { useEffect, useState } from 'react';
import { fetchMenus } from '../../lib/api/menu-api';
import { addItem } from '../../lib/cart/cart-store';

type Item = { id: string; name: string; price: number; image?: string };

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
        setItems(all.map((it: any) => ({ id: it.id, name: it.name, price: it.price, image: it.image })));
      })
      .catch((err: any) => setError(err && err.message ? err.message : String(err)))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div className="menu-error">Error: {error}</div>;

  return (
    <div className="menu-page">
      <h2>Menu</h2>
      <div className="menu-grid">
        {items.map((it) => (
          <div key={it.id} className="card fade-in-up menu-card">
            {it.image && (
              <img src={it.image} alt={it.name} className="img-zoom menu-card-img" />
            )}
            <div className="menu-card-title">{it.name}</div>
            <div className="small menu-card-price">${it.price}</div>
            <button
              className="btn btn-primary scale-in"
              onClick={() => { try { addItem({ id: it.id, name: it.name, price: it.price }); } catch (e) { /* noop */ } }}
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
