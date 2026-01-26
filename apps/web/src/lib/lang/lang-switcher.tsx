"use client";

import React from 'react';
import { useLang } from './lang-context';

export default function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div style={{ marginLeft: 16 }}>
      <button
        onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        style={{ background: '#eee', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontWeight: 500 }}
      >
        {lang === 'ar' ? 'English' : 'العربية'}
      </button>
    </div>
  );
}
