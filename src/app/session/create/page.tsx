"use client";
import React, { useState } from 'react';
import { getUser, createSession } from '../../../../lib/supabaseApi';

export default function CreateSessionPage() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inviteCode, setInviteCode] = useState<string | null>(null);

    const handleCreateSession = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setInviteCode(null);
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const moderatorId = (await getUser()).data.user?.id;
        if (!moderatorId) {
            setError('You must be logged in as moderator.');
            setLoading(false);
            return;
        }
        const { data, error: dbError } = await createSession({
            name,
            invite_code: code,
            moderator_id: moderatorId,
        });
        if (dbError) setError(dbError.message);
        else setInviteCode(data?.[0]?.invite_code || code);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            <form onSubmit={handleCreateSession} className="bg-[#181f3a] p-10 sm:p-12 rounded-2xl shadow-2xl w-full max-w-xl text-center border border-blue-900/40">
                <h2 className="text-3xl font-extrabold mb-6 text-white drop-shadow-lg">Create Session</h2>
                <input
                    type="text"
                    placeholder="Session Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
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
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {inviteCode && (
                    <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-white">
                        <p className="font-semibold">Invite Code:</p>
                        <p className="text-xl font-mono">{inviteCode}</p>
                    </div>
                )}
            </form>
        </div>
    );
}
