import React from 'react';
import { Box, Link, Typography } from '@mui/material';

const SecurePaymentBadge: React.FC = () => {
  return (
    <Box display="block" textAlign="center" padding={2}>
      <Link href="https://intasend.com/security" target="_blank">
        <img
          src="https://intasend-prod-static.s3.amazonaws.com/img/trust-badges/intasend-trust-badge-no-mpesa-hr-dark.png"
          alt="IntaSend Secure Payments (PCI-DSS Compliant)"
          style={{
            width: '100%',
            maxWidth: '375px', // Ensure image doesn't stretch too large
            height: 'auto',
          }}
        />
      </Link>
      <Typography
        variant="body2"
        sx={{
          marginTop: '0.6em',
          fontSize: { xs: '0.7em', sm: '0.8em' }, // Smaller font size on mobile
          color: '#fafafa',
        }}
      >
        <Link
          href="https://intasend.com/security"
          target="_blank"
          sx={{
            color: '#fafafa',
            textDecoration: 'none',
          }}
        >
          Secured by IntaSend Payments
        </Link>
      </Typography>
    </Box>
  );
};

export default SecurePaymentBadge;
