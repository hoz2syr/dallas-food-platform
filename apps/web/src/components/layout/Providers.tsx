"use client";

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../../theme';
import EmotionCache from '../../theme/EmotionCache';
import { LangProvider } from '../../lib/lang/lang-context';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionCache>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LangProvider>
          {children}
        </LangProvider>
      </ThemeProvider>
    </EmotionCache>
  );
}