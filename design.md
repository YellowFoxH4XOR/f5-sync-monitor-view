F5 Sync Monitor - UI/UX Design Documentation
Brand Identity
Color Palette

Primary: #8B5CF6 (Purple)
Secondary: #7E69AB (Deep Purple)
Success: #10B981 (Green)
Warning: #F59E0B (Amber)
Error: #EF4444 (Red)
Background: #FFFFFF (Light) / #1A1F2C (Dark)
Text: #111827 (Dark) / #F9FAFB (Light)
Muted Text: #6B7280 (Gray)
Typography

Primary Font: Inter or SF Pro Text
Headings: 24px-32px (Bold)
Body Text: 14px-16px (Regular)
Small Text/Labels: 12px (Medium)
Component Library
The UI uses a design system similar to Shadcn UI with these core components:

Cards with subtle shadow and border
Tables with alternating row colors
Badges for status indicators
Dropdown selects with search functionality
Datepickers for configuration selection
Code display with syntax highlighting
Tooltips for additional information
Page Designs
1. Dashboard
Layout Structure:

Navbar (fixed at top)
Page Header with title and search
View Toggle (Grid/List)
Device Cards Grid (3 columns on desktop, 2 on tablet, 1 on mobile)
Each card displays:
Device Name (Header)
IP Address
Last Sync Time with tooltip for full timestamp
Sync Status Badge (color-coded)
Model & Version info
Responsive Behavior:

Desktop: 3-column grid
Tablet: 2-column grid
Mobile: Single column list
Interactive Elements:

Hover effect on cards
Click to navigate to device detail
Search with instant filtering
Grid/List view toggle
2. Device Detail Page
Layout Structure:

Back button to Dashboard
Device header with name and status badge
Two-column layout with info cards:
Left: Device Information card
Right: Sync Status card
Configuration History section with table
Table columns: Date, Time, Config ID, Actions
Interactive Elements:

Click on configuration row to view/compare
Back button with hover effect
Status badge with tooltip
3. Configuration Diff Page
Layout Structure:

Header with title
Two selection panels side-by-side:
Left: Device & config selection
Right: Device & config selection
Compare button (centered)
Legend for diff colors
Navigation controls for differences
Split-pane diff viewer:
Left: First configuration
Right: Second configuration
Line numbers visible
Color-coding for changes
Interactive Elements:

Synchronized scrolling between panes
Next/Previous diff navigation
Calendar selection for configuration dates
Dropdown for device selection
Compare button with loading state
Responsive Design Specifications
Breakpoints:

Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
Mobile Adaptations:

Navigation becomes more compact
Cards stack vertically
Tables become scrollable horizontally
Diff view adjusts to vertical stacking when needed
Navigation Flow
User lands on Dashboard
User can:
Search for specific devices
Toggle between grid/list views
Click on a device to view details
On Device Detail page:
View device information
See configuration history
Select a configuration to compare
On Configuration Diff:
Select two configurations
Compare differences
Navigate through changes
State Indicators
Sync Status Colors:

In Sync: Green (#10B981)
Out of Sync: Red (#EF4444)
Warning: Amber (#F59E0B)
Unknown: Gray (#6B7280)
Diff Highlights:

Added: Light green background
Removed: Light red background
Unchanged: No highlight
Animation Specifications
Page transitions: Fade in (300ms ease-out)
Card hover: Subtle shadow increase (150ms)
Button hover: Background lightness change (100ms)
Loading states: Subtle spinner animation
Navigation between diffs: Smooth scroll to position
Accessibility Considerations
Sufficient color contrast (WCAG AA compliant)
Keyboard navigation for all interactive elements
Screen reader friendly element structure
Focus indicators for keyboard users
Alternative text for visual elements
