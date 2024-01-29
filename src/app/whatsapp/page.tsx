"use client";

import Sidebar from "@/components/sidebar/sidebar";
import WhatsAppBulkMessagesForm from "@/components/whatsapp";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";

export default function WhatsappBulkMessages({
  params,
}: {
  params: { id: string };
}) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  return (
    <>
      {/*  here we will change with real message */}
      <Sidebar title={t("sidebar.whatsapp_form_title")}>
        <div
          className="p-4 text-black"
          dangerouslySetInnerHTML={{
            __html: message || "Upload a CSV and select a message",
          }}
        ></div>
      </Sidebar>
      <WhatsAppBulkMessagesForm
        renderMessage={(newMessage) => setMessage(newMessage)}
      />
    </>
  );
}
