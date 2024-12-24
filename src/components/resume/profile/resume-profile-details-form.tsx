'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { Controller, set, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/);

const schema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required' }),
  lastName: zod.string().min(1, { message: 'Last name is required' }),
  email: zod.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  phone: zod.string().regex(phoneRegex, { message: 'Valid phone number is required' }),
  city: zod.string().optional(),
  country: zod.string().optional(),
  professionalTitle: zod.string().optional(),
});

type Values = zod.infer<typeof schema>;

interface ResumeProfileDetailsFormProps {
  subTitle?: string;
  description?: string;
}

export const ResumeProfileDetailsForm: React.FC<ResumeProfileDetailsFormProps> = ({ subTitle, description }) => {
  const { checkSession, user } = useUser();

  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isChanged, setIsChanged] = React.useState<boolean>(false); // New state for tracking changes

  const initialValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    country: user?.country || '',
    professionalTitle: user?.professionalTitle || '',
  };

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const handleImageChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsPending(true);
      const file = event.target.files?.[0];
      if (file) {
        setSelectedImage(file);
        await authClient.uploadAvatar(file);
        await checkSession?.();
        setIsPending(false);
        setSelectedImage(null);
      }
    },
    [checkSession, selectedImage]
  );

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      const id = localStorage.getItem('id');
      if (!id) {
        setError('root', { type: 'server', message: 'User is not authenticated' });
        return;
      }

      // Check if any values have changed before proceeding
      const { email, ...valuesWithoutEmail } = values; // Exclude email from values

      const valuesWithId = { ...valuesWithoutEmail, id };
      const { error } = await authClient.updateUser(valuesWithId);
      if (error) {
        setError('root', { type: 'server', message: error });
        return;
      }
      await checkSession?.();
      setIsChanged(false);
      setIsPending(false);
    },
    [checkSession, setError, initialValues]
  );

  // Function to handle input change and update isChanged state
  const handleInputChange = () => {
    setIsChanged(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader
          subheader={description}
          title={subTitle}
          sx={{
            backgroundColor: 'primary.main', // Change background color
            color: 'white', // Text color for title
            padding: '16px', // Padding around header
            textAlign: 'center', // Center align text
            borderRadius: '8px 8px 0 0', // Rounded corners for top
            '& .MuiCardHeader-title': {
              fontSize: '1.5rem', // Increase title font size
              fontWeight: 'bold', // Make title bold
            },
            '& .MuiCardHeader-subheader': {
              fontSize: '1rem', // Subheader font size
              color: 'white', // Assign a different color to the subheader
              opacity: 0.9, // Slightly transparent subheader
            },
          }}
        />
        <Divider />
        <Divider />
        <CardContent>
          {isPending ? <LinearProgress sx={{ marginBottom: 2 }} /> : null}
          <Typography sx={{ color: 'primary.main', fontSize: 12 }}>* Indicate required</Typography>
          <Grid container>
            <Grid xs={12} md={4} display="flex" justifyContent="center" alignItems="center">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                  accept="image/*"
                  id="image-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <IconButton color="primary" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
                {selectedImage ? (
                  <Avatar
                    alt="Profile Picture"
                    src={URL.createObjectURL(selectedImage)}
                    sx={{ width: 100, height: 100, marginTop: 2 }}
                  />
                ) : (
                  <Avatar
                    alt="Default Profile Picture"
                    src={user?.avatarUrl || '/assets/user.png'}
                    sx={{ width: 100, height: 100, marginTop: 2, cursor: 'pointer' }}
                  />
                )}
                <FormHelperText style={{ textAlign: 'center', marginTop: '8px' }}>
                  Upload your profile picture (Optional).
                </FormHelperText>
              </div>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid spacing={2} container>
                <Grid item md={6} xs={12}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.firstName)}>
                        <InputLabel>First Name *</InputLabel>
                        <OutlinedInput
                          required
                          {...field}
                          label="First name"
                          onChange={(e) => {
                            field.onChange(e);
                            handleInputChange();
                          }}
                        />
                        {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.lastName)}>
                        <InputLabel>Surname *</InputLabel>
                        <OutlinedInput
                          {...field}
                          label="Last name"
                          onChange={(e) => {
                            field.onChange(e);
                            handleInputChange();
                          }}
                        />
                        {errors.lastName ? <FormHelperText>{errors.lastName.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.email)}>
                        <InputLabel>Email *</InputLabel>
                        <OutlinedInput {...field} disabled label="Email address" type="email" />
                        {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.phone)}>
                        <InputLabel>Phone *</InputLabel>
                        <OutlinedInput
                          {...field}
                          label="Phone number"
                          onChange={(e) => {
                            field.onChange(e);
                            handleInputChange();
                          }}
                        />
                        {errors.phone ? <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>City</InputLabel>
                        <OutlinedInput
                          {...field}
                          label="City"
                          onChange={(e) => {
                            field.onChange(e);
                            handleInputChange();
                          }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Country</InputLabel>
                        <OutlinedInput
                          {...field}
                          label="Country"
                          onChange={(e) => {
                            field.onChange(e);
                            handleInputChange();
                          }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <Controller
                    name="professionalTitle"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Profession</InputLabel>
                        <OutlinedInput
                          {...field}
                          label="Professional Title"
                          onChange={(e) => {
                            field.onChange(e);
                            handleInputChange();
                          }}
                        />
                        <FormHelperText>
                          Enter your current job title or position (e.g., Software Engineer).
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            {isChanged ? <Grid md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  sx={{
                    borderRadius: '25px', // Set border radius to 25px
                    '&:hover': {
                      backgroundColor: 'warning.dark', // Optional: change color on hover
                    },
                  }}
                >
                  Save Profile Changes
                </Button>
              </Grid> : null}
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};
