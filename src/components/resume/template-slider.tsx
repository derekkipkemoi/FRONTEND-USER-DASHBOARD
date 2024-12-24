import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { type OrderTemplateType } from '@/types/order'; // Adjust the import path
import { orderClient } from '@/lib/order/client';

import { Templates, type Template } from './templates';

export function TemplatesSlider() {
  const [orderTemplate, setOrderT] = useState<OrderTemplateType | null>(null); // Access the orderT atom and setter
  const [savedTemplate, setSavedT] = useState<OrderTemplateType | null>(null);
  const [index, setIndex] = useState(0);
  const [enlargedTemplate, setEnlargedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false); // New state for loading
  const [saved, setSaved] = useState(false); // New state for success
  const [successMessage, setSuccessMessage] = useState<string>(''); // New state for success message
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const orderId = localStorage.getItem('orderId');
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (enlargedTemplate) {
      const img = new Image();
      img.src = enlargedTemplate.url;
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
    }
  }, [enlargedTemplate]);

  const itemsPerPage = isSmallScreen ? 1 : isMediumScreen ? 2 : 3;
  const totalItems = Templates.length;

  const handlePrevious = () => {
    setIndex((prevIndex) => (prevIndex - itemsPerPage + totalItems) % totalItems);
  };

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + itemsPerPage) % totalItems);
  };

  const handleSelectTemplate = (template: Template) => {
    // Set the template details in the global state
    setOrderT({
      name: template.templateName,
      url: template.url,
      description: template.description,
    });
  };

  const handleDeselectTemplate = () => {
    setOrderT({
      name: '',
      url: '',
      description: '',
    });
  };

  const handleEnlargeTemplate = (template: Template) => {
    setEnlargedTemplate(template);
  };

  const handleCloseEnlargeTemplate = () => {
    setEnlargedTemplate(null);
  };

  const handleSaveTemplate = async () => {
    setLoading(true); // Start loading
    setSaved(false); // Reset saved state
    setSuccessMessage(''); // Reset success message
    if (orderId) {
      const { message, data } = await orderClient.saveAddedTemplate(orderId, orderTemplate!);
      console.log(message);
      if (data && message === 'Order template saved successfully') {
        setSaved(true); // Set success state when saved
        setSuccessMessage('Saving Tamplate'); // Set success message
        setTimeout(() => {
          setSaved(false); // Reset saved state after 3 seconds
          setLoading(false); // Stop loading
          setOrderT({
            name: '',
            url: '',
            description: '',
          });
          setSavedT(data);
          setSuccessMessage(''); // Reset success message after 3 seconds
        }, 2000);
      }
    }
  };

  const displayedItems = Templates.slice(index, index + itemsPerPage).concat(
    Templates.slice(0, Math.max(0, index + itemsPerPage - totalItems))
  );

  return (
    <div>
      {orderTemplate?.url ? (
        <Box sx={{ textAlign: 'center', position: 'relative', display: 'inline-block' }}>
          <Typography variant="h6" sx={{ color: successMessage ? 'success.main' : 'initial' }}>
            {successMessage || 'Selected Template'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              display: 'inline-block',
              backgroundColor: 'primary.main',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '24px',
              marginRight: '8px',
            }}
          >
            {orderTemplate.name}
          </Typography>
          <IconButton
            color="error"
            onClick={handleDeselectTemplate}
            sx={{
              position: 'absolute',
              top: '70%',
              right: '-7px',
              transform: 'translateY(-50%)',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Button
            variant="contained"
            color="success"
            onClick={handleSaveTemplate}
            sx={{
              position: 'absolute',
              top: '70%',
              right: '-184px',
              transform: 'translateY(-50%)',
              borderRadius: '24px',
              padding: '5px 15px',
              '&:hover': {
                backgroundColor: 'success.dark',
              },
            }}
          >
            Save Selected Template
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white', marginLeft: 2 }} />
            ) : saved ? (
              <CheckCircleIcon sx={{ color: 'white', marginLeft: 2 }} />
            ) : null}
          </Button>
        </Box>
      ) : null}

      <Box sx={{ position: 'relative', padding: '16px' }}>
        {savedTemplate ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                padding: '5px 10px',
              }}
            >
              Saved Template
            </Typography>
            <Typography
              variant="h6"
              sx={{
                padding: '5px 24px',
                marginBottom: '5px',
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: '15px',
                boxShadow: 2,
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '1.25rem',
              }}
            >
              {savedTemplate.name}
            </Typography>
          </Box>
        ) : (
          ''
        )}
        <Grid container spacing={2} justifyContent="center">
          {displayedItems.map((template: Template, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box
                sx={{
                  position: 'relative',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  textAlign: 'center',
                  boxShadow: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    padding: '8px 0',
                    backgroundColor: orderTemplate?.name === template.templateName ? 'primary.main' : '#f5f5f5',
                    color: orderTemplate?.name === template.templateName ? 'white' : 'primary.main',
                  }}
                >
                  {template.templateName}
                </Typography>

                <Divider sx={{ backgroundColor: 'primary.main', height: '2px' }} />
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={template.url}
                    alt={template.templateName}
                    style={{ width: '60%', height: 'auto', margin: '0 auto' }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: '25px',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => {
                      handleSelectTemplate(template);
                    }}
                  >
                    Select Template
                  </Button>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      color: 'white',
                      backgroundColor: 'gray',
                      '&:hover': {
                        color: 'white',
                        backgroundColor: 'primary.main',
                      },
                    }}
                    onClick={() => {
                      handleEnlargeTemplate(template);
                    }}
                  >
                    <ZoomInIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ backgroundColor: 'primary.main', height: '2px' }} />
                <Typography variant="body2" sx={{ padding: '8px 16px' }}>
                  {template.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <IconButton
          onClick={handlePrevious}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '-24px',
            transform: 'translateY(-50%)',
            zIndex: 1,
            color: 'white',
            backgroundColor: 'primary.main',
            border: '1px solid #ccc',
            borderRadius: '50%',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'white',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          color="primary"
          onClick={handleNext}
          sx={{
            position: 'absolute',
            top: '50%',
            right: '-24px',
            transform: 'translateY(-50%)',
            zIndex: 1,
            color: 'white',
            backgroundColor: 'primary.main',
            border: '1px solid #ccc',
            borderRadius: '50%',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'white',
            },
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      {/* Modal for image enlargement */}
      {enlargedTemplate ? (
        <Modal
          open={Boolean(enlargedTemplate)}
          onClose={handleCloseEnlargeTemplate}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '100%',
              maxHeight: '100%',
              overflowY: 'auto',
              boxShadow: 24,
            }}
            style={{
              width: imageSize.width,
              height: imageSize.height,
            }}
          >
            <IconButton
              sx={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'primary.main',
                color: 'white',
              }}
              onClick={handleCloseEnlargeTemplate}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={enlargedTemplate.url}
              alt={enlargedTemplate.templateName}
              sx={{
                width: '100%',
                height: 'auto',
              }}
            />
          </Box>
        </Modal>
      ) : null}
    </div>
  );
}
