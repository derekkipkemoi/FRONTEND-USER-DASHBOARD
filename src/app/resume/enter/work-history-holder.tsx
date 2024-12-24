'use client';

import * as React from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider } from '@mui/material';

import { WorkHistoryItem } from '@/components/resume/work-history/added-work-history-item';
import { ResumeExperienceDetailsForm } from '@/components/resume/work-history/resume-experience-details-form';
import { ResumeExperienceEditForm } from '@/components/resume/work-history/resume-experience-edit-form';

interface WorkHistoryHolderProps {
  subTitle?: string;
  description?: string;
}

export const WorkHistoryHolder: React.FC<WorkHistoryHolderProps> = ({ subTitle, description }) => {
  const [addExperience, setAddExperience] = React.useState<boolean>(false);
  const [editExperience, setEditExperience] = React.useState<boolean>(false);
  const [workHistoryItem, setWorkHistoryItem] = React.useState<any>(null); // State to hold the work history item being edited

  const onAddExperience = () => {
    setAddExperience(true);
    setEditExperience(false);
  };
  const onCancelExperience = () => {
    setAddExperience(false);
  };
  const onEditExperience = (item: any) => {
    setEditExperience(true);
    setAddExperience(false);
    setWorkHistoryItem(item); // Set the work history item being edited
  };
  const onCancelEditExperience = () => {
    setEditExperience(false);
    setWorkHistoryItem(null); // Clear the work history item
  };

  return (
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
      <CardContent>
        {addExperience ? (
          <ResumeExperienceDetailsForm onCancelExperience={onCancelExperience} />
        ) : editExperience ? (
          <ResumeExperienceEditForm onCancelEditExperience={onCancelEditExperience} workHistoryItem={workHistoryItem} />
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
            <WorkHistoryItem onEditExperience={onEditExperience} />
            <Button
              variant="contained"
              color="primary"
              onClick={onAddExperience}
              sx={{ marginTop: 2, borderRadius: '25px' }}
            >
              Add Work History
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
