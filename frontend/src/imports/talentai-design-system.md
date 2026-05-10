# Figma Design Prompt — TalentAI Job Platform
### Full UI/UX Design System & Screen Specifications

---

## 🎯 Project Overview

**Project Name:** TalentAI — AI-Powered Job Matching Platform  
**Platform:** Web Application (Desktop-first, Responsive)  
**Tech Stack:** MERN (MongoDB, Express, React, Node.js)  
**Audience:** Two user types — Job Seekers (Candidates) and Hiring Managers (Recruiters)  
**Design Philosophy:** Premium SaaS product. Feels like the intersection of Linear.app, Notion, and a Bloomberg terminal — intelligent, powerful, and beautifully controlled.

---

## 🎨 Design System Foundation

### Color Palette

**Primary Background (Dark Mode Base)**
```
--bg-primary:      #0A0A0F   /* Near-black, cold undertone */
--bg-secondary:    #111118   /* Card backgrounds */
--bg-tertiary:     #1A1A24   /* Elevated surfaces, modals */
--bg-glass:        rgba(255,255,255,0.04)  /* Glassmorphism panels */
```

**Brand Accent — Electric Indigo + Cyan Pair**
```
--accent-primary:  #6C63FF   /* Electric Indigo — CTAs, active states */
--accent-secondary:#00D4FF   /* Cyan — highlights, match scores, AI outputs */
--accent-glow:     rgba(108,99,255,0.25)  /* Glow behind buttons/badges */
```

**Status Colors**
```
--success:         #00E5A0   /* Shortlisted, Accepted, High match */
--warning:         #FFB547   /* Under Review, Pending */
--danger:          #FF4D6D   /* Rejected, Error */
--info:            #00D4FF   /* Notifications, AI outputs */
```

**Text Scale**
```
--text-primary:    #F0F0FF   /* Headlines, key labels */
--text-secondary:  #8B8BA0   /* Subtitles, meta info */
--text-muted:      #4A4A60   /* Placeholders, disabled */
```

**Border & Dividers**
```
--border-subtle:   rgba(255,255,255,0.06)
--border-medium:   rgba(255,255,255,0.12)
--border-accent:   rgba(108,99,255,0.4)
```

---

### Typography

**Display Font:** `Clash Display` (Bold weight) — For page titles, hero headlines  
**Body Font:** `Satoshi` (Regular, Medium, Bold) — For paragraphs, labels, UI text  
**Mono Font:** `JetBrains Mono` — For match scores, code-like outputs, AI extracted data  
**Import via:** Google Fonts + Fontshare (clashDisplay, satoshi)

**Type Scale**
```
--text-xs:    11px / 1.4 — Meta labels, badges
--text-sm:    13px / 1.5 — Secondary UI text
--text-base:  15px / 1.6 — Body text
--text-md:    17px / 1.5 — Card titles
--text-lg:    22px / 1.3 — Section headers
--text-xl:    32px / 1.2 — Page titles
--text-2xl:   48px / 1.1 — Hero headline
--text-3xl:   72px / 1.0 — Landing giant text
```

---

### Spacing System (8pt Grid)
```
4px / 8px / 12px / 16px / 24px / 32px / 48px / 64px / 96px / 128px
```

---

### Border Radius
```
--radius-sm:   6px   — Badges, tags
--radius-md:   12px  — Cards, inputs
--radius-lg:   20px  — Modals, panels
--radius-xl:   32px  — Hero containers, feature cards
--radius-full: 9999px — Pills, avatars, toggles
```

---

### Shadows & Depth
```
--shadow-card:   0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)
--shadow-modal:  0 8px 48px rgba(0,0,0,0.6), 0 0 80px rgba(108,99,255,0.1)
--shadow-glow:   0 0 40px rgba(108,99,255,0.3)
--shadow-cyan:   0 0 24px rgba(0,212,255,0.2)
```

---

### Component Primitives

