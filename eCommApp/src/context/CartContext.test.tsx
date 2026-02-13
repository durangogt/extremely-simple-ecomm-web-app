import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useContext } from 'react';
import { CartContext, CartProvider, CartItem } from './CartContext';
import { Product } from '../types';

// Test component that uses the CartContext
const TestComponent = () => {
    const context = useContext(CartContext);
    
    if (!context) {
        return <div>No context</div>;
    }

    const { cartItems, addToCart, clearCart } = context;

    const testProduct: Product = {
        id: 'test-1',
        name: 'Test Product',
        price: 10.00,
        reviews: [],
        inStock: true
    };

    const testProduct2: Product = {
        id: 'test-2',
        name: 'Test Product 2',
        price: 20.00,
        reviews: [],
        inStock: true
    };

    return (
        <div>
            <div data-testid="cart-count">{cartItems.length}</div>
            <div data-testid="cart-items">
                {cartItems.map(item => (
                    <div key={item.id} data-testid={`item-${item.id}`}>
                        {item.name} - Qty: {item.quantity}
                    </div>
                ))}
            </div>
            <button onClick={() => addToCart(testProduct)} data-testid="add-product-1">
                Add Product 1
            </button>
            <button onClick={() => addToCart(testProduct2)} data-testid="add-product-2">
                Add Product 2
            </button>
            <button onClick={clearCart} data-testid="clear-cart">
                Clear Cart
            </button>
        </div>
    );
};

describe('CartContext', () => {
    it('provides cart context to children', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    });

    it('adds a product to the cart', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByTestId('add-product-1'));
        
        expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
        expect(screen.getByTestId('item-test-1')).toHaveTextContent('Test Product - Qty: 1');
    });

    it('increments quantity when same product is added again', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByTestId('add-product-1'));
        fireEvent.click(screen.getByTestId('add-product-1'));
        
        expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
        expect(screen.getByTestId('item-test-1')).toHaveTextContent('Test Product - Qty: 2');
    });

    it('adds multiple different products to the cart', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        fireEvent.click(screen.getByTestId('add-product-1'));
        fireEvent.click(screen.getByTestId('add-product-2'));
        
        expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
        expect(screen.getByTestId('item-test-1')).toHaveTextContent('Test Product - Qty: 1');
        expect(screen.getByTestId('item-test-2')).toHaveTextContent('Test Product 2 - Qty: 1');
    });

    it('clears all items from the cart', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        // Add some products
        fireEvent.click(screen.getByTestId('add-product-1'));
        fireEvent.click(screen.getByTestId('add-product-2'));
        expect(screen.getByTestId('cart-count')).toHaveTextContent('2');

        // Clear cart
        fireEvent.click(screen.getByTestId('clear-cart'));
        
        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    });

    it('returns undefined when used outside provider', () => {
        const TestWithoutProvider = () => {
            const context = useContext(CartContext);
            return <div>{context === undefined ? 'undefined' : 'has context'}</div>;
        };

        render(<TestWithoutProvider />);
        expect(screen.getByText('undefined')).toBeInTheDocument();
    });

    it('maintains cart state across multiple operations', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        // Add product 1 three times
        fireEvent.click(screen.getByTestId('add-product-1'));
        fireEvent.click(screen.getByTestId('add-product-1'));
        fireEvent.click(screen.getByTestId('add-product-1'));
        
        // Add product 2 once
        fireEvent.click(screen.getByTestId('add-product-2'));
        
        expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
        expect(screen.getByTestId('item-test-1')).toHaveTextContent('Test Product - Qty: 3');
        expect(screen.getByTestId('item-test-2')).toHaveTextContent('Test Product 2 - Qty: 1');
    });

    it('starts with an empty cart', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
        expect(screen.getByTestId('cart-items')).toBeEmptyDOMElement();
    });

    it('can clear cart and add items again', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        // Add and clear
        fireEvent.click(screen.getByTestId('add-product-1'));
        fireEvent.click(screen.getByTestId('clear-cart'));
        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');

        // Add again
        fireEvent.click(screen.getByTestId('add-product-2'));
        expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
        expect(screen.getByTestId('item-test-2')).toHaveTextContent('Test Product 2 - Qty: 1');
    });
});

describe('CartProvider', () => {
    it('renders children correctly', () => {
        render(
            <CartProvider>
                <div data-testid="child">Child Component</div>
            </CartProvider>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Child Component')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
        render(
            <CartProvider>
                <div data-testid="child-1">Child 1</div>
                <div data-testid="child-2">Child 2</div>
            </CartProvider>
        );

        expect(screen.getByTestId('child-1')).toBeInTheDocument();
        expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
});
