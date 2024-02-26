"use client";

import React, { useState } from "react";
import EyeSvg from "@/assets/svgs/EyeSvg";
import EyeCloseSvg from "@/assets/svgs/EyeCloseSvg";
import { useTranslation } from "react-i18next";
import CommonInput from "./input";

export default function SecretInput({
  id,
  name,
  placeholder,
  required,
  onChange,
  value,
  minlength,
}: {
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  onChange?: any;
  value?: any;
  min?: number;
  max?: number;
  step?: number;
  checked?: boolean;
  minlength?: any;
}) {
  const [showSecret, setShowSecret] = useState(false);
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 right-0 flex items-center px-2">
        {showSecret ? (
          <div
            onClick={() => setShowSecret(!showSecret)}
            className="cursor-pointer"
          >
            <EyeSvg />
          </div>
        ) : (
          <div
            onClick={() => setShowSecret(!showSecret)}
            className="cursor-pointer"
          >
            <EyeCloseSvg />
          </div>
        )}
      </div>
      <CommonInput
        type={showSecret ? "text" : "password"}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        minlength={minlength}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
        required={required}
      />
    </div>
  );
}
