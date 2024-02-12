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

export function convertCanvasToImage({ canvas, mime }: { canvas: HTMLCanvasElement, mime: string,}) {
  return new Promise<Blob | null>(resolve => {
    const tmpCanvas = document.createElement("canvas");
    // Use the original canvas's dimensions
    tmpCanvas.width = canvas.width;
    tmpCanvas.height = canvas.height;

    const ctx = tmpCanvas.getContext("2d");
    if (!ctx) {
      return resolve(null); // Safely handle the case where context could not be obtained
    }

    // Set the background to white
    ctx.fillStyle = "#FFFFFF"; // Define white color
    ctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height); // Fill the canvas with white

    // Draw the original canvas onto the temporary canvas without resizing
    ctx.drawImage(canvas, 0, 0);

    // Convert the temporary canvas to a Blob
    tmpCanvas.toBlob(blob => resolve(blob), mime);
  });
}