"use client";
import Modal from "@/components/common/containers/modal";
import BoatSvg from "../../assets/svgs/BoatSvg";
import Spinner from "@/components/common/containers/spinner";
import React from "react";

export default function SendingWhatsAppModal({
  isOpen,
  message,
}: {
  isOpen: boolean;
  message: string;
}) {
  return (
    <Modal isOpen={isOpen}>
      <div className="relative p-2 md:w-[40%] w-[95%] bg-white text-center flex flex-col items-center text-white justify-center rounded-lg shadow">
        <div className="flex-col text-black">
          <div className="my-6">
            <span className="font-bold text-xl">Sending Message</span>
          </div>
          <div>
            <span>{message}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