**Buttons**
- Primary: `bg #6C63FF` → hover `bg #7B73FF` + glow shadow. Height 44px, px 24px, radius-md.
- Secondary: `border 1px --border-medium` + transparent bg → hover border `--accent-primary`. Same size.
- Ghost: Text only with underline on hover.
- Danger: `bg #FF4D6D` for destructive actions.
- All buttons: `font Satoshi Medium`, `font-size 14px`, `letter-spacing 0.02em`.

**Input Fields**
- `bg --bg-tertiary`, border `--border-subtle`, radius-md, height 48px.
- Focus: border color `--accent-primary` + subtle inner glow `box-shadow: 0 0 0 3px rgba(108,99,255,0.15)`.
- Label above: `text-sm --text-secondary Satoshi Medium`.
- Placeholder: `--text-muted`.

**Cards**
- `bg --bg-secondary`, border `--border-subtle`, radius-lg, padding 24px.
- Hover: border `--border-medium` + `translateY(-2px)` lift + subtle shadow increase.
- Active/Selected: border `--accent-primary` + left accent bar 3px wide.

**Badges / Pills**
- Skill tags: `bg rgba(108,99,255,0.12)` text `--accent-primary`, radius-full, px 12px py 4px, font-size 12px.
- Status badges: Color-coded using status palette above.
- Match score: Mono font, large, cyan colored.

**Sidebar Navigation**
- Width: 240px collapsed possible to 64px.
- `bg --bg-secondary`, right border `--border-subtle`.
- Active item: left bar 3px `--accent-primary` + `bg --bg-tertiary`.
- Icons: 20px, Lucide or Phosphor icon set.

---

### Animation Tokens
```
--duration-fast:    150ms
--duration-base:    250ms
--duration-slow:    400ms
--duration-slower:  700ms
--ease-out:         cubic-bezier(0.16, 1, 0.3, 1)   /* Snappy ease out */
--ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1) /* Slight overshoot */
--ease-smooth:      cubic-bezier(0.4, 0, 0.2, 1)
```

**Animation Rules:**
- Page enters: `opacity 0→1` + `translateY 16px→0` over `--duration-slow` with `--ease-out`.
- Cards stagger: each card delays by `index × 60ms`.
- Button press: `scale(0.97)` on mousedown.
- Modal open: `scale(0.95)→1` + `opacity 0→1` over `--duration-base`.
- Hover lifts: `translateY(-2px)` over `--duration-fast`.
- Number counters: Animate from 0 on page load (dashboard stats).
- Skeleton loading: Shimmer wave animation `background-position` shift.
- Kanban drag: `scale(1.03)` + `shadow-modal` + `rotate(1deg)` while dragging.

---

## 📐 Layout System

**Breakpoints**
```
Desktop:   1440px (primary design target)
Laptop:    1280px
Tablet:    768px
Mobile:    375px
```

**App Shell (Authenticated Pages)**
```
┌─────────────────────────────────────────────────┐
│  Topbar (64px height, full width)               │
├──────────┬──────────────────────────────────────┤
│          │                                       │
│ Sidebar  │   Main Content Area                  │
│ (240px)  │   (fluid, max-width varies)          │
│          │                                       │
└──────────┴──────────────────────────────────────┘
```

---

## 🖥️ Screen-by-Screen Specifications

---

### SCREEN 01 — Landing Page

**Frame size:** 1440 × 5200px (full scroll)  
**Mood:** Dark, premium, energetic. Like a YC-backed startup landing page.

**Section 1 — Hero (1440 × 900px)**

- Full-width dark background `--bg-primary`.
- Background: Radial gradient mesh — two blobs:
  - Blob 1: `rgba(108,99,255,0.15)` top-left area, 800px diameter, blur 120px.
  - Blob 2: `rgba(0,212,255,0.08)` bottom-right, 600px diameter, blur 100px.
