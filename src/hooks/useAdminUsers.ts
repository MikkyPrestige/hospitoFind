import axios from 'axios'
import { useState, useCallback, useEffect } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from 'react-toastify'
import { UserData } from '@/types/user'

export const useAdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const axiosPrivate = useAxiosPrivate()

  const fetchUsers = useCallback(
    async (requestedPage?: number) => {
      const currentPage = requestedPage || page
      try {
        setIsLoading(true)
        const response = await axiosPrivate.get('/admin/users', {
          params: { page: currentPage },
          skipErrorToast: true,
        })
        const data = response.data
        setUsers(data.users || [])
        setPage(data.page || currentPage)
        setTotalPages(data.totalPages || 1)
        setTotal(data.total || 0)
      } catch (err) {
        console.error('Failed to fetch users', err)
        toast.error(
          'Could not load user directory. Please ensure your session is active.'
        )
      } finally {
        setIsLoading(false)
      }
    },
    [axiosPrivate, page]
  )

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const createUser = async (
    formData: Record<string, unknown>
  ): Promise<boolean> => {
    try {
      await axiosPrivate.post('/admin/users', formData, {
        skipErrorToast: true,
      })
      toast.success('User created successfully!')
      await fetchUsers(page) // refetch current page after creation
      return true
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Error creating user'
      toast.error(message)
      return false
    }
  }

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    if (
      !window.confirm(
        `Are you sure you want to change this user to ${newRole.toUpperCase()}?`
      )
    )
      return

    try {
      await axiosPrivate.patch(
        '/admin/users/role',
        { userId, newRole },
        { skipErrorToast: true }
      )
      toast.success(`Role updated to ${newRole}`)
      await fetchUsers(page)
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : err)
      toast.error('Failed to update role. Please try again.')
    }
  }

  const toggleStatus = async (userId: string) => {
    try {
      const response = await axiosPrivate.patch(
        `/admin/users/${userId}`,
        {},
        { skipErrorToast: true }
      )
      const newStatus = response.data.isActive
      // Update local state without full refetch
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isActive: newStatus } : user
        )
      )
      toast.success(newStatus ? 'User activated' : 'User suspended')
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status. Please try again.')
    }
  }

  const deleteUser = async (id: string, username: string) => {
    if (
      !window.confirm(`PERMANENTLY DELETE ${username}? This cannot be undone.`)
    )
      return
    try {
      await axiosPrivate.delete(`/admin/users/${id}`, {
        skipErrorToast: true,
      })
      toast.success('User permanently removed from the system.')
      await fetchUsers(page) // refetch current page
    } catch {
      toast.error('Failed to execute deletion securely.')
    }
  }

  return {
    users,
    isLoading,
    page,
    totalPages,
    total,
    setPage: (p: number) => setPage(p),
    fetchUsers,
    createUser,
    toggleRole,
    toggleStatus,
    deleteUser,
  }
}
