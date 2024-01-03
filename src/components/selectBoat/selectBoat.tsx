"use client";
import CommonSelect from "@/components/common/inputs/selectInput";
import { SelectType } from "@/models/models";
import { useEffect, useState } from "react";
import { getBoats } from "@/services/notion.service";
import React from "react";

export default function SelectBoat({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [boats, setBoats] = useState<SelectType[]>([]);

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        const boatsData = await getBoats();
        const formattedBoats = boatsData.map((boat) => ({
          label: boat.Nombre,
          value: boat.id.replaceAll("-", ""),
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
      value={value.replaceAll("-", "")}
      onChange={(e) => onChange(e.target.value)}
      data={boats}
      required
    />
  );
}
