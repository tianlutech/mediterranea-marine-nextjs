"use client";

import InfoSvg from "@/assets/svgs/InfoSvg";
import PlayerSvg from "@/assets/svgs/PlayerSvg";
import CommonInput from "@/components/common/inputs/input";
import CommonSelect from "@/components/common/inputs/selectInput";
import CommonTextArea from "@/components/common/inputs/textarea"
import CommonLabel from "../../common/containers/label";
import React, { useMemo, useState } from "react";
import VideoModal from "../../modals/videoModal";
import ErrorMessage from "./errorMessage";
import { DEPARTURES_TIMES, STANDUP_PADDLE, SEABOB } from "@/models/constants";
import { Boat, BookingFormData } from "@/models/models";
import { useTranslation } from "next-i18next";
import { MILE_RANGES } from "@/models/constants";
import TextInfoModal from "@/components/modals/textInfoModal";
import RadioInput from "@/components/common/inputs/radioInput";

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative w-[48%]">{children}</div>;
};

export default function BookingForm2({
  data,
  setData,
  formik,
  boatInfo,
}: {
  data: BookingFormData;
  setData: (data: BookingFormData) => void;
  formik: any;
  boatInfo: Boat;
}) {
  const { t } = useTranslation();

  const [eatAtRestaurant, setEatAtRestaurant] = useState<string>("");
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);
  const [infoModalText, setInfoModalText] = useState<string>("");
  const [noKids, setNoKids] = useState<number>(0);

  const [videoLink, setVideoLink] = useState<string>("");

  const openVideoModal = (link: string) => {
    setVideoLink(link);
    setVideoModalOpen(true);
  };
  const closeVideoModal = () => {
    setVideoModalOpen(false);
  };

  const departureTimes = DEPARTURES_TIMES.filter(
    (timeSlot) => !boatInfo.bussySlots.includes(timeSlot)
  );

  const miles = useMemo(() => {
    const pricePerMile = boatInfo.MilePrice || 0;
    return MILE_RANGES.map((miles: number) => ({
      label: miles
        ? `${miles}` + t(`input.${miles}_miles_description`)
        : t("input.continue_without_prepayment"),
      value: (miles * pricePerMile).toString(),
    }));
  }, [boatInfo, t]);

  return (
    <>
      <TextInfoModal
        closeModal={() => setInfoModalText("")}
        text={infoModalText}
      />
      <VideoModal
        isOpen={videoModalOpen}
        closeModal={closeVideoModal}
        videoSrc={videoLink}
      />
      <div className="flex md:mt-0 mt-4 md:flex-row flex-col md:w-[49%] w-full">
        <div className="w-full bg-white rounded-lg">
          <div className="md:p-6 sm:p-8 p-6">
            <div className="relative w-full">
              <div className="flex justify-between w-full mt-6">
                <FormWrapper>
                  <CommonLabel input="text">
                    {t("input.adult_passengers")}
                  </CommonLabel>
                  <CommonInput
                    type="number"
                    name="number"
                    id="adultNumber"
                    placeholder="Adult number"
                    value={data["No Adults"]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setData({ ...data, "No Adults": +e.target.value })
                    }
                    min={1}
                    step={1}
                    required={true}
                  />
                </FormWrapper>
                <FormWrapper>
                  <CommonLabel input="text">
                    {t("input.kids_passengers")}
                  </CommonLabel>
                  <CommonInput
                    type="number"
                    name="number"
                    id="kidsNumber"
                    placeholder="Kids number"
                    value={data["No Childs"]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      console.log("NO KIDS", +e.target.value)
                      setNoKids(+e.target.value)
                      setData({ ...data, "No Childs": +e.target.value })
                    }
                    }
                    step={1}
                  />
                </FormWrapper>
              </div>
              <div>
                {noKids > 0 && (
                  <div className="relative w-full mt-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 bottom-[2.8rem] bg-white left-4 px-2">
                      {t("input.kids_age")}
                    </label>
                    <CommonTextArea id="kids_age" required onChange={(value) => setData({ ...data, KidsAge: value })} placeholder="" />
                  </div>
                )}
              </div>
              <div className="mt-3 mb-6 text-black flex">
                <div>
                  <InfoSvg />
                </div>
                <span className="text-sm ml-2">
                  {t("input.boat_passenger_info1")} {boatInfo["Max.Passengers"]}{" "}
                  {t("input.boat_passenger_info2")}
                </span>
              </div>
              <div className="mt-6 flex items-baseline">
                <RadioInput
                  id="duration-default-radio-1"
                  className="mb-4"
                  inputName="id-duration-one-day"
                  label={t("input.one-day-trip")}
                  onChange={() => setData({ ...data, Overnight: false })}
                  checked={!data.Overnight}
                />
                <RadioInput
                  id="duration-default-radio-1"
                  className="ml-10"
                  inputName="id-duration-one-night"
                  label={t("input.overnight-trip")}
                  onChange={() => setData({ ...data, Overnight: true })}
                  checked={!!data.Overnight}
                />
              </div>
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
                data={departureTimes}
                required
              />
              <ErrorMessage formik={formik} name="Departure Time" />
            </div>
            <div className="mt-6 flex items-baseline">
              <RadioInput
                id="restaurant-default-radio-1"
                className="mb-4"
                inputName="id-eat-radio"
                label={t("input.we_eat_on_board")}
                onChange={() => setEatAtRestaurant("onBoat")}
                checked={eatAtRestaurant === "onBoat"}
                required={true}
              />
              <RadioInput
                id="restaurant-default-radio-1"
                className="ml-10"
                inputName="id-eat-radio"
                label={t("input.we_eat_on_a_restaurant")}
                onChange={() => setEatAtRestaurant("restaurant")}
                checked={eatAtRestaurant === "restaurant"}
              />
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
                    placeholder={t("input.name_of_restaurant")}
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
                    placeholder={t("input.booking_time")}
                    onChange={(e: any) => {
                      const date = data["Date"];
                      const [hour, minutes] = e.target.value.split(
                        ":"
                      ) as string[];
                      date.setHours(+hour, +minutes, 0, 0);
                      setData({ ...data, "Restaurant Time": date.toString() });
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
              <CommonTextArea id="message" onChange={(value) => setData({ ...data, Comments: value })} />

            </div>
            <div className="relative w-full mt-6  flex justify-between items-center">
              <div className="w-[90%]">
                <CommonLabel
                  input="select"
                  error={formik.errors["Fuel Payment"]}
                >
                  {t("input.prepayment_of_fuel")}
                </CommonLabel>
                <CommonSelect
                  id="miles"
                  name="miles"
                  data={miles}
                  value={data["Fuel Payment"].toString()}
                  onChange={(e) =>
                    setData({ ...data, "Fuel Payment": +e.target.value })
                  }
                  required
                />
              </div>
              <div
                onClick={() =>
                  setInfoModalText(
                    t("prepayment_modal.prepayment_fuel_modal_p1")
                  )
                }
                className="cursor-pointer"
              >
                <InfoSvg width={40} height={40} />
              </div>
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
          </div>
        </div>
      </div>
    </>
  );
}
