"use client";

import { useRouter, useSearchParams } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import DangerSvg from "@/assets/svgs/DangerSvg";
import { useTranslation } from "react-i18next";
import { Error_Codes } from "@/models/constants";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const searchCode = searchParams.get("code") || "";
  const { t } = useTranslation();

  const errorCode = Error_Codes.find((code) => code === searchCode) || "GMFL-400";

  const goHome = () => {
    window.location.href = "https://mediterraneamarine.com";
  };

  return (
    <div className="relative p-2 w-full h-screen bg-gray-300 text-center flex flex-col items-center text-white justify-center">
      <DangerSvg />
      <div className="flex-col text-black">
        <div className="my-6">
          <span className="font-bold text-3xl">{t(`error.${errorCode}`)}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => goHome()}
        className="mt-6 text-white bg-buttonColor focus:ring-4 font-semibold rounded-lg text-lg px-10 py-3"
      >
        Go to home
      </button>
    </div>
  );
}