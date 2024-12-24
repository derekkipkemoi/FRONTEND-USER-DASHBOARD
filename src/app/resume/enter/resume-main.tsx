'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, LinearProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';
import { ProfessionalSummary } from '@/components/resume/professional-summary/professional-summary';
import { ResumeProfileDetailsForm } from '@/components/resume/profile/resume-profile-details-form';
import { ResumeSkillsDetailsForm } from '@/components/resume/skills/resume-skills-detail-form';

import resumeSections from '../../dashboard/account/resume-sections';
import { EducationHolder } from './education-holder';
import { WorkHistoryHolder } from './work-history-holder';

interface ResumeMainProps {
  // Optional prop for global index
}

const ResumeMain: React.FC<ResumeMainProps> = ({}) => {
  const [index, setIndex] = React.useState(0);
  const [currentComponent, setCurrentComponent] = React.useState('');
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const incrementIndex = () => {
    const sectionsLength = resumeSections.length;
    if (index < sectionsLength - 1) {
      setIndex(index + 1);
    }
    if (currentComponent === 'ProfessionalSummary') {
      setIsPending(true);
      router.push(paths.resume.resumeTemplates);
    }
  };
  const decrementIndex = () => {
    setIndex(index > 0 ? index - 1 : index);
  };

  const handleIndexClick = (idx: number) => {
    setIndex(idx);
  };

  const renderForm = () => {
    switch (index) {
      case 0:
        return (
          <ResumeProfileDetailsForm
            subTitle={resumeSections[index].subTitle}
            description={resumeSections[index].description}
          />
        );
      case 1:
        return (
          <WorkHistoryHolder
            subTitle={resumeSections[index].subTitle}
            description={resumeSections[index].description}
          />
        );
      case 2:
        return (
          <EducationHolder subTitle={resumeSections[index].subTitle} description={resumeSections[index].description} />
        );
      case 3:
        return (
          <ResumeSkillsDetailsForm
            subTitle={resumeSections[index].subTitle}
            description={resumeSections[index].description}
          />
        );
      case 4:
        return (
          <ProfessionalSummary
            subTitle={resumeSections[index].subTitle}
            description={resumeSections[index].description}
          />
        );
      default:
        return null;
    }
  };

  // Check current content being rendered by renderForm
  React.useEffect(() => {
    const content = renderForm();
    console.log('Current form content:', content?.type.name);
    setCurrentComponent(content?.type.name);
  }, [index]); // Add dependencies to log when content changes

  return (
    <Stack>
      <Box display="flex" justifyContent="center" mb={1} position="relative">
        {resumeSections.map((_section, idx) => (
          <Box
            key={idx}
            width={24}
            height={24}
            borderRadius="50%"
            bgcolor={
              index !== undefined ? (idx === index ? 'success.main' : 'gray') : idx <= index ? 'success.main' : 'gray'
            } // Conditional color logic
            display="flex"
            justifyContent="center"
            alignItems="center"
            mx={1}
            position="relative"
            sx={{
              cursor: 'pointer', // Make the index item look clickable
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%', // Position the line at the middle of the circle
                left: idx === 0 ? 'auto' : -20, // Position to the left of the circle
                right: idx === resumeSections.length - 1 ? 'auto' : 20, // Position to the right of the circle
                height: 2,
                //backgroundColor: globalIndex !== undefined && idx === globalIndex ? 'success.main' : 'gray', // Set line color based on globalIndex
                width: idx === 0 ? 0 : 20, // Set width for the line
                zIndex: -1, // Ensure the line is behind the circle
              },
            }}
            onClick={() => {
              handleIndexClick(idx);
            }} // Add click event handler
          >
            <Typography variant="caption" color="white">
              {idx + 1}
            </Typography>
          </Box>
        ))}
      </Box>

      <div>
        <Box textAlign="center" mb={1}>
          <Typography variant="h5">{resumeSections[index].title}</Typography>
          {isPending ? <LinearProgress sx={{ width: '100%' }} /> : null}
        </Box>
        <Grid container>
          <Grid item lg={12} md={12} xs={12}>
            {renderForm()}
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: 2 }}>
          <div>
            {index > 0 && (
              <Button variant="contained" sx={{ borderRadius: '25px' }} onClick={decrementIndex} color="secondary">
                Previous
              </Button>
            )}
          </div>
          <Button
            variant="contained"
            onClick={incrementIndex}
            sx={{
              backgroundColor: 'warning.main', // Keep the warning background color
              color: 'black', // Set text color to black
              borderRadius: '25px', // Set border radius to 25px
              '&:hover': {
                backgroundColor: 'warning.dark', // Optional: change color on hover
              },
            }}
          >
            Next
          </Button>
        </Box>
      </div>
    </Stack>
  );
};

export default ResumeMain;
