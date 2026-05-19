import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
      <h1 style={{ fontSize: '5rem', color: 'var(--secondary)' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ margin: '2rem 0', color: '#aaa' }}>The legend you are looking for has vanished into the mist.</p>
      <Link href="/" className="button" style={{ textDecoration: 'none' }}>
        Return to Safety
      </Link>
    </div>
  )
}
