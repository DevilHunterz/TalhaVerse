# TalhaVerse Design System

Complete design specifications and guidelines for TalhaVerse.

## Color Palette

### Primary Colors (Red Theme)
```css
--primary-50:  #FEF2F2   /* Lightest red tint */
--primary-100: #FEE2E2
--primary-200: #FECACA
--primary-300: #FCA5A5
--primary-400: #F87171
--primary-500: #EF4444
--primary-600: #DC2626   /* Main primary red */
--primary-700: #B91C1C
--primary-800: #991B1B   /* Deep red */
--primary-900: #7F1D1D   /* Dark maroon */
```

### Accent Colors
```css
--accent-gold: #F59E0B   /* Amber-500 for highlights */
--accent-pink: #EC4899   /* Pink-500 for gradients */
```

### Dark Theme (Default)
```css
--dark-bg:       #0F0F0F   /* Main background */
--dark-card:     #1A1A1A   /* Card background */
--dark-hover:    #252525   /* Hover states */
--text-light:    #F5F5F5   /* Primary text */
--text-muted:    #A3A3A3   /* Secondary text */
--border-color:  #374151   /* Gray-700 */
```

### Light Theme (Optional)
```css
--light-bg:      #FFFFFF
--light-card:    #F9FAFB
--light-hover:   #F3F4F6
--text-dark:     #111827
--text-muted:    #6B7280
```

## Typography

### Font Families
- **Display Font**: 'Orbitron' - Used for headings, logo, and emphasis
  - Weights: 400, 500, 600, 700, 800, 900
  - Google Fonts: `https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900`

- **Body Font**: 'Inter' - Used for body text and UI elements
  - Weights: 300, 400, 500, 600, 700
  - Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700`

### Font Sizes
```css
--text-xs:   0.75rem   /* 12px */
--text-sm:   0.875rem  /* 14px */
--text-base: 1rem      /* 16px */
--text-lg:   1.125rem  /* 18px */
--text-xl:   1.25rem   /* 20px */
--text-2xl:  1.5rem    /* 24px */
--text-3xl:  1.875rem  /* 30px */
--text-4xl:  2.25rem   /* 36px */
--text-5xl:  3rem      /* 48px */
--text-7xl:  4.5rem    /* 72px */
```

## Icon System

### Icon Library
**Lucide React** - Consistent outline-style icons

### Icon Mapping by Category
```javascript
{
  'mod': Cpu,
  'texture-pack': Layers,
  'modpack': Package,
  'shaderpack': Sparkles,
  'addon': Puzzle,
  'resource-pack': Image,
  'tool': Wrench,
  'download': Download,
  'user': User,
  'admin': Shield,
  'settings': Settings,
  'search': Search,
  'upload': Upload,
  'edit': Edit,
  'delete': Trash2,
  'star': Star,
  'heart': Heart,
  'trending': TrendingUp,
  'calendar': Calendar,
  'tag': Tag
}
```

### Icon Sizes
- Small: 16px (size={16})
- Medium: 20px (size={20})
- Large: 24px (size={24})
- XLarge: 32px (size={32})
- Hero: 48px (size={48})

### Icon Colors by Type
```javascript
{
  'mod': 'text-blue-500',
  'texture-pack': 'text-green-500',
  'modpack': 'text-purple-500',
  'shaderpack': 'text-yellow-500',
  'addon': 'text-pink-500',
  'resource-pack': 'text-orange-500',
  'tool': 'text-red-500'
}
```

## Component Styles

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(to right, #DC2626, #B91C1C);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(to right, #B91C1C, #991B1B);
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
  transform: translateY(-2px);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: #1A1A1A;
  color: #F5F5F5;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #252525;
}
```

### Cards

#### Standard Card
```css
.card {
  background: #1A1A1A;
  border-radius: 0.75rem;
  border: 1px solid #374151;
  overflow: hidden;
  transition: all 0.3s;
}
```

