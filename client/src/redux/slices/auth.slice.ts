import { User } from '@/types/user.type';
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
    isLoading: boolean;
    user: User | null;
}

const initialState: AuthState = {
    user: null,
    isLoading: true
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
});

export const {
    setUser,
    setIsLoading,
    logout
} = authSlice.actions;

export default authSlice.reducer;