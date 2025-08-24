"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSession, getSessionByInviteCode } from '../../../lib/supabaseApi';
import { userStore } from '../../../store';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [createSessionError, setCreateSessionError] = useState<string | null>(null);
    const [sessionName, setSessionName] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [username, setUserName] = useState("");
    const [joinError, setJoinError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const user = userStore.getState().user;
        setUserName(user?.name ?? "");
    }, []);

    const handleCreateSession = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setCreateSessionError(null);
        if (!sessionName.trim()) {
            setCreateSessionError("Session name is required");
            setLoading(false);
            return;
        }

        const user = userStore.getState().user;
        if (!user?.id) {
            setCreateSessionError("Moderator ID is missing. Please log in again.");
            setLoading(false);
            return;
        }
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const { data, error: dbError } = await createSession({ name: sessionName, invite_code: code, moderator_id: user.id });
        if (dbError) {
            setCreateSessionError(dbError.message);
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
        const user = userStore.getState().user;

        if (sessionError || !data) {
            setJoinError("Session not found.");
            setLoading(false);
            return;
        }
        setLoading(false);

        router.push(`/session?invite_code=${inviteCode}&user_id=${user?.id}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            <div className="bg-[#181f3a] p-10 sm:p-12 rounded-2xl shadow-2xl w-full max-w-xl text-center border border-blue-900/40">
                <h2 className="text-3xl font-extrabold mb-6 text-white drop-shadow-lg">Welcome, {username || "User"}!</h2>
                <p className="mb-8 text-blue-200 text-lg">You are registered. Create or join a session below.</p>
                <div className="mb-8">
                    <form onSubmit={handleCreateSession} className="mb-4">
                        <input
                            type="text"
                            placeholder="Session Name"
                            value={sessionName}
                            onChange={e => setSessionName(e.target.value)}
                            className="w-full input"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full btn"
                            disabled={loading}
                        >
                            {loading ? 'Create Session...' : 'Create Session'}
                        </button>
                        {createSessionError && <p className="text-red-500 mt-4">{createSessionError}</p>}
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
            </div>
        </div>
    );
}
