"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

interface Vote {
    id: string;
    participant_id: string;
    value: string;
}
interface Participant {
    id: string;
    user_id: string;
    guest_name?: string;
}

interface VotesRevealProps {
    sessionId: string;
    participants: Participant[];
    roundNumber: number;
    revealed: boolean;
}

export default function VotesReveal({ sessionId, participants, roundNumber, revealed }: VotesRevealProps) {
    const [votes, setVotes] = useState<Vote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!revealed) return;
        const fetchVotes = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('votes')
                .select('*')
                .eq('session_id', sessionId)
                .eq('round_number', roundNumber);
            if (!error && data) setVotes(data);
            setLoading(false);
        };
        fetchVotes();
    }, [sessionId, roundNumber, revealed]);

    // Calculate average/median (ignore '?')
    const numericVotes = votes
        .map(v => parseInt(v.value))
        .filter(v => !isNaN(v));
    const average = numericVotes.length ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(2) : null;
    const median = (() => {
        if (!numericVotes.length) return null;
        const sorted = [...numericVotes].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
    })();

    return (
        <div className="bg-yellow-100 p-4 rounded mb-6">
            <h3 className="font-bold mb-2">Votes Reveal</h3>
            {loading ? (
                <p>Loading votes...</p>
            ) : (
                <ul className="space-y-2 mb-2">
                    {participants.map(p => {
                        const vote = votes.find(v => v.participant_id === p.id);
                        return (
                            <li key={p.id} className="p-2 border rounded flex items-center justify-between">
                                <span>{p.guest_name || p.user_id}</span>
                                <span className="font-mono text-lg">{vote ? vote.value : '-'}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
            <div className="mt-2">
                <span className="font-semibold">Average:</span> {average ?? '-'}<br />
                <span className="font-semibold">Median:</span> {median ?? '-'}
            </div>
        </div>
    );
}
