# Source Constructor (SOC) — Design System

**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** Approved
**Owner:** Design Lead

---

## Overview

The SOC Design System defines the shared language between design and engineering. It ensures visual consistency, accelerates development, and reduces design decisions during implementation.

This document covers:
- Design tokens
- Component specifications
- Layout grid
- Patterns & interactions
- Accessibility requirements

---

## 1. Design Tokens

Design tokens are the atomic values that underpin all UI decisions.

### 1.1 Color Tokens

```css
/* Brand Colors */
--color-cobalt-50:  #EFF6FF;
--color-cobalt-100: #DBEAFE;
--color-cobalt-200: #BFDBFE;
--color-cobalt-300: #93C5FD;
--color-cobalt-400: #60A5FA;
--color-cobalt-500: #3B82F6;
--color-cobalt-600: #2563EB;  /* Primary */
--color-cobalt-700: #1D4ED8;
--color-cobalt-800: #1E40AF;
--color-cobalt-900: #1E3A8A;

/* Neutral Colors */
--color-neutral-0:   #FFFFFF;
--color-neutral-50:  #F8FAFC;
--color-neutral-100: #F1F5F9;
--color-neutral-200: #E2E8F0;
--color-neutral-300: #CBD5E1;
--color-neutral-400: #94A3B8;
--color-neutral-500: #64748B;
--color-neutral-600: #475569;
--color-neutral-700: #334155;
--color-neutral-800: #1E293B;
--color-neutral-900: #0F172A;  /* Primary Text */

/* Semantic Colors */
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error:   #EF4444;
--color-info:    #3B82F6;

/* Semantic Backgrounds */
--color-success-bg: #ECFDF5;
--color-warning-bg: #FFFBEB;
--color-error-bg:   #FEF2F2;
--color-info-bg:    #EFF6FF;
```

### 1.2 Spacing Tokens

```css
--space-0:  0;
--space-px: 1px;
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### 1.3 Typography Tokens

```css
--font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

--font-size-xs:   12px;
--font-size-sm:   14px;
--font-size-base: 16px;
--font-size-lg:   18px;
--font-size-xl:   20px;
--font-size-2xl:  24px;
--font-size-3xl:  30px;
--font-size-4xl:  36px;
--font-size-5xl:  48px;

--font-weight-regular:  400;
--font-weight-medium:   500;
--font-weight-semibold: 600;
--font-weight-bold:     700;

--line-height-tight:  1.2;
--line-height-snug:   1.375;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
--line-height-loose:  1.8;
```

### 1.4 Border Radius Tokens

```css
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   12px;
--radius-xl:   16px;
--radius-2xl:  24px;
--radius-full: 9999px;
```

### 1.5 Shadow Tokens

```css
--shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-focus: 0 0 0 3px rgba(37, 99, 235, 0.4);
```

---

## 2. Component Library

### 2.1 Button

#### Variants

| Variant | Use Case |
|---------|----------|
| `primary` | Main CTA, one per screen |
| `secondary` | Secondary actions |
| `ghost` | Tertiary actions, navigation |
| `danger` | Destructive actions |
| `link` | Inline text actions |

#### Sizes

| Size | Height | Padding X | Font Size |
|------|--------|-----------|-----------|
| `sm` | 32px | 12px | 14px |
| `md` | 40px | 16px | 16px |
| `lg` | 48px | 24px | 16px |
| `xl` | 56px | 32px | 18px |

#### States

- Default
- Hover (lighten 10%)
- Active (darken 10%)
- Focus (ring shadow)
- Disabled (opacity 50%, cursor not-allowed)
- Loading (spinner replaces label)

#### Specification

```
Button
├── prefix-icon (optional)
├── label (required)
└── suffix-icon (optional)

Min width: 80px
Max width: none (full-width variant available)
Border radius: --radius-md (8px)
```

---

### 2.2 Input

#### Variants

- `text` — standard single-line input
- `textarea` — multi-line input
- `select` — dropdown selection
- `search` — with search icon prefix

#### States

- Default: `--color-neutral-300` border
- Focus: `--color-cobalt-600` border + focus shadow
- Error: `--color-error` border + error message below
- Disabled: `--color-neutral-100` background
- Filled: standard

#### Structure

```
Input Group
├── Label (required)
│   └── Required indicator * (if required)
├── Input Field
│   ├── Prefix (optional icon or text)
│   ├── Input element
│   └── Suffix (optional icon or action)
├── Helper text (optional)
└── Error message (conditional)
```

---

### 2.3 Card

#### Variants

| Variant | Description |
|---------|-------------|
| `default` | White background, light border |
| `elevated` | White background, shadow |
| `interactive` | Hoverable, cursor pointer |
| `highlight` | Cobalt left border accent |

#### Specification

```
padding:       --space-6 (24px)
border-radius: --radius-xl (16px)
border:        1px solid --color-neutral-200
background:    --color-neutral-0
```

---

### 2.4 Badge

Used for status indicators, tags, counts.

| Variant | Color |
|---------|-------|
| `default` | Neutral |
| `primary` | Cobalt |
| `success` | Green |
| `warning` | Amber |
| `error` | Red |

Sizes: `sm` (12px text), `md` (14px text)

---

### 2.5 Avatar

```
Sizes:  xs=24px, sm=32px, md=40px, lg=48px, xl=64px
Shape:  Circle (radius-full)
Fallback: Initials with generated background color
```

---

### 2.6 Chat Bubble (AI-specific)

Unique to SOC — represents the AI conversation interface.

```
User Message:
├── Alignment: right
├── Background: --color-cobalt-600
├── Text color: white
├── Border radius: 18px 18px 4px 18px
└── Max width: 75%

