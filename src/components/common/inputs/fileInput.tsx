"use client";
import UploadSvg from "@/assets/svgs/UploadSvg";
import ImageSvg from "@/assets/svgs/ImageSvg";
import CloseSvg from "@/assets/svgs/CloseSvg";
import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function CommonInputFile({
  label,
  name,
  required,
  onChange,
  onRemove,
}: {
  label: string;
  name: string;
  required?: boolean;
  onChange: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [photoFontSize, setPhotoFontSize] = useState<string>("");
  const [photoName, setPhotoName] = useState<string>("");

  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileSizeInBytes = file.size;
      const fileSizeInKilobytes: any = (fileSizeInBytes / 1024).toFixed(1);
      const fileSizeInMegabytes: any = (fileSizeInKilobytes / 1024).toFixed(1);

      setPhotoFontSize(
        fileSizeInMegabytes < 1
          ? `${fileSizeInKilobytes} KB`
          : `${fileSizeInMegabytes} MB`
      );

      setPhotoPreview(fileUrl);
      setPhotoName(file.name); // Assuming you want to keep the file name
      onChange(file);
    }
  };

  const removeImage = () => {
    onRemove();
    setPhotoFontSize("");
    setPhotoPreview("");
    setPhotoName("");
  };

  const onClick = (e: any) => {
    (inputRef.current as any).click();
  };
  return (
    <div className="relative cursor-pointer " onClick={onClick}>
      {photoPreview && (
        <div
          onClick={removeImage}
          className="absolute z-20 rounded-full bg-black w-5 bottom-11 right-4"
        >
          <CloseSvg />
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
          onChangeCapture={onChangeImage}
          accept="image/*"
          required={required}
        />
        <div>
          <div className="flex mt-6">
            <div>
              <UploadSvg />
            </div>
            <div className="flex flex-col ml-4">
              <span className="text-black">{t("input.select_file")}</span>
              <span className="greytext mt-2">{t("input.file_sizes")}</span>
            </div>
          </div>
          {photoName && (
            <div className="flex justify-between items-center mt-4 p-2 bg-bgColor1">
              <div className="flex justify-center items-center text-center">
                <div>
                  {photoPreview ? (
                    <Image
                      width={20}
                      height={20}
                      src={photoPreview}
                      alt="idFront"
                    />
                  ) : (
                    <ImageSvg />
                  )}
                </div>
                <span className="text-black text-center md:ml-4 ml-2 md:text-base text-xs">
                  {photoName}
                </span>
              </div>
              <span className="text-black md:text-base text-xs">
                {photoFontSize}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
