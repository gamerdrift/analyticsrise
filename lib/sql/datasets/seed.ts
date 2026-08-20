/**
 * Deterministic Pseudo-Random Number Generator (PRNG) for synthetic datasets
 * Utilizes a Linear Congruential Generator (LCG) to ensure 100% reproducible data.
 */
export class DeterministicRNG {
  private state: number;

  constructor(seed: number = 42) {
    this.state = seed % 2147483647;
    if (this.state <= 0) this.state += 2147483646;
  }

  /**
   * Generates a floating point number in range [0, 1)
   */
  public next(): number {
    this.state = (this.state * 16807) % 2147483647;
    return (this.state - 1) / 2147483646;
  }

  /**
   * Generates an integer in range [min, max] inclusive
   */
  public intBetween(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Generates a float with specified decimal places
   */
  public floatBetween(min: number, max: number, decimals: number = 2): number {
    const val = this.next() * (max - min) + min;
    const factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  }

  /**
   * Picks a random element from an array
   */
  public choice<T>(items: T[]): T {
    const idx = this.intBetween(0, items.length - 1);
    return items[idx];
  }

  /**
   * Picks random element or returns null based on nullProbability
   */
  public choiceOrNull<T>(items: T[], nullProbability: number = 0.1): T | null {
    if (this.next() < nullProbability) {
      return null;
    }
    return this.choice(items);
  }

  /**
   * Generates a formatted ISO date string within range
   */
  public dateBetween(startDateStr: string, endDateStr: string): string {
    const startMs = new Date(startDateStr).getTime();
    const endMs = new Date(endDateStr).getTime();
    const targetMs = startMs + this.next() * (endMs - startMs);
    const d = new Date(targetMs);
    return d.toISOString().split('T')[0];
  }
}
