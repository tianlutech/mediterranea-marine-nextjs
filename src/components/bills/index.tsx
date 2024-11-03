"use client";

import React, { useState } from "react";
import CommonInput from "@/components/common/inputs/input";
import CommonPdfInputFile from "@/components/common/inputs/pdfInput";
import CommonLabel from "../common/containers/label";
import SubmitButton from "../common/containers/submit-button";
import CommonSelect from "@/components/common/inputs/selectInput";
import SelectBoat from "../selectBoat/selectBoat";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import { createBillRecord } from "../../services/notion.service";
import { Bill, Boat } from "../../models/models";
import { uploadBill } from "@/services/googleDrive.service";
import { getBoatInfo } from "@/services/notion.service";
import * as Sentry from "@sentry/nextjs";
import "react-toastify/dist/ReactToastify.css";
import { sendBillInfoMessageWebhook } from "@/services/make.service";
import { useTranslation } from "react-i18next";

interface Data {
  pdfFile: File;
  Date: string;
  Amount: string;
  Boat: string;
  Type: string;
}

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative md:w-[48%] w-full mb-6 md:mb-0">{children}</div>
  );
};

export default function UploadBillForm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [key, setKey] = useState(0);
  var fileId = "";
  const types = ["Charter/Apa", "Owner"];
  const initialState: Data = {
    Date: moment.utc().format("YYYY-MM-DD"),
    Boat: "",
    Type: "",
    Amount: "",
    pdfFile: {} as File,
  };

  const [data, setData] = useState(initialState);
  var boatInfo = {} as Boat;
  const storeBillPdf = async (file: File, data: Data) => {
    try {
      const [boatDetails] = await Promise.all([getBoatInfo(data.Boat)]);
      if (!boatDetails) {
        toast.error("Error fetching boat details");
        return "";
      }
      boatInfo = boatDetails;
      const fileName = `${boatDetails["Nombre"]}-${data.Date}-${data.Type}-${data.Amount}`;
      const response = await uploadBill(
        file,
        fileName,
        boatDetails["FolderId"]
      );
      if (!response?.id) {
        return "";
      }
      fileId = response.id;
      const url = `https://drive.google.com/file/d/${response.id}/view`;
      return url;
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error storing the PDF:", error);
      return "";
    }
  };

  const submitUploadBillForm = async () => {
    setLoading(true);
    try {
      if (!data["pdfFile"].name) {
        toast.error("Please upload a valid PDF file");
        setLoading(false);
        return;
      }

      const billUrl = await storeBillPdf(data["pdfFile"], data);

      if (!billUrl) {
        toast.error("Error uploading the bill file");
        return;
      }
      const notionObject = new Bill({
        Name: `${boatInfo["Nombre"]}-${moment(data["Date"]).format(
          "DD-MM-YY"
        )}`,
        Date: data["Date"],
        Amount: +data["Amount"],
        Boat: data["Boat"],
        Type: data["Type"],
        Bill: billUrl,
      });

      const res = await createBillRecord(notionObject);
      if (!res) {
        toast.error("Failed to create the record");
        return;
      }

      sendBillInfoMessageWebhook({
        file: fileId,
        boatName: boatInfo["Nombre"],
        date: data["Date"],
        Type: data["Type"],
        Amount: (+data["Amount"]).toFixed(2),
        boatOwner: boatInfo["Owner"],
      });
      toast.success("Successfully uploaded!");

      setData(initialState);
      setKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: data,
    onSubmit: submitUploadBillForm,
  });

  return (
    <>
      <ToastContainer />
      <div className="flex md:w-[77%] w-full justify-center items-center md:p-6 p-2">
        <div className="bg-white md:w-[70%] w-full rounded-lg">
          <p className="text-black flex items-center justify-center mt-4 font-semibold md:text-xl text-sm">
            {t("title.upload_bill_form")}
          </p>
          <form key={key} onSubmit={formik.handleSubmit}>
            <div className="md:p-6 sm:p-8 p-6">
              <div className="flex md:flex-row flex-col justify-between w-full mt-6">
                <FormWrapper>
                  <CommonLabel input="text">{t("input.date")}</CommonLabel>
                  <CommonInput
                    type="date"
                    name="date"
                    id="date"
                    placeholder="Select date"
                    value={data.Date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setData({ ...data, Date: e.target.value })
                    }
                    min={1}
                    step={1}
                    required
                  />
                </FormWrapper>
                <FormWrapper>
                  <CommonLabel input="text">
                    {t("input.select_boat")}
                  </CommonLabel>
                  <SelectBoat
                    value={data.Boat}
                    onChange={(boat) => setData({ ...data, Boat: boat })}
                  />
                </FormWrapper>
              </div>
              <div className="flex md:flex-row flex-col justify-between w-full md:mt-6 mt-0">
                <FormWrapper>
                  <CommonLabel input="text">
                    {t("input.amount_paid")}
                  </CommonLabel>
                  <CommonInput
                    type="text"
                    name="AmountPaid"
                    id="amountpaid"
                    placeholder="Enter amount"
                    value={data.Amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setData({ ...data, Amount: e.target.value })
                    }
                    required
                  />
                  <p className="text-black absolute z-10 bottom-[0.5rem] right-[1.2rem]">
                    €
                  </p>
                </FormWrapper>
                <FormWrapper>
                  <CommonLabel input="text">{t("input.type")}</CommonLabel>
                  <CommonSelect
                    id="type"
                    name="type"
                    value={data.Type}
                    onChange={(e) => setData({ ...data, Type: e.target.value })}
                    data={types}
                    required
                  />
                </FormWrapper>
              </div>
              <CommonPdfInputFile
                name="Pdf_Bill"
                label={t("input.picture_of_the_receipt")}
                onRemove={() => setData({ ...data, pdfFile: {} as File })}
                onChange={(file: any) => setData({ ...data, pdfFile: file })}
                required
              />
              <SubmitButton label="Submit" loading={loading} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
