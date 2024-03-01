"use client";

import { useEffect, useState } from "react";
import { getBookingInfo, getBoatInfo } from "@/services/notion.service";
import { useRouter } from "next/navigation";
import { Booking, Boat } from "@/models/models";
import VerificationForm from "@/components/verification";
import BookingInfoSidebar from "@/components/common/BookingInfoSideBar/BookingInfoSidebar";

export default function DocumentVerification({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<Booking | null>(null);
  const [boatInfo, setBoatInfo] = useState<Boat | null>(null);

  useEffect(() => {
    const getBookingDetails = async () => {
      const data = (await getBookingInfo(params.id)) as Booking;

      if (!data || !data.Boat || !data.Date) {
        router.replace("/");
        return;
      }

      const [boatDetails] = await Promise.all([
        getBoatInfo(data.Boat[0]),
      ]);

      if (!boatDetails) {
        router.replace("/");
        return;
      }

      setBoatInfo(boatDetails);

      setData(data);
    };

    getBookingDetails();
  }, [params.id, router]);

  if (!data || !boatInfo) {
    return;
  }

  return (
    <>
      <BookingInfoSidebar bookingInfo={data} boatInfo={boatInfo} />
      <VerificationForm boatInfo={boatInfo} bookingId={params.id} />
    </>
  );
}
