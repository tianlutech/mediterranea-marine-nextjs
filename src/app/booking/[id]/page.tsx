"use client";

import Sidebar from "@/app/components/sidebar/sidebar";
import Booking from "@/app/components/booking";
import { useEffect, useState } from "react";
import { fetchBookingDetails } from "@/app/services/booking.service"
import { fetchBoatDetails } from "@/app/services/boat.service";
import { getBookingInfo } from "@/app/services/notion.singleton"

export default function BookingPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>({});
  const [boatInfo, setBoatInfo] = useState<any>({})
  useEffect(() => {
    getBookingInfo(params.id).then(data => {
      console.log("=========data", data)
      setData(data)
    });
    fetchBoatDetails(params.id).then(data => {
      setBoatInfo(data)
    });
  }, [params]);

  return (
    <>
      <section className="gradient-form justify-center h-screen w-full text-black">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="flex md:flex-row flex-col justify-between w-full lg:flex lg:flex-wrap h-screen">
            <Sidebar boatInfo={boatInfo} />
            {/* forms section */}
            {data.booking && <Booking data={data.booking} id={params.id} boatInfo={boatInfo} />}
          </div>
        </div>
      </section>
    </>
  );
}
