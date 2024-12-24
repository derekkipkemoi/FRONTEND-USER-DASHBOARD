import * as React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Star } from '@mui/icons-material';
import { authClient, type Skill } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';
import AddedSkills from './added-skills';

interface ResumeSkillsDetailsFormProps {
  subTitle?: string;
  description?: string;
}

const keySkills: string[] = [
  "Communication Skills",
  "Teamwork and Collaboration",
  "Problem-Solving Skills",
  "Adaptability and Flexibility",
  "Time Management",
  "Critical Thinking",
  "Technical Proficiency",
  "Leadership Skills",
  "Attention to Detail",
  "Interpersonal Skills",
];

export const ResumeSkillsDetailsForm: React.FC<ResumeSkillsDetailsFormProps> = ({
  subTitle,
  description,
}) => {
  const { checkSession, user } = useUser();

  const userAddedSkills = user?.skills || []
  const userAddedSkillNames = new Set(userAddedSkills.map(skill => skill.skill));

  // Filter out the skills that the user has already added
  const nonAddedSkills = keySkills.filter(skill => !userAddedSkillNames.has(skill));
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [newSkill, setNewSkill] = React.useState<string>('');
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const handleStarClick = (index: number, value: number) => {
    const updatedSkills = [...skills];
    updatedSkills[index].rating = value;
    setSkills(updatedSkills);
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index].skill = value;

    if (value.trim() === '') {
      const skillToUnselect = updatedSkills[index].skill;
      setSelectedSkills(selectedSkills.filter((s) => s !== skillToUnselect));
    }

    setSkills(updatedSkills);
  };

  const addNewSkill = () => {
    if (newSkill.trim() !== '') {
      const newSkillObj = { skill: newSkill.trim(), rating: 0 };
      setSkills([newSkillObj, ...skills]);
      setSelectedSkills([newSkill.trim(), ...selectedSkills]);
      setNewSkill('');
      setCurrentIndex(0); // Reset to first page to show the new skill at the top
    }
  };

  const deleteSkill = (index: number) => {
    const skillToDelete = skills[index].skill;
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    setSelectedSkills(selectedSkills.filter((s) => s !== skillToDelete));
  };

  const displayedSkills = skills.slice(currentIndex, currentIndex + 3);

  const handleNext = () => {
    if (currentIndex + 3 < skills.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkillSelection = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
      setSkills(skills.filter((s) => s.skill !== skill));
    } else {
      const newSkillObj = { skill, rating: 0 };
      setSelectedSkills([skill, ...selectedSkills]);
      setSkills([newSkillObj, ...skills]);
    }
  };


  const submitSkills = React.useCallback(async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsPending(true);

    // Assuming 'values' contains the skills data to be submitted
    const skillsToLog = skills.map(({ skill, rating }) => ({ skill, rating }));
    console.log('Submitted skills:', skillsToLog);


    const { error } = await authClient.addSkills(skillsToLog);

    if (error) {
      console.error('Error adding skills:', error);
      // Handle error appropriately, e.g., show a notification to the user
    } else {
      console.log('Skills added successfully');
    }
    setSelectedSkills([])
    setSkills([])
    await checkSession?.();
    setIsPending(false);
  }, [checkSession, skills]);


  // Function to handle input change and update isChanged state


  return (
    <form
      onSubmit={submitSkills}>
      <Card>

        <CardHeader subheader={description} title={subTitle}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            padding: '16px',
            textAlign: 'center',
            borderRadius: '8px 8px 0 0',
            '& .MuiCardHeader-title': {
              fontSize: '1.5rem',
              fontWeight: 'bold',
            },
            '& .MuiCardHeader-subheader': {
              fontSize: '1rem',
              color: 'white',
              opacity: 0.9,
            },
          }} />
        <Divider />
        <CardContent>
          <AddedSkills />
          <Box display="flex" justifyContent="center" flexWrap="wrap" mb={3}>
            {nonAddedSkills.map((skill) => (
              <Button
                key={skill}
                variant={selectedSkills.includes(skill) ? 'contained' : 'outlined'}
                color={selectedSkills.includes(skill) ? 'primary' : 'inherit'}
                onClick={() => { handleSkillSelection(skill); }}
                startIcon={selectedSkills.includes(skill) ? <RemoveIcon /> : <AddIcon />}
                sx={{
                  borderRadius: '25px',
                  margin: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                {skill}
              </Button>
            ))}
            <Divider />
          </Box>

          <Grid container spacing={3} justifyContent="center">
            <Grid
              md={6}
              xs={12}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box display="flex" alignItems="center" mb={2} mt={2}>
                <FormControl fullWidth>
                  <InputLabel>Enter Skill</InputLabel>
                  <OutlinedInput
                    value={newSkill}
                    onChange={(e) => { setNewSkill(e.target.value); }}
                    label="Skill"
                    name="skill"
                  />
                </FormControl>
                <IconButton
                  onClick={addNewSkill}
                  color="primary"
                  disabled={!newSkill.trim()}
                  sx={{
                    backgroundColor: newSkill.trim() ? 'primary.main' : 'transparent',
                    color: newSkill.trim() ? 'white' : 'gray',
                    ml: 1,
                    '&:hover': {
                      backgroundColor: newSkill.trim() ? 'primary.dark' : 'transparent',
                    },
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {displayedSkills.map((item, index) => (
                <Box key={index} display="flex" alignItems="center" mb={2}>
                  <Box display="flex" mr={2}>
                    {Array.from({ length: 5 }, (_, starIndex) => (
                      <Star
                        key={starIndex}
                        onClick={() => { handleStarClick(currentIndex + index, starIndex + 1); }}
                        sx={{
                          cursor: 'pointer',
                          color: starIndex < item.rating ? 'primary.main' : 'gray',
                          fontSize: '2rem',
                        }}
                      />
                    ))}
                  </Box>
                  <FormControl fullWidth>
                    <InputLabel>Skill</InputLabel>
                    <OutlinedInput
                      value={item.skill}
                      onChange={(e) => { handleSkillChange(currentIndex + index, e.target.value); }}
                      label="Skill"
                      name="skill"
                    />
                  </FormControl>
                  <IconButton onClick={() => { deleteSkill(currentIndex + index); }} color="error" sx={{ ml: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>
          </Grid>
          {
            skills.length > 0 && (
              <Grid md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" color="success" sx={{
                  borderRadius: '25px', // Set border radius to 25px
                  '&:hover': {
                    backgroundColor: 'warning.dark', // Optional: change color on hover
                  },
                }}>
                  Save Added Skills
                </Button>
              </Grid>
            )
          }
        </CardContent>
        <Divider />
        {skills.length > 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
            <IconButton onClick={handlePrevious} disabled={currentIndex === 0}>
              <KeyboardArrowLeft />
            </IconButton>
            <Typography variant="body1" sx={{ mx: 2 }}>
              {currentIndex + 1} - {Math.min(currentIndex + 3, skills.length)} of {skills.length}
            </Typography>
            <IconButton onClick={handleNext} disabled={currentIndex + 3 >= skills.length}>
              <KeyboardArrowRight />
            </IconButton>
          </Box>
        )}
      </Card>
    </form>
  );
};

export default ResumeSkillsDetailsForm;
