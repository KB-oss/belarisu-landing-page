'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function PageLoader() {
  const [visible, setVisible] = useState<boolean>(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3500)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] bg-navy flex flex-col items-center justify-center gap-6"
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-22 h-22 rounded-2xl  flex items-center justify-center">
              <img src="/LIGHT.webp" alt="" />
            </div>
            {/* <p className="text-white font-black text-xl tracking-tight">Belarisu</p>
            <p className="text-white/40 text-xs tracking-widest uppercase">Medical Centre</p> */}
          </motion.div>

          <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
