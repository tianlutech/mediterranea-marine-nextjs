import { toast } from "react-toastify";
import { Boat, Booking } from "../../../models/models";
import { uploadFile } from "@/services/googleDrive.service";
import { t } from "i18next";

type StepAction = {
  execute:
  (booking: Booking, boat: Boat) => void
}

export const steps = [
  "fuel",
  "sign",
  "validateFront",
  "uploadFront",
  "validateBack",
  "uploadBack",
  "pay",
];

const storeIdImage = async (
  id: string,
  boatInfo: Boat,
  file: File,
  slag: string
) => {
  const response = await uploadFile(file, boatInfo.Nombre, id, slag);
  if (!response.id) {
    return "";
  }
  const url = `https://drive.google.com/file/d/${response.id}/view`;
  return url;
};

export const stepsActions = ({
  setModalInfo,
  nextStep,
}: {
  setModalInfo: React.Dispatch<React.SetStateAction<{
    modal: string;
    message: string;
    error: string;
  }>>,
  nextStep: () => void;
}): Record<string, StepAction> => {
  const fuel = {
    execute: (booking: Booking, boat: Boat) => {
      if (booking["Fuel Left"] === 0) {
        setModalInfo({ modal: "fuel", message: "", error: "" });
        return;
      }
      nextStep();
    },
  };

  const sign = {
    execute: (booking: Booking, boat: Boat) => {
      setModalInfo({ modal: "sign", message: "", error: "" });
    },
  };
  const uploadPictures = {
    execute: async (booking: Booking, boat: Boat) => {
      setModalInfo({
        modal: "loading",
        message: "Uploading your identity passports",
        error: ""
      });

      // Check if we only require to upload 1 or 2
      const [uploadIdFrontResponse, uploadIdBackImageResponse] =
        await Promise.all([
          storeIdImage(
            booking["ID Number"],
            boat,
            (booking as any)["ID_Front_Picture"] as File,
            "front"
          ),
          storeIdImage(
            booking["ID Number"],
            boat,
            (booking as any)["ID_Back_Picture"] as File,
            "back"
          ),
        ]);

      if (!uploadIdFrontResponse) {
        toast.error(t("error.upload_image"));
        setModalInfo({
          modal: "loading",
          message: "Uploading your front picture",
          error: "Error uploading front picture",
        });
        return;
      }

      if (!uploadIdBackImageResponse) {
        toast.error(t("upload_front_image"));
        setModalInfo({
          modal: "loading",
          message: "Uploading your back picture",
          error: "Error uploading back picture",
        });
        return;
      }
      nextStep();
    },
  };

  return {
    fuel,
    sign,
    uploadPictures,
  };
};
