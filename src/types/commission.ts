export type PackageType = "single" | "ep" | "lp" | "album" | "organization";
export type ClientType = "individual" | "organization" | "content-creator";
export type ProductionStage =
  | "intake"
  | "writing"
  | "production"
  | "review"
  | "revision"
  | "delivered";

// Permanent client record — created once per unique email, never changes
export interface Client {
  permanentId: string; // BNS{MMDDYY}C{NNNN}
  clientName: string;
  email: string;
  createdAt: string;
}

export interface Commission {
  permanentId: string;      // BNS011526C0001 — client's portal login ID
  fullCommissionId: string; // BNS011526C0001-101-0001 — internal tracking ID
  clientName: string;
  email: string;
  clientType: ClientType;
  packageType: PackageType;
  totalSongs: number;
  currentStage: ProductionStage; // overall commission status, updated as songs progress
  createdAt: string;
  updatedAt: string;
  notes: string;
  projectedDelivery?: string; // YYYY-MM-DD
  // Intake detail fields (migration 005)
  phone?: string;
  songPurpose?: string;
  songRecipients?: string;
  songStory?: string;
  stylePreferences?: string;
  referenceSongs?: string;
  // Financial fields (migration 006)
  totalPayment?: number;
  datePurchased?: string;  // YYYY-MM-DD
  dateCompleted?: string;  // YYYY-MM-DD
  songwriterBuyout?: boolean;
  royaltySplit?: string;   // e.g. "80/20"
}

/** Returns fullCommissionId/N when totalSongs > 1, else fullCommissionId unchanged. */
export function formatCommissionId(fullCommissionId: string, totalSongs: number): string {
  return totalSongs > 1 ? `${fullCommissionId}/${totalSongs}` : fullCommissionId;
}

export interface Song {
  songId: string;       // P:Cnnn global seq, e.g. "0:0001"
  commissionId: string; // fullCommissionId
  title: string;
  trackNumber: number;
  productionStage: ProductionStage;
  revisionsTotal: number;
  revisionsUsed: number;
  revisionsRemaining: number;
  lyricsReady: boolean;
  lyrics: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
  // Production metadata (migration 006)
  style?: string;
  genreCode?: string;
  lyricCode?: string;
  vocalCode?: string;
  songDisplayId?: string;
  genre?: string;
  subGenre?: string;
  vocalType?: string;
  bpm?: string;
  timeSig?: string;
  mood?: string;
  tensionArc?: string;
  aboutTheSong?: string;
  instruments?: string;
  sunoVersion?: string;
  genNumber?: number;
}

// Safe fields returned to the client — no PII or admin metadata
export interface ClientSong {
  songId: string;
  title: string;
  trackNumber: number;
  productionStage: ProductionStage;
  revisionsRemaining: number;
  lyricsReady: boolean;
  lyrics: string | null; // only populated when lyricsReady === true
}

// Client-visible view of one commission
export interface ClientCommissionView {
  fullCommissionId: string;
  packageType: PackageType;
  totalSongs: number;
  projectedDelivery?: string;
  songs: ClientSong[];
}

// Full client portal — may include multiple commissions (returning clients)
export interface ClientPortalData {
  permanentId: string;
  clientName: string;
  commissions: ClientCommissionView[];
}

export const STAGE_ORDER: ProductionStage[] = [
  "intake",
  "writing",
  "production",
  "review",
  "revision",
  "delivered",
];

export const STAGE_LABELS: Record<ProductionStage, string> = {
  intake: "Intake",
  writing: "Writing",
  production: "Production",
  review: "Review",
  revision: "Revision",
  delivered: "Delivered",
};

export const STAGE_CLIENT_DESCRIPTIONS: Record<ProductionStage, string> = {
  intake: "We've received your commission and are gathering everything we need to begin.",
  writing: "Your lyrics are being crafted. We're working on making your story sing.",
  production: "Your song is in production. The studio is building your track.",
  review: "Your song is in our internal quality review. Almost there.",
  revision: "Your revision is being worked on.",
  delivered: "Your song has been delivered. We hope it moves you.",
};

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  individual: "Individual",
  organization: "Organization",
  "content-creator": "Content Creator",
};

// Single digit appended after the date in the full commission ID
export const CLIENT_TYPE_CODES: Record<ClientType, string> = {
  individual: "1",
  organization: "2",
  "content-creator": "3",
};

// Two-digit package tier code appended after the client type digit
export const PACKAGE_TIER_CODES: Record<PackageType, string> = {
  single: "01",
  ep: "02",
  lp: "03",
  album: "04",
  organization: "04",
};

export const PACKAGE_DEFAULT_SONGS: Record<PackageType, number> = {
  single: 1,
  ep: 3,
  lp: 5,
  album: 8,
  organization: 1,
};

export const PACKAGE_TIMELINE_RANGES: Record<PackageType, string> = {
  single: "10–14 days",
  ep: "2–3 weeks",
  lp: "5–7 weeks",
  album: "Up to 12 weeks",
  organization: "Custom timeline",
};

// Default days added to intake date when auto-calculating projected delivery
export const PACKAGE_DELIVERY_DAYS: Record<PackageType, number> = {
  single: 14,
  ep: 21,
  lp: 49,
  album: 84,
  organization: 84,
};
