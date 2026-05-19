"use client";

import React from "react";

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
        <div style={{ textAlign: "center", padding: "2rem", fontFamily: "sans-serif" }}>
          <h2>Something went wrong!</h2>
          <p style={{ color: "#666" }}>{error?.message || "An unexpected error occurred."}</p>
          <button 
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1rem",
              background: "#8b0000",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
