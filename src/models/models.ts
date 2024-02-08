import { NotionItem, NotionType } from "./notion.model";

export type Captian = NotionItem & {};

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
};

export type FileBody = {
  boatName: string;
  slag: string;
  id: string;
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

  // Client Side Injected data Format time HH:mm
  bussySlots: string[] = [];
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
  Toys?: String[];

  @NotionType("number")
  "Payment Deposit": number = 0;

  @NotionType("relation")
  Whatsapp: string[] = [];

  @NotionType("rich_text")
  "Departure Time": string = "";

  @NotionType("rich_text")
  "Captain Feedback": string = "";

  @NotionType("number")
  "Fuel Left": number = 0;

  @NotionType("number")
  "Rate": number = 0;

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

  Captain: string[] = [];

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

  @NotionType("number")
  "Fuel Payment": number;

  @NotionType("rich_text")
  Email: string = "";

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
  OnBoatPayment: number = 0;

  @NotionType("select")
  OnBoatPaymentMethod: string = "";

  OutstandingPayment?: number;

  BoatLocation: string[] = [];

  public static totalPayment(data: BookingFormData) {
    return (
      Math.max(0, +data["Fuel Payment"]) +
      Math.max(0, +data["SUP"]) +
      Math.max(0, +data["SEABOB"]) +
      +data.OutstandingPayment
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
