import { IdentityData, IdentityValidation, OCRResult } from "@/models/eden-ia";
import { BookingFormData } from "@/models/models";
import moment from "moment";
import { compareStrings } from "./utils";
import i18n from "@/i18n";

type CheckValidityReturn = Omit<IdentityValidation, "error"> & {
  error: string;
};
const EdenAIService = () => {
  const checkIdValidity = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/edenAI", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();
      return json as CheckValidityReturn;
    } catch (error) {
      console.error("Error retrieving data", error);
      return {
        error: (error as any).message as string,
      } as CheckValidityReturn;
    }
  };

  const verifyFields = (fields: string[], extracted_data: IdentityData) => {
    const error_fields = fields.filter((field) => {
      const data = extracted_data as unknown as Record<
        string,
        OCRResult | OCRResult[]
      >;
      const result = Array.isArray(data[field])
        ? (data[field] as OCRResult[])[0]
        : (data[field] as OCRResult);

      // If is null or empty
      if (!result || result === null) return true;
      // If the ratio is not enough
      return result.confidence < 0.75;
    });
    if (error_fields.length) {
      return {
        error:
          i18n.t("error.error_picture_not_readable") +
          ": " +
          error_fields
            .map((field) => i18n.t(`error.error_eden_ia_${field}`))
            .join(", "),
      };
    }
    return { ok: true };
  };

  const checkFrontId = async (
    file: File,
    formData: BookingFormData
  ): Promise<{ error?: string; ok?: true }> => {
    const front_fields = [
      // "expire_date",
      "last_name",
      "given_names",
      // "document_id",
    ];
    console.log(">>>>>formData", formData)
    const result = await checkIdValidity(file);
    if (result.error) {
      return {
        error: result.error,
      };
    }

    if (!result || result.status !== "success") {
      return { error: i18n.t("error.error_validation_failed") };
    }

    // Check fields
    const [data] = result.extracted_data

    const checkValidity = async (data: string) => {
      return data.includes(formData["First Name"]) && data.includes(formData["Last Name"]);
    }

    const res = checkValidity(data)
    if (!res) {
      let failedTimes = parseInt(localStorage.getItem("failedTimes") || "0");
      failedTimes++;
      localStorage.setItem("failedTimes", failedTimes.toString());
    }

    const checkFields = verifyFields(front_fields, data);
    if (checkFields.error) {
      return checkFields;
    }

    if (moment().isAfter(moment(data.expire_date.value))) {
      return { error: i18n.t("error.error_document_expired") };
    }

    if (formData.documentType === "Passport") {
      if (data.document_type.value !== "PASSPORT") {
        return {
          error: i18n.t("error.error_document_type_not_passport"),
        };
      }
    }

    if (formData.documentType === "National ID") {
      if (!["ID", "DRIVER LICENSE"].includes(data.document_type.value)) {
        return {
          error: i18n.t("error.error_document_type_not_national_id"),
        };
      }
    }

    if (!compareStrings(formData["ID Number"], data.document_id.value)) {
      return {
        error:
          i18n.t("error.error_id_written_in_form_different_with_image") +
          data.document_id.value,
      };
    }

    if (
      !compareStrings(formData["First Name"], data.given_names[0].value) &&
      !compareStrings(formData["Last Name"], data.given_names[0].value)
    ) {
      return {
        error:
          i18n.t("error.error_name_written_in_form_different_with_image") +
          " " +
          data.given_names[0].value,
      };
    }

    if (
      !compareStrings(formData["Last Name"], data.last_name.value) &&
      !compareStrings(formData["First Name"], data.last_name.value)
    ) {
      return {
        error:
          i18n.t("error.error_last_name_written_in_form_different_with_image") +
          " " +
          data.last_name.value,
      };
    }

    return { ok: true };
  };

  const checkBackId = async (
    file: File,
    formData: BookingFormData
  ): Promise<{ error?: string; ok?: true }> => {
    const result = await checkIdValidity(file);

    if (result.error) {
      return {
        error: result.error,
      };
    }
    if (!result || result.status !== "success") {
      return {
        error: i18n.t("error.error_validation_failed"),
      };
    }

    const [data] = result.extracted_data;

    if (
      !["ID", "DRIVER LICENSE"].some((tag) =>
        (data.document_type.value || "").includes(tag)
      )
    ) {
      return {
        error: i18n.t("error.error_document_type_not_national_id"),
      };
    }

    if (data.document_id.value) {
      if (!compareStrings(formData["ID Number"], data.document_id.value)) {
        return {
          error:
            i18n.t("error.error_id_written_in_form_different_with_image") +
            data.document_id.value,
        };
      }
    }
    if (data.expire_date.value) {
      if (moment().isAfter(moment(data.expire_date.value))) {
        return { error: i18n.t("error.error_document_expired") };
      }
    }

    return { ok: true };
  };

  return { checkFrontId };
};

export default EdenAIService;