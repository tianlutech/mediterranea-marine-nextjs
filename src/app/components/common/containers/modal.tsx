"use client";

import { ReactNode } from "react";

export default function Modal({
  isOpen,
  closeModal,
  childrens,
}: {
  isOpen: boolean;
  closeModal: any;
  childrens: ReactNode[];
}) {
  return (
    <div
      id="default-modal"
      onClick={() => closeModal()}
      aria-hidden="true"
      className={`${
        isOpen ? "flex" : "hidden"
      } overflow-x-hidden fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-75 backdrop-filter`}
    >
      {childrens}
    </div>
  );
}