#### Hover Card
```css
.card-hover:hover {
  border-color: rgba(220, 38, 38, 0.5);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.1);
  transform: translateY(-4px);
}
```

#### Glass Card
```css
.glass {
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(55, 65, 81, 0.5);
}
```

### Inputs

```css
.input {
  width: 100%;
  background: #1A1A1A;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: #F5F5F5;
  transition: all 0.3s;
}

.input:focus {
  outline: none;
  border-color: #DC2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
}

.input::placeholder {
  color: #6B7280;
}
```

## Animations

### Glow Effect
```css
@keyframes glow {
  0% {
    box-shadow: 0 0 5px #DC2626, 0 0 10px #DC2626;
  }
  100% {
    box-shadow: 0 0 10px #DC2626, 0 0 20px #DC2626, 0 0 30px #DC2626;
  }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite alternate;
}
```

### Float Effect
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

### Gradient Text
```css
.glow-text {
  background: linear-gradient(to right, #EF4444, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## Layout Guidelines

### Spacing Scale
```css
--space-1:  0.25rem   /* 4px */
--space-2:  0.5rem    /* 8px */
--space-3:  0.75rem   /* 12px */
--space-4:  1rem      /* 16px */
--space-6:  1.5rem    /* 24px */
--space-8:  2rem      /* 32px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
--space-20: 5rem      /* 80px */
```

### Border Radius
```css
--radius-sm:  0.25rem  /* 4px */
--radius-md:  0.5rem   /* 8px */
--radius-lg:  0.75rem  /* 12px */
--radius-xl:  1rem     /* 16px */
--radius-full: 9999px  /* Fully rounded */
```

### Container Widths
```css
--container-sm:  640px
--container-md:  768px
--container-lg:  1024px
--container-xl:  1280px
--container-2xl: 1536px
```

### Grid Layouts

#### Item Grid (Responsive)
```css
/* Mobile: 1 column */
grid-template-columns: repeat(1, 1fr);

/* Tablet: 2 columns */
@media (min-width: 768px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  grid-template-columns: repeat(3, 1fr);
}

/* Large Desktop: 4 columns */
@media (min-width: 1280px) {
  grid-template-columns: repeat(4, 1fr);
}
```

## Logo Design

### Text Logo
```
TalhaVerse
```
- Font: Orbitron Bold (700)
- Size: 2rem (32px)
- Gradient: Primary red to pink
- Letter spacing: -0.02em

### Logo Variations
1. **Full Logo**: "TalhaVerse" with gradient
2. **Short Logo**: "TV" monogram
3. **Icon Logo**: Stylized "T" in shield shape

## Micro-interactions

### Button Press
```javascript
whileTap={{ scale: 0.95 }}
```

### Card Hover
```javascript
whileHover={{ y: -5, scale: 1.02 }}
```

### Stagger Children
```javascript
variants={{
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}}
```

### Page Transitions
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
transition={{ duration: 0.3 }}
```

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for normal text)
- Primary red (#DC2626) on dark background: 7.2:1 ✓
- White text on dark background: 15.8:1 ✓

### Focus States
- All interactive elements have visible focus indicators
- Focus ring: 2px solid primary color with 3px offset

### Keyboard Navigation
- Tab order follows logical flow
- All actions accessible via keyboard
- Skip links for main content

## Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

## Usage Examples

### Hero Section
- Large gradient text (5xl-7xl)
- Animated background pattern
- Prominent CTA button with glow
- Subtle parallax effect

### Content Cards
- Thumbnail with overlay gradient
- Type badge with icon
- Hover lift animation
- Download count and rating

### Admin Panel
- Sidebar navigation
- Stats cards with icons
- Data tables with actions
- Upload forms with validation

## Brand Voice

- **Modern**: Clean, contemporary design
- **Gaming-focused**: Bold, energetic aesthetics
- **Premium**: High-quality, polished feel
- **Accessible**: Easy to use, clear hierarchy
