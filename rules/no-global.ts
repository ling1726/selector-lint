import { SelectorLintRule } from "../types.js";

type Messages = {
  fail: string;
};

export const noGlobal: SelectorLintRule<Messages> = {
  name: 'no-global',
  messages: {
    fail: 'This selector uses the global `*` selector',
  },
  executor: (context) => {
    const { tokenizedSelector } = context;
    const lookup = new Set(["class", "attribute", "id"]);
    for (const token of tokenizedSelector) {
      if (token.type === "combinator") {
        break;
      }

      if (token.type === 'pseudo-class' || token.type === 'pseudo-element') {
        continue;
      }

      if (!lookup.has(token.type)) {
        context.report('fail');
        return;
      }
    }
  },
};
