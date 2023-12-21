"use client";

import { useState, useEffect } from "react";
import BookingForm1 from "./partial/booking-form-1";
import BookingForm2 from "./partial/booking-form-2";
import PrepaymentModal from "@/app/components/modals/prepaymentModal";
import { Boat, Booking } from "@/app/models/models";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { updateBookingInfo } from "@/app/services/notion.service";
import { MILE_RANGES } from "@/app/models/constants";
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
  data: {};
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
    "ID Number": ""
  });

  const closePrepaymentModal = () => {
    setOpenPrepaymentModal(false);
  };

  const storeIdImage = async (file: File, slag: string) => {
    const id = formData["ID Number"]
    const response = await uploadFile(file, boatInfo.Nombre, id, slag)
    return response
  }

  const validate = () => {
    const values = formData;
    const errors: Record<string, string> = {};
    if (!values["ID_Back_Picture"]) {
      errors["ID_Back_Picture"] = "Required";
    }
    if (!values["ID_Front_Picture"]) {
      errors["ID Front Picture"] = "Required";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: formData,
    validate,
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
    const {
      ID_Back_Picture,
      ID_Front_Picture,
      SEABOB,
      SUP,
      signedContract,
      ...bookingData
    } = formData;

    // Upload the files and convert them in { name: '', url: '', type: "external"}
    const data = {
      ...bookingData,

      // "ID_Back_Picture": {} as FileData,
      // "ID Front Picture": {} as FileData,
      Toys: [SUP, SEABOB].filter((value) => !!value),
    } as unknown as Partial<Booking>;

    setLoading(true);
    const res = await updateBookingInfo(id, data);
    setLoading(false);
    if (res === false) {
      return;
    }
    router.replace("/success");
  };

  const submitBooking = async () => {
    const uploadIdFrontResponse = await storeIdImage(formData["ID_Front_Picture"], "front")
    const uploadIdBackImageResponse = await storeIdImage(formData["ID_Back_Picture"], "back")

    if (!uploadIdFrontResponse.id) {
      toast.error(t("error.upload_image"))
      return
    }

    if (!uploadIdBackImageResponse.id) {
      toast.error(t("upload_front_image"))
      return
    }
    // validate address first
    const res = await validateAddress(formData["Billing Address"])

    if (res === false) {
      return
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
      name: miles
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
                data={formData}
                setData={setFormData}
                miles={calculatedMiles}
                formik={formik}
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
