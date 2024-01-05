import CommonSelect from "@/components/common/inputs/selectInput";
import { SelectType } from "@/models/models";
import { useEffect, useState } from "react";
import { getCaptains } from "@/services/notion.service";
import React from "react";

export default function SelectCaptain({
  onChange,
  value,
  disabled,
}: {
  disabled?: boolean;
  value: string;
  onChange: (captainId: string) => void;
}) {
  const [captains, setCaptains] = useState<SelectType[]>([]);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchCaptain = async () => {
      setLoading(true)
      const captainsData = await getCaptains();

      const formattedCaptains = captainsData.map((captain) => ({
        label: captain.Name,
        value: captain.id.replaceAll("-", ""),
      }));
      formattedCaptains.push({
        label: "Other",
        value: "0",
      });
      setCaptains(formattedCaptains);
      setLoading(false)
    };

    fetchCaptain();
  }, []);

  return (
    <CommonSelect
      id="captains"
      disabled={disabled || loading}
      name="captains"
      value={value.replaceAll("-", "")}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      data={captains}
      required
    />
  );
}
