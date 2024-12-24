import React, { useContext, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    IconButton,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    Button,
} from '@mui/material';
import { CalendarToday as CalendarIcon, Delete, Edit, ExpandMore, ExpandLess , ArrowForward, ArrowBack } from '@mui/icons-material';

import { UserContext } from '@/contexts/user-context';
import { useUser } from '@/hooks/use-user';
import { authClient } from '@/lib/auth/client';
import DOMPurify from 'dompurify'; // Import dompurify for sanitizing HTML

// Slide transition for dialog
const Transition = React.forwardRef(function Transition(props: any, ref: React.Ref<unknown>) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface WorkHistoryItemProps {
    onEditExperience: (item: any) => void;
}

export const WorkHistoryItem: React.FC<WorkHistoryItemProps> = ({ onEditExperience }) => {
    const userContext = useContext(UserContext);
    const { checkSession, user } = useUser();

    if (!user) {
        return null;
    }

    const workHistory = user?.workHistory || []; // Default to an empty array if undefined
    const [currentIndex, setCurrentIndex] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null);
    const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set()); // Track expanded descriptions

    const itemsToShow = 2;
    const totalItems = workHistory.length; // Get length of workHistory directly
    const startIndex = currentIndex * itemsToShow;
    const endIndex = Math.min(startIndex + itemsToShow, totalItems);
    const currentItems = workHistory.slice(startIndex, endIndex); // No need to reverse here

    const handleNext = () => {
        if (currentIndex < Math.floor(totalItems / itemsToShow)) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleDeleteClick = (index: number) => {
        setSelectedJobIndex(index);
        setOpenDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedJobIndex !== null) {
            const workHistoryId = workHistory[selectedJobIndex].id;
            const { error } = await authClient.deleteWorkHistory(workHistoryId);

            if (error) {
                console.error("Failed to delete work history:", error);
            } else {
                await checkSession?.();
            }
            setOpenDialog(false);
            setSelectedJobIndex(null);
        }
    };

    const handleDeleteCancel = () => {
        setOpenDialog(false);
        setSelectedJobIndex(null);
    };

    const toggleDescription = (index: number) => {
        const newExpandedIndexes = new Set(expandedIndexes);
        if (newExpandedIndexes.has(index)) {
            newExpandedIndexes.delete(index);
        } else {
            newExpandedIndexes.add(index);
        }
        setExpandedIndexes(newExpandedIndexes);
    };

    return (
        <div>
            {currentItems.length > 0 ? (
                currentItems.map((job, index) => {
                    const jobIndex = currentIndex * itemsToShow + index; // Adjusted to calculate index correctly
                    const isExpanded = expandedIndexes.has(jobIndex);
                    const description = job.jobDescription || '';

                    // Truncate logic for descriptions longer than 220 characters
                    const shouldTruncate = description.length > 220 && !isExpanded;

                    return (
                        <Grid item xs={12} key={jobIndex} style={{ width: '100%' }}>
                            <Card
                                variant="outlined"
                                style={{
                                    marginBottom: '10px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    minHeight: '20px', // Set minimum height
                                }}
                            >
                                <CardContent style={{ padding: '8px' }}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: 'bold', marginRight: '4px' }}>
                                                    {job.jobTitle}
                                                </span>
                                                <span style={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                                    at {job.employer}
                                                </span>
                                                <Box display="flex" alignItems="center" style={{ marginLeft: 'auto' }}>
                                                    <IconButton
                                                        sx={{ color: 'primary.main' }}
                                                        aria-label="expand"
                                                        size="small"
                                                        onClick={() => { toggleDescription(jobIndex); }} // Toggle description expansion
                                                    >
                                                        {isExpanded ? <ExpandLess /> : <ExpandMore />} {/* Toggle expand/collapse icon */}
                                                    </IconButton>
                                                    <IconButton
                                                        sx={{ color: 'primary.main' }}
                                                        aria-label="edit"
                                                        size="small"
                                                        onClick={() => { onEditExperience(job); }} // Pass the job object to the edit function
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        sx={{ color: 'error.main' }}
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => { handleDeleteClick(jobIndex); }} // Pass the index for deletion
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Typography>
                                            <Divider style={{ margin: '4px 0' }} />

                                            <Box display="flex" alignItems="center">
                                                <Typography style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'text.secondary', marginRight: '8px' }}>
                                                    <span style={{ fontWeight: 'bold' }}>From:</span> {/* Bold "From:" label */}
                                                    <CalendarIcon fontSize="small" style={{ margin: '0 4px' }} />
                                                    {job.startDate}
                                                </Typography>
                                                {!job.workingHere && job.endDate ? <Typography style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'text.secondary', marginLeft: '8px' }}>
                                                        <span style={{ fontWeight: 'bold' }}>To:</span> {/* Bold "To:" label */}
                                                        <CalendarIcon fontSize="small" style={{ margin: '0 4px' }} />
                                                        {job.endDate}
                                                    </Typography> : null}
                                                {job.workingHere ? <Typography
                                                        sx={{ marginLeft: '8px', fontSize: '0.9rem', fontWeight: '500', color: 'success.main' }} // Adjusted to use 'success.main'
                                                    >
                                                        Currently Working Here
                                                    </Typography> : null}
                                            </Box>
                                            <Typography variant="body2" style={{ marginTop: '4px', fontSize: '0.9rem' }}>
                                                {/* Display description with expand/collapse functionality */}
                                                {shouldTruncate ? (
                                                    <>
                                                        <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description.substring(0, 220)) }} />
                                                        <Typography
                                                            component="span"
                                                            color="primary"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => { toggleDescription(jobIndex); }} // Expand on click
                                                        >
                                                            &nbsp;... Expand
                                                        </Typography>
                                                    </>
                                                ) : (
                                                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} /> // Full description when expanded or shorter than 220 chars
                                                )}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })
            ) : (
                <Typography>No work history available.</Typography>
            )}

            {/* Pagination Controls */}
            <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2}>
                <IconButton
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    sx={{ borderRadius: '50%', bgcolor: 'primary.main', color: 'white' }} // Make round and set background color
                >
                    <ArrowBack />
                </IconButton>

                <Typography variant="body2">
                    {startIndex + 1} - {Math.min(endIndex, totalItems)} of {totalItems}
                </Typography>

                <IconButton
                    onClick={handleNext}
                    disabled={endIndex >= totalItems}
                    sx={{ borderRadius: '50%', bgcolor: 'primary.main', color: 'white' }} // Make round and set background color
                >
                    <ArrowForward />
                </IconButton>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography id="alert-dialog-description">
                        Are you sure you want to delete this work history entry? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
