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
import RadioInput from "@/components/common/inputs/radioInput";
import { validateAddress } from "@/services/google.service";
import CommonCheckbox from "@/components/common/inputs/checkbox";
import Spinner from "@/components/common/containers/spinner";

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative w-[48%]">{children}</div>;
};

export default function BookingForm1({
  data,
  setData,
  formik,
}: {
  data: BookingFormData;
  setData: any;
  formik: any;
}) {
  const { t } = useTranslation();
  const [addressCheck, setAddressCheck] = useState({ dirty: false, loading: false })

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
            <RadioInput
              id="default-radio-1"
              className="mb-4"
              inputName="id-document"
              label={t("input.national_id")}
              onChange={() => setData({ ...data, documentType: "National ID" })}
              checked={data.documentType === "National ID"}
            />
            <RadioInput
              id="passport-default-radio-1"
              className="ml-10"
              inputName="id-document"
              label={t("input.passport")}
              onChange={() => setData({ ...data, documentType: "Passport" })}
              checked={data.documentType === "Passport"}
            />
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
              {t("input.email_address")}
            </CommonLabel>
            <CommonInput
              type="email"
              name="NotificationEmail"
              id="notification_email"
              placeholder={t("input.email_address")}
              value={data["NotificationEmail"]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setData({ ...data, NotificationEmail: e.target.value })
              }
              required={true}
            />
            <ErrorMessage formik={formik} name="ID Number" />
          </div>
          <div className="mt-3 mb-6 text-black flex">
            <div>
              <InfoSvg />
            </div>
            <span className="text-sm ml-2">{t("input.email_info")}</span>
          </div>
          <div className="flex items-center w-full">
            <div className="relative w-full mt-6">
              <CommonLabel input="text" error={formik.errors["Last Name"]}>
                {t("input.billing_address")}
              </CommonLabel>
              <PlaceAutoComplete
                placeholder={t("input.address-placeholder")}
                required={true}
                setLatLng={(position: {
                  lat: number;
                  lng: number;
                  address: string;
                }) => {
                  setAddressCheck({ dirty: false, loading: true })
                  validateAddress(position.address).then(valid => {
                    setData({ ...data, "Billing Address": position.address, AddressVerified: valid });
                    setAddressCheck({ dirty: !valid, loading: false })
                  })
                }}
              />
            </div>
            {addressCheck.loading && (<div className="mt-6 px-4"><Spinner size={4} /></div>)}
          </div>

          {addressCheck.dirty && (<div className="w-full mt-6">
            <div className="pt-2">
              {/* We dont mind about keeping the value, the `required` is enough to force the user check the checkbox */}
              <CommonCheckbox required id="manual-valid-address" name="manual-valid-address" /> <span className="text-black">
                {t("input.manual-valid-address")}
              </span>
            </div>
          </div>)}
        </div>
      </div>
    </div>
  );
}
