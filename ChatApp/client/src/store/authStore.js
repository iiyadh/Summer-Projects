import api from '../api/api';
import { create  } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(persist((set) => ({
    token: null,
    uid : null,

    setToken: (token) => {
        set({ token });
    },

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

    verifAuth : async () => {
        const token = useAuthStore.getState().token;
        try {
            const res = await api.get("/auth/isValidAuth", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status == 200) {
                set({uid : res.data })
            }else{
                set({ token: null });
            }

        } catch (err) {
            console.log(err);
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
}), {
    name: 'auth-storage',
}));
