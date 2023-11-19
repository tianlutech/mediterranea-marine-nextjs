"use client";

export default function CommonInput({ type, id, name, placeholder }: { type: string, id: string, name: string, placeholder: string }) {
  return (
    <input type={type} name={name} id={id} className="w-full border md:text-sm text-xs border-gray-300 text-black text-start p-[0.7rem] md:px-8 px-4 rounded-lg" placeholder={placeholder} />
  );
}
