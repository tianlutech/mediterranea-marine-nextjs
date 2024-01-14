export const deleteUndefined = (list: any) => {
  Object.keys(list)
    .filter((key) => list[key] === undefined)
    .forEach((key) => delete list[key]);
};

export function cleanString(inputString: string) {
  // Define a regular expression pattern to match special characters
  const specialCharsRegex = /[^a-zA-Z0-9]/g;

  // Use the replace method to remove special characters from the input string
  const cleanedString = inputString
    .replace(specialCharsRegex, "")
    .replace("\n", "");

  return cleanedString;
}

export function compareStrings(stringA: string, stringB: string) {
  if (!stringA || !stringB) {
    return false;
  }

  const parsedA = cleanString(stringA).toLocaleLowerCase();
  const parsedB = cleanString(stringB).toLocaleLowerCase();

  return parsedB.includes(parsedA);
}
