export default function CommonSelect({ id, name, data }: { id: string, name: string, data: any }) {

  return (
    <select id={id} name={name} className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-4">
      {data.map((mile: any, index: number) => (
        <option key={index} value={mile}>{mile}</option>
      ))}
    </select>
  );
}
