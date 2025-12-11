# CLAUDE.md

This file provides comprehensive guidance to Claude Code when working with this Next.js portfolio blog project. It serves as the project's technical constitution.

## Tech Stack

### Core Framework & Language
- **Framework**: Next.js (canary) with App Router
- **Language**: TypeScript 5.3.3
  - `strict: false` but `strictNullChecks: true`
  - `baseUrl: "."` for path aliases (e.g., `app/components/posts`)
- **Package Manager**: pnpm

### Styling & UI
- **CSS Framework**: Tailwind CSS v4 (alpha - 4.0.0-alpha.13)
  - Using new `@import 'tailwindcss'` syntax in global.css
  - Custom `.prose` class for MDX content styling
- **Fonts**: Geist Sans & Geist Mono (v1.2.2)
  - Imported via `geist/font/sans` and `geist/font/mono`

### Content Management
- **MDX Processing**: next-mdx-remote v4.4.1
  - Server-side MDX rendering with custom components
- **Syntax Highlighting**: sugar-high v0.6.0
  - Lightweight, zero-dependency syntax highlighter

### Analytics & Monitoring
- **Vercel Analytics**: v1.1.3
- **Vercel Speed Insights**: v1.0.9

### Testing
- **Test Runner**: Jest v30.2.0
- **Testing Library**: React Testing Library v16.3.0
- **Test Environment**: jsdom (jest-environment-jsdom v30.2.0)
- **Additional Matchers**: @testing-library/jest-dom v6.9.1

## Content & Data Structure

### Blog Post Storage
Blog posts are stored as `.mdx` files in `app/blog/posts/` directory. The file system serves as the content database.

### Frontmatter Schema
Each MDX file **must** include YAML frontmatter with the following fields:

```yaml
---
title: 'Your Post Title'           # Required: Post title (string)
publishedAt: '2024-04-09'          # Required: Publication date (YYYY-MM-DD format)
summary: 'Brief description...'    # Required: Post summary/description (string)
image: '/optional-image.jpg'       # Optional: Custom OG image path (string)
---
```

### Content Processing Pipeline

1. **File Reading** (`app/blog/utils.ts`):
   - `getBlogPosts()` reads all `.mdx` files from `app/blog/posts/`
   - Uses Node.js `fs` module (server-side only)

2. **Frontmatter Parsing**:
   - Regex-based extraction: `/---\s*([\s\S]*?)\s*---/`
   - Key-value pairs parsed from YAML format
   - Quotes automatically stripped from values

3. **Data Structure**:
   ```typescript
   {
     metadata: {
       title: string
       publishedAt: string
       summary: string
       image?: string
     },
     slug: string,      // Auto-generated from filename (no extension)
     content: string    // MDX content without frontmatter
   }
   ```

4. **Date Formatting**:
   - `formatDate(date, includeRelative)` utility
   - Default: Full date format (e.g., "April 9, 2024")
   - With relative: Adds time ago (e.g., "April 9, 2024 (2mo ago)")

## Code Style & Conventions

### Component Definition Patterns

1. **Page Components** (route handlers):
   ```typescript
   export default function Page() {
     return <section>...</section>
   }
   ```
   - Use `export default function`
   - Named `Page` for consistency

2. **Reusable Components**:
   ```typescript
   export function ComponentName() {
     return <div>...</div>
   }
   ```
   - Use named exports with `export function`
   - Examples: `BlogPosts()`, `CustomMDX()`, `Navbar()`

3. **Helper Functions**:
   ```typescript
   function helperFunction(props) {
     // implementation
   }
   ```
   - Regular functions without export for internal use
   - Examples: `Table()`, `CustomLink()`, `createHeading()`

### TypeScript Patterns

- **Props Typing**: Use inline types for simple props, interfaces for complex ones
  ```typescript
  export function Component({ params }: { params: { slug: string } }) { }
  ```

- **Metadata Functions**: Type parameters explicitly
  ```typescript
  export function generateMetadata({ params }: { params: { slug: string } }) { }
  ```

- **Type Imports**: Use `import type` for type-only imports
  ```typescript
  import type { Metadata } from 'next'
  ```

### Styling Conventions

