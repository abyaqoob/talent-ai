# TalentAI — Galileo AI Prompts
# One screen per prompt. Paste each separately into Galileo AI.
# Design system to apply to ALL screens (copy this into Galileo's style settings first)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GLOBAL DESIGN SYSTEM — Apply to every screen
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Color Palette:
- Page background: #05050A (near black)
- Card background: #12121C
- Elevated surface: #1C1C28
- Primary accent: #7C6EFA (electric indigo/purple)
- Secondary accent: #22D3EE (cyan)
- Success: #10B981 (green)
- Warning: #F59E0B (amber)
- Danger: #EF4444 (red)
- Primary text: #F8F8FF (near white)
- Secondary text: #A0A0B8 (muted)
- Border: rgba(255,255,255,0.08)

Typography:
- Headlines: Space Grotesk Bold
- Body text: DM Sans Regular/Medium
- Numbers and scores: JetBrains Mono Bold

Style Rules:
- Dark mode throughout — no light backgrounds
- Cards have subtle border rgba(255,255,255,0.08) and rounded corners 16px
- Primary buttons: #7C6EFA background, white text, 14px rounded
- Purple glow effect on active elements: box-shadow 0 0 24px rgba(124,110,250,0.3)
- Cyan color used exclusively for AI-related features and match scores
- All icons are from Lucide icon set — clean line icons, never emoji
- Spacing based on 8pt grid

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 01 — Landing Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a premium dark-mode SaaS landing page for an AI-powered job matching platform called TalentAI. Desktop width 1440px.

Navigation bar at top:
- Left: Logo "TalentAI" with a small lightning bolt icon in purple-to-cyan gradient
- Center: Nav links — For Candidates, For Recruiters, How It Works — in DM Sans 14px muted white
- Right: Ghost button "Sign In" and filled purple button "Get Started"
- Nav background slightly blurred dark with bottom border

Hero section (full viewport height):
- Background #05050A with two large blurred gradient blobs — one purple top-left, one cyan bottom-right
- Subtle noise grain texture overlay at 3% opacity
- Small pill badge at top center: purple background, white text "✦ AI-Powered Talent Matching"
- Giant headline in Space Grotesk Bold 72px: "Find Work That Fits," on first line, "Not Just Pays." on second line — pure white
- Subheadline below in DM Sans 18px muted: "Upload your CV. Our AI matches you to roles that align with your real skills — not just keywords."
- Two CTA buttons side by side: filled purple "I'm Looking for a Job" and outlined "I'm Hiring"
- Below buttons: row of 5 overlapping small avatar circles + text "Trusted by 2,400+ candidates & 180+ companies"
- Bottom of hero: floating dashboard UI mockup card angled with perspective tilt, glowing purple border, showing a mini dashboard preview with stats and a job card

How It Works section:
- Section label "HOW IT WORKS" in cyan mono uppercase small text
- Heading "Three steps to your dream role" in Space Grotesk 40px
- Three cards in a row, each with:
  - Large decorative step number (01, 02, 03) in very faint purple behind the card
  - Small icon in a purple-tinted box
  - Card title in Space Grotesk bold
  - 2-line description in DM Sans muted
  - Cards: Upload Your Resume, AI Analyzes Your Skills, Get Matched to Real Jobs
  - Dashed purple connector line between cards

Split CTA Banner:
- Two side-by-side panels spanning full width
- Left panel: purple gradient background, user icon, heading "Find Your Next Role", description, purple button
- Right panel: dark background with cyan accents, building icon, heading "Build Your Dream Team", description, cyan button

Footer:
- Dark background, logo left, nav links center, copyright right
- Clean minimal layout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 02 — Registration Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode split-screen registration page for TalentAI. Desktop 1440px wide, 900px tall.

Left half (720px):
- Background: deep dark with purple-to-cyan radial gradient overlay
- Large decorative text in Space Grotesk: "Your career, supercharged by AI." in white bold
- Below: short description in muted text
- Bottom: testimonial card with glass effect (semi-transparent dark background, subtle white border) containing 5 gold stars, italic quote text, small avatar circle, name and role below avatar