- Noise texture overlay: 3% opacity grain for depth.
- Navigation bar:
  - Logo left: `TalentAI` in Clash Display bold, white + cyan dot accent.
  - Links center: `For Candidates` `For Recruiters` `How it Works` — Satoshi, 14px.
  - Right: `Login` ghost button + `Get Started` primary button.
- Hero content centered:
  - Overline: Small pill badge — `✦ AI-Powered Hiring` — indigo pill, uppercase, 11px mono.
  - Headline: `Find Work That Fits,` newline `Not Just Pays.` — Clash Display 72px, white.
  - Subheadline: `Upload your CV. Our AI matches you to jobs that align with your actual skills — not just keywords.` — Satoshi 18px, `--text-secondary`.
  - Two CTA buttons side by side:
    - `I'm Looking for a Job` — Primary button, large (52px height).
    - `I'm Hiring` — Secondary button, large.
  - Below buttons: `Trusted by 2,400+ candidates and 180+ companies` with 5 small avatar circles overlapping.
- Bottom of hero: A floating dashboard UI mockup preview image — angled `perspective(1000px) rotateX(8deg)` — glowing indigo border — shows the dashboard screenshot.

**Section 2 — How It Works (1440 × 700px)**

- Section label: `HOW IT WORKS` — uppercase mono text, cyan, 11px.
- Three numbered steps in a row:
  - Step 01: Upload CV icon → `Upload Your Resume` → description.
  - Step 02: Brain/AI icon → `AI Analyzes Your Skills` → description.
  - Step 03: Briefcase icon → `Get Matched to Real Jobs` → description.
- Each step: card with left number `01` in Clash Display 64px `rgba(108,99,255,0.15)` — big decorative — text overlaid.
- Connector line between steps: dashed `--accent-primary` line.

**Section 3 — Features Split (1440 × 800px)**

- Left: Large feature visual (dashboard screenshot or illustration).
- Right: Feature list with icons.
- Feature items (each with indigo icon + title + 1-line description):
  - AI Skill Extraction
  - Smart Job Matching
  - Real-Time Application Tracker
  - Blind Hiring Mode
  - Recruiter Analytics

**Section 4 — Dual CTA Banner (1440 × 400px)**

- Split design: Left half for candidates, right half for recruiters.
- Left: `Find Your Next Role` — indigo gradient bg.
- Right: `Build Your Dream Team` — dark bg with cyan accents.
- Each side has its own CTA button.

**Section 5 — Footer (1440 × 280px)**

- Logo + tagline left.
- Link columns: Product / Company / Legal.
- Bottom bar: Copyright + social icons.

---

### SCREEN 02 — Role-Based Registration

**Frame size:** 1440 × 900px  
**Layout:** Split screen 50/50.

**Left Panel (720px wide)**
- Background: Radial gradient `--accent-primary` to `--bg-primary`.
- Large decorative quote or tagline in Clash Display.
- Floating card mockup or abstract geometric shapes animated floating.
- Bottom: Testimonial quote from a user.

**Right Panel (720px wide)**
- `bg --bg-primary`, centered form content, max-width 420px.
- Top: `TalentAI` logo.
- Title: `Create your account` — Clash Display 32px.
- Subtitle: `Get started in under 2 minutes.`
- **Role Selector** (most important UI element here):
  - Two large cards side by side, selectable.
  - Card 1: Briefcase icon + `I'm a Candidate` + subtitle.
  - Card 2: Building icon + `I'm a Recruiter` + subtitle.
  - Selected state: border `--accent-primary` + indigo glow + checkmark top-right corner.
- Form fields: Name, Email, Password (with show/hide toggle).
- Submit button: Full-width primary button `Create Account`.
- Bottom: `Already have an account? Login`.
- Social divider: `── or continue with ──`.
- Google sign-in button (secondary style with Google icon).

---

### SCREEN 03 — Login Page

**Frame size:** 1440 × 900px  
**Layout:** Centered card on atmospheric background.

