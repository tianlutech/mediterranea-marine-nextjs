import { useTranslation } from "react-i18next";

export default function RadioInput(
  {
    id,
    className,
    label,
    checked,
    inputName,
    value,
    required,
    onChange,
  }:
    {
      id: string,
      className: string,
      value?: string,
      label: string,
      checked?: boolean,
      inputName: string,
      required?: boolean,
      onChange: any
    }
) {
  const { t } = useTranslation();
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        type="radio"
        value={value}
        checked={checked}
        name={inputName}
        onChange={onChange}
        required={required}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
      />
      <label className="ms-2 md:text-base text-sm  text-black">
        {t(`${label}`)}
      </label>
    </div>
  )
}