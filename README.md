# The Daily Harvest

A modern TypeScript-based shopping website built with React and Vite.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Navigate to the eCommApp directory:
   ```bash
   cd eCommApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

## 📁 Project Structure

```
eCommApp/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   ├── App.css         # App styles
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md          # This file
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report

## 🚀 Deployment

This project is automatically deployed to GitHub Pages when changes are pushed to the main/master branch.

### Deployment Process

The deployment is handled by a GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) that:

1. Runs all tests to ensure code quality
2. Builds the production version of the application
3. Deploys the build to GitHub Pages

### Security Features

- Uses `GITHUB_TOKEN` for authentication (no custom secrets required)
- Minimal permissions: `contents: read`, `pages: write`, `id-token: write`
- Only deploys from the main/master branch
- Concurrent deployment protection to prevent conflicts

### Accessing the Deployed Site

Once deployed, the site will be available at:
```
https://durangogt.github.io/extremely-simple-ecomm-web-app/
```

### Manual Deployment

You can manually trigger a deployment from the GitHub Actions tab by running the "Deploy to GitHub Pages" workflow.

[Ref link to initial workshop guide](https://experience.cloudlabs.ai/#/labguidepreview/2b2f0dcc-60e8-4d8c-854c-418f4e5079e9/1)
