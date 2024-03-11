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
import { getBookingInfo } from "@/services/notion.service";

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full mb-6 md:mb-0">{children}</div>
  );
};

export default function SeabobOfferForm({
  boatInfo,
  bookingId,
}: {
  boatInfo: Boat;
  bookingId: string;
}) {
  const { t } = useTranslation();
  const saveModalRef = useRef<{ start: () => void }>(null);
  const router = useRouter();
  const [payment, setPayment] = useState<number>(0);

  useEffect(() => {
    const getBookingDetails = async () => {
      const data = (await getBookingInfo(
        bookingId
      )) as Booking;

      if (!data || !data.Boat || !data.Date) {
        router.replace("/");
        return;
      }
      setData(data);
    };

    getBookingDetails();
  }, [bookingId, router]);

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

  if (!data || !formik) {
    return;
  }

  const handleChangeSeabob = (e: any) => {
    setData({ ...data, SEABOB: e.target.value })
  }

  return (
    <>
      <SaveBooking
        ref={saveModalRef}
        formData={data as BookingFormData}
        setFormData={setData}
        boat={boatInfo}
        booking={data as unknown as Booking}
        onSuccess={() => router.replace("/success")}
        bookingId={bookingId}
        steps={[
          "pay",
          "saveDataOnSeabobOffer",
          "notifyDavidAboutSeabobOffer"
        ]}
      />
      <div className="flex md:w-[77%] w-full  justify-center items-center md:p-6 p-2">
        <div className="bg-white md:w-[40%] w-full rounded-lg">
          <p className="text-black flex items-center justify-center mt-4 font-semibold md:text-xl text-sm">
            {t("title.seabob_offer_form")}
          </p>
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
              <SubmitButton label="Submit" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
