import React from 'react'
import { motion } from 'framer-motion'

interface SectionRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}

export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}) => {
  const getInitial = () => {
    switch (direction) {
      case 'down':
        return { opacity: 0, y: -32, x: 0 }
      case 'left':
        return { opacity: 0, y: 0, x: 32 }
      case 'right':
        return { opacity: 0, y: 0, x: -32 }
      case 'up':
      default:
        return { opacity: 0, y: 32, x: 0 }
    }
  }

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: false, amount: 0.14 }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface HeaderTextRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export const HeaderTextReveal: React.FC<HeaderTextRevealProps> = ({
  children,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{
        duration: 0.58,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default SectionReveal
