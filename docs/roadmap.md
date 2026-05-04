# Hello Lang Product Roadmap

Last updated: 2026-04-24

## Product goal

Build Hello Lang into the fastest mobile habit for turning real-life Japanese thoughts into natural English and retaining them through repeated review.

## Roadmap principles

- keep the capture flow faster than chat-style AI tools
- optimize for repeat usage, not just first-session delight
- instrument behavior before scaling acquisition
- monetize only after the habit loop is clear

## Now: current baseline

Current shipped capabilities:

- Japanese text input
- Japanese voice input
- AI translation to natural English
- automatic category generation
- immediate audio playback
- local phrase saving
- Supabase-backed cloud sync after login
- phrase list search
- flashcard review with mastered state
- autoplay and loop playback modes

Current missing pillars:

- analytics
- push or email reminders
- spaced repetition
- edit and organize features
- monetization
- robust onboarding
- production observability

## Phase 1: validation foundation

Target window: next 4 to 6 weeks

### Objectives

- prove that users return after first translation
- make behavior measurable
- reduce obvious UX friction

### Deliverables

- event analytics for:
  - translation submitted
  - translation completed
  - phrase saved
  - card reviewed
  - phrase deleted
  - signup started
  - signup completed
- first-session onboarding copy
- phrase editing support
- favorites or quick-save collections
- translation loading and error states improved beyond browser alerts
- browser compatibility guidance for speech input
- bug fixes in translation error handling and auth edge cases

### Success criteria

- 60%+ of first-time translators save at least one phrase
- 25%+ of activated users revisit within 7 days
- clear funnel visibility from visit to first saved phrase

## Phase 2: habit and retention

Target window: following 6 to 8 weeks

### Objectives

- turn saved phrases into recurring study behavior
- increase weekly active use

### Deliverables

- spaced repetition logic beyond `learning` and `mastered`
- review queue based on due dates and difficulty
- daily reminder system by email or push
- streaks and weekly review summaries
- phrase folders such as travel, work, dating, emergencies
- richer audio controls and slower playback mode
- example usage sentences and alternate phrasings

### Success criteria

- 35%+ of users with 5 saved phrases return for review within 7 days
- weekly reviews per active user increase steadily
- average saved phrase count per active user grows month over month

## Phase 3: monetization and positioning

Target window: months 3 to 4

### Objectives

- validate willingness to pay
- sharpen category positioning

### Deliverables

- free tier limits for translations or cloud history
- premium subscription plan
- premium features:
  - unlimited history
  - advanced review scheduling
  - phrase collections
  - pronunciation feedback
  - export and backup
- landing page messaging by use case:
  - travel English
  - work English
  - social and dating English
- in-app paywall experiments

### Success criteria

- first paid conversions from active repeat users
- premium trial to paid conversion benchmark established
- clear best-performing use case messaging from acquisition tests

## Phase 4: defensibility and scale

Target window: months 4 to 6

### Objectives

- build assets generic AI tools do not provide
- prepare the product for wider acquisition

### Deliverables

- personalized phrase memory insights
- pronunciation or speaking feedback loop
- phrase recommendations based on user history
- import/export and device sync polish
- social sharing of phrase cards
- creator or teacher-curated packs
- operational dashboards for growth, retention, and unit economics

### Success criteria

- 30-day retention becomes predictable by cohort
- user phrase libraries become large enough to create switching costs
- monetized users show materially higher retention than free users

## Execution order

1. Fix friction in the existing capture and review loop.
2. Instrument the funnel and retention events.
3. Add habit systems that bring users back.
4. Launch paid reasons to stay.
5. Deepen personalization and defensibility.

## Suggested KPI targets

- first translation completion rate: above 80%
- phrase save rate after successful translation: above 70%
- first review session within 3 days: above 30%
- 7-day retention: above 25% in early cohorts
- average saved phrases per weekly active user: above 5
- paid conversion from retained users: 3% to 8% early target range

## Dependencies and enablers

- analytics stack
- reliable env management
- production monitoring
- better content quality controls for AI output
- CRM or notification channel for reminders
- pricing and billing infrastructure

## What not to do yet

- full multi-language expansion before PMF
- enterprise features before consumer retention is proven
- heavy social network mechanics before core study habit works
- expensive brand campaigns before instrumentation is in place
