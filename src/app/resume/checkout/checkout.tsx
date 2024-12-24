'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';

import { type OrderObjectType } from '@/types/order';
import { orderClient, type PaymentRequestSTK } from '@/lib/order/client';

import 'intasend-inlinejs-sdk';

import { type User } from '@/types/user';
import { authClient } from '@/lib/auth/client';

import OrderDetailsModal from './order-details-modal';
import SecurePaymentBadge from './secureBadge';

declare global {
  interface Window {
    IntaSend: any;
  }
}

function CheckoutForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const orderId = localStorage.getItem('orderId');
  const [order, setOrder] = useState<OrderObjectType | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const checkout = async () => {
    if (!order?.package) return;
    if (!user) return;
    const amount = Math.floor(Number(order.package.price));
    const paymentRequest: PaymentRequestSTK = {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      host: 'https://yourwebsite.com', // You can set this as needed
      amount, // Amount should be fetched or calculated as per your business logic
      phone_number: user.phone,
      api_ref: 'test', // Provide a dynamic API ref as needed
      redirect_url: 'http://localhost:3000/resume/thankyou', // Redirect URL after payment
    };
    setIsPending(true);

    const { paymentUrl } = await orderClient.requestMpesaSTKPaymentasync(paymentRequest);
    if (paymentUrl) {
      router.push(paymentUrl);
    }
  };

  useEffect(() => {
    // Fetch order data
    const fetchOrder = async () => {
      if (orderId) {
        const { data } = await orderClient.getOrder(orderId);
        const returned = await authClient.getUser();
        if (returned.data) {
          setUser(user || returned.data);
        }
        setOrder(data || null);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  const formatDate = (dateString: Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd');
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (!order) return null; // Guard clause to ensure `order` is loaded

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
        Payment and checkout
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Confirm payment and checkout to complete your order.
      </Typography>
      {isPending ? <LinearProgress sx={{ width: '100%' }} /> : null}
      <Divider sx={{ height: '3px', borderColor: 'primary.main', mb: 2 }} />

      <Grid container justifyContent="center">
        {/* User Details Section */}
        <Grid xs={12} md={4} paddingTop={1.5}>
          <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardHeader
              title="Payment Details"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: '10px 10px 0 0',
                padding: '16px 24px',
              }}
            />
            <CardContent>
              <Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    disabled
                    label="First Name"
                    variant="outlined"
                    defaultValue={user?.firstName}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    disabled
                    label="Last Name"
                    variant="outlined"
                    defaultValue={user?.lastName}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    disabled
                    label="Phone Number"
                    variant="outlined"
                    defaultValue={user?.phone}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Email"
                    variant="outlined"
                    defaultValue={user?.email}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Divider Line for Larger Screens */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { xs: 'none', md: 'block' },
            mx: 4,
            height: 'auto',
            alignSelf: 'stretch',
            borderWidth: 1,
          }}
        />

        {/* Order Details Section */}
        <Grid xs={12} md={4} paddingTop={1.5}>
          <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardHeader
              title="Order Details"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: '10px 10px 0 0',
                padding: '16px 24px',
              }}
            />
            <CardContent>
              <Grid container>
                <Grid item xs={12} container justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">ORDER NAME</Typography>
                  <Typography variant="body2" sx={{ mb: 0 }}>
                    {order.package.title}
                  </Typography>
                </Grid>
                <Divider variant="middle" sx={{ width: '100%', paddingTop: 1 }} />
                <Grid item xs={12} container justifyContent="space-between" alignItems="center" paddingTop={2}>
                  <Typography variant="subtitle1">ORDER DATE</Typography>
                  <Typography variant="body2" sx={{ mb: 0 }}>
                    {formatDate(order.date)}
                  </Typography>
                </Grid>
                <Divider variant="middle" sx={{ width: '100%', paddingTop: 1 }} />
                <Grid item xs={12} container justifyContent="space-between" alignItems="center" paddingTop={2}>
                  <Typography variant="subtitle1">ORDER STATUS</Typography>
                  <Typography variant="body2" sx={{ mb: 0 }}>
                    {order.status}
                  </Typography>
                </Grid>
                <Divider variant="middle" sx={{ width: '100%', paddingTop: 1 }} />
                <Grid item xs={12} container justifyContent="space-between" alignItems="center" paddingTop={2}>
                  <Typography variant="subtitle1">ORDER PRICE</Typography>
                  <Typography variant="h6" sx={{ mb: 0, color: 'primary.main' }}>
                    <span style={{ marginRight: '8px' }}>{order.package.currency.symbol}</span>
                    {order.package.price}
                  </Typography>
                </Grid>
                <Divider variant="middle" sx={{ width: '100%', paddingTop: 1 }} />
                <Grid item xs={12} container justifyContent="center" paddingTop={3.5} paddingBottom={4}>
                  <Button variant="outlined" color="secondary" onClick={handleOpen}>
                    View More Order Details
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Checkout Button Section */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        {isPending ? <LinearProgress sx={{ width: '100%' }} /> : null}
        <Divider sx={{ my: 2, borderWidth: 1 }} />

        <Button
          onClick={checkout}
          className="intaSendPayButton"
          variant="contained"
          size="large"
          sx={{
            backgroundColor: 'warning.main',
            color: 'black',
            borderRadius: '25px',
            '&:hover': {
              backgroundColor: 'warning.dark',
            },
          }}
        >
          Proceed To Pay
        </Button>
      </Box>
      <OrderDetailsModal open={open} handleClose={handleClose} order={order} />
      <SecurePaymentBadge />
    </Box>
  );
}

export default CheckoutForm;
