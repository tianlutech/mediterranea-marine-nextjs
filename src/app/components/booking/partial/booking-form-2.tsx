"use client";

import InfoSvg from "@/app/assets/svgs/InfoSvg";
import PlayerSvg from "@/app/assets/svgs/PlayerSvg";
import CommonInput from "@/app/components/common/inputs/input";
import CommonSelect from "@/app/components/common/inputs/selectInput";
import { useEffect, useState } from "react";
import TermsAndConditionModal from "@/app/components/booking/partial/termsAndConditions"

export default function BookingForm2({ data, setData, boatInfo }: { data: any, setData: any, boatInfo: any }) {
  const [eatAtRestaurant, setEatAtRestaurant] = useState<any>(false)
  const [openTermModal, setOpenTermModal] = useState<boolean>(false)

  const departureTime = [
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];
  const standUpPaddle = [
    "SEABOB 2 - 250E",
    "SUB 1 - 150E",
    "SEABOB 1 - 150E",
  ];
  const closeModalTermModal = () => {
    setOpenTermModal(false)
  }
  // Function to calculate boat prices
  const calculateBoatPrices = (pricePerMile: number, mileRanges: any) => {
    return mileRanges.map((miles: number) => `${miles} Nautical Miles - ${miles * pricePerMile}€`);
  }

  // Define your price per mile and mile ranges
  const pricePerMile: number = boatInfo?.properties?.MilePrice.number; // Example: 4 euros per mile
  const mileRanges = [25, 35]; // Example mile ranges
  const calculatedMiles = calculateBoatPrices(pricePerMile, mileRanges);

  return (
    <>
      <TermsAndConditionModal isOpen={openTermModal} closeModal={closeModalTermModal} />
      <div className="flex md:mt-0 mt-4 md:flex-row flex-col md:w-[49%] w-full">
        <div className="w-full bg-white rounded-lg">
          <div className="md:p-6 sm:p-8 p-6">
            <form className="" action="#">
              <div className="relative w-full">
                <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">
                  Departure time
                </label>
                <CommonSelect
                  id="departureTime"
                  name="departureTime"
                  data={departureTime}
                />
              </div>
              <div className="mt-6 flex items-baseline">
                <div className="flex items-center mb-4">
                  <input
                    id="default-radio-1"
                    type="radio"
                    value=""
                    checked={eatAtRestaurant == false}
                    name="default-radio"
                    onChange={() => setEatAtRestaurant(false)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ms-2 md:text-base text-sm  text-black">
                    We eat on board
                  </label>
                </div>
                <div className="flex items-center ml-10">
                  <input
                    id="default-radio-1"
                    type="radio"
                    value=""
                    checked={eatAtRestaurant}
                    name="default-radio"
                    onChange={() => setEatAtRestaurant(true)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ms-2 md:text-base text-sm  text-black">
                    We eat on a restaurant
                  </label>
                </div>
              </div>
              {eatAtRestaurant &&
                <div className="flex justify-between w-full mt-2">
                  <div className="relative w-[48%]">
                    <label className="block mb-2 md:text-sm text-xs font-medium text-gray-900 absolute z-10 md:bottom-[2.3rem] bottom-[1.7rem] bg-white md:left-4 left-1 px-2">
                      Name of restaurant
                    </label>
                    <CommonInput
                      type="text"
                      name="restaurant"
                      id="restaurantName"
                      placeholder="Name of the restaurant"
                      required={true}
                    />
                  </div>
                  <div className="relative w-[48%]">
                    <label className="block px-2 absolute text-black md:bottom-[2.7rem] bottom-[2rem] z-10 bg-white md:left-4 left-2 md:text-sm text-xs font-medium">
                      Booking time
                    </label>
                    <CommonInput
                      type="time"
                      name="bookingTime"
                      id="bookingTime"
                      placeholder="Booking time"
                      required={true}
                    />
                  </div>
                </div>
              }

              <div className="mt-6 text-black flex">
                <div>
                  <InfoSvg />
                </div>
                <span className="text-sm ml-2">
                  Is common for our clients to book in a restuarant, providing to
                  us the restaurant name and the meal appointment can help our
                  captian to adjust and apdat the route of your sail
                </span>
              </div>
              <div className="relative w-full mt-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 bottom-[2.8rem] bg-white left-4 px-2">
                  General comments
                </label>
                <textarea
                  id="message"
                  className="block p-2.5 w-full text-sm text-black rounded-lg border border-gray-300"
                  placeholder=""
                ></textarea>
              </div>
              <div className="relative w-full mt-6">
                <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">
                  Prepayment of fuel
                </label>
                <CommonSelect id="miles" name="miles" data={calculatedMiles} />
              </div>
              <div className="mt-2 text-black flex">
                <div>
                  <InfoSvg />
                </div>
                <span className="text-sm ml-2">
                  inviting the user to pay the fuel at the beginning.
                </span>
              </div>
              <div className="relative w-full mt-6 flex justify-between items-center">
                <div className="w-[90%]">
                  <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">
                    Toy: Stand Up Paddle
                  </label>
                  <CommonSelect id="miles" name="miles" data={standUpPaddle} />
                </div>
                <div className="w-[8%]">
                  <PlayerSvg />
                </div>
              </div>
              <div className="mt-2 text-black flex">
                <div>
                  <InfoSvg />
                </div>
                <span className="text-sm ml-2">
                  Click here to see the video of the SUP
                </span>
              </div>
              <div className="relative w-full mt-6 flex justify-between items-center">
                <div className="w-[90%]">
                  <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">
                    Toy: SEABOB{" "}
                  </label>
                  <CommonSelect id="miles" name="miles" data={standUpPaddle} />
                </div>
                <div className="w-[8%]">
                  <PlayerSvg />
                </div>
              </div>
              <div className="mt-2 text-black flex">
                <div>
                  <InfoSvg />
                </div>
                <span className="text-sm ml-2">
                  Click chere to see a video of the SEABOB
                </span>
              </div>
              <div className="mt-6">
                <div className="flex items-center">
                  <input
                    readOnly
                    checked
                    id="checked-checkbox"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ms-2 text-sm text-black">
                    Read and Sign the <span onClick={() => setOpenTermModal(true)} className="text-blue-600">contract</span>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
