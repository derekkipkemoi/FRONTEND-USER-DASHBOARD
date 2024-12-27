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

const BASE_URL = 'http://localhost:3010/';

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    const response = await axios.post(`${BASE_URL}/users/registerUser`, params);

    if (response.data.message === 'User with similar email already exists!') {
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
    const response = await axios.post(`${BASE_URL}/users/loginUser`, params);

    if (response.data.message === 'Invalid credentials') {
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
    const id = localStorage.getItem('id');
    if (!id) {
      return { data: null };
    }
    const response = await axios.post(`${BASE_URL}/users/getUser`, { id });
    return { data: response?.data?.user ?? null, error: response?.data?.error ?? null };
  }

  async updateUser(params: UserUpdateParams): Promise<{ data?: User | null; error?: string }> {
    const response = await axios.patch(`${BASE_URL}/users/updateUser`, params);
    if (response.data.message !== 'User updated') {
      return { error: 'Failed to update data' };
    }
    return {};
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('id');
    return {};
  }

  async addWorkHistory(params: AddWorkHistoryParams): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }
    const response = await axios.post(`${BASE_URL}/users/${id}/addWorkHistory`, params);
    if (response.data.message !== 'Work history added') {
      return { error: 'Failed to add work history' };
    }
    return {};
  }

  async updateWorkHistory(
    workHistoryId: string,
    params: UpdateWorkHistoryParams
  ): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }
    try {
      const response = await axios.put(`${BASE_URL}/users/${id}/updateWorkHistory/${workHistoryId}`, params);
      if (response.data.message !== 'Work history updated') {
        return { error: 'Failed to update work history' };
      }
      return { data: response.data.workHistory };
    } catch (error) {
      console.error('Error updating work history:', error);
      return { error: 'An error occurred while updating work history' };
    }
  }

  async deleteWorkHistory(workHistoryId: string): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }
    try {
      const response = await axios.delete(`${BASE_URL}/users/${id}/deleteWorkHistory/${workHistoryId}`);
      if (response.data.message !== 'Work history deleted') {
        return { error: 'Failed to delete work history' };
      }
      return { data: null };
    } catch (error) {
      console.error('Error deleting work history:', error);
      return { error: 'An error occurred while deleting work history' };
    }
  }

  async addEducation(params: AddEducationParams): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }
    const response = await axios.post(`${BASE_URL}/users/${id}/addEducation`, params);
    if (response.data.message !== 'Education added') {
      return { error: 'Failed to add education' };
    }
    return { data: response.data.education };
  }

  async updateEducation(educationId: string, params: UpdateEducationParams): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }
    try {
      const response = await axios.put(`${BASE_URL}/users/${id}/updateEducation/${educationId}`, params);
      if (response.data.message !== 'Education updated') {
        return { error: 'Failed to update education' };
      }
      return { data: response.data.education };
    } catch (error) {
      console.error('Error updating education:', error);
      return { error: 'An error occurred while updating education' };
    }
  }

  async deleteEducation(educationId: string): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }
    try {
      const response = await axios.delete(`${BASE_URL}/users/${id}/deleteEducation/${educationId}`);
      if (response.data.message !== 'Education deleted') {
        return { error: 'Failed to delete education' };
      }
      return { data: null };
    } catch (error) {
      console.error('Error deleting education:', error);
      return { error: 'An error occurred while deleting education' };
    }
  }

  async addSkills(skills: Skill[]): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }
    try {
      const response = await axios.post(`${BASE_URL}/users/${id}/addSkills`, { skills });
      if (response.data.message !== 'Skills added successfully.') {
        return { error: 'Failed to add skills' };
      }
      return { data: null };
    } catch (error) {
      console.error('Error adding skills:', error);
      return { error: 'An error occurred while adding skills' };
    }
  }

  async deleteSkill(skillId: string): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }
    try {
      const response = await axios.delete(`${BASE_URL}/users/${id}/skills/${skillId}`);
      if (response.data.message !== 'Skill deleted successfully.') {
        return { error: 'Failed to delete skill' };
      }
      return { data: null };
    } catch (error) {
      console.error('Error deleting skill:', error);
      return { error: 'An error occurred while deleting the skill' };
    }
  }

  async addProfessionalSummary(professionalSummary: AddProfessionalSummary): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }
    try {
      const response = await axios.post(`${BASE_URL}/users/${id}/addProfessionalSummary`, {
        professionalSummary,
      });
      if (response.data.message !== 'Professional summary added successfully.') {
        return { error: 'Failed to add professional summary' };
      }
      return { data: null };
    } catch (error) {
      console.error('Error adding professional summary:', error);
      return { error: 'An error occurred while adding professional summary' };
    }
  }

  async uploadAvatar(file: File): Promise<{ data?: null; error?: string }> {
    const id = localStorage.getItem('id');
    if (!id) {
      return { error: 'User ID not found in local storage' };
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.post(`${BASE_URL}/users/${id}/uploadAvatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.message !== 'Avatar uploaded successfully') {
        return { error: 'Failed to upload avatar' };
      }
      return { data: null };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return { error: 'An error occurred while uploading avatar' };
    }
  }
}

export const authClient = new AuthClient();
