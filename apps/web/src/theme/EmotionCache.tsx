"use client";

import React, { useMemo } from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';

export default function EmotionCache({ children }: { children: React.ReactNode }) {
  const cache = useMemo(() => {
    const c = createCache({ key: 'mui', prepend: true });
    c.compat = true;
    return c;
  }, []);

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(' '),
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}