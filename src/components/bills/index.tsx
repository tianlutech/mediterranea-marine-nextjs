import React, { useState } from "react";
import CommonInput from "@/components/common/inputs/input";
import CommonUploadMultiplePictures from "@/components/common/inputs/multipleImages";
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
import { useTranslation } from "react-i18next";
import {
  compressImageIfNeeded,
  convertImagesToSeparatePdfs,
  driveIdToUrl,
  rotateImageIfNeeded,
} from "@/services/utils";
import { sendBillInfoMessageWebhook } from "@/services/make.service";
interface Data {
  pdfFiles: File[];
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
  const types = ["Charter&Apa", "Owner", "Boat"];
  const initialState: Data = {
    Date: moment.utc().format("YYYY-MM-DD"),
    Boat: "",
    Type: "",
    Amount: "",
    pdfFiles: [],
  };

  const [data, setData] = useState(initialState);
  var boatInfo = {} as Boat;

  const storeBillPdf = async ({
    file,
    data,
    boatDetails,
  }: {
    file: File;
    data: Data;
    boatDetails: Boat;
  }) => {
    try {
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
      const url = `${response.id}`;
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
      if (!data["pdfFiles"] || data["pdfFiles"].length === 0) {
        toast.error("Please upload valid PDF files");
        setLoading(false);
        return;
      }

      const pdfFiles = await Promise.all(
        data["pdfFiles"].map(async (file) => {
          if (file.type === "application/pdf") {
            return file;
          }
          const rotatedFile = await rotateImageIfNeeded(file, "vertical");
          const compressedFile = await compressImageIfNeeded(rotatedFile);
          return convertImagesToSeparatePdfs(compressedFile);
        })
      );

      if (pdfFiles.length === 0) {
        toast.error("Error converting files to PDFs");
        setLoading(false);
        return;
      }

      const [boatDetails] = await Promise.all([getBoatInfo(data.Boat)]);
      if (!boatDetails) {
        toast.error("Error fetching boat details");
        return "";
      }
      if (!boatDetails["FolderId"]) {
        toast.error("This boat doesn't have a folder id setup in notion");
        return "";
      }
      const filesUploads = await Promise.all<string | null>(
        pdfFiles.map(async (pdfFile) => {
          const billId = await storeBillPdf({
            file: pdfFile,
            data,
            boatDetails,
          });
          if (!billId) {
            toast.error(`Error uploading the file: ${pdfFile.name}`);
            return null;
          }
          return billId;
        })
      );

      const fileIds = filesUploads.filter((id) => id !== null);

      if (fileIds.length === 0) {
        toast.error("No files were successfully processed");
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
        Bill: fileIds.map((id) => driveIdToUrl(id)),
      });

      const res = await createBillRecord(notionObject);

      if (!res) {
        toast.error("Failed to create Notion record");
        return;
      }

      toast.success(
        "Successfully uploaded all files and created Notion record!"
      );

      sendBillInfoMessageWebhook({
        files: fileIds,
        boatName: boatInfo["Nombre"],
        date: data["Date"],
        Type: data["Type"],
        Amount: (+data["Amount"]).toFixed(2),
        boatOwner: boatInfo["Owner"] || "",
      });
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
                    type="number"
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
              <CommonUploadMultiplePictures
                name="Pdf_Bill"
                label={t("input.picture_of_the_receipt")}
                onChange={(files: any) => {
                  setData({ ...data, pdfFiles: files });
                }}
                required
                maxSize={20}
              />
              <SubmitButton label="Submit" loading={loading} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
