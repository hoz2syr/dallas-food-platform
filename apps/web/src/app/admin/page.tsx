"use client";

import React, { useEffect, useState } from 'react';
import { fetchMenus, createMenu, updateMenu, deleteMenu } from '../../lib/api/menu-api';
import { Menu } from '../../types/api/menu.types';

export default function AdminPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  // Form states
  const [menuId, setMenuId] = useState('');
  const [menuName, setMenuName] = useState('');
  const [items, setItems] = useState<{ id: string; name: string; price: number; image?: string }[]>([]);

  // Item form states
  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState(0);
  const [itemImage, setItemImage] = useState('');

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = () => {
    setLoading(true);
    fetchMenus()
      .then(setMenus)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleAddItem = () => {
    if (!itemId || !itemName || itemPrice <= 0) {
      alert('Please fill in all item fields correctly.');
      return;
    }
    setItems([...items, { id: itemId, name: itemName, price: itemPrice, image: itemImage }]);
    setItemId('');
    setItemName('');
    setItemPrice(0);
    setItemImage('');
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleCreateMenu = async () => {
    if (!menuId || !menuName) {
      alert('Please fill in Menu ID and Name.');
      return;
    }
    try {
      await createMenu({ menuId, name: menuName, items });
      alert('Menu created successfully!');
      setMenuId('');
      setMenuName('');
      setItems([]);
      loadMenus();
    } catch (err: any) {
      alert('Error creating menu: ' + err.message);
    }
  };

  const handleUpdateMenu = async () => {
    if (!editingMenu) return;
    try {
      await updateMenu(editingMenu.id, { name: menuName, items });
      alert('Menu updated successfully!');
      setEditingMenu(null);
      setMenuId('');
      setMenuName('');
      setItems([]);
      loadMenus();
    } catch (err: any) {
      alert('Error updating menu: ' + err.message);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;
    try {
      await deleteMenu(id);
      loadMenus();
    } catch (err: any) {
      alert('Error deleting menu: ' + err.message);
    }
  };

  const startEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setMenuId(menu.id);
    setMenuName(menu.name);
    setItems(menu.items || []);
  };

  const cancelEdit = () => {
    setEditingMenu(null);
    setMenuId('');
    setMenuName('');
    setItems([]);
  };

  return (
    <div className="admin-page" style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>
      
      <div className="card" style={{ marginBottom: '32px' }}>
        <h2>{editingMenu ? 'Edit Menu' : 'Create New Menu'}</h2>
        <div style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label htmlFor="menuId">Menu ID (Unique): </label>
            <input 
              id="menuId"
              type="text" 
              value={menuId} 
              onChange={(e) => setMenuId(e.target.value)} 
              disabled={!!editingMenu}
              className="checkout-input"
            />
          </div>
          <div>
            <label htmlFor="menuName">Menu Name: </label>
            <input 
              id="menuName"
              type="text" 
              value={menuName} 
              onChange={(e) => setMenuName(e.target.value)} 
              className="checkout-input"
            />
          </div>
        </div>

        <h3>Items</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '8px', alignItems: 'end', marginBottom: '16px' }}>
          <div>
            <label htmlFor="itemId">ID</label>
            <input id="itemId" type="text" value={itemId} onChange={(e) => setItemId(e.target.value)} className="checkout-input" placeholder="e.g. burger-1" />
          </div>
          <div>
            <label htmlFor="itemName">Name</label>
            <input id="itemName" type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} className="checkout-input" placeholder="e.g. Cheese Burger" />
          </div>
          <div>
            <label htmlFor="itemPrice">Price</label>
            <input id="itemPrice" type="number" value={itemPrice} onChange={(e) => setItemPrice(Number(e.target.value))} className="checkout-input" placeholder="0.00" />
          </div>
          <div>
            <label htmlFor="itemImage">Image URL</label>
            <input id="itemImage" type="text" value={itemImage} onChange={(e) => setItemImage(e.target.value)} className="checkout-input" placeholder="/images/..." />
          </div>
          <button onClick={handleAddItem} className="btn btn-accent">Add Item</button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #eee' }}>
              <span>{item.name} (${item.price})</span>
              <button onClick={() => handleRemoveItem(idx)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={editingMenu ? handleUpdateMenu : handleCreateMenu} className="btn btn-primary">
            {editingMenu ? 'Update Menu' : 'Create Menu'}
          </button>
          {editingMenu && <button onClick={cancelEdit} className="btn btn-outline">Cancel</button>}
        </div>
      </div>

      <h2>Existing Menus</h2>
      {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        <div className="menu-grid">
          {menus.map((menu) => (
            <div key={menu.id} className="card menu-card">
              <h3>{menu.name}</h3>
              <p>{menu.items?.length || 0} items</p>
              <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                <button onClick={() => startEdit(menu)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Edit</button>
                <button onClick={() => handleDeleteMenu(menu.id)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.9rem', borderColor: 'red', color: 'red' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
