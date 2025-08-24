"use client";

import Link from "next/link";
import { useState } from "react";
import { userStore } from "../store";
import { useRouter } from "next/navigation";
import { getUser, createUser } from "../lib/supabaseApi";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!username.trim()) {
      setError("Username is required");
      setLoading(false);
      return;
    }
    // Check if user exists
    const { data: extistingUserData, error: userError } = await getUser(username);
    if (userError) {
      setError(userError.message);
      setLoading(false);
      return;
    }
    if (extistingUserData?.length > 0) {
      // User exists, store in localStorage
      userStore.getState().setUser(extistingUserData[0]);
      router.push("/auth/register");
      setLoading(false);
      return;
    }
    // Create new user
    const { data: createUserData, error: createError } = await createUser({ username });
    if (createError) {
      setError(createError.message);
      setLoading(false);
      return;
    }
    userStore.getState().setUser(createUserData);
    router.push("/auth/register");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      <div className="bg-[#181f3a] rounded-2xl shadow-2xl w-full max-w-xl p-10 sm:p-12 text-center border border-blue-900/40">
        <h1 className="text-4xl font-extrabold mb-6 text-white drop-shadow-lg">Agile Poker Card Estimation</h1>
        <p className="mb-8 text-blue-200 text-lg">Collaborative story point estimation for agile teams.</p>
        <form onSubmit={handleRegister} className="mb-8">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-[#232a4d] text-white border border-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-white font-semibold shadow hover:from-green-500 hover:to-blue-500 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Registering...
              </>
            ) : 'Register'}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
        <div className="align-center mt-2 mb-6 text-amber-100">
          ----- or -----
        </div>
        <div className="flex flex-col gap-4 mb-8">
          <Link href="/auth/guest" className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:from-purple-600 hover:to-pink-600 transition">
            👤 Join as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}
