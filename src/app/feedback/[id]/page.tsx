"use client";

import Sidebar from "@/components/sidebar/sidebar";
import { getBookingInfo, getBoatInfo } from "@/services/notion.service";
import { useEffect, useState } from "react";
import router from "next/router";
import FeedbackForm from "@/components/feedback";

export default function UserFeedbackPage({
  params,
}: {
  params: { id: string };
}) {
  const [boatInfo, setBoatInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({});

  const getBoatDetails = async (data: any) => {
    await getBoatInfo(data.Boat[0]).then((data) => {
      setBoatInfo(data);
    });
  };

  useEffect(() => {
    const getBookingDetails = async () => {
      const data = await getBookingInfo(params.id);
      if (!data) {
        router.replace("/");

        return;
      }

      await getBoatDetails(data);
      setData(data);
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
            <Sidebar />
            <FeedbackForm data={data} setData={setData} boatInfo={boatInfo} />
          </div>
        </div>
      </section>
    </>
  );
}
