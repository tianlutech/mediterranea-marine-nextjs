"use client";

import Sidebar from "@/app/components/sidebar/sidebar";
import Booking from "@/app/components/booking";
import { useEffect, useState } from "react";
import { getBookingInfo, getBoatInfo } from "@/app/services/notion.service"
import LoadingModal from "@/app/components/modals/loadingModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

export default function BookingPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>({});
  const [boatInfo, setBoatInfo] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(true)

  const getBookingDetails = async () => {
    await getBookingInfo(params.id).then((data: any) => {
      if (!data) {
        return
      }
      getBoatDetails(data)
      setData(data)
      setLoading(false)
    });
  }
  const getBoatDetails = async (data: any) => {
    await getBoatInfo(data.Boat[0]).then(data => {
      setBoatInfo(data)
    });
  }
  useEffect(() => {
    getBookingDetails()
  }, []);

  if (!data || !boatInfo) {
    return
  }
  return (
    <>
      <ToastContainer />
      <LoadingModal isOpen={loading} />
      <section className="gradient-form justify-center h-screen w-full text-black">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="flex md:flex-row flex-col justify-between w-full lg:flex lg:flex-wrap h-screen">
            <Sidebar boatInfo={boatInfo} />
            {/* forms section */}
            <Booking data={data} id={params.id} boatInfo={boatInfo} />
          </div>
        </div>
      </section>
    </>
  );
}