"use client";

import React from "react";
import Modal from "@/components/common/containers/modal";
import Button from "../common/buttons/Button";

export default function ConfirmModal({
  isOpen,
  message,
  onCancel,
  onContinue,
}: {
  isOpen: boolean;
  message?: string;
  onCancel: () => void;
  onContinue: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={() => onCancel}>
      <div className="relative p-2 md:w-[50%] w-[95%] bg-white text-black rounded-lg shadow">
        <div className="">
          <div className="p-4 md:p-5">
            <span className="flex text-center">{message}</span>
          </div>
          <div className="flex justify-center py-4">
            <Button onClick={() => onCancel()} className={"text-black mr-3"} message="Cancel" />
            <Button onClick={() => onContinue()} className={"ml-3 bg-buttonColor2 text-white"} message="Continue" />
          </div>
        </div>
      </div>
    </Modal>
  );
}