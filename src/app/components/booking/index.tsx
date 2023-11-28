"use client";

import { useState } from "react";
import BookingForm1 from "./partial/booking-form-1"
import BookingForm2 from "./partial/booking-form-2"
import TermsAndConditionModal from "@/app/components/common/modal/termsAndConditions"
import PrepaymentModal from "@/app/components/common/modal/prepaymentModal"

export default function Booking({ data, id, boatInfo }: { data: any, id: string, boatInfo: any }) {
  const [openTermModal, setOpenTermModal] = useState<boolean>(false)
  const [openPrepaymentModal, setOpenPrepaymentModal] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>(data)
  const closeModalTermModal = () => {
    setOpenTermModal(false)
  }
  const closePrepaymentModal = () => {
    setOpenPrepaymentModal(false)
  }

  const updateBookingDetails = async () => {
    await fetch(`/api/bookingDetails/${id}`, {
      method: "PUT",
      body: JSON.stringify(formData.properties),
    })
  }
  if (!data) {
    return
  }
  return (
    <>
      <TermsAndConditionModal isOpen={openTermModal} closeModal={closeModalTermModal} />
      <PrepaymentModal isOpen={openPrepaymentModal} closeModal={closePrepaymentModal} />
      <div className="relative md:w-[77%] w-full md:p-6 p-2">
        <div className="justify-between w-full ">
          <div className="md:flex justify-between w-full ">
            {/* first form */}
            <BookingForm1 data={formData} setData={setFormData} />
            {/* Second form */}
            <BookingForm2 data={formData} setData={setFormData} boatInfo={boatInfo} />
          </div>
          {/* terms and policy */}
          <div>
            <div className="mt-6">
              <div className="flex items-center">
                <input id="checked-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label className="ms-2 text-sm cursor-pointer">I agree with the privacy <span onClick={() => setOpenTermModal(true)} className="text-blue-600">policy</span></label>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center">
                <input id="checked-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label className="ms-2 text-sm">I gurantee that the information of the user is from a user that is going to go to the boat.</label>
              </div>
            </div>
          </div>
          <button onClick={() => updateBookingDetails()} type="button" className=" mt-6 text-white bg-buttonColor focus:ring-4 font-semibold rounded-lg text-lg px-10 py-3">Submit</button>
        </div>
      </div>
    </>

  );
}
