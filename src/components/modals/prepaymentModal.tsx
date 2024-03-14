"use client";
import Modal from "@/components/common/containers/modal";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import React from "react";
import { Booking } from "../../models/models";
import { MILE_RANGES } from "@/models/constants";
import { Boat, BookingFormData } from "../../models/models";
import CloseSvg from "@/assets/svgs/CloseSvg";
import Button from "../common/buttons/Button";
import RadioInput from "../common/inputs/radioInput";

export default function PrepaymentModal({
  isOpen,
  closeModal,
  boat,
  formData,
  setFormData,
  continuePayment,
}: {
  isOpen: boolean;
  closeModal: () => void;
  formData: BookingFormData;
  setFormData: any;
  boat: Boat;
  continuePayment: () => void;
}) {
  const { t } = useTranslation();
  const [fuelPrice, setFuelPrice] = useState(-1);
  const [payment, setPayment] = useState(Booking.totalPayment(formData));

  useEffect(() => {
    setPayment(Booking.totalPayment(formData) + Math.max(fuelPrice, 0));
  }, [formData, fuelPrice]);

  const proceedSubmission = () => {
    setFormData({ ...formData, "Fuel Payment": fuelPrice });
    continuePayment();
  };
  const calculatedMiles = useMemo(() => {
    const pricePerMile = boat.MilePrice || 0;
    return MILE_RANGES.map((miles: number) => ({
      label: miles
        ? `${miles}` +
        t(`input.${miles}_miles_description`)
        : t("input.continue_without_prepayment"),
      value: (miles * pricePerMile).toString(),
    }));
  }, [boat.MilePrice, t]);

  return (
    <Modal isOpen={isOpen} onClose={() => closeModal()}>
      <div className="relative md:w-[40%] w-[95%] px-8  bg-white rounded-lg shadow overflow-y-scroll pt-0 h-sm-[95%] h-md-[30%]">
        <div className="flex items-center justify-between px-4 pt-4 md:px-4 md:pt-4 sticky top-0 bg-white">
          <button
            onClick={() => closeModal()}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="default-modal"
          >
            <CloseSvg />
          </button>
        </div>
        <h3 className="text-xl font-semibold text-black mb-4">
          {t("prepayment_modal.prepay_your_fuel")}
        </h3>
        <div className="w-full flex md:flex-row flex-col text-justify">
          <div className="w-full flex flex-col justify-center">
            <span className="text-black md:text-base text-sm">
              <p className="mb-6">
                {t("prepayment_modal.prepayment_fuel_modal_p1")}
              </p>
            </span>
            <div>
              {calculatedMiles.map((item, index: number) => {
                return (
                  <div key={index}>
                    <RadioInput
                      id="prepayment-default-radio"
                      className="mb-4"
                      value={item.value}
                      inputName="prepaymen-radio"
                      label={item.label}
                      onChange={() => setFuelPrice(+item.value)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 md:p-5 border-gray-200  w-full">
          <Button
            message={t("prepayment_modal.back")}
            className={"text-black"}
            onClick={() => closeModal()}
          />
          <Button
            disabled={fuelPrice === -1}
            message={payment > 0 ? t("input.pay") + ` ${payment}€ ` : t("input.submit")}
            className={"text-white bg-buttonColor2"}
            onClick={() => proceedSubmission()}
          />
        </div>
      </div>
    </Modal>
  );
}
