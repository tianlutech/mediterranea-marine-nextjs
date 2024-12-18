import React, { useRef, useState, useCallback } from "react";
import UploadSvg from "@/assets/svgs/UploadSvg";
import PdfSvg from "@/assets/svgs/pdfSvg";
import { useTranslation } from "react-i18next";

export default function CommonUploadMultiplePictures({
  label,
  name,
  required,
  onChange,
  maxSize = 10,
  maxFiles = 0, // Keep 0 for unlimited files
}: {
  label: string;
  name: string;
  required: boolean;
  onChange: (files: File[] | null) => void;
  maxSize?: number;
  maxFiles?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<any[]>([]); // To store multiple files
  const { t } = useTranslation();

  const cancelFile = useCallback(() => {
    onChange(null);
    setFiles([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onChange]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fileSize = (file: File): number => {
    const fileSizeInBytes = file.size;
    const fileSizeInKilobytes = +(fileSizeInBytes / 1024).toFixed(1);
    const fileSizeInMegabytes = +(fileSizeInKilobytes / 1024).toFixed(1);

    return fileSizeInMegabytes;
  };

  const removeFile = useCallback(
    (fileToRemove: File) => {
      const updatedFiles = files.filter((file) => file !== fileToRemove);
      setFiles(updatedFiles);
      onChange(updatedFiles.length > 0 ? updatedFiles : null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [files, onChange]
  );

  const onChangeFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

      if (!!maxFiles && files.length + selectedFiles.length > maxFiles) {
        alert(t("input.max-files-error", { maxFiles }));
        return;
      }
      if (selectedFiles.length === 0) {
        return;
      }

      const previous = files.reduce((acc, file) => acc + fileSize(file), 0);
      const totalSize =
        previous + selectedFiles.reduce((acc, file) => acc + fileSize(file), 0);

      if (totalSize > maxSize) {
        alert(t("input.max-size-error", { size: maxSize }));
        return;
      }

      // Append new files to the existing list of files and update state
      const updatedFiles = [...files, ...selectedFiles];
      setFiles(updatedFiles);
      onChange(updatedFiles);
    },
    [maxFiles, files, maxSize, onChange, t]
  );

  const onClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="relative cursor-pointer">
      <div
        className="relative w-full mt-6 border border-gray-300 p-[0.7rem] px-6 rounded-lg"
        onClick={onClick}
      >
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
          multiple
          required={required}
        />
        <div>
          <div className="flex mt-2">
            <div>
              <UploadSvg />
            </div>
            <div className="flex flex-col ml-4">
              <span className="text-black">{t("input.select_file")}</span>
              <span className="text-gray-500 mt-2">
                {t("input.file_sizes", { size: maxSize })}
              </span>
              {!!maxFiles && (
                <span className="text-gray-500 mt-2">
                  {t("input.max_files", { maxFiles })}
                </span>
              )}
              <span className="text-gray-500">{t("input.accepted_file")}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="flex mt-2 justify-between items-center p-2 bg-gray-100"
          >
            <div className="flex justify-center items-center text-center">
              <div>
                {file.type === "application/pdf" ? (
                  <PdfSvg />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    width={20}
                    height={20}
                    src={URL.createObjectURL(file)}
                    alt="file-preview"
                  />
                )}
              </div>
              <span className="text-black text-center md:ml-4 ml-2 md:text-base text-xs">
                {file.name}
              </span>
              <span className="text-gray-500 text-xs ml-2 mr-1">
                {fileSize(file)}MB
              </span>
            </div>
            <button
              onClick={() => removeFile(file)}
              className="text-red-600 text-xs"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