Right half (720px):
- Background #05050A
- Centered content max-width 440px
- TalentAI logo at top
- Heading "Create your account" Space Grotesk Bold 28px
- Subtext "Ready in 2 minutes. No credit card needed."
- Role selector: two large selectable cards side by side
  - Left card: person icon, "Candidate", subtitle "I'm looking for a job"
  - Right card: building icon, "Recruiter", subtitle "I'm hiring talent"
  - Selected state: purple border, purple glow shadow, purple checkmark badge top-right corner
  - Unselected: subtle dark border
- Form fields below (full width each): Full Name, Email Address, Password with show/hide eye icon toggle
- Large purple full-width button "Create Account →"
- Divider line with "or" text
- Google sign-in button with Google logo icon, outlined style
- Footer text: "Already have an account? Sign in" with purple link

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 03 — Login Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode login page for TalentAI. Desktop 1440px wide, 900px tall.

Background:
- Dark #05050A with subtle dot grid pattern at 4% opacity
- Two large blurred gradient blobs: purple top-left, cyan bottom-right at low opacity

Center card (480px wide):
- Background #12121C, border rgba(255,255,255,0.1), border-radius 24px, padding 48px
- Soft purple glow shadow behind card
- TalentAI logo centered at top
- Heading "Welcome back" in Space Grotesk Bold 32px centered
- Subtext "Sign in to continue to TalentAI" in muted DM Sans
- Form fields: Email Address, Password (with show/hide eye icon on right side)
- "Forgot password?" link right-aligned below password field in purple
- Large full-width purple button "Sign In" 48px height
- Divider with "or"
- Google button outlined
- "Don't have an account? Create one →" link at bottom in purple

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 04 — Candidate Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode candidate dashboard for TalentAI job platform. Desktop 1440px wide, 900px tall.

Left sidebar (240px wide):
- Background #0C0C14, right border subtle
- Top: small avatar circle (purple gradient), name "Ali Hassan", small "Candidate" purple pill badge below name
- Navigation items with Lucide icons, each 40px tall with 12px horizontal padding:
  - Dashboard (active — purple left border 3px, purple icon and text, slightly lighter background)
  - My Profile (person icon)
  - My CV (file icon)
  - Find Jobs (compass icon)
  - Applications (kanban icon)
  - Messages (mail icon) with red badge "2"
  - Notifications (bell icon) with red badge "3"
  - Settings (gear icon)
- Bottom: "Sign out" ghost button with logout icon

Top navigation bar (64px height, full width minus sidebar):
- Background #0C0C14, bottom border subtle
- Search bar center: dark background, magnifier icon left, placeholder "Search jobs, skills, companies...", "⌘K" keyboard shortcut badge right
- Right side: bell icon button with red dot, purple avatar circle

