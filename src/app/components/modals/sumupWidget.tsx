import { useState } from "react";
import Modal from "@/app/components/common/containers/modal";
import Script from "next/script";

export default function SumupWidget({
  isOpen,
  checkoutId,
}: {
  isOpen: boolean;
  checkoutId: string;
}) {
  const [isScriptLoaded, setScriptLoaded] = useState(false);

  const handleScriptLoad = () => {
    window.SumUpCard?.mount({
      id: "sumup-card",
      checkoutId,
      onResponse: function (type: any, body: any) {
        return;
      },
    });
  };
  if (!isOpen) {
    return null
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
