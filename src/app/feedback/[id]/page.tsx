"use client";

import Sidebar from "@/components/sidebar/sidebar";
import { getBookingInfo, getBoatInfo } from "@/services/notion.service";
import { useEffect, useState } from "react";
import router from "next/router";
import FeedbackForm from "@/components/feedback";
import { Boat, Booking } from "@/models/models";

export default function UserFeedbackPage({ params }: { params: { id: string } }) {
  const [boatInfo, setBoatInfo] = useState<Boat | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const getBookingDetails = async () => {
      const data: Booking | undefined = await getBookingInfo(params.id);
      if (!data) {
        router.replace("/");
        return;
      }

      const boatInformation = await getBoatInfo(data.Boat[0]);
      setData(data);
      setBoatInfo(boatInformation)
      setLoading(false);
    };

    getBookingDetails();
  }, [params.id]);

  if (!data || !boatInfo) {
    return;
  }
  return (
    <>
      <section className="gradient-form justify-center h-screen w-full text-black">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="flex md:flex-row flex-col w-full lg:flex lg:flex-wrap h-screen">
            <Sidebar boatInfo={boatInfo} />
            <FeedbackForm data={data} setData={setData} boatInfo={boatInfo} />
          </div>
        </div>
      </section>
    </>
  );
}