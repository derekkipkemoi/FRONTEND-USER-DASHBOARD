import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Modal, Typography } from '@mui/material';

import { type OrderObjectType } from '@/types/order';

interface OrderDetailsModalProps {
  open: boolean;
  handleClose: () => void;
  order: OrderObjectType | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ open, handleClose, order }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    borderRadius: '12px',
    width: '90%', // Adjust width on smaller screens
    maxWidth: '600px', // Set max width for large screens
  };

  if (!order) {
    return null; // Render nothing if the order is null
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontSize: { xs: '16px', sm: '18px', md: '20px' } }}>
            Order: {order.package.title}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ color: 'text.primary' }} />
          </IconButton>
        </Box>
        <List sx={{ padding: 0 }}>
          <ListItem sx={{ padding: '8px 0' }}>
            <ListItemIcon>
              {order.requireCoverLetter ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
            </ListItemIcon>
            <ListItemText primary="Order Has Cover Letter" />
          </ListItem>
          <ListItem sx={{ padding: '8px 0' }}>
            <ListItemIcon>
              {order.requireLinkedInOptimization ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
            </ListItemIcon>
            <ListItemText primary="Order Has LinkedIn Optimization" />
          </ListItem>
          <ListItem sx={{ padding: '8px 0' }}>
            <ListItemIcon>
              {order.resume ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
            </ListItemIcon>
            <ListItemText primary="Order Has File" />
          </ListItem>
          {order.template ? <ListItem sx={{ padding: '8px 0' }}>
              <ListItemText primary="Order Template" secondary={order.template.name} />
            </ListItem> : null}
          <ListItem sx={{ padding: '8px 0' }}>
            <ListItemText primary="Order Status" secondary={order.status} />
          </ListItem>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              ORDER REQUIREMENTS
            </Typography>
            {order.package.features.map((feature: any, index: number) => (
              <Typography variant="body2" key={index} sx={{ mb: 0 }}>
                - {feature}
              </Typography>
            ))}
          </Grid>
        </List>
      </Box>
    </Modal>
  );
};

export default OrderDetailsModal;
