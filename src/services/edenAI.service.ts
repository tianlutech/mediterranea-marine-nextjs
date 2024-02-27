import { IdentityValidation } from "@/models/eden-ia";
import { BookingFormData } from "@/models/models";
import moment from "moment";
import { compareStrings } from "./utils";
import i18n from "@/i18n";
import axios from "axios";

type CheckValidityReturn = Omit<IdentityValidation, "error"> & {
  error: string;
};
const EdenAIService = () => {
  const checkIdValidity = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // const response = await fetch("/api/edenAI", {
      //   method: "POST",
      //   body: formData,
      // });
      const form = new FormData();
      form.append("providers", "amazon");
      form.append("file", file);
      form.append("language", "en");
      const EDEN_URL = "https://api.edenai.run/v2";

      const {data} = await axios.post(`${EDEN_URL}/ocr/ocr`, form, {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTk4YTNiZjgtY2RiNy00Y2I2LWFkZWQtOGM5ZmY1ZTkwMWJkIiwidHlwZSI6ImFwaV90b2tlbiJ9.S0tTZ_th-mP7i8MLBHYHhbRvQZVW4wVmtge6z-nEPuE",
          "Content-Type": "multipart/form-data;",
        },
      });

      return data;
    } catch (error) {
      console.error("Error retrieving data", error);
      return {
        error: (error as any).message as string,
      } as CheckValidityReturn;
    }
  };

  const verifyFields = (formData: BookingFormData, extracted_data: {text: string}) => {
    const res = extracted_data.text.includes(
      formData["First Name"] &&
      formData["Last Name"] &&
      formData["ID Number"] 
      )

    if(!res) {
      return {
        error: i18n.t("error.error_picture_not_readable") 
      };
    }
    
    return { ok: true };
  };

  const checkFrontId = async (
    file: File,
    formData: BookingFormData
  ): Promise<{ error?: string; ok?: true }> => {
    const result = await checkIdValidity(file);

    if (result.error) {
      return {
        error: result.error,
      };
    }

    const {amazon} = result

    if (!amazon || amazon.status !== "success") {
      return { error: i18n.t("error.error_validation_failed") };
    }

    // Check fields
    const checkFields = verifyFields(formData, amazon);
    if (checkFields.error) {
      return checkFields;
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

  return { checkFrontId, checkBackId };
};

export default EdenAIService;
