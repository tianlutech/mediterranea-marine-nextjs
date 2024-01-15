"use client";

import CommonInput from "../common/inputs/input";
import CommonCheckbox from "../common/inputs/checkbox";
import CommonLabel from "../common/containers/label";
import React from "react";
import { Boat, Booking } from "../../models/models";
import { useTranslation } from "react-i18next";
import StarRatings from "react-star-ratings";
import SubmitButton from "../common/containers/submit-button";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { updateBookingInfo } from "../../services/notion.service";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CommonSelect from "@/components/common/inputs/selectInput";
import { PAYMENT_METHODS } from "@/models/constants";

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
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    "Fuel Left": "",
    "Engine Hours": "",
    Rate: 0,
    "Captain Feedback": "",
    AllowFollowUp: true,
    OnBoatPayment: 0,
    OnBoatPaymentMethod: "",
  });

  const changeRating = (newRating: number) => {
    setFormData({ ...formData, Rate: newRating });
  };

  const formik = useFormik({
    initialValues: formData,
    onSubmit: () => {
      submitFeedBack();
    },
  });

  const submitFeedBack = async () => {
    setLoading(true);
    try {
      if (!formData.Rate) {
        toast.error(t("feedback.rate_required"));
        return;
      }
      const data = {
        ...formData,
        "Fuel Left": +formData["Fuel Left"] / 100,
        FeedbackFormAt: new Date(),
      };
      const booking = new Booking(data as unknown as Booking);
      const res = await updateBookingInfo(id, booking);

      if (res === false) {
        return;
      }
      router.replace("/success");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex md:w-[77%] w-full  justify-center items-center md:p-6 p-2">
      <div className="bg-white rounded-lg">
        <p className="text-black flex items-center justify-center mt-4 font-semibold md:text-xl text-sm mx-6">
          {t("title.feed_back_form")}
        </p>
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
                    setFormData({
                      ...formData,
                      "Engine Hours": e.target.value,
                    })
                  }
                  min={1}
                  step={1}
                  required={true}
                />
              </FormWrapper>
            </div>
            <div className="w-full mt-6 relative">
              <FormWrapper>
                <CommonLabel input="text">
                  {t("input.fuel_left") + " %"}
                </CommonLabel>
                <CommonInput
                  type="number"
                  name="number"
                  id="fuelLeft"
                  placeholder={"50"}
                  value={formData["Fuel Left"]}
                  min={1}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const inputValue: number = +e.target.value;

                    // Check if the entered value is a valid number and not more than 100
                    if (
                      !isNaN(inputValue) &&
                      inputValue >= 0 &&
                      inputValue <= 100
                    ) {
                      setFormData({
                        ...formData,
                        "Fuel Left": inputValue.toString(),
                      });
                    }
                  }}
                  step={1}
                />
              </FormWrapper>
              <p className="text-black absolute z-10 bottom-[0.6rem] right-[1rem]">
                %
              </p>
            </div>
            <div className="w-full mt-6 relative">
              <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 bottom-[2.8rem] bg-white left-4 px-2">
                {t("input.general_comments")}
              </label>{" "}
              <textarea
                id="message"
                className="block p-2.5 w-full text-sm text-black rounded-lg border border-gray-300"
                placeholder=""
                value={formData["Captain Feedback"]}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({
                    ...formData,
                    "Captain Feedback": e.target.value,
                  })
                }
              ></textarea>
            </div>
            <div className="w-full mt-6 relative">
              <FormWrapper>
                <CommonLabel input="text">
                  {t("input.on_boat_payment_amount")}
                </CommonLabel>
                <CommonInput
                  type="number"
                  name="On Boat Payment"
                  id="OnBoatPayment"
                  placeholder={t("input.on_boat_payment_amount")}
                  value={formData["OnBoatPayment"]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, "OnBoatPayment": +e.target.value })
                  }
                  min={1}
                  step={1}
                  required={true}
                />
              </FormWrapper>
            </div>
            <div className="relative w-full mt-6">
              <CommonLabel input="select">
                {t("input.payment_method")}
              </CommonLabel>
              <CommonSelect
                id="paymentMethods"
                name="paymentMethods"
                data={PAYMENT_METHODS.map(item => ({
                  label: t(`select_options.${item}`),
                  value: item
                }))}
                value={formData["OnBoatPaymentMethod"]}
                onChange={(e) =>
                  setFormData({ ...formData, "OnBoatPaymentMethod": e.target.value })
                }
                required
              />
            </div>
            <div className="relative mt-3">
              <p className=" text-black mb-2">{t("input.client_happiness")}</p>
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
                <CommonCheckbox
                  id="checked-checkbox"
                  checked={formData.AllowFollowUp}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      AllowFollowUp: !formData.AllowFollowUp,
                    })
                  }
                  name={"AllowFollowUp"}
                />
                <label className="ms-2 text-sm text-black">
                  {t("input.recommendation_text")}
                </label>
              </div>
            </div>
            <SubmitButton label="Submit" loading={loading} />
          </div>
        </form>
      </div>
    </div>
  );
}
