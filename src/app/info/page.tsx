"use client";

import BoatSvg from "@/assets/svgs/BoatSvg";
import Spinner from "@/components/common/containers/spinner";
import { t } from "i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import NoSSR from "react-no-ssr";

export default function Info({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  searchParams
  const defaultMessage = "Hi 👋🏼 Please send me more info about this year new fleet ⛵ "
  const finalMessage = searchParams.get("m") || searchParams.get("message") || defaultMessage
  /**
   * Redirects to the whatsapp account of david
   */
  useEffect(() => {
    window.location.href =
      "https://api.whatsapp.com/send/?phone=34686598418&text=" + finalMessage;
  }, [finalMessage]);
  return (
    <NoSSR>
      <div className="relative p-2 w-full h-screen bg-white text-center flex flex-col items-center text-white justify-center">
        <div className="flex-col text-black">
          <>
            <div className="my-6">
              <span className="font-bold text-2xl">{t("common.loading")}</span>
            </div>
            <Spinner size={20}>
              <BoatSvg size={50} />
            </Spinner>
          </>
        </div>
      </div>
    </NoSSR>
  );
}