1. **Tailwind Utility Classes**:
   - Prefer utility classes over custom CSS
   - Use semantic grouping: layout → spacing → typography → colors
   - Example: `className="flex flex-col space-y-1 mb-4"`

2. **Dark Mode Support**:
   - Use `dark:` prefix for dark mode variants
   - Defined in layout: `text-black bg-white dark:text-white dark:bg-black`
   - Automatic detection via `prefers-color-scheme`

3. **Typography Classes**:
   - Headings: `font-semibold text-2xl tracking-tighter`
   - Dates: `text-neutral-600 dark:text-neutral-400`
   - Body text: `text-neutral-900 dark:text-neutral-100`

4. **Prose Styling**:
   - MDX content wrapped in `<article className="prose">`
   - Custom prose styles in `global.css`
   - Includes: anchor links, code blocks, images, links, headings

### Import Path Conventions

- **App Imports**: Use path alias without leading slash
  ```typescript
  import { BlogPosts } from 'app/components/posts'
  import { getBlogPosts } from 'app/blog/utils'
  ```

- **Next.js Imports**: Standard package imports
  ```typescript
  import Link from 'next/link'
  import Image from 'next/image'
  ```

### MDX Custom Components

The `CustomMDX` component (`app/components/mdx.tsx`) provides enhanced rendering:

1. **Headings (h1-h6)**:
   - Auto-generated anchor IDs using `slugify()`
   - Clickable anchor links on hover
   - Format: lowercase, hyphenated, special chars removed

2. **Code Blocks**:
   - Syntax highlighting via `sugar-high`
   - Custom colors defined in `global.css` (`:root` vars)
   - Inline code: `<code>` with rounded background
   - Block code: `<pre><code>` with border and padding

3. **Images**:
   - Wrapped in Next.js `<Image>` component
   - Automatic `rounded-lg` class application

4. **Links**:
   - Internal links (`/`): Use Next.js `<Link>` for client-side navigation
   - Anchor links (`#`): Standard `<a>` tag
   - External links: `target="_blank" rel="noopener noreferrer"`

5. **Tables**:
   - Custom `Table` component with header/row structure
   - Horizontal scroll for overflow

## SEO Principles & Implementation

### Automatic SEO Features

1. **Dynamic Sitemap** (`app/sitemap.ts`):
   - Auto-generates from blog posts using `getBlogPosts()`
   - Includes all routes: `/`, `/blog`, and all blog post URLs
   - Uses `publishedAt` as `lastModified` date
   - Format: `/blog/[slug]` pattern

2. **Robots.txt** (`app/robots.ts`):
   - Allows all user agents (`userAgent: '*'`)
   - Points to sitemap.xml automatically
   - Uses `baseUrl` from sitemap configuration

3. **Open Graph Images** (`app/og/route.tsx`):
   - Dynamic OG image generation using `next/og`
   - Size: 1200x630 (optimal for social sharing)
   - Falls back to title from URL query parameter
   - URL pattern: `/og?title=Your+Title`

4. **Structured Data** (JSON-LD):
   - BlogPosting schema on all blog post pages
   - Includes: headline, dates, description, image, URL, author
   - Server-rendered in `<script type="application/ld+json">`

### Metadata Strategy

1. **Global Metadata** (`app/layout.tsx`):
   ```typescript
   - metadataBase: baseUrl
   - title: Template with default fallback
   - description: Site-wide description
   - openGraph: Site name, locale, type
   - robots: Index/follow rules, Google-specific settings
   ```

2. **Page-Level Metadata** (Dynamic):
   ```typescript
   - generateMetadata() in blog/[slug]/page.tsx
   - Pulls from frontmatter: title, summary, image
   - OpenGraph: article type, published time, images
   - Twitter: summary_large_image card
   ```

3. **OG Image Priority**:
   - Custom image from frontmatter (if provided)
   - Falls back to dynamic generation: `/og?title=...`

### SEO Best Practices in Code

- **Semantic HTML**: Use `<article>`, `<section>`, `<nav>` appropriately
- **Heading Hierarchy**: Single `<h1>` per page, proper h2-h6 nesting
- **Alt Text**: Required for all images (enforced in `RoundedImage`)
- **Link Attributes**: `rel="noopener noreferrer"` on external links
- **Meta Tags**: Comprehensive OpenGraph and Twitter Card tags

