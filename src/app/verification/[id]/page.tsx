"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar/sidebar";
import { getBookingInfo, getBoatInfo } from "@/services/notion.service";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Booking, Boat } from "@/models/models";
import VerificationForm from "@/components/verification";

export default function DocumentVerification({ params }: { params: { id: string } }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [data, setData] = useState<Booking | null>(null);
  const [boatInfo, setBoatInfo] = useState<Boat | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getBookingDetails = async () => {
      const data = (await getBookingInfo(params.id)) as Booking;

      if (!data || !data.Boat || !data.Date) {
        router.replace("/");
        return;
      }

      const [boatDetails] = await Promise.all([
        getBoatInfo(data.Boat[0]),
      ]);

      if (!boatDetails) {
        router.replace("/");
        return;
      }

      setBoatInfo(boatDetails);

      setData(data);
      setLoading(false);
    };

    getBookingDetails();
  }, [params.id, router]);

  if (!data || !boatInfo) {
    return;
  }

  return (
    <>
      <Sidebar title={t("sidebar.document_verification")} image={boatInfo.cover}>
        <div className="px-4 py-4 text-textSecondaryColor lg:text-base text-sm">
          <p
            dangerouslySetInnerHTML={{
              __html: t("sidebar.booking_info", {
                boat: boatInfo.Nombre,
                date: moment(data.Date).format("DD/MM/YY"),
                payment: data.OutstandingPayment || 0,
                location: data.BoatLocation[0],
              }),
            }}
          />
          <br />
          <p className="mb-6">
            {t(
              "sidebar.we_are_excited_to_help_you_plan_your_next_water_adventure"
            )}
          </p>
          <p className="mb-6">{t("sidebar.sidebar_p1")}</p>
          <p className="mb-6">{t("sidebar.sidebar_p2")}</p>
        </div>{" "}
      </Sidebar>
      <VerificationForm bookingDetails={data} boatInfo={boatInfo} bookingId={params.id} />
    </>
  );
}
