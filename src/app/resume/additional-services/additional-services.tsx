'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Divider, Grid, LinearProgress, Stack, Typography } from '@mui/material';

import { paths } from '@/paths';
import CoverLetter from '@/components/resume/cover-letter';

const AdditionalServices = () => {
  const router = useRouter();
  const [isPending, setIspending] = React.useState(false);
  return (
    <Stack>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          Do you need a Cover Letter or LinkedIn Optimization ?
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Cover Letter and LinkedIn Optimization is based on your pricing package
        </Typography>
        <Divider sx={{ borderColor: 'primary.main' }} />
        {isPending && <LinearProgress sx={{ width: '100%' }} />}
        <Grid item lg={12} md={12} xs={12} paddingTop={2}>
          <CoverLetter />
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: 2 }}>
        <Button
          variant="contained"
          sx={{
            borderRadius: '25px',
            backgroundColor: 'secondary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'secondary.dark',
            },
          }}
          onClick={() => {}}
        >
          Previous
        </Button>

        <Button
          variant="contained"
          onClick={async () => {
            setIspending(true);
            router.push(paths.resume.checkout);
          }}
          sx={{
            backgroundColor: 'warning.main',
            color: 'black',
            borderRadius: '25px',
            '&:hover': {
              backgroundColor: 'warning.dark',
            },
          }}
        >
          Next
        </Button>
      </Box>
    </Stack>
  );
};

export default AdditionalServices;
