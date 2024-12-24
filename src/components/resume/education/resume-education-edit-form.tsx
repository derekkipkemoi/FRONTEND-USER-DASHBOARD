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

interface EducationItem {
  id: string; // Add id field to education item
  school: string;
  gradeAchieved?: string;
  startDate: string; // Ensure this is a valid date
  endDate?: string; // Optional field
  studyingHere: boolean;
  description?: string;
}

interface ResumeEducationEditFormProps {
  onCancelEditEducation: () => void; // Updated prop name
  educationItem?: EducationItem; // Prop for existing education item
}

export const ResumeEducationEditForm: React.FC<ResumeEducationEditFormProps> = ({
  onCancelEditEducation, // Updated prop name
  educationItem,
}) => {
  const { checkSession } = useUser();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const initialValues = {
    school: educationItem?.school || '',
    gradeAchieved: educationItem?.gradeAchieved || '',
    startDate: educationItem?.startDate || '',
    endDate: educationItem?.endDate || undefined,
    studyingHere: educationItem?.studyingHere || false,
    description: educationItem?.description || '',
  };

  const { control, handleSubmit, setError, watch, setValue, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: 'onTouched', // Display errors when a field is touched
  });

  const studyingHere = watch('studyingHere');

  // Watch all form fields to detect changes
  const formValues = watch();

  // Check if form values are different from initial values
  const isFormChanged = React.useMemo(() => {
    return JSON.stringify(formValues) !== JSON.stringify(initialValues);
  }, [formValues, initialValues]);

  const submitEducation = React.useCallback(async (values: Values): Promise<void> => {
    setIsPending(true); // Set pending state to true

    try {
      const userId = localStorage.getItem('id'); // Assuming the user ID is stored in localStorage
      const educationId = educationItem?.id; // Assuming the ID of the education item to be updated
      console.log("educationId", educationId);
      if (!userId || !educationId) {
        throw new Error('User ID or education ID not found');
      }

      // Call the update function from authClient
      const response = await authClient.updateEducation(educationId, {
        id: educationId,
        school: values.school,
        gradeAchieved: values.gradeAchieved,
        startDate: values.startDate,
        endDate: values.studyingHere ? undefined : values.endDate,
        studyingHere: values.studyingHere,
        description: values.description,
      });

      if (response.error) {
        setError('root', { message: response.error });
        return;
      }

      // Optionally handle successful response if needed
      console.log('Education updated successfully', response.data);
      await checkSession?.();
      onCancelEditEducation(); // Close the edit form after successful submission
    } catch (error) {
      setError('root', { message: 'Failed to update education' });
      console.error('Error updating education:', error);
    } finally {
      setIsPending(false); // Set pending state to false
    }
  }, [checkSession, setError, educationItem]);

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
            <InputLabel shrink>Job Description</InputLabel>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    theme="snow"
                    onChange={field.onChange}
                    value={field.value}
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
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', }}>
              <Button variant="outlined" sx={{borderRadius:"25px"}} color="error" onClick={onCancelEditEducation}>
                Close
              </Button>
              <Button
                variant="contained"
                color="success"
                type="submit"
                sx={{borderRadius:"25px"}}
                disabled={!isFormChanged}
              >
                Save Education
              </Button>
            </Box>
          </Grid>

        </Grid>
      </form>
    </Box>
  );
};
