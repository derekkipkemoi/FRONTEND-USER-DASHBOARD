'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, LinearProgress, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';

import { type OrderObjectType } from '@/types/order';
import { paths } from '@/paths';
import { orderClient } from '@/lib/order/client';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AllOrders } from '@/components/dashboard/overview/AllOrders';
import { CompletedOrders } from '@/components/dashboard/overview/completedOrders';
import { InprogressOrders } from '@/components/dashboard/overview/inprogressOrders';
import { LatestOrders } from '@/components/dashboard/overview/latest-latest';

export default function Page(): React.JSX.Element {
  const router = useRouter();
  const [orders, setOrders] = React.useState<OrderObjectType[]>([]);
  const [completedOrders, setCompletedOrders] = React.useState<OrderObjectType[]>([]);
  const [inProgressOrders, setInProgressOrders] = React.useState<OrderObjectType[]>([]);
  const [inRevisionOrders, setInRevisionOrders] = React.useState<OrderObjectType[]>([]);
  const [isPending, setIspending] = React.useState(false);

  // Fetch order details
  const fetchOrder = async () => {
    setIspending(true);
    const { data } = await orderClient.getUserOrders();
    if (data) {
      setIspending(false);
      setOrders(data); // data is now guaranteed to be an array
    }
  };

  React.useEffect(() => {
    fetchOrder();
  }, []);

  React.useEffect(() => {
    // Filter completed and in-progress orders based on the status
    const completed = orders.filter((order) => order.status === 'Complete');
    const inProgress = orders.filter((order) => order.status === 'InProgress');
    const inRevision = orders.filter((order) => order.status === 'Revision');

    setCompletedOrders(completed);
    setInProgressOrders(inProgress);
    setInRevisionOrders(inRevision);
  }, [orders]); // Run this whenever orders change

  const updateHappened = (updated: boolean) => {
    if (updated) {
      fetchOrder();
    }
  };

  return (
    <AuthGuard>
      <Stack>
        <Stack spacing={2}>
          {isPending && <LinearProgress />}
          <Button
            onClick={() => {
              router.push(paths.resume.resumePricing);
            }}
            variant="contained"
          >
            Order High Quality CV & Cover Letter Now
          </Button>
        </Stack>
        <Grid container>
          <Grid lg={3} sm={6} xs={12} padding={1.5}>
            {' '}
            {/* Added item prop */}
            <AllOrders label="All Orders" sx={{ height: '100%' }} value={orders.length.toString()} />
          </Grid>
          <Grid lg={3} sm={6} xs={12} padding={1.5}>
            {' '}
            {/* Added item prop */}
            <CompletedOrders
              label="Completed Orders"
              sx={{ height: '100%' }}
              value={completedOrders.length.toString()}
            />
          </Grid>
          <Grid lg={3} sm={6} xs={12} padding={1.5}>
            {' '}
            {/* Added item prop */}
            <InprogressOrders
              label="Orders In Progress"
              sx={{ height: '100%' }}
              value={inProgressOrders.length.toString()}
            />
          </Grid>
          <Grid lg={3} sm={6} xs={12} padding={1.5}>
            {' '}
            {/* Added item prop */}
            <InprogressOrders
              label="Orders In Revision"
              sx={{ height: '100%' }}
              value={inRevisionOrders.length.toString()}
            />
          </Grid>
          <Grid lg={12} md={12} xs={12} padding={1.5}>
            {' '}
            {/* Added item prop */}
            <LatestOrders updateHappened={updateHappened} orders={orders} title="All Orders" />
          </Grid>
        </Grid>
      </Stack>
    </AuthGuard>
  );
}
