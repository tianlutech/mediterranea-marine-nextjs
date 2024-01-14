import { IdentityData, IdentityValidation, OCRResult } from "@/models/eden-ia";
import { BookingFormData } from "@/models/models";
import moment from "moment";
import { compareStrings } from "./utils";

const checkIdValidity = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/edenAI", {
      method: "POST",
      body: formData,
    });

    const json = (await response.json()) as IdentityValidation;

    return json;
  } catch (error) {
    console.error("Error retrieving data", error);
    return { error: error as string } as IdentityValidation;
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
        "The picture is not readible, the next fields are not recognized " +
        error_fields.join(","),
    };
  }
  return { ok: true };
};

export const checkFrontId = async (
  file: File,
  formData: BookingFormData
): Promise<{ error?: string; ok?: true }> => {
  const front_fields = [
    "expire_date",
    "last_name",
    "given_names",
    // "document_id",
  ];

  const result = await checkIdValidity(file);
  if (result.error) {
    return {
      error: result.error,
    };
  }
  if (!result || result.status !== "success") {
    return { error: "The Id validation failed, please upload another picture" };
  }

  // Check fields
  const [data] = result.extracted_data;

  const checkFields = verifyFields(front_fields, data);
  if (checkFields.error) {
    return checkFields;
  }

  if (moment().isAfter(moment(data.expire_date.value))) {
    return { error: "Your document is expired hence not valid" };
  }

  if (formData.documentType === "Passport") {
    if (data.document_type.value !== "PASSPORT") {
      return {
        error: "This document type doesn't match the type selected: Passport",
      };
    }
  }

  if (formData.documentType === "National ID") {
    if (!["ID", "DRIVER LICENSE"].includes(data.document_type.value)) {
      return {
        error: "This document type doesn't match the type selected National ID",
      };
    }
  }

  if (!compareStrings(formData["ID Number"], data.document_id.value)) {
    return {
      error:
        "The ID written in the form doesn't with your uploaded document " +
        data.document_id.value,
    };
  }

  if (!compareStrings(formData["First Name"], data.given_names[0].value)) {
    return {
      error:
        "The name written in the form doesn't with your uploaded document " +
        data.given_names[0].value,
    };
  }

  if (!compareStrings(formData["Last Name"], data.last_name.value)) {
    return {
      error:
        "The last name written in the form doesn't with your uploaded document " +
        data.last_name.value,
    };
  }

  return { ok: true };
};

export const checkBackId = async (
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
      error: "The Id validation failed, please upload another picture",
    };
  }

  const [data] = result.extracted_data;

  if (!["ID", "DRIVER LICENSE"].includes(data.document_type.value)) {
    return {
      error: "This document type doesn't match the type selected National ID",
    };
  }

  if (data.document_id.value) {
    if (!compareStrings(formData["ID Number"], data.document_id.value)) {
      return {
        error:
          "The ID written in the form doesn't with your uploaded document " +
          data.document_id.value,
      };
    }
  }
  if (data.expire_date.value) {
    if (moment().isAfter(moment(data.expire_date.value))) {
      return { error: "Your document is expired hence not valid" };
    }
  }

  return { ok: true };
};
