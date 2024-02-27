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
import { sendMessageWebhook } from "@/services/make.service";

type StepAction = {
  execute: (formData: BookingFormData, boat: Boat) => void;
};

type StepsActionsType = {
  key: string[];
};

const skip_steps = (process.env.NEXT_PUBLIC_SKIP_BOOKING_STEPS || "").split(
  ","
);
// there is an issue here if I put string [] it fails
export const steps: any = [
  // "fuel",
  // "sign",
  "validateFront",
  // "validateBack",
  // "uploadFrontIdImage",
  // "uploadBackIdImage",
  // "pay",
  // "saveData",
  // "notifyCustomer",
].filter((step) => !skip_steps.includes(step));

const storeIdImage = async (
  id: string,
  boatInfo: Boat,
  file: File,
  slag: string
) => {
  const response = await uploadFile(file, boatInfo.Nombre, id, slag);

  if (!response.id) {
    return false;
  }
  const url = `https://drive.google.com/file/d/${response.id}/view`;
  return url;
};

let imageFrontLink = "";
let imageBackLink = "";
let imageFrontValidated = false;
let imageBackValidated = false;
let bookingSaved: Booking;
let failedCounter: number = 0;

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

  const confirmContinue = {
    execute: () => {
      setModalInfo({
        modal: "confirmContinueIdFailed",
        message: "",
        error: "",
      });
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
        failedCounter++;
        if (failedCounter >= 2) {
          steps.splice(steps.indexOf("validateFront") + 1, 0, "confirmContinue");
          steps["confirmContinue"] = confirmContinue;
          nextStep();
          return;
        }
        setModalInfo({
          modal: "loading",
          message: "",
          error: result.error,
        });
        return;
      }
      const bookingInfo = new Booking({
        ...formData,
        DocumentsApproved: !formData.DocumentsApproved
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
        Name:
          `${booking["First Name"]} ` +
          `${booking["Last Name"]} - ${moment(booking.Date).format(
            "YYYY-MM-DD"
          )}`,
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
      bookingSaved = res.booking as Booking;
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

  const notifyCustomer = {
    execute: async (_formData: BookingFormData, boat: Boat) => {
      setModalInfo({
        modal: "loading",
        message: t("loadingMessage.send_webhook_message"),
        error: "",
      });
      const response = await sendMessageWebhook(bookingSaved, boat);
      if ("error" in (response as object)) {
        setModalInfo({
          modal: "loading",
          message: "",
          error:
            (response as { error: string }).error ||
            t("error.error_message_webhook"),
        });
        return;
      }
      nextStep();
    },
  };

  return {
    fuel,
    sign,
    confirmContinue,
    validateFront,
    // validateBack,
    uploadFrontIdImage,
    uploadBackIdImage,
    pay,
    saveData,
    notifyCustomer,
  };
};
