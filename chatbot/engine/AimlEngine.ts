import { readFileSync, readdirSync } from "fs";
import path from "path";
import { ConversationContext } from "./ConversationContext";
import { InputNormalizer } from "./InputNormalizer";
import { ResponseBuilder, NavigationCard } from "./ResponseBuilder";
import { FormWalkEngine } from "./FormWalkEngine";

interface AimlRule {
  pattern: string;
  patternRegex: RegExp;
  template: string;
  navigationCard?: NavigationCard;
  leadCapture?: boolean;
  quickReplies?: string[];
  that?: string;
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
  private formWalk = new FormWalkEngine();
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
      const sorted = [
        ...files.filter((f) => f !== "fallback.aiml"),
        ...files.filter((f) => f === "fallback.aiml"),
      ];
      for (const file of sorted) {
        this.loadFile(path.join(this.aimlPath, file));
      }
    } catch {
      // aiml dir not ready
    }
  }

  private loadFile(filePath: string) {
    try {
      const xml = readFileSync(filePath, "utf-8");
      this.rules.push(...this.parseCategories(xml));
    } catch {
      // skip unreadable files
    }
  }

  private parseCategories(xml: string): AimlRule[] {
    const rules: AimlRule[] = [];
    const catRegex = /<category>([\s\S]*?)<\/category>/g;
    let catMatch: RegExpExecArray | null;

    while ((catMatch = catRegex.exec(xml)) !== null) {
      const block = catMatch[1];

      const thatMatch = /<that>([\s\S]*?)<\/that>/i.exec(block);
      const that = thatMatch ? thatMatch[1].trim() : undefined;

      const patternMatch = /<pattern>([\s\S]*?)<\/pattern>/i.exec(block);
      if (!patternMatch) continue;
      const rawPattern = patternMatch[1].trim().toUpperCase();

      const templateMatch = /<template>([\s\S]*?)<\/template>/i.exec(block);
      if (!templateMatch) continue;

      const parsed = this.parseTemplate(templateMatch[1]);
      const regex = this.patternToRegex(rawPattern);

      rules.push({
        pattern: rawPattern,
        patternRegex: regex,
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

    // <nav-card label="..." href="..." description="..." auto-navigate="true"/>
    const navMatch =
      /<nav-card\s([^>]*?)\/>/i.exec(text);
    if (navMatch) {
      const attrs = navMatch[1];
      const getAttr = (name: string) => {
        const m = new RegExp(`${name}="([^"]*)"`, "i").exec(attrs);
        return m ? m[1] : undefined;
      };
      navigationCard = {
        label: getAttr("label") ?? "",
        href: getAttr("href") ?? "/",
        description: getAttr("description"),
        autoNavigate: getAttr("auto-navigate") === "true",
      };
      text = text.replace(navMatch[0], "").trim();
    }

    if (/<lead-capture\s*\/>/i.test(text)) {
      leadCapture = true;
      text = text.replace(/<lead-capture\s*\/>/gi, "").trim();
    }

    const qrMatch = /<quick-replies>([\s\S]*?)<\/quick-replies>/i.exec(text);
    if (qrMatch) {
      quickReplies = qrMatch[1]
        .split(/<reply>|<\/reply>/)
        .map((s) => s.trim())
        .filter(Boolean);
      text = text.replace(qrMatch[0], "").trim();
    }

    text = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return { text, navigationCard, leadCapture, quickReplies };
  }

  private patternToRegex(pattern: string): RegExp {
    const escaped = pattern
      .split(/(\*|_)/)
      .map((part) =>
        part === "*" || part === "_"
          ? "(.+)"
          : part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      )
      .join("");
    return new RegExp(`^${escaped}$`, "i");
  }

  process(userInput: string, context: ConversationContext): EngineResponse {
    const normalized = this.normalizer.normalize(userInput);
    context.addTurn("user", userInput);

    // Form walk takes priority when active
    const fw = context.getFormWalk();
    if (fw.active && fw.step) {
      const walkResult = this.formWalk.process(userInput, context);
      if (walkResult) {
        context.addTurn("bot", walkResult.text);
        return walkResult;
      }
    }

    const lastBot = this.normalizer
      .normalize(context.getLastBotResponse())
      .toUpperCase();
    const upper = normalized.toUpperCase();

    let matched: AimlRule | null = null;
    let stars: string[] = [];

    for (const rule of this.rules) {
      if (rule.that) {
        const tp = rule.that.toUpperCase();
        if (!lastBot.includes(tp.replace(/\*/g, ""))) continue;
      }
      const m = rule.patternRegex.exec(upper);
      if (m) {
        matched = rule;
        stars = m.slice(1).map((s) => s?.toLowerCase() ?? "");
        break;
      }
    }

    if (!matched) {
      const text =
        "That's a great question — I want to make sure you get the right answer. Our team would be happy to help directly. Would you like to start a commission inquiry, or is there something specific I can look up for you?";
      context.addTurn("bot", text);
      return {
        text,
        quickReplies: ["Start a commission", "Pricing", "How it works", "Contact the team"],
      };
    }

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

  startFormWalk(context: ConversationContext): EngineResponse {
    const result = this.formWalk.start(context);
    context.addTurn("user", "[form walk triggered]");
    context.addTurn("bot", result.text);
    return result;
  }
}
