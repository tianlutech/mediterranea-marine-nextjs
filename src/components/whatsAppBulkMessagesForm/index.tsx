"use client";

import CommonInput from "@/components/common/inputs/input";
import CommonCsvInputFile from "@/components/common/inputs/csvFileInput";
import CommonLabel from "../common/containers/label";
import React from "react";
import { useTranslation } from "react-i18next";
import SubmitButton from "../common/containers/submit-button";
import { useState } from "react";
import CommonSelect from "@/components/common/inputs/selectInput";
import { WHATAPP_MESSAGE_TEMPLATE } from "@/models/constants";
import SelectBoat from "../selectBoat/selectBoat";
import SelectCaptain from "../selectCaptain/selectCaptain";
import LoadingModal from "../modals/loadingModal";
import { useFormik } from "formik";
import { uploadReceiptImage } from "@/services/googleDrive.service";
import { toast } from "react-toastify";
import moment from "moment";
import { createFuelRecord } from "../../services/notion.service";
import { Fuel } from "../../models/models";
import { useRouter, useSearchParams } from "next/navigation";

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full mb-6 md:mb-0">{children}</div>
  );
};

export default function WhatsAppBulkMessagesForm() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<any>({})
  const [messageVariables, setMessageVariables] = useState<string[]>([])
  const [data, setData] = useState({
    Date: moment().format("YYYY-MM-DD"),
    Boat: "",
    "Amount Paid": "",
    Captain: searchParams.get("captainId") || "",
    Port: "",
    "Picture of the Receipt": {} as File,
  });
  const formik = useFormik({
    initialValues: data,
    onSubmit: () => {
      console.log(">>>>>>>submittingForm")
    },
  });

  const downloadCsv = () => {
    // Read the content of the CSV file
    const csvFilePath = "/csv_example.csv";

    fetch(csvFilePath)
      .then(response => response.text())
      .then(csvContent => {
        // Create a Blob from the CSV content
        const blob = new Blob([csvContent], { type: "text/csv" });

        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "csv_example.csv";

        // Append the link to the document and trigger the download
        document.body.appendChild(link);
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error("Error downloading CSV file:", error);
      });
  };

  const extractPlaceholderVariables = (template: string) => {
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const matches = [];

    // Use exec to find all matches in the template
    let match;
    while ((match = placeholderRegex.exec(template)) !== null) {
      matches.push(match[1].trim()); // Trim to handle spaces around placeholders
    }

    return matches;
  }

  const getMessage = (value: string) => {
    setSelectedMessage(value)
    const messageVariables = extractPlaceholderVariables(value);
    setMessageVariables(messageVariables)
  }

  return (
    <div className="flex md:w-[60%] w-full  justify-center items-center md:p-6 p-2">
      <div className="bg-white md:w-[70%] w-full rounded-lg">
        <p className="text-black flex items-center justify-center mt-4 font-semibold md:text-xl text-sm">
          {t("title.whatsapp_form")}
        </p>
        <form onSubmit={formik.handleSubmit}>
          <div className="md:p-6 sm:p-8 p-6">
            <>
              <CommonCsvInputFile
                name="csv_file"
                label={t("input.upload_csv")}
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
            <div className="flex justify-between w-full md:mt-1 mt-0">
              <span onClick={() => downloadCsv()} className="text-base cursor-pointer ml-2 text-blue-500 underline">
                {t("input.csv_example")}
              </span>
            </div>
            <div className="w-full mt-6 relative">
              <FormWrapper>
                <CommonLabel input="text">{t("input.template")}</CommonLabel>
                <CommonSelect
                  id="template"
                  name="template"
                  data={WHATAPP_MESSAGE_TEMPLATE}
                  value={selectedMessage}
                  onChange={(e) => getMessage(e.target.value)}
                  required
                />
              </FormWrapper>
            </div>
            <div className="w-full mt-3 relative">
              {messageVariables.length > 0 &&
                messageVariables.map((variable, index) => (
                  <div key={index} className="mt-2">
                    <FormWrapper>
                      <CommonInput
                        type="text"
                        name={variable}
                        id={variable}
                        placeholder={`{{${variable}}}`}
                        required
                      />
                    </FormWrapper>
                  </div>
                ))}
            </div>
            <SubmitButton label="Send" loading={loading} />
          </div>
        </form>
      </div>
    </div>
  );
}
