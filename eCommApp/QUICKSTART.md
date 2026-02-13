# Quick Start Guide for New Developers

Welcome to **The Daily Harvest** - a React-based eCommerce application for fresh produce. This guide will get you up and running quickly.

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)

Verify your installation:
```powershell
node --version
npm --version
```

---

## Setup (5 minutes)

```powershell
# 1. Navigate to the project folder
cd eCommApp

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser to `http://localhost:5173` (or the URL shown in terminal).

---

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests with Vitest |
| `npm test -- --coverage` | Run tests with coverage report |
| `npm test -- --watch` | Run tests in watch mode |

---

## Project Structure

```
eCommApp/
├── public/
│   └── products/              # Product data (JSON) and images
│       ├── apple.json
│       ├── grapes.json
│       ├── orange.json
│       ├── pear.json
│       └── productImages/     # Product images
├── src/
│   ├── components/            # React components (pages + UI)
│   │   ├── AdminPage.tsx      # Admin dashboard
│   │   ├── CartPage.tsx       # Shopping cart view
│   │   ├── CheckoutModal.tsx  # Checkout flow
│   │   ├── Footer.tsx         # Site footer
│   │   ├── Header.tsx         # Navigation header
│   │   ├── HomePage.tsx       # Landing page
│   │   ├── LoginPage.tsx      # User authentication
│   │   ├── ProductsPage.tsx   # Product catalog
│   │   └── ReviewModal.tsx    # Product reviews
│   ├── context/
│   │   └── CartContext.tsx    # Global cart state management
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── utils/
│   │   └── helpers.ts         # Utility functions (formatPrice, etc.)
│   ├── test/
│   │   ├── setup.ts           # Test configuration
│   │   └── test-utils.tsx     # Custom render helpers
│   ├── App.tsx                # Main app component + routing
│   ├── App.css                # App-level styles
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite build configuration
```

---

## Essential Files to Understand

### Start Here (Read First)

| File | What It Does |
|------|--------------|
| `src/types/index.ts` | Data models: `Product`, `CartItem`, `Review` interfaces |
| `src/App.tsx` | Main entry point - defines routes and app structure |
| `src/context/CartContext.tsx` | Global state management for shopping cart |

### Core Features

| File | What It Does |
|------|--------------|
| `src/components/ProductsPage.tsx` | Product browsing and "add to cart" |
| `src/components/CartPage.tsx` | Cart display and item management |
| `src/components/CheckoutModal.tsx` | Purchase/checkout flow |

### Utilities

| File | What It Does |
|------|--------------|
| `src/utils/helpers.ts` | Shared functions like `formatPrice()` |
| `src/test/test-utils.tsx` | Testing utilities with providers |

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| React Router DOM v6 | Client-side routing |
| Vitest | Test runner |
| React Testing Library | Component testing |
| CSS | Styling (no framework) |

---

## Key Patterns

### State Management

Cart state is managed via React Context:

```tsx
import { useCart } from '../context/CartContext';

function MyComponent() {
  const { cart, addToCart, clearCart } = useCart();
  // Use cart state and actions
}
```

### Adding Products

Products are JSON files in `public/products/`. Structure:

```json
{
  "id": "apple",
  "name": "Apple",
  "price": 1.99,
  "description": "Fresh red apples",
  "image": "/products/productImages/apple.jpg",
  "inStock": true,
  "reviews": []
}
```

### Currency Formatting

Always use the helper function:

```tsx
import { formatPrice } from '../utils/helpers';

// Outputs: "$1.99"
formatPrice(1.99);
```

---

## Testing

### Running Tests - Quick Reference

```powershell
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

---

### Running Specific Tests

#### By File Name

```powershell
# Run a specific test file
npm test -- CartPage.test.tsx

# Run tests in a specific folder
npm test -- src/components/

# Run multiple specific files
npm test -- CartPage.test.tsx ProductsPage.test.tsx
```

#### By Test Name (Pattern Matching)

```powershell
# Run tests matching a pattern in the test name
npm test -- -t "cart"

# Run tests with "should add" in the description
npm test -- -t "should add"

# Case-insensitive pattern matching
npm test -- -t "checkout"
```

#### By File Pattern (Glob)

```powershell
# Run all tests in components folder
npm test -- "src/components/**/*.test.tsx"

# Run only context tests
npm test -- "src/context/**/*.test.tsx"

# Run utility tests
npm test -- "src/utils/**/*.test.ts"
```

---

### Test Output Options

```powershell
# Verbose output (show all test names)
npm test -- --reporter=verbose

# Minimal output (dots only)
npm test -- --reporter=dot

# JSON output (for CI/tooling)
npm test -- --reporter=json

# Show test duration
npm test -- --reporter=verbose
```

---

### Coverage Reports

```powershell
# Generate coverage report (HTML + terminal)
npm test -- --coverage

