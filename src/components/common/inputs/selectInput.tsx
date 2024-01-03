import { useTranslation } from "react-i18next";

export default function CommonSelect({
  id,
  name,
  data,
  onChange,
  value = "",
  placeholder = "Select an option",
  required,
  disabled,
}: {
  id: string;
  name: string;
  data: Array<{ label: string; value: string } | string>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <select
      id={id}
      name={name}
      disabled={disabled}
      value={value}
      onChange={onChange}
      required={required}
      className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
    >
      {placeholder && <option value="">{t("input.select_option")}</option>}
      {data.map((item, index) => {
        // Check if 'item' is a string or object and translate only if it's "None"
        if (typeof item === "object" && "value" in item) {
          return (
            <option key={index} value={item.value}>
              {item.label === "None" ? t("input.none_option") : item.label}
            </option>
          );
        }
        // Handle the string case
        return (
          <option key={index} value={item}>
            {item === "None" ? t("input.none_option") : item}
          </option>
        );
      })}
    </select>
  );
}
