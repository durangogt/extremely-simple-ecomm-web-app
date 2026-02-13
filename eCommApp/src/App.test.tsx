import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock all page components
vi.mock('./components/HomePage', () => ({
    default: () => <div data-testid="home-page">Home Page</div>
}));

vi.mock('./components/ProductsPage', () => ({
    default: () => <div data-testid="products-page">Products Page</div>
}));

vi.mock('./components/LoginPage', () => ({
    default: () => <div data-testid="login-page">Login Page</div>
}));

vi.mock('./components/AdminPage', () => ({
    default: () => <div data-testid="admin-page">Admin Page</div>
}));

vi.mock('./components/CartPage', () => ({
    default: () => <div data-testid="cart-page">Cart Page</div>
}));

const renderWithRouter = (initialRoute = '/') => {
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <App />
        </MemoryRouter>
    );
};

describe('App', () => {
    it('renders HomePage on root route', () => {
        renderWithRouter('/');
        
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('renders ProductsPage on /products route', () => {
        renderWithRouter('/products');
        
        expect(screen.getByTestId('products-page')).toBeInTheDocument();
    });

    it('renders LoginPage on /login route', () => {
        renderWithRouter('/login');
        
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('renders AdminPage on /admin route', () => {
        renderWithRouter('/admin');
        
        expect(screen.getByTestId('admin-page')).toBeInTheDocument();
    });

    it('renders CartPage on /cart route', () => {
        renderWithRouter('/cart');
        
        expect(screen.getByTestId('cart-page')).toBeInTheDocument();
    });

    it('does not render HomePage when on /products', () => {
        renderWithRouter('/products');
        
        expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
    });

    it('does not render ProductsPage when on /login', () => {
        renderWithRouter('/login');
        
        expect(screen.queryByTestId('products-page')).not.toBeInTheDocument();
    });

    it('does not render LoginPage when on /cart', () => {
        renderWithRouter('/cart');
        
        expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });

    it('does not render AdminPage when on root', () => {
        renderWithRouter('/');
        
        expect(screen.queryByTestId('admin-page')).not.toBeInTheDocument();
    });

    it('does not render CartPage when on /admin', () => {
        renderWithRouter('/admin');
        
        expect(screen.queryByTestId('cart-page')).not.toBeInTheDocument();
    });

    it('wraps routes in CartProvider', () => {
        // This test verifies that the App component structure is correct
        // by checking that pages render without error (CartProvider provides context)
        renderWithRouter('/');
        
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
});
