import { Boat, Booking, Captain, DepartureTime, Fuel, Bill } from "../models/models";
import {
  parseNotionObject,
  NotionPage,
  parseObjectToNotion,
} from "../models/notion.model";
import { toast } from "react-toastify";
import { NOTION_DATABASES } from "@/models/constants";
import moment from "moment";

export async function getBoatInfo(boatId: string) {
  try {
    const response = await fetch(
      `/api/notion/page?id=${encodeURIComponent(boatId)}`
    );
    const json = await response.json();

    if (json.error) {
      console.error(json.error);
      return undefined;
    }
    const boat = new Boat();
    return parseNotionObject<Boat>(boat, json.result as NotionPage);
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return undefined;
  }
}

export async function getBookingInfo(bookingId: string) {
  try {
    // Append the bookingId as a query parameter to the URL
    const response = await fetch(
      `/api/notion/page?id=${encodeURIComponent(bookingId)}`
    );

    const json = await response.json();

    if (json.error) {
      console.error(json.error);
      return undefined;
    }
    const booking = new Booking();
    return parseNotionObject<Booking>(booking, json.result as NotionPage);
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return undefined;
  }
}

export async function getCaptain(captainId: string) {
  try {
    // Append the bookingId as a query parameter to the URL
    const response = await fetch(
      `/api/notion/page?id=${encodeURIComponent(captainId)}`
    );

    const json = await response.json();

    if (json.error) {
      console.error(json.error);
      return undefined;
    }
    const captain = new Captain();
    return parseNotionObject<Captain>(captain, json.result as NotionPage);
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return undefined;
  }
}

export async function getBoat(boatId: string) {
  try {
    // Append the bookingId as a query parameter to the URL
    const response = await fetch(
      `/api/notion/page?id=${encodeURIComponent(boatId)}`
    );

    const json = await response.json();

    if (json.error) {
      console.error(json.error);
      return undefined;
    }
    const boat = new Boat();
    return parseNotionObject<Boat>(boat, json.result as NotionPage);
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return undefined;
  }
}

export async function getBookedTimeSlots(date: Date) {
  const filter = {
    and: [
      {
        property: "Date",
        date: {
          after: moment(date).startOf("day").format(),
        },
      },
      {
        property: "Date",
        date: {
          before: moment(date).endOf("day").format(),
        },
      },
    ],
  };
  try {
    // Append the bookingId as a query parameter to the URL
    const response = await fetch(
      `/api/notion/database?databaseId=${encodeURIComponent(
        NOTION_DATABASES.DEPARTURE_SLOTS
      )}&filter=${encodeURIComponent(JSON.stringify(filter))}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();
    if (json.error) {
      console.error(json.error);
      return [];
    }

    const results = json.results.map((item: NotionPage) =>
      parseNotionObject(new DepartureTime(), item)
    ) as DepartureTime[];

    return results;
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return [];
  }
}

export async function getBookings(date: Date) {
  const filter = {
    and: [
      {
        property: "Date",
        date: {
          after: moment(date).startOf("day").format(),
        },
      },
      {
        property: "Date",
        date: {
          before: moment(date).endOf("day").format(),
        },
      },
      {
        or:[
          {
            property: "Toys",
            multi_select: {
              contains: "1 SEABOB"
            }
          },
          {
            property: "Toys",
            multi_select: {
              contains: "2 SEABOB"
            }
          }
        ]
      }
    ],
  };
  try {
    // Append the bookingId as a query parameter to the URL
    const response = await fetch(
      `/api/notion/database?databaseId=${encodeURIComponent(
        NOTION_DATABASES.BOOKINGS
      )}&filter=${encodeURIComponent(JSON.stringify(filter))}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();
    if (json.error) {
      console.error(json.error);
      return [];
    }

    const results = json.results
    // @abel here am missing the type
    const bookings = results.map((booking: any) => parseNotionObject<Booking>(booking, booking as NotionPage));
    return bookings;
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return [];
  }
}

export async function createTimeSlot(timeSlot: DepartureTime) {
  try {
    // Append the bookingId as a query parameter to the URL
    const response = await fetch(
      `/api/notion/database?databaseId=${encodeURIComponent(
        NOTION_DATABASES.DEPARTURE_SLOTS
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parseObjectToNotion(timeSlot)),
      }
    );

    const json = await response.json();

    if (json.error) {
      console.error(json.error);
      return undefined;
    }
    const result = parseNotionObject(new DepartureTime(), json.result);

    return result;
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return undefined;
  }
}

export async function updateBookingInfo(bookingId: string, data: Booking) {
  try {
    // Append the bookingId as a query parameter to the URL
    const response = await fetch(
      `/api/notion/page?id=${encodeURIComponent(bookingId)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: parseObjectToNotion(data),
        }),
      }
    );
    const json = await response.json();
    if (response.status !== 200) {
      return { error: json.error };
    }
    if (json.error) {
      return { error: json.error };
    }

    return {
      booking: parseNotionObject<Booking>(
        new Booking(),
        json.result as NotionPage
      ),
    };
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return { error: error };
  }
}

export async function createFuelRecord(data: Fuel) {
  try {
    // Append the FuelFormID as a query parameter to the URL
    const response = await fetch(
      `/api/notion/database?databaseId=${NOTION_DATABASES.FUEL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parseObjectToNotion<Fuel>(data)),
      }
    );
    const json = await response.json();
    if (response.status !== 200) {
      toast.error("Something went wrong" + response.statusText);
      return false;
    }
    if (json.error) {
      toast.error("Something went wrong" + json.error);
      return false;
    }

    return parseNotionObject<Fuel>(new Fuel(), json.result as NotionPage);
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return undefined;
  }
}

export async function createBillRecord(data: Bill) {
  try {
    // Append the FuelFormID as a query parameter to the URL
    const response = await fetch(
      `/api/notion/database?databaseId=${NOTION_DATABASES.BILLS}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parseObjectToNotion<Bill>(data)),
      }
    );
    const json = await response.json();
    if (response.status !== 200) {
      toast.error("Something went wrong" + response.statusText);
      return false;
    }
    if (json.error) {
      toast.error("Something went wrong" + json.error);
      return false;
    }

    return parseNotionObject<Bill>(new Bill(), json.result as NotionPage);
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return {error: error};
  }
}

export async function getBoats() {
  try {
    // Append the bookingId as a query parameter to the URL
    const response = await fetch(
      `/api/notion/database?databaseId=${encodeURIComponent(
        NOTION_DATABASES.BOATS
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();
    if (json.error) {
      console.error(json.error);
      return [];
    }

    const results = json.results.map((item: NotionPage) =>
      parseNotionObject(new Boat(), item)
    ) as Boat[];

    return results;
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return [];
  }
}

export async function getCaptains() {
  try {
    // Append the bookingId as a query parameter to the URL
    const response = await fetch(
      `/api/notion/database?databaseId=${encodeURIComponent(
        NOTION_DATABASES.CAPTAINS
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();
    if (json.error) {
      console.error(json.error);
      return [];
    }

    const results = json.results.map((item: NotionPage) =>
      parseNotionObject(new Captain(), item)
    ) as Captain[];

    return results;
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return [];
  }
}
