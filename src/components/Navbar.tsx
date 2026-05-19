"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="navbar">
      <Link href="/" style={{ color: "var(--primary)", fontSize: "1.5rem", fontWeight: "bold", textDecoration: "none" }}>
        D&D Creator
      </Link>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <Link href="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
        {session ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.9rem" }}>{session.user?.name} ({session.user?.characterCount || 0} chars)</span>
            <button className="button" onClick={() => signOut({ callbackUrl: "/" })} style={{ padding: "0.4rem 0.8rem" }}>Logout</button>
          </div>
        ) : (
          <Link href="/auth/login" className="button" style={{ padding: "0.4rem 0.8rem", textDecoration: "none" }}>Login</Link>
        )}
      </div>
    </nav>
  );
}
