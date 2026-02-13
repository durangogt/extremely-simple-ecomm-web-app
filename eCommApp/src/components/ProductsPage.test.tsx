import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProductsPage from './ProductsPage';
import { CartContext } from '../context/CartContext';
import { Product } from '../types';

// Mock Header and Footer
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

// Mock ReviewModal
vi.mock('./ReviewModal', () => ({
    default: ({ product, onClose, onSubmit }: any) => 
        product ? (
            <div data-testid="review-modal">
                <span data-testid="review-product-name">{product.name}</span>
                <button onClick={onClose} data-testid="close-modal">Close</button>
                <button 
                    onClick={() => onSubmit({ author: 'Test', comment: 'Test review', date: '2025-01-01' })} 
                    data-testid="submit-review"
                >
                    Submit
                </button>
            </div>
        ) : null
}));

const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Apple',
        price: 1.99,
        description: 'Fresh red apple',
        image: 'apple.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Orange',
        price: 2.49,
        description: 'Juicy orange',
        image: 'orange.jpg',
        reviews: [{ author: 'John', comment: 'Great!', date: '2025-01-01' }],
        inStock: true
    },
    {
        id: '3',
        name: 'Grapes',
        price: 4.99,
        description: 'Sweet grapes',
        image: 'grapes.jpg',
        reviews: [],
        inStock: false
    },
    {
        id: '4',
        name: 'Pear',
        price: 2.29,
        description: 'Ripe pear',
        image: 'pear.jpg',
        reviews: [],
        inStock: true
    }
];

const productFileMap: Record<string, Product> = {
    'apple.json': mockProducts[0],
    'orange.json': mockProducts[1],
    'grapes.json': mockProducts[2],
    'pear.json': mockProducts[3]
};

const mockCartContext = {
    cartItems: [],
    addToCart: vi.fn(),
    clearCart: vi.fn()
};

const renderWithContext = (cartContext = mockCartContext) => {
    return render(
        <BrowserRouter>
            <CartContext.Provider value={cartContext}>
                <ProductsPage />
            </CartContext.Provider>
        </BrowserRouter>
    );
};

describe('ProductsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        
        // Setup default fetch mock to return products
        global.fetch = vi.fn().mockImplementation((url: string) => {
            const fileName = url.split('/').pop();
            const product = fileName ? productFileMap[fileName] : null;
            
            if (product) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(product)
                });
            }
            
            return Promise.reject(new Error(`Failed to load ${url}`));
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shows loading state initially', async () => {
        // Make fetch never resolve
        global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));
        
        renderWithContext();
        
        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('renders Header component', () => {
        renderWithContext();
        
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders Footer component', () => {
        renderWithContext();
        
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('throws error when CartContext is not provided', () => {
        // Suppress console.error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        expect(() => render(
            <BrowserRouter>
                <ProductsPage />
            </BrowserRouter>
        )).toThrow('CartContext must be used within a CartProvider');
        
        consoleSpy.mockRestore();
    });

    it('handles fetch error gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
        
        renderWithContext();
        
        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });
        
        // Should still render the page structure even if products fail to load
        expect(screen.getByText('Our Products')).toBeInTheDocument();
        
        consoleSpy.mockRestore();
    });

    it('has products-container class after loading', async () => {
        const { container } = renderWithContext();
        
        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });
        
        expect(container.querySelector('.products-container')).toBeInTheDocument();
    });

    it('has products-grid class after loading', async () => {
        const { container } = renderWithContext();
        
        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });
        
        expect(container.querySelector('.products-grid')).toBeInTheDocument();
    });

    it('displays Our Products heading after loading', async () => {
        renderWithContext();
        
        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });
        
        expect(screen.getByText('Our Products')).toBeInTheDocument();
    });

    it('calls fetch for each product file', async () => {
        renderWithContext();
        
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });
        
        expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    it('shows loading state with header and footer', () => {
        global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));
        
        renderWithContext();
        
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('Loading products...')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('handles partial fetch failure', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        let callCount = 0;
        global.fetch = vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockProducts[0])
                });
            }
            return Promise.resolve({
                ok: false,
                json: () => Promise.reject(new Error('Failed'))
            });
        });
        
        renderWithContext();
        
        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });
        
        consoleSpy.mockRestore();
    });
});
