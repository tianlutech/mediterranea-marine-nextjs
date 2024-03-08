"use client";

import CommonLabel from "../common/containers/label";
import React from "react";
import { useTranslation } from "react-i18next";
import SubmitButton from "../common/containers/submit-button";
import { useState, useRef } from "react";
import { useFormik } from "formik";
import SaveBooking from "../booking/partial/submitBooking";
import { Booking, BookingFormData, Boat } from "@/models/models";
import { useRouter } from "next/navigation";
import { SEABOB } from "@/models/constants";
import CommonSelect from "@/components/common/inputs/selectInput";

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative md:w-[48%] w-full mb-6 md:mb-0">{children}</div>
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

  const [data, setData] = useState<Partial<BookingFormData>>({
    "First Name": "",
    "Last Name": "",
    "ID Number": "",
    documentType: "National ID",
    ID_Front_Picture: {} as File,
    ID_Back_Picture: {} as File,
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
          "saveDataOnValidation",
        ]}
      />
      <div className="flex md:w-[77%] w-full  justify-center items-center md:p-6 p-2">
        <div className="bg-white md:w-[70%] w-full rounded-lg">
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
                  data={SEABOB}
                  value={data["SEABOB"]}
                  onChange={(e) => setData({ ...data, SEABOB: e.target.value })}
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
