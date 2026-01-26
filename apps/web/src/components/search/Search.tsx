"use client";

import React, { useEffect, useState, useRef } from 'react';
import { fetchMenus } from '../../lib/api/menu-api';

type Item = { id: string; name: string; price: number };

function levenshtein(a: string, b: string) {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchMenus()
      .then((menus: any) => {
        if (!mounted) return;
        const items = menus.flatMap((m: any) => m.items || []).map((it: any) => ({ id: it.id, name: it.name, price: it.price }));
        setAllItems(items);
      })
      .catch(() => setAllItems([]));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const q = normalize(query);
    // substring matches first
    const substring = allItems.filter(it => normalize(it.name).includes(q));
    // fuzzy matches by levenshtein distance
    const fuzzy = allItems
      .map(it => ({ it, d: levenshtein(normalize(it.name), q) }))
      .filter(x => x.d <= Math.max(1, Math.floor(q.length * 0.4)))
      .sort((a, b) => a.d - b.d)
      .map(x => x.it);

    const merged: Item[] = [];
    const add = (it: Item) => { if (!merged.find(m => m.id === it.id)) merged.push(it); };
    substring.slice(0, 6).forEach(add);
    fuzzy.slice(0, 6).forEach(add);

    setSuggestions(merged.slice(0, 8));
    setOpen(merged.length > 0);
  }, [query, allItems]);

  const onSelect = (it: Item) => {
    setQuery(it.name);
    setOpen(false);
    // Optionally navigate to item or trigger other actions
  };

  return (
    <div ref={ref} className="search-root search-root--spacing">
      <input
        aria-label="Search menu"
        placeholder="Search menu..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (suggestions.length) setOpen(true); }}
        className="search-input"
      />
      {open && (
        <div className="search-dropdown">
          {suggestions.map((s) => (
            <div key={s.id} onClick={() => onSelect(s)} className="search-suggestion">
              <div className="search-suggestion__title">{s.name}</div>
              <div className="search-suggestion__price">${s.price}</div>
            </div>
          ))}
          {suggestions.length === 0 && <div className="search-noresults">No results</div>}
        </div>
      )}
    </div>
  );
}
