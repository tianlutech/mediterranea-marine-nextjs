import Modal from "@/app/components/common/modal/modal";
import ReactPlayer from "react-player";

export default function VideoModal({
  isOpen,
  closeModal,
  videoSrc, // Add a prop for the video source
}: {
  isOpen: boolean;
  closeModal: () => void;
  videoSrc: string; // This should be the URL of the video
}) {
  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className="relative p-2 md:w-[50%] w-[95%] bg-white rounded-lg shadow">
        <div className="flex w- justify-center items-center">
          <ReactPlayer
            url={videoSrc}
            controls
          />
        </div>
      </div>
    </Modal>
  );
}
