import { jsPDF } from "jspdf";

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

export function convertCanvasToImage({
  canvas,
  mime,
}: {
  canvas: HTMLCanvasElement;
  mime: string;
}) {
  return new Promise<Blob | null>((resolve) => {
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
    tmpCanvas.toBlob((blob) => resolve(blob), mime);
  });
}

export function extractIdFromGoogleDriveLink(link: string) {
  var id = null;
  var match = link.match(/\/d\/([^/]+)/);
  if (match) {
    id = match[1];
  }
  return id;
}

export async function convertImagesToSeparatePdfs(
  images: File[]
): Promise<File[]> {
  try {
    const pdfFiles: File[] = await Promise.all(
      images.map(async (image) => {
        const pdf = new jsPDF();
        const imageData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });

        pdf.addImage(imageData, "JPEG", 10, 10, 180, 240);
        const pdfBlob = pdf.output("blob");
        return new File([pdfBlob], `${image.name.split(".")[0]}.pdf`, {
          type: "application/pdf",
        });
      })
    );

    return pdfFiles;
  } catch (error) {
    console.error("Error converting images to separate PDFs:", error);
    return [];
  }
}

export const driveIdToUrl = (id: string) => {
  return `https://drive.google.com/file/d/${id}/view`;
};
