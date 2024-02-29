"use client";

import CommonInput from "@/components/common/inputs/input";
import CommonInputFile from "@/components/common/inputs/fileInput";
import CommonLabel from "../common/containers/label";
import React from "react";
import { useTranslation } from "react-i18next";
import SubmitButton from "../common/containers/submit-button";
import { useState } from "react";
import { useFormik } from "formik";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative md:w-[48%] w-full mb-6 md:mb-0">{children}</div>
  );
};

export default function VerificationForm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState({
    "First Name": "",
    "Last Name": "",
    "ID Number": "",
    documentType: "National ID",
    ID_Front_Picture: {} as File,
    ID_Back_Picture: {} as File,
  });

  const submitVerificationForm = async () => {
    setLoading(true);
    console.log(">>>>>>>>Info", data)
  };

  const formik = useFormik({
    initialValues: data,
    onSubmit: () => {
      submitVerificationForm();
    },
  });

  if (!data || !formik) {
    return;
  }

  return (
    <>
      <ToastContainer />
      <div className="flex md:w-[77%] w-full  justify-center items-center md:p-6 p-2">
        <div className="bg-white md:w-[70%] w-full rounded-lg">
          <p className="text-black flex items-center justify-center mt-4 font-semibold md:text-xl text-sm">
            {t("title.verification_form")}
          </p>
          <form onSubmit={formik.handleSubmit}>
            <div className="md:p-6 sm:p-8 p-6">
              <div className="flex justify-between w-full">
                <FormWrapper>
                  <CommonLabel input="text">
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
                </FormWrapper>
                <FormWrapper>
                  <CommonLabel input="text">
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
                <CommonLabel input="text">
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
              </div>
              <>
                <CommonInputFile
                  name="ID_Front_Picture"
                  label={t("input.ID_Front_Picture")}
                  onRemove={() => setData({ ...data, ID_Front_Picture: {} as File })}
                  onChange={async (file) => {
                    setData({ ...data, ID_Front_Picture: file || {} as File });
                  }}
                  required
                />
              </>
              {data.documentType === "National ID" && (
                <>
                  <CommonInputFile
                    name="ID_Back_Picture"
                    label={t("input.ID_Back_Picture")}
                    onRemove={() => setData({ ...data, ID_Back_Picture: {} as File })}
                    onChange={async (file) => {
                      setData({ ...data, ID_Back_Picture: file || {} as File });
                    }}
                    required
                  />
                </>
              )}
              <SubmitButton label="Submit" loading={loading} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}