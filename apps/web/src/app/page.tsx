
"use client";

import React, { useEffect, useState } from 'react';
import { addItem } from '../lib/cart/cart-store';
import { fetchMenus } from '../lib/api/menu-api';

type Item = {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
};

const sliderImages = [
  '/images/slider1.jpg',
  '/images/slider2.jpg',
  '/images/slider3.jpg',
];

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sliderIdx, setSliderIdx] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchMenus()
      .then((menus) => {
        if (!mounted) return;
        const all = menus.flatMap((m: any) => m.items || []);
        setItems(all.map((it: any) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          image: it.image,
          description: it.description
        })));
      })
      .catch((err: any) => setError(err?.message || String(err)))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const interval = setInterval(() =>
      setSliderIdx((i) => (i + 1) % sliderImages.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (item: Item) => {
    addItem({ id: item.id, name: item.name, price: item.price });
  };

  return (
    <div className="dallas-home">
      {/* Hero Section with Slider */}
      <section className="hero-section">
        <div className="hero-slider">
          {sliderImages.map((img, idx) => (
            <div
              key={idx}
              className={`hero-slide ${idx === sliderIdx ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Exceptional Dining
            <span className="hero-subtitle">Experience Excellence</span>
          </h1>
          <p className="hero-description">
            Crafted with passion, served with pride. Discover authentic flavors 
            that bring people together.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Explore Menu</button>
            <button className="btn-secondary">Order Now</button>
          </div>
        </div>
        {/* Slider Navigation */}
        <div className="slider-dots">
          {sliderImages.map((_, idx) => (
            <button
              key={idx}
              className={`slider-dot ${idx === sliderIdx ? 'active' : ''}`}
              onClick={() => setSliderIdx(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Categories</h2>
            <p className="section-subtitle">Explore our diverse selection</p>
          </div>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">🍖</div>
              <h3 className="category-name">Signature Grills</h3>
              <p className="category-desc">Premium cuts cooked to perfection</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🥗</div>
              <h3 className="category-name">Fresh Starters</h3>
              <p className="category-desc">Light bites to begin your meal</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🍕</div>
              <h3 className="category-name">Wood-Fired Pizza</h3>
              <p className="category-desc">Authentic Italian style</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🍜</div>
              <h3 className="category-name">Comfort Bowls</h3>
              <p className="category-desc">Hearty and satisfying</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🍰</div>
              <h3 className="category-name">Sweet Endings</h3>
              <p className="category-desc">Decadent desserts</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🥤</div>
              <h3 className="category-name">Refreshments</h3>
              <p className="category-desc">Craft beverages & mocktails</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="menu-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Dishes</h2>
            <p className="section-subtitle">Chef's special recommendations</p>
          </div>
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading delicious options...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🍽️</span>
              <p>No items available at the moment</p>
            </div>
          ) : (
            <div className="menu-grid">
              {items.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className={`menu-card ${hoveredItem === item.id ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="menu-card-image">
                    <img
                      src={item.image || '/images/food-placeholder.png'}
                      alt={item.name}
                      loading="lazy"
                    />
                    <div className="menu-card-overlay">
                      <button
                        className="quick-add-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>
                  <div className="menu-card-content">
                    <h3 className="menu-card-name">{item.name}</h3>
                    {item.description && (
                      <p className="menu-card-description">{item.description}</p>
                    )}
                    <div className="menu-card-footer">
                      <span className="menu-card-price">${item.price.toFixed(2)}</span>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        <span className="btn-icon">+</span>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h3 className="feature-title">Fast Delivery</h3>
              <p className="feature-desc">
                Get your food delivered hot and fresh within 30 minutes or less.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <h3 className="feature-title">Secure Payment</h3>
              <p className="feature-desc">
                Multiple payment options with industry-standard encryption.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </div>
              <h3 className="feature-title">Fresh Ingredients</h3>
              <p className="feature-desc">
                Locally sourced, premium quality ingredients in every dish.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="feature-title">Quality Guaranteed</h3>
              <p className="feature-desc">
                100% satisfaction guarantee or your money back, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real reviews from real people</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">
                {'⭐'.repeat(5)}
              </div>
              <p className="testimonial-text">
                "Absolutely incredible food! The grilled steak was cooked to perfection, 
                and the delivery was lightning fast. Will definitely order again!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">S</div>
                <div className="author-info">
                  <div className="author-name">Sarah Mitchell</div>
                  <div className="author-location">Dallas, TX</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">
                {'⭐'.repeat(5)}
              </div>
              <p className="testimonial-text">
                "Best food delivery service in town! Fresh ingredients, generous portions, 
                and the customer service is top-notch. Highly recommended!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">M</div>
                <div className="author-info">
                  <div className="author-name">Michael Chen</div>
                  <div className="author-location">Irving, TX</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">
                {'⭐'.repeat(5)}
              </div>
              <p className="testimonial-text">
                "The pizza is authentic and delicious! Reminds me of my trips to Italy. 
                The wood-fired crust is perfect every time."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">E</div>
                <div className="author-info">
                  <div className="author-name">Emma Rodriguez</div>
                  <div className="author-location">Plano, TX</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Order?</h2>
            <p className="cta-description">
              Join thousands of satisfied customers and experience exceptional dining today.
            </p>
            <button className="btn-primary btn-large">
              Start Your Order
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">Dallas Restaurant</h3>
              <p className="footer-desc">
                Premium dining experiences delivered to your doorstep. 
                Quality food, exceptional service.
              </p>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="/menu">Menu</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/careers">Careers</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/shipping">Delivery Info</a></li>
                <li><a href="/returns">Returns</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Connect With Us</h4>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Dallas Restaurant. All rights reserved.</p>
            <div className="footer-legal">
              <a href="/terms">Terms of Service</a>
              <span>•</span>
              <a href="/privacy">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
