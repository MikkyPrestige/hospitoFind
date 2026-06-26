import { HospitalFormData } from './hospital'

export interface AdminHospitalFormProps {
  formData: HospitalFormData
  setFormData: (data: HospitalFormData) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  title: string
}

export interface DashboardStats {
  totalHospitals: number
  pendingHospitals: number
  liveHospitals: number
  totalUsers: number
}

export interface ImportResult {
  message: string
  imported: number
  skipped: number
}

export interface OsmPreviewItem {
  name: string
  address?: {
    city?: string
    state?: string
  }
}

export interface OsmImportResult extends ImportResult {
  preview?: OsmPreviewItem[]
}

export interface SymptomMapping {
  _id: string
  symptomKeywords: string[]
  services: string[]
  createdAt?: string
  updatedAt?: string
}
