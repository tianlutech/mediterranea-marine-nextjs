"use client";

import { useState, useEffect, useRef } from "react";
import BookingForm1 from "./partial/booking-form-1";
import BookingForm2 from "./partial/booking-form-2";
import { Boat, Booking, BookingFormData } from "@/models/models";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import "../../i18n";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import SubmitButton from "../common/containers/submit-button";
import { validateAddress } from "@/services/google.service";
import SaveBooking from "./partial/submitBooking";

export default function BookingComponent({
  data,
  id,
  boatInfo,
}: {
  data: Booking;
  id: string;
  boatInfo: Boat;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const saveModalRef = useRef<{ start: () => void }>(null);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  const [formData, setFormData] = useState<BookingFormData>({
    "First Name": "",
    "Last Name": "",
    NotificationEmail: data.NotificationEmail,
    SumupCode: data.SumupCode || "",
    Date: data.Date as Date,
    "Billing Address": data["Billing Address"],
    "No Adults": data["No Adults"],
    "No Childs":data["No Childs"],
    ID_Back_Picture: {} as File,
    ID_Front_Picture: {} as File,
    "Departure Time": "",
    SUP: "",
    SEABOB: "",
    "Fuel Payment": -1,
    Comments: data.Comments,
    "Restaurant Name": "",
    "Restaurant Time": "",
    signedContract: false,
    "ID Number": data["ID Number"],
    documentType: "National ID",
    OutstandingPayment: data.OutstandingPayment || 0,
    CustomerSignature: "",
    DocumentsApproved: false,
  });

  const formik = useFormik({
    initialValues: formData,
    onSubmit: () => {
      submitBooking();
    },
  });

  useEffect(() => {
    setTotalPayment(Booking.totalPayment(formData));
  }, [formData]);

  const submitBooking = async () => {
    // validate address first
    const res = await validateAddress(formData["Billing Address"]);

    if (res === false) {
      return toast.error(t("error.error_address_not_accurate"));
    }

    if (+formData["No Adults"] + +formData["No Childs"] <= 0) {
      return toast.error(
        t("error.error_no_passengers",{passengers: boatInfo["Max.Passengers"]})
       );
    }

    if (
      +formData["No Adults"] + +formData["No Childs"] >
      boatInfo["Max.Passengers"]
    ) {
      return toast.error(
           t("error.error_max_passengers",{passengers: boatInfo["Max.Passengers"]})
      );
    }
    saveModalRef.current?.start();
  };

  if (!data || !formik) {
    return;
  }

  return (
    <>
      <SaveBooking
        ref={saveModalRef}
        formData={formData}
        setFormData={setFormData}
        boat={boatInfo}
        booking={formData as unknown as Booking}
        onSuccess={() => router.replace("/success")}
        bookingId={id}
        steps={[
          "fuel",
          "sign",
          "validateFront",
          "validateBack",
          "confirmContinue",
          "uploadFrontIdImage",
          "uploadBackIdImage",
          "pay",
          "saveData",
          "notifyCustomer",
        ]}
      />
      <div className="relative md:w-[77%] w-full md:p-6 p-2">
        <form onSubmit={formik.handleSubmit}>
          <div className="justify-between w-full ">
            <div className="md:flex justify-between w-full ">
              {/* first form */}
              <BookingForm1
                data={formData}
                setData={setFormData}
                formik={formik}
              />
              {/* Second form */}
              <BookingForm2
                data={formData}
                setData={setFormData}
                formik={formik}
                boatInfo={boatInfo}
              />
            </div>
             {/* terms and policy */}
            <div>
              <div className="mt-6">
                <div className="flex items-center">
                  <input
                    id="checked-checkbox"
                    type="checkbox"
                    value=""
                    required
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ms-2 text-sm cursor-pointer text-white">
                    {t("input.i_agree_with_the_privacy_policy")}
                  </label>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center">
                  <input
                    id="checked-checkbox"
                    type="checkbox"
                    required
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ms-2 text-sm text-white">
                    {t("input.guarantee_label")}
                  </label>
                </div>
              </div>
            </div>
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
    </>
  );
}
