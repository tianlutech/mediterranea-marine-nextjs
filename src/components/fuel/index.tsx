"use client";

import CommonInput from "@/components/common/inputs/input";
import CommonInputFile from "@/components/common/inputs/fileInput";
import CommonLabel from "../common/containers/label";
import React from "react";
import { useTranslation } from "react-i18next";
import SubmitButton from "../common/containers/submit-button";
import { useState } from "react";
import CommonSelect from "@/components/common/inputs/selectInput";
import { PORTS } from "@/models/constants";
import SelectBoat from "../selectBoat/selectBoat";
import SelectCaptain from "../selectCaptain/selectCaptain";
import LoadingModal from "../modals/loadingModal";
import { useFormik } from "formik";
import { uploadReceiptImage } from "@/services/googleDrive.service";
import { toast } from "react-toastify";
import moment from "moment";
import { createFuelRecord } from "../../services/notion.service";
import { Captain, Fuel } from "../../models/models";
import { useRouter, useSearchParams } from "next/navigation";
import { getCaptain } from "@/services/notion.service";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative md:w-[48%] w-full mb-6 md:mb-0">{children}</div>
  );
};

export default function FuelForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const [showPin, setShowPin] = useState(false)
  const [data, setData] = useState({
    Date: moment().format("YYYY-MM-DD"),
    Boat: "",
    "Amount Paid": "",
    Captain: searchParams.get("captainId") || "",
    Port: "",
    "Picture of the Receipt": {} as File,
    Pin: ""
  });

  const storeReceiptImage = async (file: File) => {
    const response = await uploadReceiptImage(file);
    if (!response.id) {
      return "";
    }
    const url = `https://drive.google.com/file/d/${response.id}/view`;
    return url;
  };

  const submitFuelForm = async () => {
    setLoading(true);
    try {
      const { Pin } = await getCaptain(data.Captain) as Captain
      const CaptainPin = Pin.replace(/\n/g, "");

      if (CaptainPin !== data.Pin) {
        return toast.error(t("error.error_captain_pin"))
      }

      const receiptUrl = await storeReceiptImage(
        data["Picture of the Receipt"]
      );
      if (!receiptUrl) {
        toast.error(t("upload_front_image"));
        return;
      }

      const notionObject = new Fuel({
        Name: `${data["Port"]}-${moment(data["Date"]).format("DD-MM-YY")}`,
        Date: data["Date"],
        Paid: +data["Amount Paid"],
        Boat: data["Boat"],
        Captain: data["Captain"] !== "0" ? data["Captain"] : undefined,
        Port: data["Port"],
        Receipt: receiptUrl,
      });

      const res = await createFuelRecord(notionObject);
      if (!res) {
        return;
      }
      router.replace("/success");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: data,
    onSubmit: () => {
      submitFuelForm();
    },
  });

  return (
    <>
      <ToastContainer />
      <div className="flex md:w-[77%] w-full  justify-center items-center md:p-6 p-2">
        <div className="bg-white md:w-[70%] w-full rounded-lg">
          <p className="text-black flex items-center justify-center mt-4 font-semibold md:text-xl text-sm">
            {t("title.fuel_form")}
          </p>
          <form onSubmit={formik.handleSubmit}>
            <div className="md:p-6 sm:p-8 p-6">
              <div className="flex md:flex-row flex-col justify-between w-full mt-6">
                <FormWrapper>
                  <CommonLabel input="text">{t("input.date")}</CommonLabel>
                  <CommonInput
                    type="date"
                    name="date"
                    id="date"
                    placeholder={t("input.date")}
                    value={data["Date"]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setData({ ...data, Date: e.target.value })
                    }
                    min={1}
                    step={1}
                    required={true}
                  />
                </FormWrapper>
                <FormWrapper>
                  <CommonLabel input="text">{t("input.select_boat")}</CommonLabel>
                  <SelectBoat
                    value={data["Boat"]}
                    onChange={(boat) => setData({ ...data, Boat: boat })}
                  />
                </FormWrapper>
              </div>
              <div className="flex md:flex-row flex-col justify-between w-full md:mt-6 mt-0">
                <FormWrapper>
                  <CommonLabel input="text">{t("input.amount_paid")}</CommonLabel>
                  <CommonInput
                    type="text"
                    name="AmountPaid"
                    id="amountpaid"
                    min={10}
                    placeholder={t("input.amount_paid")}
                    value={data["Amount Paid"]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setData({ ...data, "Amount Paid": e.target.value })
                    }
                    required={true}
                  />
                  <p className="text-black absolute z-10 bottom-[0.5rem]  right-[1.2rem]">
                    €
                  </p>
                </FormWrapper>
                <FormWrapper>
                  <CommonLabel input="text">
                    {t("input.captain_list")}
                  </CommonLabel>
                  <SelectCaptain
                    disabled={!!searchParams.get("captainId")}
                    value={data["Captain"]}
                    onChange={(captainId) =>
                      setData({ ...data, Captain: captainId })
                    }
                  />
                </FormWrapper>
              </div>
              <div className="flex md:flex-row flex-col justify-between w-full md:mt-6 mt-0">
                <FormWrapper>
                  <CommonLabel input="text">{t("input.port")}</CommonLabel>
                  <CommonSelect
                    id="port"
                    name="port"
                    data={PORTS}
                    value={data["Port"]}
                    onChange={(e) => setData({ ...data, Port: e.target.value })}
                    required
                  />
                </FormWrapper>
                <FormWrapper>
                  <CommonLabel input="text">{t("input.pin")}</CommonLabel>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 flex items-center px-2">
                      {showPin ?
                        <div onClick={() => setShowPin(!showPin)} className="cursor-pointer">
                          <svg className="h-6 text-gray-700" fill="none" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 512">
                            <path fill="currentColor"
                              d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z">
                            </path>
                          </svg>
                        </div>
                        :
                        <div onClick={() => setShowPin(!showPin)} className="cursor-pointer">
                          <svg className="h-6 text-gray-700" fill="none" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512">
                            <path fill="currentColor"
                              d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z">
                            </path>
                          </svg>
                        </div>
                      }
                    </div>
                    <CommonInput
                      type={showPin ? "text" : "password"}
                      name="pin"
                      id="pin"
                      placeholder={t("input.pin")}
                      value={data.Pin}
                      minlength="6"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setData({ ...data, "Pin": e.target.value })
                      }
                      required={true}
                    />
                  </div>
                </FormWrapper>
              </div>
              <>
                <CommonInputFile
                  name="ID_Front_Picture"
                  label={t("input.picture_of_the_receipt")}
                  onRemove={() =>
                    setData({ ...data, "Picture of the Receipt": {} as File })
                  }
                  // @abel this type here when I put type File it doesn't work
                  onChange={(file: any) =>
                    setData({ ...data, "Picture of the Receipt": file })
                  }
                  required
                />
              </>
              <SubmitButton label="Submit" loading={loading} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
