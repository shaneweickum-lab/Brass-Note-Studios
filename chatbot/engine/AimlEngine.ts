import { readFileSync, readdirSync } from "fs";
import path from "path";
import { ConversationContext } from "./ConversationContext";
import { InputNormalizer } from "./InputNormalizer";
import { ResponseBuilder, RawResponse, NavigationCard } from "./ResponseBuilder";

interface AimlRule {
  pattern: string;
  patternRegex: RegExp;
  wildcardIndex: number[]; // positions of wildcards for <star/>
  template: string;
  navigationCard?: NavigationCard;
  leadCapture?: boolean;
  quickReplies?: string[];
  that?: string; // optional <that> context match
}

interface ParsedTemplate {
  text: string;
  navigationCard?: NavigationCard;
  leadCapture?: boolean;
  quickReplies?: string[];
}

export interface EngineResponse {
  text: string;
  navigationCard?: NavigationCard;
  leadCapture?: boolean;
  quickReplies?: string[];
}

export class AimlEngine {
  private rules: AimlRule[] = [];
  private normalizer = new InputNormalizer();
  private builder = new ResponseBuilder();
  private aimlPath: string;

  constructor(aimlPath?: string) {
    this.aimlPath = aimlPath ?? path.join(process.cwd(), "chatbot", "aiml");
    this.loadAll();
  }

  private loadAll() {
    try {
      const files = readdirSync(this.aimlPath).filter((f) =>
        f.endsWith(".aiml")
      );
      // Load fallback last so specific rules take priority
      const sorted = [
        ...files.filter((f) => f !== "fallback.aiml"),
        ...files.filter((f) => f === "fallback.aiml"),
      ];
      for (const file of sorted) {
        this.loadFile(path.join(this.aimlPath, file));
      }
    } catch {
      // aiml directory not ready yet
    }
  }

  private loadFile(filePath: string) {
    try {
      const xml = readFileSync(filePath, "utf-8");
      const categories = this.parseCategories(xml);
      this.rules.push(...categories);
    } catch {
      // skip unreadable files
    }
  }

  private parseCategories(xml: string): AimlRule[] {
    const rules: AimlRule[] = [];
    // Extract <category>...</category> blocks
    const catRegex = /<category>([\s\S]*?)<\/category>/g;
    let catMatch: RegExpExecArray | null;

    while ((catMatch = catRegex.exec(xml)) !== null) {
      const block = catMatch[1];

      // Extract <that> if present
      const thatMatch = /<that>([\s\S]*?)<\/that>/i.exec(block);
      const that = thatMatch ? thatMatch[1].trim() : undefined;

      // Extract <pattern>
      const patternMatch = /<pattern>([\s\S]*?)<\/pattern>/i.exec(block);
      if (!patternMatch) continue;
      const rawPattern = patternMatch[1].trim().toUpperCase();

      // Extract <template>
      const templateMatch = /<template>([\s\S]*?)<\/template>/i.exec(block);
      if (!templateMatch) continue;
      const rawTemplate = templateMatch[1];

      const parsed = this.parseTemplate(rawTemplate);
      const { regex, wildcardIndex } = this.patternToRegex(rawPattern);

      rules.push({
        pattern: rawPattern,
        patternRegex: regex,
        wildcardIndex,
        template: parsed.text,
        navigationCard: parsed.navigationCard,
        leadCapture: parsed.leadCapture,
        quickReplies: parsed.quickReplies,
        that,
      });
    }

    return rules;
  }

  private parseTemplate(raw: string): ParsedTemplate {
    let text = raw;
    let navigationCard: NavigationCard | undefined;
    let leadCapture: boolean | undefined;
    let quickReplies: string[] | undefined;

    // Extract <nav-card label="..." href="..." description="..."/>
    const navMatch =
      /<nav-card\s+label="([^"]+)"\s+href="([^"]+)"(?:\s+description="([^"]*)")?[^/]*\/>/i.exec(
        text
      );
    if (navMatch) {
      navigationCard = {
        label: navMatch[1],
        href: navMatch[2],
        description: navMatch[3],
      };
      text = text.replace(navMatch[0], "").trim();
    }

    // Extract <lead-capture/>
    if (/<lead-capture\s*\/>/i.test(text)) {
      leadCapture = true;
      text = text.replace(/<lead-capture\s*\/>/gi, "").trim();
    }

    // Extract <quick-replies>...</quick-replies>
    const qrMatch = /<quick-replies>([\s\S]*?)<\/quick-replies>/i.exec(text);
    if (qrMatch) {
      quickReplies = qrMatch[1]
        .split(/<reply>|<\/reply>/)
        .map((s) => s.trim())
        .filter(Boolean);
      text = text.replace(qrMatch[0], "").trim();
    }

    // Strip remaining XML tags (e.g. <br/>, <srai>...)
    text = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    return { text, navigationCard, leadCapture, quickReplies };
  }

  private patternToRegex(pattern: string): {
    regex: RegExp;
    wildcardIndex: number[];
  } {
    const wildcardIndex: number[] = [];
    let idx = 0;
    const escaped = pattern
      .split(/(\*|_)/)
      .map((part) => {
        if (part === "*" || part === "_") {
          wildcardIndex.push(idx++);
          return "(.+)";
        }
        idx++;
        return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      })
      .join("");
    return {
      regex: new RegExp(`^${escaped}$`, "i"),
      wildcardIndex,
    };
  }

  process(
    userInput: string,
    context: ConversationContext
  ): EngineResponse {
    const normalized = this.normalizer.normalize(userInput);
    context.addTurn("user", userInput);

    const lastBot = this.normalizer.normalize(context.getLastBotResponse());
    const upper = normalized.toUpperCase();

    // Find matching rule (first match wins; fallback at end)
    let matched: AimlRule | null = null;
    let stars: string[] = [];

    for (const rule of this.rules) {
      // Check <that> constraint
      if (rule.that) {
        const thatPattern = rule.that.toUpperCase();
        if (!lastBot.toUpperCase().includes(thatPattern.replace(/\*/g, ""))) {
          continue;
        }
      }

      const m = rule.patternRegex.exec(upper);
      if (m) {
        matched = rule;
        stars = m.slice(1).map((s) => s?.toLowerCase() ?? "");
        break;
      }
    }

    if (!matched) {
      const fallbackText =
        "I'm not sure I have an answer for that just yet — but I'd love to connect you with our team. Would you like to start a commission inquiry?";
      context.addTurn("bot", fallbackText);
      return {
        text: fallbackText,
        quickReplies: ["Start a commission", "View pricing", "About the studio"],
      };
    }

    // Replace <star/> and <star index="N"/>
    let text = matched.template;
    text = text.replace(/<star\/>/gi, stars[0] ?? "");
    text = text.replace(/<star index="(\d+)"\/>/gi, (_, n: string) => {
      return stars[parseInt(n, 10) - 1] ?? "";
    });

    const response = this.builder.build(text, context);
    const final: EngineResponse = {
      text: response.text,
      navigationCard: matched.navigationCard,
      leadCapture: matched.leadCapture,
      quickReplies: matched.quickReplies,
    };

    context.addTurn("bot", final.text);
    return final;
  }
}
