// Database row types — snake_case matching the actual Postgres column names.
// queries.ts maps these to the camelCase TypeScript types in @/types/commission.

export interface DbClient {
  permanent_id: string;
  client_name: string;
  email: string;
  created_at: string;
}

export interface DbCommission {
  full_commission_id: string;
  permanent_id: string;
  client_name: string;
  email: string;
  client_type: string;
  package_type: string;
  total_songs: number;
  current_stage: string;
  notes: string;
  projected_delivery: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSong {
  song_id: string;
  commission_id: string;
  title: string;
  track_number: number;
  production_stage: string;
  revisions_total: number;
  revisions_used: number;
  revisions_remaining: number;
  lyrics_ready: boolean;
  lyrics: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  permanent_id: string;
  sender: "client" | "admin";
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface DbClientCounter {
  id: string;
  value: number;
}
