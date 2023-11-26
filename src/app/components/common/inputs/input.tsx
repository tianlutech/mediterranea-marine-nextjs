"use client";

export default function CommonInput({ type, id, name, placeholder, required, onChange, value }: { type: string, id: string, name: string, placeholder: string, required: boolean, onChange?: any, value?: any }) {
  return (
    <input required={required} onChange={onChange} value={value} type={type} name={name} id={id} className="w-full border md:text-sm text-xs border-gray-300 text-black text-start p-[0.7rem] md:px-8 px-4 rounded-lg" placeholder={placeholder} />
  );
}
