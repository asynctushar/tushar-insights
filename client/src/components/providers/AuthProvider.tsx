"use client";

import { useAppDispatch } from '@/redux/hooks';
import { setIsLoading, setUser } from '@/redux/slices/auth.slice';
import { ReactNode, useEffect } from 'react';

const AuthProvider = ({ children }: { children: ReactNode; }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                dispatch(setIsLoading(true));
                const res = await fetch("/api/auth/me");
                if (!res.ok) {
                    return;
                }

                const data = await res.json();
                dispatch(setUser(data.data));
            } catch (error: any) {
                console.log(error);
            } finally {
                dispatch(setIsLoading(false));
            }
        };

        fetchUser();
    }, []);

    return (
        <>{children}</>
    );
};

export default AuthProvider;