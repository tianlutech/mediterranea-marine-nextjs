import React, { useEffect, useState } from "react";
import Modal from "@/app/components/common/modal/modal";
import ReactPlayer from "react-player";

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
    if (!isOpen) {
      setPlaying(false); // Pause the video when the modal is closed
    } else {
      setPlaying(true); // Play the video when the modal is open
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} >
      <div className="relative p-2 md:w-[50%] w-[95%] bg-white rounded-lg shadow">
        <button onClick={() => closeModal()} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
        <div className="flex justify-center items-center">
          <ReactPlayer
            url={videoSrc}
            playing={playing}
            controls
          />
        </div>
      </div>
    </Modal>
  );
}
