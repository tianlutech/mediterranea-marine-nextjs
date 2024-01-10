import { toast } from "react-toastify";
import { Boat, Booking, FormData, DepartureTime } from "../../../models/models";
import { uploadFile } from "@/services/googleDrive.service";
import { t } from "i18next";
import {
  SEABOB as SEABOB_TOY,
  STANDUP_PADDLE,
} from "@/models/constants";
import moment from "moment";
import { createTimeSlot, updateBookingInfo } from "@/services/notion.service";

type StepAction = {
  execute:
  (formData: FormData, boat: Boat) => void
}

export const steps = [
  "fuel",
  "sign",
  // "validateFront",
  "uploadFrontIdImage",
  // "validateBack",
  "uploadBackIdImage",
  "pay",
  "saveData"
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
  booking,
  bookingId
}: {
  setModalInfo: React.Dispatch<React.SetStateAction<{
    modal: string;
    message: string;
    error: string;
  }>>,
  nextStep: () => void;
  booking: Booking,
  bookingId: string,
}): Record<string, StepAction> => {
  var imageFrontLink = ""
  var imageBackLink = ""

  const fuel = {
    execute: (formData: FormData, boat: Boat) => {
      setModalInfo({
        modal: "loading",
        message: "Loading fuel modal",
        error: ""
      });
      if (+formData["Fuel Payment"] === 0) {
        setModalInfo({ modal: "fuel", message: "", error: "" });
        return;
      }
      nextStep();
    },
  };

  const sign = {
    execute: (formData: FormData, boat: Boat) => {
      setModalInfo({
        modal: "loading",
        message: "Loading contract modal",
        error: ""
      });
      if (!formData["signedContract"]) {
        setModalInfo({ modal: "sign", message: "", error: "" });
        return
      }
      nextStep();
    },
  };

  const uploadFrontIdImage = {
    execute: async (formData: FormData, boat: Boat) => {
      setModalInfo({
        modal: "loading",
        message: "Uploading front image of your identity",
        error: ""
      });
      if (imageFrontLink !== "") {
        return nextStep();
      }
      const uploadIdFrontResponse =
        await Promise.all([
          storeIdImage(
            formData["ID Number"],
            boat,
            formData["ID_Front_Picture"] as File,
            "front"
          ),
        ]);

      if (!uploadIdFrontResponse) {
        toast.error(t("error.upload_image"));
        setModalInfo({
          modal: "loading",
          message: "Uploading front image of your identity",
          error: "Error uploading front picture",
        });
        return;
      }
      imageFrontLink = uploadIdFrontResponse[0]
      nextStep();
    },
  }

  const uploadBackIdImage = {
    execute: async (formData: FormData, boat: Boat) => {
      setModalInfo({
        modal: "loading",
        message: "Uploading back image of your identity",
        error: ""
      });
      if (imageBackLink !== "") {
        return nextStep();
      }
      const [uploadIdBackImageResponse] =
        await Promise.all([
          storeIdImage(
            formData["ID Number"],
            boat,
            formData["ID_Back_Picture"] as File,
            "back"
          ),
        ]);

      if (!uploadIdBackImageResponse) {
        toast.error(t("error.upload_image"));
        setModalInfo({
          modal: "loading",
          message: "Uploading your back picture",
          error: "Error uploading back picture",
        });
        return;
      }
      imageBackLink = uploadIdBackImageResponse[0]
      nextStep();
    },
  }

  const pay = {
    execute: (formData: FormData, boat: Boat) => {
      setModalInfo({
        modal: "pay",
        message: "",
        error: ""
      });
    },
  };

  // Abel here I used any becuase the Booking was causing errors and same for the FormData
  const saveData = {
    execute: async (formData: any, boat: Boat) => {
      setModalInfo({
        modal: "Saving Data To Notion",
        message: "",
        error: ""
      });

      const {
        ID_Back_Picture,
        ID_Front_Picture,
        SEABOB,
        SUP,
        signedContract,
        ...bookingData
      } = formData;

      const seaBobName = SEABOB_TOY.find((seabob) => seabob.value === SEABOB)?.name || "";
      const paddle = STANDUP_PADDLE.find((sup) => sup.value === SUP)?.name || "";
      const departureTime = moment(
        `${moment(booking.Date).format("YYYY-MM-DD")} ${formData["Departure Time"]}`
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

      /**
       * Create a Time Slot so no one can book at the same time
       */
      createTimeSlot(
        new DepartureTime({
          Booking: [bookingId],
          Boat: [boat.id],
          Date: departureTime,
        })
      );
      if (res === false || res === undefined) {
        toast.error("There has been an error while saving the data")
        return;
      }
      window.location.replace("/success")
    }
  };

  return {
    fuel,
    sign,
    uploadFrontIdImage,
    uploadBackIdImage,
    pay,
    saveData
  };
};