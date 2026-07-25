import axios from 'axios'
import { useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from 'react-toastify'

export const useSpellDictionary = () => {
  const axiosPrivate = useAxiosPrivate()
  const [rebuilding, setRebuilding] = useState(false)

  const rebuildDictionary = async () => {
    setRebuilding(true)
    try {
      const { data } = await axiosPrivate.post(
        '/admin/rebuild-spell-dictionary'
      )
      toast.success(data.message || 'Spelling dictionary rebuilt.')
      return data
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to rebuild spelling dictionary.'
      toast.error(msg)
      throw err
    } finally {
      setRebuilding(false)
    }
  }

  return { rebuildDictionary, rebuilding }
}
