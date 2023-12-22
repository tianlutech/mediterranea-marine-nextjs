"use client";
import Modal from "@/app/components/common/containers/modal";
import Script from "next/script";

export default function SumupWidget({ isOpen }: { isOpen: boolean }) {
  return (
    <>
      <Script
        src="https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js"
        strategy="afterInteractive"
        onLoad={() => {
          // This will run after the script has loaded
          window.SumUpCard?.mount({
            id: "sumup-card",
            checkoutId: "1dc0237c-ef01-4576-829e-2e35b12201bd",
            onResponse: function (type: any, body: any) {
              console.log("Type", type);
              console.log("Body", body);
            },
          });
        }}
      />
      <Modal isOpen={isOpen}>
        <div id="sumup-card"></div>
      </Modal>
    </>
  );
}
