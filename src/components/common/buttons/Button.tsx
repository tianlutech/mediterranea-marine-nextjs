
export default function Button({
  onClick,
  message,
  className
}: {
  onClick: () => void;
  message: string;
  className?: string;
}
) {
  return (
    <button onClick={() => onClick()} data-modal-hide="default-modal" type="button" className={`${className}  border border-bgColor2 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}>{message}</button>
  )
}