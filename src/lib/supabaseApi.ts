import { supabase } from './supabaseClient';

// Auth
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function getAuthUser() {
  return supabase.auth.getUser();
}

// Sessions
export async function createSession({ name, invite_code, moderator_id }: { name: string; invite_code: string; moderator_id: string }) {
  return supabase.from('poker_sessions').insert({ name, invite_code, moderator_id }).select('invite_code');
}

// Get session by ID with status and story name
export async function getSessionById(id: string) {
  return supabase.from('poker_sessions').select('status, current_story_name, id').eq('id', id).single();
}

export async function getSessionByInviteCode(invite_code: string) {
  return supabase.from('poker_sessions').select('*').eq('invite_code', invite_code).single();
}

export async function updateSessionStatus(id: string, status: string, current_story_name?: string | null) {
  return supabase.from('poker_sessions').update({ status, current_story_name }).eq('id', id);
}

// Users
export async function createUser({ username }: { username: string }) {
  return supabase.from('poker_users').insert({ username });
}

export async function getUser(username: string) {
  return supabase.from('poker_users').select('*').eq('username', username);
}


// Participants
export async function addParticipant({ session_id, user_id, guest_name }: { session_id: string; user_id: string; guest_name?: string }) {
  return supabase.from('poker_participants').insert({ session_id, user_id, guest_name });
}

export async function getParticipants(session_id: string) {
  return supabase.from('poker_participants').select('*').eq('session_id', session_id);
}

export async function updateParticipantsStatus(session_id: string, status: string) {
  return supabase.from('poker_participants').update({ status }).eq('session_id', session_id);
}

// Votes
export async function addVote({ session_id, participant_id, round_number, value }: { session_id: string; participant_id: string; round_number: number; value: string }) {
  return supabase.from('poker_votes').insert({ session_id, participant_id, round_number, value });
}

export async function getVotes(session_id: string, round_number: number) {
  return supabase.from('poker_votes').select('*').eq('session_id', session_id).eq('round_number', round_number);
}

export async function deleteVotes(session_id: string) {
  return supabase.from('poker_votes').delete().eq('session_id', session_id);
}

// Realtime
export function subscribeToParticipants(session_id: string, callback: () => void) {
  return supabase.channel('poker_participants').on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'poker_participants', filter: `session_id=eq.${session_id}` },
    callback
  ).subscribe();
}

export function subscribeToSession(session_id: string, callback: () => void) {
  return supabase.channel('poker_sessions').on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'poker_sessions', filter: `id=eq.${session_id}` },
    callback
  ).subscribe();
}

import type { RealtimeChannel } from '@supabase/realtime-js';

export function removeChannel(channel: RealtimeChannel) {
  supabase.removeChannel(channel);
}
