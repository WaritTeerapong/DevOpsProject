import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 0" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        Welcome to CTF Platform
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#aaa", marginBottom: "2rem" }}>
        Test your skills, solve challenges, and climb the scoreboard.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Link href="/challenges" className="button">
          View Challenges
        </Link>
        <Link href="/scoreboard" className="button" style={{ background: "#333" }}>
          Leaderboard
        </Link>
      </div>
    </div>
  );
}
