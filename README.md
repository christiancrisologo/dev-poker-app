# Agile Poker Card Estimation

A collaborative story point estimation app for agile teams, built with Next.js, Tailwind CSS, and Supabase.

## ✨ Features
- Modern gradient/card UI theme across all pages
- User authentication: Register, Login, or Join as Guest
- Create and join sessions via invite code
- Real-time participant updates
- Moderator controls: start round, reveal votes, reset round
- Poker card voting and vote reveal (average/median)
- Custom 404 page
- Mobile responsive and accessible

## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router, React)
- **Styling:** Tailwind CSS
- **Backend/DB:** Supabase (PostgreSQL, Auth, Realtime)

## 🚀 Getting Started
1. **Clone the repo and install dependencies:**
   ```bash
   git clone https://github.com/christiancrisologo/dev-poker-app.git
   cd agile-poker-app
   npm install # or yarn install
   ```
2. **Configure Supabase:**
   Add your Supabase credentials to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. **Run the development server:**
   ```bash
   npm run dev # or yarn dev
   ```
4. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## 🧑‍💻 Usage
- Register, log in, or join as guest
- Create or join a session with an invite code
- Moderator starts round, participants vote
- Moderator reveals votes and stats
- Reset round to estimate next story

## 🗂️ File Structure
- All main pages and components are now under `src/app/`
- Legacy files from the old `app/` directory have been removed
- UI theme and layout are consistent across landing, auth, and session pages

## 📝 Database Schema
See `.github/prompts/mvp.prompt.md` for schema and policies.

## 🖼️ Screenshots
<!-- Add screenshots of the new UI here -->

## 🧪 Testing & Quality
- All main pages lint and compile without errors
- Mobile responsiveness and accessibility verified

## 📄 Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🚢 Deploy
Deploy easily on [Vercel](https://vercel.com/) or your preferred platform.

---

For questions or feedback, tag @christiancrisologo in your pull request.
