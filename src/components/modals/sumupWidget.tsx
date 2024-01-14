import { useEffect, useState } from "react";
import Modal from "@/components/common/containers/modal";
import Script from "next/script";
import { toast } from "react-toastify";
import { generateCheckoutId } from "@/services/sumup.service";
import { BookingFormData } from "@/models/models";

export default function SumupWidget({
  isOpen,
  onSuccess,
  formData,
}: {
  isOpen: boolean;
  onSuccess: () => void;
  formData: BookingFormData;
}) {
  const [checkoutId, setCheckoutId] = useState("");
  const payment =
    +formData["Fuel Payment"] + +formData["SUP"] + +formData["SEABOB"];

  const getCheckoutId = async (payment: number) => {
    const response = await generateCheckoutId(payment.toString());
    if (!response) {
      return;
    }
    setCheckoutId(response.id);
    return response;
  };

  useEffect(() => {
    getCheckoutId(payment);
  }, [payment]);

  const handleScriptLoad = () => {
    window.SumUpCard?.mount({
      id: "sumup-card",
      checkoutId,
      onResponse: function (type: any, body: any) {
        if (type === "success") {
          onSuccess();
          return;
        }
        if (type !== "sent" && type !== "success") {
          toast.error("Something went wrong");
          return;
        }
        return;
      },
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Script
        src="https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <Modal isOpen={isOpen}>
        <div id="sumup-card"></div>
      </Modal>
    </>
  );
}
