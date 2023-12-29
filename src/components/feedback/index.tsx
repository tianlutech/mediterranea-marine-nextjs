"use client";

import InfoSvg from "@/app/assets/svgs/InfoSvg";
import CommonInput from "@/components/common/inputs/input";
import CommonInputFile from "@/components/common/inputs/fileInput";
import CommonLabel from "../common/containers/label";
import React from "react";
import { Boat, Booking } from "@/models/models";
import { useTranslation } from "react-i18next";
import StarRatings from "react-star-ratings";
import SubmitButton from "../common/containers/submit-button";
import { useEffect, useState } from "react";

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>;
};

export default function FeedbackForm({
  data,
  boatInfo,
}: {
  data: Booking;
  boatInfo: Boat;
}) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const changeRating = (newRating: number) => {
    setRating(newRating);
  };
  return (
    <div className="flex md:w-[77%] w-full  justify-center items-center md:p-6 p-2">
      <div className="bg-white rounded-lg">
        <p className="text-black flex items-center justify-center mt-4 font-semibold md:text-xl text-sm mx-6">
          Treatment Received Feedback Form
        </p>
        <div className="md:p-6 sm:p-8 p-6">
          <div className="w-full mt-6">
            <FormWrapper>
              <CommonLabel input="text">{t("input.engine_hours")}</CommonLabel>
              <CommonInput
                type="number"
                name="number"
                id="engineHours"
                placeholder={t("input.engine_hours")}
                value={data["No Adults"]} //Abel this I will change while integrating
                min={1}
                step={1}
                required={true}
              />
            </FormWrapper>
          </div>
          <div className="w-full mt-6">
            <FormWrapper>
              <CommonLabel input="text">{t("input.fuel_left")}</CommonLabel>
              <CommonInput
                type="number"
                name="number"
                id="fuelLeft"
                placeholder="%"
                value={data["No Childs"]} //Abel this I will change while integrating
                step={1}
              />
            </FormWrapper>
          </div>
          <div className="mt-3">
            <p className="text-black mb-2">{t("input.client_happiness")}</p>
            <StarRatings
              rating={rating}
              starRatedColor="#EAAC00"
              starHoverColor="#EAAC00"
              changeRating={changeRating}
              numberOfStars={5}
              starDimension="30px"
              name="rating"
            />
          </div>
          <SubmitButton label="Submit" loading={loading} />
        </div>
      </div>
    </div>
  );
}
