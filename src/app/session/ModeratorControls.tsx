
"use client";
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface ModeratorControlsProps {
    sessionId: string | undefined;
    currentStoryName: string | null | undefined;
    status: string | undefined;
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
        <div className="bg-theme-panel p-6 rounded-2xl mb-8 shadow-lg">
            <h3 className="font-bold text-theme-heading mb-4 text-2xl">Moderator Controls</h3>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Story Name"
                    value={storyName}
                    onChange={e => setStoryName(e.target.value)}
                    className="w-full input"
                />
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
                <button
                    onClick={handleStartRound}
                    className="btn"
                    disabled={loading || status === 'voting'}
                >
                    Start Round
                </button>
                <button
                    onClick={handleRevealVotes}
                    className="btn"
                    disabled={loading || status !== 'voting'}
                >
                    Reveal Votes
                </button>
                <button
                    onClick={handleResetRound}
                    className="btn"
                    disabled={loading}
                >
                    Reset Round
                </button>
            </div>
            {error && <p className="text-theme-error mt-4">{error}</p>}
        </div>
    );
}
