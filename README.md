## Agile Poker Card Estimation MVP

This is an Agile Poker Card Estimation web app built with Next.js, Tailwind CSS, and Supabase. It enables collaborative story point estimation for agile teams, supporting remote and in-person sessions with real-time updates.

### Tech Stack
- **Frontend:** Next.js (React)
- **Styling:** Tailwind CSS
- **Backend & Database:** Supabase (PostgreSQL, Authentication, Realtime)

### Features
- User authentication (register, login, guest access)
- Session creation and joining via invite code
- Real-time participant display
- Moderator controls (start round, reveal votes, reset round)
- Participant voting (poker cards)
- Vote revelation with average/median statistics
- Responsive UI with Tailwind CSS

### Setup
1. Clone the repo and install dependencies:
	```bash
	npm install
	# or
	yarn install
	```
2. Add your Supabase credentials to `.env.local`:
	```bash
	NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
	NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
	```
3. Run the development server:
	```bash
	npm run dev
	# or
	yarn dev
	```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Usage
- Register, log in, or join as guest
- Create or join a session with an invite code
- Moderator starts round, participants vote
- Moderator reveals votes and stats
- Reset round to estimate next story

### Database Schema
See `.github/prompts/mvp.prompt.md` for full schema and policies.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


---


## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deploy
Deploy easily on [Vercel](https://vercel.com/) or your preferred platform.
