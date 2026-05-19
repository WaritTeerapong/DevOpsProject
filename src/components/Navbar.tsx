"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="navbar">
      <Link href="/" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        CTF PLATFORM
      </Link>
      <div className="nav-links">
        <Link href="/challenges">Challenges</Link>
        <Link href="/scoreboard">Scoreboard</Link>
      </div>
      <div>
        {session ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>{session.user?.name} ({session.user?.score || 0} pts)</span>
            <button className="button" onClick={() => signOut()}>
              Logout
            </button>
          </div>
        ) : (
          <button className="button" onClick={() => signIn("google")}>
            Login with Google
          </button>
        )}
      </div>
    </nav>
  );
}
