
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      <div className="bg-[#181f3a] rounded-2xl shadow-2xl w-full max-w-xl p-10 sm:p-12 text-center border border-blue-900/40">
        <h1 className="text-4xl font-extrabold mb-6 text-white drop-shadow-lg">Agile Poker Card Estimation</h1>
        <p className="mb-8 text-blue-200 text-lg">Collaborative story point estimation for agile teams.</p>
        <div className="flex flex-col gap-4 mb-8">
          <Link href="/auth/login" className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow hover:from-blue-600 hover:to-indigo-600 transition">
            🔐 Login
          </Link>
          <Link href="/auth/register" className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-white font-semibold shadow hover:from-green-500 hover:to-blue-500 transition">
            📝 Register
          </Link>
          <Link href="/auth/guest" className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:from-purple-600 hover:to-pink-600 transition">
            👤 Join as Guest
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/session/create" className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-semibold shadow hover:from-yellow-500 hover:to-orange-500 transition">
            🚀 Create Session
          </Link>
          <Link href="/session/join" className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-400 text-white font-semibold shadow hover:from-cyan-500 hover:to-blue-500 transition">
            🔗 Join Session
          </Link>
        </div>
        {/* View History button removed as requested */}
      </div>
    </div>
  );
}
