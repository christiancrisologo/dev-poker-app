"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ModeratorControls from "./ModeratorControls";
import { getParticipants, getSessionByInviteCode } from "../../lib/supabaseApi";

interface Participant {
    id: string;
    user_id: string;
    guest_name?: string;
    status: string;
}

interface Session {
    id: string;
    invite_code: string;
    moderator_id: string;
    status: string;
    current_story_name?: string | null;
    // add other fields as needed
}


function SessionLobbyPageInner() {
    const searchParams = useSearchParams();
    const invite_code = searchParams.get("invite_code") || "";
    const user_id = searchParams.get("user_id") || "";
    const [session, setSession] = useState<Session | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            setLoading(true);
            setError(null);
            if (!user_id) {
                setError("Invalid user. Please go back and register before joining the session.");
                setLoading(false);
                return;
            }
            const { data: sessionData, error: sessionError } = await getSessionByInviteCode(invite_code);
            if (sessionError || !sessionData) {
                setError("Session not found");
                setLoading(false);
                return;
            }
            setSession(sessionData);
            const { data: participantsData, error: participantsError } = await getParticipants(sessionData.id);
            if (participantsError || !participantsData) {
                setError("Participants not found");
                setLoading(false);
                return;
            }
            // Ensure user is included as participant
            const userIsParticipant = participantsData.some((p: Participant) => p.user_id === user_id);
            let updatedParticipants = participantsData;
            if (!userIsParticipant) {
                updatedParticipants = [
                    {
                        id: "local-user", // or generate a temp id
                        user_id,
                        guest_name: undefined,
                        status: "joined"
                    },
                    ...participantsData
                ];
            }
            setParticipants(updatedParticipants);
            setLoading(false);
        };
        if (invite_code) fetchSession();
    }, [invite_code, user_id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
                <div className="text-theme-heading text-2xl">Loading session...</div>
            </div>
        );
    }
    if (!invite_code || !user_id || error || !session) {
        const isInvalidUser = error === "Invalid user. Please go back and register before joining the session.";
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
                <div className="bg-white/10 border border-theme-error rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full">
                    {isInvalidUser ? (
                        <>
                            <div className="mb-4">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto text-theme-error">
                                    <circle cx="12" cy="12" r="12" fill="#F87171" opacity="0.2" />
                                    <path d="M12 8v4m0 4h.01" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-theme-error mb-2">Invalid User</h2>
                            <p className="text-theme-error/80 mb-6 text-base">You must be registered to join a session. Please go back and register before joining the session lobby.</p>
                            <button
                                className="btn w-full text-xl font-extrabold py-4 px-8 mt-4"
                                onClick={() => window.location.href = "/"}
                            >
                                Go Back to Landing Page
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-theme-error mb-2">Session Not Found</h2>
                            <p className="text-theme-error/80 mb-6 text-base">{error || "Session not found"}</p>
                        </>
                    )}
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            <div className="bg-theme-card p-10 sm:p-12 rounded-2xl shadow-2xl w-full max-w-2xl text-center border border-blue-900/40">
                <h2 className="text-4xl font-extrabold mb-8 text-theme-heading drop-shadow-lg">Session Lobby</h2>
                <ModeratorControls
                    sessionId={session?.id}
                    currentStoryName={session?.current_story_name}
                    status={session?.status}
                />
                <ul className="space-y-3 mt-6">
                    {participants?.map((p: Participant) => (
                        <li key={p.id} className="p-3 border rounded-xl flex items-center justify-between bg-theme-list text-theme-text shadow">
                            <span className="font-semibold text-lg">{p.guest_name || p.user_id}</span>
                            <span className="text-xs text-theme-accent">{p.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default function SessionLobbyPage() {
    return (
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900"><div className="text-theme-heading text-2xl">Loading session...</div></div>}>
            <SessionLobbyPageInner />
        </React.Suspense>
    );
}
