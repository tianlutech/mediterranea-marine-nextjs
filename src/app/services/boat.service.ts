
// fetch booking Details
/**
 * @param {string} id
 */
export const fetchBoatDetails = async (id: string) => {
  const res = await fetch(`/api/boatInfo/${id}`)
  const data = await res.json()

  return data
}