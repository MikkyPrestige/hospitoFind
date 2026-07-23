import { motion, Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ReactNode } from 'react'
import { fadeUp } from '@/utils/animations'

const MotionLinkComponent = motion(Link)

interface MotionLinkProps {
  to: string
  children: ReactNode
  className?: string
  variants?: Variants
  once?: boolean
  initial?: string
  animate?: string
  alwaysVisible?: boolean
  style?: React.CSSProperties
}

const MotionLink: React.FC<MotionLinkProps> = ({
  to,
  children,
  className,
  variants = fadeUp,
  once = false,
  initial,
  animate,
  alwaysVisible = false,
  style,
}) => {
  const shouldUseViewport = !animate && !alwaysVisible

  return (
    <MotionLinkComponent
      to={to}
      className={className}
      variants={variants}
      initial={initial || 'hidden'}
      whileInView={!alwaysVisible ? animate || 'visible' : undefined}
      animate={alwaysVisible ? animate || 'visible' : undefined}
      viewport={shouldUseViewport ? { once, amount: 0.2 } : undefined}
      style={{ overflow: 'hidden', ...style }}
    >
      {children}
    </MotionLinkComponent>
  )
}

export default MotionLink
