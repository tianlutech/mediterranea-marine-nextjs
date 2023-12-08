function Spinner({
  color = "blue",
  size = 5,
  children,
}: {
  size?: number;
  color?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`w-${size} h-${size} rounded-full animate-spin
              border-r-4 border-solid border-${color}-400
              shadow-md`}
      ></div>
      <div className="absolute">{children}</div>
    </div>
  );
}

export default Spinner;
