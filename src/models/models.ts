import moment from "moment";
import { NotionItem, NotionType } from "./notion.model";

export type FileMetadata = {
  name: string;
  mimeType: string;
  parents: string[];
};

export type DataFolder = {
  id: String;
};

export type DriveFolder = {
  data: FileMetadata;
};

export type BookingFormData = {
  Date: Date;
  "First Name": string;
  "Last Name": string;
  NotificationEmail: string;
  "Billing Address": string;
  "No Adults": number;
  "No Childs": number;
  ID_Back_Picture: File;
  ID_Front_Picture: File;
  "Departure Time": string;
  SUP: string;
  SEABOB: string;
  "Fuel Payment": number;
  Comments: string;
  "Restaurant Name": string;
  "Restaurant Time": string;
  signedContract: boolean;
  "ID Number": string;
  documentType: "National ID" | "Passport";
  OutstandingPayment: number;
  CustomerSignature: string;
  DocumentsApproved: boolean;
  SumupCode: string;
  AddressVerified: boolean;
  KidsAge: string;
  Overnight: boolean;
};

export const getBookingName = (booking: {
  ["First Name"]: string;
  ["Last Name"]: string;
  ["Boat"]?: string;
  Date: Date;
}) => {
  return (
    `${booking["First Name"]} ` +
    `${booking["Last Name"]} ${booking["Boat"] || ""} - ${moment
      .utc(booking.Date)
      .format("DD.MM.YY")}`
  );
};

export type SubmitDocumentFormData = {
  "First Name": string;
  "Last Name": string;
  ID_Back_Picture: File;
  ID_Front_Picture: File;
  "ID Number": string;
  CustomerSignature: string;
  DocumentsApproved: boolean;
};

export type SubmitSeaBobOfferFormData = {
  SEABOB: string;
  previousToys?: string[];
  SumupCode: string;
};

export type FileBody = {
  boatName: string;
  slag: string;
  id: string;
  date: string;
};

export class Boat extends NotionItem {
  @NotionType("number")
  "Max.Passengers": number;
  @NotionType("number")
  MilePrice: number = 0;
  @NotionType("rich_text")
  Code: string = "";
  @NotionType("ID")
  ID: string = "";
  @NotionType("rich_text")
  Nombre: string = "";
  @NotionType("rich_text")
  RegistrationPlate: string = "";
  @NotionType("rich_text")
  Crew: string = "";
  @NotionType("url")
  ["Ubicación"]: string = "";
  @NotionType("rich_text")
  ["FolderId"]: string = "";
  // Client Side Injected data Format time HH:mm
  bussySlots: string[] = [];

  @NotionType("select")
  Owner?: string;
}

export type SelectType = {
  label: string;
  value: string;
};

export class Captain extends NotionItem {
  constructor(obj: object = {}) {
    super(obj);
    Object.assign(this, obj);
  }
  @NotionType("title")
  "Name": string = "";

  @NotionType("rich_text")
  "id": string = "";

  Signature: { url: string }[] = [];
}

export class Booking extends NotionItem {
  constructor(obj: Partial<Booking> = {}) {
    super();
    Object.assign(this, obj);
  }

  @NotionType("ID")
  ID: string = "";

  @NotionType("number")
  "Total Payment": number;

  @NotionType("relation")
  Client?: Record<string, unknown>;

  @NotionType("multi_select")
  Toys?: string[];

  @NotionType("number")
  "Payment Deposit": number;

  @NotionType("relation")
  "Whatsapp": string;

  @NotionType("rich_text")
  "Departure Time": string = "";

  @NotionType("rich_text")
  "Captain Feedback": string = "";

  @NotionType("number")
  "Fuel Left": number;

  @NotionType("number")
  "Rate": number;

  @NotionType("number")
  "Engine Hours": number;

  @NotionType("number")
  "No Childs": number;

  @NotionType("date")
  Date?: Date;

  @NotionType("rich_text")
  "First Name": string = "";

  @NotionType("rich_text")
  "notion_id": string = "";

  @NotionType("rich_text")
  "CustomerSignature": string = "";

  @NotionType("rich_text")
  "ID Number": string = "";

