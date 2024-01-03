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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBoats = async () => {
      setLoading(true)
      try {
        const boatsData = await getBoats();
        const formattedBoats = boatsData.map((boat) => ({
          label: boat.Nombre,
          value: boat.id.replaceAll("-", ""),
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
      value={value.replaceAll("-", "")}
      onChange={(e) => onChange(e.target.value)}
      data={boats}
      required
    />
  );
}
