"use client";
import CommonSelect from "@/components/common/inputs/selectInput";
import { selectType } from "@/models/models";
import { useEffect, useState } from "react";
import { getCaptains } from "@/services/notion.service";

export default function SelectCaptain({
  data,
  setData,
  setLoading,
}: {
  data: any;
  setData: any;
  setLoading: any;
}) {
  const [captains, setCaptains] = useState<selectType[]>([]);

  useEffect(() => {
    const fetchCaptain = async () => {
      const captainsData = await getCaptains();

      const formattedCaptains = captainsData.flatMap((captain) => [
        {
          name: captain.id,
          label: captain.Name,
          value: captain.id,
        },
      ]);
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
      name="captains"
      value={data["Captain"]}
      onChange={(e) => {
        setData({ ...data, Captain: e.target.value });
      }}
      data={captains}
      required
    />
  );
}
