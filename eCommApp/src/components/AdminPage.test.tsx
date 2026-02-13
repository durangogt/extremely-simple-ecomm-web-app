import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AdminPage from './AdminPage';

// Mock Header and Footer
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

const renderWithRouter = () => {
    return render(
        <BrowserRouter>
            <AdminPage />
        </BrowserRouter>
    );
};

describe('AdminPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the admin portal heading', () => {
        renderWithRouter();
        
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Welcome to the admin portal.');
    });

    it('renders the sale percent input', () => {
        renderWithRouter();
        
        expect(screen.getByLabelText(/Set Sale Percent/)).toBeInTheDocument();
    });

    it('renders the Submit button', () => {
        renderWithRouter();
        
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('renders the End Sale button', () => {
        renderWithRouter();
        
        expect(screen.getByRole('button', { name: 'End Sale' })).toBeInTheDocument();
    });

    it('renders the Back to Storefront button', () => {
        renderWithRouter();
        
        expect(screen.getByRole('button', { name: 'Back to Storefront' })).toBeInTheDocument();
    });

    it('renders the Header component', () => {
        renderWithRouter();
        
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders the Footer component', () => {
        renderWithRouter();
        
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('shows "No sale active." by default', () => {
        renderWithRouter();
        
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('allows typing in sale percent input', () => {
        renderWithRouter();
        
        const input = screen.getByLabelText(/Set Sale Percent/) as HTMLInputElement;
        fireEvent.change(input, { target: { value: '25' } });
        
        expect(input.value).toBe('25');
    });

    it('updates sale message when valid percent is submitted', () => {
        renderWithRouter();
        
        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: '25' } });
        fireEvent.click(submitButton);

        expect(screen.getByText('All products are 25% off!')).toBeInTheDocument();
    });

    it('shows error for invalid input (non-numeric)', () => {
        renderWithRouter();
        
        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: 'abc' } });
        fireEvent.click(submitButton);

        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        expect(screen.getByText(/Please enter a valid number/)).toBeInTheDocument();
    });

    it('resets sale to 0 when End Sale is clicked', () => {
        renderWithRouter();
        
        const input = screen.getByLabelText(/Set Sale Percent/) as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });
        const endSaleButton = screen.getByRole('button', { name: 'End Sale' });

        // First set a sale
        fireEvent.change(input, { target: { value: '50' } });
        fireEvent.click(submitButton);
        expect(screen.getByText('All products are 50% off!')).toBeInTheDocument();

        // Then end the sale
        fireEvent.click(endSaleButton);
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(input.value).toBe('0');
    });

    it('Back to Storefront links to home page', () => {
        renderWithRouter();
        
        const backLink = screen.getByRole('link', { name: 'Back to Storefront' });
        expect(backLink).toHaveAttribute('href', '/');
    });

    it('handles 0 percent as valid input', () => {
        renderWithRouter();
        
        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: '0' } });
        fireEvent.click(submitButton);

        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('handles decimal percentages', () => {
        renderWithRouter();
        
        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: '15.5' } });
        fireEvent.click(submitButton);

        expect(screen.getByText('All products are 15.5% off!')).toBeInTheDocument();
    });

    it('handles negative percentages', () => {
        renderWithRouter();
        
        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: '-10' } });
        fireEvent.click(submitButton);

        // -10 is still a valid number, just not a sensible percent
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('handles large percentages', () => {
        renderWithRouter();
        
        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: '100' } });
        fireEvent.click(submitButton);

        expect(screen.getByText('All products are 100% off!')).toBeInTheDocument();
    });

    it('has admin-portal class', () => {
        const { container } = renderWithRouter();
        
        expect(container.querySelector('.admin-portal')).toBeInTheDocument();
    });

    it('input starts with default value of 0', () => {
        renderWithRouter();
        
        const input = screen.getByLabelText(/Set Sale Percent/) as HTMLInputElement;
        expect(input.value).toBe('0');
    });

    it('shows the invalid input value in error message', () => {
        renderWithRouter();
        
        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(input, { target: { value: 'xyz' } });
        fireEvent.click(submitButton);

        expect(screen.getByText(/xyz/)).toBeInTheDocument();
    });

    it('valid input sets sale percent', () => {
        renderWithRouter();
        
        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        // Enter valid input
        fireEvent.change(input, { target: { value: '20' } });
        fireEvent.click(submitButton);
        expect(screen.getByText('All products are 20% off!')).toBeInTheDocument();
    });

    it('renders HTML in error message as text, not as DOM elements (XSS prevention)', () => {
        const { container } = renderWithRouter();
        
        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        // Try to inject HTML with img tag
        const maliciousInput = '<img src="x" onerror="alert(1)">';
        fireEvent.change(input, { target: { value: maliciousInput } });
        fireEvent.click(submitButton);

        // Verify error message is shown
        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        
        // Verify the HTML string appears as text in the error message
        expect(screen.getByText(new RegExp(maliciousInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument();
        
        // CRITICAL: Verify no img element was created in the DOM
        expect(container.querySelector('img[src="x"]')).toBeNull();
        expect(container.querySelectorAll('img').length).toBe(0);
    });

    it('renders HTML with script tag in error message as text, not as DOM elements', () => {
        const { container } = renderWithRouter();
        
        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        // Try to inject HTML with script tag
        const maliciousInput = '<script>alert("XSS")</script>';
        fireEvent.change(input, { target: { value: maliciousInput } });
        fireEvent.click(submitButton);

        // Verify error message is shown
        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        
        // Verify the HTML string appears as text in the error message
        expect(screen.getByText(new RegExp('<script>', 'i'))).toBeInTheDocument();
        
        // CRITICAL: Verify no script element was created in the DOM
        expect(container.querySelector('script')).toBeNull();
    });

    it('renders uppercase HTML tags in error message as text (comprehensive XSS prevention)', () => {
        const { container } = renderWithRouter();
        
        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        // Try to inject HTML with uppercase SCRIPT tag
        const maliciousInput = '<SCRIPT>alert("XSS")</SCRIPT>';
        fireEvent.change(input, { target: { value: maliciousInput } });
        fireEvent.click(submitButton);

        // Verify error message is shown
        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        
        // Verify the HTML string appears as text in the error message
        expect(screen.getByText(/SCRIPT/)).toBeInTheDocument();
        
        // CRITICAL: Verify no script element was created in the DOM
        expect(container.querySelector('script')).toBeNull();
    });
});
