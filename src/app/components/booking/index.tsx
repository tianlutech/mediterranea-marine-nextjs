"use client";

import { useState } from "react";
import BookingForm1 from "./partial/booking-form-1";
import BookingForm2 from "./partial/booking-form-2";
import PrepaymentModal from "@/app/components/modals/prepaymentModal";
import { Booking, FileData } from "@/app/models/models";
import { updatePage } from "@/app/api/notion/notion.api"
import { Formik, Form, Field } from "formik";
import CommonInput from "../common/inputs/input";
import { toast } from "react-toastify";

export default function Booking({
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
  });

  const closePrepaymentModal = () => {
    setOpenPrepaymentModal(false);
  };
  if (!data) {
    return;
  }

  const initialValues: any = {
    "First Name": formData["First Name"],
    "Last Name": "",
    Email: "",
    "Billing Address": "",
    "No Adults": 0,
    "No Childs": 0,
    ID_Back_Picture: {},
    ID_Front_Picture: {},
    "Departure Time": "",
    SUP: "",
    SEABOB: "",
    "Fuel Payment": 0,
  };
  type Errors = {
    [Key in keyof Booking]?: string;
  };
  const validate = (values: Booking) => {
    const errors: Errors = {};
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
    if (!values["No Adults"]) {
      errors["No Adults"] = "Required";
    }
    if (!values["No Childs"]) {
      errors["No Childs"] = "Required";
    }
    if (!values["ID Back Picture"]) {
      errors["ID Back Picture"] = "Required";
    }
    if (!values["ID Front Picture"]) {
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
  const totalPayment = +formData["Fuel Payment"] + +formData["SUP"] + +formData["SEABOB"];
  const submitBooking = () => {
    const { ID_Back_Picture, ID_Front_Picture, ...bookingData } =
      formData;

    // Using the Unary + Operator
    const toys = +bookingData["SUP"] + +bookingData["SEABOB"];

    if (bookingData["No Adults"] + bookingData["No Childs"] > boatInfo["Max.Passengers"]) {
      return toast.error(`You have exceeded the boat passengers. Boat allows ${boatInfo["Max.Passengers"]} passengers`)
    }

    if (bookingData["Fuel Payment"] === 0) {
      return setOpenPrepaymentModal(true)
    }

    console.log("=======sum", +toys + +bookingData["Fuel Payment"])
    // Upload the files and convert them in { name: '', url: '', type: "external"}

    // const data = {
    //   ...bookingData,
    //   // "ID Back Picture": {} as FileData,
    //   // "ID Front Picture": {} as FileData,
    //   Toys: [formData["SUP"], formData["SEABOB"]].filter((value) => !!value),
    // } as Partial<Booking>;

    // updatePage(id, data);
    console.log("=======bookingData", bookingData)
  };
  const calculateBoatPrices = (pricePerMile: number, mileRanges: any) => {
    return mileRanges.map(
      (miles: number) => ({
        name: `${miles} Nautical Miles - ${miles * pricePerMile}€`,
        value: miles * pricePerMile
      })
    );
  };
  const pricePerMile: number = boatInfo?.MilePrice;
  const mileRanges = [25, 35]; // Example mile ranges
  const calculatedMiles = calculateBoatPrices(pricePerMile, mileRanges);
  return (
    <>
      <PrepaymentModal
        isOpen={openPrepaymentModal}
        closeModal={closePrepaymentModal}
        data={calculatedMiles}
      />
      <div className="relative md:w-[77%] w-full md:p-6 p-2">
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={submitBooking}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="justify-between w-full ">
                <div className="md:flex justify-between w-full ">
                  {/* first form */}
                  <BookingForm1 data={formData} setData={setFormData} errors={errors} touched={touched} />
                  {/* Second form */}
                  <BookingForm2
                    data={formData}
                    setData={setFormData}
                    boatInfo={boatInfo}
                    errors={errors}
                    touched={touched}
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
                        id="checked-checkbox"
                        type="checkbox"
                        value=""
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
                  onClick={() => submitBooking()}
                  type="submit"
                  className="mt-6 text-white bg-buttonColor focus:ring-4 font-semibold rounded-lg text-lg px-10 py-3"
                >
                  {totalPayment > 0 ? `Pay ${totalPayment}` : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}