import api from '../api/api';
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    token: null,

    register: async (data) =>{
        try{
            const res = await api.post('/auth/register', data);
            console.log(res);
            set({ token: response.data.token });
            return res;
        }catch(err){
            return err;
        }
    },

    login: async (data)=>{
        try{
            const res = await api.post('/auth/login', data);
            set({ token: res.data.token });
            return res;
        }catch(err){
            return err;
        }
    },

    logout: async () => {
        set({ token: null });
        try{
            const res = await api.post('/auth/logout');
            return res;
        }catch(err){
            return err
        }
    },
}));
