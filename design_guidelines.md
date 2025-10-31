# Design Guidelines: News Analyzer & Summary App

## Design Approach

**Selected Approach:** Design System (Material Design) with inspiration from Medium and The New York Times

**Justification:** This is an information-dense, utility-focused application requiring excellent readability, clear information hierarchy, and professional presentation. Material Design provides robust patterns for data-heavy interfaces while maintaining visual clarity.

**Key Design Principles:**
1. Content-first hierarchy - news and analysis are primary
2. Professional credibility - inspire trust in AI summaries
3. Efficient scanning - users quickly find and analyze articles
4. Conversational AI integration - seamless chatbot experience

---

## Core Design Elements

### A. Typography

**Font System (Google Fonts):**
- Primary: Inter (body text, UI elements, metadata)
- Secondary: Merriweather (article headlines, emphasis)

**Type Scale:**
- Hero Headlines: 2.5rem/3rem (40px/48px), font-bold
- Article Titles: 1.5rem/2rem (24px/32px), font-semibold
- Section Headers: 1.25rem (20px), font-semibold
- Body Text: 1rem (16px), font-normal, line-height relaxed (1.75)
- Metadata/Labels: 0.875rem (14px), font-medium
- Chat Messages: 0.9375rem (15px), font-normal

---

### B. Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing (within components): p-2, gap-2
- Standard spacing (between elements): p-4, gap-4, m-4
- Section spacing: p-6, py-8, space-y-8
- Large sections: p-12, py-16

**Grid Structure:**
- Main container: max-w-7xl mx-auto
- Article grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Split view: grid-cols-1 lg:grid-cols-[2fr_1fr] (article 66%, summary 33%)
- Chatbot integration: Fixed right sidebar or slide-out panel

**Breakpoints:**
- Mobile: Base (single column)
- Tablet: md (2 columns for grid)
- Desktop: lg+ (3 columns for grid, split-view activated)

---

### C. Component Library

#### Header & Navigation
- Fixed top header with subtle shadow
- Logo/branding left-aligned
- Search bar: Centered, max-w-2xl, rounded-lg, prominent placement
- Search icon: Left-aligned inside input
- Height: h-16 with px-4 horizontal padding
- Search input styling: Generous padding (py-3 px-12), clear focus states

#### News Article Grid
- Card-based layout with consistent aspect ratios
- Each card includes:
  - Thumbnail image (16:9 ratio, h-48, object-cover)
  - Source badge (top-left overlay on image)
  - Article title (2 lines max, truncate with ellipsis)
  - Brief description (3 lines, text-sm)
  - Metadata row: Source name, publication date, reading time
  - Hover state: Subtle lift (transform scale-[1.02])
- Card spacing: gap-6 in grid
- Card padding: p-4
- Rounded corners: rounded-lg

#### Article Detail View (Split Layout)

**Left Panel - Full Article:**
- Width: 2fr (66% on desktop)
- Content wrapper: max-w-3xl for optimal reading (65-75 characters/line)
- Article header:
  - Headline (text-3xl to text-4xl, font-bold, mb-4)
  - Author byline and metadata (mb-6)
  - Featured image (w-full, rounded-lg, mb-8)
- Body text: Generous line-height (leading-relaxed), paragraph spacing (space-y-4)
- Padding: p-8 to p-12

**Right Panel - Summary & Chat:**
- Width: 1fr (33% on desktop)
- Fixed/sticky positioning (top-16, h-[calc(100vh-4rem)])
- Two sections with tab navigation or accordion:

**Summary Section:**
- Header: "AI Summary" with Gemini badge
- Key points list: Bulleted format, space-y-2
- Important entities highlighted: Bold or distinct treatment
- Reading time estimate
- Confidence indicator (optional visual)

**Chatbot Section:**
- Chat header: "Ask about this article"
- Message container: Scrollable, flex-col-reverse for bottom-up
- Message bubbles:
  - User: Right-aligned, rounded-2xl, px-4 py-2
  - AI: Left-aligned, rounded-2xl, px-4 py-2
  - Spacing between: space-y-3
- Input area: Fixed bottom, px-4 py-3
- Send button: Icon button, right-aligned in input

#### Search & Filter
- Search bar: Prominent in header
- Real-time filtering: Instant results as user types
- Search results: Highlighted matching text
- No results state: Friendly message with suggestions
- Clear search button (X icon) when active

#### Loading States
- Article cards: Skeleton screens with shimmer effect
- Summary generation: Animated dots or progress indicator
- Chat responses: Typing indicator (animated ellipsis)

---

### D. Responsive Behavior

**Mobile (< 768px):**
- Single column article grid
- Search bar: Full width, mb-4
- Split view becomes stacked: Article first, then collapsible summary
- Chatbot: Bottom sheet or full-screen modal
- Simplified metadata (hide non-essential info)

**Tablet (768px - 1024px):**
- Two-column article grid
- Split view: 60/40 ratio
- Chatbot remains in right panel

**Desktop (1024px+):**
- Three-column article grid
- Full split-view implementation (66/33)
- All features visible simultaneously

---

### E. Micro-interactions

**Minimal Animations:**
- Card hover: Subtle lift (duration-200)
- Search focus: Smooth border transition
- Chat message entry: Slide-in from appropriate side (duration-300)
- Page transitions: Fade (duration-150)
- Summary generation: Progressive reveal as content loads

**No distracting effects** - maintain professional, focused experience

---

## Images

**Hero Section:** No traditional hero - lead directly with news grid for efficiency

**Article Cards:**
- Thumbnail images: 16:9 ratio, high-quality news imagery
- Fallback: Generic news/category icon when no image available
- Image optimization: Lazy loading, responsive sizes

**Article Detail:**
- Featured image: Full-width, high-resolution, contextual to article
- Placement: Below headline, before body text
- Treatment: Rounded corners (rounded-lg), subtle shadow

**Chatbot:**
- Small AI assistant icon/avatar for bot messages
- User avatar: Initials or generic profile icon

---

## Accessibility & Professional Polish

- Consistent focus indicators across all interactive elements
- Form inputs: Clear labels, visible placeholders, error states
- Semantic HTML structure (articles, sections, headers)
- ARIA labels for icon buttons
- Keyboard navigation: Full support for search, chat, article browsing
- Screen reader optimization for summary content
- Minimum touch target: 44x44px for mobile interactions