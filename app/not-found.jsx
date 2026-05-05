import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ background: '#fdfcfb' }}>
      <p className="text-accent text-sm font-bold tracking-[3px] uppercase mb-3">404</p>
      <h1 className="text-navy font-black text-5xl mb-4">Page not found</h1>
      <p className="text-muted text-lg mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="bg-accent text-white font-bold px-8 py-3 rounded-full hover:bg-accent-dark transition-colors">
        Go home
      </Link>
    </div>
  )
}
