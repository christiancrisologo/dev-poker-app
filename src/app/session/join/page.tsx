"use client";
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import localStorageUtil from '../../../lib/localStorageUtil';
import { useRouter } from 'next/navigation';

export default function JoinSessionPage() {
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleJoinSession = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // Find session by invite code
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .select('id')
            .eq('invite_code', inviteCode)
            .single();
        if (sessionError || !session) {
            setError('Session not found.');
            setLoading(false);
            return;
        }
        // Get user info
        const user = (await supabase.auth.getUser()).data.user;
        let userId = user?.id;
        let guestName = null;
        if (!userId) {
            type Guest = { id: string; username: string };
            const guest = localStorageUtil.get('poker-guest') as Guest | null;

            userId = guest?.id;
            guestName = guest?.username;
            if (!userId || !guestName) {
                setError('You must be logged in or join as guest.');
                setLoading(false);
                return;
            }
        }
        // Add participant
        const { error: participantError } = await supabase
            .from('participants')
            .insert({
                session_id: session.id,
                user_id: userId,
                guest_name: guestName,
            });
        if (participantError) {
            setError(participantError.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        router.push(`/session/${session.id}`); // Redirect to session lobby
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            <form onSubmit={handleJoinSession} className="bg-[#181f3a] p-10 sm:p-12 rounded-2xl shadow-2xl w-full max-w-xl text-center border border-blue-900/40">
                <h2 className="text-3xl font-extrabold mb-6 text-white drop-shadow-lg">Join Session</h2>
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
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
        </div>
    );
}
