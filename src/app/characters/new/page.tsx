"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DiceRoller } from "@/shared/DiceRoller";

const RACES = ["Human", "Elf", "Dwarf", "Halfling", "Dragonborn", "Tiefling"];
const CLASSES = ["Fighter", "Wizard", "Rogue", "Cleric", "Paladin", "Bard", "Ranger"];

export default function CreateCharacterPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    race: RACES[0],
    class: CLASSES[0],
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    skills: [] as string[],
  });

  const handleStatChange = (stat: string, value: number) => {
    setFormData({
      ...formData,
      stats: { ...formData.stats, [stat]: Math.max(1, Math.min(30, value)) },
    });
  };

  const handleRollStats = () => {
    const rolledStats = DiceRoller.rollAllStats();
    setFormData({ ...formData, stats: rolledStats });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return alert("Please login first");
    
    setLoading(true);
    try {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Character Created Successfully!");
        router.push("/dashboard");
        router.refresh();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (error) {
      alert("Failed to create character");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return <div className="container">Please login to create a character.</div>;

  return (
    <div className="container">
      <h1 style={{ color: "var(--secondary)", marginBottom: "2rem" }}>Forge a New Hero</h1>
      
      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <label>Character Name</label>
          <input
            type="text"
            className="input"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Drizzt Do'Urden"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <label>Race</label>
            <select
              className="input"
              value={formData.race}
              onChange={(e) => setFormData({ ...formData, race: e.target.value })}
            >
              {RACES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label>Class</label>
            <select
              className="input"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            >
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ borderBottom: "1px solid var(--primary)", paddingBottom: "0.5rem", margin: 0 }}>Ability Scores</h3>
          <button 
            type="button" 
            className="button" 
            style={{ background: "transparent", border: "1px solid var(--secondary)", color: "var(--secondary)", padding: "0.3rem 0.8rem", fontSize: "0.8rem" }}
            onClick={handleRollStats}
          >
            🎲 Roll All Stats
          </button>
        </div>

        <div className="stats-grid">
          {Object.entries(formData.stats).map(([stat, val]) => (
            <div key={stat} className="stat-box">
              <label style={{ fontSize: "0.7rem", display: "block", textTransform: "uppercase" }}>{stat.slice(0,3)}</label>
              <input
                type="number"
                style={{ width: "100%", background: "transparent", border: "none", color: "white", textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" }}
                value={val}
                onChange={(e) => handleStatChange(stat, parseInt(e.target.value))}
              />
            </div>
          ))}
        </div>

        <button type="submit" className="button" style={{ width: "100%", marginTop: "2rem" }} disabled={loading}>
          {loading ? "Forging..." : "Create Character"}
        </button>
      </form>
    </div>
  );
}
