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
import {
  SEABOB_OFFER,
  MEDITERANEAN_SUPPORT_MARINA_EMAIL,
  MEDITERANEAN_SUPPORT_MARINA_PHONE,
  SEABOB,
  MEDITERANEAN_SUPPORT_MARINA_WHATSAPP,
} from "@/models/constants";
import CommonSelect from "@/components/common/inputs/selectInput";
import { getBookings } from "@/services/notion.service";
import moment from "moment";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative w-full mb-6 md:mb-0">{children}</div>;
};

const LIMIT_HOURS = 22;
export default function SeabobOfferForm({
  boatInfo,
  bookingId,
  bookingInfo,
}: {
  boatInfo: Boat;
  bookingId: string;
  bookingInfo: Booking;
}) {
  const timeOfferEnds = "22:00";
  const { t } = useTranslation();
  const [error, setError] = useState<string>("");
  const saveModalRef = useRef<{ start: () => void }>(null);
  const router = useRouter();
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [amountTotal, setAmountTotal] = useState(0);
  const [data, setData] = useState<Partial<BookingFormData>>({
    SEABOB: "",
  });
  const [filteredSeabobOffer, setFilteredSeabobOffer] = useState<
    Array<(typeof SEABOB_OFFER)[0]>
  >([]);
  const [currentTime, setCurrentTime] = useState<string>("");
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
      const bookings = await getBookings(bookingInfo.Date as Date);
      const toys: string[] = bookings.map((booking: Booking) =>
        booking.Toys?.join(", ")
      );

      if (moment(bookingInfo.Date).add(-2, "days").date() !== moment().date()) {
        return setError(t("message.offer_not_available"));
      }
      const totalSeabobs = getTotalToys(toys);
      if (toys.some((toy) => toy.includes("SEABOB")) || totalSeabobs >= 2) {
        return setError(t("message.offer_not_available"));
      }
      setAmountTotal(totalSeabobs);

      // There are only 2, maybe both are in offer o non is in offer
      setFilteredSeabobOffer(
        totalSeabobs == 1 ? [SEABOB_OFFER[0]] : SEABOB_OFFER
      );
    };
    const getTotalToys = (bookings: string[]) => {
      let totalToys = 0;
      for (const booking of bookings) {
        const match = booking.match(/^\d+/);
        if (match) {
          totalToys += parseInt(match[0], 10);
        }
      }
      return totalToys;
    };

    getBookingsSeabob();
  }, [bookingInfo, t]);

  useEffect(() => {
    const countdown = () => {
      const now = new Date();
      if (moment(now).format("HH:mm") === timeOfferEnds) {
        setError(t("error.offer_has_ended"));
        return;
      }

      const targetTime = moment().startOf("day").hours(LIMIT_HOURS).toDate();

      const difference = targetTime.getTime() - now.getTime();

      const seconds = Math.floor(difference / 1000);

      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

      setCurrentTime(
        `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
      );

      setTimeout(countdown, 1000);
    };

    countdown();
  }, [t]);

  if (!bookingInfo || !formik) {
    return;
  }

  const handleChangeSeabob = (e: any) => {
    setData({ ...data, SEABOB: e.target.value });
    setTotalPayment(e.target.value);
  };

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
        steps={["pay", "saveDataOnSeabobOffer", "notifyDavidAboutSeabobOffer"]}
      />
      <div className="flex md:w-[77%] w-full  justify-center items-center md:p-6 p-2">
        <div className="bg-white text-black md:w-[40%] w-full rounded-lg">
          {!error ? (
            <div>
              <p className="flex items-center justify-center mt-4 font-semibold md:text-xl text-sm">
                {t("title.seabob_offer_form")}
              </p>
              <div className="px-6">
                <p className="flex mt-4 text-sm">
                  {t("message.seabob_offer_email", {
                    NUM: 2 - amountTotal,
                    time: currentTime,
                  })}
                </p>

                <p className="flex mt-4 font-semibold md:text-xl text-sm">
                  {t("message.get_seabob_offer")}
                </p>
                <div className="flex mt-4 font-semibold md:text-xl text-sm">
                  <ReactPlayer
                    url={"https://www.youtube.com/watch?v=IKj0A5DDN0g"}
                    playing={true}
                    controls
                    muted={true}
                    style={{ width: 500 }}
                  />
                </div>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="md:p-6 sm:p-8 p-6">
                  <FormWrapper>
                    <CommonLabel input="select">
                      {" "}
                      {t("input.toy_seabob")}{" "}
                    </CommonLabel>
                    <CommonSelect
                      id="seabob"
                      name="seabob"
                      data={filteredSeabobOffer}
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
            <div className="my-6 mx-10 rounded-md p-2">
              <p className="font-bold text-md">{error}</p>
              <p className="pt-2">{t("offer.contact-us")}</p>
              <ul className="list-unstyled ml-4">
                <a href={`mailto:${MEDITERANEAN_SUPPORT_MARINA_EMAIL}`}>
                  {t("offer.email")}: {MEDITERANEAN_SUPPORT_MARINA_EMAIL}
                </a>
                <br />
                <a href={`tel:${MEDITERANEAN_SUPPORT_MARINA_PHONE}`}>
                  {t("offer.pjone")}: {MEDITERANEAN_SUPPORT_MARINA_PHONE}
                </a>
                <br />
                <a
                  href={`https://wa.me/${MEDITERANEAN_SUPPORT_MARINA_WHATSAPP}`}
                >
                  Whatsapp: {MEDITERANEAN_SUPPORT_MARINA_PHONE}
                </a>
                <br />
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
