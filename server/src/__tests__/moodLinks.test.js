const { getMoodLinks } = require('../utils/moodLinks');

describe('getMoodLinks', () => {
  test('should return links for happy mood', () => {
    const links = getMoodLinks('happy', 0.8);
    expect(links).toBeDefined();
    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveProperty('title');
    expect(links[0]).toHaveProperty('url');
    expect(links[0]).toHaveProperty('type');
    expect(links[0]).toHaveProperty('icon');
  });

  test('should return links for sad mood', () => {
    const links = getMoodLinks('sad', 0.7);
    expect(links).toBeDefined();
    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBeGreaterThan(0);
  });

  test('should adjust number of links based on confidence', () => {
    const highConfidenceLinks = getMoodLinks('excited', 0.9);
    const lowConfidenceLinks = getMoodLinks('excited', 0.3);
    expect(highConfidenceLinks.length).toBeGreaterThanOrEqual(lowConfidenceLinks.length);
  });

  test('should return default links for unknown mood', () => {
    const links = getMoodLinks('unknown-mood-xyz', 0.5);
    expect(links).toBeDefined();
    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBeGreaterThan(0);
  });

  test('should handle case-insensitive mood matching', () => {
    const links1 = getMoodLinks('HAPPY', 0.8);
    const links2 = getMoodLinks('happy', 0.8);
    expect(links1.length).toBe(links2.length);
  });
});

