export default function CommonSelect({
  id,
  name,
  data,
  onChange,
  value = "", // Set default value to an empty string
  placeholder = "Select an option",
  required,
}: {
  id: string;
  name: string;
  data: Array<{ name: string; value: string } | string>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string; // Make value optional and provide default value
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
    >
      {/* Add a placeholder option that is not selectable */}
      {placeholder && <option value="">{placeholder}</option>}
      {data.map((item, index: number) => {
        // Check if 'item' is a string or object
        if (typeof item === "object" && "value" in item) {
          return (
            <option key={index} value={item.value}>
              {item.name}
            </option>
          );
        }
        // Handle the string case
        return (
          <option key={index} value={item}>
            {item}
          </option>
        );
      })}
    </select>
  );
}
