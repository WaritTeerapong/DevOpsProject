'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
      <h1 style={{ color: 'var(--primary)' }}>Critical Critical!</h1>
      <h2>Something went wrong in the dungeon.</h2>
      <button
        className="button"
        style={{ marginTop: '2rem' }}
        onClick={() => reset()}
      >
        Roll for Initiative (Retry)
      </button>
    </div>
  )
}
