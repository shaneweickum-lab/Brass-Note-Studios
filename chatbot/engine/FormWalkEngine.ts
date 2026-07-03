import { ConversationContext } from "./ConversationContext";
import { EngineResponse } from "./AimlEngine";

export type FormWalkStep =
  | "asking_name"
  | "asking_email"
  | "asking_occasion"
  | "asking_package"
  | "asking_story"
  | "complete";

export interface FormWalkData {
  name?: string;
  email?: string;
  occasion?: string;
  category?: string;
  packageName?: string;
  story?: string;
}

export interface FormWalkState {
  active: boolean;
  step: FormWalkStep | null;
  data: FormWalkData;
}

const OCCASION_CATEGORY_MAP: Record<string, string> = {
  wedding:           "Individual Commissions",
  birthday:          "Individual Commissions",
  anniversary:       "Individual Commissions",
  memorial:          "Individual Commissions",
  graduation:        "Individual Commissions",
  proposal:          "Individual Commissions",
  "something else":  "Individual Commissions",
  personal:          "Individual Commissions",
  church:            "Organization Commissions",
  nonprofit:         "Organization Commissions",
  school:            "Organization Commissions",
  business:          "Organization Commissions",
  corporate:         "Organization Commissions",
  "content creation": "Content Creator Commissions",
  youtube:           "Content Creator Commissions",
  podcast:           "Content Creator Commissions",
  social:            "Content Creator Commissions",
  creator:           "Content Creator Commissions",
};

const PACKAGE_MAP: Record<string, string> = {
  "just one":  "Single",
  "one song":  "Single",
  "single":    "Single",
  "3":         "EP",
  "three":     "EP",
  "ep":        "EP",
  "small":     "EP",
  "6":         "LP",
  "six":       "LP",
  "lp":        "LP",
  "larger":    "LP",
  "full album": "Full Album",
  "album":     "Full Album",
  "8":         "Full Album",
};

export class FormWalkEngine {
  start(context: ConversationContext): EngineResponse {
    context.setFormWalk({
      active: true,
      step: "asking_name",
      data: {},
    });

    return {
      text: "I'll walk you through the commission form step by step — it only takes a few minutes. First, what's your name?",
    };
  }

  process(
    input: string,
    context: ConversationContext
  ): EngineResponse | null {
    const fw = context.getFormWalk();
    if (!fw.active || !fw.step) return null;

    const lower = input.trim().toLowerCase();

    switch (fw.step) {
      case "asking_name":
        return this.handleName(input, context, fw);

      case "asking_email":
        return this.handleEmail(lower, input, context, fw);

      case "asking_occasion":
        return this.handleOccasion(lower, context, fw);

      case "asking_package":
        return this.handlePackage(lower, context, fw);

      case "asking_story":
        return this.handleStory(input, context, fw);

      default:
        return null;
    }
  }

  private handleName(
    input: string,
    context: ConversationContext,
    fw: FormWalkState
  ): EngineResponse {
    const name = input.trim().replace(/^(i'?m|my name is|i am)\s+/i, "").trim();
    fw.data.name = name;
    fw.step = "asking_email";
    context.setFormWalk(fw);

    return {
      text: `Lovely to meet you, ${name}. What's your email address? We'll use this to send you project updates.`,
    };
  }

  private handleEmail(
    lower: string,
    raw: string,
    context: ConversationContext,
    fw: FormWalkState
  ): EngineResponse {
    const emailMatch = /[^\s@]+@[^\s@]+\.[^\s@]+/.exec(raw.trim());
    if (!emailMatch) {
      return {
        text: "That doesn't look like a valid email address — could you double-check and try again?",
      };
    }

    fw.data.email = emailMatch[0].toLowerCase();
    fw.step = "asking_occasion";
    context.setFormWalk(fw);

    return {
      text: `Got it. Now — what's the occasion for this song? Tell me a bit about what you have in mind, or pick from one of these:`,
      quickReplies: [
        "Wedding",
        "Birthday / Anniversary",
        "Church or Nonprofit",
        "Content Creation",
        "Corporate or Business",
        "Something Else",
      ],
    };
  }

  private handleOccasion(
    lower: string,
    context: ConversationContext,
    fw: FormWalkState
  ): EngineResponse {
    fw.data.occasion = lower;

    // Map to category
    let category = "Individual Commissions";
    for (const [keyword, cat] of Object.entries(OCCASION_CATEGORY_MAP)) {
      if (lower.includes(keyword)) {
        category = cat;
        break;
      }
    }
    fw.data.category = category;
    fw.step = "asking_package";
    context.setFormWalk(fw);

    const catShort = category.replace(" Commissions", "").toLowerCase();
    return {
      text: `That sounds like an ${catShort} commission. How many songs are you thinking? A single track, a small collection, or something larger?`,
      quickReplies: [
        "Single — one perfect song",
        "EP — 3 songs",
        "LP — 6 songs",
        "Full Album — 8+ songs",
        "Not sure yet",
      ],
    };
  }

  private handlePackage(
    lower: string,
    context: ConversationContext,
    fw: FormWalkState
  ): EngineResponse {
    let pkg = "Single";
    for (const [keyword, name] of Object.entries(PACKAGE_MAP)) {
      if (lower.includes(keyword)) {
        pkg = name;
        break;
      }
    }
    if (lower.includes("not sure")) pkg = "Single";

    fw.data.packageName = pkg;
    fw.step = "asking_story";
    context.setFormWalk(fw);

    return {
      text: `${pkg} — perfect. Last step: tell me the story. Who is this song for, and what should it make people feel when they hear it? The more you share, the better we can craft it.`,
    };
  }

  private handleStory(
    input: string,
    context: ConversationContext,
    fw: FormWalkState
  ): EngineResponse {
    fw.data.story = input.trim();
    fw.step = "complete";
    fw.active = false;
    context.setFormWalk(fw);

    // Build pre-filled URL
    const params = new URLSearchParams();
    if (fw.data.name)        params.set("name",    fw.data.name);
    if (fw.data.email)       params.set("email",   fw.data.email);
    if (fw.data.category)    params.set("service", fw.data.category);
    if (fw.data.packageName) params.set("package", fw.data.packageName);
    if (fw.data.story)       params.set("story",   fw.data.story);

    const href = `/contact?${params.toString()}`;

    return {
      text: `That's everything I need. I'm taking you to your pre-filled commission form now — just review the details and hit send.`,
      navigationCard: {
        label: "Open Your Pre-Filled Form",
        href,
        description: "All your details are ready",
        autoNavigate: true,
      },
    };
  }
}
