"use client";
import Image from "next/image";
import EmailImage from "@/app/assets/email 1.png"
export default function SuccessModal({ isOpen, closeModal }: { isOpen: boolean, closeModal: any }) {
  return (
    <div id="default-modal"
      onClick={() => closeModal()}
      aria-hidden="true"
      className={`${isOpen ? "flex" : "hidden"} overflow-y-auto overflow-x-hidden fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-75 backdrop-filter`}>
      <div style={{ background: "linear-gradient(180deg, #262D46 0%, #B07E50 100%)" }} className="relative p-2 md:w-[60%] w-[95%] bg-white text-center flex flex-col items-center text-white justify-center rounded-lg shadow">
        <Image
          width={60}
          height={45}
          src={EmailImage}
          className="w-30 flex justify-center items-center"
          alt="email"
        />
        <div className="flex-col">
          <div className="my-6">
            <span className="font-bold text-5xl">Thank You !</span>
          </div>
          <div>
            <span>Your submission has been received.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
