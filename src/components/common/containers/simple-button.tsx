import Spinner from "./spinner";

export default function SimpleButton({
  label,
  loading,
  onClick,
}: {
  label: string;
  loading?: boolean;
  onClick?: () => void;
}) {
  const onClickButton = (e: any) => {
    if (loading) {
      return;
    }

    onClick?.();
  };
  return (
    <button
      onClick={onClickButton}
      className="bg-white hover:bg-gray-100 focus:outline-none text-gray-800 py-[0.5px] px-2 border border-gray-400 rounded shadow text-sm"
    >
      {loading ? <Spinner color="#666666" /> : label}
    </button>
  );
}
