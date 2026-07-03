import { ConversationContext } from "./ConversationContext";

export interface RawResponse {
  text: string;
  navigationCard?: NavigationCard;
  leadCapture?: boolean;
  quickReplies?: string[];
}

export interface NavigationCard {
  label: string;
  href: string;
  description?: string;
  autoNavigate?: boolean;
}

export class ResponseBuilder {
  build(
    template: string,
    context: ConversationContext,
    variables?: Record<string, string>
  ): RawResponse {
    let text = template;

    // Replace context variables: {get:key}
    text = text.replace(/\{get:(\w+)\}/g, (_, key: string) => context.get(key));

    // Replace inline variables: {var:key}
    if (variables) {
      text = text.replace(
        /\{var:(\w+)\}/g,
        (_, key: string) => variables[key] ?? ""
      );
    }

    text = text.replace(/\{botName\}/g, "The Atelier Concierge");

    return { text };
  }
}
