import Image from "next/image";
import Logo from "@/app/assets/Logo_color 1.png";
import Boat from "@/app/assets/boat.png"
import UkFlag from "@/app/assets/united-kingdom.png"
import SpainFlag from "@/app/assets/spain.png"

export default function Sidebar() {
  return (
    <div className="relative bg-white md:w-[23%] w-full h-full ">
      <div className="flex flex-col justify-center items-center my-4">
        <Image
          width={60}
          height={48}
          src={Logo}
          className="w-60"
          alt="logo"
        />
        <div className="flex">
          <span className="text-black">Language: </span>
          <div className="flex ml-2">
            <Image
              width={60}
              height={48}
              src={SpainFlag}
              className="w-7 cursor-pointer"
              alt="logo"
            />
            <Image
              width={60}
              height={48}
              src={UkFlag}
              className="w-7 ml-2 cursor-pointer"
              alt="logo"
            />
          </div>
        </div>
      </div>
      <div className="bg-chocolate py-4 flex justify-center items-center">
        <span className="font-extrabold text-3xl text-white">BOAT BOOKING</span>
      </div>
      <div>
        <div className="w-full block md:hidden">
          <Image
            width={60}
            height={45}
            src={Boat}
            className="h-auto w-full"
            alt="boat"
          />
        </div>
        <div className="px-4 py-4 text-textSecondaryColor">
          <p className="mb-6">
            [Customer name] Welcome to our Boat [boat name] Reservation Form!
          </p>
          <p className="mb-6">
            We are excited to help you plan your next water adventure.
          </p>
          <p className="mb-6">
            Please take a moment to provide us with some essential details, so we can ensure you have a smooth and enjoyable experience.
          </p>
          <p className="mb-6">
            Your responses will help us schedule your boat reservation and cater to your specific needs. Thank you for choosing us for your boating adventure!
          </p>
        </div>
      </div>

      <div className="w-full absolute bottom-0 md:block hidden">
        <Image
          width={60}
          height={45}
          src={Boat}
          className="h-auto w-full"
          alt="boat"
        />
      </div>
    </div>
  );
}
