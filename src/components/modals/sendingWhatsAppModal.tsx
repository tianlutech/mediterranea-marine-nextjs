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
  attachmentType,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  data: any;
  template: WhatsappTemplate;
  parameters: string[];
  attachmentType: string;
}) {
  const [progress, setProgress] = useState<number>(0);
  const [sendingMessageTo, setSendingMessageTo] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const sendMessages = async () => {
      const totalContacts = data.contacts.length;
      const alreadySent = {} as Record<string, boolean>;
      for (const i in data.contacts) {
        const contact = data.contacts[i];
        if (!contact[data.to]) {
          continue;
        }
        if (alreadySent[contact[data.to]]) {
          continue;
        }
        // Update the progress
        setProgress(((+i + 1) / totalContacts) * 100);
        setSendingMessageTo(
          t("loadingMessage.sending_message_to") + ` ${contact[data.to]}`
        );
        const res = await whatsApp.sendMessage(contact[data.to], {
          name: template.name,
          language: template.language,
          parameters: parameters.map((variable: string) => {
            return contact[data.fields[variable]] || data.default[variable];
          }),
          attachment: attachmentType
            ? { type: attachmentType, url: data.attachment }
            : undefined,
        });
        if (res.error) {
          setError(
            t("error.failed_to_send_message_to") +
              ` ${contact[data.to]}<br/>${res.error}`
          );
          return;
        }
        alreadySent[contact[data.to]] = true;
      }
      setSendingMessageTo(t("loadingMessage.sending_complete"));
      setProgress(100);
    };

    setProgress(0);
    if (isOpen) {
      setError("");
      sendMessages();
    }
  }, [attachmentType, data, isOpen, parameters, router, t, template]);

  return (
    <Modal isOpen={isOpen} onClose={() => onClose?.()}>
      <div className="relative p-10 md:w-[40%] w-[95%] bg-white text-center flex flex-col items-center text-white justify-center rounded-lg shadow">
        <div className="flex-col text-black">
          <div className="mt-2 mb-6">
            <span className="font-bold text-xl">Sending Message</span>
          </div>
          <div className="mb-6">
            {error === "" && <span>{sendingMessageTo}</span>}
            {error !== "" && (
              <span dangerouslySetInnerHTML={{ __html: error }} />
            )}
          </div>
          {error === "" && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          {(error !== "" || progress === 100) && (
            <div className="mt-4">
              <SimpleButton
                label={t("loadingMessage.close")}
                onClick={() => (progress === 100 ? onSuccess?.() : onClose?.())}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
