"use client";

import CommonLabel from "../common/containers/label";
import React from "react";
import { useTranslation } from "react-i18next";
import SubmitButton from "../common/containers/submit-button";
import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import SaveBooking from "../booking/partial/submitBooking";
import { Booking, BookingFormData, Boat } from "@/models/models";
import { useRouter } from "next/navigation";
import { SEABOB_OFFER } from "@/models/constants";
import CommonSelect from "@/components/common/inputs/selectInput";
import { getBookingInfo, getBookings } from "@/services/notion.service";
import moment from "moment";

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full mb-6 md:mb-0">{children}</div>
  );
};

export default function SeabobOfferForm({
  boatInfo,
  bookingId,
  bookingInfo,
}: {
  boatInfo: Boat;
  bookingId: string;
  bookingInfo: Booking,
}) {
  const { t } = useTranslation();
  const timeOfferEnds = "22:00"
  const [error, setError] = useState<string>("");
  const saveModalRef = useRef<{ start: () => void }>(null);
  const router = useRouter();
  const [totalPayment, setTotalPayment] = useState<number>(0)
  const [data, setData] = useState<Partial<BookingFormData>>({
    SEABOB: ""
  });



  const submitSeabobOfferForm = async () => {
    saveModalRef.current?.start();
  };

  const formik = useFormik({
    initialValues: data,
    onSubmit: () => {
      submitSeabobOfferForm();
    },
  });

  useEffect(() => {
    const getBookingsSeabob = async () => {
      const bookings = await getBookings(bookingInfo.Date as Date)
      const toys: string[] = bookings.map((booking: Booking) => booking.Toys?.join(", "))
      const totalSeabobs = getTotalToys(toys);
      if (toys.includes("3 SEABOB") || totalSeabobs >= 2) {
        return setError(t("message.offer_not_available"))
      }
    }
    const getTotalToys = (bookings: string[]) => {
      let totalToys = 0;
      for (const booking of bookings) {
        const match = booking.match(/^\d+/);
        if (match) {
          totalToys += parseInt(match[0], 10);
        }
      }
      return totalToys;
    }

    getBookingsSeabob()
  }, [bookingInfo, t])

  if (!bookingInfo || !formik) {
    return;
  }

  const handleChangeSeabob = (e: any) => {
    setData({ ...data, SEABOB: e.target.value })
    setTotalPayment(e.target.value)
  }

  let currentTime

  const countdownTo22 = () => {
    const now = new Date();
    if (moment(now).format("HH:mm") === timeOfferEnds) {
      setError("It's currently 22:00. The offer has ended.")
      return
    }

    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0);

    const difference = targetTime.getTime() - now.getTime();

    if (difference <= 0) {
      console.log("Target time has already passed for today. Countdown for tomorrow will begin shortly.");
      return;
    }

    const seconds = Math.floor(difference / 1000);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    currentTime = `${formattedHours}:${formattedMinutes}`
    setTimeout(countdownTo22, 1000);
  }

  countdownTo22()
  return (
    <>
      <SaveBooking
        ref={saveModalRef}
        formData={data as BookingFormData}
        setFormData={setData}
        boat={boatInfo}
        booking={bookingInfo as unknown as Booking}
        onSuccess={() => router.replace("/success")}
        bookingId={bookingId}
        steps={[
          "pay",
          "saveDataOnSeabobOffer",
          "notifyDavidAboutSeabobOffer"
        ]}
      />
      <div className="flex md:w-[77%] w-full  justify-center items-center md:p-6 p-2">
        <div className="bg-white text-black md:w-[40%] w-full rounded-lg">
          {!error ? (
            <div>
              <p className="flex items-center justify-center mt-4 font-semibold md:text-xl text-sm">
                {t("title.seabob_offer_form")}
              </p>
              <div className="px-6">
                <p className="flex items-center justify-center mt-4 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: t("message.seabob_offer_email", {
                      currentTime,
                    }),
                  }}
                />
                <p className="flex mt-4 font-semibold md:text-xl text-sm">
                  {t("message.get_seabob_offer")}
                </p>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="md:p-6 sm:p-8 p-6">
                  <FormWrapper>
                    <CommonLabel
                      input="select"
                    >
                      {" "}
                      {t("input.toy_seabob")}{" "}
                    </CommonLabel>
                    <CommonSelect
                      id="seabob"
                      name="seabob"
                      data={SEABOB_OFFER}
                      value={data["SEABOB"]}
                      onChange={(e) => handleChangeSeabob(e)}
                      required
                    />
                  </FormWrapper>
                  <SubmitButton
                    label={
                      totalPayment > 0
                        ? t("input.pay") + ` ${totalPayment}€ `
                        : t("input.submit")
                    }
                  />
                </div>
              </form>
            </div>
          ) : (
            <div className="my-6 mx-10">
              <span className="font-bold text-md">{error}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