- Background: `--bg-primary` with subtle grid pattern overlay (1px lines, 3% opacity).
- Background blobs: Same indigo/cyan gradient blobs as landing.
- Center card: `bg --bg-secondary`, border `--border-medium`, radius-xl, padding 48px, width 480px, shadow-modal.
- Top of card: Logo + `Welcome back` in Clash Display 36px.
- Fields: Email, Password.
- Forgot Password link right-aligned below password field.
- Submit: Full-width primary button `Sign In`.
- Divider + Google.
- Register link below.
- Animation: Card fades in + rises from `translateY(20px)` on load.

---

### SCREEN 04 — Candidate Dashboard

**Frame size:** 1440 × 900px (viewport, scrollable main area)

**Topbar (64px)**
- Left: Logo.
- Center: Search bar `Search jobs, skills, companies...` with CMD+K shortcut badge.
- Right: Notification bell (with red dot badge) + Avatar dropdown.

**Sidebar (240px)**
- User avatar + name + role badge `Candidate` at top.
- Navigation links with Lucide icons:
  - 🏠 Dashboard (active)
  - 👤 My Profile
  - 📄 My CV
  - 🔍 Find Jobs
  - 📋 Applications
  - 💬 Messages
  - 🔔 Notifications
  - ⚙️ Settings
- Bottom: Upgrade banner card (optional) or logout button.

**Main Content Area**

- **Top greeting row:**
  - `Good morning, Ali 👋` — Clash Display 28px.
  - Date/time subtitle.
  - Quick action button `Upload New CV`.

- **Stats Row (4 cards):**
  - Card 1: `3` large mono number + `Active Applications` label + small trend arrow.
  - Card 2: `12` + `Job Matches`.
  - Card 3: `1` + `New Proposals`.
  - Card 4: `87%` + `Profile Completeness` with small circular progress ring.
  - Each card: `bg --bg-secondary`, border, radius-lg, padding 20px 24px. Icon top-right in muted color.
  - Entrance animation: Stagger `translateY(12px)→0` with 60ms delay each.

- **Two-column layout below stats:**
  - Left (60%): `Recommended Jobs` section — 3 job cards in list style.
  - Right (40%): `Recent Activity` timeline + `Application Status Summary` mini chart.

- **Job Card (list style):**
  - Company logo (circle avatar, 40px).
  - Job title + company name.
  - Tags: Location, Type (Remote/Onsite), Experience.
  - Match score badge: `92% Match` in cyan mono — prominent.
  - `Apply Now` ghost button on hover right side.
  - Hover: subtle lift + border glow.

---

### SCREEN 05 — CV Upload & AI Analysis

**Frame size:** 1440 × 900px

**Before Upload State:**
- Full centered layout, max-width 640px.
- Title: `Upload Your CV` Clash Display 36px.
- Subtitle: `AI will extract your skills and give you instant feedback.`
- **Drop Zone:**
  - Large dashed border rectangle, radius-xl, 320px height.
  - Border: `2px dashed --border-medium` → drag-over: `--accent-primary` with glow.
  - Center icon: Upload cloud icon 48px `--text-muted`.
  - Text: `Drag & drop your CV here` + `or` + `Browse Files` link.
  - Supported formats: `PDF, DOC, DOCX — Max 5MB` in muted text.
- Background: Same atmospheric blobs.

**After Upload — Analysis State (two-column):**
- Left Panel (50%):
  - `bg --bg-secondary`, padding 32px, radius-lg.
  - Header: `Extracted Skills` with brain AI icon.
  - Skill pills grid — each pill colored by category:
    - Technical: indigo pill.
    - Soft skills: cyan pill.
    - Tools: green pill.
  - Below pills: `Education` and `Experience` sections as clean list items.
  - Animated: Pills pop in one by one with scale+fade animation.

