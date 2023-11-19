"use client";
import UploadSvg from "@/app/assets/svgs/UploadSvg"
import ImageSvg from "@/app/assets/svgs/ImageSvg"

export default function CommonInputFile({ label }: { label: string }) {
  return (
    <div className="relative w-full mt-6 border border-gray-300 p-[0.7rem] px-6 rounded-lg">
      <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 top-[-0.6rem] bg-white left-4 px-2">{label}</label>
      <div className="flex mt-3">
        <div>
          <UploadSvg />
        </div>
        <div className="flex flex-col ml-4">
          <span className="text-black">Select a file or drag and drop here</span>
          <span className="greytext mt-2">JPG, PNG or PDF, file size no more than 10MB</span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 p-2 bg-bgColor1">
        <div className="flex justify-center items-center text-center">
          <div>
            <ImageSvg />
          </div>
          <span className="text-black text-center md:ml-4 ml-2 md:text-base text-xs">Passport back.png</span>
          <span className="text-black md:ml-4 ml-2 md:text-base text-xs text-center">Preview</span>
        </div>
        <span className="text-black md:text-base text-xs">5.7 MB</span>
      </div>
    </div>
  );
}
