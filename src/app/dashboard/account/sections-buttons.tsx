'use client';

import * as React from 'react';
import { EducationHolder } from '@/app/resume/enter/education-holder';
import { WorkHistoryHolder } from '@/app/resume/enter/work-history-holder';
import { AddCircleRounded, CloseRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

import { ProfessionalSummary } from '@/components/resume/professional-summary/professional-summary';
import { ResumeProfileDetailsForm } from '@/components/resume/profile/resume-profile-details-form';
import { ResumeSkillsDetailsForm } from '@/components/resume/skills/resume-skills-detail-form';

import { resumeSections } from './resume-sections';

function SectionsButtons() {
  const [index, setIndex] = React.useState<number>(0);

  const changeIndex = (indexItem: number): void => {
    setIndex(indexItem);
  };

  const renderForm = (): React.ReactNode => {
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

  const handleClose = (): void => {
    setIndex(-1);
  };

  return (
    <div>
      <Box display="flex" justifyContent="center" flexWrap="wrap" mb={3}>
        {resumeSections.map((skill, indexItem) => (
          <Button
            key={skill.title} // Use skill.title or another unique identifier
            variant={index === indexItem ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => {
              changeIndex(indexItem);
            }}
            startIcon={<AddCircleRounded />}
            sx={{
              borderRadius: '25px',
              margin: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            {skill.title}
          </Button>
        ))}
        {index !== -1 && (
          <Button
            onClick={handleClose}
            variant="contained"
            color="error"
            sx={{
              marginLeft: '8px',
              alignSelf: 'center',
              borderRadius: '25px',
            }}
            startIcon={<CloseRounded />}
          >
            Close
          </Button>
        )}
      </Box>
      {renderForm()}
    </div>
  );
}

export default SectionsButtons;
