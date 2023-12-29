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

export type FileBody = {
  boatName: string;
  slag: string;
  id: string;
};

export class Boat extends NotionItem {
  @NotionType("number")
  "Max.Passengers": number;
  @NotionType("rich_text")
  MilePrice: string = "";
  @NotionType("rich_text")
  Code: string = "";
  @NotionType("ID")
  ID: string = "";
  @NotionType("rich_text")
  Nombre: string = "";
  @NotionType("rich_text")
  RegistrationPlate: string = "";
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

  @NotionType("rich_text")
  Whatsapp: string = "";

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
  "ID Number": string = "";

  @NotionType("rich_text")
  "Total Passengers": number;

  @NotionType("file")
  "ID Front Picture": string;

  @NotionType("file")
  "ID Back Picture": string;

  @NotionType("checkbox")
  AllowFollowUp: number = 0;

  @NotionType("relation")
  Captain?: Captian;

  @NotionType("number")
  "No Adults": number;

  @NotionType("relation")
  Boat?: string[];

  @NotionType("rich_text")
  "Billing Address": string = "";

  @NotionType("rich_text")
  "Last Name": string = "";

  @NotionType("number")
  "Fuel Payment": number;

  @NotionType("rich_text")
  Email: string = "";

  @NotionType("rich_text")
  Name: string = "";

  @NotionType("rich_text")
  "Restaurant Name": string = "";

  @NotionType("date")
  "Restaurant Time"?: Date;
}
