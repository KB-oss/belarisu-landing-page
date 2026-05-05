'use client'

import { motion, type Variants } from 'framer-motion'
import React from 'react'

/* ─── Base reveal variants ─────────────────────────────────────── */
const variants: Record<string, Variants> = {
  up:    { hidden: { opacity: 0, y: 56, scale: 0.97, filter: 'blur(10px)' }, visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } },
  down:  { hidden: { opacity: 0, y: -56, scale: 0.97, filter: 'blur(10px)' }, visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } },
  left:  { hidden: { opacity: 0, x: 72, filter: 'blur(10px)' },   visible: { opacity: 1, x: 0, filter: 'blur(0px)' } },
  right: { hidden: { opacity: 0, x: -72, filter: 'blur(10px)' },  visible: { opacity: 1, x: 0, filter: 'blur(0px)' } },
  fade:  { hidden: { opacity: 0, filter: 'blur(8px)' },            visible: { opacity: 1, filter: 'blur(0px)' } },
  scale: { hidden: { opacity: 0, scale: 0.88, filter: 'blur(10px)' }, visible: { opacity: 1, scale: 1, filter: 'blur(0px)' } },
}

type Direction = keyof typeof variants

/* ─── Stagger container (wraps children that each have their own motion) ── */
const staggerContainer = (stagger = 0.1, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
})

interface RevealProps {
  children: React.ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  ease?: number[]
  className?: string
  as?: keyof typeof motion
  stagger?: number
  staggerDelay?: number
}

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  ease = [0.22, 1, 0.36, 1],
  className = '',
  as: Tag = 'div',
  /* stagger mode: renders a container that staggers direct children */
  stagger = 0,
  staggerDelay = 0,
}: RevealProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MotionTag = (motion as any)[Tag] ?? motion.div

  if (stagger) {
    return (
      <MotionTag
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer(stagger, staggerDelay)}
      >
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={variants[direction]}
      transition={{ duration, delay, ease }}
    >
      {children}
    </MotionTag>
  )
}

/* ─── RevealItem — use inside a <Reveal stagger> parent ─────────── */
interface RevealItemProps {
  children: React.ReactNode
  direction?: Direction
  duration?: number
  ease?: number[]
  className?: string
  as?: keyof typeof motion
}

export function RevealItem({
  children,
  direction = 'up',
  duration = 0.65,
  ease = [0.22, 1, 0.36, 1],
  className = '',
  as: Tag = 'div',
}: RevealItemProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MotionTag = (motion as any)[Tag] ?? motion.div
  return (
    <MotionTag
      className={className}
      variants={variants[direction]}
      transition={{ duration, ease }}
    >
      {children}
    </MotionTag>
  )
}

/* ─── WordReveal — animates each word individually ──────────────── */
interface WordRevealProps {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  stagger?: number
}

export function WordReveal({ text, className = '', wordClassName = '', delay = 0, stagger = 0.08 }: WordRevealProps) {
  const words = text.split(' ')
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className={`inline-block ${wordClassName}`}
          style={{ marginRight: '0.28em' }}
          variants={{
            hidden: { opacity: 0, y: 28, rotateX: -20, filter: 'blur(8px)' },
            visible: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
