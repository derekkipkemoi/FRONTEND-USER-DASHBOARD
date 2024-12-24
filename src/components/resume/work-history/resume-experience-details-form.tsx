'use client';

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
import { authClient } from '@/lib/auth/client';
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

interface ResumeExperienceDetailsFormProps {
  onCancelExperience: () => void;
}

export const ResumeExperienceDetailsForm: React.FC<ResumeExperienceDetailsFormProps> = ({
  onCancelExperience,
}) => {
  const { checkSession } = useUser();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const { control, handleSubmit, setError, watch, setValue, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      employer: '',
      jobTitle: '',
      startDate: '',
      endDate: undefined,
      workingHere: false,
      jobDescription: '',
    },
    mode: 'onTouched', // Display errors when a field is touched
  });

  const workingHere = watch('workingHere');

  const submitExperience = React.useCallback(async (values: Values): Promise<void> => {
    setIsPending(true); // Set pending state to true

    // Post the data to your API or backend service
    const { error } = await authClient.addWorkHistory(values);

    if (error) {
      setError('root', { type: 'server', message: error });
      setIsPending(false);
      return;
    }

    await checkSession?.();
    setIsPending(false); // Set pending state to false
    onCancelExperience();
  }, [checkSession, setError]);

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
              <Button variant="outlined" sx={{borderRadius:"25px"}} color="error" onClick={onCancelExperience}>Close</Button>
              <Button variant="contained"  sx={{borderRadius:"25px"}} color="success" type="submit">Save Work History</Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
