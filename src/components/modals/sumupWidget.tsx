import { useState } from "react";
import Modal from "@/components/common/containers/modal";
import Script from "next/script";

export default function SumupWidget({
  isOpen,
  checkoutId,
  onClose,
  onPaid,
}: {
  isOpen: boolean;
  checkoutId: string;
  onClose: () => void;
  onPaid?: () => void;
}) {
  const handleScriptLoad = () => {
    window.SumUpCard?.mount({
      id: "sumup-card",
      checkoutId,
      onResponse: function (type: any, body: any) {
        console.log({ type, body });
        onPaid?.();
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

      <Modal isOpen={isOpen} onClose={() => onClose()}>
        <div id="sumup-card"></div>
      </Modal>
    </>
  );
}