Main content area (background #05050A, padding 32px):
- Greeting row: "Good morning, Ali 👋" in Space Grotesk Bold 28px left, "Upload New CV" purple button right
- Date subtitle below greeting in muted small text

4 stat cards in a row (equal width, 16px gap):
- Card 1: large "3" in JetBrains Mono Bold purple, "Active Applications" label below, file icon top-right muted
- Card 2: large "12" in cyan, "Job Matches" label, target icon top-right
- Card 3: large "1" in green, "New Proposals", award icon top-right
- Card 4: large "87%" in amber, "Profile Complete", progress bar below label, zap icon top-right
- Each card: #12121C background, subtle border, 16px rounded, 20px padding

Two column layout below stats:
Left column (60%):
- Section heading "Recommended for You" with sparkle icon
- "View all →" ghost button right
- 3 job cards stacked:
  - Company avatar circle left (40px)
  - Job title bold + company and location muted below
  - 2-3 purple skill tags
  - Right side: circular match score ring showing percentage in cyan JetBrains Mono
  - Card hover shows subtle lift

Right column (40%):
- "Recent Activity" section with 4 items, each with colored icon box, activity text, time ago
- "Application Status" mini section with colored dots and counts for each status

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 05 — CV Upload Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode CV upload and AI analysis page for TalentAI. Desktop 1440px, inside the app shell (sidebar + topbar visible).

Show the AFTER state — after CV has been uploaded and analyzed.

Page header:
- Title "CV Analysis Complete" Space Grotesk Bold 32px
- Subtitle "Ali_Hassan_CV.pdf · Analyzed just now" muted
- Right side: "Re-analyze" outlined button and "Find Matching Jobs" purple button

Two column layout (equal width, 24px gap):

Left card — Extracted Skills (#12121C background, 16px border radius, 24px padding):
- Section header "Extracted Skills" with purple lightning bolt icon
- Three skill groups each with a small label:
  - "Technical" — purple pill tags: React, TypeScript, Node.js, MongoDB, Express.js, GraphQL
  - "Tools & Platforms" — cyan pill tags: Git, Docker, AWS, Figma, Postman
  - "Soft Skills" — green pill tags: Leadership, Communication, Problem Solving
- Divider line
- "Experience" section with two timeline items:
  - Each: small company avatar, role name bold, company name purple, date range right in mono
- "Education" section: university name, degree, year

Right card — AI Resume Feedback (dark background with subtle cyan border and tint):
- Section header "AI Resume Feedback" with sparkle icon in cyan
- Large circular score display center: ring graphic showing 78%, "78/100" in JetBrains Mono large cyan, "Overall Score" label below
- Three feedback sections each in a colored tinted box:
  - Green tint box: checkmark icon, "Strengths" heading, 3 bullet points
  - Amber tint box: warning icon, "Areas to Improve" heading, 3 bullet points  
  - Purple tint box: sparkle icon, "Recommended Actions" heading, 3 bullet points

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 06 — Job Discovery Board
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode job discovery page for TalentAI. Desktop 1440px, inside app shell.

Page header:
- Title "Find Your Next Role" Space Grotesk Bold 32px
- Subtitle "Showing 48 jobs matched to your skills" — "48 jobs" in cyan

Filter bar below header:
- Pill toggle buttons: All (active/purple), Remote, Full-Time, Part-Time, Contract, Internship
- Right side: "Filters" button with filter icon, grid/list view toggle buttons

Job cards grid — 3 columns, 6 cards total:

Each job card (#12121C background, 16px radius, 20px padding, hover lift effect):
- Top row: company avatar circle (42px, purple gradient) left, job title bold 14px, company name muted 12px — "New" green badge top-right on some cards
- Middle: 3 purple skill pill tags
- Location and job type tags in muted style with map pin and briefcase icons
- Bottom row: salary range in JetBrains Mono muted left, large circular match score ring right showing % in cyan
- Full-width purple "View & Apply" button at bottom of card

Cards to show:
1. Senior Frontend Engineer — Stripe — Remote — React, TypeScript, GraphQL — 94% match
2. Full Stack Developer — Vercel — San Francisco — Next.js, Node.js, PostgreSQL — 88% match
3. React Native Engineer — Linear — Remote — React Native, TypeScript, Redux — 82% match
4. Backend Engineer — Notion — New York — Python, FastAPI, MongoDB — 76% match
5. DevOps Engineer — GitHub — Remote — Docker, Kubernetes, AWS — 71% match
6. UI/UX + Frontend Dev — Figma — Remote — React, CSS, Figma — 85% match

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 07 — Job Detail Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode job detail page for TalentAI. Desktop 1440px, inside app shell.

Back button at top: "← Back to Jobs" ghost button

Two column layout (65% left, 35% right, 24px gap):

Left column:
- Company header card: large company avatar 64px, "Senior Frontend Engineer" title Space Grotesk 26px bold, "Stripe · Remote" muted, badge row: purple "Full-time", cyan "4+ years", muted "$120k–$160k", muted "2 days ago"
- Tab navigation below badges: Description | Requirements | Company — active tab has purple underline
- Job description content: paragraph text, "Key Responsibilities" heading, 4 bullet items each with green checkmark icon

Right column (sticky):
- Card with purple glow shadow:
  - Large circular match score gauge 100px: arc graphic, "94%" center in JetBrains Mono large cyan, "Your Match Score" label
  - Skill match list below gauge:
    - React — green checkmark — "You have this"
    - TypeScript — green checkmark — "You have this"
    - GraphQL — green checkmark — "You have this"
    - AWS — red X — "Missing"
  - Divider
  - Large full-width purple "Apply Now" button 50px height
  - Outlined "Save Job" button below
  - Divider
  - Company quick info: headcount, founded year, website

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 08 — Application Tracker Kanban
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode application tracker kanban board for TalentAI candidates. Desktop 1440px, inside app shell.

Page header:
- "My Applications" title Space Grotesk Bold 32px, count badge "5" purple pill right of title
- Subtitle: "Track your job applications in real-time"
- "Find More Jobs" purple button top right

Kanban board with 4 columns (equal width, 16px gap):

Column 1 — Applied (purple top bar):
- Column header: "Applied" bold, purple count badge "2"
- 2 cards

Column 2 — Under Review (amber top bar):
- "Under Review" bold, amber badge "1"
- 1 card

Column 3 — Shortlisted (green top bar):
- "Shortlisted" bold, green badge "1"
- 1 card with green left border glow

Column 4 — Rejected (red top bar):
- "Rejected" bold, red badge "1"
- 1 card at 60% opacity, desaturated

Each application card (#1C1C28 background, 12px radius, 14px padding):
- Company avatar circle (32px) + job title bold + company name muted
- Date applied in small mono text
- Status badge matching column color
- Bottom: circular match score ring small (36px) right-aligned
- Shortlisted card has subtle green glow border

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 09 — Messages Inbox
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode messages inbox page for TalentAI. Desktop 1440px, inside app shell. Email-client style two-panel layout.

Left panel (360px wide, #0C0C14 background, right border):
- Header: "Messages" Space Grotesk Bold 18px, "2 Unread" red badge right
- Message list items (3 items):
  - Company avatar 40px circle, job title bold 13px, company name purple 12px, message preview muted 12px truncated, time top-right muted
  - First item (active): slightly lighter background, purple left border 3px
  - Second item (unread): cyan left border 3px
  - Third item: normal

Right panel (remaining width, #05050A background):
- Top bar: company avatar 44px, company name bold, job title muted — background #0C0C14 border bottom
- Content area with padding:
  - Green tinted banner: green checkmark icon + "🎉 You received an interview proposal from Linear" in green text
  - Chat bubble: left-aligned, dark card background, recruiter message text about interview invitation with 92% match score highlighted in cyan
  - Interview details card: clock icon + date/time, dollar icon + salary offered
- Bottom action area (border top):
  - Large full-width green button "✓ Accept & Share My Contact Info" 52px height
  - Outlined danger "✗ Decline" button below
  - Small muted text: "Accepting will share your email address with the recruiter."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 10 — Notifications Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode notifications page for TalentAI. Desktop 1440px, inside app shell. Max content width 760px centered.

Page header:
- "Notifications" title Space Grotesk Bold 32px left
- "Mark all as read" ghost button right

Filter tabs below: All | Job Matches | Applications | Messages — pill style, active tab purple filled

Notification list card (#12121C background, no padding, border):

Date group header: "Today" — small uppercase muted label with padding

5 notification items (each with bottom border):
1. Unread — purple left border 3px, slightly purple-tinted background:
   - Cyan icon box (eye icon): "Stripe viewed your application for Senior Frontend Engineer" bold text, "2 hours ago" muted, "Applications" muted badge — purple unread dot right
2. Unread — purple left border:
   - Green icon box (award icon): "You received an interview proposal from Linear" bold, "5 hours ago", "Messages" badge — unread dot
3. Read — no left border, normal background:
   - Purple icon box (sparkle icon): "12 new jobs match your updated skill profile" normal weight, "1 day ago", "Job Matches" badge
4. Read:
   - Green icon box (check icon): "Your application to Vercel was received" text, "2 days ago"
5. Read:
   - Amber icon box (star icon): "Your match score improved to 94% for a new posting" text, "3 days ago"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 11 — Settings Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode settings page for TalentAI. Desktop 1440px, inside app shell.

Two column layout (220px left nav, remaining right content):

Left settings navigation:
- "Settings" heading Space Grotesk Bold 18px
- Nav items (each 40px, 12px padding, 8px radius):
  - Account (active — purple tinted background, purple text)
  - Password & Security
  - Notifications
  - Privacy
  - Danger Zone (red text color)

Right content — showing Account section:
- "Account Settings" heading Space Grotesk 22px Bold
- Card (#12121C, border, 16px radius, 28px padding):
  - Profile photo row: large avatar circle 64px purple gradient, "Profile Photo" label bold, "JPG PNG up to 2MB" muted, "Change Photo" outlined small button
  - 2x2 grid of form fields: Full Name, Email Address, Phone, Location — each with label above and dark input field
  - "Save Changes" purple button bottom left
- Second card below: Notification toggles
  - Each row: label bold + description muted left, toggle switch right
  - Toggle ON state: purple background sliding thumb
  - Toggle OFF state: dark gray background
  - 4 toggles: New Job Matches, Interview Proposals, Profile Views, Email Digest

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 12 — Candidate Profile Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode candidate profile page for TalentAI. Desktop 1440px, inside app shell.

Profile banner at top (full content width, 180px height):
- Gradient background: dark purple to dark teal mesh
- "Edit Profile" outlined button top-right corner

Profile header below banner:
- Large avatar circle 80px (purple-cyan gradient) overlapping bottom edge of banner
- Name "Ali Hassan" Space Grotesk Bold 24px
- "Full Stack Developer · Lahore, Pakistan" muted below name
- Profile completeness row: "Profile 75% Complete" label, purple-to-cyan progress bar 120px wide, "75%" mono text
- LinkedIn icon button + GitHub icon button outlined small

Two column layout below header (260px left, remaining right):

Left sidebar:
- Skills card: "Skills" heading, grid of purple pill tags: React, TypeScript, Node.js, MongoDB, Express.js, REST APIs, Git, JavaScript, CSS3, HTML5, Redux, GraphQL
- Quick Stats card: 3 rows — Applications: 5, Match Avg: 88%, Profile Views: 24 — each row with label muted left, purple mono value right

Right main content:
- About card: heading + pencil edit icon, paragraph text
- Experience card: heading + plus icon button, two timeline items each with: colored dot left, vertical connecting line, role bold, company purple + date range muted, description text
- Education card: same timeline style, one university entry

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 13 — Recruiter Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode recruiter dashboard for TalentAI. Desktop 1440px. Same app shell but sidebar shows recruiter navigation: Dashboard, Post a Job, Manage Jobs, Pipeline, Settings.

Page header:
- "Recruiter Command Center" Space Grotesk Bold 28px
- "Monday, March 7 · 3 active job postings" muted subtitle
- "Post a Job" purple button top right with plus icon

4 stat cards in a row:
- "3" purple — Active Jobs — briefcase icon
- "47" cyan — Total Applicants — person icon
- "8" green — Shortlisted — award icon
- "86%" amber — Avg Match Score — target icon

Two column layout below stats:

Left column (60%) — Active Postings:
- Section heading "Active Postings" with briefcase icon, "Manage all →" link right
- 3 job listing rows each as a card:
  - Company avatar, job title bold, applicant count muted, circular match ring right, "View" outlined button
  - Jobs: Senior Frontend Engineer (14 applicants, 91%), Full Stack Developer (22 applicants, 87%), React Native Dev (11 applicants, 83%)

Right column (40%) — Recent Applicants:
- Section heading "Recent Applicants" with person icon
- Card with 4 rows each showing:
  - Blurred/masked avatar (blind hiring), candidate ID "C-047" bold, experience muted, circular match ring right
  - All candidates shown anonymously (blurred avatar, ID only)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 14 — Post a Job Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode job posting page for TalentAI recruiter. Desktop 1440px, inside app shell.

Two column layout (60% form left, 40% preview right):

Left — form card (#12121C, border, 16px radius, 28px padding):
- "Post a New Job" heading Space Grotesk Bold 32px
- "Fill in the details or paste a job description for AI extraction." muted subtitle
- Form fields stacked:
  - Job Title — full width text input
  - Location + Salary Range — side by side inputs
  - Job Type — segmented button group: Full-Time (active/purple), Part-Time, Contract, Internship
  - Experience Level — segmented buttons: Junior, Mid (active), Senior, Lead
  - Job Description — large textarea 6 rows, monospace-style font, dark background
- Large prominent button full width: purple gradient background, sparkle icon left, "✦ Extract Requirements with AI" — 52px height
- AI results box below (shown after extraction): purple tinted background, border, "AI Extracted Requirements ✦" heading in purple, skill pill tags row (editable), experience field, "Confirm & Post Job" green button

Right — Live Preview (sticky):
- "Live Preview" small uppercase label
- Job card preview matching the discovery board card style:
  - Company avatar, job title, company name, skill tags, job type badge, experience badge, salary in mono, match score ring showing "New"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 15 — Manage Jobs Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode manage jobs page for TalentAI recruiter. Desktop 1440px, inside app shell.

Page header:
- "Your Job Postings" Space Grotesk Bold 32px, "4 total · 3 active" muted subtitle
- "+ Post New Job" purple button top right

Filter buttons: All (active/purple), Active, Closed

Table card (#12121C background, border, 16px radius, no padding on sides):

Table header row (#1C1C28 background, 14px padding):
- Columns: Job Title | Posted | Applicants | Status | Actions
- All uppercase muted small text

4 data rows (each 18px padding, bottom border, hover darkens):
Row 1: Senior Frontend Engineer | Mar 1 | "14 applicants →" cyan clickable | Active (green pill badge) | Edit pencil icon + Eye icon + Trash red icon
Row 2: Full Stack Developer | Feb 25 | "22 applicants →" | Active green | same action icons
Row 3: React Native Developer | Feb 20 | "11 applicants →" | Active green | same actions
Row 4: DevOps Engineer | Feb 10 | "8 applicants →" | Closed (muted gray pill) | same actions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 16 — Candidate Pipeline Kanban (Recruiter)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode recruiter candidate pipeline page for TalentAI. Desktop 1440px, inside app shell.

Breadcrumb navigation: "Manage Jobs → Senior Frontend Engineer → Pipeline" muted small text

Page header row:
- "Candidate Pipeline" Space Grotesk Bold 32px
- "Senior Frontend Engineer · 4 applicants" muted subtitle
- Right side: toggle switch with label "Blind Hiring ON" — toggle is purple/active

Kanban board 4 columns:

Column: New (purple top bar, count "2")
Column: Under Review (amber top bar, count "1")
Column: Shortlisted (green top bar, count "1")
Column: Rejected (red top bar, count "0") — empty with "Drop here" placeholder

Candidate cards (draggable style — drag handle icon on left):
- Blurred/obscured avatar circle (blind hiring is ON) + candidate ID "C-047" bold + experience muted
- 2 purple skill pill tags
- Bottom row: "View Profile →" muted link left, circular match score ring right in cyan
- One card in "dragging" state: slightly scaled up, purple border glow, slight rotation, elevated shadow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 17 — Candidate Detail Page (Recruiter View)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode candidate evaluation page for TalentAI recruiter. Desktop 1440px, inside app shell.

Top action bar:
- "← Pipeline" ghost back button left
- Breadcrumb "Senior Frontend Engineer Pipeline" muted center
- Right side: "Blind Mode ON" toggle switch (purple active), "Send Proposal" purple button

Three panel layout (220px left | flex center | 280px right):

Left panel card:
- Blurred avatar circle 64px (blind mode on)
- "C-047" bold, blurred/hidden email
- Large match score ring 80px, "94%" cyan center, "Match Score" label
- Purple skill tags: React, TypeScript, GraphQL
- Stats rows: Exp: 4 years, Edu: BS CS, Loc: Remote
- "Shortlist" green button + "Reject" red button side by side

Center panel:
- AI Summary card (cyan border, subtle cyan tint):
  - "AI Candidate Summary" heading with sparkle icon in cyan
  - 4-5 lines of paragraph text summary
- Skills Match card:
  - "Skills vs Job Requirements" heading
  - List of skills with green checkmark or red X, skill name, progress bar and % for matched skills, "Missing" red label for unmatched

Right panel:
- "Original CV" heading
- Large dark rectangle placeholder showing PDF viewer: file icon centered, "Ali_Hassan_CV.pdf" label, "2 pages" muted
- "Download CV" outlined button below with download icon

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 18 — Send Proposal Modal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode modal overlay for sending an interview proposal in TalentAI. Desktop 1440px.

Background: blurred dark overlay behind modal (backdrop blur effect visible)

Modal card (560px wide, centered):
- Background #1C1C28, border rgba(255,255,255,0.1), border-radius 24px, padding 40px
- Soft purple glow shadow behind modal

Modal content:
- Header row: "Send Interview Proposal" Space Grotesk Bold 22px left, X close button right (circle ghost button)
- Candidate mini card below header: blurred avatar, "C-047" label, "94% Match" cyan badge — dark tinted background, rounded
- Form fields:
  - "Your Message" label — large textarea 4 rows with placeholder text
  - Two date-time pickers side by side: "Interview Slot 1" and "Interview Slot 2"
  - "Salary Offer (Optional)" text input
- Footer button row:
  - "Cancel" outlined button (flex 1)
  - "Send Proposal" purple button with send icon (flex 2, 48px height)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 19 — 404 Error Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode 404 error page for TalentAI. Desktop 1440px, full page (no app shell).

Background: #05050A with large blurred purple blob top-left

Center content (vertically and horizontally centered):
- Giant "404" text in Space Grotesk Bold 180px — gradient fill purple to cyan — very low opacity (decorative, behind content)
- Above the 404: large "lost signal" or broken compass illustration in muted purple lines
- "You've wandered off the map" heading Space Grotesk Bold 32px
- "The page you're looking for doesn't exist — or was moved." muted subtitle
- "← Take Me Home" purple button large below

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 20 — 403 Unauthorized Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a dark-mode 403 unauthorized page for TalentAI. Desktop 1440px, full page.

Background: #05050A with blurred red/purple blob

Center content:
- Large lock icon (Lucide lock) in a circle with red glow, 80px
- Giant "403" Space Grotesk Bold 180px gradient purple to red, low opacity decorative behind content
- "Access Denied" heading Space Grotesk Bold 32px
- "You don't have permission to view this page." muted subtitle
- "Go Back to Safety" purple button large

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO USE THESE PROMPTS IN GALILEO AI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Go to galileo.ai and create a free account

Step 2: Click "New Design"

Step 3: FIRST paste the GLOBAL DESIGN SYSTEM section and click generate
        This sets the visual language for all screens

Step 4: For each screen, paste ONE prompt at a time
        Do not paste multiple screens together

Step 5: After generating, click "Edit in Figma" to export directly

Step 6: In Figma, arrange all screens in order on one page

Step 7: Apply the correct fonts:
        - Install "Space Grotesk" from Google Fonts plugin in Figma
        - Install "DM Sans" from Google Fonts plugin
        - Install "JetBrains Mono" from Google Fonts plugin

Step 8: Fix any colors that don't match using the color codes above

Tips for best results:
- If a screen looks wrong, regenerate it 2-3 times and pick the best
- Keep the same style settings across all generations
- The more detail in the prompt, the better the output
- After importing to Figma, you can manually refine each screen

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━