'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/system';

import { type CurrencyType } from '@/types/order';
import { paths } from '@/paths';
import { orderClient, type CreateOrder } from '@/lib/order/client';

interface PricingOption {
  title: string;
  price: number;
  currency: CurrencyType;
  orderRevision: number;
  description: string;
  features: string[];
  highlight: boolean;
}

// Mock function to get the user's currency and format prices
const getCurrency = () => {
  return {
    symbol: 'KES', // Kenyan Shilling for example
    rate: 1, // Conversion rate, assuming prices are already in KES
  };
};
const currency = getCurrency();

const pricingOptions = [
  {
    title: 'Standard CV Writing',
    price: 1500,
    currency,
    orderRevision: 1,
    description: 'A professional CV writing service designed to showcase your skills and experience effectively',
    features: [
      'Custom CV by a professional writer',
      'One revision round',
      'ATS optimization',
      'Download in PDF/DOCX',
      'Professional formatting',
    ],
    highlight: false,
  },
  {
    title: 'Premium CV Writing',
    price: 3000,
    currency,
    orderRevision: 3,
    description: 'A comprehensive CV and cover letter writing service tailored for career advancement.',
    features: [
      'Bespoke CV by a senior writer',
      'Three revision rounds',
      'ATS optimization',
      'Download in PDF/DOCX',
      'Professional formatting',
      'Custom cover letter',
      'Priority support',
      'LinkedIn profile optimization',
    ],
    highlight: true,
  },
  {
    title: 'Executive CV Writing',
    price: 5000,
    currency,
    orderRevision: 10,
    description: 'An elite CV writing service for executives, highlighting leadership and strategic vision.',
    features: [
      'Tailored CV by an executive writer',
      'Unlimited revisions',
      'ATS optimization',
      'Download in PDF/DOCX',
      'Professional formatting',
      'Custom cover letter',
      'Priority support',
      'LinkedIn profile optimization',
      'Executive biography',
    ],
    highlight: false,
  },
  // {
  //   title: 'Cover Letter Writing',
  //   price: 500,
  //   currency: currency,
  //   orderRevision: 1,
  //   description: 'A professionally crafted cover letter to complement your CV and enhance your job applications.',
  //   features: [
  //     'Custom cover letter by a professional writer',
  //     'One revision round',
  //     'Tailored to job applications',
  //     'Professional formatting',
  //   ],
  //   highlight: false,
  // },
  // {
  //   title: 'LinkedIn Profile Optimization',
  //   price: 1000,
  //   currency: currency,
  //   orderRevision: 1,
  //   description: 'Optimize your LinkedIn profile to attract recruiters and showcase your professional brand.',
  //   features: [
  //     'LinkedIn profile review and rewrite',
  //     'SEO optimization',
  //     'Professional formatting',
  //     'Profile image recommendations',
  //     'Custom headline and summary',
  //   ],
  //   highlight: false,
  // },
];

const StyledCard = styled(Card)<{ selected: boolean }>(({ selected }) => ({
  borderColor: selected ? 'var(--mui-palette-primary-main)' : '#e0e0e0',
  borderWidth: selected ? 3 : 3,
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  marginRight: '10px',
  marginLeft: '10px',
  backgroundColor: selected ? 'rgba(25, 118, 210, 0.05)' : '#fff',
  '&:hover': {
    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
    transform: 'scale(1.01)',
  },
}));

