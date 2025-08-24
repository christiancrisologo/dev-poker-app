// Common typings for localStorage objects and other shared types

export interface PokerUser {
  id: string;
  name: string;
  type: 'guest' | 'registered';
}

export interface PokerSession {
  id: string;
  name: string;
  inviteCode: string;
  moderatorId: string;
}

export interface LocalStorageKeys {
  guestId: string;
  guestName: string;
  username: string;
  sessionId: string;
  // Add more keys as needed
}

// Example usage:
// localStorageUtil.set<LocalStorageKeys['guestId']>('guestId', value);
// localStorageUtil.get<LocalStorageKeys['guestId']>('guestId');
