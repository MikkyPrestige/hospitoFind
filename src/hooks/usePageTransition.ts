import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function usePageTransition() {
  const [transitionClass, setTransitionClass] = useState('pageTransition')
  const location = useLocation()

  useEffect(() => {
    const exitTimer = setTimeout(
      () => setTransitionClass('pageTransitionExit'),
      0
    )
    const enterTimer = setTimeout(
      () => setTransitionClass('pageTransition'),
      400
    )

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(enterTimer)
    }
  }, [location.pathname])

  return transitionClass
}
