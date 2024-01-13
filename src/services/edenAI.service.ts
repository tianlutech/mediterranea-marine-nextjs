import { Readable } from "stream";
import path from "path";

export const checkIdValidity = async (file: File) => {
  try {
    // console.log("===got ", path.extname(file.name))
    const buffer = Buffer.from(await file.arrayBuffer());
    // const readeablFile: any = fs.createReadStream()
    console.log(">>>>>>filePath", Readable.from(buffer))
    const res: any = Readable.from(buffer)
    const formData = new FormData();
    formData.append("file", res);
    formData.append("providers", "microsoft,base64,amazon,mindee");
    formData.append("fallback_providers", "");

    const response = await fetch("/api/edenAI", {
      method: "POST",
      body: formData
    });

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error retrieving data", error);
    return undefined;
  }
}