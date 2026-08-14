import { describe, it, expect } from 'vitest';
import { formatUpvoteCount, GH_SCHOOLS, TECH_TAGS } from '../../../packages/shared/src/index';

describe('formatUpvoteCount', () => {
  it('returns small counts as plain numbers', () => {
    expect(formatUpvoteCount(0)).toBe('0');
    expect(formatUpvoteCount(42)).toBe('42');
    expect(formatUpvoteCount(999)).toBe('999');
  });

  it('formats counts of 1000 or more as a "k" suffix with one decimal', () => {
    expect(formatUpvoteCount(1000)).toBe('1.0k');
    expect(formatUpvoteCount(1234)).toBe('1.2k');
    expect(formatUpvoteCount(15750)).toBe('15.8k');
  });
});

describe('GH_SCHOOLS / TECH_TAGS', () => {
  it('every school has a unique id', () => {
    const ids = GH_SCHOOLS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('exposes a non-empty list of tech tags', () => {
    expect(TECH_TAGS.length).toBeGreaterThan(0);
  });
});
