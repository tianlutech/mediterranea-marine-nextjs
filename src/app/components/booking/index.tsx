import BookingForm1 from "./partial/booking-form-1"
import BookingForm2 from "./partial/booking-form-2"
export default function Booking() {
  return (
    <div className="md:w-[77%] w-full md:p-6 p-2">
      <div className="justify-between w-full ">
        <div className="md:flex justify-between w-full ">
          {/* first form */}
          <BookingForm1 />
          {/* Second form */}
          <BookingForm2 />
        </div>
        {/* terms and policy */}
        <div>
          <div className="mt-6">
            <div className="flex items-center">
              <input id="checked-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label className="ms-2 text-sm">I agree with the privacy policy</label>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center">
              <input id="checked-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label className="ms-2 text-sm">I gurantee that the information of the user is from a user that is going to go to the boat.</label>
            </div>
          </div>
        </div>
        <button type="button" className=" mt-6 text-white bg-buttonColor focus:ring-4 font-semibold rounded-lg text-lg px-10 py-3">Submit</button>
      </div>
    </div>
  );
}
