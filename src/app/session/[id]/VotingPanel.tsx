"use client";
import React, { useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

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
        <div className="bg-gray-100 p-4 rounded mb-6">
            <h3 className="font-bold mb-2">Vote Your Card</h3>
            <div className="flex flex-wrap gap-2 mb-2">
                {pokerCards.map(card => (
                    <button
                        key={card}
                        className={`px-4 py-2 rounded border ${selected === card ? 'bg-blue-600 text-white' : 'bg-white'} ${votingEnabled && !voteSubmitted ? 'hover:bg-blue-100' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={!votingEnabled || voteSubmitted || loading}
                        onClick={() => handleVote(card)}
                    >
                        {card}
                    </button>
                ))}
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {voteSubmitted && !votesRevealed && <p className="text-gray-600">Vote submitted! Waiting for reveal...</p>}
            {votesRevealed && selected && <p className="text-green-600">Your vote: <span className="font-bold">{selected}</span></p>}
        </div>
    );
}
