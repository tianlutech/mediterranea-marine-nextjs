export default function CommonLabel({ children, error }: { children: React.ReactNode, error: boolean }) {
  return (
    <label className={`block mb-2 text-sm font-medium  text-gray-900 absolute z-10 ${error ? "md:bottom-[3.2rem] bottom-[3rem]" : "md:bottom-[1.8rem] bottom-[1.6rem]"}  bg-white md:left-4 left-2 px-2`}>
      {children}
    </label>
  );
}
