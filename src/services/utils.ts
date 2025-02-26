import { jsPDF } from "jspdf";
import imageCompression from "browser-image-compression";
import * as Sentry from "@sentry/nextjs";
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

export async function convertImagesToSeparatePdfs(image: File): Promise<File> {
  try {
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
  } catch (error) {
    console.error("Error converting images to separate PDFs:", error);
    return image;
  }
}

export const driveIdToUrl = (id: string) => {
  return `https://drive.google.com/file/d/${id}/view`;
};
export async function rotateImageIfNeeded(
  file: File,
  targetOrientation: "horizontal" | "vertical" = "vertical"
): Promise<File> {
  // Create image object and wait for it to load
  const img = await new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => resolve(img);
  });

  // Create canvas and rotate if needed
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const needsRotation =
    (targetOrientation === "vertical" && img.width > img.height) ||
    (targetOrientation === "horizontal" && img.height > img.width);

  if (!needsRotation) {
    return file;
  }

  // Swap width and height for rotation
  canvas.width = img.height;
  canvas.height = img.width;

  // Translate and rotate the context
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  // Convert data URL to Blob
  const dataUrl = canvas.toDataURL("image/jpeg");
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  // Create new File object
  return new File([blob], file.name, { type: "image/jpeg" });
}

export async function compressImageIfNeeded(
  file: File,
  maxSizeInMB: number = 0.5
): Promise<File> {
  // If file is smaller than maxSize or not an image, return original file
  if (
    file.size <= maxSizeInMB * 1024 * 1024 ||
    !file.type.startsWith("image/")
  ) {
    return file;
  }

  const options = {
    maxSizeMB: maxSizeInMB,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
    fileType: "image/jpeg",
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return new File(
      [compressedFile],
      file.name.replace(/\.[^/.]+$/, "") + "_compressed.jpg",
      { type: "image/jpeg" }
    );
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error compressing image:", error);
    return file;
  }
}
