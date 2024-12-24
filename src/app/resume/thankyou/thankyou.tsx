'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';

import { orderClient } from '@/lib/order/client';

function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect after 5 seconds
    const timeoutId = setTimeout(async () => {
      const orderId = localStorage.getItem('orderId');
      if (orderId) {
        await orderClient.updateOrderStatus(orderId, 'Pending');
        localStorage.removeItem('orderId');
        router.push('/dashboard'); // Redirect to the home page or any other desired page
      }
    }, 2500);

    // Cleanup the timeout if the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [router]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // height: '100vh',
        flexDirection: 'column',
        padding: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        Thank You For Your Purchase!
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        You will be redirected shortly.
      </Typography>

      <CircularProgress sx={{ mb: 3 }} />
    </Box>
  );
}

export default ThankYouPage;
