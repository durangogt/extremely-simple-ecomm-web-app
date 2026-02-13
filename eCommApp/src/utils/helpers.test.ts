import { describe, it, expect } from 'vitest';
import { formatPrice, calculateTotal, validateEmail } from './helpers';

describe('formatPrice', () => {
    it('formats a whole number price correctly', () => {
        expect(formatPrice(10)).toBe('$10.00');
    });

    it('formats a decimal price correctly', () => {
        expect(formatPrice(29.99)).toBe('$29.99');
    });

    it('formats zero correctly', () => {
        expect(formatPrice(0)).toBe('$0.00');
    });

    it('formats large prices correctly', () => {
        expect(formatPrice(1234567.89)).toBe('$1,234,567.89');
    });

    it('rounds to two decimal places', () => {
        expect(formatPrice(10.999)).toBe('$11.00');
    });

    it('handles negative prices', () => {
        expect(formatPrice(-5.99)).toBe('-$5.99');
    });

    it('formats small decimal values', () => {
        expect(formatPrice(0.01)).toBe('$0.01');
    });
});

describe('calculateTotal', () => {
    it('calculates total for multiple items', () => {
        const items = [
            { price: 10, quantity: 2 },
            { price: 5, quantity: 3 }
        ];
        expect(calculateTotal(items)).toBe(35);
    });

    it('returns 0 for empty array', () => {
        expect(calculateTotal([])).toBe(0);
    });

    it('calculates total for single item', () => {
        const items = [{ price: 29.99, quantity: 1 }];
        expect(calculateTotal(items)).toBe(29.99);
    });

    it('handles items with zero quantity', () => {
        const items = [
            { price: 10, quantity: 0 },
            { price: 5, quantity: 2 }
        ];
        expect(calculateTotal(items)).toBe(10);
    });

    it('handles decimal prices correctly', () => {
        const items = [
            { price: 19.99, quantity: 2 },
            { price: 5.50, quantity: 3 }
        ];
        expect(calculateTotal(items)).toBeCloseTo(56.48);
    });

    it('handles large quantities', () => {
        const items = [{ price: 1.00, quantity: 1000 }];
        expect(calculateTotal(items)).toBe(1000);
    });
});

describe('validateEmail', () => {
    it('returns true for valid email', () => {
        expect(validateEmail('test@example.com')).toBe(true);
    });

    it('returns true for email with subdomain', () => {
        expect(validateEmail('user@mail.example.com')).toBe(true);
    });

    it('returns true for email with plus sign', () => {
        expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('returns true for email with numbers', () => {
        expect(validateEmail('user123@example123.com')).toBe(true);
    });

    it('returns false for email without @', () => {
        expect(validateEmail('testexample.com')).toBe(false);
    });

    it('returns false for email without domain', () => {
        expect(validateEmail('test@')).toBe(false);
    });

    it('returns false for email without username', () => {
        expect(validateEmail('@example.com')).toBe(false);
    });

    it('returns false for email with spaces', () => {
        expect(validateEmail('test @example.com')).toBe(false);
    });

    it('returns false for empty string', () => {
        expect(validateEmail('')).toBe(false);
    });

    it('returns false for email without TLD', () => {
        expect(validateEmail('test@example')).toBe(false);
    });

    it('returns true for email with hyphen in domain', () => {
        expect(validateEmail('test@my-example.com')).toBe(true);
    });

    it('returns true for email with underscore', () => {
        expect(validateEmail('test_user@example.com')).toBe(true);
    });

    it('returns true for email with dots in username', () => {
        expect(validateEmail('first.last@example.com')).toBe(true);
    });
});
