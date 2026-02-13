import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

// Mock components
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div data-testid="checkout-modal">
            <button onClick={onConfirm} data-testid="confirm-checkout">Confirm</button>
            <button onClick={onCancel} data-testid="cancel-checkout">Cancel</button>
        </div>
    )
}));

const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test1.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'test2.jpg',
        reviews: [],
        inStock: true
    }
];

const mockCartContext = {
    cartItems: mockCartItems,
    addToCart: vi.fn(),
    clearCart: vi.fn()
};

const renderWithCartContext = (cartContext = mockCartContext) => {
    return render(
        <CartContext.Provider value={cartContext}>
            <CartPage />
        </CartContext.Provider>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays cart items when cart has items', () => {
        renderWithCartContext();
        
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    });

    // Verify that an empty cart message is displayed when the cart is empty.
    it('displays empty cart message when cart is empty', () => {
        renderWithCartContext({ ...mockCartContext, cartItems: [] });

        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });

    it('displays checkout button when cart has items', () => {
        renderWithCartContext();

        const checkoutButton = screen.getByRole('button', { name: /checkout/i });
        expect(checkoutButton).toBeInTheDocument();
        expect(checkoutButton).toHaveClass('checkout-btn');
    });

    it('does not display checkout button when cart is empty', () => {
        renderWithCartContext({ ...mockCartContext, cartItems: [] });

        expect(screen.queryByRole('button', { name: /checkout/i })).not.toBeInTheDocument();
    });

    it('renders checkout modal when checkout button is clicked', () => {
        renderWithCartContext();

        // Initially, modal should not be visible
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();

        // Click checkout button
        const checkoutButton = screen.getByRole('button', { name: /checkout/i });
        fireEvent.click(checkoutButton);

        // Modal should now be visible
        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
        expect(screen.getByTestId('confirm-checkout')).toBeInTheDocument();
        expect(screen.getByTestId('cancel-checkout')).toBeInTheDocument();
    });

    it('closes checkout modal when cancel button is clicked', () => {
        renderWithCartContext();

        // Open the modal
        const checkoutButton = screen.getByRole('button', { name: /checkout/i });
        fireEvent.click(checkoutButton);

        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();

        // Click cancel button
        const cancelButton = screen.getByTestId('cancel-checkout');
        fireEvent.click(cancelButton);

        // Modal should be closed
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
    });

    it('processes order when confirm button is clicked', () => {
        renderWithCartContext();

        // Open the modal
        const checkoutButton = screen.getByRole('button', { name: /checkout/i });
        fireEvent.click(checkoutButton);

        // Confirm checkout
        const confirmButton = screen.getByTestId('confirm-checkout');
        fireEvent.click(confirmButton);

        // Should call clearCart
        expect(mockCartContext.clearCart).toHaveBeenCalledTimes(1);

        // Should display order processed message
        expect(screen.getByText('Your order has been processed!')).toBeInTheDocument();

        // Should display processed items
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('displays all cart items with correct details', () => {
        renderWithCartContext();

        // Check all items are rendered
        mockCartItems.forEach(item => {
            expect(screen.getByText(item.name)).toBeInTheDocument();
            expect(screen.getByText(`Price: $${item.price.toFixed(2)}`)).toBeInTheDocument();
            expect(screen.getByText(`Quantity: ${item.quantity}`)).toBeInTheDocument();
        });

        // Check images are rendered with correct attributes
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(mockCartItems.length);
        
        images.forEach((img, index) => {
            expect(img).toHaveAttribute('src', `products/productImages/${mockCartItems[index].image}`);
            expect(img).toHaveAttribute('alt', mockCartItems[index].name);
        });
    });

    it('throws error when CartContext is not provided', () => {
        // Suppress console.error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => render(<CartPage />)).toThrow('CartContext must be used within a CartProvider');

        consoleSpy.mockRestore();
    });

    it('handles single item in cart', () => {
        const singleItemContext = {
            ...mockCartContext,
            cartItems: [mockCartItems[0]]
        };

        renderWithCartContext(singleItemContext);

        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
    });

    it('handles items with zero quantity', () => {
        const zeroQuantityItem: CartItem = {
            id: '3',
            name: 'Zero Quantity Product',
            price: 10.00,
            quantity: 0,
            image: 'test3.jpg',
            reviews: [],
            inStock: true
        };

        const contextWithZeroQuantity = {
            ...mockCartContext,
            cartItems: [zeroQuantityItem]
        };

        renderWithCartContext(contextWithZeroQuantity);

        expect(screen.getByText('Zero Quantity Product')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 0')).toBeInTheDocument();
    });

    it('handles items with decimal prices correctly', () => {
        const decimalPriceItem: CartItem = {
            id: '4',
            name: 'Decimal Price Product',
            price: 99.95,
            quantity: 1,
            image: 'test4.jpg',
            reviews: [],
            inStock: false
        };

        const contextWithDecimalPrice = {
            ...mockCartContext,
            cartItems: [decimalPriceItem]
        };

        renderWithCartContext(contextWithDecimalPrice);

        expect(screen.getByText('Price: $99.95')).toBeInTheDocument();
    });

    it('handles items with large quantities', () => {
        const largeQuantityItem: CartItem = {
            id: '5',
            name: 'Large Quantity Product',
            price: 5.00,
            quantity: 999,
            image: 'test5.jpg',
            reviews: [],
            inStock: true
        };

        const contextWithLargeQuantity = {
            ...mockCartContext,
            cartItems: [largeQuantityItem]
        };

        renderWithCartContext(contextWithLargeQuantity);

        expect(screen.getByText('Quantity: 999')).toBeInTheDocument();
    });

    it('displays Header and Footer components', () => {
        renderWithCartContext();

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('maintains processed items in order confirmation view', () => {
        renderWithCartContext();

        // Complete checkout process
        const checkoutButton = screen.getByRole('button', { name: /checkout/i });
        fireEvent.click(checkoutButton);
        
        const confirmButton = screen.getByTestId('confirm-checkout');
        fireEvent.click(confirmButton);

        // Verify all processed items are displayed
        expect(screen.getByText('Your order has been processed!')).toBeInTheDocument();
        
        mockCartItems.forEach(item => {
            expect(screen.getByText(item.name)).toBeInTheDocument();
            expect(screen.getByText(`Price: $${item.price.toFixed(2)}`)).toBeInTheDocument();
            expect(screen.getByText(`Quantity: ${item.quantity}`)).toBeInTheDocument();
        });

        // Verify images in order confirmation
        const images = screen.getAllByRole('img');
        images.forEach((img, index) => {
            expect(img).toHaveAttribute('src', `products/productImages/${mockCartItems[index].image}`);
        });
    });

    it('does not call clearCart until checkout is confirmed', () => {
        renderWithCartContext();

        // Open modal
        const checkoutButton = screen.getByRole('button', { name: /checkout/i });
        fireEvent.click(checkoutButton);

        // clearCart should not be called yet
        expect(mockCartContext.clearCart).not.toHaveBeenCalled();

        // Cancel checkout
        const cancelButton = screen.getByTestId('cancel-checkout');
        fireEvent.click(cancelButton);

        // clearCart should still not be called
        expect(mockCartContext.clearCart).not.toHaveBeenCalled();
    });

    it('handles items without optional properties', () => {
        const minimalItem: CartItem = {
            id: '6',
            name: 'Minimal Product',
            price: 15.00,
            quantity: 1,
            reviews: [],
            inStock: true
        };

        const contextWithMinimalItem = {
            ...mockCartContext,
            cartItems: [minimalItem]
        };

        renderWithCartContext(contextWithMinimalItem);

        expect(screen.getByText('Minimal Product')).toBeInTheDocument();
        expect(screen.getByText('Price: $15.00')).toBeInTheDocument();
    });
});