# TypeScript

A TypeScript project

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## GitHub Pages Deployment

1. Update the `base` property in `vite.config.ts` to match the repository name
2. Enable GitHub Pages in the repository settings:
   - Go to Settings > Pages
   - Set the source to GitHub Actions
   - Create a new workflow for deploying static content

## Project Structure

- `index.html`: Main HTML file
- `src/main.ts`: TypeScript entry point
- `src/style.css`: Global styles
- `dist/`: Build output directory (generated after build) 