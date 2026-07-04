export class InputNormalizer {
  private readonly contractions: Record<string, string> = {
    "what's": "what is",
    "how's": "how is",
    "it's": "it is",
    "i'm": "i am",
    "you're": "you are",
    "they're": "they are",
    "we're": "we are",
    "don't": "do not",
    "doesn't": "does not",
    "can't": "cannot",
    "won't": "will not",
    "i'd": "i would",
    "i'll": "i will",
    "i've": "i have",
    "there's": "there is",
    "that's": "that is",
    "who's": "who is",
    "where's": "where is",
    "when's": "when is",
  };

  // Word-level synonyms applied after contraction expansion.
  // Maps less-common user phrasings to terms that appear in AIML patterns.
  private readonly synonyms: Record<string, string> = {
    // Music object synonyms → "song"
    "tune": "song",
    "tunes": "songs",
    "track": "song",
    "tracks": "songs",
    "piece": "song",
    "pieces": "songs",
    "ditty": "song",
    "composition": "song",
    "compositions": "songs",
    "melody": "song",
    "melodies": "songs",
    // Cost synonyms → "cost"
    "fee": "cost",
    "fees": "cost",
    "rate": "cost",
    "rates": "cost",
    "expense": "cost",
    "expenses": "cost",
    // Revision synonyms
    "edit": "revision",
    "edits": "revisions",
    "modification": "revision",
    "modifications": "revisions",
    // Timeline synonyms → "turnaround"
    "timeline": "turnaround",
    "timeframe": "turnaround",
    // Commission synonyms
    "order": "commission",
    "orders": "commissions",
    "purchase": "commission",
    "purchases": "commissions",
  };

  normalize(input: string): string {
    let text = input.toLowerCase().trim();

    // Expand contractions
    for (const [contraction, expansion] of Object.entries(this.contractions)) {
      text = text.replace(new RegExp(contraction, "g"), expansion);
    }

    // Strip punctuation except spaces
    text = text.replace(/[^\w\s]/g, " ");

    // Collapse whitespace
    text = text.replace(/\s+/g, " ").trim();

    // Apply word-level synonyms (word boundary matching)
    for (const [from, to] of Object.entries(this.synonyms)) {
      text = text.replace(new RegExp(`\\b${from}\\b`, "g"), to);
    }

    return text;
  }
}
