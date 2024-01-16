"use client";

import "react-toastify/dist/ReactToastify.css";
import DangerSvg from "@/assets/svgs/DangerSvg"

export default function errorPage() {
  const message = "There has been an error!"
  const goHome = () => {
    window.location.href = "https://mediterraneamarine.com/";
  };
  return (
    <div
      className="relative p-2 w-full h-screen bg-slate-300 text-center flex flex-col items-center text-white justify-center"
    >
      <DangerSvg />
      <div className="flex-col text-black">
        <div className="my-6">
          <span className="font-bold md:text-5xl text-2xl">{message}</span>
        </div>
        <button
          type="button"
          onClick={() => goHome()}
          className="mt-6 text-white bg-buttonColor focus:ring-4 font-semibold rounded-lg text-lg px-10 py-3 outilien"
        >
          Go to home
        </button>
      </div>
    </div>
  );
}
