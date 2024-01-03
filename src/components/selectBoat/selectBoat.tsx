"use client";
import CommonSelect from "@/components/common/inputs/selectInput";
import { selectType } from "@/models/models";
import { useEffect, useState } from "react";
import { getBoats } from "@/services/notion.service";
import React from "react";

export default function SelectBoat({
  data,
  setData,
}: {
  data: any;
  setData: any;
}) {
  const [boats, setBoats] = useState<selectType[]>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBoats = async () => {
      setLoading(true)
      try {
        const boatsData = await getBoats();
        const formattedBoats = boatsData.map((boat) => ({
          label: boat.Nombre,
          value: boat.id,
        }));
        setBoats(formattedBoats);
        setLoading(false)
        return boatsData;
      } catch (error) {
        setLoading(false)
        console.error("Error fetching boats:", error);
        throw error;
      }
    };

    fetchBoats();
  }, []);
  return (
    <CommonSelect
      id="boats"
      name="boats"
      disabled={loading}
      value={data["Boat"]}
      onChange={(e) => setData({ ...data, Boat: e.target.value })}
      data={boats}
      required
    />
  );
}
