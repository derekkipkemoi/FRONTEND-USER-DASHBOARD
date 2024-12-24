

interface WorkHistory {
  id: string;
  employer: string; // Required field
  jobTitle: string;
  startDate: string; // Required field
  endDate?: string; // Optional field
  workingHere?: boolean; // Defaults to false
  jobDescription?: string; // Optional job description field
}

interface Education {
  id: string;
  gradeAchieved: string;
  school: string;
  startDate: string;
  endDate?: string;
  studyingHere: boolean;
  description?: string;
}

interface Skill {
  id: string;
  skill: string;
  rating: number;
}


// New interface for professional summary
interface ProfessionalSummary {
  summary?: string; // Optional summary
  github?: string; // Optional GitHub link
  linkedIn?: string; // Optional LinkedIn link
  otherWebsite?: string; // Optional other website link
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Required field
  phone: string;
  city?: string;
  country?: string;
  professionalTitle?: string;
  workHistory: WorkHistory[]; // Optional array of work history objects
  education: Education[];
  skills: Skill[];
  professionalSummary?: ProfessionalSummary; // Optional professional summary field
  avatarUrl?: string;
  [key: string]: unknown;
}