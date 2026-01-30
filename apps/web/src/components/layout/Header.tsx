"use client";

import React from 'react';
import Search from '../search/Search';
import LangSwitcher from '../../lib/lang/lang-switcher';

export default function Header() {
  return (
    <header 
      className="app-header" 
      style={{ 
        background: 'rgba(27, 27, 27, 0.8)', 
        backdropFilter: 'blur(10px)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1100 
      }}
    >
      <nav className="app-nav">
        <a href="/">Home</a>
        <a href="/menu">Menu</a>
        <a href="/cart">Cart</a>
      </nav>
      <div className="header-controls">
        <Search />
        <LangSwitcher />
      </div>
    </header>
  );
}