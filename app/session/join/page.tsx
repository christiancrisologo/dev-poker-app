"use client";
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
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
            const guestId = sessionStorage.getItem('guestId');
            const guest = sessionStorage.getItem('guestName');
            userId = guestId === null ? undefined : guestId;
            guestName = guest === null ? undefined : guest;
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={handleJoinSession} className="bg-white p-8 rounded shadow w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Join Session</h2>
                <input
                    type="text"
                    placeholder="Invite Code"
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value.toUpperCase())}
                    className="w-full mb-4 p-2 border rounded uppercase"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                    disabled={loading}
                >
                    {loading ? 'Joining...' : 'Join Session'}
                </button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
        </div>
    );
}
