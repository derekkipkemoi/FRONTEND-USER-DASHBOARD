'use client';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    OutlinedInput,
    FormHelperText,
    Grid,
    Checkbox,
    FormControlLabel,
    FormControl,
} from '@mui/material';
import { type OrderObjectType } from '@/types/order';
import { orderClient } from '@/lib/order/client';

function CoverLetter() {
    const [order, setOrder] = useState<OrderObjectType | null>(null);
    const [requireCoverLetter, setRequireCoverLetter] = useState<boolean>(false);
    const [coverLetterDetails, setCoverLetterDetails] = useState<string>('');
    const [requireLinkedInOptimization, setRequireLinkedInOptimization] = useState<boolean>(false);
    const [linkedInUrl, setLinkedInUrl] = useState<string>('');
    const [urlIsError, setUrlIsError] = useState<boolean>(false);
    const [coverLetterIsError, setCoverLetterIsError] = useState<boolean>(false);

    const orderId = localStorage.getItem('orderId');

    // Fetch order details
    const fetchOrder = async () => {
        if (orderId) {
            const { data } = await orderClient.getOrder(orderId);
            setOrder(data || null);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    useEffect(() => {
        if (order) {
            setRequireCoverLetter(order.requireCoverLetter || false);
            setCoverLetterDetails(order.coverLetterDetails || '');
            setRequireLinkedInOptimization(order.requireLinkedInOptimization || false);
            setLinkedInUrl(order.linkedInUrl || '');
        }
    }, [order]); // Set the state when order is fetched

    const isValidUrl = (url: string) => {
        const linkedInRegex = /^(https:\/\/www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9_-]+(\/)?$/;
        return linkedInRegex.test(url);
    };

    const onSubmit = async () => {
        console.log("Submitting:", coverLetterDetails);
        const formData = new FormData();
        let hasError = false;

        // Validate cover letter if required
        if (requireCoverLetter) {
            if (!coverLetterDetails) {
                setCoverLetterIsError(true);
                hasError = true;
            } else {
                setCoverLetterIsError(false);
                formData.append('requireCoverLetter', requireCoverLetter.toString());
                formData.append('coverLetterDetails', coverLetterDetails);
            }
        }

        // Validate LinkedIn optimization if required
        if (requireLinkedInOptimization) {
            if (!linkedInUrl || !isValidUrl(linkedInUrl)) {
                setUrlIsError(true);
                hasError = true;
            } else {
                setUrlIsError(false);
                formData.append('requireLinkedInOptimization', requireLinkedInOptimization.toString());
                formData.append('linkedInUrl', linkedInUrl);
            }
        }

        // If any error was detected, stop submission
        if (hasError) return;

        // Proceed with updating the order if no errors
        await orderClient.updateOrderExtraService(orderId!, formData);
        await fetchOrder();
    };

    // Check if there's data to save
    const isDataModified = () => {
        return (
            (requireCoverLetter !== order?.requireCoverLetter) ||
            (coverLetterDetails !== order?.coverLetterDetails) ||
            (requireLinkedInOptimization !== order?.requireLinkedInOptimization) ||
            (linkedInUrl !== order?.linkedInUrl)
        );
    };

    // Only show the "Save Changes" button if:
    // - At least one required option is selected
    // - There are changes to be saved
    const showSaveButton = (requireCoverLetter || requireLinkedInOptimization) && isDataModified();

    return (
        <form>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Additional Services
                    </Typography>
                    <Box mb={3}>
                        <FormControlLabel
                            control={
                                <Checkbox onChange={() => { setRequireLinkedInOptimization(!requireLinkedInOptimization) }} checked={requireLinkedInOptimization} />}
                            label="Yes, I Need LinkedIn Profile Optimization"
                        />
                        {
                            requireLinkedInOptimization ? <Box mt={2}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    Provide LinkedIn URL
                                </Typography>
                                <FormControl fullWidth error={Boolean(urlIsError)}>
                                    <OutlinedInput
                                        fullWidth
                                        value={linkedInUrl}
                                        onChange={(e) => {
                                            setLinkedInUrl(e.target.value)
                                        }}
                                        disabled={!requireLinkedInOptimization}
                                        name='requireLinkedInOptimization'
                                        placeholder="Enter your LinkedIn URL"
                                        sx={{ borderColor: 'primary.main' }}
                                    />
                                    {
                                        urlIsError ? <FormHelperText>Valid LinkedIn URL required</FormHelperText> : null
                                    }
                                </FormControl>
                            </Box> : null
                        }

                    </Box>
                    <Box mb={3}>
                        <FormControlLabel
                            control={<Checkbox onChange={() => { setRequireCoverLetter(!requireCoverLetter) }} checked={requireCoverLetter} />}
                            label="Yes, I Need a Cover Letter"
                        />
                        {
                            requireCoverLetter ? <Box mt={2}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    Cover Letter Details
                                </Typography>
                                <FormControl fullWidth error={Boolean(coverLetterIsError)}>
                                    <OutlinedInput
                                        fullWidth
                                        value={coverLetterDetails}
                                        onChange={(e) => {
                                            setCoverLetterDetails(e.target.value)
                                        }}
                                        multiline
                                        rows={6}
                                        name='coverLetterDetails'
                                        placeholder="Write your cover letter details here..."
                                        sx={{ borderColor: 'primary.main' }}
                                    />
                                    {
                                        coverLetterIsError ? <FormHelperText>Cover letter details are required</FormHelperText> : null
                                    }
                                </FormControl>
                            </Box> : null
                        }
                    </Box>
                    {showSaveButton ? <Grid container spacing={2} justifyContent="flex-end">
                            <Grid item>
                                <Button
                                    onClick={onSubmit}
                                    variant="contained"
                                    color="success"
                                >
                                    Save Changes
                                </Button>
                            </Grid>
                        </Grid> : null}
                </CardContent>
            </Card>
        </form>
    );
}

export default CoverLetter;
