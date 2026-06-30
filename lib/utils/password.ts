export type StrengthLabel = 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Excellent';

export interface PasswordStrength {
  score: number; // 0-4
  label: StrengthLabel;
  suggestions: string[];
}

/**
 * Evaluate password strength based on length and character variety.
 * Returns a score (0‑4) and a human‑readable label.
 */
export function evaluatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const suggestions: string[] = [];

  // Length check (>=12 chars)
  if (password.length >= 12) {
    score++;
  } else {
    suggestions.push('Use at least 12 characters');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    suggestions.push('Add uppercase letters');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    suggestions.push('Add lowercase letters');
  }

  // Number check
  if (/\d/.test(password)) {
    score++;
  } else {
    suggestions.push('Include numbers');
  }

  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  } else {
    suggestions.push('Include special characters');
  }

  const labels: StrengthLabel[] = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Excellent'];
  const label = labels[score] as StrengthLabel;

  return { score, label, suggestions };
}
