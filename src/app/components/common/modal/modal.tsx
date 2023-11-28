"use client";
import Image from "next/image";
import Boat from "@/app/assets/boat.png";

export default function Modal({
  isOpen,
  closeModal,
  children
}: {
  isOpen: boolean;
  closeModal: any;
  children: React.ReactNode
}) {
  return (
    <div
      onClick={() => closeModal()}
      aria-hidden="true"
      className={`${isOpen ? "flex" : "hidden"} overflow-x-hidden fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-75 backdrop-filter`}
    >
      {children}
    </div>
  );
}