- Right Panel (50%):
  - `bg --bg-tertiary`, padding 32px, radius-lg, border `--border-accent`.
  - Header: `AI Resume Feedback` with sparkle icon, cyan color.
  - Three sections with icons:
    - `✓ Strengths` — green accent.
    - `⚠ Areas to Improve` — yellow accent.
    - `✦ Recommended Actions` — indigo accent.
  - Each section: 2–3 bullet lines in Satoshi 14px.
  - Bottom: `Overall Score` — Large `78/100` in Clash Display mono, with circular progress ring around it. Cyan glow.

---

### SCREEN 06 — Job Discovery Board

**Frame size:** 1440 × 900px

**Top Section:**
- Title: `Find Your Next Role` Clash Display 32px.
- Subtitle with match count: `Showing 48 jobs matched to your skills`.
- Filter bar below title:
  - Pills/tags for: All / Remote / Full-Time / Part-Time / Internship.
  - Right side: Salary slider, Experience dropdown, Location input, Sort dropdown.

**Job Card Grid (3 columns):**
Each card:
- Top bar: Company logo (40px) left + `New` badge top-right (for new postings).
- Job title: Satoshi Bold 16px.
- Company name + Location: 13px muted.
- Tags row: 2–3 skill tags (pill style).
- Match score: Large `88%` in JetBrains Mono cyan with a partial circle arc graphic behind it.
- Bottom: Salary range left + `View & Apply` button right.
- Card hover: Lift `translateY(-4px)`, border shifts to `--accent-primary`, subtle glow.

---

### SCREEN 07 — Job Detail Page

**Frame size:** 1440 × 900px

**Two-column layout:**

**Left Column (65%):**
- Company header: Logo (64px) + Company name + Industry + Location.
- Job title: Clash Display 36px.
- Meta badges: Experience Level, Job Type, Salary, Posted Date.
- Tab navigation: `Description` | `Requirements` | `Company`.
- Content area for each tab (long-form text with proper spacing).

**Right Column (35%):**
- Sticky card panel:
  - **Match Score Display:** Large circle gauge, `92%` in center, cyan, animated fill on load.
  - Skill match breakdown:
    - `React ✓ You have this`
    - `TypeScript ✓ You have this`
    - `AWS ✗ Missing` (red X)
  - `Apply Now` — full-width primary button (large, 52px).
  - `Save Job` — secondary button.
  - Share icon button.
  - Divider.
  - Company quick info card: headcount, founded, website.

---

### SCREEN 08 — Application Tracker (Kanban)

**Frame size:** 1440 × 900px

**Header:**
- Title: `My Applications` + count badge.
- View toggle: Kanban / List.

**Kanban Board:**
- 4 columns: `Applied` `Under Review` `Shortlisted` `Rejected`.
- Column header: Label + count badge + color-coded top bar (4px) per column:
  - Applied: indigo.
  - Under Review: yellow.
  - Shortlisted: green.
  - Rejected: red.

**Application Card (per column):**
- Company logo + Job title.
- Company name, Date applied.
- Status badge matching column color.
- Bottom: `View Details` link.
- Shortlisted cards: Subtle green glow border.
- Rejected cards: Lower opacity (0.6) + desaturated.

---

### SCREEN 09 — Messages / Offers Inbox

**Frame size:** 1440 × 900px  
**Layout:** Email-client style, two-panel.

**Left Panel (360px) — Message List:**
- Header: `Messages` + `Unread (2)` badge.
- Each message row:
  - Company avatar (40px circle).
  - Job title bold + company name muted.
  - Preview snippet of message.
  - Date/time top-right.
  - Unread: left blue border 3px + slightly brighter bg.
- Active/selected: `bg --bg-tertiary` + accent border.

**Right Panel — Message Detail:**
- Top: Company header (logo + name + job title applied for).
- Status banner (if proposal received):
  - `bg rgba(0,229,160,0.08)`, border green — `🎉 You received an interview proposal`.
- Message body in chat bubble style:
  - Recruiter message: Left-aligned bubble, `bg --bg-tertiary`.
- Proposed details card:
  - Interview date/time.
  - Notes from recruiter.
