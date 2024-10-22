import React, { useRef, useState } from "react";

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
  const [pdfPreview, setPdfPreview] = useState<string>("");
  const [pdfSize, setPdfSize] = useState<string>("");
  const [pdfName, setPdfName] = useState<string>("");

  const cancelFile = () => {
    onChange(null);
    setPdfPreview("");
    setPdfName("");
    setPdfSize("");
  };

  const onChangePdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) {
      cancelFile();
      return;
    }

    const fileSizeInBytes = file.size;
    const fileSizeInKilobytes = +(fileSizeInBytes / 1024).toFixed(1);
    const fileSizeInMegabytes = +(fileSizeInKilobytes / 1024).toFixed(1);

    if (fileSizeInMegabytes >= maxSize) {
      alert(`File size exceeds the limit of ${maxSize} MB.`);
      cancelFile();
      return;
    }

    setPdfSize(
      fileSizeInMegabytes < 1
        ? `${fileSizeInKilobytes} KB`
        : `${fileSizeInMegabytes} MB`
    );
    setPdfPreview("/api/placeholder/100/140"); // Use a placeholder image for PDF preview
    setPdfName(file.name);
    onChange(file);
  };

  const removePdf = () => {
    if (inputRef.current) {
      inputRef.current.value = ""; // This will reset the input value
    }
    onRemove?.();
    setPdfSize("");
    setPdfPreview("");
    setPdfName("");
  };

  const onClick = (e: any) => {
    (inputRef.current as any).click();
  };

  return (
    <div className="relative cursor-pointer" onClick={(e) => onClick(e)}>
      {pdfPreview && (
        <div
          onClick={removePdf}
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
          onChange={(e) => onChangePdf(e)}
          accept="application/pdf"
          required={required}
        />
        <div>
          <div className="flex mt-6">
            <div>
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
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </div>
            <div className="flex flex-col ml-4">
              <span className="text-black">Select File</span>
              <span className="text-gray-500 mt-2">
                File size limit: {maxSize} MB
              </span>
            </div>
          </div>
          {pdfName && (
            <div className="flex justify-between items-center mt-4 p-2 bg-gray-100">
              <div className="flex justify-center items-center text-center">
                <div>
                  {pdfPreview ? (
                    <img
                      width={20}
                      height={20}
                      src={pdfPreview}
                      alt="pdf-preview"
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
                  {pdfName}
                </span>
              </div>
              <span className="text-black md:text-base text-xs">{pdfSize}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}