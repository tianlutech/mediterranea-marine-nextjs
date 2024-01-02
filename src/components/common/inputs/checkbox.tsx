"use client";

import React from "react";

export default function CommonCheckbox({
  id,
  name,
  required,
  onChange,
  value,
  checked,
  defaultChecked,
}: {
  id: string;
  name: string;
  required?: boolean;
  onChange?: any;
  value?: any;
  defaultChecked?: boolean;
  checked?: boolean;
}) {
  return (
    <input
      required={required}
      onChange={onChange}
      value={value}
      type={"checkbox"}
      name={name}
      id={id}
      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      defaultChecked={defaultChecked}
      checked={checked}
    />
  );
}
