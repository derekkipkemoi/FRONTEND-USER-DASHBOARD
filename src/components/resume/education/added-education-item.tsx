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

import { useUser } from '@/hooks/use-user';
import { authClient } from '@/lib/auth/client';
import DOMPurify from 'dompurify'; // Import dompurify for sanitizing HTML

// Slide transition for dialog
const Transition = React.forwardRef(function Transition(props: any, ref: React.Ref<unknown>) {
    const { children, ...other } = props;
    return <Slide direction="up" ref={ref} {...other}>{children}</Slide>;
});

interface EducationHistoryItemProps {
    onEditEducation: (item: any) => void;
}

export const EducationItem: React.FC<EducationHistoryItemProps> = ({ onEditEducation }) => {
    const { checkSession, user } = useUser();

    if (!user) {
        return null;
    }

    const education = user?.education || []

    const [currentIndex, setCurrentIndex] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEducationIndex, setSelectedEducationIndex] = useState<number | null>(null);
    const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set()); // Track expanded descriptions

    const itemsToShow = 2;
    const totalItems = education.length;
    const startIndex = currentIndex * itemsToShow;
    const endIndex = Math.min(startIndex + itemsToShow, totalItems);
    const reversedEducationHistory = [...education].reverse();
    const currentItems = reversedEducationHistory.slice(startIndex, endIndex);

    const handleNext = () => {
        if (startIndex + itemsToShow < totalItems) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleDeleteClick = (index: number) => {
        setSelectedEducationIndex(index);
        setOpenDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedEducationIndex !== null) {
            const educationHistoryId = education[selectedEducationIndex].id;
            const { error } = await authClient.deleteEducation(educationHistoryId);

            if (error) {
                console.error("Failed to delete education history:", error);
            } else {
                await checkSession?.();
            }
            setOpenDialog(false);
            setSelectedEducationIndex(null);
        }
    };

    const handleDeleteCancel = () => {
        setOpenDialog(false);
        setSelectedEducationIndex(null);
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
                currentItems.map((education, index) => {
                    const educationIndex = totalItems - 1 - (currentIndex * itemsToShow + index);
                    const isExpanded = expandedIndexes.has(educationIndex);
                    const description = education.description || '';

                    // Truncate logic for descriptions longer than 220 characters
                    const shouldTruncate = description.length > 220 && !isExpanded;

                    return (
                        <Grid item xs={12} key={educationIndex} style={{ width: '100%' }}>
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
                                                    {education.gradeAchieved}
                                                </span>
                                                <span style={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                                    at {education.school}
                                                </span>
                                                <Box display="flex" alignItems="center" style={{ marginLeft: 'auto' }}>
                                                    <IconButton
                                                        sx={{ color: 'primary.main' }}
                                                        aria-label="expand"
                                                        size="small"
                                                        onClick={() => { toggleDescription(educationIndex); }} // Toggle description expansion
                                                    >
                                                        {isExpanded ? <ExpandLess /> : <ExpandMore />} {/* Toggle expand/collapse icon */}
                                                    </IconButton>
                                                    <IconButton
                                                        sx={{ color: 'primary.main' }}
                                                        aria-label="edit"
                                                        size="small"
                                                        onClick={() => { onEditEducation(education); }} // Pass the education object to the edit function
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        sx={{ color: 'error.main' }}
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => { handleDeleteClick(educationIndex); }} // Adjust index for deletion
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Typography>
                                            <Divider style={{ margin: '4px 0' }} />

                                            <Box display="flex" alignItems="center">
                                                <Typography style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'text.secondary', marginRight: '8px' }}>
                                                    <span style={{ fontWeight: 'bold', color: 'primary' }}>From:</span>
                                                    <CalendarIcon fontSize="small" style={{ marginRight: '4px', marginLeft: '4px' }} /> {education.startDate}
                                                </Typography>
                                                {!education.studyingHere && education.endDate ? <Typography style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'text.secondary' }}>
                                                        <span style={{ fontWeight: 'bold', color: 'primary' }}>To:</span>
                                                        <CalendarIcon fontSize="small" style={{ marginRight: '4px', marginLeft: '4px' }} /> {education.endDate}
                                                    </Typography> : null}
                                                {education.studyingHere ? <Typography
                                                        sx={{ marginLeft: '8px', fontSize: '0.9rem', fontWeight: '500', color: 'success.main' }} // Adjusted to use 'success.main'
                                                    >
                                                        Currently Studying Here
                                                    </Typography> : null}
                                            </Box>

                                            <Typography variant="body2" style={{ marginTop: '4px', fontSize: '0.9rem' }}>
                                                {/* Display description with expand/collapse functionality */}
                                                {shouldTruncate ? (
                                                    <>
                                                        <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description.substring(0, 320)) }} />
                                                        <Typography
                                                            component="span"
                                                            color="primary"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => { toggleDescription(educationIndex); }} // Expand on click
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
                <Typography>No education available.</Typography>
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
                    {currentIndex * itemsToShow + 1} - {Math.min((currentIndex + 1) * itemsToShow, totalItems)} of {totalItems}
                </Typography>

                <IconButton
                    onClick={handleNext}
                    disabled={startIndex + itemsToShow >= totalItems}
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
                        Are you sure you want to delete this education history entry? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button sx={{borderRadius:"25px"}} onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button sx={{borderRadius:"25px"}} onClick={handleDeleteConfirm} color="error">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
