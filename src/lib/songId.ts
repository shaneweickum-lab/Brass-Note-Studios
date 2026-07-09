/**
 * Global Song ID Utility — Base-62 P:Cnnn encoder / decoder
 *
 * ID structure: "P:Cnnn"
 *   P   — primary epoch block: one char from BASE62 (0–9, a–z, A–Z)
 *   :   — fixed delimiter
 *   C   — secondary sub-block: one char from BASE62
 *   nnn — 3-digit zero-padded integer, 001–999
 *
 * Capacity per tier:
 *   nnn values per C block  :      999
 *   C blocks per P block    :       62  →  62 × 999 = 61 938 IDs per prefix char
 *   P blocks                :       62  →  62 × 61 938 = 3 840 156 total IDs
 *
 * Absolute index formula (1-based):
 *   index = (prefixRank × 61 938) + (charRank × 999) + trailingDigits
 *
 * Example mapping:
 *   "0:0001" → 1      "0:0999" → 999
 *   "0:1001" → 1 000  "0:9999" → 9 990   ← 10 C-blocks × 999
 *   "0:a001" → 9 991  "0:Z999" → 61 938
 *   "1:0001" → 61 939 "Z:Z999" → 3 840 156  (absolute ceiling)
 */

/** Ordered Base-62 alphabet: digits → lowercase → uppercase */
export const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Strict regex for the P:Cnnn format */
const ID_RE = /^[0-9a-zA-Z]:[0-9a-zA-Z]\d{3}$/;

/** Regex for the legacy 4-digit plain-integer format ("0001"–"9999") */
const LEGACY_RE = /^\d{1,4}$/;

// ── private helpers ──────────────────────────────────────────────────────────

function b62rank(char: string): number {
  const rank = BASE62.indexOf(char);
  if (rank === -1) throw new Error(`Character "${char}" is not in the Base-62 alphabet`);
  return rank;
}

function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

// ── public API ───────────────────────────────────────────────────────────────

/**
 * Increment a P:Cnnn song ID by one step.
 *
 * Rolling rules:
 *   nnn  001–998 → nnn + 1           (same P, same C)
 *   nnn  999     → C advances one Base-62 step, nnn resets to 001
 *   C    'Z'     → P advances one Base-62 step, C resets to '0', nnn resets to 001
 *   P    'Z' with C='Z' and nnn=999  → throws (ceiling exceeded)
 */
export function incrementGlobalSongId(currentId: string): string {
  if (!ID_RE.test(currentId)) {
    throw new Error(
      `Invalid song ID "${currentId}". Expected P:Cnnn format (e.g. "0:0001").`
    );
  }

  const P = currentId[0];
  const C = currentId[2];
  const nnn = parseInt(currentId.slice(3), 10);

  const pRank = b62rank(P);
  const cRank = b62rank(C);

  if (nnn < 999) {
    return `${P}:${C}${pad3(nnn + 1)}`;
  }

  // nnn rolled past 999 → advance C
  if (cRank < 61) {
    return `${P}:${BASE62[cRank + 1]}001`;
  }

  // C rolled past 'Z' → advance P
  if (pRank < 61) {
    return `${BASE62[pRank + 1]}:0001`;
  }

  throw new Error(
    `Song ID ceiling exceeded: "Z:Z999" is the absolute maximum (3 840 156 songs).`
  );
}

/**
 * Return the 1-based absolute sequential index for a P:Cnnn song ID.
 *
 * Math:
 *   Each C-block holds exactly 999 IDs.
 *   Each P-block holds exactly 62 C-blocks = 62 × 999 = 61 938 IDs.
 *   index = (pRank × 61 938) + (cRank × 999) + nnn
 */
export function calculateAbsoluteIndex(songId: string): number {
  if (!ID_RE.test(songId)) {
    throw new Error(
      `Invalid song ID "${songId}". Expected P:Cnnn format (e.g. "0:0001").`
    );
  }

  const pRank = b62rank(songId[0]);
  const cRank = b62rank(songId[2]);
  const nnn   = parseInt(songId.slice(3), 10);

  return pRank * 61_938 + cRank * 999 + nnn;
}

/**
 * Convert a 1-based sequential integer into its P:Cnnn representation.
 * Inverse of calculateAbsoluteIndex.
 */
export function fromSequentialIndex(index: number): string {
  if (!Number.isInteger(index) || index < 1 || index > 3_840_156) {
    throw new Error(
      `Index ${index} is out of range. Must be an integer from 1 to 3 840 156.`
    );
  }

  const pRank = Math.floor((index - 1) / 61_938);
  const rem1  = (index - 1) % 61_938;
  const cRank = Math.floor(rem1 / 999);
  const nnn   = (rem1 % 999) + 1;

  return `${BASE62[pRank]}:${BASE62[cRank]}${pad3(nnn)}`;
}

/**
 * Return the absolute sequential index for any song ID — handles both the
 * legacy plain-integer format ("0042") and the current P:Cnnn format ("0:0042").
 *
 * Use this at display time so the admin UI works regardless of which era
 * a song was created in.
 */
export function getSongIndex(songId: string): number {
  if (ID_RE.test(songId))     return calculateAbsoluteIndex(songId);
  if (LEGACY_RE.test(songId)) return parseInt(songId, 10);
  throw new Error(`Unrecognised song ID format: "${songId}"`);
}
