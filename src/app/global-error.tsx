"use client";

// Simple global error page for Next.js 15 / React 19 compatibility
// Avoiding any complex hooks or context during static generation
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          fontFamily: 'sans-serif'
        }}>
          <h2>Something went wrong!</h2>
          <p style={{ color: '#666' }}>{error?.message || "An unexpected error occurred."}</p>
          <button 
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#8b0000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
