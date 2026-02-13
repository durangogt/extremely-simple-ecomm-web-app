import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CheckoutModal from './CheckoutModal';

describe('CheckoutModal', () => {
    const mockOnConfirm = vi.fn();
    const mockOnCancel = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the modal with correct title', () => {
        render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Are you sure?');
    });

    it('renders the confirmation message', () => {
        render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        
        expect(screen.getByText('Do you want to proceed with the checkout?')).toBeInTheDocument();
    });

    it('renders the Continue Checkout button', () => {
        render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        
        expect(screen.getByRole('button', { name: 'Continue Checkout' })).toBeInTheDocument();
    });

    it('renders the Return to cart button', () => {
        render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        
        expect(screen.getByRole('button', { name: 'Return to cart' })).toBeInTheDocument();
    });

    it('calls onConfirm when Continue Checkout button is clicked', () => {
        render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        
        fireEvent.click(screen.getByRole('button', { name: 'Continue Checkout' }));
        
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnCancel).not.toHaveBeenCalled();
    });

    it('calls onCancel when Return to cart button is clicked', () => {
        render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        
        fireEvent.click(screen.getByRole('button', { name: 'Return to cart' }));
        
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
        expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('has modal-backdrop class on outer container', () => {
        const { container } = render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        
        expect(container.querySelector('.modal-backdrop')).toBeInTheDocument();
    });

    it('has modal-content class on inner container', () => {
        const { container } = render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        
        expect(container.querySelector('.modal-content')).toBeInTheDocument();
    });

    it('has cancel-btn class on Return to cart button', () => {
        render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        
        const cancelButton = screen.getByRole('button', { name: 'Return to cart' });
        expect(cancelButton).toHaveClass('cancel-btn');
    });

    it('renders both buttons in the checkout-modal-actions container', () => {
        const { container } = render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        
        const actionsContainer = container.querySelector('.checkout-modal-actions');
        expect(actionsContainer).toBeInTheDocument();
        
        const buttons = actionsContainer?.querySelectorAll('button');
        expect(buttons).toHaveLength(2);
    });
});
