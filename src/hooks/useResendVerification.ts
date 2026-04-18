import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '@/context/UserProvider';

export const useResendVerification = () => {
    const [resending, setResending] = useState(false);

    const resendEmail = async (email: string) => {
        setResending(true);
        try {
            await axios.post(`${BASE_URL}/auth/resend-verification`, { email });
            toast.success("A new link has been dispatched!");
            return true;
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Could not resend link.");
            return false;
        } finally {
            setResending(false);
        }
    };

    return { resendEmail, resending };
};