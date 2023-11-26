"use client";

import Sidebar from "@/app/components/sidebar/sidebar";
import Booking from "@/app/components/booking";
import { useEffect, useState } from "react";
const fetchBookingDetails = async (id: string) => {
  const res = await fetch(`/api/bookingDetails/${id}`)
  const data = await res.json()

  return data
}
export default function BookingPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>({});
  useEffect(() => {
    fetchBookingDetails(params.id).then(data => {
      setData(data)
    });
  }, [params]);
  console.log("=====data", data)

  return (
    <>
      <section className="gradient-form justify-center h-screen w-full text-black">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="flex md:flex-row flex-col justify-between w-full lg:flex lg:flex-wrap h-screen">
            <Sidebar data={data} />
            {/* forms section */}
            {data.properties && <Booking data={data} id={params.id} />}
          </div>
        </div>
      </section>
    </>
  );
}
