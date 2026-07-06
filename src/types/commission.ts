export type PackageType = "single" | "ep" | "lp" | "album" | "organization";

export type ClientType = "individual" | "organization" | "content-creator";

export type ProductionStage =
  | "intake"
  | "writing"
  | "production"
  | "review"
  | "revision"
  | "delivered";

export interface Commission {
  clientId: string;
  clientName: string;
  email: string;
  clientType: ClientType;
  packageType: PackageType;
  totalSongs: number;
  createdAt: string;
  updatedAt: string;
  notes: string;
  projectedDelivery?: string; // YYYY-MM-DD — auto-calculated on create, editable by admin
}

export interface Song {
  songId: string;
  clientId: string;
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

export interface ClientCommission {
  clientId: string;
  clientName: string;
  packageType: PackageType;
  totalSongs: number;
  songs: ClientSong[];
  projectedDelivery?: string; // YYYY-MM-DD
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

// Single digit appended to client ID after the date segment
export const CLIENT_TYPE_CODES: Record<ClientType, string> = {
  individual: "1",
  organization: "2",
  "content-creator": "3",
};

// Two-digit package tier codes appended after the client type code
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