AI Message:
├── Alignment: left
├── Background: --color-neutral-100
├── Text color: --color-neutral-900
├── Border radius: 18px 18px 18px 4px
└── Max width: 85%

Typing Indicator:
└── Three animated dots, 600ms cycle
```

---

### 2.7 Progress Indicator

Used for project completion and milestone tracking.

```
Linear Progress Bar:
├── Height: 6px
├── Border radius: --radius-full
├── Track: --color-neutral-200
└── Fill: --color-cobalt-600 (gradient to --color-violet-600)

Circular Progress:
├── Diameter: 48px, 64px, 96px
├── Stroke width: 4px
└── Label: percentage centered
```

---

### 2.8 Tooltip

```
Max width:      240px
Background:     --color-neutral-900
Text color:     --color-neutral-0
Padding:        6px 10px
Border radius:  --radius-md
Font size:      --font-size-sm
Delay:          300ms
Arrow:          8px triangle
```

---

## 3. Layout System

### 3.1 Grid

```
Columns:   12
Gutter:    24px (desktop), 16px (tablet), 12px (mobile)
Margin:    Auto (centered, max-width container)
```

### 3.2 Breakpoints

```
xs:  0px      (< 640px)    — mobile
sm:  640px    (≥ 640px)    — large mobile
md:  768px    (≥ 768px)    — tablet
lg:  1024px   (≥ 1024px)   — desktop
xl:  1280px   (≥ 1280px)   — large desktop
2xl: 1536px   (≥ 1536px)   — wide screen
```

### 3.3 Container Max Widths

```
Default content: max-width 1200px
Narrow content:  max-width  720px (articles, forms)
Chat interface:  max-width  800px
```

---

## 4. Page Templates

### 4.1 App Shell

```
┌────────────────────────────────────────┐
│  Top Navigation (64px height)          │
├──────────────┬─────────────────────────┤
│              │                         │
│  Sidebar     │   Main Content Area     │
│  (240px)     │                         │
│              │                         │
│  - Nav items │                         │
│  - User menu │                         │
└──────────────┴─────────────────────────┘
```

### 4.2 Discovery Session

```
┌────────────────────────────────────────┐
│  Session Header (session name, timer)  │
├────────────────────────────────────────┤
│                                        │
│         Chat Message Area              │
│         (scrollable, 60vh)             │
│                                        │
├────────────────────────────────────────┤
│  Progress indicators (phases)          │
├────────────────────────────────────────┤
│  Message Input + Send Button           │
└────────────────────────────────────────┘
```

---

## 5. Interaction Patterns

### 5.1 Loading States

All async actions must show loading state within 100ms.

- **Button loading:** spinner replaces label, button disabled
- **Page loading:** skeleton screens (not spinners)
- **Content refresh:** subtle opacity pulse on content

### 5.2 Empty States

Every empty state must have:
1. An illustration or icon
2. A descriptive headline (what's missing)
3. A clear CTA to create/add content
4. Optional: educational context

### 5.3 Error Handling

| Error Type | Pattern |
|------------|---------|
| Form validation | Inline error below field |
| API error | Toast notification (dismissible) |
| Page-level error | Error boundary with retry CTA |
| Network offline | Persistent banner |

### 5.4 Confirmation Dialogs

Required for destructive actions:
- Delete project
- Cancel subscription
- Clear session data

Dialog must:
- Name the specific item being affected
- Use "Delete [Item Name]" as the destructive button label
- Have a clear cancel option as default focus

---

## 6. Accessibility Checklist

### Per-Component Requirements

- [ ] All interactive elements reachable via keyboard
- [ ] Focus indicators visible on all interactive elements
- [ ] Color is never the sole means of conveying information
- [ ] Minimum tap target size: 44×44px
- [ ] Error messages associated with inputs via `aria-describedby`
- [ ] Icons have `aria-label` or accompanying visible text
- [ ] Loading states announced via `aria-live` regions
- [ ] Modal dialogs trap focus and restore on close

---

*Document Owner: Design Lead | Component library maintained in Figma: [SOC Design System]*
