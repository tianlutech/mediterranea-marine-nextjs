"use client";

import Sidebar from "@/components/sidebar/sidebar";
import WhatsAppBulkMessagesForm from "@/components/whatsAppBulkMessagesForm";
import { useTranslation } from "react-i18next";
import React from "react";

export default function WhatsappBulkMessages({ params }: { params: { id: string } }) {
  const { t } = useTranslation();

  return (
    <>
      {/*  here we will change with real message */}
      <Sidebar title={t("sidebar.whatsapp_form_title")}>
        <div
          className="p-4 text-black"
          dangerouslySetInnerHTML={{
            __html: t("sidebar.fuel_sidebar"),
          }}
        />
      </Sidebar>
      <WhatsAppBulkMessagesForm />
    </>
  );
}