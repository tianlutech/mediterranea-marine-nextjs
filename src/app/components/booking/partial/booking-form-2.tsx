"use client";

import InfoSvg from "@/app/assets/svgs/InfoSvg";
import PlayerSvg from "@/app/assets/svgs/PlayerSvg";
import CommonInput from "@/app/components/common/inputs/input";
import CommonSelect from "@/app/components/common/inputs/selectInput";
import CommonLabel from "../../common/label/label";
import { useState } from "react";
import TermsAndConditionModal from "@/app/components/modals/termsAndConditions";
import VideoModal from "../../modals/videoModal";
import ErrorMessage from "./errorMessage";
import {
  DEPARTURES_TIMES,
  STANDUP_PADDLE,
  SEABOB,
} from "@/app/models/constants";
import { useTranslation } from "react-i18next";

export default function BookingForm2({
  data,
  setData,
  miles,
  formik,
}: {
  data: any;
  setData: any;
  miles: Array<{ value: string; name: string }>;
  formik: any;
}) {
  const { t } = useTranslation();

  const [eatAtRestaurant, setEatAtRestaurant] = useState<string>("");
  const [openTermModal, setOpenTermModal] = useState<boolean>(false);
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);
  const [videoLiknk, setVideoLink] = useState<string>("");

  const closeModalTermModal = () => {
    setOpenTermModal(false);
  };

  const openVideoModal = (link: string) => {
    setVideoLink(link);
    setVideoModalOpen(true);
  };
  const closeVideoModal = () => {
    setVideoModalOpen(false);
  };

  return (
    <>
      <VideoModal
        isOpen={videoModalOpen}
        closeModal={closeVideoModal}
        videoSrc={videoLiknk}
      />
      <TermsAndConditionModal
        isOpen={openTermModal}
        closeModal={closeModalTermModal}
        data={data}
        setData={setData}
      />
      <div className="flex md:mt-0 mt-4 md:flex-row flex-col md:w-[49%] w-full">
        <div className="w-full bg-white rounded-lg">
          <div className="md:p-6 sm:p-8 p-6">
            <div className="relative w-full">
              <CommonLabel
                input="select"
                error={formik.errors["Departure Time"]}
              >
                {t("input.departure_time")}
              </CommonLabel>
              <CommonSelect
                id="departureTime"
                name="departureTime"
                value={data["Departure Time"]}
                onChange={(e) =>
                  setData({ ...data, "Departure Time": e.target.value })
                }
                data={DEPARTURES_TIMES}
                required
              />
              <ErrorMessage formik={formik} name="Departure Time" />
            </div>
            <div className="mt-6 flex items-baseline">
              <div className="flex items-center mb-4">
                <input
                  id="default-radio-1"
                  type="radio"
                  value="onBoat"
                  checked={eatAtRestaurant === "onBoat"}
                  name="eat-radio"
                  onChange={() => setEatAtRestaurant("onBoat")}
                  required
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="ms-2 md:text-base text-sm  text-black">
                  {t("input.we_eat_on_board")}
                </label>
              </div>
              <div className="flex items-center ml-10">
                <input
                  id="eat-radio-1"
                  type="radio"
                  value="restaurant"
                  checked={eatAtRestaurant === "restaurant"}
                  name="eat-radio"
                  onChange={() => setEatAtRestaurant("restaurant")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="ms-2 md:text-base text-sm  text-black">
                  {t("input.we_eat_on_a_restaurant")}
                </label>
              </div>
            </div>
            {eatAtRestaurant === "restaurant" && (
              <div className="flex justify-between w-full mt-2">
                <div className="relative w-[48%]">
                  <label className="block mb-2 md:text-sm text-xs font-medium text-gray-900 absolute z-10 md:bottom-[2.3rem] bottom-[1.7rem] bg-white md:left-4 left-1 px-2">
                    {t("input.name_of_restaurant")}
                  </label>
                  <CommonInput
                    type="text"
                    name="restaurant"
                    id="restaurantName"
                    placeholder="Name of the restaurant"
                    onChange={(e: any) =>
                      setData({ ...data, "Restaurant Name": e.target.value })
                    }
                    required={true}
                  />
                </div>
                <div className="relative w-[48%]">
                  <label className="block px-2 absolute text-black md:bottom-[2.7rem] bottom-[2rem] z-10 bg-white md:left-4 left-2 md:text-sm text-xs font-medium">
                    {t("input.booking_time")}
                  </label>
                  <CommonInput
                    type="time"
                    name="bookingTime"
                    id="bookingTime"
                    placeholder="Booking time"
                    onChange={(e: any) => {
                      const date = new Date();
                      const [hour, minutes] = e.target.value.split(
                        ":"
                      ) as string[];
                      date.setHours(+hour, +minutes, 0, 0);
                      console.log({ value: e.target.value, date });
                      setData({ ...data, "Restaurant Time": date });
                    }}
                    required={true}
                  />
                </div>
              </div>
            )}
            <div className="mt-6 text-black flex">
              <div>
                <InfoSvg />
              </div>
              <span className="text-sm ml-2">
                {t("input.general_comments_info")}
              </span>
            </div>
            <div className="relative w-full mt-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 bottom-[2.8rem] bg-white left-4 px-2">
                {t("input.general_comments")}
              </label>{" "}
              <textarea
                id="message"
                className="block p-2.5 w-full text-sm text-black rounded-lg border border-gray-300"
                placeholder=""
                onChange={(e) => setData({ ...data, Comments: e.target.value })}
              ></textarea>
            </div>
            <div className="relative w-full mt-6">
              <CommonLabel input="select" error={formik.errors["Fuel Payment"]}>
                {t("input.prepayment_of_fuel")}
              </CommonLabel>
              <CommonSelect
                id="miles"
                name="miles"
                data={miles}
                value={data["Fuel Payment"]}
                onChange={(e) =>
                  setData({ ...data, "Fuel Payment": e.target.value })
                }
                required
              />
              <ErrorMessage formik={formik} name="Fuel Payment" />
            </div>
            <div className="mt-2 text-black flex">
              <div>
                <InfoSvg />
              </div>
              <span className="text-sm ml-2">
                {t("input.invitando_al_usuario_a_pagar_el_combustible_al_principio")}
              </span>
            </div>
            <div className="relative w-full mt-6 flex justify-between items-center">
              <div className="w-[90%]">
                <CommonLabel
                  input="select"
                  error={formik.errors["Departure Time"]}
                >
                  {t("input.toy_stand_up_paddle")}
                </CommonLabel>
                <CommonSelect
                  id="paddles"
                  name="paddles"
                  data={STANDUP_PADDLE}
                  value={data["SUP"]}
                  onChange={(e) => setData({ ...data, SUP: e.target.value })}
                  required
                />
              </div>
              <div
                onClick={() =>
                  openVideoModal("https://www.youtube.com/watch?v=ES2mShoQ3_Q")
                }
                className="cursor-pointer"
              >
                <PlayerSvg />
              </div>
            </div>
            <div className="mt-2 text-black flex">
              <div>
                <InfoSvg />
              </div>
              <span
                className="text-sm ml-2"
                onClick={() =>
                  openVideoModal("https://www.youtube.com/watch?v=ES2mShoQ3_Q")
                }
              >
                {t("input.toy_stand_up_paddle_info")}
              </span>
            </div>
            <ErrorMessage formik={formik} name="SUP" />
            <div className="relative w-full mt-6 flex justify-between items-center">
              <div className="w-[90%]">
                <CommonLabel
                  input="select"
                  error={formik.errors["Departure Time"]}
                >
                  {" "}
                  {t("input.toy_seabob")}{" "}
                </CommonLabel>
                <CommonSelect
                  id="seabob"
                  name="seabob"
                  data={SEABOB}
                  value={data["SEABOB"]}
                  onChange={(e) => setData({ ...data, SEABOB: e.target.value })}
                  required
                />
              </div>
              <div
                onClick={() =>
                  openVideoModal("https://www.youtube.com/watch?v=IKj0A5DDN0g")
                }
                className="cursor-pointer"
              >
                <PlayerSvg />
              </div>
            </div>
            <div className="mt-2 text-black flex">
              <div>
                <InfoSvg />
              </div>
              <span
                onClick={() =>
                  openVideoModal("https://www.youtube.com/watch?v=IKj0A5DDN0g")
                }
                className="text-sm ml-2"
              >
                {t("input.toy_seabob_info")}
              </span>
            </div>
            <ErrorMessage formik={formik} name="SEABOB" />
            <div className="mt-6">
              <div
                onClick={() => {
                  !data["signedContract"] && setOpenTermModal(true);
                }}
                className="flex items-center"
              >
                <input
                  id="checked-checkbox"
                  checked={data["signedContract"]}
                  disabled={data["signedContract"]}
                  type="checkbox"
                  value=""
                  readOnly
                  required
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                />
                <label className="ms-2 text-sm text-black cursor-pointer">
                  {t("input.read_and_sign_the_contract")}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
