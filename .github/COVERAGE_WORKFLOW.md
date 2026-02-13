# Test Coverage Workflow Documentation

## Overview

This repository includes an automated GitHub Actions workflow that monitors test coverage on every pull request and merge to the main branch. The workflow ensures code quality is maintained by preventing coverage from dropping below acceptable thresholds.

## Features

### 🔍 Automated Coverage Tracking
- **Triggers**: Automatically runs on:
  - Pull requests to `main` or `master` branches
  - Direct pushes to `main` or `master` branches

### 📊 Coverage Reporting
The workflow generates a comprehensive coverage report including:
- **Statements Coverage**: Percentage of code statements executed during tests
- **Branches Coverage**: Percentage of conditional branches tested
- **Functions Coverage**: Percentage of functions/methods tested  
- **Lines Coverage**: Percentage of code lines executed during tests

### ✅ Quality Gates
- **Minimum Threshold**: 80% line coverage required
- Builds will fail if coverage drops below the threshold
- Helps enforce a minimum coverage standard across all changes

### 💬 Pull Request Comments
For every pull request, the workflow automatically posts a comment with:
- Overall coverage percentage
- Detailed breakdown by metric (statements, branches, functions, lines)
- Color-coded status indicators:
  - 🟢 **Excellent** (≥90%)
  - 🟡 **Good** (≥80%)
  - 🟠 **Fair** (≥70%)
  - 🔴 **Needs Improvement** (<70%)

### 📦 Artifacts
- Coverage reports are uploaded as artifacts
- Retention period: 30 days
- Accessible from the Actions tab for detailed analysis

## How It Works

### Workflow Steps

1. **Checkout**: Checks out the repository code for running tests and coverage
2. **Setup Node.js**: Installs Node.js 18 with npm caching for faster builds
3. **Install Dependencies**: Runs `npm ci` in the eCommApp directory
4. **Run Tests**: Executes `npm run test:coverage` to generate coverage data
5. **Read Coverage**: Parses `coverage-summary.json` to extract metrics
6. **Check Threshold**: Validates coverage meets the 80% minimum requirement
7. **Comment PR**: Posts/updates a coverage report comment on the pull request
8. **Upload Artifacts**: Saves the full coverage report for review

### Configuration Files

#### `.github/workflows/test-coverage.yml`
Main workflow configuration file that orchestrates the coverage checks.

#### `eCommApp/vite.config.ts`
Vitest configuration with coverage reporting enabled:
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'json-summary', 'html'],
  // ...
}
```

## Running Coverage Locally

To run the same coverage checks locally:

```bash
cd eCommApp
npm install
npm run test:coverage
```

This will generate coverage reports in the `eCommApp/coverage/` directory.

## Adjusting Coverage Thresholds

To modify the minimum coverage threshold, you have two options:

### Option 1: Using Repository Variables (Recommended)
Set a repository variable named `MIN_COVERAGE` in your GitHub repository settings:
1. Go to Settings → Secrets and variables → Actions → Variables
2. Create a new variable named `MIN_COVERAGE` with your desired threshold (e.g., `85`)
3. The workflow will automatically use this value

### Option 2: Editing the Workflow File
Alternatively, you can set a default in the workflow file:

```yaml
# In .github/workflows/test-coverage.yml
env:
  MIN_COVERAGE: ${{ vars.MIN_COVERAGE || '80' }}  # Change the default '80' value
```

## Best Practices

1. **Write Tests First**: Follow TDD principles when adding new features
2. **Maintain Coverage**: Aim to maintain or improve coverage with each PR
3. **Review Reports**: Check the detailed HTML reports for uncovered code paths
4. **Address Gaps**: Focus on critical business logic when improving coverage

## Troubleshooting

### Workflow Fails Due to Coverage Drop

If the workflow fails because coverage is below the threshold:
1. Review the coverage report comment on the PR
2. Identify untested code using the HTML coverage report (in artifacts)
3. Add appropriate tests to cover the new code
4. Push the changes to re-trigger the workflow

### Coverage Report Not Appearing

If the PR comment doesn't appear:
1. Check the Actions tab for workflow run logs
2. Verify the workflow run has sufficient token permissions to post PR comments (for example `issues: write` and/or `pull-requests: write`)
3. Ensure tests are actually running and generating coverage data

## Current Coverage Baseline

As of the initial setup, the project has:
- **Overall Coverage**: 94.64%
- **Statements**: 94.64%
- **Branches**: 96.15%
- **Functions**: 85.29%
- **Lines**: 94.64%

This represents excellent test coverage! The workflow will help maintain this high standard.
