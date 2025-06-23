import api from '../api/api';
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    token: null,

    register: async (data) => {
        try {
            const res = await api.post('/auth/register', data);
            set({ token: res.data.token });
            return { success: true, data: res.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    login: async (data)=>{
        try{
            const res = await api.post('/auth/login', data);
            set({ token: res.data.token });
            return { success: true, data: res.data };
        }catch(err){
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    logout: async () => {
        set({ token: null });
        try{
            const res = await api.post('/auth/logout');
            return { success: true, data: res.data };
        }catch(err){
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },
}));
