import { toast } from "react-toastify";
import {
  Boat,
  Booking,
  BookingFormData,
  DepartureTime,
} from "../../../models/models";
import { uploadFile } from "@/services/googleDrive.service";
import { SEABOB as SEABOB_TOY, STANDUP_PADDLE } from "@/models/constants";
import moment from "moment";
import { createTimeSlot, updateBookingInfo } from "@/services/notion.service";
import EdenAIService from "@/services/edenAI.service";

type StepAction = {
  execute: (formData: BookingFormData, boat: Boat) => void;
};

const skip_steps = (process.env.NEXT_PUBLIC_SKIP_BOOKING_STEPS || "").split(
  ","
);
export const steps = [
  "fuel",
  "sign",
  "validateFront",
  "validateBack",
  "uploadFrontIdImage",
  "uploadBackIdImage",
  "pay",
  "saveData",
].filter((step) => !skip_steps.includes(step));

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

let imageFrontLink = "";
let imageBackLink = "";
let imageFrontValidated = false;
let imageBackValidated = false;

export const stepsActions = ({
  setModalInfo,
  nextStep,
  booking,
  bookingId,
  t,
}: {
  setModalInfo: React.Dispatch<
    React.SetStateAction<{
      modal: string;
      message: string;
      error: string;
    }>
  >;
  nextStep: () => void;
  booking: Booking;
  bookingId: string;
  t: (key: string) => string;
}): Record<string, StepAction> => {
  const fuel = {
    execute: (formData: BookingFormData, boat: Boat) => {
      setModalInfo({
        modal: "loading",
        message: t("loadingMessage.loading_fuel_modal"),
        error: "",
      });
      if (+formData["Fuel Payment"] === 0) {
        setModalInfo({ modal: "fuel", message: "", error: "" });
        return;
      }
      nextStep();
    },
  };

  const sign = {
    execute: (formData: BookingFormData, boat: Boat) => {
      setModalInfo({
        modal: "loading",
        message: t("loadingMessage.loading_contract"),
        error: "",
      });
      if (!formData["signedContract"]) {
        setModalInfo({ modal: "sign", message: "", error: "" });
        return;
      }
      nextStep();
    },
  };

  const uploadFrontIdImage = {
    execute: async (formData: BookingFormData, boat: Boat) => {
      setModalInfo({
        modal: "loading",
        message: t("loadingMessage.uploading_front_id"),
        error: "",
      });
      if (imageFrontLink !== "") {
        return nextStep();
      }
      const uploadIdFrontResponse = await storeIdImage(
        formData["ID Number"],
        boat,
        formData["ID_Front_Picture"] as File,
        "front"
      );

      if (!uploadIdFrontResponse) {
        toast.error(t("error.upload_image"));
        setModalInfo({
          modal: "loading",
          message: "",
          error: t("error.error_uploading_front_image"),
        });
        return;
      }
      imageFrontLink = uploadIdFrontResponse;

      nextStep();
    },
  };

  const uploadBackIdImage = {
    execute: async (formData: BookingFormData, boat: Boat) => {
      // No require to upload
      if (formData.documentType === "Passport") {
        nextStep();
        return;
      }
      setModalInfo({
        modal: "loading",
        message: t("loadingMessage.uploading_back_id"),
        error: "",
      });

      // Already uploaded
      if (imageBackLink !== "") {
        return nextStep();
      }
      const uploadIdBackImageResponse = await storeIdImage(
        formData["ID Number"],
        boat,
        formData["ID_Back_Picture"] as File,
        "back"
      );

      if (!uploadIdBackImageResponse) {
        setModalInfo({
          modal: "loading",
          message: "",
          error: t("error.error_uploading_back_image"),
        });
        return;
      }
      imageBackLink = uploadIdBackImageResponse;
      nextStep();
    },
  };

  const validateFront = {
    execute: async (formData: BookingFormData, boat: Boat) => {
      if (imageFrontValidated) {
        nextStep();
        return;
      }

      setModalInfo({
        modal: "loading",
        message: t("loadingMessage.verifying_front_id"),
        error: "",
      });

      const result = await EdenAIService().checkFrontId(
        formData["ID_Front_Picture"] as File,
        formData
      );
      if (result.error) {
        setModalInfo({
          modal: "loading",
          message: "",
          error: result.error,
        });
        return;
      }
      imageFrontValidated = true;
      nextStep();
    },
  };
  const validateBack = {
    execute: async (formData: BookingFormData, boat: Boat) => {
      if (imageBackValidated) {
        nextStep();
        return;
      }
      if (formData.documentType === "Passport") {
        nextStep();
        return;
      }
      setModalInfo({
        modal: "loading",
        message: t("loadingMessage.verifying_back_id"),
        error: "",
      });

      const result = await EdenAIService().checkBackId(
        formData["ID_Back_Picture"] as File,
        formData
      );

      if (result.error) {
        setModalInfo({
          modal: "loading",
          message: "",
          error: result.error,
        });
        return;
      }
      imageBackValidated = true;
      nextStep();
    },
  };
  const pay = {
    execute: (formData: BookingFormData, boat: Boat) => {
      if (!Booking.totalPayment(formData)) {
        nextStep();
      }
      setModalInfo({
        modal: "pay",
        message: "",
        error: "",
      });
    },
  };

  // Abel here I used any becuase the Booking was causing errors and same for the FormData
  const saveData = {
    execute: async (formData: BookingFormData, boat: Boat) => {
      setModalInfo({
        modal: "loading",
        message: t("loadingMessage.saving_information"),
        error: "",
      });

      const {
        ID_Back_Picture,
        ID_Front_Picture,
        SEABOB,
        SUP,
        signedContract,
        ...bookingData
      } = formData;

      const seaBobName =
        SEABOB_TOY.find((seabob) => seabob.value === SEABOB)?.name || "";
      const paddle =
        STANDUP_PADDLE.find((sup) => sup.value === SUP)?.name || "";
      const departureTime = moment(
        `${moment(booking.Date).format("YYYY-MM-DD")} ${formData["Departure Time"]
        }`
      );

      const bookingInfo = new Booking({
        ...bookingData,
        Name: `${boat.Nombre} - ${departureTime.format("DD-MM-YY HH:mm")}`,
        "ID Front Picture": imageFrontLink,
        "ID Back Picture": imageBackLink,
        Toys: [paddle, seaBobName].filter((value) => !!value),
        SubmittedFormAt: new Date(),
      });

      const res = await updateBookingInfo(bookingId, bookingInfo);

      if ((res as { error: string }).error) {
        setModalInfo({
          modal: "loading",
          message: t("loadingMessage.saving_information"),
          error: (res as { error: string }).error,
        });
        return;
      }

      /**
       * Create a Time Slot so no one can book at the same time
       */
      await createTimeSlot(
        new DepartureTime({
          Booking: [bookingId],
          Boat: [boat.id],
          Date: departureTime,
        })
      );

      nextStep();
    },
  };

  return {
    fuel,
    sign,
    validateFront,
    validateBack,
    uploadFrontIdImage,
    uploadBackIdImage,
    pay,
    saveData,
  };
};