- **Action buttons — full-width, large:**
  - `✓ Accept & Share My Contact Info` — success green, 52px height.
  - `✗ Decline` — ghost danger.
- Below accept button: small text `Accepting will share your email with the recruiter.`

---

### SCREEN 10 — Notifications Page

**Frame size:** 1440 × 900px

- Page title: `Notifications`.
- Filter tabs: `All` | `Job Matches` | `Applications` | `Messages`.
- Mark all as read button (top right).

**Notification Item:**
- Icon left (20px, color-coded by type).
- Message text: `Company X viewed your application for Frontend Developer`.
- Time: `2 hours ago` — muted.
- Unread: `bg --bg-secondary` + left accent bar 3px `--accent-primary`.
- Read: `bg transparent`.
- Grouped by date: `Today` / `Yesterday` / `This Week` section headers.

---

### SCREEN 11 — Settings Page

**Frame size:** 1440 × 900px

**Two-column layout:**

**Left (240px) — Settings Nav:**
- Category links:
  - Account
  - Password & Security
  - Notifications
  - Privacy
  - Danger Zone

**Right (fluid) — Settings Content:**
For each section, card-based form layout:
- `Account`: Name, Email, Phone, Profile Photo upload.
- `Password`: Current / New / Confirm fields.
- `Notifications`: Toggle switches for each notification type.
- `Danger Zone`: Red-bordered card. `Delete Account` danger button. Confirmation modal required.

---

### SCREEN 12 — Candidate Profile Page

**Frame size:** 1440 × 900px

**Top Profile Banner:**
- Full-width banner background (gradient or mesh) — 200px height.
- Avatar (96px circle) overlapping bottom of banner.
- Name (Clash Display 28px) + current title + location.
- Edit Profile button top-right.
- Completion progress bar: `Profile 75% Complete` with indigo bar.

**Profile Sections (below banner):**
- Two-column layout.
- Left (35%): Sidebar with skills, links (GitHub/LinkedIn/Portfolio), quick stats.
- Right (65%): Main content sections:
  - About / Summary.
  - Experience (timeline style with company dots).
  - Education (same timeline style).
  - Certifications.

Each section has an edit (pencil) icon on hover.

---

### SCREEN 13 — Recruiter Dashboard

**Frame size:** 1440 × 900px  
*(Same shell as candidate but sidebar shows recruiter navigation)*

**Recruiter Sidebar Links:**
- 🏠 Dashboard
- 📢 Post a Job
- 📁 Manage Jobs
- 👥 Candidates
- 📊 Analytics
- ⚙️ Settings

**Main Content:**

- **Stats row (4 cards):**
  - Active Jobs.
  - Total Applicants.
  - Shortlisted.
  - Avg Match Score.

- **Two-column below:**
  - Left: `Active Job Postings` — list with applicant count and quick actions.
  - Right: `Applicant Skill Distribution` — Recharts Radar or Bar chart, styled dark with indigo bars.

- **Recent Applications feed:**
  - Latest 5 applicants across all jobs — avatar, name masked, job title, match score, date.

---

### SCREEN 14 — Job Posting Page

**Frame size:** 1440 × 900px

**Left (65%) — Form:**
- Title: `Post a New Job` Clash Display 36px.
- Fields:
  - Job Title (text input).
  - Location (with Remote checkbox).
  - Job Type (Full-Time / Part-Time / Contract segmented control).
  - Experience Level (Junior / Mid / Senior segmented).
  - Salary Range (dual-handle slider + manual inputs).
  - Job Description (large textarea, 300px min height, monospace-ish feel).
  - `✦ Extract Requirements with AI` — Full-width button, indigo gradient, sparkle icon. Prominent.

**Right (35%) — Live Preview:**
- Card preview that updates as fields are filled (live mirroring).
- Preview card: Same style as job discovery cards.
- Shows parsed required skills as they're extracted by AI.

