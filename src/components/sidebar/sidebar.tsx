"use client";

import Image from "next/image";
import Logo from "@/assets/Logo_color 1.png";
import BoatImage from "@/assets/boat.png";
import UkFlag from "@/assets/united-kingdom.png";
import SpainFlag from "@/assets/spain.png";
import { useTranslation } from "next-i18next";
import { useCallback } from "react";
import { Boat } from "@/models/models";

export default function Sidebar({ boatInfo }: { boatInfo: Boat }) {
  const { t, i18n } = useTranslation();
  const changeLanguage = useCallback(
    (language: string) => {
      i18n.changeLanguage(language);
    },
    [i18n]
  );

  return (
    <div className="relative bg-white md:w-[23%] w-full ">
      <div className="flex flex-col justify-center items-center my-4">
        <Image width={60} height={48} src={Logo} className="w-60" alt="logo" />
        <div className="flex">
          <span className="text-black">{t("sidebar.language")}</span>
          <div className="flex ml-2">
            <Image
              width={60}
              height={48}
              src={SpainFlag}
              onClick={() => changeLanguage("es")}
              className="w-7 cursor-pointer"
              alt="logo"
            />
            <Image
              width={60}
              height={48}
              src={UkFlag}
              onClick={() => changeLanguage("en")}
              className="w-7 ml-2 cursor-pointer"
              alt="logo"
            />
          </div>
        </div>
      </div>
      <div className="bg-chocolate py-4 flex justify-center items-center">
        <span className="font-extrabold text-3xl text-white">
          {t("sidebar.boat_booking")}
        </span>
      </div>
      <div>
        <div className="w-full block md:hidden">
          {boatInfo && (
            <Image
              width={60}
              height={45}
              src={boatInfo.cover || BoatImage}
              className="h-auto w-full"
              alt="boat"
            />
          )}
        </div>
        <div className="px-4 py-4 text-textSecondaryColor lg:text-base text-sm">
          <p className="mb-6">
            {t("sidebar.boat_booking")} {boatInfo?.Nombre}{" "}
            {t("sidebar.reservation_form")}
          </p>
          <p className="mb-6">
            {t(
              "sidebar.we_are_excited_to_help_you_plan_your_next_water_adventure"
            )}
          </p>
          <p className="mb-6">{t("sidebar.sidebar_p1")}</p>
          <p className="mb-6">{t("sidebar.sidebar_p2")}</p>
        </div>
      </div>

      <div className="w-full absolute bottom-0 md:block hidden">
        <Image
          width={60}
          height={45}
          src={boatInfo?.cover || BoatImage}
          className="h-auto w-full"
          alt="boat"
        />
      </div>
    </div>
  );
}
