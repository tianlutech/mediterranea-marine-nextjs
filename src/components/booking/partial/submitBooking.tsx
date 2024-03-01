"use client";

import { Boat, Booking, BookingFormData } from "../../../models/models";
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
import { useTranslation } from "react-i18next";
import ConfirmModal from "@/components/modals/confirmModal";

const SaveBooking = forwardRef(function SaveBookingRef(
  {
    booking,
    boat,
    formData,
    setFormData,
    onCancel,
    onSuccess,
    bookingId,
    steps,
  }: {
    booking: Booking;
    boat: Boat;
    formData: BookingFormData;
    setFormData: any;
    onCancel?: () => void;
    onSuccess?: () => void;
    bookingId: string;
    steps: string[]
  },
  ref: ForwardedRef<{ start: () => void }>
) {
  const { t } = useTranslation();
  const [step, setStep] = useState<string>("");
  const [modalInfo, setModalInfo] = useState({
    modal: "",
    message: "",
    error: "",
  });

  const nextStep = useCallback(
    (step: string) => {
      const index = steps.indexOf(step);
      if (index + 1 >= steps.length) {
        onSuccess?.();
        setModalInfo({
          modal: "",
          message: "",
          error: "",
        });
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
      booking,
      bookingId,
      t,
    });
    if (!stepObject[step]) {
      return;
    }
    stepObject[step].execute(formData, boat);
  }, [boat, booking, bookingId, formData, nextStep, step, t]);

  const cancel = () => {
    setModalInfo({ modal: "", message: "", error: "" });
    setStep("");
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
        closeModal={() => cancel()}
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
        onError={(error) =>
          setModalInfo({
            modal: "loading",
            message: t("loadingMessage.processing_payment"),
            error,
          })
        }
        onSuccess={() => nextStep(step)}
      />
      <ConfirmModal
        isOpen={modalInfo.modal === "continueWithoutApproval"}
        message={modalInfo.message}
        error={modalInfo.error}
        onCancel={() => cancel()}
        onContinue={() => nextStep(step)}
      />
    </>
  );
});

export default SaveBooking;
