"use client";

import { Boat, Booking } from "../../../models/models";
import React, {
  ForwardedRef,
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import PrepaymentModal from "@/components/modals/prepaymentModal";
import TermsAndConditionModal from "@/components/modals/termsAndConditions";
import { stepsActions, steps } from "./steps-actions";
import ProgressModal from "@/components/modals/ProgressModal";

const SaveBooking = forwardRef(function SaveBookingRef(
  {
    booking,
    boat,
    onCancel,
    onSuccess,
  }: {
    booking: Booking;
    boat: Boat;
    onCancel?: () => void;
    onSuccess?: () => void;
  },
  ref: ForwardedRef<{ start: () => void }>
) {
  const [step, setStep] = useState<string>("");
  const [modalInfo, setModalInfo] = useState({
    modal: "",
    message: "",
    error: "",
  });

  const nextStep = useCallback(
    (step: string) => {
      const index = steps.indexOf(step);
      if (index + 1 > steps.length) {
        onSuccess?.();
        return;
      }
      const newStep = steps[index + 1];
      setStep(newStep);
    },
    [onSuccess, setStep]
  );

  useEffect(() => {
    if (step === "") {
      return;
    }
    const stepObject = stepsActions({
      nextStep: () => nextStep(step),
      setModalInfo,
    });
    if (!stepObject[step]) {
      return;
    }
    stepObject[step].execute(booking, boat);
  }, [boat, booking, nextStep, step]);

  const cancel = () => {
    setModalInfo({ modal: "", message: "", error: "" });
    onCancel?.();
  };

  useImperativeHandle(ref, () => ({
    start: () => {
      setStep(steps[0]);
    },
  }));

  return (
    <>
      <ProgressModal
        isOpen={modalInfo.modal === "loading"}
        message={modalInfo.message}
        error={modalInfo.error}
      />
      <PrepaymentModal
        isOpen={modalInfo.modal === "fuel"}
        closeModal={() => cancel()}
        formData={booking}
        boat={boat}
        continuePayment={() => nextStep(step)}
      />
      <TermsAndConditionModal
        bookingInfo={booking}
        isOpen={modalInfo.modal === "sign"}
        closeModal={() => cancel()}
        boat={boat}
        onUserSigning={() => nextStep(step)}
      />
    </>
  );
});

export default SaveBooking;