const PricingCard: React.FC<{ option: PricingOption; selected: boolean; onSelect: () => void }> = ({
  option,
  selected,
  onSelect,
}) => {
  const { title, price, currency, description, features, highlight } = option;
  return (
    <StyledCard variant="outlined" selected={selected} onClick={onSelect}>
      <CardContent>
        <Typography variant="h5" component="div" color={highlight ? 'primary' : 'textPrimary'}>
          {title}
        </Typography>
        <Divider sx={{ my: 1, backgroundColor: 'primary.main', height: '2px' }} />
        <Typography variant="h6" component="div" color="textSecondary" sx={{ fontWeight: 'bold', margin: '8px 0' }}>
          {currency.symbol} {price}
        </Typography>
        <Typography variant="body2" component="div" color="textSecondary" sx={{ fontWeight: 300, lineHeight: 1.6 }}>
          {description}
        </Typography>
        <ul style={{ paddingLeft: '20px', margin: '16px 0' }}>
          {features.map((feature, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <CheckCircleIcon
                sx={{
                  color: 'primary.main',
                  fontSize: '1.2rem',
                  marginRight: '8px',
                }}
              />
              <Typography variant="body2" component="div" sx={{ color: 'text.secondary' }}>
                {feature}
              </Typography>
            </li>
          ))}
        </ul>
      </CardContent>
      <Button
        variant={selected ? 'contained' : 'outlined'}
        color="primary"
        sx={{
          m: 2,
          borderRadius: '24px',
          textTransform: 'none',
          fontWeight: 'bold',
          boxShadow: selected ? '0px 4px 12px rgba(33, 150, 243, 0.4)' : 'none',
        }}
      >
        {selected ? 'Selected' : 'Select'}
      </Button>
    </StyledCard>
  );
};

const PricingCards: React.FC = () => {
  const router = useRouter();
  const [isPending, setPending] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width:1200px)');
  const isMediumScreen = useMediaQuery('(min-width:1000px) and (max-width:1199px)');

  const [scrollIndex, setScrollIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [newOrder, setNewOrder] = useState<CreateOrder | null>(null);

  const cardsPerPage = isLargeScreen ? 3 : isMediumScreen ? 2 : 1;
  const maxScrollIndex = Math.max(0, pricingOptions.length - cardsPerPage);

  const handlePrev = () => {
    setScrollIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setScrollIndex((prevIndex) => Math.min(prevIndex + 1, maxScrollIndex));
  };

  const handleSelect = (index: number) => {
    setSelectedCard(index);
    const newOrder: CreateOrder = {
      package: JSON.stringify(pricingOptions[index]),
      status: 'Pending Payment',
    };
    setNewOrder(newOrder);
  };

  const handleContinueClick = async () => {
    setPending(true);
    if (newOrder) {
      const { message } = await orderClient.createOrder(newOrder);
      if (message === 'Order created successfully') {
        router.push(paths.resume.resumeOptions);
      }
    }
  };

  return (
    <Stack sx={{ position: 'relative' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0, mb: 1 }}>
        Select your package
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Each package is tailored to meet your specific needs.
      </Typography>
      <Divider sx={{ width: '100%', height: '5px', borderColor: 'primary.main' }} />
      {isPending ? <LinearProgress sx={{ width: '100%' }} /> : null}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={handlePrev}
          disabled={scrollIndex === 0}
          sx={{
            position: 'absolute',
            left: '-24px', // Adjust the positioning if needed
            zIndex: 1,
            display: 'block',
            backgroundColor: 'primary.main', // Set background color to primary
            color: 'white', // Set icon color to white
            borderRadius: '50%', // Make it rounded
            '&:hover': {
              backgroundColor: 'primary.dark', // Darken the background color on hover
            },
            '@media (max-width: 600px)': {
              left: '-16px', // Adjust the positioning for small screens
              padding: 0, // Remove default padding
            },
          }}
        >
          <ArrowBack />
        </IconButton>

        <Grid container spacing={2} justifyContent="center">
          {pricingOptions.slice(scrollIndex, scrollIndex + cardsPerPage).map((option, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
              <PricingCard
                option={option}
                selected={selectedCard === scrollIndex + index}
                onSelect={() => {
                  handleSelect(scrollIndex + index);
                }}
              />
            </Grid>
          ))}
        </Grid>
        <IconButton
          onClick={handleNext}
          disabled={scrollIndex === maxScrollIndex}
          sx={{
            position: 'absolute',
            right: '-24px', // Adjust the positioning if needed
            zIndex: 1,
            display: 'block',
            backgroundColor: 'primary.main', // Set background color to primary
            color: 'white', // Set icon color to white
            borderRadius: '50%', // Make it rounded
            '&:hover': {
              backgroundColor: 'primary.dark', // Darken the background color on hover
            },
            '@media (max-width: 600px)': {
              right: '-16px', // Adjust the positioning for small screens
              padding: 0, // Remove default padding
            },
          }}
        >
          <ArrowForward />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'end', width: '100%', padding: 2 }}>
        <Button
          onClick={handleContinueClick}
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
};

export default PricingCards;
