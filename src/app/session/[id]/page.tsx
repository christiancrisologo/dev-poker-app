"use client";
import React, { useEffect, useState, useCallback } from 'react';
import ModeratorControls from './ModeratorControls';
import VotingPanel from './VotingPanel';
import VotesReveal from './VotesReveal';
import {
    getParticipants,
    getSessionById,
    subscribeToParticipants,
    subscribeToSession,
    removeChannel
} from '../../../../lib/supabaseApi';
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
        const { data, error: dbError } = await getSessionById(sessionId);
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
            const { data, error: dbError } = await getParticipants(sessionId);
            if (dbError) setError('Failed to fetch participants: ' + dbError.message);
            if (!dbError && data) setParticipants(data);
            setLoading(false);
        };
        fetchParticipants();
        fetchSessionInfo();

        // Subscribe to realtime updates for participants
        const participantSub = subscribeToParticipants(sessionId, fetchParticipants);
        const sessionSub = subscribeToSession(sessionId, fetchSessionInfo);
        return () => {
            removeChannel(participantSub);
            removeChannel(sessionSub);
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            <div className="bg-[#181f3a] p-10 sm:p-12 rounded-2xl shadow-2xl w-full max-w-xl text-center border border-blue-900/40">
                <h2 className="text-3xl font-extrabold mb-6 text-white drop-shadow-lg">Session Lobby</h2>
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
                        <p className="text-blue-200">Loading participants...</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {participants.map(p => (
                            <li key={p.id} className="p-2 border rounded-lg flex items-center justify-between bg-[#232a4d] text-white">
                                <span>{p.guest_name || p.user_id}</span>
                                <span className="text-xs text-blue-200">{p.status}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
