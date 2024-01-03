import CommonSelect from "@/components/common/inputs/selectInput";
import { selectType } from "@/models/models";
import { useEffect, useState } from "react";
import { getCaptains } from "@/services/notion.service";

export default function SelectCaptain({
  data,
  setData,
}: {
  data: any;
  setData: any;
}) {
  const [captains, setCaptains] = useState<selectType[]>([]);
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchCaptain = async () => {
      setLoading(true)
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
      setLoading(false)
    };

    fetchCaptain();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id: string | null = urlParams.get("captainId")
    setCaptainId(id)
    if (captains.length <= 0) {
      return
    }
    if (id && captains.some((captain) => captain.value === id)) {
      setData({ ...data, Captain: id });
    }
  }, [captains]);

  return (
    <CommonSelect
      id="captains"
      disabled={captainId !== null || loading}
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
