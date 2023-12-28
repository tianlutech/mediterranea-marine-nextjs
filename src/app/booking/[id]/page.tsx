"use client";

import Sidebar from "@/components/sidebar/sidebar";
import BookingComponent from "@/components/booking";
import { useEffect, useState } from "react";
import { getBookingInfo, getBoatInfo } from "@/services/notion.service";
import LoadingModal from "@/components/modals/loadingModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoadScript } from "@react-google-maps/api";
import router from "next/router";
import { useTranslation } from "react-i18next";

export default function BookingPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>({});
  const [boatInfo, setBoatInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();

  // will change to ours and put in env file

  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

  const getBoatDetails = async (data: any) => {
    await getBoatInfo(data.Boat[0]).then((data) => {
      setBoatInfo(data);
    });
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });
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

  if (!isLoaded) {
    return;
  }
  return (
    <>
      <ToastContainer />
      <LoadingModal isOpen={loading} />
      <section className="gradient-form justify-center h-screen w-full text-black">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="flex md:flex-row flex-col justify-between w-full lg:flex lg:flex-wrap h-screen">
            <Sidebar image={boatInfo.cover}>
              <div className="px-4 py-4 text-textSecondaryColor lg:text-base text-sm">
                <p className="mb-6">
                  {t("sidebar.boat_booking")} {boatInfo?.Nombre}{" "}
                  {t("sidebar.reservation_form")}
                </p>
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
