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

export const uploadPDFDocument = async (file: File, data: any) => {
  try {
    // Create a FormData object
    const formData = new FormData();
    const {Date, Boat, Type, Amount} = data
    // Ensure the file is a PDF
    if (file.type !== "application/pdf") {
      throw new Error("Only PDF files are allowed");
    }
    formData.append("file", file);
    formData.append("type", "billPdf");
    formData.append("date", Date);
    formData.append("boatName", Boat);
    formData.append("slag", `${Amount}-${Type}`);

    // Send the request to the /api/googleDrive endpoint
    const response = await fetch("/api/googleDrive", {
      method: "POST",
      body: formData // Send the FormData object
      // No need to manually set the 'Content-Type', the browser handles it
    });

    // Parse the JSON response, expecting an object with the 'id' of the uploaded file
    const json = await response.json() as { id: string };

    // Return the file ID from the response
    return json;
  } catch (error) {
    // Log and handle errors
    console.error("Error uploading PDF document", error);
    return undefined;
  }
};