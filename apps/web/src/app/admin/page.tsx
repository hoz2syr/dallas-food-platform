"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { fetchMenus, createMenu, updateMenu, deleteMenu } from '../../lib/api/menu-api';
import { Menu } from '../../types/api/menu.types';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Grid,
  Stack,
  IconButton,
  Fade,
  useTheme,
  Divider,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function AdminPage() {
  const theme = useTheme();
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

  const loadMenus = useCallback(() => {
    setLoading(true);
    fetchMenus()
      .then(setMenus)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { 
    loadMenus(); 
  }, [loadMenus]);

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
    } catch (err: unknown) { 
      const message = err instanceof Error ? err.message : String(err);
      alert('Error creating menu: ' + message); 
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
    } catch (err: unknown) { 
      const message = err instanceof Error ? err.message : String(err);
      alert('Error updating menu: ' + message); 
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;
    try { 
      await deleteMenu(id); 
      loadMenus(); 
    } catch (err: unknown) { 
      const message = err instanceof Error ? err.message : String(err);
      alert('Error deleting menu: ' + message); 
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
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography variant="h3" fontWeight={700} mb={3} color="primary.main">
        Admin Dashboard
      </Typography>
      
      <Fade in timeout={600}>
        <Card elevation={4} sx={{ mb: 4, borderRadius: 3, p: 3, background: theme.palette.background.paper }}>
          <CardContent>
            <Typography variant="h5" fontWeight={600} mb={2} color="secondary.main">
              {editingMenu ? 'Edit Menu' : 'Create New Menu'}
            </Typography>
            
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Menu ID (Unique)"
                  value={menuId}
                  onChange={e => setMenuId(e.target.value)}
                  disabled={!!editingMenu}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Menu Name"
                  value={menuName}
                  onChange={e => setMenuName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Items
            </Typography>
            
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} sm={3}>
                <TextField 
                  label="ID" 
                  value={itemId} 
                  onChange={e => setItemId(e.target.value)} 
                  fullWidth 
                  size="small" 
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField 
                  label="Name" 
                  value={itemName} 
                  onChange={e => setItemName(e.target.value)} 
                  fullWidth 
                  size="small" 
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField 
                  label="Price" 
                  type="number" 
                  value={itemPrice} 
                  onChange={e => setItemPrice(Number(e.target.value))} 
                  fullWidth 
                  size="small" 
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField 
                  label="Image URL" 
                  value={itemImage} 
                  onChange={e => setItemImage(e.target.value)} 
                  fullWidth 
                  size="small" 
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button 
                  onClick={handleAddItem} 
                  variant="contained" 
                  color="secondary" 
                  sx={{ minWidth: 0, px: 2, py: 1, borderRadius: 2 }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            
            <Stack spacing={1} mt={2} mb={2}>
              {items.map((item, idx) => (
                <Box 
                  key={idx} 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="space-between" 
                  px={1} 
                  py={0.5} 
                  borderRadius={2} 
                  bgcolor={theme.palette.grey[100]}
                >
                  <Typography>
                    {item.name} (${item.price})
                  </Typography>
                  <IconButton 
                    color="error" 
                    onClick={() => handleRemoveItem(idx)} 
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Stack>
            
            <Divider sx={{ my: 2 }} />
            
            <CardActions sx={{ gap: 2 }}>
              <Button 
                onClick={editingMenu ? handleUpdateMenu : handleCreateMenu} 
                variant="contained" 
                color="primary" 
                sx={{ fontWeight: 600, borderRadius: 2 }}
              >
                {editingMenu ? 'Update Menu' : 'Create Menu'}
              </Button>
              
              {editingMenu && (
                <Button 
                  onClick={cancelEdit} 
                  variant="outlined" 
                  color="secondary" 
                  sx={{ borderRadius: 2 }}
                >
                  Cancel
                </Button>
              )}
            </CardActions>
          </CardContent>
        </Card>
      </Fade>
      
      <Typography variant="h5" fontWeight={600} mb={2} color="primary.main">
        Existing Menus
      </Typography>
      
      {loading ? (
        <Box display="flex" alignItems="center" gap={2} py={4}>
          <CircularProgress color="primary" />
          <Typography>Loading...</Typography>
        </Box>
      ) : error ? (
        <Typography color="error" py={2}>{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {menus.map((menu) => (
            <Grid item xs={12} sm={6} md={4} key={menu.id}>
              <Fade in timeout={500}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    borderRadius: 3, 
                    transition: 'box-shadow 0.3s', 
                    ':hover': { boxShadow: 8 } 
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} color="secondary.main">
                      {menu.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {menu.items?.length || 0} items
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ gap: 1, justifyContent: 'flex-end' }}>
                    <IconButton color="primary" onClick={() => startEdit(menu)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteMenu(menu.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}