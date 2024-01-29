"use client";

import InfoSvg from "@/assets/svgs/InfoSvg";
import CommonInput from "@/components/common/inputs/input";
import CommonInputFile from "@/components/common/inputs/fileInput";
import CommonLabel from "../../common/containers/label";
import React, { useState } from "react";
import ErrorMessage from "./errorMessage";
import { Boat, BookingFormData } from "../../../models/models";
import { useTranslation } from "react-i18next";
import PlaceAutoComplete from "../../common/inputs/addressAutoComplete";

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative w-[48%]">{children}</div>;
};

export default function BookingForm1({
  data,
  setData,
  formik,
  boatInfo,
}: {
  data: BookingFormData;
  setData: any;
  formik: any;
  boatInfo: Boat;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex md:flex-row flex-col md:w-[49%] w-full">
      <div className="w-full bg-white rounded-lg">
        <div className="md:p-6 sm:p-8 p-6">
          <div className="flex justify-between w-full">
            <FormWrapper>
              <CommonLabel input="text" error={formik.errors["First Name"]}>
                {t("input.first_name")}
              </CommonLabel>
              <CommonInput
                type="text"
                name="FirstName"
                id="firstname"
                placeholder={t("input.first_name")}
                value={data["First Name"]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, "First Name": e.target.value })
                }
                required={true}
              />
              <ErrorMessage formik={formik} name="First Name" />
            </FormWrapper>
            <FormWrapper>
              <CommonLabel input="text" error={formik.errors["Last Name"]}>
                {t("input.last_name")}
              </CommonLabel>
              <CommonInput
                type="text"
                name="Last Name"
                id="lastname"
                placeholder={t("input.last_name")}
                value={data["Last Name"]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, "Last Name": e.target.value })
                }
                required={true}
              />
              <ErrorMessage formik={formik} name="Last Name" />
            </FormWrapper>
          </div>
          <div className="mt-6 flex items-baseline">
            <div className="flex items-center mb-4">
              <input
                id="default-radio-1"
                type="radio"
                value="nationalId"
                checked={data.documentType === "National ID"}
                name="document-radio"
                onChange={() =>
                  setData({ ...data, documentType: "National ID" })
                }
                required
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              />
              <label className="ms-2 md:text-base text-sm  text-black">
                {t("input.national_id")}
              </label>
            </div>
            <div className="flex items-center ml-10">
              <input
                id="eat-radio-1"
                type="radio"
                value="passport"
                checked={data.documentType === "Passport"}
                name="document-radio"
                onChange={() => setData({ ...data, documentType: "Passport" })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              />
              <label className="ms-2 md:text-base text-sm  text-black">
                {t("input.passport")}
              </label>
            </div>
          </div>
          <div className="relative w-full mt-6">
            <CommonLabel input="text" error={formik.errors["ID Number"]}>
              {t("input.id_number")}
            </CommonLabel>
            <CommonInput
              type="text"
              name="ID Number"
              id="idnumber"
              placeholder={t("input.id_number")}
              value={data["ID Number"]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setData({ ...data, "ID Number": e.target.value })
              }
              required={true}
            />
            <ErrorMessage formik={formik} name="ID Number" />
          </div>

          <>
            <CommonInputFile
              name="ID_Front_Picture"
              label={t("input.ID_Front_Picture")}
              onRemove={() => setData({ ...data, ID_Front_Picture: {} })}
              onChange={async (file) => {
                setData({ ...data, ID_Front_Picture: file || {} });
              }}
              required
            />
            <ErrorMessage formik={formik} name="ID_Front_Picture" />
          </>
          {data.documentType === "National ID" && (
            <>
              <CommonInputFile
                name="ID_Back_Picture"
                label={t("input.ID_Back_Picture")}
                onRemove={() => setData({ ...data, ID_Back_Picture: {} })}
                onChange={async (file) => {
                  setData({ ...data, ID_Back_Picture: file || {} });
                }}
                required
              />
              <ErrorMessage formik={formik} name="ID_Back_Picture" />
            </>
          )}

          <div className="relative w-full mt-6">
            <CommonLabel input="text" error={formik.errors["Last Name"]}>
              {t("input.billing_address")}
            </CommonLabel>
            <PlaceAutoComplete
              setLatLng={(position: {
                lat: number;
                lng: number;
                address: string;
              }) => {
                setData({ ...data, "Billing Address": position.address });
              }}
            />
          </div>
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
                  setData({ ...data, "No Adults": e.target.value })
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, "No Childs": e.target.value })
                }
                step={1}
              />
            </FormWrapper>
          </div>
          <div className="mt-6 text-black flex">
            <div>
              <InfoSvg />
            </div>
            <span className="text-sm ml-2">
              {t("input.boat_passenger_info1")} {boatInfo["Max.Passengers"]}{" "}
              {t("input.boat_passenger_info2")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
