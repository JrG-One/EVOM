# EVOM - Design System & UI/UX Pro Max Guidelines

This document serves as the single source of truth for the **EVOM** design system. It follows the principles of the **UI/UX Pro Max** standards to ensure an accessible, high-performance, and visually elegant product.

## 1. Color Palette

The project utilizes `oklch` color spaces mapped to Tailwind CSS semantic variables to ensure deep compatibility with both light and dark themes.

### Light Mode (Base Theme)
| Semantic Name | Value | Description |
|---|---|---|
| `--background` | `oklch(0.985 0.002 247.858)` | Main application background (Off-white/slate tint) |
| `--foreground` | `oklch(0.141 0.005 285.823)` | Main text color (Slate-900 equivalent) |
| `--primary` | `oklch(0.585 0.233 257.23)` | Brand primary color (Deep Purple/Indigo) |
| `--secondary` | `oklch(0.95 0.01 257)` | Secondary interactive elements |
| `--destructive` | `oklch(0.55 0.2 25)` | Error states and destructive actions |
| `--muted` | `oklch(0.95 0.01 257)` | Subtle backgrounds (e.g., inactive tabs) |

### Dark Mode (`.dark`)
| Semantic Name | Value | Description |
|---|---|---|
| `--background` | `oklch(0.12 0.015 257)` | Deep slate background |
| `--foreground` | `oklch(0.95 0.005 257)` | High-contrast text |
| `--primary` | `oklch(0.65 0.2 257)` | Adjusted brand primary for dark contexts |
| `--border` | `oklch(1 0 0 / 12%)` | Subtle borders using opacity |

---

## 2. Typography & Layout

### Font Pairings
- **Headings**: `Inter` or `Outfit` (sans-serif) for high legibility.
- **Body**: `Inter` (sans-serif). Minimum font size of `16px` (`text-base`) for readability on mobile.

### Layout Spacing
- **Max Width**: The standard container should not exceed `max-w-7xl` (80rem).
- **Line Length**: Body paragraphs should be constrained to `65-75 characters` (`max-w-prose` in Tailwind).

---

## 3. UI/UX Pro Max Rules enforced

### Interaction & Cursor
- **Cursor**: Always use `cursor-pointer` on all clickable/hoverable elements (buttons, cards, links).
- **Hover Feedback**: Visual feedback via color, shadow, or border must be present.
  *Rule*: Use `transition-colors duration-200`. Avoid instant state changes.
- **Focus States**: 
  *Rule*: All interactive elements must show a focus ring for keyboard navigation: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

### Glassmorphism Standards
- **Light Mode `.glass`**:
  *Rule*: Must use `bg-white/80` or higher opacity. Do not use `bg-white/10` in light mode as it fails contrast checks.
- **Dark Mode `.glass`**:
  *Rule*: Uses `bg-black/20` with `border-white/10` to provide subtle structural framing.

### Icons & Imagery
- **No Emoji Icons**: The UI does not use emojis (🚀, ✨, etc.) as structural icons. All icons must be scalable SVGs (e.g., Lucide React).
- **Accessibility**: All meaningful images must have descriptive `alt` tags.

### Mobile & Touch
- **Touch Targets**: Minimum touch target size for interactive elements is `44x44px` (equivalent to Tailwind `h-11 w-11` or substantial padding).
- **Responsive Layout**: Horizontal scrolling must be avoided by ensuring elements fit the viewport (`overflow-x-hidden` on main wrapper).

---

## 4. Components

### Base Button
```tsx
<button className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2">
  Action
</button>
```

### Glass Card
```tsx
<div className="glass rounded-xl p-6">
  <h3 className="text-lg font-semibold text-foreground">Card Title</h3>
  <p className="text-muted-foreground mt-2">Card description content.</p>
</div>
```
