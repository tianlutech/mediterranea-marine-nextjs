"use client";

import { useState } from "react";
import BookingForm1 from "./partial/booking-form-1";
import BookingForm2 from "./partial/booking-form-2";
import PrepaymentModal from "@/app/components/modals/prepaymentModal";
import { Booking, FileData } from "@/app/models/models";
import { updatePage } from "@/app/api/notion/notion.api"

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
    SUP: "", // Stand Up Boat Toy 1
    SEABOB: "", //  Toy 2
    "Fuel Payment": 0,
  });

  const closePrepaymentModal = () => {
    setOpenPrepaymentModal(false);
  };
  if (!data) {
    return;
  }

  const submitBooking = () => {
    const { SUP, SEABOB, ID_Back_Picture, ID_Front_Picture, ...bookingData } =
      formData;

    // Upload the files and convert them in { name: '', url: '', type: "external"}

    const data = {
      ...bookingData,
      // "ID Back Picture": {} as FileData,
      // "ID Front Picture": {} as FileData,
      Toys: [formData["SUP"], formData["SEABOB"]].filter((value) => !!value),
    } as Partial<Booking>;

    updatePage(id, data);
  };
  return (
    <>
      <PrepaymentModal
        isOpen={openPrepaymentModal}
        closeModal={closePrepaymentModal}
      />
      <div className="relative md:w-[77%] w-full md:p-6 p-2">
        <div className="justify-between w-full ">
          <div className="md:flex justify-between w-full ">
            {/* first form */}
            <BookingForm1 data={formData} setData={setFormData} />
            {/* Second form */}
            <BookingForm2
              data={formData}
              setData={setFormData}
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
            className=" mt-6 text-white bg-buttonColor focus:ring-4 font-semibold rounded-lg text-lg px-10 py-3"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}
