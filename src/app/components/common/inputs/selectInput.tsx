interface Mile {
  name: string;
  value: number
}
export default function CommonSelect({
  id,
  name,
  data,
  onChange,
  value,
  placeholder = "Select an option", // Add a placeholder prop if you want it to be dynamic
}: {
  id: string;
  name: string;
  data: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  placeholder?: string; // Make it optional or required based on your needs
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
    >
      {/* Add a disabled option as the first option to act as a placeholder */}
      <option value="" disabled selected={!value}>{placeholder}</option>
      {data.map((mile: Mile | string, index: number) => {
        // Check if 'mile' is a Mile object
        if (typeof mile === "object" && "value" in mile) {
          return (
            <option key={index} value={mile.value}>
              {mile.name} {/* or any other property you want to display */}
            </option>
          );
        } else {
          // Handle the string case
          return (
            <option key={index} value={mile}>
              {mile}
            </option>
          );
        }
      })}
    </select>
  );
}