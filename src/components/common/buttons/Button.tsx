
export default function Button({
  onClick,
  message,
  className,
  disabled
}: {
  onClick: () => void;
  message: string;
  className?: string;
  disabled?: boolean;
}
) {
  return (
    <button disabled={disabled} onClick={() => onClick()} data-modal-hide="default-modal" type="button" className={`${className}  border border-bgColor2 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center`}>{message}</button>
  )
}