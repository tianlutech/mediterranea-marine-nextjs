"use client";

import InfoSvg from "@/assets/svgs/InfoSvg";
import CommonInput from "@/components/common/inputs/input";
import CommonInputFile from "@/components/common/inputs/fileInput";
import CommonLabel from "../common/containers/label";
import React from "react";
import { Boat, Booking } from "@/models/models";
import { useTranslation } from "react-i18next";
import StarRatings from "react-star-ratings";
import SubmitButton from "../common/containers/submit-button";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { updateBookingInfo } from "@/services/notion.service";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>;
};

export default function FeedbackForm({
  data,
  boatInfo,
  id,
}: {
  data: Booking;
  boatInfo: Boat;
  id: string;
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    "Fuel Left": 0,
    "Engine Hours": 0,
    Rate: 0,
    "Captain Feedback": "",
    AllowFollowUp: true
  })
  const router = useRouter();
  const changeRating = (newRating: number) => {
    setFormData({ ...formData, Rate: newRating })
  };

  const formik = useFormik({
    initialValues: formData,
    onSubmit: () => {
      submitFeedBack();
    },
  });

  const submitFeedBack = async () => {
    setLoading(true)

    const booking = new Booking(formData as unknown as Booking);
    const res = await updateBookingInfo(id, booking);
    if (res === false) {
      return;
    }
    router.replace("/success");
  }
  return (
    <div className="flex md:w-[77%] w-full  justify-center items-center md:p-6 p-2">
      <div className="bg-white rounded-lg">
        <p className="text-black flex items-center justify-center mt-4 font-semibold md:text-xl text-sm mx-6">Treatment Received Feedback Form</p>
        <form onSubmit={formik.handleSubmit}>
          <div className="md:p-6 sm:p-8 p-6">
            <div className="w-full mt-6">
              <FormWrapper>
                <CommonLabel input="text">
                  {t("input.engine_hours")}
                </CommonLabel>
                <CommonInput
                  type="number"
                  name="number"
                  id="engineHours"
                  placeholder={t("input.engine_hours")}
                  value={formData["Engine Hours"]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, "Engine Hours": e.target.value })
                  }
                  min={1}
                  step={1}
                  required={true}
                />
              </FormWrapper>
            </div>
            <div className="w-full mt-6">
              <FormWrapper>
                <CommonLabel input="text">
                  {t("input.fuel_left")}
                </CommonLabel>
                <CommonInput
                  type="number"
                  name="number"
                  id="fuelLeft"
                  placeholder="%"
                  value={formData["Fuel Left"]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const inputValue: number = e.target.value;

                    // Check if the entered value is a valid number and not more than 100
                    if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 100) {
                      setFormData({ ...formData, "Fuel Left": inputValue });
                    }
                  }}
                  step={1}
                />

              </FormWrapper>
            </div>
            <div className="relative w-full mt-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 bottom-[2.8rem] bg-white left-4 px-2">
                {t("input.general_comments")}
              </label>{" "}
              <textarea
                id="message"
                className="block p-2.5 w-full text-sm text-black rounded-lg border border-gray-300"
                placeholder=""
                value={formData["Captain Feedback"]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, "Captain Feedback": e.target.value })
                }
                required
              ></textarea>
            </div>
            <div className="mt-3">
              <p className="text-black mb-2">
                {t("input.client_happiness")}
              </p>
              <StarRatings
                rating={formData.Rate}
                starRatedColor="#EAAC00"
                starHoverColor="#EAAC00"
                changeRating={changeRating}
                numberOfStars={5}
                starDimension="30px"
                name="rating"
              />
            </div>
            <div className="mt-3">
              <div className="flex items-center">
                <input
                  id="checked-checkbox"
                  checked={formData.AllowFollowUp}
                  type="checkbox"
                  onChange={() =>
                    setFormData({ ...formData, AllowFollowUp: !formData.AllowFollowUp })
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="ms-2 text-sm text-black">
                  {t("input.recommendation_text")}
                </label>
              </div>
            </div>
            <SubmitButton
              label="Submit"
              loading={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
