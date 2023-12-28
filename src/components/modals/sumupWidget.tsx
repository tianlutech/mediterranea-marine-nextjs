import { useState } from "react";
import Modal from "@/components/common/containers/modal";
import Script from "next/script";
import { toast } from "react-toastify";

export default function SumupWidget({
  isOpen,
  checkoutId,
  onClose,
}: {
  isOpen: boolean;
  checkoutId: string;
  onClose: () => void;
}) {
  const handleScriptLoad = () => {
    window.SumUpCard?.mount({
      id: "sumup-card",
      checkoutId,
      onResponse: function (type: any, body: any) {
        if (type === "success") {
          onClose()
          return
        }
        if (type !== "sent" && type !== "success") {
          toast.error("Something went wrong")
          return
        }
        return;
      },
    });
  };
  return (
    <>
      {
        isOpen &&
        <Script
          src="https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js"
          strategy="afterInteractive"
          onLoad={handleScriptLoad}
        />
      }
      <Modal isOpen={isOpen} onClose={() => onClose()}>
        <div id="sumup-card"></div>
      </Modal>
    </>
  );
}
