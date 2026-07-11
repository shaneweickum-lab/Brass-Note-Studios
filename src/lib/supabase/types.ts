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
  // Intake detail fields (migration 005)
  phone: string | null;
  song_purpose: string | null;
  song_recipients: string | null;
  song_story: string | null;
  style_preferences: string | null;
  reference_songs: string | null;
  // Financial fields (migration 006)
  total_payment: number | null;
  date_purchased: string | null;
  date_completed: string | null;
  songwriter_buyout: boolean;
  royalty_split: string;
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
  // Production metadata (migration 006)
  style: string | null;
  genre_code: string | null;
  lyric_code: string | null;
  vocal_code: string | null;
  song_display_id: string | null;
  genre: string | null;
  sub_genre: string | null;
  vocal_type: string | null;
  bpm: string | null;
  time_sig: string | null;
  mood: string | null;
  tension_arc: string | null;
  about_the_song: string | null;
  instruments: string | null;
  suno_version: string | null;
  gen_number: number | null;
}

export interface DbLabsExperiment {
  bnl_id: string;
  studio_id: string;
  experiment_id: string | null;
  experiment_name: string | null;
  labs_global_number: number | null;
  display_number: string | null;
  suno_version: string | null;
  weirdness_pct: number | null;
  constraint_pct: number | null;
  style_prompt: string | null;
  lyric_prompt: string | null;
  tier2_symbols_used: string | null;
  tier3_applied: boolean;
  hypothesis: string | null;
  expected_result: string | null;
  actual_result: string | null;
  result_code: string | null;
  key_finding: string | null;
  integration_status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbExpense {
  id: string;
  studio_id: string;
  expense_name: string;
  recurrence: string;
  next_due_date: string | null;
  monthly_cost: number | null;
  annual_cost: number | null;
  category: string | null;
  auto_renew: boolean;
  active: boolean;
  notes: string | null;
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
