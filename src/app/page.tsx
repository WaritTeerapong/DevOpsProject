import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container" style={{ textAlign: "center", padding: "6rem 0" }}>
      <h1 style={{ fontSize: "4rem", color: "var(--secondary)", marginBottom: "1rem" }}>
        Forge Your Legend
      </h1>
      <p style={{ fontSize: "1.5rem", color: "#aaa", marginBottom: "3rem" }}>
        The ultimate Dungeons & Dragons character creation and management platform.
      </p>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
        <Link href="/dashboard" className="button" style={{ textDecoration: "none" }}>
          Explore Dashboard
        </Link>
        <button className="button" style={{ background: "transparent", border: "1px solid var(--secondary)", color: "var(--secondary)" }}>
          How it Works
        </button>
      </div>
    </div>
  );
}