**After AI Extraction:**
- Below the description textarea: AI results box appears (animated slide-down):
  - `bg --bg-tertiary`, border `--border-accent`.
  - Header: `AI Extracted Requirements ✦`.
  - Mandatory Skills: pill tags (editable — click to remove).
  - Experience Needed.
  - Confirm & Post button.

---

### SCREEN 15 — Manage Jobs Page

**Frame size:** 1440 × 900px

- Title: `Your Job Postings`.
- Filter: All / Active / Closed.
- `+ Post New Job` button top-right.

**Job Table:**
- Columns: Job Title | Posted Date | Applicants | Status | Actions.
- Row: Company (self) | Title | `14 Applicants` (clickable) | Active badge / Closed badge | Edit • View • Close buttons.
- Row hover: `bg --bg-tertiary`.
- Status badge: `Active` = green pill, `Closed` = muted gray pill.

---

### SCREEN 16 — Candidate Pipeline (Recruiter Kanban)

**Frame size:** 1440 × 900px

**Header:**
- Breadcrumb: `Manage Jobs > Frontend Developer > Pipeline`.
- Job summary row: Title + Company + Date + Total applicants badge.

**Kanban (same 4 columns as candidate side but interactive):**
- `New` | `Under Review` | `Shortlisted` | `Rejected`

**Candidate Card (draggable):**
- Masked avatar (blind hiring default) or real photo.
- `Candidate #047` or real name if blind mode off.
- Match score badge (prominent, cyan).
- Top 3 skills as tags.
- `View Full Profile` link.
- Drag handle icon on left.
- While dragging: `scale(1.03)` + `rotate(1.5deg)` + shadow-modal.

---

### SCREEN 17 — Candidate Detail Page (Recruiter View)

**Frame size:** 1440 × 900px

**Top bar:**
- Back button + `Frontend Developer Pipeline` breadcrumb.
- `Blind Hiring` toggle switch — prominent, top-right. When ON: blurs name/photo.
- `Send Proposal` primary button top-right.

**Three-panel layout:**

**Left Panel (25%):**
- Avatar (blurred if blind mode) + Name/masked + Match Score big display.
- Skill tags.
- Quick stats: Experience years, Education, Location.
- Action buttons: Shortlist / Reject.

**Center Panel (45%):**
- `AI Candidate Summary`:
  - `bg --bg-tertiary`, cyan left border, sparkle icon header.
  - 3–5 line plain-English summary.
- Skills match breakdown (vs job requirements):
  - Each skill: `React ✓` or `TypeScript ✗` with visual match bar.
- Detailed extracted experience/education.

**Right Panel (30%):**
- Embedded PDF viewer for original CV.
- `bg --bg-secondary`, border, radius-md.
- PDF renders inline (scaled to fit panel).
- Download button below.

---

### SCREEN 18 — Send Proposal Modal

**Overlay on any page (typically Candidate Pipeline or Detail)**

**Modal specs:**
- Backdrop: `rgba(0,0,0,0.7)` blur behind.
- Modal card: `bg --bg-tertiary`, border `--border-medium`, radius-xl, padding 40px, width 560px.
- shadow-modal.
- Open animation: `scale(0.95)→1` + `opacity 0→1` over 200ms.

**Content:**
- Header: `Send Interview Proposal` — Clash Display 24px + close X button.
- Candidate mini-card at top (masked or real).
- Textarea: `Your message to the candidate` — large, monospace feel.
- Two date/time pickers: `Proposed Interview Slot 1` and `Slot 2`.
- Optional: Salary offer range input.
- Footer: `Cancel` ghost + `Send Proposal` primary button.

---

### SCREEN 19 — 404 Error Page

**Frame size:** 1440 × 900px

- Large `404` in Clash Display, 200px, gradient text `--accent-primary` to `--accent-secondary`.
- Tagline: `You've wandered somewhere we haven't mapped yet.`
- Subtext: `The page you're looking for doesn't exist.`
- `Take me home` primary button.
- Subtle floating geometric shapes in background.
- Animation: Numbers float slightly up and down infinitely.

