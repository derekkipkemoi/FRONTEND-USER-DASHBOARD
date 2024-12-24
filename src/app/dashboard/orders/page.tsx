'use client';

import * as React from 'react';
import { Button, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr';

import type { OrderObjectType } from '@/types/order';
import { orderClient } from '@/lib/order/client';
import { LatestOrders } from '@/components/dashboard/overview/latest-latest';

// export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const [orders, setOrders] = React.useState<OrderObjectType[]>([]);

  // Fetch order details
  const fetchOrder = async (): Promise<void> => {
    try {
      const { data } = await orderClient.getUserOrders();
      if (data) {
        setOrders(data); // data is now guaranteed to be an array
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  React.useEffect(() => {
    void fetchOrder();
  }, []);

  const updateHappened = (updated: boolean): void => {
    if (updated) {
      void fetchOrder();
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">All Orders</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button variant="contained">Order CV & Cover Letter Now!!</Button>
        </div>
      </Stack>
      <Grid container spacing={3}>
        <Grid lg={12} md={12} xs={12}>
          <LatestOrders updateHappened={updateHappened} orders={orders} title="All Orders" />
        </Grid>
      </Grid>
    </Stack>
  );
}
