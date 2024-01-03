"use client";
import CommonSelect from "@/components/common/inputs/selectInput";
import { selectType } from "@/models/models";
import { useEffect, useState } from "react";
import { getBoats } from "@/services/notion.service";
import React from "react";

export default function SelectBoat({
  data,
  setData,
  setLoading,
}: {
  data: any;
  setData: any;
  setLoading: any;
}) {
  const [boats, setBoats] = useState<selectType[]>([]);

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        const boatsData = await getBoats();
        const formattedBoats = boatsData.map((boat) => ({
          label: boat.Nombre,
          value: boat.id,
        }));
        setBoats(formattedBoats);
        return boatsData;
      } catch (error) {
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
      value={data["Boat"]}
      onChange={(e) => setData({ ...data, Boat: e.target.value })}
      data={boats}
      required
    />
  );
}
