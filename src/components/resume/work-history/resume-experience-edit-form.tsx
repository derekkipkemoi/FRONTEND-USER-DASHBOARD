import React from 'react';
import {
  FormControl,
  InputLabel,
  Grid,
  FormControlLabel,
  FormHelperText,
  Button,
  Box,
  LinearProgress,
  Typography,
  Checkbox,
  OutlinedInput,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { authClient } from '@/lib/auth/client'; // Import the authClient
import { useUser } from '@/hooks/use-user';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Load ReactQuill dynamically
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Define Zod schema
const schema = zod
  .object({
    employer: zod.string().min(1, { message: 'Employer name is required' }),
    jobTitle: zod.string().min(1, { message: 'Job title is required' }),
    startDate: zod
      .string()
      .refine((date) => dayjs(date, 'YYYY-MM-DD', true).isValid(), { message: 'Invalid start date' }),
    endDate: zod
      .string()
      .optional()
      .refine((date) => date === undefined || dayjs(date, 'YYYY-MM-DD', true).isValid(), { message: 'Invalid end date' }),
    workingHere: zod.boolean(),
    jobDescription: zod.string().optional(),
  })
  .refine((data) => data.workingHere || data.endDate !== undefined, {
    message: 'End date is required if not currently working',
    path: ['endDate'],
  })
  .refine((data) => !data.endDate || dayjs(data.startDate).isBefore(data.endDate), {
    message: 'Start date must be before end date',
    path: ['endDate'],
  });

type Values = zod.infer<typeof schema>;

interface WorkHistoryItem {
  id: string; // Add id field to work history item
  employer: string;
  jobTitle: string;
  startDate: string; // Ensure this is a valid date
  endDate?: string; // Optional field
  workingHere: boolean;
  jobDescription?: string;
}

interface ResumeExperienceEditFormProps {
  onCancelEditExperience: () => void; // Updated prop name
  workHistoryItem?: WorkHistoryItem; // Prop for existing work history item
}

export const ResumeExperienceEditForm: React.FC<ResumeExperienceEditFormProps> = ({
  onCancelEditExperience, // Updated prop name
  workHistoryItem,
}) => {
  const { checkSession } = useUser();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const initialValues = {
    employer: workHistoryItem?.employer || '',
    jobTitle: workHistoryItem?.jobTitle || '',
    startDate: workHistoryItem?.startDate || '',
    endDate: workHistoryItem?.endDate || undefined,
    workingHere: workHistoryItem?.workingHere || false,
    jobDescription: workHistoryItem?.jobDescription || '',
  };

  const { control, handleSubmit, setError, watch, setValue, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: 'onTouched', // Display errors when a field is touched
  });

  const workingHere = watch('workingHere');

  // Watch all form fields to detect changes
  const formValues = watch();

  // Check if form values are different from initial values
  const isFormChanged = React.useMemo(() => {
    return JSON.stringify(formValues) !== JSON.stringify(initialValues);
  }, [formValues, initialValues]);

  const submitExperience = React.useCallback(async (values: Values): Promise<void> => {
    setIsPending(true); // Set pending state to true

  

    try {
      const userId = localStorage.getItem('id'); // Assuming the user ID is stored in localStorage
      const workHistoryId = workHistoryItem?.id; // Assuming the ID of the work history item to be updated
      console.log("workHistoryId", workHistoryId)
      if (!userId || !workHistoryId) {
        throw new Error('User ID or work history ID not found');
      }

      // Call the update function from authClient
      const response = await authClient.updateWorkHistory(workHistoryId, {
        id: workHistoryId,
        employer: values.employer,
        jobTitle: values.jobTitle,
        startDate: values.startDate,
        endDate: values.workingHere ? undefined : values.endDate,
        workingHere: values.workingHere,
        jobDescription: values.jobDescription,
      });

      if (response.error) {
        setError('root', { message: response.error });
        return;
      }

      // Optionally handle successful response if needed
      console.log('Work history updated successfully', response.data);
      await checkSession?.();
      onCancelEditExperience(); // Close the edit form after successful submission
    } catch (error) {
      setError('root', { message: 'Failed to update work history' });
      console.error('Error updating work history:', error);
    } finally {
      setIsPending(false); // Set pending state to false
    }
  }, [checkSession, setError, workHistoryItem]);

  return (
    <Box sx={{ position: 'relative', padding: '16px' }}>
      {/* Show progress bar when pending */}
      {isPending ? <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', zIndex: 1000 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Submitting...
          </Typography>
          <LinearProgress />
        </Box> : null}

      <form onSubmit={handleSubmit(submitExperience)}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Employer Name</InputLabel>
              <Controller
                name="employer"
                control={control}
                render={({ field }) => (
                  <OutlinedInput {...field} label="Employer Name" error={Boolean(errors.employer)} />
                )}
              />
              {errors.employer ? <FormHelperText error>{errors.employer.message}</FormHelperText> : null}
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Job Title</InputLabel>
              <Controller
                name="jobTitle"
                control={control}
                render={({ field }) => (
                  <OutlinedInput {...field} label="Job Title" error={Boolean(errors.jobTitle)} />
                )}
              />
              {errors.jobTitle ? <FormHelperText error>{errors.jobTitle.message}</FormHelperText> : null}
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth required>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Select Start Date *"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => { field.onChange(date ? date.format('YYYY-MM-DD') : ''); }}
                      slotProps={{
                        textField: {
                          error: Boolean(errors.startDate),
                          helperText: errors.startDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Select End Date"
                      value={workingHere ? null : field.value ? dayjs(field.value) : null}
                      onChange={(date) => { field.onChange(date ? date.format('YYYY-MM-DD') : ''); }}
                      disabled={workingHere}
                      slotProps={{
                        textField: {
                          error: Boolean(errors.endDate),
                          helperText: errors.endDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <Controller
              name="workingHere"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.checked);
                        if (e.target.checked) {
                          setValue('endDate', undefined);
                        }
                      }}
                    />
                  }
                  label="Currently Working Here"
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel shrink>Job Description</InputLabel>
              <Controller
                name="jobDescription"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter summary of your job description"
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                        ['link'],
                        ['clean']
                      ]
                    }}
                    style={{ height: '190px', marginTop: '16px' }} // Adjust height as needed
                  />
                )}
              />
              {errors.jobDescription ? <FormHelperText error>{errors.jobDescription.message}</FormHelperText> : null}
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button variant="outlined" color="error" sx={{borderRadius:"25px"}} onClick={onCancelEditExperience}>Close</Button> {/* Updated prop name */}
              <Button variant="contained" color="success" sx={{borderRadius:"25px"}} type="submit" disabled={!isFormChanged}>Save Experience</Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
