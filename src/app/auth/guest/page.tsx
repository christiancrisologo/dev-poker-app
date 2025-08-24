"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { createSession, getSessionByInviteCode } from '../../../lib/supabaseApi';
import { userStore } from '../../../store';

export default function GuestPage() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [joined, setJoined] = useState(false);
    const [sessionName, setSessionName] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [joinError, setJoinError] = useState<string | null>(null);
    const router = useRouter();

    const setUser = userStore((state) => state.setUser);

    const handleGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (!name.trim()) {
            setError("Name is required");
            setLoading(false);
            return;
        }
        // Generate a temporary userId and store in zustand (persisted)
        const guestId = uuidv4();
        setUser({ id: guestId, name, type: 'guest' });
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
        const user = userStore.getState().user;
        const { data, error: dbError } = await createSession({ name: sessionName, invite_code: code, moderator_id: user?.id || '' });
        if (dbError) {
            setError(dbError.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        const inviteCode = data?.[0]?.invite_code || code;
        router.push(`/session?invite_code=${inviteCode}&user_id=${user?.id}`);
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
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            <div className="bg-[#181f3a] p-10 sm:p-12 rounded-2xl shadow-2xl w-full max-w-xl text-center border border-blue-900/40">
                <h2 className="text-3xl font-extrabold mb-6 text-white drop-shadow-lg">Join as Guest</h2>
                {!joined ? (
                    <form onSubmit={handleGuest} className="mb-8">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full input"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full btn"
                            disabled={loading}
                        >
                            {loading ? 'Continue as Guest...' : 'Continue as Guest'}
                        </button>
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
