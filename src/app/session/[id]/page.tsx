import ModeratorControls from './ModeratorControls';
import {
    getParticipants,
    getSessionById
} from '../../../lib/supabaseApi';
import { notFound } from 'next/navigation';

interface Participant {
    id: string;
    user_id: string;
    guest_name?: string;
    status: string;
}

export async function generateStaticParams() {
    // Replace this with your actual data fetching logic.
    // For example, fetch all session IDs from a database or API.
    const sessions = [{ id: '1' }, { id: '2' }, { id: '3' }];

    return sessions.map((session) => ({
        id: session.id,
    }));
}

interface PageProps {
    params: { id: string };
}

export default async function SessionLobbyPage(props: PageProps) {
    const params = await props.params;
    const sessionId = params.id;
    // Fetch session info
    const { data: session, error: sessionError } = await getSessionById(sessionId);
    if (sessionError || !session) return notFound();
    const sessionStatus = session.status;
    const storyName = session.current_story_name;
    // Fetch participants
    const { data: participants, error: participantsError } = await getParticipants(sessionId);
    if (participantsError || !participants) return notFound();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            <div className="bg-[#181f3a] p-10 sm:p-12 rounded-2xl shadow-2xl w-full max-w-xl text-center border border-blue-900/40">
                <h2 className="text-3xl font-extrabold mb-6 text-white drop-shadow-lg">Session Lobby</h2>
                <ModeratorControls
                    sessionId={sessionId}
                    currentStoryName={storyName}
                    status={sessionStatus}
                />
                <ul className="space-y-2">
                    {participants.map((p: Participant) => (
                        <li key={p.id} className="p-2 border rounded-lg flex items-center justify-between bg-[#232a4d] text-white">
                            <span>{p.guest_name || p.user_id}</span>
                            <span className="text-xs text-blue-200">{p.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
