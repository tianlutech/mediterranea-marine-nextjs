import moment from "moment";
import { isArray } from "util";

export type NotionType =
  | "ID"
  | "title"
  | "cover"
  | "number"
  | "rich_text"
  | "date"
  | "files"
  | "relation"
  | "select"
  | "multi_select"
  | "title"
  | "files"
  | "file"
  | "formula"
  | "emoji"
  | "checkbox";

export type NotionProperty = { type: NotionType } & Record<string, unknown>;

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
  cover: NotionProperty;
  icon: NotionProperty;
};

/**
 * To be use as decorator
 * @param type =
 * @returns
 */
export const NotionType = (type: NotionType) => {
  return function (target: any, key: any) {
    // console.log({ target, key });
    const metadataKey = Symbol("notion");
    target[metadataKey] = target[metadataKey] || {};
    target[metadataKey][key] = type;
    // Reflect.defineProperty(target.constructor, key, { value: "value" });
  };
};

export class NotionItem {
  id: string = "";
  cover: string = "";
  icon: string = "";

  constructor(obj: object = {}) {
    Object.assign(this, obj);
  }
  getNotionTypes() {
    // Get all symbols associated with the instance
    const symbols = Object.getOwnPropertySymbols(
      Object.getPrototypeOf(this) as any
    );

    // Retrieve values associated with each symbol
    const symbolValues = symbols.map((symbol) => {
      const data = (this as any)[symbol];
      return {
        property: Object.keys(data)[0] as string,
        type: Object.values(data)[0] as string,
      };
    });

    return symbolValues;
  }
  getNotionType(propertyName: string): string | undefined {
    const symbolValues = this.getNotionTypes();
    return symbolValues.find((value) => value.property === propertyName)?.type;
  }
}

export const parseNotionObject = <Type extends NotionItem>(
  instance: Type,
  notionObject: NotionPage
): Type => {
  const object = Object.keys(notionObject.properties).reduce((obj, key) => {
    obj[key] = parseNotionProperty(notionObject.properties[key]);
    return obj;
  }, instance as Record<string, unknown>);

  object.icon = parseNotionProperty(notionObject.icon);
  object.cover = parseNotionProperty(notionObject.cover);
  object.id = notionObject.id;

  return object as Type;
};

const parseNotionProperty = (property: NotionProperty): unknown => {
  if (!property) {
    return "";
  }
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
    case "emoji":
      return property["emoji"];
    case "relation":
      return (property["relation"] as Array<{ id: string }>).map(
        (relation) => relation.id
      );
    case "multi_select":
      return (property["multi_select"] as Array<{ name: string }>).map(
        (relation) => relation.name
      );
    case "formula":
      return (property["formula"] as { number: number }).number || 0;
    case "select":
      return (property["select"] as { name: string }).name;
    case "files":
      return (property["files"] as Array<NotionFile>).map((file) => ({
        name: file.name,
        url: file[file.type]?.url,
      }));
    case "file":
      return (property["file"] as { url: string }).url;
    case "title":
      return (
        (property["title"] as Array<{ plain_text: string }>)[0]?.plain_text ||
        ""
      );
    case "checkbox":
      return (property["checkbox"] as { checkbox: boolean }).checkbox;
    default:
      return "";
  }
};

const propToNotion: Record<string, (value: any) => NotionProperty> = {
  title: (value: string) => ({
    type: "title",
    title: [{ type: "text", text: { content: value } }],
  }),
  multi_select: (value: unknown[]) => ({
    type: "multi_select",
    multi_select: value.map((item) => ({
      name: item,
    })),
  }),
  select: (value: unknown) => ({
    type: "select",
    select: { name: value },
  }),
  date: (value: Date) => ({
    type: "date",
    date: { start: moment(value).toISOString() },
  }),
  range: ([start, end]: Date[]) => ({
    type: "date",
    date: {
      start: moment(start).toISOString(),
      end: moment(end).toISOString(),
    },
  }),
  number: (value: number) => ({
    type: "number",
    number: +value,
  }),
  formula: (value: number) => ({
    type: "number",
    number: +value,
  }),
  files: (value: string[]) => ({
    type: "files",
    files: value.map((url) => ({
      name: value,
      type: "external",
      external: {
        url,
      },
    })),
  }),
  checkbox: (value: boolean | string) => ({
    type: "checkbox",
    checkbox: value === true || value === "true",
  }),
  file: (value: string) => ({
    type: "files",
    files: [
      {
        name: value,
        type: "external",
        external: {
          url: value,
        },
      },
    ],
  }),
  rich_text: (value: string) => ({
    type: "rich_text",
    rich_text: [
      {
        type: "text",
        text: { content: value },
      },
    ],
  }),
  relation: (value: string[] | string) => {
    value = Array.isArray(value) ? value : [value];

    return { type: "relation", relation: value.map((id) => ({ id })) };
  },
};

export const parseObjectToNotion = <T extends NotionItem>(
  item: T
): Record<string, NotionProperty> => {
  const notionProperties = item.getNotionTypes();

  const object = notionProperties.reduce((obj, notionProp) => {
    const value = (item as Record<string, unknown>)[notionProp.property];
    const parser = propToNotion[notionProp.type];
    if (!value || !parser) {
      return obj;
    }

    obj[notionProp.property] = parser(value);
    return obj;
  }, {} as Record<string, NotionProperty>);

  return object;
};
