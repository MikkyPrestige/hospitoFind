import { useState } from 'react';
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { HospitalSubmission } from '@/types/hospital';

export const useSubmitHospital = () => {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const submitHospital = async (payload: HospitalSubmission) => {
    setLoading(true);
    setError('');
    setShowSuccess(false);

    try {
      await axiosPrivate.post(`/hospitals`, payload);
      setShowSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to secure connection. Please verify your inputs.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetNetworkState = () => {
    setError('');
    setShowSuccess(false);
  };

  return { submitHospital, loading, error, showSuccess, resetNetworkState, setError };
};