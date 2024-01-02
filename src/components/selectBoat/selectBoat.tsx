"use client";
import CommonSelect from "@/components/common/inputs/selectInput";
import { selectType } from "@/models/models";
export default function SelectBoat({ boats, onSelectBoat, selectedBoat }: { boats: any, onSelectBoat: (e: any) => void, selectedBoat: any }) {

  return (
    <CommonSelect
      id="boats"
      name="boats"
      value={selectedBoat}
      onChange={(e) =>
        onSelectBoat(e.target.value)
      }
      data={boats}
      required
    />
  )
}