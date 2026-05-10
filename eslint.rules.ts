import { type Rule } from "eslint";

export const rules: Rule.RuleModule = {
  create({ report, sourceCode }) {
    return {
      ArrowFunctionExpression(node) {
        if (node.expression && node.body.type === "ObjectExpression") {
          const bodyText = sourceCode.getText(node.body);

          const before = sourceCode.getTokenBefore(node.body);
          const after = sourceCode.getTokenAfter(node.body);

          let [start, end] = node.body.range!;

          if (before?.value === "(" && after?.value === ")") {
            start = before.range[0];
            end = after.range[1];
          }

          report({
            fix: (fixer) =>
              fixer.replaceTextRange(
                [start, end],
                `{\n  return ${bodyText};\n}`,
              ),
            message: "Avoid implicit object returns.",
            node,
          });
        }
      },
    };
  },
  meta: { fixable: "code", schema: [], type: "suggestion" },
};
