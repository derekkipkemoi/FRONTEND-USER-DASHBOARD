'use client';

import * as React from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider } from '@mui/material';

import { EducationItem } from '@/components/resume/education/added-education-item';
import { ResumeEducationDetailsForm } from '@/components/resume/education/resume-education-details-form';
import { ResumeEducationEditForm } from '@/components/resume/education/resume-education-edit-form';

interface EducationHolderProps {
  subTitle?: string;
  description?: string;
}

export const EducationHolder: React.FC<EducationHolderProps> = ({ subTitle, description }) => {
  const [addEducation, setAddEducation] = React.useState<boolean>(false);
  const [editEducation, setEditEducation] = React.useState<boolean>(false);
  const [educationItem, setEducationItem] = React.useState<any>(null); // State to hold the education item being edited

  const onAddEducation = () => {
    setAddEducation(true);
    setEditEducation(false);
  };
  const onCancelEducation = () => {
    setAddEducation(false);
  };
  const onEditEducation = (item: any) => {
    setEditEducation(true);
    setAddEducation(false);
    setEducationItem(item); // Set the education item being edited
  };
  const onCancelEditEducation = () => {
    setEditEducation(false);
    setEducationItem(null); // Clear the education item
  };

  return (
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
      <CardContent>
        {addEducation ? (
          <ResumeEducationDetailsForm onCancelEducation={onCancelEducation} />
        ) : editEducation ? (
          <ResumeEducationEditForm onCancelEditEducation={onCancelEditEducation} educationItem={educationItem} />
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
            <EducationItem onEditEducation={onEditEducation} />
            <Button
              variant="contained"
              color="primary"
              onClick={onAddEducation}
              sx={{ marginTop: 2, borderRadius: '25px' }}
            >
              Add Education
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
