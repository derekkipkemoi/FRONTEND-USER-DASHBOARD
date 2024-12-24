'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

import { paths } from '@/paths';

function ResumeOptions() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleCardClick = (cardIndex: number) => {
    setSelectedCard(cardIndex);
  };

  return (
    <Stack sx={{ position: 'relative' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0, mb: 1 }}>
        Let's grab some details about you
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Select how you would like to provide your resume details
      </Typography>
      <Divider sx={{ width: '100%', height: '5px', borderColor: 'primary.main' }} />
      {pending ? (
        <LinearProgress
          sx={{
            width: '100%',
          }}
        />
      ) : null}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          my: 3,
        }}
      >
        {[0, 1].map((index) => (
          <Card
            key={index}
            sx={{
              height: '200px',
              boxShadow: 3,
              maxWidth: '400px',
              textAlign: 'center',
              transition: 'box-shadow 0.3s, transform 0.3s',
              border: '2px solid',
              borderColor: 'primary.main',
              '&:hover': {
                boxShadow: 6,
                transform: 'scale(1.02)',
              },
              backgroundColor: selectedCard === index ? 'primary.main' : 'background.paper',
              color: selectedCard === index ? 'white' : 'text.primary',
            }}
          >
            <CardActionArea
              onClick={() => {
                handleCardClick(index);
              }}
              sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 3,
                }}
              >
                <Box sx={{ marginBottom: 2 }}>
                  <img
                    src={index === 0 ? '/assets/file.png' : '/assets/edit.png'}
                    alt={index === 0 ? 'Upload Icon' : 'Scratch Icon'}
                    style={{ width: '64px', height: '64px' }}
                  />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 'bold', mb: 1, color: index === selectedCard ? 'white' : 'primary.main' }}
                >
                  {index === 0 ? 'File Upload' : 'Enter Details'}
                </Typography>
                <Typography variant="body1" sx={{ color: index === selectedCard ? 'white' : 'text.secondary' }}>
                  {index === 0
                    ? "We'll capture your details from the uploaded resume/CV document"
                    : "We'll guide you through the whole process of entering your details."}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
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
            setPending(true);
            router.push(paths.resume.resumePricing);
          }}
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            setPending(true);
            router.push(paths.resume.resumeUpload);
          }}
          disabled={selectedCard === null}
          variant="contained"
          color="primary"
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
}

export default ResumeOptions;
