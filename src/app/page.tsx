"use client";

import Sidebar from "./components/sidebar/sidebar";
import Booking from "./components/booking";
import Modal from "./components/common/containers/modal";
import BoatSvg from "./assets/svgs/BoatSvg";
import DefaultLayout from "./components/default.layout";

export default function Home() {
  const goHome = () => {
    window.location.href = "https://mediterraneamarine.com/";
  };
  return (
    <DefaultLayout>
      <Modal isOpen={true}>
        <div
          className="flex flex-col  gap-8 items-center justify-center w-full h-full bg-white fixed top-0 left-0 z-50 cursor-pointer"
          onClick={() => goHome()}
        >
          <BoatSvg />

          <span className="italic text-xl">Mediterranea Marine</span>
        </div>
      </Modal>
    </DefaultLayout>
  );
}
