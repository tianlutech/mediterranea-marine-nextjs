"use client";

import { MouseEventHandler, useEffect, useRef } from "react";

export default function Modal({
  isOpen,
  children,
  onClose,
}: {
  isOpen: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  const modal = useRef<HTMLDivElement>(null);
  const onModalClick = (e: any) => {
    if (!modal.current) {
      return;
    }
    if (e.target === modal.current) {
      onClose?.();
      return;
    }
  };

  useEffect(() => {
    const onKeyPress = (event: any) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", onKeyPress);

    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, [onClose]);
  return (
    <div
      ref={modal}
      aria-hidden="true"
      onClick={onModalClick}
      className={`${
        isOpen ? "flex" : "hidden"
      } overflow-x-hidden fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-75 backdrop-filter`}
    >
      {children}
    </div>
  );
}
