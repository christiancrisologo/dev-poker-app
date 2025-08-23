-- profiles table
create table poker_profiles (
  id uuid primary key references auth.users(id),
  username text unique,
  created_at timestamp default now()
);

-- sessions table
create table poker_sessions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text unique not null,
  moderator_id uuid references auth.users(id),
  status text default 'lobby',
  current_story_name text,
  created_at timestamp default now()
);

-- participants table
create table poker_participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references poker_sessions(id),
  user_id uuid references auth.users(id),
  guest_name text,
  status text default 'joined',
  joined_at timestamp default now()
);

-- votes table
create table poker_votes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references poker_sessions(id),
  participant_id uuid references poker_participants(id),
  round_number int not null,
  value text not null,
  created_at timestamp default now()
);