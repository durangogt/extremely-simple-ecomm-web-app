import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewModal from './ReviewModal';
import { Product, Review } from '../types';

describe('ReviewModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    const mockProduct: Product = {
        id: '1',
        name: 'Test Apple',
        price: 2.99,
        description: 'A fresh apple',
        image: 'apple.jpg',
        reviews: [
            { author: 'John', comment: 'Great product!', date: '2025-01-15T10:00:00Z' },
            { author: 'Jane', comment: 'Very fresh', date: '2025-01-16T14:30:00Z' }
        ],
        inStock: true
    };

    const mockProductNoReviews: Product = {
        id: '2',
        name: 'Test Orange',
        price: 3.99,
        reviews: [],
        inStock: true
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when product is null', () => {
        const { container } = render(
            <ReviewModal product={null} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        
        expect(container.firstChild).toBeNull();
    });

    it('renders modal when product is provided', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        
        expect(screen.getByText(`Reviews for ${mockProduct.name}`)).toBeInTheDocument();
    });

    it('displays existing reviews', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Jane')).toBeInTheDocument();
    });

    it('displays "No reviews yet" when product has no reviews', () => {
        render(<ReviewModal product={mockProductNoReviews} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        
        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    });

    it('renders the review form', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        
        expect(screen.getByRole('heading', { name: 'Leave a Review' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your review')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('renders the close button', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        
        fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        
        const backdrop = container.querySelector('.modal-backdrop');
        fireEvent.click(backdrop!);
        
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not close when modal content is clicked', () => {
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        
        const content = container.querySelector('.modal-content');
        fireEvent.click(content!);
        
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('submits review with correct data', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        
        const nameInput = screen.getByPlaceholderText('Your name');
        const commentInput = screen.getByPlaceholderText('Your review');
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(nameInput, { target: { value: 'Test User' } });
        fireEvent.change(commentInput, { target: { value: 'This is my review' } });
        fireEvent.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
            author: 'Test User',
            comment: 'This is my review'
        }));
    });

    it('includes date in submitted review', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        
        const nameInput = screen.getByPlaceholderText('Your name');
        const commentInput = screen.getByPlaceholderText('Your review');
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(nameInput, { target: { value: 'Test User' } });
        fireEvent.change(commentInput, { target: { value: 'This is my review' } });
        fireEvent.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
            date: expect.any(String)
        }));
    });

    it('resets form after submission', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        
        const nameInput = screen.getByPlaceholderText('Your name') as HTMLInputElement;
        const commentInput = screen.getByPlaceholderText('Your review') as HTMLTextAreaElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(nameInput, { target: { value: 'Test User' } });
        fireEvent.change(commentInput, { target: { value: 'This is my review' } });
        fireEvent.click(submitButton);

        expect(nameInput.value).toBe('');
        expect(commentInput.value).toBe('');
    });

    it('has modal-backdrop class', () => {
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        
        expect(container.querySelector('.modal-backdrop')).toBeInTheDocument();
    });

    it('has modal-content class', () => {
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        
        expect(container.querySelector('.modal-content')).toBeInTheDocument();
    });

    it('displays review dates in localized format', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        
        // The date format depends on locale, but dates should be present in the reviews
        const reviewsContainer = document.querySelector('.reviews-list');
        expect(reviewsContainer).toBeInTheDocument();
        expect(reviewsContainer?.textContent).toMatch(/2025/);
    });

    it('requires name and comment inputs', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        
        const nameInput = screen.getByPlaceholderText('Your name');
        const commentInput = screen.getByPlaceholderText('Your review');

        expect(nameInput).toHaveAttribute('required');
        expect(commentInput).toHaveAttribute('required');
    });

    it('has close-button class on Close button', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        
        const closeButton = screen.getByRole('button', { name: 'Close' });
        expect(closeButton).toHaveClass('close-button');
    });
});