# Coverage for specific files
npm test -- --coverage --coverage.include="src/components/*"

# Coverage with thresholds (fail if below)
npm test -- --coverage --coverage.thresholds.lines=80
```

Coverage report is generated in `coverage/` folder. Open `coverage/index.html` in a browser for detailed view.

---

### Debugging Tests

```powershell
# Run tests with Node debugger
node --inspect-brk ./node_modules/vitest/vitest.mjs --run

# Run a single test in isolation
npm test -- --run CartPage.test.tsx

# Show console.log output during tests
npm test -- --reporter=verbose
```

---

### Watch Mode Options

```powershell
# Watch all files
npm test -- --watch

# Watch only changed files (based on git)
npm test -- --changed

# Watch specific files
npm test -- --watch CartPage.test.tsx
```

**Watch mode keyboard shortcuts:**
- `a` - Run all tests
- `f` - Run only failed tests
- `p` - Filter by filename
- `t` - Filter by test name
- `q` - Quit watch mode

---

### CI/Continuous Integration

```powershell
# Run tests once and exit (no watch)
npm test -- --run

# Run with coverage and fail on threshold
npm test -- --run --coverage --coverage.thresholds.statements=80

# Run with JUnit reporter for CI
npm test -- --run --reporter=junit --outputFile=test-results.xml
```

---

### Writing Tests

Tests are co-located with components: `ComponentName.test.tsx`

#### Basic Component Test

```tsx
import { render, screen } from '../test/test-utils';
import { describe, it, expect } from 'vitest';
import { CartPage } from './CartPage';

describe('CartPage', () => {
  it('displays cart heading', () => {
    render(<CartPage />);
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
  });
});
```

#### Testing User Interactions

```tsx
import { render, screen, fireEvent } from '../test/test-utils';
import { describe, it, expect, vi } from 'vitest';

describe('AddToCart', () => {
  it('calls addToCart when button clicked', async () => {
    const mockAddToCart = vi.fn();
    render(<ProductCard onAddToCart={mockAddToCart} />);
    
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
  });
});
```

#### Testing Async Operations

```tsx
import { render, screen, waitFor } from '../test/test-utils';
import { describe, it, expect } from 'vitest';

describe('ProductsPage', () => {
  it('loads and displays products', async () => {
    render(<ProductsPage />);
    
    // Wait for async content to load
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });
  });
});
```

#### Testing with Mock Data

```tsx
import { render, screen } from '../test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { CartContext } from '../context/CartContext';

const mockCart = [
  { id: '1', name: 'Apple', price: 1.99, quantity: 2 }
];

describe('CartPage with items', () => {
  it('displays cart total', () => {
    render(
      <CartContext.Provider value={{ cart: mockCart, addToCart: vi.fn(), clearCart: vi.fn() }}>
        <CartPage />
      </CartContext.Provider>
    );
    
    expect(screen.getByText('$3.98')).toBeInTheDocument();
  });
});
```

#### Testing Pure Functions (Unit Tests)

```tsx
import { describe, it, expect } from 'vitest';
import { formatPrice, calculateTotal } from '../utils/helpers';

