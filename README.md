# puck-code-snippet

A React component library for embedding code snippets in [Puck](https://puckeditor.com/) editors.

## Installation

```bash
npm install puck-code-snippet
```

## Usage

```tsx
import { PuckCodeSnippet } from 'puck-code-snippet';

function App() {
  return <PuckCodeSnippet />;
}
```

## Development

This repository uses Nx for monorepo management.

### Project Structure

- **`packages/puck-code-snippet`** - The main React component library (published to npm)
- **`apps/puck-editor`** - Sample application for testing the library

### Commands

```bash
# Install dependencies
npm install

# Build the library
npx nx build puck-code-snippet

# Run tests
npx nx test puck-code-snippet

# Run linting
npx nx lint puck-code-snippet

# Type checking
npx nx typecheck puck-code-snippet

# Run the sample app (for testing)
npx nx dev puck-editor
```

### Testing Your Changes

The `puck-editor` app is provided as a sandbox for testing the library during development:

```bash
# Start the dev server
npx nx dev puck-editor

# Visit http://localhost:4200
```

## License

MIT
