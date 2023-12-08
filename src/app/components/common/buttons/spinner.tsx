function Spinner({
  color = "blue",
  size = 5,
  children,
}: {
  size?: number;
  color?: string;
  children?: React.ReactNode;
}) {
  const spinnerStyle = {
    width: `${size * 0.25}rem`, // Assuming size is a multiplier
    height: `${size * 0.25}rem`, // Assuming size is a multiplier
  };

  return (
    <div className="flex justify-center items-center relative">
      <div
        className="rounded-full animate-spin border-blue-400 border-r-4 border-solid shadow-md"
        style={spinnerStyle}
      ></div>
      {children && <div className="absolute">{children}</div>}
    </div>
  );
}

export default Spinner;
