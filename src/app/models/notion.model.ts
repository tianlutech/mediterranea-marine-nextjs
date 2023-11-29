import { FileData } from "./models";
export type NotionProperty = { type: string } & Record<string, unknown>;

export type NotionFile = {
  name: string;
  type: "file" | "external";
  file?: {
    url: string;
    expiry_time: Date;
  };
  external?: {
    url: string;
  };
};
export type NotionPage = {
  id: string;
  properties: Record<string, NotionProperty>;
};

export const parseNotionObject = <Type>(notionObject: NotionPage): Type => {
  const object = Object.keys(notionObject.properties).reduce((obj, key) => {
    obj[key] = parseNotionProperty(notionObject.properties[key]);
    return obj;
  }, {} as Record<string, unknown>);

  return object as Type;
};

const parseNotionProperty = (property: NotionProperty): unknown => {
  switch (property.type) {
    case "number":
      return property["number"] as number;
    case "rich_text":
      return (property["rich_text"] as Array<{ text: { content: string } }>)
        .map((textItem) => textItem.text.content)
        .join(" ");
    case "date":
      return new Date(
        (property["date"] as { start: string; end: string })?.start
      );
    case "relation":
      return (property["relation"] as Array<{ id: string }>).map(
        (relation) => relation.id
      );
    case "multi_select":
      return (property["multi_select"] as Array<{ name: string }>).map(
        (relation) => relation.name
      );
    case "files":
      return (property["files"] as Array<NotionFile>).map((file) => ({
        name: file.name,
        url: file[file.type]?.url,
      }));
    default:
      return "";
  }
};

export const parseObjectToNotion = <T extends Record<string, unknown>>(
  item: Partial<T>
): Record<string, NotionProperty> => {
  const keys = Object.keys(item);
  const object = keys.reduce((obj, key) => {
    obj[key] = parsePropertyToNotion(item[key]);
    return obj;
  }, {} as Record<string, NotionProperty>);

  return object;
};

const parsePropertyToNotion = (
  property: unknown | ({ type: string } & Record<string, unknown>)
): NotionProperty => {
  // This is a multi_select
  if (
    Array.isArray(property) &&
    property.every((item) => typeof item === "string")
  ) {
    return {
      type: "multi_select",
      multi_select: property.map((item) => ({
        name: item,
      })),
    };
  }

  if (property instanceof Date) {
    return {
      type: "date",
      date: { start: property },
    };
  }

  const { type } = property as { type: string };
  if (typeof type === "string") {
    if (type === "external") {
      return {
        type: "files",
        files: [property],
      };
    }
  }

  if (typeof property === "object") {
    return {
      type: "relation",
      relation: property,
    };
  }

  if (typeof property === "number") {
    return {
      type: "number",
      number: +property,
    };
  }

  // if (typeof property === "select") {
  //   return {
  //     type: "select",
  //     select: property,
  //   };
  // }

  // Default case
  // if (typeof property === "string") {
  return {
    type: "rich_text",
    rich_text: [
      {
        type: "text",
        text: { content: property },
      },
    ],
  };
};
