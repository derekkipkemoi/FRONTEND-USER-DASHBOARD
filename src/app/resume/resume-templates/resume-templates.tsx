'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Divider, Grid, LinearProgress, Stack, Typography } from '@mui/material';

import { paths } from '@/paths';
import { TemplatesSlider } from '@/components/resume/template-slider';

const ResumeTemplates = () => {
  const router = useRouter();
  const [isPending, setIspending] = React.useState(false);
  return (
    <Stack>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          Select a template of your choice (Optional)
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          You can choose one or our writer will choose for you
        </Typography>
        <Divider sx={{ borderColor: 'primary.main' }} />
        {isPending && <LinearProgress sx={{ width: '100%' }} />}
        <Grid item lg={12} md={12} xs={12} paddingTop={2}>
          <TemplatesSlider />
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingTop: '15px' }}>
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
            onClick={() => {
              router.push(paths.resume.resumeSections);
            }}
          >
            Previous
          </Button>

          <Button
            variant="contained"
            onClick={async () => {
              setIspending(true);
              router.push(paths.resume.additionalServices);
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
      </Box>
    </Stack>
  );
};

export default ResumeTemplates;
