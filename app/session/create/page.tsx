"use client";
import React, { useState } from 'react';
import { getUser, createSession } from '../../../lib/supabaseApi';

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={handleCreateSession} className="bg-white p-8 rounded shadow w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Create Session</h2>
                <input
                    type="text"
                    placeholder="Session Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full mb-4 p-2 border rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Session'}
                </button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {inviteCode && (
                    <div className="mt-6 p-4 bg-green-100 rounded">
                        <p className="font-semibold">Invite Code:</p>
                        <p className="text-xl font-mono">{inviteCode}</p>
                    </div>
                )}
            </form>
        </div>
    );
}
