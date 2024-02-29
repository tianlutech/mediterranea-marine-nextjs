"use client";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState, useRef } from "react";
import {
  getBookingInfo,
  getBoatInfo,
} from "@/services/notion.service";
import { useRouter } from "next/navigation";
import { Booking } from "@/models/models";
import { useTranslation } from "react-i18next";
import { updateBookingInfo } from "@/services/notion.service";
import Spinner from "@/components/common/containers/spinner";
import BoatSvg from "@/assets/svgs/BoatSvg";
import NoSSR from "react-no-ssr";

export default function VerifyDocument({ params }: { params: { id: string } }) {
  const { t } = useTranslation();
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const id = useRef(params.id);
  useEffect(() => {
    const updateDocumentVerified = async () => {
      const bookingInfo = new Booking({
        DocumentsApproved: true,
      });
      const { error } = await updateBookingInfo(id.current, bookingInfo);

      if (error) {
        setError(error);
        return;
      }

      router.replace("/success");
    };

    const getBookingDetails = async () => {
      const data = (await getBookingInfo(id.current)) as Booking;

      if (!data || !data.Boat || !data.Date) {
        setError(t("error.error_booking_details"));
        return;
      }

      const boatDetails = await getBoatInfo(data.Boat[0])

      if (!boatDetails) {
        setError(t("error.error_boat_details"));
        return;
      }

      await updateDocumentVerified();
    };

    getBookingDetails();
  }, [id, t, router]);

  return (
    <NoSSR>
      <div className="relative p-2 w-full h-screen bg-white text-center flex flex-col items-center text-white justify-center">
        <div className="flex-col text-black">
          {!error ? (
            <>
              <div className="my-6">
                <span className="font-bold text-2xl">{t("verifyDocument.title")}</span>
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
