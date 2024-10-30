export const uploadFile = async (file: File, boatName: string, id: string ,slag: string, bookingDate: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("boatName", boatName);
    formData.append("id", id);
    formData.append("slag", slag);
    formData.append("type", "idCard");
    formData.append("date", bookingDate);

    const response = await fetch("/api/googleDrive", {
      method: "POST",
      body: formData // Sending FormData object directly
      // Note: Don't set Content-Type header when using FormData, as the browser sets it automatically with the correct boundary string
    });

    const json = await response.json() satisfies { id: string} | {error: string };
    return json;
  } catch (error) {
    console.error("Error retrieving data", error);
    return {error};
  }
}

export const uploadReceiptImage = async (file: File, bookingDate: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "receipt");
    formData.append("date", bookingDate);

    const response = await fetch("/api/googleDrive", {
      method: "POST",
      body: formData // Sending FormData object directly
    });

    const json = await response.json() as {id: string};

    return json;
  } catch (error) {
    console.error("Error retrieving data", error);
    return undefined;
  }
}

export const uploadSignatureImage = async (file: File, bookingDate: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "customerSignature");
    formData.append("date", bookingDate);

    const response = await fetch("/api/googleDrive", {
      method: "POST",
      body: formData // Sending FormData object directly
      // Note: Don't set Content-Type header when using FormData, as the browser sets it automatically with the correct boundary string
    });

    const json = await response.json() as { id: string};
    return json;
  } catch (error) {
    console.error("Error retrieving data", error);
    return undefined;
  }
}

export const uploadBill = async (file: File, fileName: string, folderId: string) => {
  try {
    const formData = new FormData();
    if (file.type !== "application/pdf") {
      throw new Error("Only PDF files are allowed");
    }
    formData.append("file", file);
    formData.append("type", "billPdf");
    formData.append("slag", fileName);
    formData.append("id", folderId);

    const response = await fetch("/api/googleDrive", {
      method: "POST",
      body: formData
    });

    const json = await response.json() as { id: string };

    return json;
  } catch (error) {
    console.error("Error uploading PDF document", error);
    return undefined;
  }
};