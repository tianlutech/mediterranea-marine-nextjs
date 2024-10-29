import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import UploadSvg from "@/assets/svgs/UploadSvg";
import PdfSvg from "@/assets/svgs/pdfSvg";

const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const MARGIN = 40;

export default function PdfUploadComponent({
  label,
  name,
  required,
  onChange,
  onRemove,
  maxSize = 10,
}: {
  label: string,
  name: string,
  required: boolean,
  onChange: any,
  onRemove: () => void,
  maxSize?: number
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>(""); // Store file type here
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const cancelFile = () => {
    onChange(null);
    setPreview("");
    setFileName("");
    setFileSize("");
    setFileType("");
  };

  const convertImageToPdf = async (imageFile: File) => {
    return new Promise<File>((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        const pdf = new jsPDF("portrait", "pt", "a4");
        const imgWidth = A4_WIDTH - 2 * MARGIN;
        const imgHeight = (img.height / img.width) * imgWidth;
        pdf.addImage(img, "JPEG", MARGIN, MARGIN, imgWidth, imgHeight);

        const pdfBlob = pdf.output("blob");

        // Set file name to just the original name without extension, plus ".pdf"
        const originalNameWithoutExtension = imageFile.name.replace(/\.[^/.]+$/, "");
        const pdfFile = new File([pdfBlob], `${originalNameWithoutExtension}.pdf`, {
          type: "application/pdf",
        });
        resolve(pdfFile);
      };
      img.onerror = reject;
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

    setFileType(file.type); // Save file type

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

    return file; // Return the original file if not an image
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
    setFileType("");
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
                  {fileType === "application/pdf" ? (
                    <PdfSvg />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      width={20}
                      height={20}
                      src={preview}
                      alt="file-preview"
                    />
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
