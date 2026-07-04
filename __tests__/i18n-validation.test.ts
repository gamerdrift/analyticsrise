import { validateTranslationObject, findDuplicateKeys } from '@/lib/i18n/validation';

describe('translation validation', () => {
  it('reports placeholder mismatches for the same translation key', () => {
    const reference = {
      dashboard: {
        welcome: 'Hello {name}',
      },
    };

    const target = {
      dashboard: {
        welcome: 'Hola {fullName}',
      },
    };

    const result = validateTranslationObject(reference, target, 'es');

    expect(result.placeholderMismatches).toEqual([
      {
        key: 'dashboard.welcome',
        expected: ['name'],
        actual: ['fullName'],
      },
    ]);
  });

  it('detects duplicate keys in raw JSON content', () => {
    const content = '{"common": {"save": "Save", "save": "Save again"}}';

    expect(findDuplicateKeys(content)).toEqual(['save']);
  });
});
