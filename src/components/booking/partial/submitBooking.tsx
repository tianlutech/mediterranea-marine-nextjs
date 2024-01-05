"use client";
import Modal from "@/components/common/containers/modal";
import BoatSvg from "@/assets/svgs/BoatSvg";
import Spinner from "../../common/containers/spinner";
import { Boat, Booking } from "../../../models/models";
import React, { useCallback, useEffect, useState } from "react";
import PrepaymentModal from "@/components/modals/prepaymentModal";
import TermsAndConditionModal from "@/components/modals/termsAndConditions";
import { stepsActions, steps } from "./steps-actions";
import ProgressModal from "@/components/modals/ProgressModal";

export default function SaveBooking({
  onInit,
  booking,
  boat,
  onCancel,
  onSuccess,
}: {
  onInit: (onClickSave: () => void) => void;
  booking: Booking;
  boat: Boat;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<string>("sign");
  const [modalInfo, setModalInfo] = useState({ modal: "", message: "" });
  const [number, setNumber] = useState(0);

  const nextStep = useCallback(
    (step) => {
      const index = steps.indexOf(step);
      if (index + 1 > steps.length) {
        onSuccess();
        return;
      }
      const newStep = steps[index + 1];
      setStep(newStep);
    },
    [onSuccess, setStep]
  );

  useEffect(() => {
    stepsActions[step]({
      nextStep: () => nextStep(step),
      setModalInfo,
    }).execute(booking, boat);
  }, [boat, booking, nextStep, step]);

  const cancel = () => {
    setModalInfo({ modal: "", message: "" });
    onCancel();
  };

  useEffect(() => {
    onInit(() => {
      setModalInfo({ message: "", modal: "" });
      setStep(steps[0]);
    });
  }, [onInit]);

  return (
    <>
      <ProgressModal
        isOpen={modalInfo.modal === "loading"}
        message={modalInfo.message}
      />
      <PrepaymentModal
        isOpen={modalInfo.modal === "fuel"}
        closeModal={cancel()}
        data={booking}
        continuePayment={() => nextStep(step)}
      />
      <TermsAndConditionModal
        isOpen={modalInfo.modal === "sign"}
        closeModal={cancel()}
        data={booking}
        onUserSigning={() => nextStep(step)}
      />
    </>
  );
}
