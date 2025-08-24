import ModeratorControls from './ModeratorControls';
import {
    getParticipants,
    getSessionByInviteCode
} from '../../../lib/supabaseApi';
import { notFound } from 'next/navigation';

interface Participant {
    id: string;
    user_id: string;
    guest_name?: string;
    status: string;
}

export default async function SessionLobbyPage({ params }: { params: { id: string } }) {
    const { id: invite_code } = params;

    const { data: session, error: sessionError } = await getSessionByInviteCode(invite_code);

    console.log('session ==== ', invite_code, session, sessionError)

    if (sessionError || !session) return notFound();

    const { data: participants, error: participantsError } = await getParticipants(session.id);

    console.log('participants ==== ', participants, participantsError);

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
