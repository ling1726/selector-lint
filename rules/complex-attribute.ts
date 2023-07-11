import { SelectorLintRule } from "../types.js";

type Messages = {
  fail: string;
};

export const complexAttribute: SelectorLintRule<Messages> = {
  name: 'complex-attribute',
  messages: {
    fail: 'This attribute selector is too complex',
  },
  executor: (context) => {
    const { report, tokenizedSelector } = context;
    for (const token of tokenizedSelector) {
      if (token.type !== "attribute") {
        continue;
      }

      if (token.operator && token.operator !== '=') {
        report('fail');
      }

    }
  },
};
