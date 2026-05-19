/**
 * D&D Stat Rolling Logic (Standard: 4d6 drop the lowest)
 */
export class DiceRoller {
  public static rollStat(): number {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    // Sort and remove the lowest
    rolls.sort((a, b) => a - b);
    rolls.shift(); 
    return rolls.reduce((sum, current) => sum + current, 0);
  }

  public static rollAllStats() {
    return {
      strength: this.rollStat(),
      dexterity: this.rollStat(),
      constitution: this.rollStat(),
      intelligence: this.rollStat(),
      wisdom: this.rollStat(),
      charisma: this.rollStat(),
    };
  }
}
