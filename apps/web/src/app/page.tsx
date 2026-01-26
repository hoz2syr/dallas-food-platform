"use client";

import React, { useEffect, useState } from 'react';
import { addItem } from '../lib/cart/cart-store';
import { fetchMenus } from '../lib/api/menu-api';
import { useLang } from '../lib/lang/lang-context';

type Item = { id: string; name: string; price: number; image?: string; };


const sliderImages = [
  '/images/slider1.jpg',
  '/images/slider2.jpg',
  '/images/slider3.jpg',
];

const t = {
  ar: {
    seasonal: 'عروض موسمية وأطباق مميزة',
    categories: [
      { name: 'مشاوي', icon: '🍖' },
      { name: 'مقبلات', icon: '🥗' },
      { name: 'مشروبات', icon: '🥤' },
    ],
    features: [
      { icon: '🚚', title: 'توصيل سريع', desc: 'توصيل خلال 30 دقيقة لكل المناطق.' },
      { icon: '💳', title: 'دفع آمن', desc: 'خيارات دفع إلكتروني ونقدي آمنة.' },
      { icon: '🥬', title: 'مكونات طازجة', desc: 'نستخدم أفضل المكونات يومياً.' },
    ],
    reviews: [
      { name: 'سارة', text: 'أفضل تجربة طلب طعام! أطباق لذيذة وتوصيل سريع.' },
      { name: 'محمد', text: 'خدمة ممتازة وجودة عالية. أنصح به.' },
    ],
    menuTitle: 'أصناف مختارة من قائمتنا',
    loading: 'جاري تحميل القائمة...',
    noItems: 'لا توجد أصناف متاحة حالياً.',
    addToCart: 'أضف إلى السلة',
    reviewsTitle: 'آراء العملاء',
    rights: 'جميع الحقوق محفوظة',
    restaurant: 'مطعم دالاس',
  },
  en: {
    seasonal: 'Seasonal offers & featured dishes',
    categories: [
      { name: 'Grills', icon: '🍖' },
      { name: 'Appetizers', icon: '🥗' },
      { name: 'Drinks', icon: '🥤' },
    ],
    features: [
      { icon: '🚚', title: 'Fast Delivery', desc: 'Delivery within 30 minutes to all areas.' },
      { icon: '💳', title: 'Secure Payment', desc: 'Safe electronic and cash payment options.' },
      { icon: '🥬', title: 'Fresh Ingredients', desc: 'We use the best ingredients daily.' },
    ],
    reviews: [
      { name: 'Sarah', text: 'Best food ordering experience! Delicious dishes and fast delivery.' },
      { name: 'Mohamed', text: 'Excellent service and high quality. Highly recommended.' },
    ],
    menuTitle: 'Featured Menu Items',
    loading: 'Loading menu...',
    noItems: 'No items available.',
    addToCart: 'Add to cart',
    reviewsTitle: 'Customer Reviews',
    rights: 'All rights reserved',
    restaurant: 'Dallas Restaurant',
  },
};

export default function HomePage() {
  const { lang } = useLang();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sliderIdx, setSliderIdx] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => setSliderIdx((i) => (i + 1) % sliderImages.length), 3500);
    return () => clearInterval(interval);
  }, []);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const tr = t[lang];

  return (
    <div className="home-root" dir={dir} lang={lang === 'ar' ? 'ar' : 'en'}>
      {/* Slider */}
      <div className="home-slider">
        <img src={sliderImages[sliderIdx]} alt={tr.seasonal} className="home-slider-img" />
        <div className="home-slider-caption">
          {tr.seasonal}
        </div>
      </div>

      {/* Categories */}
      <div className="home-categories">
        {tr.categories.map((cat) => (
          <div key={cat.name} className="home-category">
            <div className="home-category-icon">{cat.icon}</div>
            <div>{cat.name}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="home-features">
        {tr.features.map((f) => (
          <div key={f.title} className="home-feature">
            <div className="home-feature-icon">{f.icon}</div>
            <div className="home-feature-title">{f.title}</div>
            <div className="home-feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Menu Preview */}
      <div className="home-menu-preview">
        <h2 className="home-menu-title">{tr.menuTitle}</h2>
        {loading ? <div>{tr.loading}</div> : error ? <div className="home-menu-error">{error}</div> : (
          <div className="home-menu-grid">
            {items.slice(0, 6).map((it) => (
              <div key={it.id} className="home-menu-item">
                <div className="home-menu-item-imgbox">
                  <img src={it.image || '/images/food-placeholder.png'} alt={it.name} className="home-menu-item-img" />
                </div>
                <div className="home-menu-item-name">{it.name}</div>
                <div className="home-menu-item-price">${it.price}</div>
                <button
                  className="btn btn-primary add-to-cart-btn"
                  onClick={() => addItem({ id: it.id, name: it.name, price: it.price })}
                >
                  {tr.addToCart}
                </button>
              </div>
            ))}
          </div>
        )}
        {items.length === 0 && !loading && <div className="home-menu-noitems">{tr.noItems}</div>}
      </div>

      {/* Reviews */}
      <div className="home-reviews">
        <h3 className="home-reviews-title">{tr.reviewsTitle}</h3>
        <div className="home-reviews-list">
          {tr.reviews.map((r, i) => (
            <div key={i} className="home-review">
              <div className="home-review-name">{r.name}</div>
              <div className="home-review-text">{r.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div>{tr.rights} &copy; {new Date().getFullYear()} {tr.restaurant}</div>
        <div className="social-links">
          <a href="#" className="social-link" aria-label="Facebook">f</a>
          <a href="#" className="social-link" aria-label="Twitter">t</a>
          <a href="#" className="social-link" aria-label="Instagram">i</a>
        </div>
      </footer>
    </div>
  );
}
