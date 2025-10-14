export function formatLatexEquation(latexString) {
  if (typeof latexString !== "string" || !latexString.trim()) {
    return "$$"; // Return empty delimiters for invalid input
  }

  const trimmedStr = latexString.trim();
  const firstDollarIndex = trimmedStr.indexOf("$");
  const lastDollarIndex = trimmedStr.lastIndexOf("$");

  // Case 1: No dollar signs found. Assume the whole string is an equation or text.
  // We will wrap the whole thing.
  if (firstDollarIndex === -1) {
    // If it looks like a command, leave it as is. Otherwise, wrap in \text{}.
    if (trimmedStr.includes("\\")) {
      return `$${trimmedStr}$`;
    }
    return `$\\text{${trimmedStr}}$`;
  }

  // Case 2: Malformed (only one dollar sign) or already perfectly formatted.
  if (
    firstDollarIndex === lastDollarIndex ||
    (firstDollarIndex === 0 && lastDollarIndex === trimmedStr.length - 1)
  ) {
    return trimmedStr;
  }

  // Case 3: Text exists outside the dollar sign delimiters.
  const prefix = trimmedStr.substring(0, firstDollarIndex).trim();
  const equation = trimmedStr
    .substring(firstDollarIndex + 1, lastDollarIndex)
    .trim();
  const suffix = trimmedStr.substring(lastDollarIndex + 1).trim();

  let finalEquationParts = [];

  if (prefix) {
    // Wrap the prefix in \text{}
    finalEquationParts.push(`\\text{${prefix} }`);
  }

  if (equation) {
    finalEquationParts.push(equation);
  }

  if (suffix) {
    // Wrap the suffix (e.g., units) in \text{}
    finalEquationParts.push(`\\text{ ${suffix}}`);
  }

  // Join the parts with spaces and wrap the entire result in dollar signs.
  return `$${finalEquationParts.join(" ")}$`;
}
