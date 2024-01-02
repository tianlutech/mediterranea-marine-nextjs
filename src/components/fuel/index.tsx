"use client";

import CommonInput from "@/components/common/inputs/input";
import CommonInputFile from "@/components/common/inputs/fileInput";
import CommonLabel from "../common/containers/label";
import React from "react";
import { selectType } from "@/models/models";
import { useTranslation } from "react-i18next";
import SubmitButton from "../common/containers/submit-button";
import { useEffect, useState } from "react";
import CommonSelect from "@/components/common/inputs/selectInput";
import { PORTS } from "@/models/constants";
import { getCaptains, getBoats } from "@/services/notion.service";
import SelectBoat from "../selectBoat/selectBoat";
import LoadingModal from "../modals/loadingModal";
import { FuelForm } from "@/models/models";
const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative md:w-[48%] w-full mb-6 md:mb-0">{children}</div>;
};

interface Arr {
  label: string;
  value: string;
}
export default function Fuel() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<FuelForm>({
    Date: "",
    Boat: "",
    "Amount Paid": 0,
    Captain: "",
    Port: "",
    "Picture of the Reciept": ""
  });
  const [boats, setBoats] = useState<selectType[]>([])
  const [captains, setCaptains] = useState<selectType[]>([])

  const fetchCaptain = async () => {
    try {
      setLoading(true);
      const captainsData = await getCaptains();

      const formattedCaptains = captainsData.map((captain) => ({
        label: captain.Name,
        value: captain.id
      }));

      setCaptains(formattedCaptains);

      setLoading(false);

      return captainsData;
    } catch (error) {
      // Handle error, if needed
      setLoading(false);
      console.error("Error fetching boats:", error);
      throw error;
    }
  }

  const fetchBoats = async () => {
    try {
      setLoading(true);
      const boatsData = await getBoats();

      const formattedBoats = boatsData.map((boat) => ({
        label: boat.Nombre,
        value: boat.id
      }));

      setBoats(formattedBoats);

      setLoading(false);

      return boatsData;
    } catch (error) {
      // Handle error, if needed
      setLoading(false);
      console.error("Error fetching boats:", error);
      throw error;
    }
  };

  const onSelectBoat = (id: string) => {
    const res = boats.filter((boat: any) => {
      return boat.value === id
    })
    console.log("=======boatSelected", res)
    return
  }

  useEffect(() => {
    fetchBoats()
    fetchCaptain()
  }, [])

  if (loading) {
    return (
      <LoadingModal isOpen={true} />
    )
  }

  return (
    <div className="flex md:w-[77%] w-full  justify-center items-center md:p-6 p-2">
      <div className="bg-white md:w-[70%] w-full rounded-lg">
        <p className="text-black flex items-center justify-center mt-4 font-semibold md:text-xl text-sm">{t("title.fuel_form")}</p>
        <div className="md:p-6 sm:p-8 p-6">
          <div className="flex md:flex-row flex-col justify-between w-full mt-6">
            <FormWrapper>
              <CommonLabel input="text">
                {t("input.date")}
              </CommonLabel>
              <CommonInput
                type="date"
                name="date"
                id="date"
                placeholder={t("input.date")}
                value={data["Date"]} //Abel this I will change while integrating
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, "Date": e.target.value })
                }
                min={1}
                step={1}
                required={true}
              />
            </FormWrapper>
            <FormWrapper>
              <CommonLabel input="text">
                {t("input.select_boat")}
              </CommonLabel>
              <SelectBoat boats={boats} onSelectBoat={onSelectBoat} selectedBoat={data["Boat"]} />
            </FormWrapper>
          </div>
          <div className="flex md:flex-row flex-col justify-between w-full md:mt-6 mt-0">
            <FormWrapper>
              <CommonLabel input="text">
                {t("input.amount_paid")}
              </CommonLabel>
              <CommonInput
                type="text"
                name="AmountPaid"
                id="amountpaid"
                placeholder={t("input.amount_paid")}
                value={data["Amount Paid"]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, "Amount Paid": +e.target.value })
                }
                required={true}
              />
            </FormWrapper>
            <FormWrapper>
              <CommonLabel input="text">
                {t("input.captain_list")}
              </CommonLabel>
              <CommonSelect
                id="captainlist"
                name="captainList"
                data={captains}
                value={data["Captain"]}
                onChange={(e) =>
                  setData({ ...data, "Captain": e.target.value })
                }
                required
              />
            </FormWrapper>
          </div>
          <div className="flex justify-between w-full md:mt-6 mt-0">
            <FormWrapper>
              <CommonLabel input="text">
                {t("input.port")}
              </CommonLabel>
              <CommonSelect
                id="port"
                name="port"
                data={PORTS}
                value={data["Port"]}
                onChange={(e) =>
                  setData({ ...data, "Port": e.target.value })
                }
                required
              />
            </FormWrapper>
          </div>
          <>
            <CommonInputFile
              name="ID_Front_Picture"
              label={t("input.picture_of_the_receipt")}
              onRemove={() => setData({ ...data, ID_Front_Picture: {} })}
              onChange={(file) => setData({ ...data, ID_Front_Picture: file })}
            // required
            />
          </>
          <SubmitButton
            label="Submit"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
