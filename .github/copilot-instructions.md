# Copilot Instructions for The Daily Harvest

## Project Overview
This is **The Daily Harvest**, a modern eCommerce shopping website for fresh produce built with React, TypeScript, and Vite.

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **Testing**: Vitest with React Testing Library
- **Styling**: CSS (no CSS framework)

## Project Structure
```
eCommApp/
├── public/products/       # Product JSON files and images
├── src/
│   ├── components/        # React components (pages and UI)
│   ├── context/           # React Context providers (CartContext)
│   ├── types/             # TypeScript interfaces
│   ├── utils/             # Helper/utility functions
│   └── test/              # Test setup and utilities
```

## Coding Conventions

### TypeScript
- Use explicit TypeScript interfaces for all data structures
- Define interfaces in `src/types/index.ts`
- Use `React.FC` with typed props for functional components
- Prefer explicit return types on functions

### React Components
- Use functional components with hooks
- Place components in `src/components/`
- Name files with PascalCase matching the component name (e.g., `CartPage.tsx`)
- Use named exports for context, default exports for components

### State Management
- Use React Context for global state (see `CartContext.tsx`)
- Keep context providers wrapping the app in `App.tsx`
- Use `useState` for local component state

### Styling
- Use CSS files imported directly into components
- Global styles in `index.css`, app-level styles in `App.css`

## Testing Guidelines
- Test files are co-located with components: `ComponentName.test.tsx`
- Use Vitest (`describe`, `it`, `expect`, `vi` for mocks)
- Use React Testing Library for component testing
- Mock child components with `vi.mock()`
- Create custom render helpers that wrap components with required providers

Example test pattern:
```tsx
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

const renderWithContext = (component) => {
    return render(
        <CartContext.Provider value={mockContext}>
            {component}
        </CartContext.Provider>
    );
};
```

## Key Interfaces
```typescript
interface Product {
    id?: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
    reviews: Review[];
    inStock: boolean;
}

interface CartItem extends Product {
    quantity: number;
}
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests with Vitest (watch mode)
- `npm run test:run` - Run tests once without watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint

## Testing Requirements

### Before Submitting Code
1. **Always run the full test suite** before committing changes: `npm run test:run`
2. **Check code coverage** with `npm run test:coverage`
3. **Coverage must not decrease** - maintain or improve the current coverage levels
4. **All tests must pass** - no failing tests allowed in commits

### Coverage Standards
- **Minimum overall coverage: 80%** (currently at ~95%)
- New features must include comprehensive unit tests
- Bug fixes should include regression tests
- Do not merge code that reduces coverage percentages

### Writing Tests for New Code
- Create test file alongside the component: `ComponentName.test.tsx`
- Test positive scenarios, negative scenarios, and edge cases
- Mock external dependencies (fetch, context, child components)
- Use `waitFor` for async operations
- Follow existing test patterns in the codebase

## Important Notes
- Product data is stored as JSON files in `public/products/`
- Use `formatPrice()` from `utils/helpers.ts` for currency formatting
- Cart state is managed via `CartContext` - use `addToCart()` and `clearCart()`

