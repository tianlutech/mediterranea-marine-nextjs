import Modal from "@/components/common/containers/modal";
import React, { useEffect, useState } from "react";
import * as whatsApp from "@/services/whatsApp.service";

export default function SendingWhatsAppModal({
  isOpen,
  message,
  contacts,
  data,
}: {
  isOpen: boolean;
  message: string;
  contacts: Record<string, string>[];
  data: { to: string; fields: string[]; default: string[] };
  template: { name: string; language: string; parameters: string[] };
}) {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const simulateLoading = async () => {
      const totalContacts = contacts.length;

      for (const i in contacts) {
        const contact = contacts[i];
        // Simulate some asynchronous task
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Update the progress
        setProgress(((+i + 1) / totalContacts) * 100);
        whatsApp.sendMessage(contact[data.to], {
          name: template.name,
          language: template.language,
          parameters: template.parameters.map((variable) => {
            return contact[data.fields[variable]] || data.default[variable];
          }),
        });
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
