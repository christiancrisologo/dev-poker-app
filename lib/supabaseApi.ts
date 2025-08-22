// Get session by ID with status and story name
export async function getSessionById(id: string) {
  return supabase.from('sessions').select('status, current_story_name').eq('id', id).single();
}
import { supabase } from './supabaseClient';

// Auth
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function getUser() {
  return supabase.auth.getUser();
}

// Sessions
export async function createSession({ name, invite_code, moderator_id }: { name: string; invite_code: string; moderator_id: string }) {
  return supabase.from('sessions').insert({ name, invite_code, moderator_id }).select('invite_code');
}

export async function getSessionByInviteCode(invite_code: string) {
  return supabase.from('sessions').select('id').eq('invite_code', invite_code).single();
}

export async function updateSessionStatus(id: string, status: string, current_story_name?: string | null) {
  return supabase.from('sessions').update({ status, current_story_name }).eq('id', id);
}

// Participants
export async function addParticipant({ session_id, user_id, guest_name }: { session_id: string; user_id: string; guest_name?: string }) {
  return supabase.from('participants').insert({ session_id, user_id, guest_name });
}

export async function getParticipants(session_id: string) {
  return supabase.from('participants').select('*').eq('session_id', session_id);
}

export async function updateParticipantsStatus(session_id: string, status: string) {
  return supabase.from('participants').update({ status }).eq('session_id', session_id);
}

// Votes
export async function addVote({ session_id, participant_id, round_number, value }: { session_id: string; participant_id: string; round_number: number; value: string }) {
  return supabase.from('votes').insert({ session_id, participant_id, round_number, value });
}

export async function getVotes(session_id: string, round_number: number) {
  return supabase.from('votes').select('*').eq('session_id', session_id).eq('round_number', round_number);
}

export async function deleteVotes(session_id: string) {
  return supabase.from('votes').delete().eq('session_id', session_id);
}

// Realtime
export function subscribeToParticipants(session_id: string, callback: () => void) {
  return supabase.channel('participants').on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'participants', filter: `session_id=eq.${session_id}` },
    callback
  ).subscribe();
}

export function subscribeToSession(session_id: string, callback: () => void) {
  return supabase.channel('sessions').on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'sessions', filter: `id=eq.${session_id}` },
    callback
  ).subscribe();
}

import type { RealtimeChannel } from '@supabase/realtime-js';

export function removeChannel(channel: RealtimeChannel) {
  supabase.removeChannel(channel);
}
