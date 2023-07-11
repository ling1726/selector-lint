import { Token } from "parsel-js";
export interface TokenizedSelector {
  selectorText: string;
  tokens: Token[];
}

type Test = { foo: string; bar: string };
type Test2 = keyof Test;

export type SelectorLintRuleExecutor<TMessages extends Record<string, string>> =
  (
    context: SelectorLintContext<keyof TMessages>
  ) => void;

export interface SelectorLintContext<
  TMessageId extends string | number | symbol
> {
  selectorText: string;
  tokenizedSelector: Token[];
  report: (messageId: TMessageId) => void;
}

export interface SelectorLintRule<TMessages extends Record<string, string>> {
  name: string;
  executor: SelectorLintRuleExecutor<TMessages>;
  messages: TMessages;
}
