"use client";
import Modal from "@/app/components/common/modal/modal"
import BoatSvg from "@/app/assets/svgs/BoatSvg";

export default function LoadingModal({
  isOpen,
}: {
  isOpen: boolean;
}) {
  return (
    <Modal isOpen={isOpen}>
      <div className="flex items-center justify-center w-full h-full fixed top-0 left-0 z-50">
        <div className="flex justify-center items-center">
          <div className="w-20 h-20 rounded-full animate-spin
              border-r-4 border-solid border-blue-400
              shadow-md">
          </div>
          <div className="absolute">
            <BoatSvg />
          </div>
        </div>
      </div>
    </Modal>
  );
}
