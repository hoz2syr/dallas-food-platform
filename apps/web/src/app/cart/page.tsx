"use client";


import React, { useState, useEffect } from 'react';
import { getState, updateQuantity, removeItem, clear } from '../../lib/cart/cart-store';
import { placeOrder } from '../../lib/api/order-api';
import { useRouter } from 'next/navigation';
import '../../styles/cart.css';

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
  const [cart, setCart] = useState<CartState>({ items: [], total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCart(getState());
  }, []);

  const refresh = () => {
    setCart(getState());
  };

  const handleUpdate = async (id: string, qty: number) => {
    if (qty < 0) return;
    
    try {
      setUpdatingId(id);
      setError(null);
      
      if (qty === 0) {
        await handleRemove(id);
        return;
      }
      
      updateQuantity(id, qty);
      refresh();
      
      // Show brief success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      setRemovingId(id);
      setError(null);
      
      // Animate removal
      await new Promise(resolve => setTimeout(resolve, 300));
      
      removeItem(id);
      refresh();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your entire cart?')) return;
    
    try {
      setError(null);
      clear();
      refresh();
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const handlePlaceOrder = async () => {
    setError(null);
    setLoading(true);
    
    try {
      // Create array of product IDs, repeating by quantity
      const items: string[] = [];
      cart.items.forEach((it) => {
        for (let i = 0; i < it.quantity; i++) {
          items.push(it.id);
        }
      });
      
      const order = await placeOrder(items);
      clear();
      refresh();
      
      // Redirect to order confirmation
      router.push(`/orders/${order.id}?status=${encodeURIComponent(order.status)}`);
    } catch (e: any) {
      setError(e?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    if (subtotal === 0) return 0;
    if (subtotal >= 50) return 0; // Free delivery over $50
    return 5.99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateDeliveryFee();
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <div className="cart-header-content">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">
            {itemCount === 0 
              ? 'Your cart is empty' 
              : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`
            }
          </p>
        </div>
      </div>

      <div className="cart-container">
        {/* Error Message */}
        {error && (
          <div className="cart-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
            <button onClick={() => setError(null)} aria-label="Dismiss error">×</button>
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="cart-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Cart updated</span>
          </div>
        )}

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            {cart.items.length === 0 ? (
              <div className="cart-empty">
                <div className="empty-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some delicious items to get started!</p>
                <button 
                  className="btn-primary"
                  onClick={() => router.push('/menu')}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                {/* Clear Cart Button */}
                <div className="cart-actions-top">
                  <button 
                    className="clear-cart-btn"
                    onClick={handleClearCart}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Clear Cart
                  </button>
                </div>

                {/* Items List */}
                <div className="cart-items-list">
                  {cart.items.map((item) => (
                    <div 
                      key={item.id} 
                      className={`cart-item ${removingId === item.id ? 'removing' : ''}`}
                    >
                      {/* Item Image */}
                      <div className="cart-item-image">
                        <img
                          src={item.image || '/images/food-placeholder.png'}
                          alt={item.name}
                          loading="lazy"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                        
                        {/* Mobile: Price x Quantity */}
                        <div className="cart-item-mobile-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="cart-item-quantity">
                        <button
                          className="quantity-btn"
                          onClick={() => handleUpdate(item.id, item.quantity - 1)}
                          disabled={updatingId === item.id}
                          aria-label="Decrease quantity"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        
                          <input
                          type="number"
                          className="quantity-input"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            handleUpdate(item.id, Math.max(0, Math.min(99, val)));
                          }}
                          min="0"
                          max="99"
                          disabled={updatingId === item.id}
                          aria-label={`Quantity for ${item.name}`}
                          placeholder="Qty"
                        />
                        
                        <button
                          className="quantity-btn"
                          onClick={() => handleUpdate(item.id, item.quantity + 1)}
                          disabled={updatingId === item.id || item.quantity >= 99}
                          aria-label="Increase quantity"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="cart-item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>

                      {/* Remove Button */}
                      <button
                        className="cart-item-remove"
                        onClick={() => handleRemove(item.id)}
                        disabled={removingId === item.id}
                        aria-label="Remove item"
                      >
                        {removingId === item.id ? (
                          <div className="btn-spinner-small" />
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Order Summary */}
          {cart.items.length > 0 && (
            <div className="cart-summary">
              <div className="cart-summary-card">
                <h2 className="cart-summary-title">Order Summary</h2>
                
                <div className="cart-summary-details">
                  <div className="summary-row">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Tax (8%)</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span>
                      {calculateDeliveryFee() === 0 ? (
                        <span className="free-delivery">FREE</span>
                      ) : (
                        `$${calculateDeliveryFee().toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {calculateSubtotal() < 50 && calculateSubtotal() > 0 && (
                    <div className="delivery-notice">
                      Add ${(50 - calculateSubtotal()).toFixed(2)} more for free delivery!
                    </div>
                  )}
                  
                  <div className="summary-divider" />
                  
                  <div className="summary-row summary-total">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code Section */}
                <div className="promo-section">
                  <input
                    type="text"
                    className="promo-input"
                    placeholder="Enter promo code"
                  />
                  <button className="promo-btn">Apply</button>
                </div>

                {/* Checkout Button */}
                <button
                  className={`checkout-btn ${loading ? 'loading' : ''}`}
                  onClick={handlePlaceOrder}
                  disabled={loading || cart.items.length === 0}
                >
                  {loading ? (
                    <>
                      <div className="btn-spinner" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                      Proceed to Checkout
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="trust-badges">
                  <div className="trust-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>Secure Payment</span>
                  </div>
                  <div className="trust-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <span>Fast Delivery</span>
                  </div>
                </div>

                {/* Continue Shopping */}
                <button 
                  className="continue-shopping-btn"
                  onClick={() => router.push('/menu')}
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Items Section */}
        {cart.items.length > 0 && (
          <div className="suggested-items">
            <h2 className="suggested-title">You might also like</h2>
            <p className="suggested-subtitle">Complete your order with these popular items</p>
            
            <div className="suggested-grid">
              {/* Placeholder for suggested items - integrate with your menu API */}
              <div className="suggested-item">
                <div className="suggested-item-image">
                  <img src="/images/food-placeholder.png" alt="Suggested item" />
                </div>
                <div className="suggested-item-info">
                  <h4>Garlic Bread</h4>
                  <span className="suggested-item-price">$4.99</span>
                </div>
                <button
                  className="suggested-item-btn"
                  type="button"
                  aria-label="Add Garlic Bread to cart"
                  title="Add Garlic Bread to cart"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
