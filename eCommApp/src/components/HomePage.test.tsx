import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

// Mock Header and Footer to isolate HomePage testing
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

const renderWithRouter = () => {
    return render(
        <BrowserRouter>
            <HomePage />
        </BrowserRouter>
    );
};

describe('HomePage', () => {
    it('renders the welcome heading', () => {
        renderWithRouter();
        
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Welcome to the The Daily Harvest!');
    });

    it('renders the products page prompt text', () => {
        renderWithRouter();
        
        expect(screen.getByText('Check out our products page for some great deals.')).toBeInTheDocument();
    });

    it('renders the Header component', () => {
        renderWithRouter();
        
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders the Footer component', () => {
        renderWithRouter();
        
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('has the app class on container', () => {
        const { container } = renderWithRouter();
        
        expect(container.querySelector('.app')).toBeInTheDocument();
    });

    it('has the main-content class on main element', () => {
        const { container } = renderWithRouter();
        
        expect(container.querySelector('.main-content')).toBeInTheDocument();
    });

    it('renders main element', () => {
        renderWithRouter();
        
        expect(document.querySelector('main')).toBeInTheDocument();
    });
});