describe('formatPrice', () => {
  it('formats number as currency', () => {
    expect(formatPrice(1.99)).toBe('$1.99');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('rounds to 2 decimal places', () => {
    expect(formatPrice(1.999)).toBe('$2.00');
  });
});
```

#### Mocking Modules

```tsx
import { vi, describe, it, expect } from 'vitest';

// Mock an entire module
vi.mock('../utils/api', () => ({
  fetchProducts: vi.fn(() => Promise.resolve([{ id: '1', name: 'Apple' }]))
}));

// Mock a specific function
vi.spyOn(console, 'error').mockImplementation(() => {});
```

---

### Test File Organization

```
src/
├── components/
│   ├── CartPage.tsx
│   └── CartPage.test.tsx      # Co-located test
├── context/
│   ├── CartContext.tsx
│   └── CartContext.test.tsx   # Context tests
├── utils/
│   ├── helpers.ts
│   └── helpers.test.ts        # Unit tests
└── test/
    ├── setup.ts               # Global test config
    └── test-utils.tsx         # Custom render with providers
```

---

## Current Test Coverage

> ⚠️ **Note**: Coverage is currently limited. Priority areas needing tests:

| Priority | File | Reason |
|----------|------|--------|
| High | `CartContext.tsx` | Core business logic |
| High | `utils/helpers.ts` | Pure functions, easy to test |
| High | `CheckoutModal.tsx` | Critical user flow |
| Medium | `ProductsPage.tsx` | Main feature |
| Medium | `LoginPage.tsx` | Security-related |

---

## Common Tasks

### Add a New Product

1. Create `public/products/newproduct.json` with product data
2. Add image to `public/products/productImages/`
3. Product will be automatically available

### Add a New Page/Route

1. Create component in `src/components/NewPage.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Header.tsx`

### Add a New Utility Function

1. Add function to `src/utils/helpers.ts`
2. Export it for use across the app
3. Add unit tests in `src/utils/helpers.test.ts`

---

## Troubleshooting

### Installation Issues

#### `npm install` fails with permission errors

```powershell
# Clear npm cache and retry
npm cache clean --force
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

#### `npm install` fails with network errors

```powershell
# Check your proxy settings
npm config list

# If behind corporate proxy, configure npm
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Or use a different registry
npm config set registry https://registry.npmmirror.com
```

#### Node.js version mismatch

```powershell
# Check your Node version
node --version

# This project requires Node.js v18+
# Install nvm-windows to manage versions: https://github.com/coreybutler/nvm-windows
nvm install 18
nvm use 18
```

---

### Development Server Issues

#### Port already in use (EADDRINUSE)

```powershell
# Find process using port 5173
netstat -ano | findstr :5173

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or run on a different port
npm run dev -- --port 3001
```

#### Dev server starts but page won't load

1. Check if the URL is correct: `http://localhost:5173`
2. Try clearing browser cache or use incognito mode
3. Check for errors in the terminal
4. Verify no firewall is blocking localhost

#### Hot reload not working

```powershell
# Restart the dev server
# Press Ctrl+C to stop, then:
npm run dev

# If still not working, check for file watcher limits
# Increase watcher limit in Windows if needed
```

---

### Build Issues

#### TypeScript compilation errors

```powershell
# See all TypeScript errors at once
npm run build

# Common fixes:
# 1. Check for missing type imports
# 2. Ensure all props have correct types
# 3. Verify interface definitions in src/types/index.ts
```

#### Build succeeds but app crashes

1. Check browser console (F12) for runtime errors
2. Verify all environment variables are set
3. Check that all imports resolve correctly
4. Look for circular dependencies

#### Out of memory during build

```powershell
# Increase Node.js memory limit
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

### Testing Issues

#### Tests fail to run

```powershell
# Ensure dependencies are installed
npm install

# Clear test cache and retry
npm test -- --clearCache

# Run with verbose output to see errors
npm test -- --reporter=verbose
```

#### "Cannot find module" errors in tests

```powershell
# Check that test setup is correct
# Verify src/test/setup.ts exists and is configured in vite.config.ts

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install
```

#### Tests pass locally but fail in CI

- Check Node.js version matches
- Verify all dependencies are in `package.json` (not globally installed)
- Look for timezone or locale-dependent tests

---

### Product/Data Issues

#### Products not loading

1. Check browser Network tab (F12) for failed requests
2. Verify JSON files exist in `public/products/`
3. Ensure JSON syntax is valid (use a JSON validator)
4. Check file names match expected format

#### Product images not showing

1. Verify images exist in `public/products/productImages/`
2. Check image paths in product JSON files
3. Ensure image format is supported (jpg, png, webp)
4. Check for case-sensitivity in filenames

---

### Cart/State Issues

#### Cart not persisting

- Cart state is managed in-memory via React Context
- Refresh will clear the cart (by design)
- For persistence, implement localStorage in `CartContext.tsx`

#### "useCart must be used within CartProvider" error

Ensure your component is wrapped in the `CartProvider`:

```tsx
// In App.tsx, verify structure:
<CartProvider>
  <Router>
    <YourComponent />
  </Router>
</CartProvider>
```

---

### Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| `npm install` fails | `Remove-Item -Recurse -Force node_modules; npm install` |
| Port 5173 in use | `npm run dev -- --port 3001` |
| TypeScript errors | `npm run build` to see all errors |
| Tests failing | `npm test -- --reporter=verbose` |
| Node version wrong | Install Node.js v18+ |
| Module not found | `npm install` to reinstall dependencies |
| Blank page | Check browser console (F12) for errors |

---

### Still Stuck?

1. Check the error message carefully - it often contains the solution
2. Search the error in the Issues tab of the repository
3. Ask in the team chat with:
   - Error message (full text)
   - Steps to reproduce
   - Node/npm versions (`node -v`, `npm -v`)
   - OS information

---

## Code Owners

Pull requests are automatically assigned to reviewers. See `.github/CODEOWNERS`.

---

## Next Steps

1. Run the app locally (`npm run dev`)
2. Browse the product catalog
3. Add items to cart and checkout
4. Explore the codebase starting with `App.tsx`
5. Run tests (`npm test`)
6. Make your first contribution!

---

## Questions?

Check the [Instructions/Labs/](../Instructions/Labs/) folder for guided tutorials on using this codebase with GitHub Copilot.
