"use client";

import { useState } from "react";
import BookingForm1 from "./partial/booking-form-1";
import BookingForm2 from "./partial/booking-form-2";
import PrepaymentModal from "@/app/components/modals/prepaymentModal";
import { Booking } from "@/app/models/models";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { updateBookingInfo } from "@/app/services/notion.service";

export default function BookingComponent({
  data,
  id,
  boatInfo,
}: {
  data: {};
  id: string;
  boatInfo: any;
}) {
  const [openPrepaymentModal, setOpenPrepaymentModal] =
    useState<boolean>(false);
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
    SUP: 0,
    SEABOB: 0,
    "Fuel Payment": 0,
    agreePolicy: false,
    agreeGuaranty: false,
    signedContract: true
  });

  const closePrepaymentModal = () => {
    setOpenPrepaymentModal(false);
  };

  const validate = () => {
    const values = formData;
    const errors: Record<string, string> = {};

    if (!values["First Name"]) {
      errors["First Name"] = "Required";
    }
    if (!values["Last Name"]) {
      errors["Last Name"] = "Required";
    }
    if (!values["Email"]) {
      errors["Email"] = "Required";
    }
    if (!values["Billing Address"]) {
      errors["Billing Address"] = "Required";
    }
    if (!values["ID_Back_Picture"]) {
      errors["ID_Back_Picture"] = "Required";
    }
    if (!values["ID_Front_Picture"]) {
      errors["ID Front Picture"] = "Required";
    }
    if (!values["Departure Time"]) {
      errors["Departure Time"] = "Required";
    }
    if (!values["SUP"]) {
      errors["SUP"] = "Required";
    }
    if (!values["SEABOB"]) {
      errors["SEABOB"] = "Required";
    }
    if (!values["Fuel Payment"]) {
      errors["Fuel Payment"] = "Required";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: formData,
    validate: validate,
    onSubmit: () => {
      submitBooking();
    },
  });

  const totalPayment =
    +formData["Fuel Payment"] + +formData["SUP"] + +formData["SEABOB"];

  const submitBooking = () => {
    const { ID_Back_Picture, ID_Front_Picture, SEABOB, SUP, ...bookingData } =
      formData;

    if (+bookingData["No Adults"] + +bookingData["No Childs"] <= 0) {
      return toast.error(
        `Add number of paasengers. Boat allows ${boatInfo["Max.Passengers"]} passengers`
      );
    }

    if (
      +bookingData["No Adults"] + +bookingData["No Childs"] >
      boatInfo["Max.Passengers"]
    ) {
      return toast.error(
        `You have exceeded the boat passengers. Boat allows ${boatInfo["Max.Passengers"]} passengers`
      );
    }

    if (+bookingData["Fuel Payment"] === 0) {
      return setOpenPrepaymentModal(true);
    }

    // Upload the files and convert them in { name: '', url: '', type: "external"}
    console.log({ bookingData });
    const data = {
      ...bookingData,
      // "ID_Back_Picture": {} as FileData,
      // "ID Front Picture": {} as FileData,
      Toys: [SUP, SEABOB].filter((value) => !!value),
    } as unknown as Partial<Booking>;

    updateBookingInfo(id, data);
  };
  const calculateBoatPrices = (pricePerMile: number, mileRanges: any) => {
    return mileRanges.map((miles: number) => ({
      name: `${miles} Nautical Miles - ${miles * pricePerMile}€`,
      value: miles * pricePerMile,
    }));
  };
  const pricePerMile: number = boatInfo?.MilePrice;
  const mileRanges = [25, 35]; // Example mile ranges
  const calculatedMiles = calculateBoatPrices(pricePerMile, mileRanges);

  if (!data || !formik) {
    return;
  }
  return (
    <>
      <PrepaymentModal
        isOpen={openPrepaymentModal}
        closeModal={closePrepaymentModal}
        data={calculatedMiles}
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
                boatInfo={boatInfo}
                formik={formik}
              />
            </div>
            {/* terms and policy */}
            <div>
              <div className="mt-6">
                <div className="flex items-center">
                  <input
                    checked={formData["agreePolicy"]}
                    id="checked-checkbox"
                    type="checkbox"
                    value=""
                    onClick={() => setFormData({ ...formData, "agreePolicy": !formData["agreePolicy"] })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ms-2 text-sm cursor-pointer">
                    I agree with the privacy policy
                  </label>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center">
                  <input
                    checked={formData["agreeGuaranty"]}
                    id="checked-checkbox"
                    type="checkbox"
                    onClick={() => setFormData({ ...formData, "agreeGuaranty": !formData["agreeGuaranty"] })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ms-2 text-sm">
                    I guarantee that the information of the user is from a user
                    that is going to go to the boat.
                  </label>
                </div>
              </div>
            </div>
            <button
              disabled={!formData["agreePolicy"] || !formData["agreeGuaranty"] || !formData["signedContract"]}
              type="submit"
              className="mt-6 text-white bg-buttonColor focus:ring-4 font-semibold rounded-lg text-lg px-10 py-3"
            >
              {totalPayment > 0 ? `Pay ${totalPayment}` : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
