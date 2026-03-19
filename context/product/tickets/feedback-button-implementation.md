# Feedback Button Implementation Plan

## Overview
This plan details how to implement a feedback button that links to a third-party feedback service (Featurebase). The button is positioned fixed at the bottom-right of all pages and opens an external feedback portal in a new tab.

## Technology Stack
- **Frontend**: Next.js + React + TypeScript
- **Styling**: TailwindCSS
- **Icons**: react-icons
- **Third-party Service**: Featurebase (feedback collection platform)

## Project Structure
```
src/
├── features/
│   └── feedback/
│       ├── components/
│       │   └── FeaturebaseFeedbackLink.tsx
│       └── index.tsx
├── components/
│   └── FixedBottomRightStack.tsx
└── layouts/
    └── PageLayout.tsx (or your main layout)
```

## Step-by-Step Implementation

### Step 1: Install Dependencies
```bash
npm install react-icons
```

### Step 2: Create Utility Function (if not exists)
**File: `src/utils/cn.ts`**
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Step 3: Create Fixed Position Container Component
**File: `src/components/FixedBottomRightStack.tsx`**
```typescript
import { cn } from "~/utils/cn";

interface FixedBottomRightStackProps {
  children: React.ReactNode;
  className?: string;
}

export function FixedBottomRightStack({
  children,
  className,
}: FixedBottomRightStackProps) {
  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-end gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}
```

### Step 4: Create Feedback Button Component
**File: `src/features/feedback/components/FeaturebaseFeedbackLink.tsx`**
```typescript
import { FaRegCommentDots } from "react-icons/fa";

export const FeaturebaseFeedbackLink = () => {
  return (
    <a
      href="https://yourproject.featurebase.app/" // 🔄 REPLACE WITH YOUR URL
      className="flex items-center gap-2 rounded-full border border-amber-500/80 p-3 text-amber-500/80 backdrop-blur-xs transition-colors duration-200 hover:border-amber-500 hover:text-amber-500 hover:no-underline"
      aria-label="Provide feedback. Opens in new tab"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaRegCommentDots size={16} />
    </a>
  );
};
```

### Step 5: Create Feature Export
**File: `src/features/feedback/index.tsx`**
```typescript
export { FeaturebaseFeedbackLink } from "./components/FeaturebaseFeedbackLink";
```

### Step 6: Configure Tailwind Colors
**Update `tailwind.config.ts`:**
```typescript
import { type Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.amber, // Ensures amber-500 classes work
        secondary: colors.sky,
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### Step 7: Integrate with Main Layout
**Update your main layout file (e.g., `src/layouts/PageLayout.tsx`):**
```typescript
import { FeaturebaseFeedbackLink } from "~/features/feedback";
import { FixedBottomRightStack } from "~/components/FixedBottomRightStack";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex h-full min-h-screen flex-col justify-between">
      {/* Your existing header/nav */}
      <header>
        {/* Header content */}
      </header>

      {/* Main content */}
      <main className="relative isolate">
        {children}
      </main>

      {/* Footer */}
      <footer>
        {/* Footer content */}
      </footer>

      {/* Fixed bottom-right elements */}
      <FixedBottomRightStack>
        <FeaturebaseFeedbackLink />
        {/* Add other fixed elements here if needed */}
      </FixedBottomRightStack>
    </div>
  );
}
```

## Featurebase Setup

### 1. Create Featurebase Account
1. Go to [featurebase.app](https://www.featurebase.app)
2. Sign up for an account (free plan available)
3. Create a new project
4. Your feedback portal URL will be: `https://yourproject.featurebase.app/`

### 2. Update Component URL
Replace `https://yourproject.featurebase.app/` in `FeaturebaseFeedbackLink.tsx` with your actual Featurebase URL.

## Styling Details

### Button Appearance
- **Position**: Fixed 16px from bottom-right corner
- **Shape**: Circular with full rounded borders
- **Color Scheme**: Amber with opacity variations
- **Icon**: Comment dots icon (16px)
- **Padding**: 12px all around
- **Effects**: Backdrop blur and smooth transitions

### Responsive Behavior
- Button appears on all pages
- Maintains position across all screen sizes
- Z-index of 50 ensures it appears above other content

### Hover States
- Border color changes from `amber-500/80` to `amber-500`
- Text color changes from `amber-500/80` to `amber-500`
- Smooth 200ms transition

## Accessibility Features

### ARIA Support
- `aria-label` provides context for screen readers
- Clear indication that link opens in new tab

### Keyboard Navigation
- Focusable via keyboard navigation
- Proper focus states included in Tailwind classes

### Security
- `rel="noopener noreferrer"` prevents potential security issues
- `target="_blank"` opens in new tab without affecting current session

## Testing Checklist

### Visual Testing
- [ ] Button appears in bottom-right corner
- [ ] Button has correct amber styling
- [ ] Hover effects work smoothly
- [ ] Button is visible above other page content

### Functional Testing
- [ ] Clicking button opens Featurebase URL in new tab
- [ ] Button appears on all pages
- [ ] Button is accessible via keyboard navigation
- [ ] Screen readers can read the aria-label

### Responsive Testing
- [ ] Button position maintained on mobile devices
- [ ] Button size appropriate on all screen sizes
- [ ] No overlap with other UI elements

## Customization Options

### Different Icons
```typescript
// Replace FaRegCommentDots with other icons:
import { FaRegLightbulb } from "react-icons/fa";
import { HiOutlineChatBubbleLeft } from "react-icons/hi2";
import { BiMessageRounded } from "react-icons/bi";
```

### Different Colors
```typescript
// Change amber to other colors:
className="... border-blue-500/80 text-blue-500/80 hover:border-blue-500 hover:text-blue-500 ..."
```

### Multiple Buttons
```typescript
<FixedBottomRightStack>
  <FeaturebaseFeedbackLink />
  <ScrollToTopButton />
  <HelpButton />
</FixedBottomRightStack>
```

## Alternative Services

If not using Featurebase, you can replace the URL with:
- **Canny**: `https://yourproject.canny.io/`
- **UserVoice**: `https://yourproject.uservoice.com/`
- **Nolt**: `https://yourproject.nolt.io/`
- **Custom feedback form**: `/feedback` (internal route)

## Troubleshooting

### Button Not Visible
- Check z-index conflicts
- Verify Tailwind classes are being applied
- Ensure component is imported in layout

### Styles Not Applied
- Verify Tailwind config includes required colors
- Check if `cn` utility function exists
- Ensure Tailwind is processing the component files

### Icon Not Showing
- Verify react-icons is installed
- Check import path for the icon
- Ensure icon size is appropriate

## File Locations Summary
```
memory-bank/plans/feedback-button-implementation.md  ← This file
src/utils/cn.ts                                     ← Utility function
src/components/FixedBottomRightStack.tsx            ← Container component
src/features/feedback/components/FeaturebaseFeedbackLink.tsx  ← Main button
src/features/feedback/index.tsx                     ← Export module
src/layouts/PageLayout.tsx                          ← Layout integration
tailwind.config.ts                                  ← Color configuration
```

This implementation provides a complete, production-ready feedback button that matches the original functionality while being easily customizable and maintainable.