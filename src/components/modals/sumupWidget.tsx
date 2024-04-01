import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/common/containers/modal";
import Script from "next/script";
import { toast } from "react-toastify";
import {
  PaymentBody,
  PaymentResponseBody,
  generateCheckoutId,
} from "@/services/sumup.service";
import { Booking, BookingFormData } from "@/models/models";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const handleScriptLoad = useCallback(
    (checkoutId: string) => {
      if (!checkoutId) {
        return;
      }
      window.SumUpCard?.mount({
        id: "sumup-card",
        checkoutId,
        onResponse: function (type: string, body: PaymentBody) {
          if (type === "sent") {
            return;
          }

          if (type === "success") {
            const bodyData = body as PaymentResponseBody;
            if (bodyData.status === "FAILED") {
              onError(
                t("error.error_sumup_payment") +
                  `ID #${bodyData.transaction_code}`
              );
              return;
            }
            onSuccess();
            return;
          }

          onError(t("error.error_sumup_payment") + `${JSON.stringify(body)}`);
        },
      });
    },
    [onError, t, onSuccess]
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
