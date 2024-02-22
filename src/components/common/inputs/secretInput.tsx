"use client";

import React, { useState } from "react";
import EyeSvg from "@/assets/svgs/EyeSvg";
import EyeCloseSvg from "@/assets/svgs/EyeCloseSvg";
import { useTranslation } from "react-i18next";
import CommonInput from "./input";

export default function SecretInput({
  data,
  setData
}: {
  data: any,
  setData: any
}) {
  const [showPin, setShowPin] = useState(false)
  const { t } = useTranslation();
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 right-0 flex items-center px-2">
        {showPin ?
          <div onClick={() => setShowPin(!showPin)} className="cursor-pointer">
            <EyeSvg />
          </div>
          :
          <div onClick={() => setShowPin(!showPin)} className="cursor-pointer">
            <EyeCloseSvg />
          </div>
        }
      </div>
      <CommonInput
        type={showPin ? "text" : "password"}
        name="pin"
        id="pin"
        placeholder={t("input.pin")}
        value={data.Pin}
        minlength="6"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setData({ ...data, "Pin": e.target.value })
        }
        required={true}
      />
    </div>
  );
}
