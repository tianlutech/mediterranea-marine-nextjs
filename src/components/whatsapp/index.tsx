"use client";

import CommonInput from "@/components/common/inputs/input";
import CommonCsvInputFile from "@/components/common/inputs/csvFileInput";
import CommonLabel from "../common/containers/label";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import SubmitButton from "../common/containers/submit-button";
import { useState } from "react";
import CommonSelect from "@/components/common/inputs/selectInput";
import * as whatsApp from "@/services/whatsApp.service";
import SendingWhatsAppModal from "../modals/sendingWhatsAppModal";
import { WhatsappTemplate } from "@/models/whatsapp";
import { useFormik } from "formik";
import Papa from "papaparse";
import SimpleButton from "../common/containers/simple-button";

const PRICE = 0.0509; // At 2024-01-29

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative w-full mb-6 md:mb-0">{children}</div>;
};

export default function WhatsAppBulkMessagesForm({
  renderMessage,
}: {
  renderMessage: (message: string) => void;
}) {
  const { t } = useTranslation();
  const phoneNumbers = Array.from({ length: 200 }, (_, index) => `+1${Math.floor(Math.random() * 1000000000)}`);
  const [loading, setLoading] = useState<boolean>(false);
  const [templates, setTemplates] = useState<WhatsappTemplate[]>([]);
  const [templateSelected, setTemplate] = useState<string>("");
  const [inputs, setInputs] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [data, setData] = useState({
    contacts: [] as Record<string, unknown>[],
    csvColumns: [] as string[], // List of columns names on the CSV
    to: "", // Column does contains the phone number to send the message
    fields: {} as Record<string, string>, // Column of the CSV where we select the value
    default: {} as Record<string, string>, // Value that we put if the CSV column is empty
  });

  useEffect(() => {
    whatsApp.getMessagesTemplates().then((data) => {
      setTemplates(data);
    });
  }, [setTemplates]);

  const onSubmit = async () => {
    setLoading(true);

    // setData({ ...data, message: "" });
    // const res = await whatsApp.sendMessage();
    // console.log(">>>>>>res", res);

    // setLoading(false);
  };
  // Every time some value changes we re-render the message
  useEffect(() => {
    if (!message || !data.csvColumns.length) {
      renderMessage("");
    }
    const filledMessage = inputs.reduce(
      (acc, variable) =>
        acc.replace(
          `{{${variable}}}`,
          data.default[variable] ||
            `<span style='color: #999999'>{{${variable}}}</span>`
        ),
      message.replaceAll("\n", "</br>")
    );
    renderMessage(filledMessage);
  }, [message, data, inputs, renderMessage]);

  const downloadCsv = () => {
    // Read the content of the CSV file
    const csvFilePath = "/csv_example.csv";

    fetch(csvFilePath)
      .then((response) => response.text())
      .then((csvContent) => {
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
      .catch((error) => {
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
  };

  const readCSV = async (file: File | null) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = ({ target }) => {
      if (!target || !target.result) {
        return;
      }
      const csv = Papa.parse(target.result as any, {
        header: true,
      });
      setData((data) => ({
        ...data,
        contacts: csv.data as Record<string, string>[],
        csvColumns: csv.meta.fields as string[],
      }));
    };
    reader.readAsText(file);
  };

  const selectTemplate = (value: string) => {
    const template = templates.find((template) => template.id === value);
    setData((data) => ({ ...data, to: "", fields: {}, default: {} }));
    setTemplate(value);
    if (!template) {
      setInputs([]);
      setMessage("");
      return;
    }
    const templateBody = template.components.find(
      (component) => component.type === "BODY"
    );
    const text = templateBody?.text || "";
    const messageVariables = extractPlaceholderVariables(text);

    setInputs(messageVariables);
    setMessage(text);
  };

  const formik = useFormik({
    initialValues: data,
    onSubmit: () => {
      onSubmit();
    },
  });

  return (
    <>
      <SendingWhatsAppModal isOpen={loading} message={""} contacts={phoneNumbers} />
      <div className="flex md:w-[70%] w-full  justify-center items-center md:p-6 p-2">
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
                  // @abel this type here when I put type File it doesn't work
                  onChange={(file) => {
                    readCSV(file);
                  }}
                  required
                />
              </>
              <div className="flex justify-between w-full md:mt-1 mt-0">
                <span
                  onClick={() => downloadCsv()}
                  className="text-base cursor-pointer ml-2 text-blue-500 underline"
                >
                  {t("input.csv_example")}
                </span>
              </div>
              {!!data.csvColumns.length && (
                <div className="w-full mt-12 relative">
                  <FormWrapper>
                    <CommonLabel input="text">
                      {t("input.template")}
                    </CommonLabel>
                    <div className="flex gap-4">
                      <CommonSelect
                        id="template"
                        name="template"
                        data={templates.map((template) => ({
                          label: template.name,
                          value: template.id,
                        }))}
                        value={templateSelected}
                        onChange={(e) => selectTemplate(e.target.value)}
                        required
                      />
                      <SimpleButton
                        label="Manage"
                        onClick={() =>
                          window.open(
                            "   https://business.facebook.com/wa/manage/message-templates/?business_id=2330989420463473&waba_id=157321974140617&filters=%7B%22search_text%22%3A%22%22%2C%22tag%22%3A[]%2C%22language%22%3A[]%2C%22status%22%3A[%22APPROVED%22%2C%22IN_APPEAL%22%2C%22PAUSED%22%2C%22PENDING%22%2C%22REJECTED%22]%2C%22quality%22%3A[]%2C%22date_range%22%3A30%2C%22sort_direction%22%3A%22descending%22%2C%22sort_key%22%3A%22lastUpdatedTime%22%7D",
                            "__blank"
                          )
                        }
                      />
                    </div>
                  </FormWrapper>
                </div>
              )}
              {!!templateSelected && (
                <div className="w-full mt-12 relative">
                  <FormWrapper>
                    <CommonLabel input="text">{t("input.to")}</CommonLabel>
                    <CommonSelect
                      name="to"
                      id="to"
                      data={data.csvColumns}
                      value={data.to}
                      onChange={(e) =>
                        setData((data) => ({
                          ...data,
                          to: e.target.value,
                        }))
                      }
                      placeholder={t("input.select_option")}
                      required
                    />
                  </FormWrapper>

                  <div className="w-full  relative">
                    {inputs.map((variable, index) => (
                      <div key={index} className="mt-8">
                        <FormWrapper>
                          <CommonLabel input="text">{`{{${index + 1
                            }}}`}</CommonLabel>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <CommonSelect
                                name={`parameter-column-${variable}`}
                                id={`parameter-column-${variable}`}
                                data={data.csvColumns}
                                value={data.fields[variable] || ""}
                                onChange={(e) =>
                                  setData((data) => ({
                                    ...data,
                                    fields: {
                                      ...data.fields,
                                      [variable]: e.target.value,
                                    },
                                  }))
                                }
                                placeholder={t("input.select_option")}
                                required
                              />
                            </div>
                            <div className="flex-2">
                              <CommonInput
                                type="text"
                                name={`parameter-default-${variable}`}
                                id={`parameter-default-${variable}`}
                                value={data.default[variable]}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  setData((data) => ({
                                    ...data,
                                    default: {
                                      ...data.default,
                                      [variable]: e.target.value,
                                    },
                                  }))
                                }
                                placeholder={t("input.default_value")}
                                required
                              />
                            </div>
                          </div>
                        </FormWrapper>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col">
                <SubmitButton
                  label={
                    "Send (Cost: ~" +
                    (data.contacts.length * PRICE).toFixed(2) +
                    "€)"
                  }
                  type="submit"
                  loading={loading}
                />
                <a
                  className="text-blue-400 underline"
                  onClick={() =>
                    window.open(
                      "https://scontent.flba3-2.fna.fbcdn.net/v/t39.8562-6/398220152_1524886938273869_1924028791440919138_n.csv?_nc_cat=106&ccb=1-7&_nc_sid=b8d81d&_nc_ohc=dFY5MRY8Iu4AX9nVqUU&_nc_ht=scontent.flba3-2.fna&oh=00_AfCGUd_tDtVmrT1K-H1ZFWK4iBEl45v2fkXWZ5M4LYQHJQ&oe=65BBECD6",
                      "__blank"
                    )
                  }
                >
                  Get latest prices
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}