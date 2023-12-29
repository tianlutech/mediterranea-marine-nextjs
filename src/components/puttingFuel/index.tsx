"use client";

import InfoSvg from "@/assets/svgs/InfoSvg";
import CommonInput from "@/components/common/inputs/input";
import CommonInputFile from "@/components/common/inputs/fileInput";
import CommonLabel from "../common/containers/label";
import React from "react";
import { Boat } from "@/models/models";
import { useTranslation } from "react-i18next";
import StarRatings from "react-star-ratings";
import SubmitButton from "../common/containers/submit-button";
import { useEffect, useState } from "react";
import CommonSelect from "@/components/common/inputs/selectInput";
import { SEABOB } from "@/models/constants";


const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative w-[48%]">{children}</div>;
};

export default function PuttingFuelForm({
  data,
  setData,
  boatInfo,
}: {
  data: any;
  setData: any;
  boatInfo: Boat;
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="flex md:w-[77%] w-full  justify-center items-center md:p-6 p-2">
      <div className="bg-white md:w-[70%] w-full rounded-lg">
        <p className="text-black flex items-center justify-center mt-4 font-semibold md:text-xl text-sm">{t("title.fuel_form")}</p>
        <div className="md:p-6 sm:p-8 p-6">
          <div className="flex justify-between w-full mt-6">
            <FormWrapper>
              <CommonLabel input="text">
                {t("input.date")}
              </CommonLabel>
              <CommonInput
                type="date"
                name="date"
                id="date"
                placeholder={t("input.date")}
                value={data["No Adults"]} //Abel this I will change while integrating
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, "No Adults": e.target.value })
                }
                min={1}
                step={1}
                required={true}
              />
            </FormWrapper>
            <FormWrapper>
              <CommonLabel input="text">
                {t("input.select_boat")}
              </CommonLabel>
              <CommonSelect
                id="boats"
                name="boats"
                data={SEABOB} //Abel this one I will change in integration
                value={data["Fuel Payment"]}
                onChange={(e) =>
                  setData({ ...data, "Fuel Payment": e.target.value })
                }
                required
              />

            </FormWrapper>
          </div>
          <div className="flex justify-between w-full mt-6">
            <FormWrapper>
              <CommonLabel input="text">
                {t("input.amount_paid")}
              </CommonLabel>
              <CommonInput
                type="text"
                name="AmountPaid"
                id="amountpaid"
                placeholder={t("input.amount_paid")}
                value={data["First Name"]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, "First Name": e.target.value })
                }
                required={true}
              />
            </FormWrapper>
            <FormWrapper>
              <CommonLabel input="text">
                {t("input.captain_list")}
              </CommonLabel>
              <CommonSelect
                id="captainlist"
                name="captainList"
                data={SEABOB} //Abel this one I will change in integration
                value={data["Fuel Payment"]}
                onChange={(e) =>
                  setData({ ...data, "Fuel Payment": e.target.value })
                }
                required
              />
            </FormWrapper>
          </div>
          <div className="flex justify-between w-full mt-6">
            <FormWrapper>
              <CommonLabel input="text">
                {t("input.port")}
              </CommonLabel>
              <CommonSelect
                id="port"
                name="port"
                data={SEABOB} //Abel this one I will change in integration
                value={data["Fuel Payment"]}
                onChange={(e) =>
                  setData({ ...data, "Fuel Payment": e.target.value })
                }
                required
              />
            </FormWrapper>
          </div>
          <>
            <CommonInputFile
              name="ID_Front_Picture"
              label={t("input.picture_of_the_receipt")}
              onRemove={() => setData({ ...data, ID_Front_Picture: {} })}
              onChange={(file) => setData({ ...data, ID_Front_Picture: file })}
              required
            />
          </>
          <SubmitButton
            label="Submit"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
