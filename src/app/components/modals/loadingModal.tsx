"use client";
import Modal from "@/app/components/common/modal/modal";
import BoatSvg from "@/app/assets/svgs/BoatSvg";
import Spinner from "../common/buttons/spinner";

export default function LoadingModal({ isOpen }: { isOpen: boolean }) {
  return (
    <Modal isOpen={true}>
      <div className="flex items-center justify-center w-full h-full bg-white fixed top-0 left-0 z-50">
        <Spinner size={20}>
          <BoatSvg />
        </Spinner>
      </div>
    </Modal>
  );
}
