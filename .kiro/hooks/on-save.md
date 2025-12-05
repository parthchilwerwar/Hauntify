# On-Save Hook

## Purpose
Automatically validates and formats code when files are saved.

## Trigger
File save events in the workspace.

## Actions

### TypeScript/JavaScript Files
1. Run ESLint for code quality checks
2. Format with Prettier
3. Check for TypeScript errors
4. Validate imports

### API Route Files (`app/api/**/*.ts`)
1. Validate Zod schema exports
2. Check for proper error handling
3. Ensure streaming headers are set correctly

### Component Files (`components/**/*.tsx`)
1. Check for proper React hooks usage
2. Validate accessibility attributes
3. Ensure consistent styling patterns

## Configuration

```yaml
trigger: on-save
file_patterns:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
exclude:
  - "node_modules/**"
  - ".next/**"
  - "dist/**"
```

## Example Usage

When saving `src/server/groqChat.ts`:
1. Hook validates Groq API integration patterns
2. Checks for proper streaming implementation
3. Ensures error handling follows project conventions
4. Validates NDJSON event format consistency
