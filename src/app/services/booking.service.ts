import { Booking } from "@/app/models/models";

/**
 * @param {string} id
 */
export const fetchBookingDetails = async (id: string) => {
  const res = await fetch(`/api/bookingDetails/${id}`);
  const data = await res.json();

  return data;
};

/**
 * @param {string} id
 * @param {Booking} formData
 */
export const updateBookingDetails = async (
  id: string,
  formData: Partial<Booking>
) => {
  await fetch(`/api/bookingDetails/${id}`, {
    method: "PUT",
    body: JSON.stringify(formData),
  });
};
