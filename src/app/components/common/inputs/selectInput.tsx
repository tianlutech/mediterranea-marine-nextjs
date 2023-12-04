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
}: {
  id: string;
  name: string;
  data: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-4"
    >
      <option value={0}>None</option>
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
