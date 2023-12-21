import { NotionItem } from "./notion.model";

export type Captian = NotionItem & {};

export type FileMetadata = {
  name: string;
  mimeType: string;
  parents: string[];
}

export type DataFolder = {
  id: String
}

export type DriveFolder = {
  data: FileMetadata
}


export type FileBody = {
  boatName: string;
  slag: string;
  id: string
}

export type Boat = NotionItem & {
  "Max.Passengers": number;
  MilePrice: string;
  Code: string;
  ID: string;
  Nombre: string;
  RegistrationPlate: string;
};

export type FileData = { name: string; url: ""; type: "file" | "external" };

export type Booking = NotionItem & {
  ID: string;
  "Total Payment": number;
  Client: Record<string, unknown>;
  Toys: String[];
  "Payment Deposit": number;
  Whatsapp: string;
  "Departure Time": string;
  "Fuel left": number;
  "Engine Hours": number;
  "No Childs": number;
  Date: Date;
  "First Name": string;
  "ID Number": string;
  "Total Passengers": number;
  "ID Front Picture": FileData;
  "ID Back Picture": FileData;
  Rate: number;
  Captain: Captian;
  "No Adults": number;
  Boat: Boat;
  "Billing Address": string;
  "Last Name": string;
  "Fuel Payment": number;
  SUP: string;
  SEABOB: string;
  Email: string;
  Name: string;
  "Restaurant Name": string;
  "Restaurant Time": Date;
};
