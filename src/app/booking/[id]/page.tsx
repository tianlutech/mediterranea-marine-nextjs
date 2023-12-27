"use client";

import Sidebar from "@/components/sidebar/sidebar";
import BookingComponent from "@/components/booking";
import { Suspense, useEffect, useState } from "react";
import {
  getBookingInfo,
  getBoatInfo,
  getBookedTimeSlots,
} from "@/services/notion.service";
import LoadingModal from "@/components/modals/loadingModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoadScript } from "@react-google-maps/api";
import router from "next/router";
import { Booking, DepartureTime } from "@/models/models";
import moment from "moment";

const libraries = ["places"] as "places"[];

export default function BookingPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [boatInfo, setBoatInfo] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(true);
  // will change to ours and put in env file

  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

  const { isLoaded: googleMapsLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });
  useEffect(() => {
    const getBookingDetails = async () => {
      const data = (await getBookingInfo(params.id)) as Booking;
      if (!data || !data.Boat || !data.Date) {
        router.replace("/");
        return;
      }

      const [boatDetails, timeSlots] = await Promise.all([
        getBoatInfo(data.Boat[0]),
        getBookedTimeSlots(data.Date),
      ]);

      if (!boatDetails) {
        router.replace("/");
        return;
      }

      boatDetails.bussySlots = timeSlots.map((timeSlot) =>
        moment(timeSlot.Date).format("HH:mm")
      );
      setBoatInfo(boatDetails);

      setData(data);
      setLoading(false);
    };

    getBookingDetails();
  }, [params.id]);

  if (!googleMapsLoaded || loading) {
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
      <ToastContainer />
      <section className="gradient-form justify-center h-screen w-full text-black">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="flex md:flex-row flex-col justify-between w-full lg:flex lg:flex-wrap h-screen">
            <Sidebar boatInfo={boatInfo} />
            {/* forms section */}
            <BookingComponent data={data} id={params.id} boatInfo={boatInfo} />
          </div>
        </div>
      </section>
    </>
  );
}
