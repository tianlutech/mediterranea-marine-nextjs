"use client";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState, useRef } from "react";
import { getBookingInfo, getBoatInfo } from "@/services/notion.service";
import { useRouter } from "next/navigation";
import { Boat, Booking, Captain } from "@/models/models";
import { useTranslation } from "react-i18next";
import { updateBookingInfo } from "@/services/notion.service";
import { getCaptains } from "@/services/notion.service";
import Spinner from "@/components/common/containers/spinner";
import BoatSvg from "@/assets/svgs/BoatSvg";
import NoSSR from "react-no-ssr";
import { createDocument } from "@/services/pdfMonkey.service";

export default function SignPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation();
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const [documentCreated, setDocumentCreated] = useState(false)

  useEffect(() => {
    const updateCaptainSignSignAt = async (booking: Booking, boatDetails: Boat, captainDetails: Captain) => {
      const bookingInfo = new Booking({
        captainSignedAt: new Date(),
      });
      const { error } = await updateBookingInfo(params.id, bookingInfo);

      if (error) {
        setError(error);
        return;
      }
      const res = await createDocument(booking, boatDetails, captainDetails)
      const { errors } = res
      if (errors?.length > 0) {
        setError(errors[0].detail)
        return
      }
      router.replace("/success");
    };

    const getBookingDetails = async () => {
      if (documentCreated) {
        return;
      }
      const data = (await getBookingInfo(params.id)) as Booking;

      if (!data || !data.Boat || !data.Date) {
        setError(t("error.error_booking_details"))
        return;
      }

      const [boatDetails] = await Promise.all([
        getBoatInfo(data.Boat[0]),
      ]);

      if (!boatDetails) {
        setError(t("error.error_boat_details"))
        return;
      }

      if (!data || !data.Captain) {
        setError(t("error.error_captain_details"))
        return
      }

      const getCaptain = async () => {
        const captainsData = await getCaptains();
        // I will change the any later 
        return captainsData.find((captain: any) => captain.id === data.Captain[0]);
      };

      const captainDetails = await getCaptain() as Captain

      if (!captainDetails) {
        setError(t("error.error_captain_details"))
        return;
      }

      // if (!isNaN(data.captainSignedAt?.getTime())) {
      //   return window.location.replace("/not-found?code=CSC-503");
      // }
      await updateCaptainSignSignAt(data, boatDetails, captainDetails);
      setDocumentCreated(true);
    };

    getBookingDetails();
  }, [params.id, t, router, documentCreated]);

  return (
    <NoSSR>
      <div className="relative p-2 w-full h-screen bg-white text-center flex flex-col items-center text-white justify-center">
        <div className="flex-col text-black">
          {!error ? (
            <>
              <div className="my-6">
                <span className="font-bold text-2xl">{t("signing.title")}</span>
              </div>
              <Spinner size={20}>
                <BoatSvg size={50} />
              </Spinner>
            </>
          ) : (
            <div className="my-6 mx-10">
              <span className="font-bold text-md">{error}</span>
            </div>
          )}
        </div>
      </div>
    </NoSSR>
  );
}
