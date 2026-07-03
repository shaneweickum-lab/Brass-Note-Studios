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

    return text;
  }
}
