"use client";
import React, { useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

interface ModeratorControlsProps {
    sessionId: string;
    currentStoryName: string | null;
    status: string;
    onStatusChange?: () => void;
}

export default function ModeratorControls({ sessionId, currentStoryName, status, onStatusChange }: ModeratorControlsProps) {
    const [storyName, setStoryName] = useState(currentStoryName || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Start round
    const handleStartRound = async () => {
        setLoading(true);
        setError(null);
        const { error } = await supabase
            .from('sessions')
            .update({ status: 'voting', current_story_name: storyName })
            .eq('id', sessionId);
        if (error) setError(error.message);
        setLoading(false);
        onStatusChange?.();
    };

    // Reveal votes
    const handleRevealVotes = async () => {
        setLoading(true);
        setError(null);
        const { error } = await supabase
            .from('sessions')
            .update({ status: 'revealed' })
            .eq('id', sessionId);
        if (error) setError(error.message);
        setLoading(false);
        onStatusChange?.();
    };

    // Reset round
    const handleResetRound = async () => {
        setLoading(true);
        setError(null);
        // Clear votes for this session
        const { error: votesError } = await supabase
            .from('votes')
            .delete()
            .eq('session_id', sessionId);
        // Reset participant status
        const { error: participantsError } = await supabase
            .from('participants')
            .update({ status: 'joined' })
            .eq('session_id', sessionId);
        // Reset session status
        const { error: sessionError } = await supabase
            .from('sessions')
            .update({ status: 'lobby', current_story_name: null })
            .eq('id', sessionId);
        if (votesError || participantsError || sessionError) setError('Error resetting round');
        setLoading(false);
        onStatusChange?.();
    };

    return (
        <div className="bg-gray-100 p-4 rounded mb-6">
            <h3 className="font-bold mb-2">Moderator Controls</h3>
            <div className="mb-2">
                <input
                    type="text"
                    placeholder="Story Name"
                    value={storyName}
                    onChange={e => setStoryName(e.target.value)}
                    className="p-2 border rounded w-full"
                />
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={handleStartRound}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={loading || status === 'voting'}
                >
                    Start Round
                </button>
                <button
                    onClick={handleRevealVotes}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    disabled={loading || status !== 'voting'}
                >
                    Reveal Votes
                </button>
                <button
                    onClick={handleResetRound}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    disabled={loading}
                >
                    Reset Round
                </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
