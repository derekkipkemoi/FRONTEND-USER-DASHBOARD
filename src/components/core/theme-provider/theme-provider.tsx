'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'; // Use MuiThemeProvider and createTheme

import { createTheme as customCreateTheme } from '@/styles/theme/create-theme'; // Assuming your custom theme creation logic

import EmotionCache from './emotion-cache';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  const theme = customCreateTheme(); // Use your custom createTheme logic

  return (
    <EmotionCache options={{ key: 'mui' }}>
      <MuiThemeProvider theme={theme}> {/* Use MuiThemeProvider instead of CssVarsProvider */}
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </EmotionCache>
  );
}
