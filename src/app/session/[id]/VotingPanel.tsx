"use client";
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const pokerCards = ['0', '1', '2', '3', '5', '8', '13', '21', '40', '100', '?'];

interface VotingPanelProps {
    sessionId: string;
    participantId: string;
    roundNumber: number;
    votingEnabled: boolean;
    votesRevealed: boolean;
}

export default function VotingPanel({ sessionId, participantId, roundNumber, votingEnabled, votesRevealed }: VotingPanelProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [voteSubmitted, setVoteSubmitted] = useState(false);

    const handleVote = async (value: string) => {
        setLoading(true);
        setError(null);
        setSelected(value);
        const { error } = await supabase
            .from('votes')
            .insert({
                session_id: sessionId,
                participant_id: participantId,
                round_number: roundNumber,
                value,
            });
        if (error) setError(error.message);
        else setVoteSubmitted(true);
        setLoading(false);
    };

    return (
        <div className="bg-theme-panel p-6 rounded-2xl mb-8 shadow-lg">
            <h3 className="font-bold text-theme-heading mb-4 text-2xl">Vote Your Card</h3>
            <div className="flex flex-wrap gap-3 mb-4 justify-center">
                {pokerCards.map(card => (
                    <button
                        key={card}
                        className={`px-6 py-3 rounded-xl border font-bold text-lg shadow transition ${selected === card ? 'bg-theme-primary text-white' : 'bg-theme-card text-theme-text'} ${votingEnabled && !voteSubmitted ? 'hover:bg-theme-primary-light' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={!votingEnabled || voteSubmitted || loading}
                        onClick={() => handleVote(card)}
                    >
                        {card}
                    </button>
                ))}
            </div>
            {error && <p className="text-theme-error mt-4">{error}</p>}
            {voteSubmitted && !votesRevealed && <p className="text-theme-muted">Vote submitted! Waiting for reveal...</p>}
            {votesRevealed && selected && <p className="text-theme-success">Your vote: <span className="font-bold">{selected}</span></p>}
        </div>
    );
}
