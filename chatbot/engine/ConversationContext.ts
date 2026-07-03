import type { FormWalkState } from "./FormWalkEngine";

export interface Turn {
  role: "user" | "bot";
  text: string;
}

export class ConversationContext {
  private history: Turn[] = [];
  private variables: Map<string, string> = new Map();
  private maxTurns: number;
  private formWalk: FormWalkState = { active: false, step: null, data: {} };

  constructor(maxTurns = 20) {
    this.maxTurns = maxTurns;
  }

  addTurn(role: "user" | "bot", text: string) {
    this.history.push({ role, text });
    if (this.history.length > this.maxTurns * 2) {
      this.history = this.history.slice(-this.maxTurns * 2);
    }
  }

  getLastUserInput(): string {
    for (let i = this.history.length - 1; i >= 0; i--) {
      if (this.history[i].role === "user") return this.history[i].text;
    }
    return "";
  }

  getLastBotResponse(): string {
    for (let i = this.history.length - 1; i >= 0; i--) {
      if (this.history[i].role === "bot") return this.history[i].text;
    }
    return "";
  }

  set(key: string, value: string) {
    this.variables.set(key, value);
  }

  get(key: string): string {
    return this.variables.get(key) ?? "";
  }

  getHistory(): Turn[] {
    return [...this.history];
  }

  getFormWalk(): FormWalkState {
    return this.formWalk;
  }

  setFormWalk(state: FormWalkState) {
    this.formWalk = state;
  }

  reset() {
    this.history = [];
    this.variables.clear();
    this.formWalk = { active: false, step: null, data: {} };
  }
}
