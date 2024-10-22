"use client";

import CommonInput from "@/components/common/inputs/input";
import CommonPdfInputFile from "@/components/common/inputs/pdfInput";
import CommonLabel from "../common/containers/label";
import React from "react";
import { useTranslation } from "react-i18next";
import SubmitButton from "../common/containers/submit-button";
import { useState } from "react";
import CommonSelect from "@/components/common/inputs/selectInput";
import SelectBoat from "../selectBoat/selectBoat";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import moment from "moment";
import { createBillRecord } from "../../services/notion.service";
import { Bill } from "../../models/models";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadPDFDocument } from "@/services/googleDrive.service";
import {
  getBoatInfo,
} from "@/services/notion.service";
interface Data {
  "pdfFile": File;
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
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const types = ["Charter", "Boat"]
  const [error, setError] = useState<string>("");
  const [data, setData] = useState({
    Date: moment.utc().format("YYYY-MM-DD"),
    Boat: "",
    Type: "",
    Amount: "",
    pdfFile: {} as File,
  });

  const storeBillPdf = async (file: File, data: Data) => {
    try {
      const [boatDetails] = await Promise.all([
        getBoatInfo(data.Boat)
      ]);

      if (!boatDetails) {
        setError(t("error.error_boat_details"));
        return;
      }
      const updatedData = { ...data, Boat: boatDetails["Nombre"] };
      const response = await uploadPDFDocument(file, updatedData);
      if (!response?.id) {
        return "";
      }

      // Generate Google Drive URL for the uploaded PDF
      const url = `https://drive.google.com/file/d/${response.id}/view`;
      return url;
    } catch (error) {
      console.error("Error storing the PDF:", error);
      return "";
    }
  };

  const submitUploadBillForm = async () => {
    setLoading(true);
    try {
      if (!data["pdfFile"].name) {
        toast.error(t("upload_front_image"));
        setLoading(false);
        return;
      }

      // Upload the bill PDF file and get the URL
      const billUrl = await storeBillPdf(data["pdfFile"], data);

      if (!billUrl) {
        toast.error(t("upload_front_image"));
        return;
      }

      const notionObject = new Bill({
        Name: `${data["Boat"]}-${moment(data["Date"]).format("DD-MM-YY")}`,
        Date: data["Date"],
        Amount: +data["Amount"],
        Boat: data["Boat"],
        Type: data["Type"],
        Bill: billUrl,
      });

      const res = await createBillRecord(notionObject);
      if (!res) {
        toast.error(t("record_creation_failed"));
        return;
      }

      // Redirect to the success page
      router.replace("/success");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: data,
    onSubmit: () => {
      submitUploadBillForm();
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
                  <CommonLabel input="text">
                    {t("input.select_boat")}
                  </CommonLabel>
                  <SelectBoat
                    value={data["Boat"]}
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
                    min={10}
                    placeholder={t("input.amount_paid")}
                    value={data["Amount"]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setData({ ...data, "Amount": e.target.value })
                    }
                    required={true}
                  />
                  <p className="text-black absolute z-10 bottom-[0.5rem]  right-[1.2rem]">
                    €
                  </p>
                </FormWrapper>
                <FormWrapper>
                  <CommonLabel input="text">
                    {t("input.type")}
                  </CommonLabel>
                  <CommonSelect
                    id="type"
                    name="type"
                    value={data["Type"]}
                    onChange={(e) =>
                      setData({ ...data, "Type": e.target.value })
                    }
                    data={types}
                    required
                  />
                </FormWrapper>
              </div>
              <>
                <CommonPdfInputFile
                  name="Pdf_Bill"
                  label={t("input.picture_of_the_receipt")}
                  onRemove={() =>
                    setData({ ...data, "pdfFile": {} as File })
                  }
                  // @abel this type here when I put type File it doesn't work
                  onChange={(file: any) =>
                    setData({ ...data, "pdfFile": file })
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
