"use client";

import Sidebar from "@/components/sidebar/sidebar";
import { getBookingInfo, getBoatInfo } from "@/services/notion.service";
import { useEffect, useState } from "react";
import router from "next/router";
import UploadBillForm from "@/components/uploadBill";
import { useTranslation } from "react-i18next";
import React from "react";

export default function UploadBill({ params }: { params: { id: string } }) {
  const { t } = useTranslation();

  return (
    <>
      {/*  here we will change with real message */}
      <Sidebar title={t("sidebar.upload_bill_form")}>
        <div
          className="p-4 text-black"
          dangerouslySetInnerHTML={{
            __html: t("sidebar.upload_bill_sidebar"),
          }}
        />
      </Sidebar>
      <UploadBillForm />
    </>
  );
}
