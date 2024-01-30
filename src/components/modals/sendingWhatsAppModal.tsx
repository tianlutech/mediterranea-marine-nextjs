import Modal from "@/components/common/containers/modal";
import React, { useEffect, useState } from "react";
import * as whatsApp from "@/services/whatsApp.service";
import { WhatsappTemplate } from "@/models/whatsapp";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import SimpleButton from "../common/containers/simple-button";

export default function SendingWhatsAppModal({
  isOpen,
  data,
  template,
  parameters,
}: {
  isOpen: boolean;
  data: any;
  template: WhatsappTemplate;
  parameters: any,
}) {
  const [progress, setProgress] = useState<number>(0);
  const [sendingMessageTo, setSendingMessageTo] = useState<string>("")
  const [error, setError] = useState<string>("")
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const simulateLoading = async () => {
      const totalContacts = data.contacts.length;
      for (const i in data.contacts) {
        const contact = data.contacts[i];
        // Simulate some asynchronous task
        await new Promise((resolve) => setTimeout(resolve, 50));
        // Update the progress
        setProgress(((+i + 1) / totalContacts) * 100);
        setSendingMessageTo(t("loadingMessage.sending_message_to") + ` ${contact[data.to]}`)
        const res = await whatsApp.sendMessage(contact[data.to], {
          name: template.name,
          language: template.language,
          parameters: parameters.map((variable: string) => {
            return contact[data.fields[variable]] || data.default[variable];
          }),
        });

        if (!res) {
          setError(
            t("error.failed_to_send_message_to") + ` ${contact[data.to]}`)
          return
        }
      }
      router.replace("/success");
    };

    if (isOpen) {
      simulateLoading();
    }
  }, [data, isOpen, parameters, router, t, template]);

  return (
    <Modal isOpen={isOpen}>
      <div className="relative p-2 md:w-[40%] w-[95%] bg-white text-center flex flex-col items-center text-white justify-center rounded-lg shadow">
        <div className="flex-col text-black">
          <div className="my-6">
            <span className="font-bold text-xl">Sending Message</span>
          </div>
          <div className="mb-6">
            {error === "" &&
              <span>
                {sendingMessageTo}
              </span>
            }
            {error !== "" &&
              <span>
                {error}
              </span>
            }
          </div>
          {
            error === "" &&
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          }
          {error !== "" &&
            <div>
              <SimpleButton
                label="Skip"
                onClick={() => window.location.reload()}
              />
            </div>
          }
        </div>
      </div>
    </Modal>
  );
}