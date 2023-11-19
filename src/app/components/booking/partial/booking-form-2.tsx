import InfoSvg from "@/app/assets/svgs/InfoSvg"
import PlayerSvg from "@/app/assets/svgs/PlayerSvg"
import CommonInput from "@/app/components/common/inputs/input"
import CommonSelect from "@/app/components/common/inputs/selectInput"
export default function BookingForm2() {
  const miles = [
    "25 Nautical Miles - 250€",
    "25 Statute Miles - 350€",
    "25 Metric Miles - 450€",
    "25 Roman Miles - 550€",
    "25 Scandinavian Miles - 650€",
  ]
  return (
    <div className="flex md:mt-0 mt-4 md:flex-row flex-col md:w-[49%] w-full">
      <div className="w-full bg-white rounded-lg">
        <div className="md:p-6 sm:p-8 p-6">
          <form className="" action="#">
            <div className="relative w-full">
              <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">Arrival time</label>
              <CommonInput type="time" name="arrivalTime" id="arrivalTime" placeholder="Arrival time" />
            </div>
            <div className="mt-6 flex items-baseline">
              <div className="flex items-center mb-4">
                <input id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label className="ms-2 text-base text-black">We eat on board</label>
              </div>
              <div className="flex items-center ml-10">
                <input checked id="default-radio-2" type="radio" value="" name="default-radio" className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label className="ms-2 text-base text-black">We eat on a restaurant</label>
              </div>
            </div>
            <div className="flex justify-between w-full mt-2">
              <div className="relative w-[48%]">
                <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 bottom-[2.3rem] bg-white left-4 px-2">Name of restaurant</label>
                <CommonInput type="text" name="restaurant" id="restaurantName" placeholder="Name of the restaurant" />
              </div>
              <div className="relative w-[48%]">
                <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">Booking time</label>
                <CommonInput type="time" name="bookingTime" id="bookingTime" placeholder="Booking time" />
              </div>
            </div>
            <div className="mt-6 text-black flex">
              <div>
                <InfoSvg />
              </div>
              <span className="text-sm ml-2">Is common for our clients to book in a restuarant, providing to us the
                restaurant name and the meal appointment  can help our captian to
                adjust and apdat the route of your sail</span>
            </div>
            <div className="relative w-full mt-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 bottom-[2.8rem] bg-white left-4 px-2">General comments</label>
              <textarea id="message" className="block p-2.5 w-full text-sm text-black rounded-lg border border-gray-300" placeholder=""></textarea>
            </div>
            <div className="relative w-full mt-6">
              <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">Prepayment of fuel</label>
              <CommonSelect id="miles" name="miles" data={miles} />
            </div>
            <div className="mt-2 text-black flex">
              <div>
                <InfoSvg />
              </div>
              <span className="text-sm ml-2">inviting the user to pay the fuel at the beginning.</span>
            </div>
            <div className="relative w-full mt-6 flex justify-between items-center">
              <div className="w-[90%]">
                <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">Toy: Stand Up Paddle</label>
                <CommonSelect id="miles" name="miles" data={miles} />
              </div>
              <div className="w-[8%]">
                <PlayerSvg />
              </div>
            </div>
            <div className="mt-2 text-black flex">
              <div>
                <InfoSvg />
              </div>
              <span className="text-sm ml-2">Click here to see the video of the SUP</span>
            </div>
            <div className="relative w-full mt-6 flex justify-between items-center">
              <div className="w-[90%]">
                <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">Toy: SEABOB </label>
                <CommonSelect id="miles" name="miles" data={miles} />
              </div>
              <div className="w-[8%]">
                <PlayerSvg />
              </div>
            </div>
            <div className="mt-2 text-black flex">
              <div>
                <InfoSvg />
              </div>
              <span className="text-sm ml-2">Click chere to see a video of the SEABOB</span>
            </div>
            <div className="mt-6">
              <div className="flex items-center">
                <input checked id="checked-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label className="ms-2 text-sm text-black">Read and Sign the Contract</label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
