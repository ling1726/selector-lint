import postcss from "postcss";
import * as parsel from 'parsel-js';
import fs from 'fs';
import { noGlobal, complexAttribute } from './rules/index.js';
import { SelectorLintContext } from "./types.js";

function isAtRule(container: postcss.Container): container is postcss.AtRule {
  return container.type === 'atrule'
}

function isDocument(container: postcss.Container | postcss.Document): container is postcss.Document{
  return container.type === 'document'
}

export function lint(css: string) {
  const parsedCss = postcss.parse(css);
  const selectors: string[] = [];
  parsedCss.walkRules((rule) => {
    let cur: postcss.Container | postcss.Document | undefined = rule.parent;
    while (cur && !isDocument(cur)) {
      if (isAtRule(cur) && cur.name.includes('keyframes')) {
        return;
      }

      cur = cur.parent;
    }

    selectors.push(...rule.selector.split(','));
  });

  const rules = [noGlobal, complexAttribute];
  const errors: Record<string, Record<string, string[]>> = {};


  for(const selector of selectors) {
    let tokenizedSelector: parsel.Token[] = [];
    try {
      tokenizedSelector = parsel.tokenize(selector);
    } catch {
      errors['parse-selector'] ??= {};
      errors['parse-selector']['failed'] ??= [];
      errors['parse-selector']['failed'].push(selector);

      continue;
    }

    for(const rule of rules) {
      tokenizedSelector.reverse();
      const context: SelectorLintContext<string> = {
        selectorText: selector,
        tokenizedSelector,
        report: (messageId: string) => {
          errors[rule.name] ??= {};
          errors[rule.name][messageId] ??= [];
          errors[rule.name][messageId].push(selector);
        },
      }
      rule.executor(context);
    }
  }

  return errors;
}

export function lintFile(filePath: string) {
  const rawCss = fs.readFileSync(filePath).toString();
  return lint(rawCss);
}
