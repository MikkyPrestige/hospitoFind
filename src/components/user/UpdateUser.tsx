import { useState } from 'react'
import { User, UpdateUserProps } from '@/types/user'
import { useAuthContext } from '@/hooks/useAuthContext'
import useUpdate from '@/hooks/useUpdateUser'
import { Button } from '@/components/ui/Button'
import style from './styles/updateUser.module.css'

const UpdateUser = ({ onSuccess }: UpdateUserProps) => {
  const { state } = useAuthContext()
  const { loading, update } = useUpdate()
  const [formData, setFormData] = useState({
    name: state.name || '',
    email: state.email || '',
    password: '',
  })
  const isDirty =
    formData.name !== (state.name || '') ||
    formData.email !== (state.email || '')

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCancel = () => {
    setFormData({
      name: state.name || '',
      email: state.email || '',
      password: '',
    })
  }

  const handleUserUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userUpdate: User = {
      ...formData,
      username: state.username || '',
      role: state.role || 'user',
    }
    update(userUpdate, onSuccess)
    setFormData((prev) => ({ ...prev, password: '' }))
  }

  return (
    <section className={style.section}>
      <div className={style.editCard}>
        <form onSubmit={handleUserUpdate} className={style.form}>
          <div className={style.field}>
            <label className={style.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInput}
              className={style.input}
              placeholder="Type Full Name here"
              autoComplete="name"
            />
          </div>

          <div className={style.field}>
            <label className={style.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInput}
              className={style.input}
              placeholder="name@example.com"
              autoComplete="email"
            />
          </div>

          <div className={style.field}>
            <label className={style.label}>Confirm with Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInput}
              className={`${style.input} ${style.passwordInput}`}
              placeholder="Enter current password to save changes"
              required
            />
          </div>

          <div className={style.actionArea}>
            <Button
              type="submit"
              disabled={loading || !isDirty || !formData.password}
              className={style.updateBtn}
            >
              {loading ? 'Saving Changes...' : 'Update Profile'}
            </Button>

            <button
              type="button"
              onClick={handleCancel}
              className={style.cancelBtn}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default UpdateUser
