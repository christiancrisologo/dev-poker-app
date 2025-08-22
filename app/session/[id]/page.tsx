"use client";
import React, { useEffect, useState, useCallback } from 'react';
import ModeratorControls from './ModeratorControls';
import VotingPanel from './VotingPanel';
import VotesReveal from './VotesReveal';
import { supabase } from '../../../lib/supabaseClient';
import { useParams } from 'next/navigation';

interface Participant {
    id: string;
    user_id: string;
    guest_name?: string;
    status: string;
}

export default function SessionLobbyPage() {
    const params = useParams();
    const sessionId = params?.id as string;
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [sessionStatus, setSessionStatus] = useState('lobby');
    const [storyName, setStoryName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch session info
    const fetchSessionInfo = useCallback(async () => {
        if (!sessionId) return;
        const { data, error: dbError } = await supabase
            .from('sessions')
            .select('status, current_story_name')
            .eq('id', sessionId)
            .single();
        if (dbError) setError('Failed to fetch session info: ' + dbError.message);
        if (!dbError && data) {
            setSessionStatus(data.status);
            setStoryName(data.current_story_name);
        }
    }, [sessionId]);
    useEffect(() => {
        if (!sessionId) return;
        const fetchParticipants = async () => {
            setLoading(true);
            const { data, error: dbError } = await supabase
                .from('participants')
                .select('*')
                .eq('session_id', sessionId);
            if (dbError) setError('Failed to fetch participants: ' + dbError.message);
            if (!dbError && data) setParticipants(data);
            setLoading(false);
        };
        fetchParticipants();
        fetchSessionInfo();

        // Subscribe to realtime updates for participants
        const participantSub = supabase
            .channel('participants')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'participants', filter: `session_id=eq.${sessionId}` },
                () => {
                    fetchParticipants();
                }
            )
            .subscribe();
        // Subscribe to session status/story changes
        const sessionSub = supabase
            .channel('sessions')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
                () => {
                    fetchSessionInfo();
                }
            )
            .subscribe();
        return () => {
            supabase.removeChannel(participantSub);
            supabase.removeChannel(sessionSub);
        };
    }, [sessionId, fetchSessionInfo]);

    // Determine current user/guest participant
    let participantId: string | null = null;
    const userId = typeof window !== 'undefined' ? (window.sessionStorage.getItem('guestId') || null) : null;
    // If logged in, get user id from supabase
    // For simplicity, use guestId from sessionStorage if present, else match by supabase user id
    if (participants.length > 0) {
        // This is async, so for MVP, just use guestId from sessionStorage if present
        participantId = participants.find(p => p.user_id === userId)?.id || null;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded shadow w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Session Lobby</h2>
                <ModeratorControls
                    sessionId={sessionId}
                    currentStoryName={storyName}
                    status={sessionStatus}
                    onStatusChange={fetchSessionInfo}
                />
                {/* Voting panel for participants when voting is enabled */}
                {sessionStatus === 'voting' && participantId && (
                    <VotingPanel
                        sessionId={sessionId}
                        participantId={participantId}
                        roundNumber={1} // MVP: always round 1
                        votingEnabled={sessionStatus === 'voting'}
                        votesRevealed={false}
                    />
                )}
                {/* Votes reveal panel for all when revealed */}
                {sessionStatus === 'revealed' && (
                    <VotesReveal
                        sessionId={sessionId}
                        participants={participants}
                        roundNumber={1}
                        revealed={true}
                    />
                )}
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <p className="text-gray-500">Loading participants...</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {participants.map(p => (
                            <li key={p.id} className="p-2 border rounded flex items-center justify-between">
                                <span>{p.guest_name || p.user_id}</span>
                                <span className="text-xs text-gray-500">{p.status}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
