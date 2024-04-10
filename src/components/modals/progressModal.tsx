"use client";

import React from "react";
import Modal from "@/components/common/containers/modal";
import Spinner from "../common/containers/spinner";
import BoatSvg from "../../assets/svgs/BoatSvg";
import { useTranslation } from "react-i18next";

export default function ProgressModal({
  isOpen,
  message,
  error,
  closeModal,
}: {
  isOpen: boolean;
  message: string;
  error: string;
  closeModal: () => void;
}) {
  if (error) {
    return (
      <ErrorModal
        isOpen={isOpen}
        error={error}
        message={message}
        closeModal={closeModal}
      />
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={() => closeModal}>
      <div className="relative p-2 md:w-[50%] w-[95%] bg-white text-black rounded-lg shadow">
        <div className="flex justify-center items-center my-3">
          <span className="font-bold text-lg"> Processing</span>
        </div>
        <div className="flex justify-center items-center ">
          <div className="p-4 md:p-5">
            <Spinner size={10}>
              <BoatSvg size={30} />
            </Spinner>
            <div className="mt-6">
              <span className="mt-4 ">{message}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function ErrorModal({
  isOpen,
  error,
  message,
  closeModal,
}: {
  isOpen: boolean;
  message: string;
  error: string;
  closeModal: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={() => closeModal}>
      <div className="relative p-2 md:w-[50%] w-[95%] bg-white text-black rounded-lg shadow">
        <div className="flex justify-center items-center my-3">
          <span className="font-bold text-lg text-red-400"> Error</span>
        </div>
        <div className="flex justify-center items-center ">
          <div className="p-2">
            <div className="flex-col text-center">
              <div
                className=""
                dangerouslySetInnerHTML={{ __html: message }}
              ></div>
              <div
                className="mt-4"
                dangerouslySetInnerHTML={{ __html: error }}
              ></div>
              <button
                onClick={() => closeModal()}
                data-modal-hide="default-modal"
                type="button"
                className="text-black border border-bgColor2 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4"
              >
                {t("loadingMessage.close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
