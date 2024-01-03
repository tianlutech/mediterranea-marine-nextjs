"use client";
import CommonSelect from "@/components/common/inputs/selectInput";
import { selectType } from "@/models/models";
import { useEffect, useState } from "react";
import { getCaptains } from "@/services/notion.service";

export default function SelectCaptain({ data, setData, setLoading }: { data: any, setData: any, setLoading: any }) {
  const [captains, setCaptains] = useState<selectType[]>([])

  const fetchCaptain = async () => {
    try {
      const captainsData = await getCaptains();

      const formattedCaptains = captainsData.flatMap((captain) => [
        {
          name: "",
          label: "Other",
          value: "0",
        },
        {
          name: captain.id,
          label: captain.Name,
          value: captain.Name
        }
      ]);



      setCaptains(formattedCaptains);

      return captainsData;
    } catch (error) {
      console.error("Error fetching captains:", error);
      throw error;
    }
  }

  useEffect(() => {
    fetchCaptain()
  })

  return (
    <CommonSelect
      id="captains"
      name="captains"
      value={data["Captain"]}
      onChange={(e) => {
        setData({ ...data, "Captain": e.target.value })
      }
      }
      data={captains}
      required
    />
  )
}