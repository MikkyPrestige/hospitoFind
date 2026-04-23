export interface AdminHospitalFormProps {
    formData: any;
    setFormData: (data: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    title: string;
}

export interface DashboardStats {
    totalHospitals: number;
    pendingHospitals: number;
    liveHospitals: number;
    totalUsers: number;
}

export interface ImportResult {
  message: string;
  imported: number;
  skipped: number;
}