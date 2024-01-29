"use client";

import React from "react";
import Sidebar from "@/components/sidebar/sidebar";
import BookingComponent from "@/components/booking";
import { useEffect, useState } from "react";
import {
  getBookingInfo,
  getBoatInfo,
  getBookedTimeSlots,
} from "@/services/notion.service";
import LoadingModal from "@/components/modals/loadingModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { Booking, Boat } from "@/models/models";
import moment from "moment";
import { useTranslation } from "react-i18next";

const libraries = ["places"] as "places"[];

export default function BookingPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Booking | null>(null);
  const [boatInfo, setBoatInfo] = useState<Boat | null>(null);
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();

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
  }, [params.id, router]);

  if (apiKey === "") {
    router.replace("/not-found?code=GMFL-424");
    return null;
  }

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

  if (!isNaN(data.SubmittedFormAt.getTime())) {
    return window.location.replace("/not-found?code=ASB-409");
  }
  return (
    <>
      <ToastContainer />
      <section className="gradient-form justify-center h-screen w-full text-black">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="flex md:flex-row flex-col justify-between w-full lg:flex lg:flex-wrap h-screen">
            <Sidebar title={t("sidebar.boat_booking")} image={boatInfo.cover}>
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
            {/* forms section */}
            <BookingComponent data={data} id={params.id} boatInfo={boatInfo} />
          </div>
        </div>
      </section>
    </>
  );
}
