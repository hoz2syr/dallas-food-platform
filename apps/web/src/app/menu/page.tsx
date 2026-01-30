"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { fetchMenus } from '../../lib/api/menu-api';
import { addItem } from '../../lib/cart/cart-store';

type Item = { 
  id: string; 
  name: string; 
  price: number; 
  image?: string;
  description?: string;
  category?: string;
  tags?: string[];
  isPopular?: boolean;
  isNew?: boolean;
};

type Category = {
  id: string;
  name: string;
  icon: string;
  count: number;
};

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'popular', label: 'Most Popular' },
];

export default function MenuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Filters and sorting
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  // UI states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchMenus()
      .then((menus) => {
        if (!mounted) return;
        const all = menus.flatMap((m: any) => m.items || []);
        const mappedItems = all.map((it: any) => ({ 
          id: it.id, 
          name: it.name, 
          price: it.price, 
          image: it.image,
          description: it.description || 'Delicious dish prepared with fresh ingredients',
          category: it.category || 'Other',
          tags: it.tags || [],
          isPopular: it.isPopular || false,
          isNew: it.isNew || false,
        }));
        setItems(mappedItems);
        // Set price range based on actual items
        if (mappedItems.length > 0) {
          const prices = mappedItems.map((item: Item) => item.price);
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      })
      .catch((err: any) => setError(err?.message || String(err)))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  // Extract unique categories
  const categories: Category[] = useMemo(() => {
    if (items.length === 0) return [];
    const categoryMap = new Map<string, number>();
    items.forEach(item => {
      const cat = item.category || 'Other';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    });
    const cats = Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon: getCategoryIcon(name),
      count,
    }));
    return [
      { id: 'all', name: 'All Items', icon: '🍽️', count: items.length },
      ...cats,
    ];
  }, [items]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];
    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(item => 
        item.category?.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      );
    }
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    // Price range filter
    result = result.filter(item => 
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );
    // Sorting
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
  }, [items, selectedCategory, searchQuery, sortBy, priceRange]);

  const handleAddToCart = async (item: Item) => {
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
      <div className="menu-page">
        <div className="menu-loading">
          <div className="loading-spinner-large" />
          <h2>Loading Our Delicious Menu...</h2>
          <p>Preparing something special for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-page">
        <div className="menu-error-state">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button 
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      {/* Header */}
      <div className="menu-header">
        <div className="menu-header-content">
          <h1 className="menu-title">Our Menu</h1>
          <p className="menu-subtitle">
            Discover {items.length} carefully crafted dishes
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="menu-controls">
        <div className="menu-controls-row">
          {/* Search */}
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search dishes, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="sort-box">
            <label htmlFor="sort-select" className="visually-hidden">
              Sort menu items
            </label>
            <select 
              id="sort-select"
              aria-label="Sort menu items"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="menu-categories">
        <div className="categories-scroll">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
              <span className="category-count">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="menu-results-info">
        <p>
          Showing <strong>{filteredAndSortedItems.length}</strong> of{' '}
          <strong>{items.length}</strong> items
        </p>
        {(searchQuery || selectedCategory !== 'all') && (
          <button 
            className="clear-filters-btn"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Menu Items */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="menu-empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No items found</h3>
          <p>Try adjusting your filters or search query</p>
          <button 
            className="btn-primary"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            View All Items
          </button>
        </div>
      ) : (
        <div className={`menu-items ${viewMode}`}>
          {filteredAndSortedItems.map((item) => (
            <div 
              key={item.id} 
              className={`menu-item-card ${viewMode}-view`}
            >
              {/* Badges */}
              <div className="item-badges">
                {item.isNew && <span className="badge badge-new">New</span>}
                {item.isPopular && <span className="badge badge-popular">Popular</span>}
              </div>
              {/* Image */}
              <div className="item-image-container">
                <img
                  src={item.image || '/images/food-placeholder.png'}
                  alt={item.name}
                  className="item-image"
                  loading="lazy"
                />
                <div className="item-image-overlay">
                  <button
                    className="quick-view-btn"
                    onClick={() => alert(`Quick view for: ${item.name}`)}
                  >
                    Quick View
                  </button>
                </div>
              </div>
              {/* Content */}
              <div className="item-content">
                <div className="item-header">
                  <h3 className="item-name">{item.name}</h3>
                  <span className="item-price">${item.price.toFixed(2)}</span>
                </div>
                {item.description && (
                  <p className="item-description">{item.description}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="item-tags">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="item-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {/* Actions */}
                <div className="item-actions">
                  <button
                    className={`add-to-cart-btn ${addingToCart === item.id ? 'adding' : ''}`}
                    onClick={() => handleAddToCart(item)}
                    disabled={addingToCart === item.id}
                  >
                    {addingToCart === item.id ? (
                      <>
                        <span className="btn-spinner" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button 
                    className="item-favorite-btn"
                    aria-label="Add to favorites"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button (if needed) */}
      {filteredAndSortedItems.length > 0 && filteredAndSortedItems.length < items.length && (
        <div className="menu-load-more">
          <button className="btn-secondary btn-large">
            Load More Items
          </button>
        </div>
      )}
    </div>
  );
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
