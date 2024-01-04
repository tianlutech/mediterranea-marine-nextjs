"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/common/containers/modal";
import Spinner from "../common/containers/spinner";
import BoatSvg from "../../assets/svgs/BoatSvg";

export default function ProcessingModal({
  isOpen,
}: {
  isOpen: boolean;
}) {

  return (
    <Modal isOpen={false}>
      <div className="relative p-2 md:w-[50%] w-[95%] bg-white text-black rounded-lg shadow">
        <div className="flex justify-center items-center my-3">
          <span className="font-bold text-lg"> Processing</span>
        </div>
        <div className="flex justify-center items-center ">
          <div className="p-4 md:p-5">
            <Spinner size={10}>
              <BoatSvg />
            </Spinner>
            <div className="mt-6">
              <span className="mt-4 ">Uploading Id front</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
