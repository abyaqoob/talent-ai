Continue building on the existing TalentAI design. Do NOT recreate or change any existing screens. Keep all current colors, typography, components, and styling exactly as they are. Only ADD the missing screens listed below, and fix the specific issues listed. Everything must feel like one cohesive product.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIXES TO EXISTING SCREENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Add a persistent back arrow (←) button to every screen except the Landing page and Dashboard. Style it as a ghost button top-left, before the page title.

2. The Recruiter Dashboard must be a completely separate screen from the Candidate Dashboard. Recruiter sidebar shows: Dashboard, Post a Job, Manage Jobs, Candidates, Analytics, Settings. Recruiter stats show: Active Jobs, Total Applicants, Shortlisted, Avg Match Score. Do NOT reuse the candidate layout for recruiters.

3. The Applications page (Kanban + List) must be ONE screen with a toggle switch at the top right to switch between Kanban view and List view — not two separate pages.

4. Fix the match score rings on Job Discovery cards — they must sit cleanly inside the card at bottom-left, not overflow or overlap text.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEW SCREENS TO ADD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

─── SCREEN: CV Upload & AI Analysis ───
Route: /cv-upload
Two-column layout. Back arrow top-left.
LEFT (50%): Upload drop zone — large dashed border rectangle (border-radius 20px, 300px height), cloud upload icon centered, "Drag & drop your CV here" text, "or" divider, "Browse Files" accent link. Below: "PDF, DOC, DOCX — Max 5MB" muted. Show FILLED STATE below the dropzone: a file row "Resume_AliJohnson.pdf" with green checkmark, file size "245 KB", red trash icon. Below the file row: extracted skill pills grid — "React" "TypeScript" "Node.js" "Figma" "MongoDB" "Problem Solving" — indigo pills for technical, cyan for tools, green for soft skills. Section label "Extracted Skills" above pills.
RIGHT (50%, bg card, cyan left-border 3px): Header "AI Resume Feedback" + sparkle icon in cyan. Three sections: "Strengths" (green check icon + 2 bullet lines), "Areas to Improve" (yellow warning icon + 2 bullet lines), "Recommended Actions" (indigo star icon + 2 bullet lines). Bottom: large circular progress ring, "78/100" in large mono font, cyan, label "Overall CV Score". Two buttons at page bottom: "Analyze Another CV" secondary + "View Matched Jobs" primary.

─── SCREEN: Job Detail Page ───
Route: /jobs/:id
Back arrow + breadcrumb "Find Jobs › Senior Frontend Developer". Two-column layout.
LEFT (65%): Company logo circle (64px) + "TechCorp" bold + "Technology · San Francisco, CA" muted. Job title "Senior Frontend Developer" in large display font. Meta badge row: "Full-Time" "Remote" "$120k–$180k" "3–5 Years" "Posted 2 days ago". Tab bar: Description (active) | Requirements | Company. Tab content: job description paragraphs + bulleted responsibilities list.
RIGHT (35%, sticky card): Large circular match gauge (140px diameter), "92%" in center cyan mono, "Match Score" label. Skill match list below: "React ✓ You have this" green, "TypeScript ✓ You have this" green, "AWS ✗ Missing" red. Divider. "Apply Now" full-width primary button (52px). "Save Job" secondary button. Share icon button. Divider. Mini company info: headcount, founded year, website link.

─── SCREEN: Messages / Proposals Inbox ───
Route: /messages
Email-client two-panel layout. Back arrow.
LEFT PANEL (320px, subtle right border): "Messages" title + "Unread (2)" green badge. Four message rows — company avatar (40px circle), job title bold, company name muted, message preview snippet, timestamp. Unread rows: 3px left accent border, slightly brighter bg. One row shown as selected/active.
RIGHT PANEL: Company header — logo + name + "Re: Senior Frontend Developer" + "Applied Mar 5" tag. Green proposal banner (green left border, green tint bg): "You've received an interview proposal!" bold + subtitle. Recruiter message bubble (left-aligned, card bg). Proposal details card (accent border): "Slot 1: Mon Mar 18 — 10:00 AM", "Slot 2: Wed Mar 20 — 2:00 PM", notes from recruiter. Two full-width buttons (52px): "✓ Accept & Share Contact Info" in success green + "✗ Decline" ghost danger. Small disclaimer text below accept button.

