/**
 * Detects specific JSON objects within a string and splits the string into an array,
 * separating the text content from the JSON objects.
 *
 * @param {string} inputString The string to parse, which may contain text and JSON objects.
 * @returns {string[]} An array where text segments object and valid JSON object are separate elements.
 */
export function splitByJson(inputString) {
  if (typeof inputString !== "string") {
    console.error("Input must be a string.");
    return [];
  }

  const result = [];
  let lastIndex = 0;
  let currentIndex = 0;

  while (currentIndex < inputString.length) {
    // Find the starting brace of a potential JSON object
    const startIndex = inputString.indexOf("{", currentIndex);

    if (startIndex === -1) {
      // No more potential JSONs, add the remainder of the string and exit
      if (lastIndex < inputString.length) {
        result.push(inputString.substring(lastIndex));
      }
      break;
    }

    // From the starting brace, find the matching closing brace
    let openBraces = 1;
    let endIndex = -1;
    for (let i = startIndex + 1; i < inputString.length; i++) {
      const char = inputString[i];
      if (char === "{") {
        openBraces++;
      } else if (char === "}") {
        openBraces--;
      }

      if (openBraces === 0) {
        endIndex = i;
        break;
      }
    }

    if (endIndex !== -1) {
      // A complete {...} block was found. Now check if it's the target JSON format.
      const potentialJsonStr = inputString.substring(startIndex, endIndex + 1);
      let isTargetJson = false;

      try {
        const jsonObj = JSON.parse(potentialJsonStr);
        // Validate if the parsed object matches the required structure
        if (
          jsonObj &&
          typeof jsonObj === "object" &&
          jsonObj.name &&
          jsonObj.parameters &&
          typeof jsonObj.parameters === "object"
        ) {
          isTargetJson = true;
        }
      } catch (e) {
        // The block is not valid JSON, so it's treated as regular text.
        isTargetJson = false;
      }

      if (isTargetJson) {
        // This is a valid JSON object we want to extract.
        // 1. Add the text segment before this JSON object.
        if (startIndex > lastIndex) {
          result.push(inputString.substring(lastIndex, startIndex));
        }
        // 2. Add the JSON object itself.
        result.push(JSON.parse(potentialJsonStr));

        // 3. Update our position in the string to continue searching after this JSON object.
        lastIndex = endIndex + 1;
        currentIndex = endIndex + 1;
      } else {
        // This was not the target JSON, so treat it as text and continue searching
        // from the character after the opening brace we found.
        currentIndex = startIndex + 1;
      }
    } else {
      // No matching closing brace was found, so the rest of the string is text.
      if (lastIndex < inputString.length) {
        result.push(inputString.substring(lastIndex));
      }
      break;
    }
  }

  // generate key for each element
  for (let i = 0; i < result.length; i++) {
    if (typeof result[i] === "string") {
      result[i] = { type: "text", text: result[i] };
    } else if (typeof result[i] === "object") {
      result[i] = { type: "jsonObj", jsonObj: result[i] };
    }
  }

  return result;
}