  "Total Passengers": number;

  @NotionType("file")
  "ID Front Picture": string;

  @NotionType("file")
  "ID Back Picture": string;

  @NotionType("checkbox")
  AllowFollowUp?: number;

  @NotionType("checkbox")
  DocumentsApproved?: boolean;

  @NotionType("checkbox")
  Overnight?: boolean;

  "Captain": string[];

  @NotionType("number")
  "No Adults": number;

  @NotionType("relation")
  Boat?: string[];

  @NotionType("rich_text")
  "Billing Address": string = "";

  @NotionType("rich_text")
  Comments: string = "";

  @NotionType("rich_text")
  "Last Name": string = "";

  @NotionType("rich_text")
  "Port": string = "";

  @NotionType("email")
  "NotificationEmail": string = "";

  @NotionType("number")
  "Fuel Payment": number;

  @NotionType("number")
  "RentPrice": number;

  @NotionType("rich_text")
  Email: string = "";

  @NotionType("rich_text")
  SumupCode?: string;

  @NotionType("rich_text")
  SumupOfferCode?: string;

  @NotionType("number")
  paymentToys?: number;

  @NotionType("number")
  paymentToysOffer?: number;

  @NotionType("title")
  Name: string = "";

  @NotionType("rich_text")
  "Restaurant Name": string = "";

  @NotionType("date")
  "Restaurant Time"?: string;

  @NotionType("date")
  "SubmittedFormAt": Date;

  @NotionType("date")
  "captainSignedAt": Date;

  @NotionType("date")
  FeedbackFormAt?: Date;

  @NotionType("number")
  OnBoatPayment?: number;

  @NotionType("select")
  OnBoatPaymentMethod: string = "";

  @NotionType("checkbox")
  AddressVerified?: boolean;

  OutstandingPayment?: number;

  BoatLocation: string[] = [];

  public static totalPayment(data: BookingFormData) {
    const supValue = parseInt(data["SUP"] || "0", 10);
    const seaBob = parseInt(data["SEABOB"] || "0", 10);
    const fuelPayment = data["Fuel Payment"] || 0;
    const outStandingPayment = data.OutstandingPayment || 0;

    return (
      Math.max(0, fuelPayment) +
      Math.max(0, supValue) +
      Math.max(0, seaBob) +
      +outStandingPayment
    );
  }
}

export class Fuel extends NotionItem {
  @NotionType("title")
  "Name": string;

  @NotionType("date")
  "Date": string;

  @NotionType("relation")
  "Boat": string;

  @NotionType("relation")
  "Captain": string;

  @NotionType("select")
  "Port": string;

  @NotionType("number")
  "Paid": number;

  @NotionType("file")
  "Receipt": string;
}

export class Bill extends NotionItem {
  @NotionType("title")
  "Name": string;

  @NotionType("date")
  "Date": string;

  @NotionType("relation")
  "Boat": string;

  @NotionType("number")
  "Amount": number;

  @NotionType("files")
  "Bill": string[];

  @NotionType("select")
  "Type": string;
}

export class DepartureTime extends NotionItem {
  constructor(obj: object = {}) {
    super(obj);
    Object.assign(this, obj);
  }
  @NotionType("relation")
  Boat: string[] = [];
  @NotionType("date")
  Date?: Date;
  @NotionType("relation")
  Booking: string[] = [];
}

export const calculateArrivalTime = ({
  date,
  departureTime,
  overnight,
}: {
  date: Date;
  departureTime: string;
  overnight: boolean;
}) => {
  if (!departureTime) {
    return { date: moment.utc(), time: "" };
  }
  if (overnight) {
    return { date: moment.utc(date).add(1, "day"), time: "09:00" };
  }
  // Split the time string into hours and minutes
  var parts = departureTime.split(":");
  var hours = +parts[0];
  var minutes = +parts[1];

  // Add hours
  hours += 8;

  // Ensure that hours do not exceed 24
  if (hours > 21) {
    hours = 21;
    minutes = 0;
  }
  // Formatting hours and minutes to two digits
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Returning the formatted time string
  const time = formattedHours + ":" + formattedMinutes;

  return { time, date: moment.utc(date) };
};
