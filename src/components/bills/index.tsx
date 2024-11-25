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
import { jsPDF } from "jspdf";
import "react-toastify/dist/ReactToastify.css";
import { sendBillInfoMessageWebhook } from "@/services/make.service";
import { useTranslation } from "react-i18next";

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
  const types = ["Charter/Apa", "Owner", "Boat"];
  const initialState: Data = {
    Date: moment.utc().format("YYYY-MM-DD"),
    Boat: "",
    Type: "",
    Amount: "",
    pdfFiles: [],
  };

  const [data, setData] = useState(initialState);
  var boatInfo = {} as Boat;

  const convertImagesToSeparatePdfs = async (images: File[]): Promise<File[]> => {
    try {
      const pdfFiles: File[] = [];

      for (const image of images) {
        const pdf = new jsPDF();
        const imageData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });

        pdf.addImage(imageData, "JPEG", 10, 10, 180, 240);
        const pdfBlob = pdf.output("blob");
        const pdfFile = new File([pdfBlob], `${image.name.split(".")[0]}.pdf`, {
          type: "application/pdf",
        });
        pdfFiles.push(pdfFile);
      }

      return pdfFiles;
    } catch (error) {
      console.error("Error converting images to separate PDFs:", error);
      return [];
    }
  };

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

      const pdfFiles = await convertImagesToSeparatePdfs(data["pdfFiles"]);

      if (pdfFiles.length === 0) {
        toast.error("Error converting files to PDFs");
        setLoading(false);
        return;
      }

      const fileIds: string[] = [];

      for (const pdfFile of pdfFiles) {
        const billUrl = await storeBillPdf(pdfFile, data);

        if (!billUrl) {
          toast.error(`Error uploading the file: ${pdfFile.name}`);
          continue;
        }

        fileIds.push(billUrl);

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
          toast.error(`Failed to create record for file: ${pdfFile.name}`);
          continue;
        }
      }

      if (fileIds.length > 0) {
        sendBillInfoMessageWebhook({
          files: fileIds,
          boatName: boatInfo["Nombre"],
          date: data["Date"],
          Type: data["Type"],
          Amount: (+data["Amount"]).toFixed(2),
          boatOwner: boatInfo["Owner"] || "",
        });
        toast.success("Successfully uploaded all files!");
      } else {
        toast.error("No files were successfully processed");
      }

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
                onChange={(files: File[]) => {
                  setData({ ...data, pdfFiles: files });
                }}
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
