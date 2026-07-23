import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiEdit, FiX, FiTag } from 'react-icons/fi'
import { useSymptomMappings } from '@/hooks/useSymptomMappings'
import { SymptomMapping } from '@/types/admin'
import styles from './styles/scss/symptomMappings/symptomMappings.module.scss'

const SymptomMappings = () => {
  const {
    mappings,
    isLoading,
    page,
    totalPages,
    total,
    fetchMappings,
    createMapping,
    updateMapping,
    deleteMapping,
  } = useSymptomMappings()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [keywords, setKeywords] = useState<string[]>([])
  const [services, setServices] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  const [serviceInput, setServiceInput] = useState('')

  useEffect(() => {
    fetchMappings()
  }, [fetchMappings])

  const openAdd = () => {
    setEditingId(null)
    setKeywords([])
    setServices([])
    setKeywordInput('')
    setServiceInput('')
    setShowModal(true)
  }

  const openEdit = (mapping: SymptomMapping) => {
    setEditingId(mapping._id)
    setKeywords([...mapping.symptomKeywords])
    setServices([...mapping.services])
    setKeywordInput('')
    setServiceInput('')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (keywords.length === 0 || services.length === 0) return
    try {
      if (editingId) {
        await updateMapping(editingId, keywords, services)
      } else {
        await createMapping(keywords, services)
      }
      setShowModal(false)
    } catch {
      // toast already handled in hook
    }
  }

  const handleDelete = async (id: string, keywords: string[]) => {
    if (!window.confirm(`Delete mapping for "${keywords.join(', ')}"?`)) return
    await deleteMapping(id)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <div>
            <h1>Symptom Mappings</h1>
            <p>Manage keyword‑to‑service rules for the AI matching engine</p>
          </div>
          <button className={styles.addBtn} onClick={openAdd}>
            <FiPlus /> Add Mapping
          </button>
        </div>
      </header>

      <div className={styles.tableWrapper}>
        {isLoading ? (
          <div className={styles.loading}>Loading mappings...</div>
        ) : mappings.length === 0 ? (
          <div className={styles.empty}>
            <FiTag size={48} />
            <p>No symptom mappings defined yet.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Keywords</th>
                <th>Mapped Services</th>
                <th className={styles.action}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((m) => (
                <tr key={m._id}>
                  <td>
                    <div className={styles.tagList}>
                      {m.symptomKeywords.map((kw, i) => (
                        <span key={i} className={styles.keywordTag}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className={styles.tagList}>
                      {m.services.map((svc, i) => (
                        <span key={i} className={styles.serviceTag}>
                          {svc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={styles.actions}>
                    <button
                      onClick={() => openEdit(m)}
                      className={styles.editBtn}
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(m._id, m.symptomKeywords)}
                      className={styles.deleteBtn}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => fetchMappings(page - 1)}
            disabled={page <= 1}
            className={styles.pageBtn}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages} ({total} total)
          </span>
          <button
            onClick={() => fetchMappings(page + 1)}
            disabled={page >= totalPages}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? 'Edit Mapping' : 'New Mapping'}</h2>
              <FiX
                onClick={() => setShowModal(false)}
                className={styles.closeIcon}
              />
            </div>

            <div className={styles.modalBody}>
              <div className={styles.chipSection}>
                <label>Symptom Keywords</label>
                <div className={styles.chipInput}>
                  {keywords.map((kw, i) => (
                    <span key={i} className={styles.chip}>
                      {kw}
                      <button
                        onClick={() =>
                          setKeywords((prev) =>
                            prev.filter((_, idx) => idx !== i)
                          )
                        }
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Type keyword and press Enter"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && keywordInput.trim()) {
                        e.preventDefault()
                        setKeywords((prev) => [
                          ...prev,
                          keywordInput.trim().toLowerCase(),
                        ])
                        setKeywordInput('')
                      }
                    }}
                  />
                </div>
              </div>

              <div className={styles.chipSection}>
                <label>Mapped Services</label>
                <div className={styles.chipInput}>
                  {services.map((svc, i) => (
                    <span key={i} className={styles.chip}>
                      {svc}
                      <button
                        onClick={() =>
                          setServices((prev) =>
                            prev.filter((_, idx) => idx !== i)
                          )
                        }
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Type service and press Enter"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && serviceInput.trim()) {
                        e.preventDefault()
                        setServices((prev) => [
                          ...prev,
                          serviceInput.trim().toLowerCase(),
                        ])
                        setServiceInput('')
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setShowModal(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={keywords.length === 0 || services.length === 0}
                className={styles.saveBtn}
              >
                Save Mapping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SymptomMappings
