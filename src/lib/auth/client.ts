'use client';

import axios from 'axios';

import type { User } from '@/types/user';

// function generateToken(): string {
//   const arr = new Uint8Array(12);
//   window.crypto.getRandomValues(arr);
//   return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
// }

export interface SignUpParams {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface Skill {
  skill: string;
  rating: number;
}

export interface UserUpdateParams {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  city?: string;
  country?: string;
  professionalTitle?: string;
  avatarUrl?: string;
}

export interface AddWorkHistoryParams {
  employer: string;
  jobTitle: string;
  startDate: string; // Make sure this is a valid date
  endDate?: string; // Or omit this field if workingHere is true
  workingHere: boolean; // Change to true if currently working there
  jobDescription?: string;
}

export interface AddEducationParams {
  school: string;
  gradeAchieved?: string; // Optional field
  startDate: string; // Make sure this is a valid date
  endDate?: string; // Optional field; omit if currently attending
  studyingHere: boolean; // Change to true if currently studying here
  description?: string; // Optional field
}

export interface AddProfessionalSummary {
  summary?: string;
  github?: string;
  linkedIn?: string;
  otherWebsite?: string;
}

export interface UpdateWorkHistoryParams extends AddWorkHistoryParams {
  id: string; // Add an id field for identifying the work item
}
export interface UpdateEducationParams extends AddEducationParams {
  id: string; // Add an id field for identifying the education item
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    // Make API request
    const response = await axios.post('http://localhost:3010/users/registerUser', params);

    if (response.data.message == 'User with similar email already exists!') {
      return { error: response.data.message };
    }
    const token = response?.data?.user?.id;
    localStorage.setItem('id', token);
    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    // Make API request
    const response = await axios.post('http://localhost:3010/users/loginUser', params);

    if (response.data.message == 'Invalid credentials') {
      return { error: 'Invalid credentials' };
    }
    const token = response?.data?.user?.id;
    localStorage.setItem('id', token);
    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // We do not handle the API, so just check if we have a token in localStorage.
    const id = localStorage.getItem('id');
    if (!id) {
      return { data: null };
    }
    const response = await axios.post('http://localhost:3010/users/getUser', { id });
    // console.log("user", response.data.user)
    return { data: response?.data?.user ?? null, error: response?.data?.error ?? null };
  }

  async updateUser(params: UserUpdateParams): Promise<{ data?: User | null; error?: string }> {
    // Make API request
    const response = await axios.patch('http://localhost:3010/users/updateUser', params);
    if (response.data.message != 'User updated') {
      return { error: 'Failed to update data' };
    }
    return {};
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('id');
    return {};
  }

  async addWorkHistory(params: AddWorkHistoryParams): Promise<{ data?: null; error?: string }> {
    // Make API request
    const id = localStorage.getItem('id');
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }

    // Make API request with the dynamic user ID
    const response = await axios.post(`http://localhost:3010/users/${id}/addWorkHistory`, params);

    // if (response.data.message != "User updated") {
    //   return { error: 'Failed to update data' };
    // }
    return {};
  }

  async updateWorkHistory(
    workHistoryId: string,
    params: UpdateWorkHistoryParams
  ): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    // Check if the user ID exists in local storage
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }
    try {
      // Make API request with the dynamic user ID and work history ID
      const response = await axios.put(`http://localhost:3010/users/${id}/updateWorkHistory/${workHistoryId}`, params);
      // Optional: Handle specific response messages if needed
      if (response.data.message !== 'Work history updated') {
        return { error: 'Failed to update work history' };
      }

      return { data: response.data.workHistory }; // Return updated work history data if needed
    } catch (error) {
      console.error('Error updating work history:', error);
      return { error: 'An error occurred while updating work history' };
    }
  }

  async deleteWorkHistory(workHistoryId: string): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    // Check if the user ID exists in local storage
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }
    try {
      // Make API request with the dynamic user ID and work history ID
      const response = await axios.delete(`http://localhost:3010/users/${id}/deleteWorkHistory/${workHistoryId}`);
      // Optional: Handle specific response messages if needed
      if (response.data.message !== 'Work history deleted') {
        return { error: 'Failed to delete work history' };
      }
      return { data: null }; // Return null or any data if needed
    } catch (error) {
      console.error('Error deleting work history:', error);
      return { error: 'An error occurred while deleting work history' };
    }
  }

  async addEducation(params: AddEducationParams): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    // Check if the user ID exists in local storage
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }
    // Make API request with the dynamic user ID
    const response = await axios.post(`http://localhost:3010/users/${id}/addEducation`, params);
    // console.log(response);

    // Optional: Handle specific response messages if needed
    if (response.data.message !== 'Education added') {
      return { error: 'Failed to add education' };
    }

    return { data: response.data.education }; // Return added education data if needed
  }

  async updateEducation(educationId: string, params: UpdateEducationParams): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    // Check if the user ID exists in local storage
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }

    try {
      // Make API request with the dynamic user ID and education ID
      const response = await axios.put(`http://localhost:3010/users/${id}/updateEducation/${educationId}`, params);

      // Optional: Handle specific response messages if needed
      if (response.data.message !== 'Education updated') {
        return { error: 'Failed to update education' };
      }

      return { data: response.data.education }; // Return updated education data if needed
    } catch (error) {
      console.error('Error updating education:', error);
      return { error: 'An error occurred while updating education' };
    }
  }

  async deleteEducation(educationId: string): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    // Check if the user ID exists in local storage
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }

    try {
      // Make API request with the dynamic user ID and education ID
      const response = await axios.delete(`http://localhost:3010/users/${id}/deleteEducation/${educationId}`);

      // Optional: Handle specific response messages if needed
      if (response.data.message !== 'Education deleted') {
        return { error: 'Failed to delete education' };
      }

      return { data: null }; // Return null or any data if needed
    } catch (error) {
      console.error('Error deleting education:', error);
      return { error: 'An error occurred while deleting education' };
    }
  }

  async addSkills(skills: Skill[]): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    // Check if the user ID exists in local storage
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }

    // console.log('skills', skills);

    try {
      // Make API request with the dynamic user ID
      const response = await axios.post(`http://localhost:3010/users/${id}/addSkills`, { skills });
      // console.log('skills', response);

      // Optional: Handle specific response messages if needed
      if (response.data.message !== 'Skills added successfully.') {
        return { error: 'Failed to add skills' };
      }

      return { data: null }; // Return the added skills or any data if needed
    } catch (error) {
      console.error('Error adding skills:', error);
      return { error: 'An error occurred while adding skills' };
    }
  }

  async deleteSkill(skillId: string): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');

    // Check if the user ID exists in local storage
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }

    try {
      // Make API request with the dynamic user ID and skill ID
      const response = await axios.delete(`http://localhost:3010/users/${id}/skills/${skillId}`);

      // Optional: Log the response for debugging
      // console.log('API Response:', response);

      // Check for successful response
      if (response.status !== 200 || response.data.message !== 'Skill deleted successfully.') {
        return { error: 'Failed to delete skill' };
      }

      // Return confirmation or updated skills if needed
      return { data: null }; // Return any data if needed, like remaining skills
    } catch (error) {
      console.error('Error deleting skill:', error);
      return { error: 'An error occurred while deleting the skill' };
    }
  }

  async addProfessionalSummary(professionalSummary: AddProfessionalSummary): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    // Check if the user ID exists in local storage
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }

    // console.log('Professional Summary:', professionalSummary);

    try {
      // Make API request with the dynamic user ID
      const response = await axios.post(`http://localhost:3010/users/${id}/addProfessionalSummary`, {
        professionalSummary,
      });
      // console.log('Response:', response);

      // Optional: Handle specific response messages if needed
      if (response.data.message !== 'Professional summary added successfully.') {
        return { error: 'Failed to add professional summary' };
      }

      return { data: null }; // Return added data or any additional info if needed
    } catch (error) {
      console.error('Error adding professional summary:', error);
      return { error: 'An error occurred while adding professional summary' };
    }
  }

  async uploadAvatar(file: File): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    // Check if the user ID exists in local storage
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }

    // Prepare FormData to send the file
    const formData = new FormData();
    formData.append('avatar', file); // Append the file to FormData
    // console.log('File to upload', formData);

    try {
      // Make API request with the dynamic user ID
      const response = await axios.post(`http://localhost:3010/users/${id}/uploadAvatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set appropriate content type for file uploads
        },
      });
      // console.log('Response:', response);

      // Optional: Handle specific response messages if needed
      if (response.data.message !== 'Avatar uploaded successfully') {
        return { error: 'Failed to upload avatar' };
      }

      return { data: null }; // Return added data or any additional info if needed
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return { error: 'An error occurred while uploading avatar' };
    }
  }
}

export const authClient = new AuthClient();
