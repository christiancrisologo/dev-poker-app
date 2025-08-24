"use client";
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUser, createSession } from '../../../lib/supabaseApi';
import { generateInviteCode } from '../../../lib/generator';


function CreateSessionPageInner() {
    const searchParams = useSearchParams();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [showJoinForm, setShowJoinForm] = useState(true);
    const user_id = searchParams.get("user_id") || "";
    const router = useRouter();

    const handleCreateSession = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setInviteCode(null);
        setShowJoinForm(false);
        const code = generateInviteCode();
        const userArr = (await getUser(name)).data;
        const moderatorId = userArr && userArr.length > 0 ? userArr[0].id : null;

        if (!moderatorId) {
            setError('You must be logged in as moderator.');
            setLoading(false);
            setShowJoinForm(true);
            return;
        }

        const { data, error: dbError } = await createSession({
            name,
            invite_code: code,
            moderator_id: moderatorId,
        });

        if (dbError) {
            setError(dbError.message);
            setLoading(false);
            setShowJoinForm(true);
        } else {
            setInviteCode(data?.[0]?.invite_code || code);
            setLoading(false);

            router.push(`/session?invite_code=${inviteCode}&user_id=${user_id}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            <div className="bg-[#181f3a] p-10 sm:p-12 rounded-2xl shadow-2xl w-full max-w-xl text-center border border-blue-900/40">
                <h2 className="text-3xl font-extrabold mb-6 text-white drop-shadow-lg">Create Session</h2>
                <form onSubmit={handleCreateSession}>
                    <input
                        type="text"
                        placeholder="Session Name"
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
                        {loading ? 'Creating...' : 'Create Session'}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {inviteCode && (
                    <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-white">
                        <p className="font-semibold">Invite Code:</p>
                        <p className="text-xl font-mono">{inviteCode}</p>
                    </div>
                )}
                {/* Join session form would go here, only show if showJoinForm is true */}
                {showJoinForm && (
                    <div className="mt-8">
                        {/* Add your join session form here if needed */}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CreateSessionPage() {
    return (
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900"><div className="text-theme-heading text-2xl">Loading...</div></div>}>
            <CreateSessionPageInner />
        </React.Suspense>
    );
}
