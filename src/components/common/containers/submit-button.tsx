import Spinner from "./spinner";

export default function SubmitButton({
  label,
  type = "submit",
  loading,
  onClick,
}: {
  label: string;
  type?: "submit" | "button" | "reset" | undefined;
  loading?: boolean;
  onClick?: () => void;
}) {
  const onClickButton = (e: any) => {
    if (loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    onClick?.();
  };
  return (
    <button
      type={type}
      onClick={onClickButton}
      className="mt-6 text-white bg-buttonColor focus:ring-4 font-semibold rounded-lg text-lg px-10 py-3"
    >
      {loading ? <Spinner color="white" /> : label}
    </button>
  );
}
