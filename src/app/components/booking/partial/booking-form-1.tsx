import InfoSvg from "@/app/assets/svgs/InfoSvg"
import CommonInput from "@/app/components/common/inputs/input"
import CommonInputFile from "@/app/components/common/inputs/fileInput"
export default function BookingForm1() {
  return (
    <div className="flex md:flex-row flex-col md:w-[49%] w-full">
      <div className="w-full bg-white rounded-lg">
        <div className="md:p-6 sm:p-8 p-6">
          <form className="" action="#">
            <div className="flex justify-between w-full">
              <div className="relative w-[48%]">
                <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 md:bottom-[1.8rem] bottom-[1.6rem] bg-white md:left-4 left-2 px-2">First name</label>
                <CommonInput type="text" name="text" id="firstname" placeholder="First name" />
              </div>
              <div className="relative w-[48%]">
                <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 md:bottom-[1.8rem] bottom-[1.6rem] bg-white md:left-4 left-2 px-2">Last name</label>
                <CommonInput type="text" name="text" id="lastname" placeholder="Last name" />
              </div>
            </div>
            <div className="relative w-full mt-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 md:bottom-[1.8rem] bottom-[1.6rem] bg-white md:left-4 left-2 px-2">Identity / Passport ID</label>
              <CommonInput type="email" name="email" id="email" placeholder="Email" />
            </div>
            <CommonInputFile label="Identity / Passport Picture (Front)" />
            <CommonInputFile label="Identity / Passport Picture (Back)" />
            <div className="relative w-full mt-6">
              <label className="block mb-2 font-medium text-gray-900 absolute z-10 md:bottom-[1.8rem] bottom-[1.6rem] md:text-sm text-xs bg-white md:left-4 left-2 px-2">Billing address</label>
              <CommonInput type="text" name="text" id="billingAddress" placeholder="Billing Address" />
            </div>
            <div className="flex justify-between w-full mt-6">
              <div className="relative w-[48%]">
                <label className="block absolute px-2 text-black md:bottom-[2.4rem] bottom-[2rem] z-10 bg-white md:left-4 left-2 md:text-sm text-xs font-medium">Adults passengers</label>
                <CommonInput type="number" name="number" id="adultNumber" placeholder="Adult number" />
              </div>
              <div className="relative w-[48%]">
                <label className="block px-2 absolute text-black md:bottom-[2.4rem] bottom-[2rem] z-10 bg-white md:left-4 left-2 md:text-sm text-xs  font-medium">Kids passengers</label>
                <CommonInput type="number" name="number" id="kidsNumber" placeholder="Kids number" />
              </div>
            </div>
            <div className="mt-6 text-black flex">
              <div>
                <InfoSvg />
              </div>
              <span className="text-sm ml-2">We require to know this information to prepare the lifevest
                and other equipment accordingly</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
