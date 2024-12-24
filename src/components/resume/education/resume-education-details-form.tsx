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

// Define Zod schema for education details
const schema = zod
  .object({
    school: zod.string().min(1, { message: 'School name is required' }),
    gradeAchieved: zod.string().optional(),
    startDate: zod
      .string()
      .refine((date) => dayjs(date, 'YYYY-MM-DD', true).isValid(), { message: 'Invalid start date' }),
    endDate: zod
      .string()
      .optional()
      .refine((date) => date === undefined || dayjs(date, 'YYYY-MM-DD', true).isValid(), { message: 'Invalid end date' }),
    studyingHere: zod.boolean(),
    description: zod.string().optional(),
  })
  .refine((data) => data.studyingHere || data.endDate !== undefined, {
    message: 'End date is required if not currently studying',
    path: ['endDate'],
  })
  .refine((data) => !data.endDate || dayjs(data.startDate).isBefore(data.endDate), {
    message: 'Start date must be before end date',
    path: ['endDate'],
  });

type Values = zod.infer<typeof schema>;

interface ResumeEducationDetailsFormProps {
  onCancelEducation: () => void;
}

export const ResumeEducationDetailsForm: React.FC<ResumeEducationDetailsFormProps> = ({
  onCancelEducation,
}) => {
  const { checkSession } = useUser();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const { control, handleSubmit, setError, watch, setValue, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      school: '',
      gradeAchieved: '',
      startDate: '',
      endDate: undefined,
      studyingHere: false,
      description: '',
    },
    mode: 'onTouched', // Display errors when a field is touched
  });

  const studyingHere = watch('studyingHere');

  const submitEducation = React.useCallback(async (values: Values): Promise<void> => {
    setIsPending(true); // Set pending state to true

    // Post the data to your API or backend service
    const { error } = await authClient.addEducation(values);

    if (error) {
      setError('root', { type: 'server', message: error });
      setIsPending(false);
      return;
    }

    await checkSession?.();
    setIsPending(false); // Set pending state to false
    onCancelEducation();
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

      <form onSubmit={handleSubmit(submitEducation)}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth required>
              <InputLabel>School Name</InputLabel>
              <Controller
                name="school"
                control={control}
                render={({ field }) => (
                  <OutlinedInput {...field} label="School Name" error={Boolean(errors.school)} />
                )}
              />
              {errors.school ? <FormHelperText error>{errors.school.message}</FormHelperText> : null}
            </FormControl>
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Grade Achieved</InputLabel>
              <Controller
                name="gradeAchieved"
                control={control}
                render={({ field }) => (
                  <OutlinedInput {...field} label="Grade Achieved" error={Boolean(errors.gradeAchieved)} />
                )}
              />
              {errors.gradeAchieved ? <FormHelperText error>{errors.gradeAchieved.message}</FormHelperText> : null}
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
                      value={studyingHere ? null : field.value ? dayjs(field.value) : null}
                      onChange={(date) => { field.onChange(date ? date.format('YYYY-MM-DD') : ''); }}
                      disabled={studyingHere}
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
              name="studyingHere"
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
                  label="Currently Studying Here"
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel shrink>Description</InputLabel>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter summary of your studies"
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
              {errors.description ? <FormHelperText error>{errors.description.message}</FormHelperText> : null}
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button variant="outlined" color="error" sx={{borderRadius:"25px"}} onClick={onCancelEducation}>Close</Button>
              <Button variant="contained" color="success" sx={{borderRadius:"25px"}} type="submit">Save Education</Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
