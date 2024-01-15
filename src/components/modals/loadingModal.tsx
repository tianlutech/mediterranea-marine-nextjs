"use client";
import Modal from "@/components/common/containers/modal";
import BoatSvg from "../../assets/svgs/BoatSvg";
import Spinner from "@/components/common/containers/spinner";
import React from "react";

export default function LoadingModal({ isOpen }: { isOpen: boolean }) {
  return (
    <Modal isOpen={isOpen}>
      <div className="flex items-center justify-center w-full h-full bg-white fixed top-0 left-0 z-50">
        <Spinner size={20}>
          <BoatSvg size={50} />
        </Spinner>
      </div>
    </Modal>
  );
}
