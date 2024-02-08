"use client";
import Image from "next/image";
import Boat from "@/app/assets/boat.png"

export default function PrepaymentModal({ isOpen, closeModal }: { isOpen: boolean, closeModal: any }) {
  return (
    <div id="default-modal"
      onClick={() => closeModal()}
      aria-hidden="true"
      className={`${isOpen ? "flex" : "hidden"} overflow-x-hidden fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-75 backdrop-filter`}>
      <div className="relative p-2 md:w-[60%] w-[95%] bg-white rounded-lg shadow">
        <div className="flex items-center justify-between px-4 pt-4 md:px-4 md:pt-4 ">
          <h3 className="text-xl font-semibold text-black">
            Prepay your  fuel
          </h3>
          <button onClick={() => closeModal()} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
        </div>
        <div className="w-full flex md:flex-row flex-col px-8">
          <div className="md:w-[50%] w-full flex flex-col justify-center">
            <span className="text-black md:text-base text-sm">
              <p className="mb-6">
                Selecting the option of prepaying the fuel will allow us the provide you a better service: planning properly the navigation route and improving your experience.
              </p>
              <p className="mb-6">
                As well will reduce your cost and let you enjoy the trip being relax on a fix cost of the fuel
              </p>
            </span>
            <div>
              <div className="flex mt-4">
                <input id="default-radio-2" type="radio" value="" name="default-radio" className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label className="ms-2 text-base text-black">I want to conitinue without prepayment</label>
              </div>
              <div className="flex mt-4">
                <input id="default-radio-2" type="radio" value="" name="default-radio" className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label className="ms-2 text-base text-black">50 Nautical Miles - 470e</label>
              </div>
              <div className="flex mt-4">
                <input id="default-radio-2" type="radio" value="" name="default-radio" className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label className="ms-2 text-base text-black">50 Nautical Miles - 470e</label>
              </div>
            </div>
          </div>
          <div className="md:w-[50%] w-full">
            <Image
              width={40}
              height={45}
              src={Boat}
              className="h-auto w-full"
              alt="boat"
            />
          </div>
        </div>
        <div className="flex items-center justify-between p-4 md:p-5 border-gray-200 md:w-[50%] w-full">
          <button onClick={() => closeModal()} data-modal-hide="default-modal" type="button" className="text-black border border-bgColor2 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Back</button>
          <button onClick={() => closeModal()} data-modal-hide="default-modal" type="button" className="text-white bg-buttonColor2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Pay</button>
        </div>
      </div>
    </div>
  );
}
