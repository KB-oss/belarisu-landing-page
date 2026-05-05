'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function PageLoader() {
  const [visible, setVisible] = useState<boolean>(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] bg-navy flex flex-col items-center justify-center gap-6"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
              <svg className="w-8 h-8 text-white" viewBox="0 0 32 32" fill="none">
                <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M12 16c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-white font-black text-xl tracking-tight">Bella Risu</p>
            <p className="text-white/40 text-xs tracking-widest uppercase">Medical Centre</p>
          </motion.div>

          <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
