export interface TranslationValidationIssue {
  key: string;
  expected?: string[];
  actual?: string[];
}

export interface TranslationValidationResult {
  missingKeys: string[];
  duplicateKeys: string[];
  unusedKeys: string[];
  malformedJson: string[];
  placeholderMismatches: TranslationValidationIssue[];
}

export function collectNestedKeys(value: Record<string, any>, prefix = ''): string[] {
  return Object.entries(value).flatMap(([key, currentValue]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    if (currentValue && typeof currentValue === 'object' && !Array.isArray(currentValue)) {
      return collectNestedKeys(currentValue as Record<string, any>, nextPrefix);
    }
    return [nextPrefix];
  });
}

export function validateTranslationObject(
  reference: Record<string, any>,
  target: Record<string, any>,
  _locale: string,
): TranslationValidationResult {
  const referenceKeys = collectNestedKeys(reference);
  const targetKeys = collectNestedKeys(target);
  const missingKeys = referenceKeys.filter((key) => !targetKeys.includes(key));

  const placeholderMismatches = referenceKeys
    .filter((key) => targetKeys.includes(key))
    .flatMap((key) => {
      const referenceValue = extractValue(reference, key);
      const targetValue = extractValue(target, key);
      if (typeof referenceValue !== 'string' || typeof targetValue !== 'string') {
        return [];
      }

      const expectedPlaceholders = Array.from(referenceValue.matchAll(/\{(\w+)\}/g), (m) => m[1]);
      const actualPlaceholders = Array.from(targetValue.matchAll(/\{(\w+)\}/g), (m) => m[1]);
      const normalizedExpected = [...new Set(expectedPlaceholders)];
      const normalizedActual = [...new Set(actualPlaceholders)];

      if (normalizedExpected.length === normalizedActual.length && normalizedExpected.every((value, index) => value === normalizedActual[index])) {
        return [];
      }

      return [{
        key,
        expected: normalizedExpected,
        actual: normalizedActual,
      }];
    });

  return {
    missingKeys,
    duplicateKeys: [],
    unusedKeys: targetKeys.filter((key) => !referenceKeys.includes(key)),
    malformedJson: [],
    placeholderMismatches,
  };
}

export function findDuplicateKeys(content: string): string[] {
  const matches = content.matchAll(/"([^"]+)"\s*:/g);
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const match of matches) {
    const key = match[1];
    if (seen.has(key)) {
      duplicates.add(key);
    }
    seen.add(key);
  }

  return Array.from(duplicates);
}

export function findUnusedKeys<T extends Record<string, any>>(translations: T, usedKeys: string[]): string[] {
  const keys = collectNestedKeys(translations);
  return keys.filter((key) => !usedKeys.includes(key));
}

function extractValue(source: Record<string, any>, key: string): unknown {
  return key.split('.').reduce<unknown>((current, segment) => {
    if (current && typeof current === 'object' && segment in current) {
      return (current as Record<string, any>)[segment];
    }
    return undefined;
  }, source);
}
