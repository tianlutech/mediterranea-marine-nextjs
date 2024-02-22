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
import SecretInput from "../common/inputs/secretInput";

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
                  <SecretInput
                    data={data}
                    setData={setData}
                  />
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
