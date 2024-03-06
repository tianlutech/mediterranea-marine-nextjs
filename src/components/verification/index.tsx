"use client";

import CommonInput from "@/components/common/inputs/input";
import CommonInputFile from "@/components/common/inputs/fileInput";
import CommonLabel from "../common/containers/label";
import React from "react";
import { useTranslation } from "react-i18next";
import SubmitButton from "../common/containers/submit-button";
import { useState, useRef } from "react";
import { useFormik } from "formik";
import SaveBooking from "../booking/partial/submitBooking";
import { Booking, BookingFormData, Boat } from "@/models/models";
import { useRouter } from "next/navigation";
import RadioInput from "../common/inputs/radioInput";

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative md:w-[48%] w-full mb-6 md:mb-0">{children}</div>
  );
};

export default function VerificationForm({
  boatInfo,
  bookingId,
}: {
  boatInfo: Boat,
  bookingId: string
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

  const submitVerificationForm = async () => {
    saveModalRef.current?.start();
  };

  const formik = useFormik({
    initialValues: data,
    onSubmit: () => {
      submitVerificationForm();
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
        steps={["validateFront", "validateBack", "confirmContinue", "uploadFrontIdImage", "uploadBackIdImage", "saveDataOnValidation", "notifyCustomer"]}
      />
      <div className="flex md:w-[77%] w-full  justify-center items-center md:p-6 p-2">
        <div className="bg-white md:w-[70%] w-full rounded-lg">
          <p className="text-black flex items-center justify-center mt-4 font-semibold md:text-xl text-sm">
            {t("title.verification_form")}
          </p>
          <form onSubmit={formik.handleSubmit}>
            <div className="md:p-6 sm:p-8 p-6">
              <div className="flex justify-between w-full">
                <FormWrapper>
                  <CommonLabel input="text">
                    {t("input.first_name")}
                  </CommonLabel>
                  <CommonInput
                    type="text"
                    name="FirstName"
                    id="firstname"
                    placeholder={t("input.first_name")}
                    value={data["First Name"]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setData({ ...data, "First Name": e.target.value })
                    }
                    required={true}
                  />
                </FormWrapper>
                <FormWrapper>
                  <CommonLabel input="text">
                    {t("input.last_name")}
                  </CommonLabel>
                  <CommonInput
                    type="text"
                    name="Last Name"
                    id="lastname"
                    placeholder={t("input.last_name")}
                    value={data["Last Name"]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setData({ ...data, "Last Name": e.target.value })
                    }
                    required={true}
                  />
                </FormWrapper>
              </div>
              <div className="mt-6 flex items-baseline">
                <RadioInput
                  id="default-radio-1"
                  className="mb-4"
                  inputName="id-document-radio"
                  label={t("input.national_id")}
                  onChange={() => setData({ ...data, documentType: "National ID" })}
                  checked={data.documentType === "National ID"}
                  required={true}
                />
                <RadioInput
                  id="passport-default-radio-1"
                  className="ml-10"
                  inputName="passport-document-radio"
                  label={t("input.passport")}
                  onChange={() => setData({ ...data, documentType: "Passport" })}
                  checked={data.documentType === "Passport"}
                />
              </div>
              <div className="relative w-full mt-6">
                <CommonLabel input="text">
                  {t("input.id_number")}
                </CommonLabel>
                <CommonInput
                  type="text"
                  name="ID Number"
                  id="idnumber"
                  placeholder={t("input.id_number")}
                  value={data["ID Number"]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setData({ ...data, "ID Number": e.target.value })
                  }
                  required={true}
                />
              </div>
              <>
                <CommonInputFile
                  name="ID_Front_Picture"
                  label={t("input.ID_Front_Picture")}
                  onRemove={() => setData({ ...data, ID_Front_Picture: {} as File })}
                  onChange={async (file) => {
                    setData({ ...data, ID_Front_Picture: file || {} as File });
                  }}
                  required
                />
              </>
              {data.documentType === "National ID" && (
                <>
                  <CommonInputFile
                    name="ID_Back_Picture"
                    label={t("input.ID_Back_Picture")}
                    onRemove={() => setData({ ...data, ID_Back_Picture: {} as File })}
                    onChange={async (file) => {
                      setData({ ...data, ID_Back_Picture: file || {} as File });
                    }}
                    required
                  />
                </>
              )}
              <SubmitButton label="Submit" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}