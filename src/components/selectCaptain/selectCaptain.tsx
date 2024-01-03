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

  useEffect(() => {
    const fetchCaptain = async () => {
      const captainsData = await getCaptains();

      const formattedCaptains = captainsData.map((captain) => ({
        label: captain.Name,
        value: captain.id.replaceAll("-", ""),
      }));
      formattedCaptains.push({
        name: "",
        label: "Other",
        value: "0",
      });
      setCaptains(formattedCaptains);
    };

    fetchCaptain();
  }, []);

  return (
    <CommonSelect
      id="captains"
      disabled={disabled}
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
