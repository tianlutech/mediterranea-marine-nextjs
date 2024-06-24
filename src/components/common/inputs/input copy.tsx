"use client";

import React from "react";

export default function CommonInput({
  type,
  id,
  name,
  placeholder,
  required,
  onChange,
  value,
  min,
  max,
  step,
  checked,
  minlength
}: {
  type: string;
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
  minlength?: any
}) {
  return (
    <input
      required={required}
      onChange={onChange}
      value={value}
      type={type}
      name={name}
      id={id}
      className="w-full border md:text-sm text-xs border-gray-300 text-black text-start p-[0.7rem] md:px-8 px-4 rounded-lg h-[45px]"
      placeholder={placeholder || name}
      min={min}
      max={max}
      step={step}
      minLength={minlength}
    />
  );
}
