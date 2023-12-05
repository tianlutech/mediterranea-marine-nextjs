"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/app/components/common/modal/modal";
import ReloadSvg from "@/app/assets/svgs/ReloadSvg";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

export default function VideoModal({
  isOpen,
  closeModal,
  videoSrc,
}: {
  isOpen: boolean;
  closeModal: () => void;
  videoSrc: string;
}) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(isOpen); // Pause the video when the modal is closed
  }, [isOpen]);

  const closeModalView = () => {
    setPlaying(false);
    closeModal();
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="relative p-2 md:w-[50%] w-[95%] bg-white rounded-lg shadow">
        <button
          onClick={() => closeModalView()}
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="default-modal"
        >
          <ReloadSvg />
        </button>
        <div className="flex justify-center items-center">
          <ReactPlayer url={videoSrc} playing={playing} controls />
        </div>
      </div>
    </Modal>
  );
}
