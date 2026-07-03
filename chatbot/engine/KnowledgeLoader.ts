import { readFileSync } from "fs";
import path from "path";

export interface KnowledgeBase {
  [topic: string]: unknown;
}

export class KnowledgeLoader {
  private cache: Map<string, KnowledgeBase> = new Map();
  private knowledgePath: string;

  constructor(knowledgePath?: string) {
    this.knowledgePath =
      knowledgePath ?? path.join(process.cwd(), "chatbot", "knowledge");
  }

  load(filename: string): KnowledgeBase {
    if (this.cache.has(filename)) {
      return this.cache.get(filename)!;
    }
    try {
      const filePath = path.join(this.knowledgePath, filename);
      const raw = readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw) as KnowledgeBase;
      this.cache.set(filename, data);
      return data;
    } catch {
      return {};
    }
  }

  loadAll(filenames: string[]): KnowledgeBase {
    return filenames.reduce<KnowledgeBase>((acc, f) => {
      return { ...acc, ...this.load(f) };
    }, {});
  }
}