─── SCREEN: Notifications ───
Route: /notifications
Sidebar active on Notifications item. Back arrow.
"Notifications" display title. "Mark all as read" ghost button top-right. Filter tabs: All (active) | Job Matches | Applications | Messages.
Groups: TODAY — 2 unread items (left accent bar, tinted bg): one job shortlist notification, one profile view. YESTERDAY — 2 read items (no bar, transparent bg): job match, new message. THIS WEEK — 3 read items: application confirm, match update, CV analyzed. Each row: colored icon left (20px), message text, timestamp right. Unread items have a small dot indicator.

─── SCREEN: Settings ───
Route: /settings
Two-column layout. Left nav + right content.
LEFT NAV (220px, card bg, subtle border): "Settings" title. Nav items: Account (active), Password & Security, Notifications, Privacy, Danger Zone (red text).
RIGHT CONTENT (max-width 680px):
Card 1 — Account: Profile photo row (72px avatar + "Upload Photo" button + "Remove" link). 2-column form grid: Full Name, Email, Phone, Location inputs. "Save Changes" primary button.
Card 2 — Password: Current Password, New Password, Confirm Password fields (each with eye toggle). "Update Password" button.
Card 3 — Notifications: Toggle switch rows — New job matches (ON), Application updates (ON), Messages (ON), Profile views (OFF), Weekly digest (OFF). Accent color when ON, muted when OFF.
Card 4 — Danger Zone: Red-tinted border card. "Delete Account" description + red danger button.

─── SCREEN: Candidate Profile Page ───
Route: /profile
Full-width gradient banner (200px height). Avatar (96px) overlapping banner bottom. Name "Ali Johnson" display font + "Frontend Developer" + "San Francisco, CA". "Edit Profile" button top-right. Profile completion bar: "Profile 75% Complete" with accent fill.
Two columns below: LEFT (35%) sidebar — skills section (pill tags), links (GitHub, LinkedIn, Portfolio icons), quick stats (years experience, applications sent). RIGHT (65%) — About section, Experience timeline (dot + company + role + dates + description, 2 entries), Education timeline (same style, 1 entry), Certifications (1–2 entries). Each section has a pencil edit icon on hover.

─── SCREEN: Recruiter — Post a Job ───
Route: /recruiter/post-job
Back arrow + "Post a New Job" display title. Two-column layout.
LEFT FORM (65%, card bg, padding 32px): Job Title input. Location input + "Remote" checkbox. Segmented control — Job Type: Full-Time (selected) | Part-Time | Contract. Segmented control — Experience: Junior | Mid (selected) | Senior. Salary Range: dual-handle slider + two number inputs "$120,000" and "$180,000". Job Description: large textarea (min 280px). Large full-width button "✦ Extract Requirements with AI" — accent color, sparkle icon, 52px height. Below textarea: AI results box (cyan left border, card bg, animated): "AI Extracted Requirements ✦" header in cyan. Required Skills pills: "React" "TypeScript" "Node.js" "REST APIs" "Git" — each with × remove + "+ Add Skill" ghost pill. Extracted experience line. "Confirm & Post Job" primary button.
RIGHT PREVIEW (35%, sticky card): "Live Preview" muted label. Mirror of job card updating live — same style as Job Discovery cards. Shows parsed skills as they're extracted.

