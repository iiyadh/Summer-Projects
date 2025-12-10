import api from '../api/api';
import { create  } from 'zustand';
import { persist } from 'zustand/middleware';


export const useUserStore = create(persist((set) => ({
  getUserProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (err) {
      console.log('Error fetching user profile:', err);
      throw err;
    }
  },

  updateEmail: async (newEmail) => {
    try {
      const response = await api.put('/user/profile/change-email', { email: newEmail });
      return response.data;
    } catch (err) {
      console.log('Error fetching user profile:', err);
      throw err;
    }
  },

  updateUsername: async (newUsername) => {
    try {
      const response = await api.put(`/user/profile/change-username`, { username: newUsername });
      return response.data;
    } catch (err) {
      console.log('Error fetching user profile:', err);
      throw err;
    }
  },

  updateBio : async (newBio) => {
    try {
      const response = await api.put('/user/profile/change-bio', { bio: newBio });
      return response.data;
    } catch (err) {
      console.log('Error fetching user profile:', err);
      throw err;
    }
  },

  updateProfilePicture: async (picLink) => {
    try {
      const response = await api.put('/user/profile/change-profile-picture', { profilePicture: picLink });
      return response.data;
    } catch (err) {
      console.log('Error updating profile picture:', err);
      throw err;
    }
  },
  sendOTPCodeToEmail: async () => {
    try {
      const response = await api.post('/user/send-otp');
      return response.data;
    } catch (err) {
      console.log('Error fetching user profile:', err);
      throw err;
    }
  },

  verifyOTPCode: async (otpCode) => {
    try {
      const response = await api.post('/user/verify-otp', { otp: otpCode });
      return response.data;
    } catch (err) {
      console.log('Error verifying OTP:', err);
      throw err;
    }
  },

  updatePassword: async (newPassword, oldPassword) => {
    try {
      const response = await api.put('/user/update-password', { newPassword, oldPassword });
      return response.data;
    } catch (err) {
      console.log('Error updating password:', err);
      throw err;
    }
  }

}), {
  name: 'user-storage',
}));