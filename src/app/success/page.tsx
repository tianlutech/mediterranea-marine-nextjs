"use client";

import Sidebar from "@/components/sidebar/sidebar";
import Booking from "@/components/booking";
import { useEffect, useState } from "react";
import { getBookingInfo, getBoatInfo } from "@/services/notion.service";
import LoadingModal from "@/components/modals/loadingModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import EmailImage from "@/assets/email 1.png";

export default function successPage() {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #262D46 0%, #B07E50 100%)",
      }}
      className="relative p-2 w-full h-screen bg-white text-center flex flex-col items-center text-white justify-center"
    >
      <Image
        width={60}
        height={45}
        src={EmailImage}
        className="w-30 flex justify-center items-center"
        alt="email"
      />
      <div className="flex-col">
        <div className="my-6">
          <span className="font-bold text-5xl">Thank You !</span>
        </div>
        <div>
          <span>Your submission has been received.</span>
        </div>
      </div>
    </div>
  );
}
