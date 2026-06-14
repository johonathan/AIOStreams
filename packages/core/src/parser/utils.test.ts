import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/index.js', () => ({
  createLogger: () => ({
    silly: vi.fn(),
  }),
}));

let cleanTitle: typeof import('./utils.js').cleanTitle;

beforeAll(async () => {
  ({ cleanTitle } = await import('./utils.js'));
});

describe('cleanTitle', () => {
  it('can fold Swedish characters without German umlaut expansion', () => {
    expect(
      cleanTitle('Förrädarna', { umlautNormalisation: 'ascii-folding' })
    ).toBe('forradarna');
    expect(cleanTitle('Å ä ö', { umlautNormalisation: 'ascii-folding' })).toBe(
      'a a o'
    );
  });

  it('can fold Danish, Norwegian, and Icelandic characters Sonarr-style', () => {
    expect(
      cleanTitle('Forræder Ørnen På Ríkið Þing', {
        umlautNormalisation: 'ascii-folding',
      })
    ).toBe('forraeder ornen pa rikid thing');
  });

  it('keeps German umlaut transliteration by default', () => {
    expect(cleanTitle('Mädchen')).toBe('maedchen');
    expect(cleanTitle('Förrädarna')).toBe('foerraedarna');
  });
});