---

### SCREEN 20 — 403 Unauthorized Page

**Frame size:** 1440 × 900px

- Large `403` same style.
- `Lock` icon above number.
- Tagline: `You don't have access to this area.`
- `Go Back to Safety` primary button.

---

### SCREEN 21 — Loading / Skeleton States

**Skeleton Component:**
- Replace card content with:
  - Rounded rectangles, `bg --bg-tertiary`.
  - Shimmer animation: `background: linear-gradient(90deg, --bg-tertiary, rgba(255,255,255,0.05), --bg-tertiary)`.
  - `background-size: 200% 100%`.
  - `animation: shimmer 1.5s infinite`.
- Apply to: Job cards, Dashboard stats, Candidate cards, Notifications.

---

## 🔄 Micro-Interaction Specifications

| Element | Interaction | Animation |
|---|---|---|
| Button click | Mousedown | `scale(0.97)` 150ms |
| Card hover | Mouse enter | `translateY(-3px)` + border brighten 250ms |
| Page load | Mount | `opacity 0→1` + `translateY(16px→0)` 400ms ease-out |
| Stats counter | Mount | Count from 0 to value over 800ms |
| Skill pill added | After AI extraction | `scale(0→1)` + `opacity 0→1` stagger 40ms each |
| Kanban drag | Drag start | `scale(1.03)` + `rotate(1.5deg)` + glow shadow |
| Kanban drop | Drop end | Bounce spring `scale(1.05→1)` 200ms |
| Modal open | Trigger | `scale(0.95→1)` + `opacity 0→1` 200ms |
| Toggle switch | Click | Smooth slide 200ms + color transition |
| Notification dot | Unread exists | Subtle pulse animation |
| Match score ring | Page load | Draw arc from 0 to value 1000ms ease-out |

---

## 📱 Responsive Behavior Notes

**Tablet (768px):**
- Sidebar collapses to icon-only (64px width).
- Job grid: 2 columns.
- Stats: 2×2 grid.

**Mobile (375px):**
- Sidebar: Bottom navigation bar (5 icons).
- Job grid: 1 column.
- Split screens become stacked.
- Modal: Full-screen bottom sheet.

---

## 🧩 Figma Organization

**Page Structure:**
```
Page 1: Design System (Colors, Typography, Components)
Page 2: Public Screens (Landing, Login, Register)
Page 3: Candidate Screens
Page 4: Recruiter Screens
Page 5: System Screens (404, 403, Loading)
Page 6: Mobile Screens (Key screens adapted)
```

**Layer Naming Convention:**
```
frame/screen-name
  ├── bg/background
  ├── layout/sidebar
  ├── layout/topbar
  ├── content/section-name
  │     ├── card/item-name
  │     └── text/label-name
  └── overlay/modal-name
```

**Auto Layout:**
- All cards and lists use Figma Auto Layout.
- Gap, padding aligned to 8pt spacing system.
- Components published to team library.

**Variants Needed:**
- Button: Primary / Secondary / Ghost / Danger × Default / Hover / Active / Disabled.
- Input: Default / Focus / Error / Filled.
- Card (Job): Default / Hover / Selected.
- Badge: All status colors.
- Kanban Card: Default / Dragging.
- Sidebar Item: Default / Active / Hover.

---

## ✅ Final Checklist Before Handoff

- [ ] All 21 screens designed at 1440px.
- [ ] Design system page complete with all tokens.
- [ ] All interactive components have Hover + Active variants.
- [ ] Prototype connections set between key flows.
- [ ] Animations described in component notes.
- [ ] Mobile versions for at least 5 key screens.
- [ ] All text layers using Text Styles.
- [ ] All colors using Color Styles.
- [ ] Assets (icons, illustrations) organized in one frame.
- [ ] Export settings configured for developer handoff.

---

*TalentAI — Design Prompt v1.0*  
*Prepared for MERN Web Programming Project*