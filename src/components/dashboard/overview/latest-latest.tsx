'use client';

import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import RevisionIcon from '@mui/icons-material/DriveFileRenameOutline';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import UploadIcon from '@mui/icons-material/Upload';
import Visibility from '@mui/icons-material/Visibility';
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import dayjs from 'dayjs';

import { type OrderFileType, type OrderObjectType } from '@/types/order';
import { orderClient } from '@/lib/order/client';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface LatestOrdersProps {
  orders: OrderObjectType[] | null;
  updateHappened: (updated: boolean) => void;
  title: string;
}

export function LatestOrders({ orders, updateHappened, title }: LatestOrdersProps): React.JSX.Element {
  const [selectedOrder, setSelectedOrder] = React.useState<OrderObjectType | null>(null);
  const [open, setOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = React.useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = React.useState(false); // State for revision modal
  const [uploading, setUploading] = React.useState(false);
  const [status, setStatus] = React.useState('Pending');
  const [file, setFile] = React.useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [orderToDelete, setOrderToDelete] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);
  const [selectedDownloadFile, setSelectedDownloadFile] = React.useState<string>('');
  const completedFiles = selectedOrder?.completedFiles ?? [];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDownloadFile(event.target.value);
  };

  const handleRevisionOpen = (order: OrderObjectType) => {
    setSelectedOrder(order);
    setRevisionModalOpen(true);
  };

  const handleRevisionClose = () => {
    setRevisionModalOpen(false);
  };

  const handleRevisionSubmit = async () => {
    if (selectedOrder) {
      setIsPending(true);
      const { message } = await orderClient.updateOrderStatus(selectedOrder.id, 'Revision');
      if (message) {
        updateHappened(true);
        setIsPending(false);
        setRevisionModalOpen(false);
      }
    }
  };

  const handleView = (order: OrderObjectType) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleEditOpen = async (order: OrderObjectType) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
  };

  const handleEditSubmit = async () => {
    if (selectedOrder) {
      setIsPending(true);
      const { message } = await orderClient.updateOrderStatus(selectedOrder.id, status);
      if (message) {
        updateHappened(true);
        setIsPending(false);
        setEditModalOpen(false);
      }
    }
  };

  const handleUploadOpen = (order: OrderObjectType) => {
    setSelectedOrder(order);
    setUploadSuccess(false);
    setUploadModalOpen(true);
  };

  const handleUploadClose = () => {
    setUploadModalOpen(false);
  };

  const handleFileUpload = async () => {
    if (!file) return;
    setUploading(true);
    setIsPending(false);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('description', 'User resume file');
    if (file) {
      const { message } = await orderClient.uploadedCompletedFile(selectedOrder!.id, formData);
      if (message) {
        updateHappened(true); // Notify that the resume was successfully uploaded
        setIsPending(false);
        setUploading(false);
        setUploadSuccess(true);
        setFile(null);
      }
    }
  };

  const handleDownloadOpen = (order: OrderObjectType) => {
    setSelectedOrder(order);
    console.log('Order Selected', order);
    setDownloadModalOpen(true);
  };

  const handleDownloadClose = () => {
    setDownloadModalOpen(false);
  };

  const confirmDownload = async () => {
    setIsPending(true);
    console.log('File Name', selectedDownloadFile);
    const { fileUrl } = await orderClient.downloadCompletedFile(selectedOrder!.id, selectedDownloadFile);
    if (fileUrl) {
      updateHappened(true);
      setIsPending(false);
      setDownloadModalOpen(false);
      setSelectedOrder(null);
      window.open(fileUrl, '_blank');
    }
  };

  const handleDelete = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsPending(true);
    const { message } = await orderClient.deleteOrder(orderToDelete!);
    if (message) {
      updateHappened(true);
      setIsPending(false);
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'gray';
      case 'InProgress':
        return 'warning.main';
      case 'Complete':
        return 'success.main';
      case 'Revision':
        return 'warning.main';
      default:
        return 'default';
    }
  };

  const renderIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) {
      return <PictureAsPdfIcon />;
    } else if (fileName.endsWith('.docx')) {
      return <DescriptionIcon />;
    }
    return null; // Return null if there's no match
  };

  return (
    <>
      <Card>
        <CardHeader title={title} />
        <Divider />
        <List>
          {orders && orders.length > 0 ? (
            <List>
              {orders.map((order, index) => {
                const shortenedId = order.id.slice(-10); // Shorten order ID to last 10 digits
                return (
                  <ListItem divider={index < orders.length - 1} key={order.id} sx={{ alignItems: 'flex-start' }}>
                    <ListItemAvatar>
                      <Box
                        component="img"
                        src="/assets/cv.png"
                        sx={{ borderRadius: 1, height: '40px', width: '40px' }}
                      />
                    </ListItemAvatar>
                    <Grid container direction="column" sx={{ marginLeft: 0 }}>
                      <Grid item xs={12}>
                        <Typography component="span" variant="body1" sx={{ color: '#4e36f5', display: 'inline' }}>
                          {order.package.title}
                          <Chip
                            label={order.status}
                            size="small"
                            sx={{
                              padding: 0,
                              marginLeft: '5px',
                              color: 'white',
                              backgroundColor: getStatusColor(order.status),
                            }}
                          />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemText
                          primary={shortenedId}
                          primaryTypographyProps={{ variant: 'subtitle1' }}
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EventIcon fontSize="small" sx={{ marginRight: 1 }} />
                              {dayjs(order.date).format('MMM D, YYYY')}
                            </Box>
                          }
                          secondaryTypographyProps={{ variant: 'body2' }}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Order">
                          <IconButton
                            onClick={() => {
                              handleView(order);
                            }}
                            color="primary"
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              handleDownloadOpen(order);
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Request Revision">
                          {order.status === 'Complete' ? (
                            <IconButton
                              color="primary"
                              onClick={() => {
                                handleRevisionOpen(order);
                              }}
                            >
                              <RevisionIcon />
                            </IconButton>
                          ) : (
                            <div />
                          )}
                        </Tooltip>
                        {/* <Tooltip title="Edit">
                          <IconButton color="primary" onClick={() => handleEditOpen(order)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip> */}
                        {/* <Tooltip title="Upload">
                          <IconButton color="primary" onClick={() => handleUploadOpen(order)}>
                            <UploadIcon />
                          </IconButton>
                        </Tooltip> */}
                        <Tooltip title="Delete">
                          {order.status === 'Complete' || order.status === 'Pending Payment' ? (
                            <IconButton
                              color="error"
                              onClick={() => {
                                handleDelete(order.id);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          ) : (
                            <div />
                          )}
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography sx={{ padding: 4 }} variant="body1">
              No orders available
            </Typography>
          )}
        </List>
        <Divider />
      </Card>

      {/* Order Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="order-modal-title"
        aria-describedby="order-modal-description"
      >
        <Box sx={style}>
          <Grid container justifyContent="flex-end">
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
          {selectedOrder ? (
            <>
              <Typography id="order-modal-title" variant="h6" component="h2">
                Order Details
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
                    <TableRow>
                      <TableCell>
                        <strong>Field</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Details</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>Order ID</strong>
                      </TableCell>
                      <TableCell>{selectedOrder.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Has Cover Letter</strong>
                      </TableCell>
                      <TableCell>{selectedOrder.requireCoverLetter ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Has LinkedIn Optimization</strong>
                      </TableCell>
                      <TableCell>{selectedOrder.requireLinkedInOptimization ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell>{selectedOrder.status}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Template</strong>
                      </TableCell>
                      <TableCell>{selectedOrder.template ? selectedOrder.template.name : 'No Template'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Uploaded File</strong>
                      </TableCell>
                      <TableCell>{selectedOrder.resume ? selectedOrder.resume.name : 'No Files Uploaded'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Complete Files</strong>
                      </TableCell>
                      <TableCell>
                        <strong>{selectedOrder.completedFiles.length}</strong>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Date</strong>
                      </TableCell>
                      <TableCell>{dayjs(selectedOrder.date).format('MMM D, YYYY')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : null}
        </Box>
      </Modal>

      {/* Edit Status Modal */}
      <Modal
        open={editModalOpen}
        onClose={handleEditClose}
        aria-labelledby="edit-status-modal-title"
        aria-describedby="edit-status-modal-description"
      >
        <Box sx={style}>
          {isPending ? <LinearProgress sx={{ width: '100%' }} /> : null}
          <Grid container justifyContent="flex-end">
            <IconButton onClick={handleEditClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Typography id="edit-status-modal-title" variant="h6" component="h2">
            Edit Order Status
          </Typography>
          <Grid container direction="column" spacing={2} sx={{ mt: 2 }}>
            <Grid item>
              <Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                fullWidth
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="InProgress">In Progress</MenuItem>
                <MenuItem value="Revision">Revision</MenuItem>
                <MenuItem value="Complete">Complete</MenuItem>
              </Select>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleEditSubmit} fullWidth>
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* File Upload Modal */}
      <Modal
        open={uploadModalOpen}
        onClose={handleUploadClose}
        aria-labelledby="upload-modal-title"
        aria-describedby="upload-modal-description"
      >
        <Box sx={style}>
          {isPending ? <LinearProgress sx={{ width: '100%' }} /> : null}
          <Grid container justifyContent="flex-end">
            <IconButton onClick={handleUploadClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Typography id="upload-modal-title" variant="h6" component="h2">
            Upload File
          </Typography>
          <Grid container direction="column" spacing={2} sx={{ mt: 2 }}>
            <Grid item>
              <input
                type="file"
                onChange={(e) => {
                  setFile(e.target.files ? e.target.files[0] : null);
                }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFileUpload}
                fullWidth
                disabled={uploading || !file}
              >
                {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload File'}
              </Button>
            </Grid>
            {uploadSuccess !== null && (
              <Grid item>
                <Typography color={uploadSuccess ? 'green' : 'red'}>
                  {uploadSuccess ? 'File uploaded successfully!' : null}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Modal>

      {/* Download Modal */}
      <Modal
        open={downloadModalOpen}
        onClose={handleDownloadClose}
        aria-labelledby="download-modal-title"
        aria-describedby="download-modal-description"
      >
        <Box sx={style}>
          {isPending ? <LinearProgress sx={{ width: '100%' }} /> : null}
          <Grid container justifyContent="flex-end">
            <IconButton onClick={handleDownloadClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
          {completedFiles.length > 0 ? (
            <div>
              <Typography id="download-modal-title" variant="h6" component="h2">
                Select file to download
              </Typography>
              <Divider sx={{ my: 2 }} />
              <RadioGroup value={selectedDownloadFile} onChange={handleChange}>
                {completedFiles.map((item: OrderFileType, index: number) => (
                  <FormControlLabel
                    key={index}
                    value={item.fileStorageName} // Assuming the name is unique, or use another unique identifier
                    control={<Radio />}
                    label={
                      <>
                        {item.name}{' '}
                        {item.name.endsWith('.pdf') || item.name.endsWith('.docx')
                          ? renderIcon(item.name)
                          : item.description}
                      </>
                    }
                  />
                ))}
              </RadioGroup>
            </div>
          ) : (
            <Typography id="download-modal-title" variant="h6" component="h2">
              No file available for download
            </Typography>
          )}

          <Grid container direction="column" spacing={2} sx={{ mt: 2 }}>
            <Grid item>
              <Button
                variant="contained"
                color="success"
                disabled={!selectedDownloadFile}
                onClick={confirmDownload} // Simulate download action
                fullWidth
              >
                Confirm Download
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Request Revision Modal */}
      <Modal
        open={revisionModalOpen}
        onClose={handleRevisionClose}
        aria-labelledby="revision-modal-title"
        aria-describedby="revision-modal-description"
      >
        <Box sx={style}>
          {isPending ? <LinearProgress sx={{ width: '100%' }} /> : null}
          <Grid container justifyContent="flex-end">
            <IconButton onClick={handleRevisionClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
          {selectedOrder ? (
            <>
              <Typography id="revision-modal-title" variant="h6" component="h2">
                Request Revision
              </Typography>
              <Typography id="revision-modal-description" sx={{ mt: 2 }}>
                Are you sure you want to request a revision for this order?
              </Typography>
              <Button variant="contained" color="primary" onClick={handleRevisionSubmit} sx={{ mt: 2 }} fullWidth>
                Confirm Revision Request
              </Button>
            </>
          ) : null}
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this order?</DialogContent>
        {isPending ? <LinearProgress sx={{ width: '100%' }} /> : null}
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
