"use client";

export default function Modal({
  isOpen,
  children
}: {
  isOpen: boolean;
  children: React.ReactNode
}) {
  return (
    <div
      aria-hidden="true"
      className={`${isOpen ? "flex" : "hidden"} overflow-x-hidden fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-75 backdrop-filter`}
    >
      {children}
    </div>
  );
}
