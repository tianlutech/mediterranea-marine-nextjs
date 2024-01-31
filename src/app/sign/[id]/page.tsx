"use client";

import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { getBookingInfo } from "@/services/notion.service";
import { useRouter } from "next/navigation";
import { Booking } from "@/models/models";
import { useTranslation } from "react-i18next";

export default function SignPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();

  const router = useRouter();

  useEffect(() => {
    const getBookingDetails = async () => {
      const data = (await getBookingInfo(params.id)) as Booking;
      if (!data || !data.Boat || !data.Date) {
        router.replace("/");
        return;
      }

      setData(data);
      setLoading(false);
    };

    getBookingDetails();
  }, [params.id, router]);

  if (!data) {
    return;
  }

  if (!isNaN(data.SubmittedFormAt.getTime())) {
    return window.location.replace("/not-found?code=CSC-503");
  }
  return (
    <div
      className="relative p-2 w-full h-screen bg-gray-300 text-center flex flex-col items-center text-white justify-center"
    >
      <div className="flex-col text-black">
        <div className="my-6">
          <span className="font-bold text-5xl">Signing Agreement...</span>
        </div>
      </div>
    </div>
  );
}
