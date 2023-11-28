

/**
 * @param {string} id
 */
export const fetchBookingDetails = async (id: string) => {
  const res = await fetch(`/api/bookingDetails/${id}`)
  const data = await res.json()

  return data
}

/**
 * @param {string} id
 * @param {} formData
 */
export const updateBookingDetails = async (id: string, formData: any) => {
  await fetch(`/api/bookingDetails/${id}`, {
    method: "PUT",
    body: JSON.stringify(formData.properties),
  })
}
