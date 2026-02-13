import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header', () => {
    it('renders the site title', () => {
        renderWithRouter(<Header />);
        
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('The Daily Harvest');
    });

    it('renders the Home link', () => {
        renderWithRouter(<Header />);
        
        const homeLink = screen.getByRole('link', { name: 'Home' });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders the Products link', () => {
        renderWithRouter(<Header />);
        
        const productsLink = screen.getByRole('link', { name: 'Products' });
        expect(productsLink).toBeInTheDocument();
        expect(productsLink).toHaveAttribute('href', '/products');
    });

    it('renders the Cart link', () => {
        renderWithRouter(<Header />);
        
        const cartLink = screen.getByRole('link', { name: 'Cart' });
        expect(cartLink).toBeInTheDocument();
        expect(cartLink).toHaveAttribute('href', '/cart');
    });

    it('renders the Admin Login button inside a link', () => {
        renderWithRouter(<Header />);
        
        const loginLink = screen.getByRole('link', { name: 'Admin Login' });
        expect(loginLink).toBeInTheDocument();
        expect(loginLink).toHaveAttribute('href', '/login');
        
        const loginButton = screen.getByRole('button', { name: 'Admin Login' });
        expect(loginButton).toBeInTheDocument();
    });

    it('renders the header element with correct class', () => {
        renderWithRouter(<Header />);
        
        const header = document.querySelector('header');
        expect(header).toBeInTheDocument();
        expect(header).toHaveClass('app-header');
    });

    it('contains a navigation element', () => {
        renderWithRouter(<Header />);
        
        const nav = document.querySelector('nav');
        expect(nav).toBeInTheDocument();
    });

    it('has all four navigation links', () => {
        renderWithRouter(<Header />);
        
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(4);
    });
});
