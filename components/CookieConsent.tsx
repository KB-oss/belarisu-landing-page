'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'

export type ConsentChoice = 'all' | 'essential'
/* 'unknown' = not yet read (server render / first paint), 'none' = no choice made. */
export type ConsentState = 'unknown' | 'none' | ConsentChoice

const KEY = 'bmc.cookie-consent'

const listeners = new Set<() => void>()
function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

/* localStorage throws outright in some privacy modes, so every access is
   guarded — a site that can't remember the choice should still render. */
function clientSnapshot(): ConsentState {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'all' || v === 'essential' ? v : 'none'
  } catch {
    return 'none'
  }
}

/* Server and first paint report 'unknown' so nothing flashes in before the
   stored choice is known. */
const serverSnapshot = (): ConsentState => 'unknown'

export function useConsentState(): ConsentState {
  return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot)
}

export function setConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(KEY, choice)
  } catch {
    /* Not persistable — the in-memory notify below still hides the banner. */
  }
  listeners.forEach(l => l())
}

const NAVY = '#071e36'
const ORANGE = '#ff7518'

export default function CookieConsent() {
  const consent = useConsentState()
  if (consent !== 'none') return null

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      /* Above the donate FAB (z-40), below the first-visit modal (z-60). */
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div
        className="w-full max-w-[860px] mx-auto rounded-[18px] px-6 py-6 sm:px-8 sm:py-7 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8"
        style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.14)' }}
      >
        <div className="lg:flex-1">
          <p id="cookie-consent-title" className="text-white font-black text-[15px] tracking-tight mb-1.5">
            Cookies on this site
          </p>
          <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            We use essential cookies to make this site work. With your consent we&rsquo;d also use
            analytics cookies to understand how the site is used. See our{' '}
            <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-white transition-colors" style={{ color: ORANGE }}>
              privacy policy
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setConsent('essential')}
            className="font-bold text-[13px] px-6 py-3 rounded-full border transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: 'rgba(255,255,255,0.28)', color: '#fff', outlineColor: ORANGE }}
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => setConsent('all')}
            className="font-black text-[13px] px-6 py-3 rounded-full transition-colors hover:bg-white hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: ORANGE, color: '#fff', outlineColor: '#fff' }}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}
