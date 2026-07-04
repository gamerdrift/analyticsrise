const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '..', 'messages');
const baseLang = 'en';
const targetLangs = ['es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja', 'ko', 'ru'];

// Helper to recursively collect all keys from a nested object
function collectKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        keys = keys.concat(collectKeys(obj[key], path));
      } else {
        keys.push(path);
      }
    }
  }
  return keys;
}

// Helper to extract nested values
function getNestedValue(obj, pathStr) {
  return pathStr.split('.').reduce((current, segment) => {
    return current && current[segment] !== undefined ? current[segment] : undefined;
  }, obj);
}

// Find duplicate keys in raw JSON string
function findDuplicateKeys(content) {
  const matches = content.matchAll(/"([^"]+)"\s*:/g);
  const seen = new Set();
  const duplicates = new Set();

  for (const match of matches) {
    const key = match[1];
    if (seen.has(key)) {
      duplicates.add(key);
    }
    seen.add(key);
  }
  return Array.from(duplicates);
}

// Main execution
console.log('=========================================================');
console.log('ANALYTICSRISE TRANSLATION VALIDATOR');
console.log('=========================================================\n');

let totalIssues = 0;

if (!fs.existsSync(messagesDir)) {
  console.error(`Error: Messages directory not found at ${messagesDir}`);
  process.exit(1);
}

// 1. Read base English files
const baseModules = {};
const baseFiles = fs.readdirSync(path.join(messagesDir, baseLang));

baseFiles.forEach(file => {
  if (path.extname(file) === '.json') {
    const moduleName = path.basename(file, '.json');
    const content = fs.readFileSync(path.join(messagesDir, baseLang, file), 'utf8');
    try {
      baseModules[moduleName] = {
        data: JSON.parse(content),
        raw: content
      };
    } catch (e) {
      console.error(`❌ Malformed JSON in base language English module [${file}]:`, e.message);
      totalIssues++;
    }
  }
});

// 2. Validate target languages
targetLangs.forEach(lang => {
  const langDir = path.join(messagesDir, lang);
  if (!fs.existsSync(langDir)) {
    console.warn(`⚠️ Warning: Directory for language '${lang}' not found.`);
    return;
  }

  console.log(`Auditing language: [${lang.toUpperCase()}]`);
  let langIssues = 0;

  const targetFiles = fs.readdirSync(langDir);

  targetFiles.forEach(file => {
    if (path.extname(file) !== '.json') return;
    const moduleName = path.basename(file, '.json');
    const filePath = path.join(langDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check 1: Malformed JSON
    let targetData;
    try {
      targetData = JSON.parse(content);
    } catch (e) {
      console.error(`  ❌ [${file}] Malformed JSON:`, e.message);
      langIssues++;
      totalIssues++;
      return;
    }

    // Check 2: Duplicate Keys
    const duplicates = findDuplicateKeys(content);
    if (duplicates.length > 0) {
      console.warn(`  ⚠️ [${file}] Duplicate keys found:`, duplicates.join(', '));
      langIssues++;
      totalIssues++;
    }

    // Compare with English base
    const baseModule = baseModules[moduleName];
    if (!baseModule) {
      console.warn(`  ⚠️ [${file}] Module does not exist in English (unused module file)`);
      langIssues++;
      totalIssues++;
      return;
    }

    const baseKeys = collectKeys(baseModule.data);
    const targetKeys = collectKeys(targetData);

    // Check 3: Missing Keys
    const missingKeys = baseKeys.filter(k => !targetKeys.includes(k));
    if (missingKeys.length > 0) {
      console.error(`  ❌ [${file}] Missing keys (${missingKeys.length}):`);
      missingKeys.slice(0, 5).forEach(k => console.error(`     - ${k}`));
      if (missingKeys.length > 5) console.error(`     - ... and ${missingKeys.length - 5} more`);
      langIssues += missingKeys.length;
      totalIssues += missingKeys.length;
    }

    // Check 4: Unused Keys
    const unusedKeys = targetKeys.filter(k => !baseKeys.includes(k));
    if (unusedKeys.length > 0) {
      console.warn(`  ⚠️ [${file}] Unused keys (${unusedKeys.length}):`);
      unusedKeys.slice(0, 5).forEach(k => console.warn(`     - ${k}`));
      if (unusedKeys.length > 5) console.warn(`     - ... and ${unusedKeys.length - 5} more`);
      langIssues += unusedKeys.length;
      totalIssues += unusedKeys.length;
    }

    // Check 5: Inconsistent Placeholders
    targetKeys.forEach(key => {
      if (missingKeys.includes(key) || unusedKeys.includes(key)) return;
      const baseVal = getNestedValue(baseModule.data, key);
      const targetVal = getNestedValue(targetData, key);

      if (typeof baseVal === 'string' && typeof targetVal === 'string') {
        const basePlaceholders = Array.from(baseVal.matchAll(/\{(\w+)\}/g), m => m[1]);
        const targetPlaceholders = Array.from(targetVal.matchAll(/\{(\w+)\}/g), m => m[1]);

        const baseSet = [...new Set(basePlaceholders)].sort();
        const targetSet = [...new Set(targetPlaceholders)].sort();

        const mismatch = baseSet.length !== targetSet.length || !baseSet.every((v, i) => v === targetSet[i]);
        if (mismatch) {
          console.error(`  ❌ [${file}] Placeholder mismatch at key "${key}":`);
          console.error(`     Expected: ${baseSet.join(', ') || '(none)'}`);
          console.error(`     Actual:   ${targetSet.join(', ') || '(none)'}`);
          langIssues++;
          totalIssues++;
        }
      }
    });
  });

  if (langIssues === 0) {
    console.log(`  ✅ All checks passed! No issues detected.\n`);
  } else {
    console.log(`  ❌ Audited with ${langIssues} issue(s).\n`);
  }
});

console.log('=========================================================');
if (totalIssues === 0) {
  console.log('✅ AUDIT COMPLETE: System is fully synchronized!');
  process.exit(0);
} else {
  console.error(`❌ AUDIT FAILED: Found ${totalIssues} issue(s) total across target files.`);
  process.exit(1);
}
