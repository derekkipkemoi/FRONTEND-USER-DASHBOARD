import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';
import { AuthGuard } from '@/components/auth/auth-guard';

export interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <Box
        sx={{
          display: { xs: 'flex', lg: 'grid' },
          flexDirection: 'column',
          minHeight: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
          <Box sx={{ p: 2 }}> {/* Reduced padding here */}
            <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
              <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 2 }}> {/* Reduced padding here */}
            <Box sx={{ maxWidth: '1150px', width: '100%' }}>{children}</Box>
          </Box>
        </Box>
      </Box>
    </AuthGuard>
  );
}

export default Layout;