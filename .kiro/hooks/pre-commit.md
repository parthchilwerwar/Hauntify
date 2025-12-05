# Pre-Commit Hook

## Purpose
Ensures code quality and consistency before commits are made.

## Trigger
Git commit events.

## Actions

### Code Quality Checks
1. **Lint Check**: Run ESLint on staged files
2. **Type Check**: Verify TypeScript compilation
3. **Format Check**: Ensure Prettier formatting
4. **Import Sorting**: Verify import order

### Security Checks
1. **Secrets Detection**: Scan for API keys in code
2. **Env Validation**: Ensure `.env.local` is gitignored
3. **Dependency Audit**: Check for known vulnerabilities

### Project-Specific Checks
1. **Zod Schema Validation**: Verify all API inputs have schemas
2. **Component Accessibility**: Check for ARIA attributes
3. **Error Boundary Coverage**: Ensure error handling exists

## Configuration

```yaml
trigger: pre-commit
steps:
  - name: lint
    command: npm run lint
    fail_on_error: true
  
  - name: type-check
    command: tsc --noEmit
    fail_on_error: true
  
  - name: format-check
    command: prettier --check "**/*.{ts,tsx,js,jsx}"
    fail_on_error: false
  
  - name: secrets-scan
    command: git diff --cached --name-only | xargs grep -l "sk_\|gsk_\|api_key"
    fail_on_error: true
```

## Benefits for Hauntify

This hook prevented several issues during development:
- Caught exposed API keys before commit
- Ensured consistent TypeScript types across streaming pipeline
- Validated Zod schemas for all API endpoints
- Maintained consistent horror theme styling
