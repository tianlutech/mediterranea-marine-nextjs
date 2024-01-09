"use client";

import { useState, useEffect, useRef } from "react";
import BookingForm1 from "./partial/booking-form-1";
import BookingForm2 from "./partial/booking-form-2";
import PrepaymentModal from "@/components/modals/prepaymentModal";
import { Boat, Booking, DepartureTime, FormData } from "@/models/models";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { createTimeSlot, updateBookingInfo } from "@/services/notion.service";
import {
  SEABOB as SEABOB_TOY,
  STANDUP_PADDLE,
} from "@/models/constants";
import "../../i18n";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import SubmitButton from "../common/containers/submit-button";
import { validateAddress } from "@/services/google.service";
import { uploadFile } from "@/services/googleDrive.service";
import SumupWidget from "@/components/modals/sumupWidget";
import { generateCheckoutId } from "@/services/sumup.service";
import moment from "moment";
import TermsAndConditionModal from "@/components/modals/termsAndConditions";
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
  const [openPrepaymentModal, setOpenPrepaymentModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [openTermModal, setOpenTermModal] = useState<boolean>(false);
  const [checkoutId, setCheckoutId] = useState("");

  const [formData, setFormData] = useState<FormData>({
    "First Name": "",
    "Last Name": "",
    Email: "",
    "Billing Address": "",
    "No Adults": 0,
    "No Childs": 0,
    ID_Back_Picture: {} as File,
    ID_Front_Picture: {} as File,
    "Departure Time": "",
    SUP: "",
    SEABOB: "",
    "Fuel Payment": 0,
    Comments: "",
    "Restuarant Name": "",
    "Restaurant Time": "",
    signedContract: false,
    "ID Number": "",
  });

  const closePrepaymentModal = () => {
    setOpenPrepaymentModal(false);
  };

  const closeModalTermModal = () => {
    setOpenTermModal(false);
  };

  const storeIdImage = async (file: File, slag: string) => {
    const id = formData["ID Number"];
    const response = await uploadFile(file, boatInfo.Nombre, id, slag);
    if (!response.id) {
      return "";
    }
    const url = `https://drive.google.com/file/d/${response.id}/view`;
    return url;
  };

  const formik = useFormik({
    initialValues: formData,
    onSubmit: () => {
      submitBooking();
    },
  });

  useEffect(() => {
    setTotalPayment(
      +formData["Fuel Payment"] + +formData["SUP"] + +formData["SEABOB"]
    );
  }, [formData]);

  const updateNotion = async (formData: Record<string, unknown>) => {
    const [uploadIdFrontResponse, uploadIdBackImageResponse] =
      await Promise.all([
        storeIdImage(formData["ID_Front_Picture"] as File, "front"),
        storeIdImage(formData["ID_Back_Picture"] as File, "back"),
      ]);

    if (!uploadIdFrontResponse) {
      toast.error(t("error.upload_image"));
      setLoading(false);
      return;
    }

    if (!uploadIdBackImageResponse) {
      toast.error(t("upload_front_image"));
      setLoading(false);
      return;
    }

    const {
      ID_Back_Picture,
      ID_Front_Picture,
      SEABOB,
      SUP,
      signedContract,
      ...bookingData
    } = formData;

    // Upload the files and convert them in { name: '', url: '', type: "external"}
    const seaBobName =
      SEABOB_TOY.find((seabob) => seabob.value === SEABOB)?.name || "";

    const paddle = STANDUP_PADDLE.find((sup) => sup.value === SUP)?.name || "";
    const departureTime = moment(
      `${moment(data.Date).format("YYYY-MM-DD")} ${formData["Departure Time"]}`
    );

    const booking = new Booking({
      ...bookingData,
      Name: `${boatInfo.Nombre} - ${departureTime.format("DD-MM-YY HH:mm")}`,
      "ID Back Picture": uploadIdBackImageResponse,
      "ID Front Picture": uploadIdFrontResponse,
      Toys: [paddle, seaBobName].filter((value) => !!value),
      SubmittedFormAt: new Date(),
    });

    const res = await updateBookingInfo(id, booking);

    /**
     * Create a Time Slot so no one can book at the same time
     */
    createTimeSlot(
      new DepartureTime({
        Booking: [id],
        Boat: [boatInfo.id],
        Date: departureTime,
      })
    );
    setLoading(false);
    if (res === false) {
      return;
    }
    router.replace("/success");
  };

  const submitBooking = async () => {
    // validate address first
    const res = await validateAddress(formData["Billing Address"]);

    if (res === false) {
      return toast.error("The address is not accurate enougth");
    }

    if (+formData["No Adults"] + +formData["No Childs"] <= 0) {
      return toast.error(
        `Add number of passengers. Boat allows ${boatInfo["Max.Passengers"]} passengers`
      );
    }

    if (
      +formData["No Adults"] + +formData["No Childs"] >
      boatInfo["Max.Passengers"]
    ) {
      return toast.error(
        `You have exceeded the boat passengers. Boat allows ${boatInfo["Max.Passengers"]} passengers`
      );
    }
    saveModalRef.current?.start();
  };

  const getCheckoutId = async () => {
    const response = await generateCheckoutId(totalPayment.toString());
    if (!response) {
      return;
    }
    setCheckoutId(response.id);
    return response;
  };

  const handlePrepayment = (additionalPayment: number) => {
    setTotalPayment(additionalPayment);
    submitBooking();
  };

  const proceedToNotion = () => {
    setCheckoutId("");
    updateNotion(formData);
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
      />
      <div className="relative md:w-[77%] w-full md:p-6 p-2">
        <form onSubmit={formik.handleSubmit}>
          <div className="justify-between w-full ">
            <div className="md:flex justify-between w-full ">
              {/* first form */}
              <BookingForm1
                data={formData}
                boatInfo={boatInfo}
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
              loading={loading}
            />
          </div>
        </form>
      </div>
    </>
  );
}
