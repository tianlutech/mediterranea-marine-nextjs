"use client";

import Sidebar from "@/components/sidebar/sidebar";
import { getBookingInfo, getBoatInfo } from "@/services/notion.service";
import { useEffect, useState } from "react";
import router from "next/router";
import FeedbackForm from "@/components/feedback";
import { Boat, Booking } from "@/models/models";
import LoadingModal from "@/components/modals/loadingModal";

export default function UserFeedbackPage({
  params,
}: {
  params: { id: string };
}) {
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
          <div className="flex md:flex-row flex-col w-full lg:flex lg:flex-wrap h-screen">
            <Sidebar />
            <FeedbackForm data={data} boatInfo={boatInfo} />
          </div>
        </div>
      </section>
    </>
  );
}
