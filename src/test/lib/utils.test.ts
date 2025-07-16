import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    });

    it('should handle conditional classes', () => {
      const condition1 = true;
      const condition2 = false;
      expect(cn('base-class', condition1 && 'conditional-class')).toBe(
        'base-class conditional-class'
      );
      expect(cn('base-class', condition2 && 'conditional-class')).toBe(
        'base-class'
      );
    });

    it('should handle arrays of classes', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
    });

    it('should handle undefined and null values', () => {
      expect(cn('base-class', undefined, null)).toBe('base-class');
    });

    it('should merge conflicting Tailwind classes', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
      expect(cn('p-4', 'px-2')).toBe('p-4 px-2');
    });
  });
});
