---
mode: agent


description: Instructions for building an Agile Poker Card Estimation web app MVP using Next.js, Tailwind CSS, and Supabase.

---

# Agile Poker Card Estimation MVP - Copilot Instructions

## Project Goal

Develop a Minimum Viable Product (MVP) for an Agile Poker Card Estimation web application. The app enables collaborative story point estimation for agile teams, supporting remote and in-person sessions with real-time updates.

## Technology Stack

- **Frontend:** Next.js (React.js)
- **Styling:** Tailwind CSS
- **Backend & Database:** Supabase (PostgreSQL, Authentication, Realtime)

---

## MVP Features & Implementation Tasks

### 1. Project Setup & Initial Configuration

- **Initialize Next.js project:**
    ```bash
    npx create-next-app@latest agile-poker-app --typescript --tailwind --eslint
    ```
- **Configure Tailwind CSS** (handled by create-next-app).
- **Initialize Supabase:**
    - Create a Supabase project.
    - Install client: `npm install @supabase/supabase-js`
    - Configure client in `lib/supabaseClient.ts` using env vars.

---

### 2. User Authentication

- **Registration (email/password):**
    - Use Supabase `signUp`.
    - Create registration UI.
- **Login (email/password):**
    - Use Supabase `signInWithPassword`.
    - Create login UI.
- **Guest Access:**
    - Allow joining with just a name.
    - Generate temporary userId (local/session).
    - Optionally use Supabase anonymous auth.

---

### 3. Database Schema (Supabase)

Create these tables:

#### profiles

| Column      | Type      | Details                                  |
|-------------|-----------|------------------------------------------|
| id          | UUID      | PK, references auth.users.id             |
| username    | TEXT      | unique                                   |
| created_at  | TIMESTAMP | default now()                            |

#### sessions

| Column             | Type      | Details                                  |
|--------------------|-----------|------------------------------------------|
| id                 | UUID      | PK, default gen_random_uuid()            |
| name               | TEXT      | NOT NULL                                 |
| invite_code        | TEXT      | UNIQUE, NOT NULL                         |
| moderator_id       | UUID      | references auth.users.id                 |
| status             | TEXT      | default 'lobby'                          |
| current_story_name | TEXT      | nullable                                 |
| created_at         | TIMESTAMP | default now()                            |

#### participants

| Column      | Type      | Details                                  |
|-------------|-----------|------------------------------------------|
| id          | UUID      | PK, default gen_random_uuid()            |
| session_id  | UUID      | FK, references sessions.id               |
| user_id     | UUID      | FK, references auth.users.id/profiles.id |
| guest_name  | TEXT      | nullable                                 |
| status      | TEXT      | default 'joined'                         |
| joined_at   | TIMESTAMP | default now()                            |

#### votes

| Column         | Type      | Details                                  |
|----------------|-----------|------------------------------------------|
| id             | UUID      | PK, default gen_random_uuid()            |
| session_id     | UUID      | FK, references sessions.id               |
| participant_id | UUID      | FK, references participants.id           |
| round_number   | INT       | NOT NULL                                 |
| value          | TEXT      | NOT NULL                                 |
| created_at     | TIMESTAMP | default now()                            |

---

### 4. Session Management

- **Create Session:** Form for moderator, generate invite code, store in `sessions`.
- **Join Session:** Input invite code, validate, add to `participants`, redirect.

---

### 5. Participant Management

- **Display participants:** Use Supabase Realtime to subscribe to `participants` for current `session_id`. Show name/status.

---

### 6. Estimation Flow

- **Moderator Controls:**
    - Start round (update `session.status`/`current_story_name`)
    - Reveal votes (update `session.status`)
    - Reset round (clear votes, reset participant status)
- **Participant Voting:**
    - Show poker cards (0, 1, 2, 3, 5, 8, 13, 21, 40, 100, ?)
    - Click to vote, store in `votes`, update status, hide card until revealed.
- **Vote Revelation:**
    - Moderator reveals, fetch votes, display all.
    - (Optional) Show average/median.

---

### 7. Real-time Updates

- Use Supabase Realtime subscriptions for:
    - `sessions` (status, story name)
    - `participants` (presence/status)
    - `votes` (collect votes, reveal on command)

---

### 8. Basic UI/UX & Responsiveness

- Use Tailwind CSS for styling.
- Ensure responsive design (mobile/tablet/desktop).
- Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`).
- Implement intuitive navigation and feedback.

---

## Development Steps (Iterative)

1. Initialize Git, Next.js app, commit.
2. Supabase integration.
3. Authentication (registration/login pages).
4. Database schema in Supabase.
5. Session creation/joining forms and logic.
6. Real-time presence in session lobby.
7. Card selection & voting (hidden).
8. Moderator controls (start/reveal/reset).
9. Real-time vote revelation.
10. Guest access.
11. Error handling & UI feedback.
12. Styling & responsiveness.
13. Manual testing.

---

## Key Considerations

- **Security:** Set Row Level Security (RLS) in Supabase. Users only access their own data.
- **Error Handling:** Use try-catch for Supabase calls, show user-friendly messages.
- **Loading States:** Show indicators during async operations.
- **User Experience:** Smooth flow for moderators/participants.
- **Code Quality:** Clean, modular, commented React/Next.js code.

---

## Success Criteria for MVP

- Users can register, log in, or join as guest.
- Moderator can create session and get invite code.
- Participants can join session via invite code.
- All participants shown in real-time.
- Moderator can start estimation round.
- Participants can select/submit poker card.
- Moderator can reveal votes.
- App is responsive across device sizes.
