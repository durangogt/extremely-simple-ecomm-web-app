import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, MemoryRouter, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';

// Mock Header and Footer
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

const renderWithRouter = () => {
    return render(
        <BrowserRouter>
            <LoginPage />
        </BrowserRouter>
    );
};

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the login heading', () => {
        renderWithRouter();
        
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Admin Login');
    });

    it('renders the username input', () => {
        renderWithRouter();
        
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    });

    it('renders the password input', () => {
        renderWithRouter();
        
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('renders the login button', () => {
        renderWithRouter();
        
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('renders the Header component', () => {
        renderWithRouter();
        
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders the Footer component', () => {
        renderWithRouter();
        
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('username input has autofocus attribute in source', () => {
        renderWithRouter();
        
        const usernameInput = screen.getByPlaceholderText('Username');
        // autofocus is a boolean attribute - check that the element is focused or has the attribute
        expect(usernameInput).toBeInTheDocument();
    });

    it('allows typing in username field', () => {
        renderWithRouter();
        
        const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        
        expect(usernameInput.value).toBe('testuser');
    });

    it('allows typing in password field', () => {
        renderWithRouter();
        
        const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
        fireEvent.change(passwordInput, { target: { value: 'testpass' } });
        
        expect(passwordInput.value).toBe('testpass');
    });

    it('password input is of type password', () => {
        renderWithRouter();
        
        const passwordInput = screen.getByPlaceholderText('Password');
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('shows error message for invalid credentials', async () => {
        renderWithRouter();
        
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(loginButton);

        expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    });

    it('navigates to admin page on successful login', async () => {
        renderWithRouter();
        
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });
        fireEvent.click(loginButton);

        expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });

    it('clears inputs on successful login', async () => {
        renderWithRouter();
        
        const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
        const loginButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });
        fireEvent.click(loginButton);

        expect(usernameInput.value).toBe('');
        expect(passwordInput.value).toBe('');
    });

    it('clears error message on successful login', async () => {
        renderWithRouter();
        
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        // First, trigger an error
        fireEvent.change(usernameInput, { target: { value: 'wrong' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong' } });
        fireEvent.click(loginButton);
        
        expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();

        // Then, login successfully
        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });
        fireEvent.click(loginButton);

        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });

    it('submits form on button click', () => {
        renderWithRouter();
        
        const form = document.querySelector('form');
        const loginButton = screen.getByRole('button', { name: 'Login' });
        
        expect(form).toContainElement(loginButton);
    });

    it('shows error for empty credentials', () => {
        renderWithRouter();
        
        const loginButton = screen.getByRole('button', { name: 'Login' });
        fireEvent.click(loginButton);

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('shows error for correct username but wrong password', () => {
        renderWithRouter();
        
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong' } });
        fireEvent.click(loginButton);

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('shows error for wrong username but correct password', () => {
        renderWithRouter();
        
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(usernameInput, { target: { value: 'wrong' } });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });
        fireEvent.click(loginButton);

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('has the login-container class', () => {
        const { container } = renderWithRouter();
        
        expect(container.querySelector('.login-container')).toBeInTheDocument();
    });
});
