import { useState, useEffect } from 'react'
import { Check, Trash2, MapPin, Globe, Phone, Clock } from 'lucide-react'
import { FiCheckCircle, FiClock, FiEdit, FiImage, FiX } from 'react-icons/fi'
import { useAdminPending } from '@/hooks/useAdminPending'
import { Hospital, HospitalFormData } from '@/types/hospital'
import AdminHospitalForm from '@/components/admin/adminHospitalForm'
import styles from './styles/adminPendingList.module.css'

const AdminPendingList = () => {
  const {
    hospitals,
    isLoading,
    page,
    totalPages,
    total,
    getPendingHospitals,
    approveHospital,
    updateAndApprove,
    batchApprove,
    deleteSubmission,
  } = useAdminPending()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  )
  const [formData, setFormData] = useState<HospitalFormData | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showBatchConfirm, setShowBatchConfirm] = useState(false)

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  useEffect(() => {
    getPendingHospitals()
  }, [getPendingHospitals])

  const handleEditClick = (hospital: Hospital) => {
    setSelectedHospital(hospital)
    setFormData({
      _id: hospital._id,
      name: hospital.name,
      type: hospital.type || '',
      street: hospital.address?.street || '',
      city: hospital.address?.city || '',
      state: hospital.address?.state || '',
      phoneNumber: hospital.phoneNumber || '',
      email: hospital.email || '',
      website: hospital.website || '',
      photoUrl: hospital.photoUrl || '',
      services: Array.isArray(hospital.services)
        ? hospital.services.join(', ')
        : '',
      comments: hospital.comments || [],
      hours: hospital.hours || [],
      longitude: hospital.longitude?.toString() || '',
      latitude: hospital.latitude?.toString() || '',
      isFeatured: hospital.isFeatured ?? false,
      verified: hospital.verified ?? false,
    })
    setIsEditing(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData || !selectedHospital) return

    const updatedHospital: Hospital = {
      ...selectedHospital,
      name: formData.name,
      type: formData.type,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: selectedHospital.address?.country || '',
      },
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      website: formData.website,
      photoUrl: formData.photoUrl,
      services:
        typeof formData.services === 'string'
          ? formData.services
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : formData.services,
      comments: formData.comments,
      hours: formData.hours,
      longitude: formData.longitude ? Number(formData.longitude) : undefined,
      latitude: formData.latitude ? Number(formData.latitude) : undefined,
      isFeatured: formData.isFeatured,
      verified: formData.verified ?? false,
    }

    const success = await updateAndApprove(updatedHospital)
    if (success) {
      setIsEditing(false)
      setFormData(null)
      setSelectedHospital(null)
    }
  }

  const handleConfirmDelete = async (id: string) => {
    const target = hospitals.find((h) => h._id === id)
    if (
      window.confirm(`Reject and delete "${target?.name || 'this entry'}"?`)
    ) {
      await deleteSubmission(id)
    }
  }

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1>Review Queue</h1>
        <p>Review and verify user-submitted entries</p>
      </header>

      {selectedIds.size > 0 && (
        <div className={styles.batchBar}>
          <span>{selectedIds.size} hospital(s) selected</span>
          <button
            type="button"
            className={styles.batchApproveBtn}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowBatchConfirm(true)
            }}
          >
            <FiCheckCircle /> Approve Selected
          </button>
        </div>
      )}

      {isLoading ? (
        <div className={styles.loading}>Checking queue...</div>
      ) : hospitals.length === 0 ? (
        <div className={styles.emptyState}>
          <Check size={48} />
          <p>All submissions have been processed!</p>
        </div>
      ) : (
        <div className={styles.hospitalGrid}>
          {hospitals.map((hospital) => (
            <div key={hospital._id} className={styles.hospitalCard}>
              <input
                type="checkbox"
                checked={selectedIds.has(hospital._id)}
                onChange={() => toggleSelect(hospital._id)}
                onClick={(e) => e.stopPropagation()}
                className={styles.cardCheckbox}
              />

              <div className={styles.photoPreview}>
                {hospital.photoUrl ? (
                  <img
                    src={hospital.photoUrl}
                    alt={hospital.name}
                    className={styles.hospitalThumb}
                  />
                ) : (
                  <div className={styles.noPhoto}>
                    <FiImage size={24} /> No Photo Provided
                  </div>
                )}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.hospitalName}>{hospital.name}</h2>
                  <span className={styles.typeBadge}>
                    {hospital.type || 'General'}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <MapPin size={16} />
                  <span>
                    {hospital.address.street
                      ? `${hospital.address.street}, `
                      : ''}
                    {hospital.address.city}, {hospital.address.state}
                  </span>
                </div>
                <div className={styles.contactDetails}>
                  {hospital.phoneNumber && (
                    <div className={styles.infoRow}>
                      <Phone size={14} /> <span>{hospital.phoneNumber}</span>
                    </div>
                  )}
                  {hospital.website && (
                    <div className={styles.infoRow}>
                      <Globe size={14} />
                      <a
                        href={hospital.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit Site
                      </a>
                    </div>
                  )}
                </div>

                <div className={styles.servicesList}>
                  <h4>Provided Services:</h4>
                  <div className={styles.tags}>
                    {hospital.services && hospital.services.length > 0 ? (
                      hospital.services.map((s, i) => (
                        <span key={i} className={styles.tag}>
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className={styles.noTags}>No services listed</span>
                    )}
                  </div>
                </div>

                {hospital.comments && hospital.comments.length > 0 && (
                  <div className={styles.commentsSection}>
                    <h4>User Comments:</h4>
                    <ul className={styles.commentList}>
                      {hospital.comments.map((comment, index) => (
                        <li key={index} className={styles.commentItem}>
                          "{comment}"
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles.hoursSection}>
                  <h4>
                    <FiClock size={14} /> Operating Hours:
                  </h4>
                  {hospital.hours && hospital.hours.length > 0 ? (
                    <div className={styles.hoursGrid}>
                      {hospital.hours.map((h, index) => (
                        <div key={index} className={styles.hourDetail}>
                          <span className={styles.dayLabel}>{h.day}:</span>
                          <span className={styles.timeLabel}>{h.open}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noData}>No hours provided</p>
                  )}
                </div>

                <div className={styles.submissionDate}>
                  <Clock size={14} />
                  <span>
                    Submitted:{' '}
                    {hospital.createdAt
                      ? new Date(hospital.createdAt).toLocaleDateString()
                      : 'Unknown'}
                  </span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button
                  onClick={() => approveHospital(hospital._id)}
                  className={styles.btnApprove}
                >
                  <Check size={18} /> Approve
                </button>
                <button
                  onClick={() => handleEditClick(hospital)}
                  className={styles.btnEdit}
                >
                  <FiEdit size={18} /> Review & Fix
                </button>
                <button
                  onClick={() => handleConfirmDelete(hospital._id)}
                  className={styles.btnDelete}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => getPendingHospitals(page - 1)}
            disabled={page <= 1}
            className={styles.pageBtn}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages} ({total} total)
          </span>
          <button
            onClick={() => getPendingHospitals(page + 1)}
            disabled={page >= totalPages}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      )}

      {showBatchConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Approve {selectedIds.size} Hospital(s)?</h2>
              <FiX
                onClick={() => setShowBatchConfirm(false)}
                className={styles.closeIcon}
              />
            </div>
            <div className={styles.modalBody}>
              <ul className={styles.selectedList}>
                {Array.from(selectedIds).map((id) => {
                  const hospital = hospitals.find((h) => h._id === id)
                  return hospital ? (
                    <li key={id}>
                      <strong>{hospital.name}</strong> —{' '}
                      {hospital.address?.city}, {hospital.address?.state}
                    </li>
                  ) : null
                })}
              </ul>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowBatchConfirm(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmApproveBtn}
                onClick={async () => {
                  await batchApprove(Array.from(selectedIds))
                  setSelectedIds(new Set())
                  setShowBatchConfirm(false)
                }}
              >
                <FiCheckCircle /> Yes, Approve All
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditing && formData && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Review Submission</h2>
              <FiX
                onClick={() => {
                  setIsEditing(false)
                  setFormData(null)
                  setSelectedHospital(null)
                }}
                className={styles.closeIcon}
              />
            </div>
            <AdminHospitalForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleFormSubmit}
              loading={false}
              title="Fix typos before approving"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPendingList
