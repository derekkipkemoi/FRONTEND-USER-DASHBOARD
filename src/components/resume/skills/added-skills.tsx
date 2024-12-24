import React, { useState, useContext } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star'; // Import StarIcon
import { UserContext } from '@/contexts/user-context'; // Update this path according to your project structure
import { useUser } from '@/hooks/use-user';
import { authClient } from '@/lib/auth/client';

export default function AddedSkills() {
    const userContext = useContext(UserContext);
    const [showSkills, setShowSkills] = useState(true);
    const { checkSession } = useUser();

    if (!userContext) {
        return null;
    }

    const { user } = userContext;
    const skills = user?.skills || [];

    const toggleSkillsVisibility = async () => {
        setShowSkills((prevShowSkills) => !prevShowSkills);
    };

    const handleDeleteSkill = async (skillId: string): Promise<void> => {
        console.log(`Delete skill: ${skillId}`);
        const { error } = await authClient.deleteSkill(skillId);

        if (error) {
            console.error("Failed to delete skill:", error);
        }

        await checkSession?.();
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            {!showSkills && skills.length > 0 && (
                <Button
                    variant="contained"
                    color="success"
                    onClick={toggleSkillsVisibility}
                    startIcon={<VisibilityIcon />}
                    sx={{
                        borderRadius: '25px',
                        margin: '4px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        width: 'fit-content',
                    }}
                >
                    <Typography variant="body2" color="white">
                        You Have {skills.length} Skills Added
                    </Typography>
                </Button>
            )}

            {showSkills ? <Box display="flex" justifyContent="center" flexWrap="wrap" mb={3} position="relative">
                    {showSkills && skills.length > 0 ? <IconButton
                            aria-label="close"
                            onClick={toggleSkillsVisibility}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: -20,
                                color: 'white',
                                backgroundColor: 'red',
                                '&:hover': {
                                    backgroundColor: 'darkred',
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton> : null}
                    {skills.map((skillItem) => (
                        <Box key={skillItem.id} display="flex" alignItems="center">
                            <Button
                                variant="outlined"
                                color="success"
                                startIcon={
                                    <Box display="flex" alignItems="center">
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'primary.main', // Set text color to gold for rating
                                                marginRight: '4px', // Space between rating and star
                                            }}
                                        >
                                            {skillItem.rating} {/* Display skill rating */}
                                        </Typography>
                                        <StarIcon
                                            sx={{
                                                color: 'gold', // Set star color to gold
                                            }}
                                        />
                                    </Box>
                                }
                                endIcon={
                                    <DeleteIcon
                                        sx={{
                                            color: 'red',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleDeleteSkill(skillItem.id)}
                                    />
                                }
                                sx={{
                                    borderRadius: '25px',
                                    margin: '2px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                {skillItem.skill}
                            </Button>
                        </Box>
                    ))}
                </Box> : null}
        </Box>
    );
}
