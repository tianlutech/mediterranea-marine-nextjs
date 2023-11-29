// import { Client } from "@notionhq/client";
// import { Boat } from "../models/models";
// import { parseNotionObject } from "../models/notion.model";

// const notionDatabaseId: string | undefined = process.env.NOTION_DATABASE_ID;
// const notionSecret: string | undefined = process.env.NOTION_SECRET;

// // Initialize a new client with the secret
// const notion = new Client({ auth: notionSecret });

// export class NotionService {
//   private notion;
//   private static instance: NotionService;

//   static get() {
//     if (!this.instance) {
//       this.instance = new NotionService();
//     }

//     return this.instance;
//   }

//   private constructor() {
//     if (!notionDatabaseId || !notionSecret) {
//       throw new Error(
//         "Missing required parameters notionDatabaseId pr notionSecret "
//       );
//     }

//     this.notion = new Client({ auth: notionSecret });
//   }

//   public async getBoatInfo(boatId: string) {
//     try {
//       const response = await notion.pages.retrieve({
//         page_id: boatId,
//       });
//       // const data = response.json();
//       return parseNotionObject<Boat>(response);
//     } catch (error) {
//       console.error("Error retrieving page from Notion:", error);
//       return undefined;
//     }
//   }
// }
