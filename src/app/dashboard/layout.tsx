'use client';

import * as React from 'react';
import { WhatsApp } from '@mui/icons-material'; // Or you can import a WhatsApp icon from another library
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import IconButton from '@mui/material/IconButton';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/dashboard/layout/main-nav';
import { SideNav } from '@/components/dashboard/layout/side-nav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <SideNav />
        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
          <MainNav />
          <main>
            <Container maxWidth="xl" sx={{ py: '24px' }}>
              {children}
            </Container>
          </main>
        </Box>

        {/* WhatsApp Floating Icon */}
        <Box
          sx={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            zIndex: 1200,
          }}
        >
          <IconButton
            color="primary"
            onClick={() => window.open('https://wa.me/+254718845857', '_blank')} // Replace with your WhatsApp number
            sx={{
              backgroundColor: 'green',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkgreen',
              },
            }}
          >
            <WhatsApp />
          </IconButton>
        </Box>
      </Box>
    </AuthGuard>
  );
}
