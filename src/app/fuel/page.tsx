"use client";

import Sidebar from "@/components/sidebar/sidebar";
import { getBookingInfo, getBoatInfo } from "@/services/notion.service";
import { useEffect, useState } from "react";
import router from "next/router";
import FuelForm from "@/components/fuel";
import { useTranslation } from "react-i18next";
import React from "react";

export default function PuttingFuel({ params }: { params: { id: string } }) {
  const { t } = useTranslation();

  return (
    <>
      {/*  here we will change with real message */}
      <Sidebar title={t("sidebar.putting_fuel_form")}>
        <div
          className="p-4 text-black"
          dangerouslySetInnerHTML={{
            __html: t("sidebar.fuel_sidebar"),
          }}
        />
      </Sidebar>
      <FuelForm />
    </>
  );
}
