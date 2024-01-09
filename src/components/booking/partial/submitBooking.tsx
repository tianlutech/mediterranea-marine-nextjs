"use client";

import { Boat, Booking, FormData } from "../../../models/models";
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
import ProgressModal from "../../modals/progressModal";
import SumupWidget from "@/components/modals/sumupWidget";

const SaveBooking = forwardRef(function SaveBookingRef(
  {
    booking,
    boat,
    formData,
    setFormData,
    onCancel,
    onSuccess,
    bookingId,
  }: {
    booking: Booking;
    boat: Boat;
    formData: FormData;
    setFormData: any;
    onCancel?: () => void;
    onSuccess?: () => void;
    bookingId: string
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
      booking: booking,
      bookingId,
    });
    if (!stepObject[step]) {
      return;
    }
    stepObject[step].execute(formData, boat);
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
        boat={boat}
        continuePayment={() => nextStep(step)}
        formData={formData}
        setFormData={setFormData}
      />
      <TermsAndConditionModal
        bookingInfo={booking}
        isOpen={modalInfo.modal === "sign"}
        closeModal={() => cancel()}
        boat={boat}
        formData={formData}
        setFormData={setFormData}
        onUserSigning={() => nextStep(step)}
      />
      <SumupWidget
        isOpen={modalInfo.modal === "pay"}
        formData={formData}
        onSuccess={() => nextStep(step)}
      />
    </>
  );
});

export default SaveBooking;
