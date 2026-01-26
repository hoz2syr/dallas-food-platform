import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>مرحباً بك في مطعم دالاس</h1>
          <p>اكتشف قائمتنا واطلب أشهى الأطباق بسهولة!</p>
          <Link href="/menu">
            <button className="cta-button">اطلب الآن</button>
          </Link>
        </div>
        <div className="hero-image">
          <img src="/images/burger.jpg" alt="Delicious Burger" />
        </div>
      </section>
      <section className="quick-links">
        <Link href="/menu">القائمة</Link>
        <Link href="/offers">العروض</Link>
        <Link href="/order-tracking">تتبع الطلب</Link>
        <Link href="/profile">الحساب</Link>
      </section>
    </div>
  );
}