─── SCREEN: Recruiter — Manage Jobs ───
Route: /recruiter/jobs
Back arrow + "Your Job Postings" title. Filter tabs: All | Active | Closed. "+ Post New Job" primary button top-right.
Table with columns: Job Title | Posted Date | Applicants | Status | Actions. Show 4–5 rows. Row data example: "Senior Frontend Developer" | "Mar 1, 2026" | "14 Applicants" (accent colored, clickable) | "Active" green pill | Edit · View Pipeline · Close buttons. "Closed" rows: gray pill, muted text. Row hover: tinted bg.

─── SCREEN: Recruiter — Candidate Pipeline (Kanban) ───
Route: /recruiter/jobs/:id/pipeline
Breadcrumb: "Manage Jobs › Senior Frontend Developer › Pipeline". Job summary row: title + type badge + date + "14 Applicants" badge. Right: "Blind Hiring" toggle (labeled) + "Export" secondary button.
Kanban — 4 equal columns side by side (do NOT stack):
"New" (accent top bar, 5 cards) | "Under Review" (yellow top bar, 4 cards) | "Shortlisted" (green top bar, 3 cards) | "Rejected" (red top bar, 2 cards, 60% opacity)
Candidate card per column: masked avatar (blurred circle) + "Candidate #041" bold + "92% Match" large cyan badge + skill tags "React" "TypeScript" + "View Full Profile" link + drag handle (6 dots, left edge). One card shown in dragging state: slightly rotated, elevated shadow, scaled up.

─── SCREEN: Recruiter — Candidate Detail ───
Route: /recruiter/candidates/:id
Back arrow + "Senior Frontend Developer Pipeline" breadcrumb. "Blind Hiring" toggle top-right (prominent). "Send Proposal" primary button top-right.
Three-panel layout:
LEFT (25%): Blurred/masked avatar (96px) + "Candidate #041" + "92% Match" large cyan display. Skill tags. Quick stats: "4 years experience" "Bachelor's Degree" "San Francisco, CA". "Shortlist" success button + "Reject" danger ghost button.
CENTER (45%): "AI Candidate Summary" card (cyan left border, sparkle icon): 4-line plain-English summary. Skill match breakdown — each skill with match bar: "React ✓" green bar full, "TypeScript ✓" green bar full, "AWS ✗" red bar partial. Extracted experience + education list below.
RIGHT (30%): "Original CV" label. PDF viewer panel (card bg, border, radius 12px) — shows PDF preview scaled to fit. "Download CV" button below.

─── SCREEN: Send Proposal Modal ───
Shown as overlay on Candidate Pipeline or Detail page.
Modal centered (width 540px): "Send Interview Proposal" display title 24px + close X.
Candidate mini-card at top (masked avatar + name + job title applied for).
"Your message" textarea (large, 120px min height).
Two date/time pickers: "Proposed Slot 1" and "Proposed Slot 2".
Salary offer range inputs (optional, labeled).
Footer: "Cancel" ghost button + "Send Proposal" primary button.
Backdrop: dark overlay behind modal. Modal entrance: scale from 0.95 with fade-in.

─── SCREEN: 404 Error Page ───
Route: /404
Centered full-height layout. "404" in display font, 160px, gradient text accent-to-cyan. Compass icon (32px, muted) above tagline. "You've wandered somewhere we haven't mapped yet." — 22px. Subtext muted 16px. Two buttons: "Take me home" primary + "Go back" secondary ghost. Subtle floating geometric shapes in background.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NAVIGATION CONTINUITY RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- All candidate screens must use the same sidebar (Dashboard, My Profile, My CV, Find Jobs, Applications, Messages, Notifications, Settings) with the correct item highlighted as active per screen.
- All recruiter screens must use the recruiter sidebar (Dashboard, Post a Job, Manage Jobs, Candidates, Analytics, Settings).
- Every screen except Landing and the two Dashboards must have a back arrow (←) in the top-left.
- The dark/light mode toggle must appear consistently on every screen in the same position.
- Topbar (search + bell + avatar) must appear on all authenticated screens.
- Page transitions, hover states, and component styles must match what already exists in the design.