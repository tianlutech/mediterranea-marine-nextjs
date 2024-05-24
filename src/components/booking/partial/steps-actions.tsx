import {
  Boat,
  Booking,
  BookingFormData,
  DepartureTime,
  getBookingName,
  SubmitDocumentFormData,
  SubmitSeaBobOfferFormData,
} from "../../../models/models";
import { uploadFile } from "@/services/googleDrive.service";
import {
  SEABOB as SEABOB_TOY,
  STANDUP_PADDLE,
  SEABOB_OFFER,
} from "@/models/constants";
import moment from "moment";
import { createTimeSlot, updateBookingInfo } from "@/services/notion.service";
import EdenAIService from "@/services/edenAI.service";
import {
  sendMessageWebhook,
  sendDavidSeabobOfferMessageWebhook,
} from "@/services/make.service";

const MAX_IA_VALIDATION_ATTEMPTS = 1;
type StepAction = {
  execute: (formData: BookingFormData, boat: Boat) => void;
};

const storeIdImage = async (
  id: string,
  boatInfo: Boat,
  file: File,
  slag: string,
  bookingDate: string
) => {
  const response = await uploadFile(
    file,
    boatInfo.Nombre,
    id,
    slag,
    bookingDate
  );

  if (!response.id) {
    return false;
  }
  const url = `https://drive.google.com/file/d/${response.id}/view`;
  return url;
};

let imageFrontLink = "";
let imageBackLink = "";
let frontOCRResult = "";
let ocrError = "";
let backOCRResult = "";
let identityValidated = false;
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
        "front",
        `${moment(booking.Date).format("YYYY-MM-DD")}`
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
        "back",
        `${moment(booking.Date).format("YYYY-MM-DD")}`
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
      if (identityValidated) {
        nextStep();
        return;
      }
      ocrError = "";

      setModalInfo({
        modal: "loading",
        message: t("loadingMessage.uploading_front_id"),
        error: "",
      });
      const result = await EdenAIService().checkIdValidity(
        formData.ID_Front_Picture
      );
      frontOCRResult = result.text || "";
      ocrError = result.error || "";

      nextStep();
    },
  };

  const validateBack = {
    execute: async (formData: BookingFormData, boat: Boat) => {
      if (identityValidated) {
        nextStep();
        return;
      }
      if (formData.documentType === "Passport") {
        nextStep();
        return;
      }
      if (ocrError) {
        nextStep();
        return;
      }

      setModalInfo({
        modal: "loading",
        message: t("loadingMessage.uploading_back_id"),
        error: "",
      });

      const result = await EdenAIService().checkIdValidity(
        formData.ID_Back_Picture
      );
      backOCRResult = result.text || "";
      ocrError = result.error || "";

      nextStep();
    },
  };

  const confirmContinue = {
    execute: async (formData: BookingFormData, boat: Boat) => {
      if (identityValidated) {
        nextStep();
        return;
      }
      identityValidated = false;
      // Error from API call
      if (ocrError) {
        failedCounter++;
        setModalInfo({
          modal:
            failedCounter > MAX_IA_VALIDATION_ATTEMPTS
              ? "continueWithoutApproval"
              : "loading",
          message:
            failedCounter > MAX_IA_VALIDATION_ATTEMPTS
              ? t("loadingMessage.verifying_continue_on_error")
              : t("loadingMessage.verifying_id"),
          error: ocrError,
        });
        return;
      }

      const result = await EdenAIService().verifyIdentity(
        formData,
        `${frontOCRResult} ${backOCRResult}`
      );

      if ((result as { error: string }).error) {
        failedCounter++;
        setModalInfo({
          modal:
            failedCounter > MAX_IA_VALIDATION_ATTEMPTS
              ? "continueWithoutApproval"
              : "loading",
          message:
            failedCounter > MAX_IA_VALIDATION_ATTEMPTS
              ? t("loadingMessage.verifying_continue_on_error")
              : t("loadingMessage.verifying_id"),
          error: (failedCounter > MAX_IA_VALIDATION_ATTEMPTS
            ? result.error
            : t("loadingMessage.verifying_id_error") +
              "<br/><br/>" +
              result.error) as string,
        });
        return;
      }
      identityValidated = true;
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
        SEABOB_TOY.find((seabob) => seabob.value === SEABOB);
      const paddle =
        STANDUP_PADDLE.find((sup) => sup.value === SUP);
      const departureTime = moment(
        `${moment(booking.Date).format("YYYY-MM-DD")} ${
          formData["Departure Time"]
        }`
      );

      const bookingInfo = new Booking({
        ...bookingData,
        paymentToys: [paddle?.value, seaBobName?.value].reduce( (total, value) =>   value? total + +value: total , 0) as number,
        Name: getBookingName(formData),
        "ID Front Picture": imageFrontLink,
        "ID Back Picture": imageBackLink,
        Toys: [paddle?.name, seaBobName?.name].filter((value) => !!value) as string[],
        SubmittedFormAt: new Date(),
        DocumentsApproved: identityValidated,
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

  const saveDataOnValidation = {
    execute: async (formData: SubmitDocumentFormData, boat: Boat) => {
      setModalInfo({
        modal: "loading",
        message: t("loadingMessage.saving_information"),
        error: "",
      });

      const { ID_Back_Picture, ID_Front_Picture, ...bookingData } = formData;

      const bookingInfo = new Booking({
        Name: getBookingName({ ...formData, Date: booking.Date as Date }),
        "First Name": bookingData["First Name"],
        "ID Number": bookingData["ID Number"],
        "Last Name": bookingData["Last Name"],
        "ID Front Picture": imageFrontLink,
        "ID Back Picture": imageBackLink,
        DocumentsApproved: identityValidated,
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
      nextStep();
    },
  };

  const saveDataOnSeabobOffer = {
    execute: async (formData: SubmitSeaBobOfferFormData, boat: Boat) => {
      setModalInfo({
        modal: "loading",
        message: t("loadingMessage.saving_information"),
        error: "",
      });

      const { SEABOB, ...bookingData } = formData;
      const seaBobName =
        SEABOB_OFFER.find((seabob) => seabob.value === SEABOB);

      const bookingInfo = new Booking({
        Toys: [
          ...(formData.previousToys || []),
          ...[seaBobName?.name].filter((value) => !!value) as string[],
        ],
        SumupOfferCode:  formData.SumupCode,
        paymentToysOffer: seaBobName ? +seaBobName.value : 0
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

  const notifyDavidAboutSeabobOffer = {
    execute: async (_formData: BookingFormData, boat: Boat) => {
      setModalInfo({
        modal: "loading",
        message: t("loadingMessage.notifying_the_company"),
        error: "",
      });

      const response = await sendDavidSeabobOfferMessageWebhook(bookingSaved);
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
    validateBack,
    uploadFrontIdImage,
    uploadBackIdImage,
    pay,
    saveDataOnValidation,
    saveData,
    saveDataOnSeabobOffer,
    notifyCustomer,
    notifyDavidAboutSeabobOffer,
  };
};
