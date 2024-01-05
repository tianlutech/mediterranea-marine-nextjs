"use client";
import Image from "next/image";
import Boat from "@/assets/boat.png";
import Modal from "@/components/common/containers/modal";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import React from "react";

export default function PrepaymentModal({
  isOpen,
  closeModal,
  data,
  continuePayment,
}: {
  isOpen: boolean;
  closeModal: () => void;
  data: Array<{ value: string; label: string }>;
  continuePayment: (fuelPayment: number) => void;
}) {
  const { t } = useTranslation();
  const [payment, setPayment] = useState(
    +data["Fuel Payment"] + +data["SUP"] + +data["SEABOB"]
  );
  const [fuelPayment, setFuelPayment] = useState(0);

  useEffect(() => {
    setPayment(+data["Fuel Payment"] + +data["SUP"] + +data["SEABOB"]);
  }, [data]);

  const addFuel = (value: string) => {
    const fuelPrice = parseInt(value);
    setFuelPayment(fuelPayment);
    setPayment(payment + fuelPrice);
  };
  const proceedSubmission = () => {
    continuePayment(fuelPayment);
    closeModal();
  };
  return (
    <Modal isOpen={isOpen} onClose={() => closeModal()}>
      <div className="relative p-2 md:w-[60%] w-[95%] bg-white rounded-lg shadow overflow-y-scroll pt-0 h-sm-[95%] h-md-[30%]">
        <div className="flex items-center justify-between px-4 pt-4 md:px-4 md:pt-4 sticky top-0 bg-white">
          <h3 className="text-xl font-semibold text-black">
            {t("prepayment_modal.prepay_your_fuel")}
          </h3>
          <button
            onClick={() => closeModal()}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="default-modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
        <div className="w-full flex md:flex-row flex-col px-8">
          <div className="md:w-[50%] w-full flex flex-col justify-center">
            <span className="text-black md:text-base text-sm">
              <p className="mb-6">
                {t("prepayment_modal.prepayment_fuel_modal_p1")}
              </p>
              <p className="mb-6">
                {t("prepayment_modal.prepayment_fuel_modal_p2")}
              </p>
            </span>
            <div>
              {data.map((item, index: number) => {
                return (
                  <div key={index} className="flex mt-4 items-center mb-4">
                    <input
                      id="default-radio-2"
                      type="radio"
                      value={item.value}
                      name="default-radio"
                      onClick={() => addFuel(item.value)}
                      className="w-4 h-4"
                    />
                    <label className="ms-2 text-base text-black">
                      {item.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="md:w-[50%] w-full">
            {Boat && (
              <Image
                width={40}
                height={45}
                src={Boat}
                className="h-auto w-full"
                alt="boat"
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between p-4 md:p-5 border-gray-200 md:w-[50%] w-full">
          <button
            onClick={() => closeModal()}
            data-modal-hide="default-modal"
            type="button"
            className="text-black border border-bgColor2 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {t("prepayment_modal.back")}
          </button>
          <button
            onClick={() => proceedSubmission()}
            data-modal-hide="default-modal"
            type="button"
            className="text-white bg-buttonColor2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {payment > 0 ? t("input.pay") + ` ${payment}€ ` : t("input.submit")}
          </button>
        </div>
      </div>
    </Modal>
  );
}
