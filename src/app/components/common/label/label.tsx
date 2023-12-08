export default function CommonLabel({
  children,
  error,
  input = "text",
}: {
  children: React.ReactNode;
  error?: boolean;
  input: string;
}) {
  // Determine base position based on input type
  let basePosition =
    input === "text"
      ? "md:bottom-[1.8rem] bottom-[1.6rem]"
      : input === "select"
      ? "md:bottom-[1.3rem] bottom-[1.6rem]"
      : ""; // Add more conditions for other input types if needed

  // Adjust position if there is an error
  let errorAdjustment = error
    ? input === "text"
      ? "md:bottom-[3.2rem] bottom-[3rem]"
      : input === "select"
      ? "bottom-[3.7rem]"
      : "" // Add more conditions for other input types if needed
    : "";

  // Combine base position with error adjustment if there is an error
  let positionClass = error ? errorAdjustment : basePosition;

  // Determine error styling

  return (
    <label
      className={`block mb-2 text-black text-sm font-medium absolute z-10 bg-white md:left-4 left-2 px-2 ${positionClass} `}
    >
      {children}
    </label>
  );
}
