"use client";

import React from "react";
import Modal from "@/components/common/containers/modal";
import Spinner from "../common/containers/spinner";
import BoatSvg from "../../assets/svgs/BoatSvg";
import { useTranslation } from "react-i18next";

export default function ConfirmModal({
  isOpen,
  message,
  onCancel,
  onContinue,
}: {
  isOpen: boolean;
  message?: string;
  onCancel: () => void;
  onContinue: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={() => onCancel}>
      <div className="relative p-2 md:w-[50%] w-[95%] bg-white text-black rounded-lg shadow">
        <div className="">
          <div className="p-4 md:p-5">
            <span className="flex text-center">{message}</span>
          </div>
          <div className="flex justify-center py-4">
            <button onClick={() => onCancel()} data-modal-hide="default-modal" type="button" className="mr-6 text-black border border-bgColor2 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Cancel</button>
            <button onClick={() => onContinue()} data-modal-hide="default-modal" type="button" className="ml-6 text-white bg-buttonColor2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Continue</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}