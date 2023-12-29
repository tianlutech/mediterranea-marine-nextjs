"use client";

import Image from "next/image";
import Logo from "@/assets/Logo_color 1.png";
import BoatImage from "@/assets/boat.png";
import UkFlag from "@/assets/united-kingdom.png";
import SpainFlag from "@/assets/spain.png";
import { useTranslation } from "next-i18next";
import { useCallback } from "react";
import { Boat } from "@/models/models";
import "../../i18n";
interface SidebarProps {
  children?: React.ReactNode;
  image?: string;
}

export default function Sidebar({ image, children }: SidebarProps) {
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
          {image && (
            <Image
              width={60}
              height={45}
              src={image || BoatImage}
              className="h-auto w-full"
              alt="boat"
            />
          )}
        </div>
        {children}
      </div>
      <div className="w-full absolute bottom-0 md:block hidden">
        <Image
          width={60}
          height={45}
          src={image || BoatImage}
          className="h-auto w-full"
          alt="boat"
        />
      </div>
    </div>
  );
}
