import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/common/containers/modal";
import Script from "next/script";
import { toast } from "react-toastify";
import { generateCheckoutId } from "@/services/sumup.service";
import { Booking, BookingFormData } from "@/models/models";

export default function SumupWidget({
  isOpen,
  onSuccess,
  onError,
  formData,
}: {
  isOpen: boolean;
  onSuccess: () => void;
  onError: (message: string) => void;
  formData: BookingFormData;
}) {
  const handleScriptLoad = useCallback(
    (checkoutId: string) => {
      if (!checkoutId) {
        return;
      }
      window.SumUpCard?.mount({
        id: "sumup-card",
        checkoutId,
        onResponse: function (type: any, body: any) {
          if (type === "sent") {
            return;
          }

          if (type === "success") {
            onSuccess();
            return;
          }
          if (type !== "success") {
            onError(body);
            return;
          }
          return;
        },
      });
    },
    [onSuccess, onError]
  );
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const load = async () => {
      const payment = Booking.totalPayment(formData);
      const response = await generateCheckoutId(payment.toString());
      if (!response) {
        return;
      }
      handleScriptLoad(response.id);
    };

    load();
  }, [formData, handleScriptLoad, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Script
        src="https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js"
        strategy="afterInteractive"
      />
      <Modal isOpen={isOpen}>
        <div id="sumup-card"></div>
      </Modal>
    </>
  );
}
