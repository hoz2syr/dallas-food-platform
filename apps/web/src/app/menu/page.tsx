"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { fetchMenus } from '../../lib/api/menu-api';
import { addItem } from '../../lib/cart/cart-store';
import { MenuItem, Menu } from '../../types/api/menu.types';
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
  Chip,
  CircularProgress,
  Fade,
  IconButton
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Define sort options
const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'popular', label: 'Most Popular' },
];

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// Helper function to get category icon
function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    'grills': '🍖',
    'appetizers': '🥗',
    'drinks': '🥤',
    'desserts': '🍰',
    'pizza': '🍕',
    'pasta': '🍝',
    'burgers': '🍔',
    'seafood': '🦐',
    'salads': '🥗',
    'soups': '🍲',
    'sandwiches': '🥪',
    'breakfast': '🍳',
    'coffee': '☕',
    'other': '🍽️',
  };
  const key = category.toLowerCase().replace(/\s+/g, '');
  return iconMap[key] || '🍽️';
}

const MenuPage: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadMenus() {
      setLoading(true);
      const menus: Menu[] = await fetchMenus();
      // Flatten all menu items and add category from menu name
      const allItems: MenuItem[] = [];
      menus.forEach((menu: Menu) => {
        if (menu.items) {
          menu.items.forEach((item: MenuItem) => {
            allItems.push({ ...item, category: menu.name });
          });
        }
      });
      setItems(allItems);

      // Extract categories from items
      const cats: Record<string, Category> = {};
      allItems.forEach((item: MenuItem) => {
        const cat = item.category || 'Other';
        const key = cat.toLowerCase().replace(/\s+/g, '');
        if (!cats[key]) {
          cats[key] = {
            id: key,
            name: cat,
            icon: getCategoryIcon(cat),
            count: 0,
          };
        }
        cats[key].count += 1;
      });
      setCategories([
        { id: 'all', name: 'All', icon: '🍽️', count: allItems.length },
        ...Object.values(cats),
      ]);
      setLoading(false);
    }
    loadMenus();
  }, []);

  const filteredAndSortedItems = useMemo(() => {
    let result = items;
    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(item => {
        const cat = item.category || 'Other';
        return cat.toLowerCase().replace(/\s+/g, '') === selectedCategory;
      });
    }
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }
    // Sorting
    result = [...result];
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popular':
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        default:
          return 0;
      }
    });
    return result;
  }, [items, selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = async (item: MenuItem) => {
    try {
      setAddingToCart(item.id);
      addItem({ id: item.id, name: item.name, price: item.price });
      // Simulate brief animation
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" fontWeight={700} color="primary.main" mb={1}>Our Menu</Typography>
        <Typography color="text.secondary">Discover {items.length} carefully crafted dishes</Typography>
      </Box>
      {/* Search and Filters Bar */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={3} alignItems="center">
        <TextField
          placeholder="Search dishes, ingredients..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          size="small"
          sx={{ minWidth: 220, flex: 1 }}
          InputProps={{
            endAdornment: searchQuery && (
              <Button onClick={() => setSearchQuery('')} size="small">×</Button>
            )
          }}
        />
        <TextField
          id="sort-select"
          select
          label="Sort by"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          size="small"
          SelectProps={{ native: true, inputProps: { title: 'Sort by', 'aria-label': 'Sort by', id: 'sort-select' } }}
          sx={{ minWidth: 160 }}
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </TextField>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            color="secondary"
            onClick={() => setViewMode('grid')}
            sx={{ minWidth: 0, px: 2 }}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            color="secondary"
            onClick={() => setViewMode('list')}
            sx={{ minWidth: 0, px: 2 }}
          >
            List
          </Button>
        </Stack>
      </Stack>
      {/* Categories */}
      <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
        {categories.map((category: Category) => (
          <Chip
            key={category.id}
            label={`${category.icon} ${category.name} (${category.count})`}
            color={selectedCategory === category.id ? 'primary' : 'default'}
            onClick={() => setSelectedCategory(category.id)}
            sx={{ fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
          />
        ))}
      </Stack>
      {/* Results Info */}
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <Typography>
          Showing <b>{filteredAndSortedItems.length}</b> of <b>{items.length}</b> items
        </Typography>
        {(searchQuery || selectedCategory !== 'all') && (
          <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} size="small" color="secondary">Clear Filters</Button>
        )}
      </Box>
      {/* Menu Items */}
      {filteredAndSortedItems.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h5" mb={2}>No items found</Typography>
          <Typography color="text.secondary" mb={2}>Try adjusting your filters or search query</Typography>
          <Button variant="contained" color="primary" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>View All Items</Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredAndSortedItems.map((item) => (
            <Grid item xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 4 : 12} key={item.id}>
              <Fade in timeout={400}>
                <Card elevation={3} sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.3s', ':hover': { boxShadow: 8 } }}>
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={item.image || '/images/food-placeholder.png'}
                      alt={item.name}
                      style={{ width: '100%', height: 180, objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                      loading="lazy"
                    />
                    <Stack direction="row" spacing={1} position="absolute" top={8} left={8}>
                      {item.isNew && <Chip label="New" color="success" size="small" />}
                      {item.isPopular && <Chip label="Popular" color="warning" size="small" />}
                    </Stack>
                  </Box>
                  <CardContent sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="h6" fontWeight={700}>{item.name}</Typography>
                      <Typography color="secondary.main" fontWeight={600}>${item.price.toFixed(2)}</Typography>
                    </Stack>
                    {item.description && (
                      <Typography color="text.secondary" fontSize={15} mb={1}>{item.description}</Typography>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                        {item.tags.slice(0, 3).map((tag: string, idx: number) => (
                          <Chip key={idx} label={tag} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleAddToCart(item)}
                      disabled={addingToCart === item.id}
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                      {addingToCart === item.id ? 'Adding...' : 'Add to Cart'}
                    </Button>
                    <IconButton color="secondary" aria-label="Add to favorites">
                      <FavoriteBorderIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}
      {/* Load More Button (if needed) */}
      {filteredAndSortedItems.length > 0 && filteredAndSortedItems.length < items.length && (
        <Box textAlign="center" mt={4}>
          <Button variant="outlined" color="secondary" size="large">Load More Items</Button>
        </Box>
      )}
    </Box>
  );
};

export default MenuPage;
