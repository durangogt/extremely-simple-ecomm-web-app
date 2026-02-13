import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
    it('renders the footer element', () => {
        render(<Footer />);
        
        const footer = document.querySelector('footer');
        expect(footer).toBeInTheDocument();
    });

    it('displays the copyright text', () => {
        render(<Footer />);
        
        expect(screen.getByText(/2025 The Daily Harvest/)).toBeInTheDocument();
    });

    it('displays all rights reserved text', () => {
        render(<Footer />);
        
        expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    });

    it('has the correct class name', () => {
        render(<Footer />);
        
        const footer = document.querySelector('footer');
        expect(footer).toHaveClass('app-footer');
    });
});
