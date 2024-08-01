import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/common/containers/modal";
import Script from "next/script";
import * as Sentry from "@sentry/nextjs";
import {
  PaymentBody,
  PaymentResponseBody,
  generateCheckoutId,
} from "@/services/sumup.service";
import { Booking, BookingFormData, getBookingName } from "@/models/models";
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
          if (type === "invalid") {
            Sentry.captureMessage(JSON.stringify({ type, body }))
            return;
          }
          if (type === "auth-screen") {
            return;
          }

          if (type === "success") {
            const bodyData = body as PaymentResponseBody;
            console.log({ bodyData })
            if (bodyData.status === "FAILED") {
              Sentry.captureMessage(JSON.stringify({ type, body }))
              onError(
                t("error.error_sumup_payment") + bodyData.transaction_code
                  ? `ID #${bodyData.transaction_code}`
                  : ""
              );
              return;
            }
            if (bodyData.status === "PAID") {
              formData.SumupCode = bodyData.transaction_code;
              onSuccess();
              return
            }

            return;
          }
          /**
          * Errors or unknown messages
          */
          Sentry.captureMessage(JSON.stringify({ type, body }))
          // Users cancel or time out
          if (type === "fail") {
            onError(t("error.error_sumup_payment") + `${JSON.stringify(body)}`);
            return;
          }


          if (type === "error") {

            onError(t("error.error_sumup_payment") + `${JSON.stringify(body)}`);
            return;
          }
          onError(
            t("error.sumup_unhandled_response") + `${JSON.stringify(body)}`
          );
        },
      });
    },
    [onError, t, onSuccess, formData]
  );
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const load = async () => {
      const payment = Booking.totalPayment(formData);
      const response = await generateCheckoutId({
        amount: payment.toString(),
        description: `APP - ${getBookingName(formData)}`,
      });
      if (response.error) {
        onError(t("error.error_sumup_payment") + response.error);
        return;
      }
      handleScriptLoad(response.id);
    };

    load();
  }, [formData, handleScriptLoad, isOpen, onError, t]);

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
