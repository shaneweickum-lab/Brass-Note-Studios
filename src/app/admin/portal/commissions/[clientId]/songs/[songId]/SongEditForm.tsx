"use client";

import { useState } from "react";
import type { Song, ProductionStage } from "@/types/commission";
import { STAGE_LABELS } from "@/types/commission";
import { stageStyle } from "@/lib/portal/stageStyle";

interface Props {
  song: Song;
  action: (formData: FormData) => Promise<void>;
}

const STAGE_OPTIONS: ProductionStage[] = [
  "intake",
  "writing",
  "production",
  "review",
  "revision",
  "delivered",
];

const inputClass =
  "w-full bg-background border border-white/10 rounded px-3 py-2 font-body text-sm text-text-base placeholder:text-text-subtle focus:outline-none focus:border-gold/50 transition-colors";

export default function SongEditForm({ song, action }: Props) {
  const [revisionsTotal, setRevisionsTotal] = useState(song.revisionsTotal);
  const [revisionsUsed, setRevisionsUsed] = useState(song.revisionsUsed);
  const [revisionsToAdd, setRevisionsToAdd] = useState(0);
  const [lyricsReady, setLyricsReady] = useState(song.lyricsReady);
  const [selectedStage, setSelectedStage] = useState<ProductionStage>(song.productionStage);

  const revisionsRemaining = Math.max(0, revisionsTotal - revisionsUsed);

  function handleAddRevisions() {
    if (revisionsToAdd > 0) {
      setRevisionsTotal((prev) => prev + revisionsToAdd);
      setRevisionsToAdd(0);
    }
  }

  return (
    <form action={action} className="space-y-6">
      {/* Hidden computed values */}
      <input type="hidden" name="revisionsTotal" value={revisionsTotal} />
      <input type="hidden" name="lyricsReady" value={lyricsReady ? "true" : "false"} />

      {/* Song Title */}
      <div className="space-y-1.5">
        <label className="block font-body text-sm text-text-muted">Song Title</label>
        <input
          name="title"
          type="text"
          defaultValue={song.title}
          className={inputClass}
          placeholder="Enter song title…"
        />
      </div>

      {/* Production Stage */}
      <div className="space-y-2">
        <label className="block font-body text-sm text-text-muted">Production Stage</label>
        <div className="flex flex-wrap gap-2">
          {STAGE_OPTIONS.map((stage) => {
            const isSelected = selectedStage === stage;
            return (
              <label key={stage} className="cursor-pointer">
                <input
                  type="radio"
                  name="productionStage"
                  value={stage}
                  checked={isSelected}
                  onChange={() => setSelectedStage(stage)}
                  className="sr-only"
                />
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded border text-xs font-body cursor-pointer transition-all select-none ${
                    isSelected
                      ? `${stageStyle(stage)} ring-1 ring-current ring-offset-1 ring-offset-background`
                      : "text-text-subtle border-white/10 hover:border-white/20 hover:text-text-muted"
                  }`}
                >
                  {STAGE_LABELS[stage]}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Revisions */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-body text-sm text-text-muted">Revisions</span>
          <span className="font-display text-2xl text-gold">{revisionsRemaining}</span>
          <span className="font-body text-xs text-text-subtle">
            remaining ({revisionsUsed} used / {revisionsTotal} total)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Revisions Used */}
          <div className="space-y-1.5">
            <label className="block font-body text-xs text-text-subtle uppercase tracking-[0.1em]">
              Revisions Used
            </label>
            <input
              name="revisionsUsed"
              type="number"
              min={0}
              max={revisionsTotal}
              value={revisionsUsed}
              onChange={(e) =>
                setRevisionsUsed(Math.max(0, parseInt(e.target.value, 10) || 0))
              }
              className={inputClass}
            />
          </div>

          {/* Add Revisions */}
          <div className="space-y-1.5">
            <label className="block font-body text-xs text-text-subtle uppercase tracking-[0.1em]">
              Add to Total
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                max={20}
                value={revisionsToAdd}
                onChange={(e) =>
                  setRevisionsToAdd(Math.max(0, parseInt(e.target.value, 10) || 0))
                }
                className={`${inputClass} flex-1`}
                placeholder="0"
              />
              <button
                type="button"
                onClick={handleAddRevisions}
                className="px-3 py-2 border border-gold/40 text-gold font-body text-xs rounded hover:bg-gold/10 transition-colors shrink-0"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lyrics Ready toggle */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={lyricsReady}
            onClick={() => setLyricsReady((prev) => !prev)}
            className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 ${
              lyricsReady ? "bg-gold" : "bg-white/10"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background transition-transform ${
                lyricsReady ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() => setLyricsReady((prev) => !prev)}
            className="font-body text-sm text-text-muted hover:text-text-base transition-colors"
          >
            Lyrics Ready
          </button>
        </div>

        {lyricsReady && (
          <div className="space-y-1.5">
            <label className="block font-body text-xs text-text-subtle uppercase tracking-[0.1em]">
              Lyrics
            </label>
            <textarea
              name="lyrics"
              rows={10}
              defaultValue={song.lyrics ?? ""}
              className={`${inputClass} resize-y`}
              placeholder="Enter the song lyrics here…"
            />
          </div>
        )}
      </div>

      {/* Internal Notes */}
      <div className="space-y-1.5">
        <div className="flex items-baseline gap-2">
          <label className="block font-body text-sm text-text-muted">Internal Notes</label>
          <span className="font-body text-xs text-text-subtle">Never shown to client</span>
        </div>
        <textarea
          name="notes"
          rows={4}
          defaultValue={song.notes}
          className={`${inputClass} resize-none`}
          placeholder="Internal production notes, references, context…"
        />
      </div>

      <div className="flex items-center gap-4 pt-1">
        <button
          type="submit"
          className="px-5 py-2 bg-gold text-background font-body text-sm font-medium rounded hover:bg-gold-light transition-colors"
        >
          Save Changes
        </button>
        <span className="font-body text-xs text-text-subtle">
          Last updated: {new Date(song.updatedAt).toLocaleString()}
        </span>
      </div>
    </form>
  );
}
