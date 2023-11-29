export default function CommonSelect({ id, name, data, onChange, value }: { id: string, name: string, data: any, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, value: string }) {

  return (
    <select id={id} name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-4">
      {data.map((mile: any, index: number) => (
        <option key={index} value={mile}>{mile}</option>
      ))}
    </select>
  );
}
