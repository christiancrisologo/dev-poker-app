"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { createSession, getSessionByInviteCode } from '../../../lib/supabaseApi';
import localStorageUtil from '../../../lib/localStorageUtil';

export default function GuestPage() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [joined, setJoined] = useState(false);
    const [sessionName, setSessionName] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [joinError, setJoinError] = useState<string | null>(null);
    const router = useRouter();

    const handleGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (!name.trim()) {
            setError("Name is required");
            setLoading(false);
            return;
        }
        // Generate a temporary userId and store in sessionStorage
        const guestId = uuidv4();
        localStorageUtil.set("guestId", guestId);
        localStorageUtil.set("guestName", name);
        setJoined(true);
        setLoading(false);
    };

    const handleCreateSession = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (!sessionName.trim()) {
            setError("Session name is required");
            setLoading(false);
            return;
        }
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        // For guests, use guestId as moderator_id
        const guestId = localStorageUtil.get<string>("guestId");
        const { data, error: dbError } = await createSession({ name: sessionName, invite_code: code, moderator_id: guestId || '' });
        if (dbError) {
            setError(dbError.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        router.push(`/session/${data?.[0]?.invite_code || code}`);
    };

    const handleJoinSession = async (e: React.FormEvent) => {
        e.preventDefault();
        setJoinError(null);
        setLoading(true);
        if (!inviteCode.trim()) {
            setJoinError("Invite code is required");
            setLoading(false);
            return;
        }
        const { data, error: sessionError } = await getSessionByInviteCode(inviteCode);
        if (sessionError || !data) {
            setJoinError("Session not found.");
            setLoading(false);
            return;
        }
        setLoading(false);
        router.push(`/session/${inviteCode}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            <div className="bg-[#181f3a] p-10 sm:p-12 rounded-2xl shadow-2xl w-full max-w-xl text-center border border-blue-900/40">
                <h2 className="text-3xl font-extrabold mb-6 text-white drop-shadow-lg">Join as Guest</h2>
                {!joined ? (
                    <form onSubmit={handleGuest}>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full mb-4 p-3 rounded-lg bg-[#232a4d] text-white border border-blue-900/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:from-purple-600 hover:to-pink-600 transition flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Joining...
                                </>
                            ) : 'Join'}
                        </button>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </form>
                ) : (
                    <>
                        <div className="mb-8">
                            <form onSubmit={handleCreateSession} className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Session Name"
                                    value={sessionName}
                                    onChange={e => setSessionName(e.target.value)}
                                    className="w-full mb-4 p-3 rounded-lg bg-[#232a4d] text-white border border-blue-900/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-semibold shadow hover:from-yellow-500 hover:to-orange-500 transition"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create Session'}
                                </button>
                            </form>
                            <form onSubmit={handleJoinSession}>
                                <input
                                    type="text"
                                    placeholder="Invite Code"
                                    value={inviteCode}
                                    onChange={e => setInviteCode(e.target.value.toUpperCase())}
                                    className="w-full mb-4 p-3 rounded-lg bg-[#232a4d] text-white border border-blue-900/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-400 text-white font-semibold shadow hover:from-cyan-500 hover:to-blue-500 transition"
                                    disabled={loading}
                                >
                                    {loading ? 'Joining...' : 'Join Session'}
                                </button>
                                {joinError && <p className="text-red-500 mt-4">{joinError}</p>}
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
