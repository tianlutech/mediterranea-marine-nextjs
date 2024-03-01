import { BookingFormData } from "@/models/models";
import i18n from "@/i18n";

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
      if (json?.error?.includes("429")) {
        return { error: i18n.t("error.429") };
      }

      return json;
    } catch (error) {
      console.error("Error retrieving data", error);
      return {
        error: (error as any).message as string,
      };
    }
  };

  const verifyIdentity = async (
    formData: BookingFormData,
    ocrResult: string
  ) => {
    const fields = ["First Name", "Last Name", "ID Number"];
    ocrResult = ocrResult.toLowerCase().replaceAll(/\s/g, "");
    const missingFields = fields
      .filter((field: string) => {
        const fieldValue = formData[field as keyof BookingFormData] as string;
        const values = fieldValue.toLowerCase().split(" "); // Compose names and surnames

        return !values.every((value) => ocrResult.includes(value));
      })
      .map((field) => i18n.t(`error.${field}`));

    if (missingFields.length > 0) {
      return {
        error: `${i18n.t("error.error_field_not_found")}: ${missingFields.join(
          ", "
        )}. `,
      };
    }

    return { ok: true };
  };

  return { verifyIdentity, checkIdValidity };
};

export default EdenAIService;