## Development Commands

```bash
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm test         # Run all tests (Jest)
pnpm test:watch   # Run tests in watch mode
```

## Testing Guidelines

### Test Configuration

- **Location**: Tests in `app/__tests__/` directory
- **Naming**: `*.test.tsx` or `*.test.ts`
- **Jest Config** (`jest.config.ts`):
  - Uses `next/jest` for automatic Next.js setup
  - Module name mapper: `'^app/(.*)$': '<rootDir>/app/$1'`
  - Setup file: `jest.setup.ts` (imports `@testing-library/jest-dom`)

### Testing Patterns

```typescript
import { render, screen } from '@testing-library/react'
import ComponentName from '../component-path'

describe('ComponentName', () => {
  it('describes expected behavior', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Key Testing Principles

1. **Import Path Resolution**: Use `app/` aliases consistently
2. **Component Isolation**: Test components independently
3. **User-Centric Queries**: Prefer `getByText`, `getByRole` over test IDs
4. **Accessibility**: Use `jest-dom` matchers for semantic checks

## Project Architecture

### Directory Structure
```
app/
├── blog/
│   ├── posts/           # MDX blog content
│   ├── [slug]/          # Dynamic blog post pages
│   │   └── page.tsx
│   ├── page.tsx         # Blog listing page
│   └── utils.ts         # Blog utility functions
├── components/          # Reusable components
│   ├── footer.tsx
│   ├── mdx.tsx          # MDX custom components
│   ├── nav.tsx
│   └── posts.tsx        # Blog post list component
├── og/                  # OG image generation
│   └── route.tsx
├── __tests__/           # Jest tests
│   └── page.test.tsx
├── global.css           # Global styles + Tailwind
├── layout.tsx           # Root layout with metadata
├── page.tsx             # Home page
├── robots.ts            # robots.txt generation
└── sitemap.ts           # sitemap.xml generation
```

### Key Files & Responsibilities

- **`app/blog/utils.ts`**: Blog post file system operations and parsing
- **`app/components/mdx.tsx`**: MDX rendering configuration and custom components
- **`app/layout.tsx`**: Global layout, fonts, analytics, and SEO metadata
- **`app/sitemap.ts`**: Centralized `baseUrl` definition and sitemap generation
- **`global.css`**: Tailwind import, prose styling, syntax highlighting colors
- **`jest.config.ts`**: Test configuration with path mapping

## Design Principles

1. **File-System Based Content**: Posts are files, not database entries
2. **Server-First Rendering**: MDX processed on server for performance
3. **Progressive Enhancement**: Works without JavaScript, enhanced with it
4. **SEO-First**: Comprehensive metadata, structured data, and social tags
5. **Type Safety**: TypeScript throughout with strict null checks
6. **Performance**: Vercel Analytics and Speed Insights integrated
7. **Accessibility**: Semantic HTML, proper heading structure, alt text
8. **Dark Mode**: System-preference based with Tailwind dark mode support

## Common Tasks

### Adding a New Blog Post

1. Create `.mdx` file in `app/blog/posts/`
2. Add required frontmatter (title, publishedAt, summary)
3. Write content using MDX (Markdown + JSX)
4. Post automatically appears in blog list and sitemap

### Creating a New Component

1. Add to `app/components/` directory
2. Use named export: `export function ComponentName()`
3. Import using path alias: `import { Component } from 'app/components/name'`
4. Follow Tailwind utility-first styling

### Writing Tests

1. Create `*.test.tsx` in `app/__tests__/`
2. Use React Testing Library for component tests
3. Ensure path aliases resolve correctly via Jest config
4. Run `pnpm test` to verify

### Updating SEO Metadata

- **Site-wide**: Edit `app/layout.tsx` metadata export
- **Blog posts**: Update frontmatter in `.mdx` files
- **Base URL**: Change `baseUrl` in `app/sitemap.ts`

## Notes for Contributors

- This project uses **canary** Next.js and **alpha** Tailwind CSS v4
- Always test MDX content in development before deploying
- Maintain frontmatter schema consistency across all blog posts
- Keep component definitions consistent with established patterns
- Use path aliases (`app/...`) instead of relative imports
- Follow the prose styling conventions for content presentation
- SEO features are automatic but verify metadata accuracy
