import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/services/api';

export const useResendVerification = () => {
    const [resending, setResending] = useState(false);

    const resendEmail = async (email: string) => {
        setResending(true);
        try {
            await api.post('/auth/resend-verification', { email }, { skipErrorToast: true } as any);
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