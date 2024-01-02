"use client";

import React from "react";
import Sidebar from "../../../components/sidebar/sidebar";
import { getBookingInfo, getBoatInfo } from "../../../services/notion.service";
import { useEffect, useState } from "react";
import router from "next/router";
import FeedbackForm from "../../../components/feedback";
import { Boat, Booking } from "../../../models/models";
import LoadingModal from "../../../components/modals/loadingModal";
import { useTranslation } from "react-i18next";

export default function UserFeedbackPage({
  params,
}: {
  params: { id: string };
}) {
  const { t } = useTranslation();

  const [boatInfo, setBoatInfo] = useState<Boat | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Booking>();

  useEffect(() => {
    const getBookingDetails = async () => {
      const data = (await getBookingInfo(params.id)) as Booking;
      if (!data || !data.Boat || !data.Date) {
        router.replace("/");
        return;
      }
      const [boatDetails] = await Promise.all([getBoatInfo(data.Boat[0])]);

      if (!boatDetails) {
        router.replace("/");
        return;
      }

      setData(data);
      setBoatInfo(boatDetails);
      setLoading(false);
    };

    getBookingDetails();
  }, [params.id]);

  if (loading) {
    return (
      <>
        <LoadingModal isOpen={true} />
      </>
    );
  }

  if (!data || !boatInfo) {
    return;
  }
  return (
    <>
      <section className="gradient-form justify-center h-screen w-full text-black">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="flex md:flex-row text-black flex-col w-full lg:flex lg:flex-wrap h-screen">
            <Sidebar title={t("sidebar.feedback_form")}>
              <div
                className="p-4"
                dangerouslySetInnerHTML={{
                  __html: t("sidebar.feedback_sidebar"),
                }}
              />
            </Sidebar>
            <FeedbackForm data={data} id={params.id} boatInfo={boatInfo} />
          </div>
        </div>
      </section>
    </>
  );
}
