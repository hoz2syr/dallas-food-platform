"use client";



import React, { useState, useEffect } from 'react';
import { getState, updateQuantity, removeItem, clear } from '../../lib/cart/cart-store';
import { placeOrder } from '../../lib/api/order-api';
import { useRouter } from 'next/navigation';
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
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartState = {
  items: CartItem[];
  total: number;
};

export default function CartPage() {
  const theme = useTheme();
  const [cart, setCart] = useState<CartState>({ items: [], total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => { setCart(getState()); }, []);
  const refresh = () => { setCart(getState()); };
  const handleUpdate = async (id: string, qty: number) => {
    if (qty < 0) return;
    try {
      setUpdatingId(id); setError(null);
      if (qty === 0) { await handleRemove(id); return; }
      updateQuantity(id, qty); refresh();
      setShowSuccess(true); setTimeout(() => setShowSuccess(false), 1000);
    } catch (e: any) { setError(e?.message || String(e)); }
    finally { setUpdatingId(null); }
  };
  const handleRemove = async (id: string) => {
    try { setRemovingId(id); setError(null); await new Promise(resolve => setTimeout(resolve, 300)); removeItem(id); refresh(); }
    catch (e: any) { setError(e?.message || String(e)); }
    finally { setRemovingId(null); }
  };
  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your entire cart?')) return;
    try { setError(null); clear(); refresh(); } catch (e: any) { setError(e?.message || String(e)); }
  };
  const handlePlaceOrder = async () => {
    setError(null); setLoading(true);
    try {
      const items: string[] = [];
      cart.items.forEach((it) => { for (let i = 0; i < it.quantity; i++) { items.push(it.id); } });
      const order = await placeOrder(items); clear(); refresh(); router.push(`/orders/${order.id}?status=${encodeURIComponent(order.status)}`);
    } catch (e: any) { setError(e?.message || 'Failed to place order. Please try again.'); }
    finally { setLoading(false); }
  };
  const calculateSubtotal = () => cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const calculateTax = () => calculateSubtotal() * 0.08;
  const calculateDeliveryFee = () => { const subtotal = calculateSubtotal(); if (subtotal === 0) return 0; if (subtotal >= 50) return 0; return 5.99; };
  const calculateTotal = () => calculateSubtotal() + calculateTax() + calculateDeliveryFee();
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography variant="h3" fontWeight={700} mb={2} color="primary.main">Shopping Cart</Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        {itemCount === 0 ? 'Your cart is empty' : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`}
      </Typography>
      <Fade in={!!error} timeout={400} unmountOnExit>
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>
      </Fade>
      <Fade in={showSuccess} timeout={400} unmountOnExit>
        <Alert severity="success" sx={{ mb: 2 }}>Cart updated</Alert>
      </Fade>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {cart.items.length === 0 ? (
              <Card elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Typography color="text.secondary">No items in your cart.</Typography>
              </Card>
            ) : cart.items.map((item) => (
              <Fade in timeout={400} key={item.id}>
                <Card elevation={2} sx={{ borderRadius: 3, transition: 'box-shadow 0.3s', ':hover': { boxShadow: 8 }, opacity: removingId === item.id ? 0.5 : 1 }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box flex={1}>
                      <Typography fontWeight={600}>{item.name}</Typography>
                      <Typography color="text.secondary">${item.price.toFixed(2)}</Typography>
                    </Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton size="small" color="primary" onClick={() => handleUpdate(item.id, item.quantity - 1)} disabled={item.quantity <= 1 || updatingId === item.id}><RemoveIcon /></IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton size="small" color="primary" onClick={() => handleUpdate(item.id, item.quantity + 1)} disabled={updatingId === item.id}><AddIcon /></IconButton>
                    </Stack>
                    <IconButton color="error" onClick={() => handleRemove(item.id)} disabled={removingId === item.id}><DeleteIcon /></IconButton>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 3, p: 2, position: 'sticky', top: 32 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2} color="secondary.main">Order Summary</Typography>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between"><Typography>Subtotal</Typography><Typography>${calculateSubtotal().toFixed(2)}</Typography></Box>
                <Box display="flex" justifyContent="space-between"><Typography>Tax (8%)</Typography><Typography>${calculateTax().toFixed(2)}</Typography></Box>
                <Box display="flex" justifyContent="space-between"><Typography>Delivery</Typography><Typography>${calculateDeliveryFee().toFixed(2)}</Typography></Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between" fontWeight={700}><Typography>Total</Typography><Typography>${calculateTotal().toFixed(2)}</Typography></Box>
              </Stack>
            </CardContent>
            <CardActions sx={{ flexDirection: 'column', gap: 1 }}>
              <Button onClick={handlePlaceOrder} variant="contained" color="primary" fullWidth sx={{ fontWeight: 600, borderRadius: 2 }} disabled={cart.items.length === 0 || loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
              </Button>
              <Button onClick={handleClearCart} variant="outlined" color="secondary" fullWidth sx={{ borderRadius: 2 }} disabled={cart.items.length === 0}>Clear Cart</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
