import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language'; // Website icon
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Box, CardHeader, FormControl, FormHelperText, InputLabel, LinearProgress, OutlinedInput } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

interface ProfessionalSummaryProps {
  subTitle?: string;
  description?: string;
}

// Define the Zod schema for validation
const schema = z.object({
  summary: z.string().optional(),
  linkedIn: z
    .string()
    .optional()
    .refine((value) => !value || /^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(value), {
      message: 'LinkedIn URL must be a valid LinkedIn profile',
    }),
  github: z
    .string()
    .optional()
    .refine((value) => !value || /^https?:\/\/(www\.)?github\.com\/.*$/.test(value), {
      message: 'GitHub URL must be a valid GitHub profile',
    }),
  otherWebsite: z
    .string()
    .optional()
    .refine((value) => !value || /^https?:\/\/(?!.*(github|linkedin)\.com).*$/.test(value), {
      message: 'Website URL must be a valid URL not on GitHub or LinkedIn',
    }),
});

type Values = z.infer<typeof schema>;

// Define a type for the keys of initialValues
type InitialValuesKeys = keyof Values;

export function ProfessionalSummary({ subTitle, description }: ProfessionalSummaryProps): React.JSX.Element {
  const { checkSession, user } = useUser();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const initialValues: Values = {
    summary: user?.professionalSummary?.summary,
    linkedIn: user?.professionalSummary?.linkedIn,
    github: user?.professionalSummary?.github,
    otherWebsite: user?.professionalSummary?.otherWebsite,
  };

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const [showSaveButton, setShowSaveButton] = React.useState<boolean>(false);

  // Watch for changes in the form values
  React.useEffect(() => {
    const subscription = watch((value) => {
      const hasChanges = Object.keys(initialValues).some((key) => {
        const typedKey = key as InitialValuesKeys; // Cast key to InitialValuesKeys
        return value[typedKey] !== initialValues[typedKey];
      });
      setShowSaveButton(hasChanges);
    });
    return () => { subscription.unsubscribe(); };
  }, [watch, initialValues]);

  const handleSummaryAndLinksSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      const { summary = '', linkedIn = '', github = '', otherWebsite = '' } = values;
      const professionalSummary = {
        summary,
        linkedIn,
        github,
        otherWebsite,
      };
      console.log('data', professionalSummary);
      const { error } = await authClient.addProfessionalSummary(professionalSummary);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      await checkSession?.();
      setIsPending(false); // Set pending state to false
      setShowSaveButton(false);
    },
    [checkSession]
  );

  return (
    <Grid container>
      <Grid item lg={12} md={12} xs={12}>
        <Card>
          <CardHeader
            title={subTitle}
            subheader={description}
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
          <form onSubmit={handleSubmit(handleSummaryAndLinksSubmit)}>
            <CardContent>
              {isPending ? <Box sx={{ width: '100%', marginBottom: 2 }}>
                  <LinearProgress />
                </Box> : null}
              <Typography gutterBottom>Professional Summary (Optional)</Typography>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Enter your professional summary</InputLabel>
                    <OutlinedInput
                      {...field}
                      sx={{ width: '100%', marginBottom: 2, height: '120px' }} // Increase height here
                      multiline // Allow multiple lines
                      rows={4}
                      label="Enter your professional summary"
                    />
                  </FormControl>
                )}
              />
              <Typography gutterBottom>Your Social Media / Website Links (Optional)</Typography>
              <Grid container>
                <Grid item lg={4} md={4} xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <Box sx={{ marginRight: 1 }}>
                      <LinkedInIcon />
                    </Box>
                    <Controller
                      name="linkedIn"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={Boolean(errors.linkedIn)}>
                          <InputLabel>Enter LinkedIn URL</InputLabel>
                          <OutlinedInput {...field} label="Enter LinkedIn URL" />
                          {errors.linkedIn ? <FormHelperText>{errors.linkedIn.message?.toString()}</FormHelperText> : null}
                        </FormControl>
                      )}
                    />
                  </Box>
                </Grid>
                <Grid item lg={4} md={4} xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <Box sx={{ marginRight: 1 }}>
                      <GitHubIcon />
                    </Box>
                    <Controller
                      name="github"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={Boolean(errors.github)}>
                          <InputLabel>Enter GitHub URL</InputLabel>
                          <OutlinedInput {...field} label="Enter GitHub URL" />
                          {errors.github ? <FormHelperText>{errors.github.message?.toString()}</FormHelperText> : null}
                        </FormControl>
                      )}
                    />
                  </Box>
                </Grid>
                <Grid item lg={4} md={4} xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <Box sx={{ marginRight: 1 }}>
                      <LanguageIcon />
                    </Box>
                    <Controller
                      name="otherWebsite"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={Boolean(errors.otherWebsite)}>
                          <InputLabel>Enter Other Website URL</InputLabel>
                          <OutlinedInput {...field} label="Enter Other Website URL" />
                          {errors.otherWebsite ? <FormHelperText>{errors.otherWebsite.message?.toString()}</FormHelperText> : null}
                        </FormControl>
                      )}
                    />
                  </Box>
                </Grid>
                <Grid md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {/* Conditionally render the Save Changes button */}
                  {showSaveButton ? <Button
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
                      Save Changes
                    </Button> : null}
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
          </form>
        </Card>
      </Grid>
    </Grid>
  );
}
