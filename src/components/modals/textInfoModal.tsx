"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/common/containers/modal";
import ReloadSvg from "@/assets/svgs/ReloadSvg";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

export default function TextInfoModal({
  closeModal,
  text,
}: {
  closeModal: () => void;
  text: string;
}) {
  return (
    <Modal isOpen={!!text} onClose={() => closeModal()}>
      <div className="relative p-2 md:w-[50%] w-[95%] bg-white rounded-lg shadow">
        <button
          onClick={() => closeModal()}
          type="button"
          className="absolute top-2 left-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="default-modal"
        >
          <ReloadSvg />
        </button>
        <div className="flex justify-center items-center p-8">
          <span dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      </div>
    </Modal>
  );
}
