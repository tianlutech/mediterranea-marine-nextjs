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
      const EDEN_API_KEY = process.env.NEXT_PUBLIC_EDEN_API_KEY

      const {data} = await axios.post(`${EDEN_URL}/ocr/ocr`, form, {
        headers: {
          Authorization: `Bearer ${EDEN_API_KEY}`,
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

  const verifyIdentity = async (formData: BookingFormData) => {
    const fields = ["First Name", "Last Name", "ID Number"];
    const ocrResultFront = await checkFrontId(formData["ID_Front_Picture"]);
    const ocrResultBack = await checkBackId(formData["ID_Back_Picture"]);
    const missingFields: string[] = [];
  
    fields.forEach((field: string) => {
      const fieldValue = formData[field as keyof BookingFormData] as string;
      if (!(`${ocrResultFront} ${ocrResultBack}`).includes(fieldValue)) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      return {
        error: `${missingFields.join(", ")} ${i18n.t("error.error_field_not_found")}`
      };
    }
  
    return { ok: true };
  };
  

  const checkFrontId = async (
    file: File,
  ): Promise<{ error?: string; ok?: true }> => {
    const result = await checkIdValidity(file);

    if (result.error) {
      return {
        error: result.error,
      };
    }

    const data = result.amazon

    if (!data || data.status !== "success") {
      return { error: i18n.t("error.error_validation_failed") };
    }
    
    return data.text;
  };

  const checkBackId = async (
    file: File,
  ): Promise<{ error?: string; ok?: true }> => {
    const result = await checkIdValidity(file);

    if (result.error) {
      return {
        error: result.error,
      };
    }

    const data = result.amazon

    if (!data || data.status !== "success") {
      return { error: i18n.t("error.error_validation_failed") };
    }
    
    return data.text;
  };
  

  return { verifyIdentity };
};

export default EdenAIService;
