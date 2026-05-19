"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="container" style={{ textAlign: "center", padding: "6rem 0" }}>
      <h1 style={{ fontSize: "4rem", color: "var(--secondary)", marginBottom: "1rem" }}>
        Forge Your Legend
      </h1>
      <p style={{ fontSize: "1.5rem", color: "#aaa", marginBottom: "3rem" }}>
        The ultimate Dungeons & Dragons character creation and management platform.
      </p>
      
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
        {session ? (
          <Link href="/dashboard" key="dashboard-link" className="button" style={{ textDecoration: "none" }}>
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link href="/auth/register" key="register-link" className="button" style={{ textDecoration: "none" }}>
              Register Now
            </Link>
            <Link 
              href="/auth/login" 
              key="login-link"
              className="button" 
              style={{ background: "transparent", border: "1px solid var(--secondary)", color: "var(--secondary)", textDecoration: "none" }}
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
