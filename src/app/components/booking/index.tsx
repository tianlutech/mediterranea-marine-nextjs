"use client";

import { useState, useEffect } from "react";
import BookingForm1 from "./partial/booking-form-1";
import BookingForm2 from "./partial/booking-form-2";
import PrepaymentModal from "@/app/components/modals/prepaymentModal";
import { Boat, Booking } from "@/app/models/models";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { updateBookingInfo } from "@/app/services/notion.service";
import {
  MILE_RANGES,
  SEABOB as SEABOB_TOY,
  STANDUP_PADDLE,
} from "@/app/models/constants";
import "../../i18n";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import SubmitButton from "../common/containers/submit-button";
import { validateAddress } from "@/app/services/google.service";
import { uploadFile } from "@/app/services/googleDrive.service";

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
  const [openPrepaymentModal, setOpenPrepaymentModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [proceedWithNoFuel, setProceedWithNoFuel] = useState(false);
  const [formData, setFormData] = useState({
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
    "Fuel Payment": "",
    Comments: "",
    "Restuarant Name": "",
    "Restaurant Time": "",
    signedContract: false,
    "ID Number": "",
  });

  const closePrepaymentModal = () => {
    setOpenPrepaymentModal(false);
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
    setLoading(true);

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

    const booking = new Booking({
      ...bookingData,
      "ID Back Picture": uploadIdBackImageResponse,
      "ID Front Picture": uploadIdFrontResponse,
      Toys: [paddle, seaBobName].filter((value) => !!value),
    });

    const res = await updateBookingInfo(id, booking);
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
      return;
    }

    if (!formData["signedContract"]) {
      return toast.error(
        "Please click on the check box read and sign the contract"
      );
    }
    if (+formData["No Adults"] + +formData["No Childs"] <= 0) {
      return toast.error(
        `Add number of paasengers. Boat allows ${boatInfo["Max.Passengers"]} passengers`
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

    if (+formData["Fuel Payment"] === 0) {
      return setOpenPrepaymentModal(true);
    }

    updateNotion(formData);
  };

  // Function to calculate boat prices
  const calculateBoatPrices = (pricePerMile: number, mileRanges: number[]) => {
    return mileRanges.map((miles: number) => ({
      label: miles
        ? `${miles} ` +
          t("input.nautical_miles") +
          " - " +
          `${miles * pricePerMile}€`
        : t("input.continue_without_prepayment"),
      value: (miles * pricePerMile).toString(),
    }));
  };

  const handlePrepayment = (additionalPayment: number) => {
    setTotalPayment(additionalPayment);
    submitBooking();
  };

  const pricePerMile = +boatInfo?.MilePrice || 0;
  const calculatedMiles = calculateBoatPrices(pricePerMile, MILE_RANGES);

  if (!data || !formik) {
    return;
  }
  return (
    <>
      <PrepaymentModal
        isOpen={openPrepaymentModal}
        closeModal={closePrepaymentModal}
        data={calculatedMiles}
        totalPayment={totalPayment}
        continuePayment={(fuelPayment) => {
          const newData = {
            ...formData,
            ["Fuel Payment"]: fuelPayment.toString(),
          };
          setFormData(newData);
          updateNotion(newData);
        }}
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
                bookingInfo={data}
                data={formData}
                setData={setFormData}
                miles={calculatedMiles}
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
