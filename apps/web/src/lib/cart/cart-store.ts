import { Cart, CartItem } from '../../types/cart.types';

const state: Cart = { items: [], total: 0 };

function computeTotal(items: CartItem[]) {
  return items.reduce((s, it) => s + it.price * it.quantity, 0);
}

export function getState(): Cart {
  // return a shallow copy to avoid accidental mutation
  return { items: state.items.map((i) => ({ ...i })), total: state.total };
}

export function addItem(item: Omit<CartItem, 'quantity'>, quantity = 1) {
  if (quantity <= 0) throw new Error('Quantity must be positive');
  const found = state.items.find((i) => i.id === item.id);
  if (found) {
    found.quantity += quantity;
  } else {
    state.items.push({ ...item, quantity });
  }
  state.total = computeTotal(state.items);
}

export function removeItem(id: string) {
  const idx = state.items.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error('Item not found');
  state.items.splice(idx, 1);
  state.total = computeTotal(state.items);
}

export function updateQuantity(id: string, quantity: number) {
  if (quantity < 0) throw new Error('Quantity cannot be negative');
  const found = state.items.find((i) => i.id === id);
  if (!found) throw new Error('Item not found');
  if (quantity === 0) {
    removeItem(id);
    return;
  }
  found.quantity = quantity;
  state.total = computeTotal(state.items);
}

export function clear() {
  state.items = [];
  state.total = 0;
}
