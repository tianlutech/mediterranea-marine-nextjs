import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import UploadSvg from "@/assets/svgs/UploadSvg";

// Standard A4 page dimensions in points (72 points = 1 inch)
const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const MARGIN = 40; // 40 points margin on all sides

export default function PdfUploadComponent({
  label,
  name,
  required,
  onChange,
  onRemove,
  maxSize = 10,
}: {
  label: string;
  name: string;
  required?: boolean;
  maxSize?: number;
  onChange: (file: File | null) => void;
  onRemove?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const cancelFile = () => {
    onChange(null);
    setPreview("");
    setFileName("");
    setFileSize("");
  };

  const calculateScaledDimensions = (imgWidth: number, imgHeight: number) => {
    const availableWidth = A4_WIDTH - (2 * MARGIN);
    const availableHeight = A4_HEIGHT - (2 * MARGIN);

    // Calculate scaling ratios
    const widthRatio = availableWidth / imgWidth;
    const heightRatio = availableHeight / imgHeight;

    // Use the smaller ratio to ensure image fits within margins
    const scale = Math.min(widthRatio, heightRatio);

    return {
      width: imgWidth * scale,
      height: imgHeight * scale
    };
  };

  const convertImageToPdf = async (imageFile: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const img = new Image();
          img.src = e.target?.result as string;

          await new Promise((res) => (img.onload = res));

          // Create PDF with A4 size
          const pdf = new jsPDF({
            orientation: "p", // Always portrait
            unit: "pt", // Use points for precise sizing
            format: "a4"
          });

          // Calculate scaled dimensions
          const { width, height } = calculateScaledDimensions(img.width, img.height);

          // Calculate centering offsets
          const xOffset = (A4_WIDTH - width) / 2;
          const yOffset = (A4_HEIGHT - height) / 2;

          // Add image to PDF with calculated dimensions and position
          pdf.addImage(
            img,
            "JPEG",
            xOffset,
            yOffset,
            width,
            height
          );

          const pdfBlob = pdf.output("blob");

          const convertedPdfFile = new File(
            [pdfBlob],
            `${imageFile.name.split(".")[0]}.pdf`,
            { type: "application/pdf" }
          );

          resolve(convertedPdfFile);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(imageFile);
    });
  };

  const handleFile = async (file: File) => {
    const fileSizeInBytes = file.size;
    const fileSizeInKilobytes = +(fileSizeInBytes / 1024).toFixed(1);
    const fileSizeInMegabytes = +(fileSizeInKilobytes / 1024).toFixed(1);

    if (fileSizeInMegabytes >= maxSize) {
      alert(`File size exceeds the limit of ${maxSize} MB.`);
      cancelFile();
      return null;
    }

    setFileSize(
      fileSizeInMegabytes < 1
        ? `${fileSizeInKilobytes} KB`
        : `${fileSizeInMegabytes} MB`
    );

    // If it's an image, convert to PDF
    if (file.type.startsWith("image/")) {
      setIsConverting(true);
      try {
        const pdfFile = await convertImageToPdf(file);
        setIsConverting(false);
        return pdfFile;
      } catch (error) {
        setIsConverting(false);
        alert("Error converting image to PDF. Please try again.");
        return null;
      }
    }

    return file;
  };

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) {
      cancelFile();
      return;
    }

    const processedFile = await handleFile(file);
    if (!processedFile) {
      cancelFile();
      return;
    }

    setPreview(
      file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : "/api/placeholder/100/140"
    );
    setFileName(processedFile.name);
    onChange(processedFile);
  };

  const removeFile = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onRemove?.();
    setFileSize("");
    setPreview("");
    setFileName("");
  };

  const onClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      {preview && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            removeFile();
          }}
          className="absolute z-20 rounded-full bg-black w-5 bottom-11 right-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      )}
      <div className="relative w-full mt-6 border border-gray-300 p-[0.7rem] px-6 rounded-lg">
        <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 top-[-0.6rem] bg-white left-4 px-2">
          {label}
        </label>
        <input
          ref={inputRef}
          name={name}
          type="file"
          style={{ opacity: 0, height: 1, width: 1, position: "absolute" }}
          onChange={onChangeFile}
          accept="application/pdf,image/*"
          required={required}
        />
        <div>
          <div className="flex mt-6">
            <div>
              <UploadSvg />
            </div>
            <div className="flex flex-col ml-4">
              <span className="text-black">Select File</span>
              <span className="text-gray-500 mt-2">
                File size limit: {maxSize} MB
              </span>
              <span className="text-gray-500">
                Accepted formats: PDF, Images (JPG, PNG, etc.)
              </span>
            </div>
          </div>
          {isConverting && (
            <div className="mt-4 text-blue-600">
              Converting image to PDF...
            </div>
          )}
          {fileName && (
            <div className="flex justify-between items-center mt-4 p-2 bg-gray-100">
              <div className="flex justify-center items-center text-center">
                <div>
                  {preview ? (
                    <img
                      width={20}
                      height={20}
                      src={preview}
                      alt="file-preview"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-black text-center md:ml-4 ml-2 md:text-base text-xs">
                  {fileName}
                </span>
              </div>
              <span className="text-black md:text-base text-xs">{fileSize}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}