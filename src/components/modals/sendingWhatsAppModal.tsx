import Modal from "@/components/common/containers/modal";
import React, { useEffect, useState } from "react";

export default function SendingWhatsAppModal({
  isOpen,
  message,
  contacts,
}: {
  isOpen: boolean;
  message: string;
  contacts: string[];
}) {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const simulateLoading = async () => {
      const totalContacts = contacts.length;

      for (let i = 0; i < totalContacts; i++) {
        // Simulate some asynchronous task
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Update the progress
        setProgress((i + 1) / totalContacts * 100);
      }
    };

    if (isOpen) {
      simulateLoading();
    }
  }, [isOpen, contacts]);

  return (
    <Modal isOpen={isOpen}>
      <div className="relative p-2 md:w-[40%] w-[95%] bg-white text-center flex flex-col items-center text-white justify-center rounded-lg shadow">
        <div className="flex-col text-black">
          <div className="my-6">
            <span className="font-bold text-xl">Sending Message</span>
          </div>
          <div>
            <span>{message}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
