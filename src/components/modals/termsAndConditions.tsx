"use client";
import Modal from "@/components/common/containers/modal";
import SignaturePad from "react-signature-canvas";
import React, { useRef, useState, useEffect } from "react";
import { Boat, Booking, BookingFormData } from "@/models/models";
import moment from "moment";
import { toast } from "react-toastify";

export default function TermsAndConditions({
  isOpen,
  closeModal,
  boat,
  formData,
  setFormData,
  bookingInfo,
  onUserSigning,
}: {
  isOpen: boolean;
  closeModal: () => void;
  boat: Boat;
  formData: BookingFormData;
  setFormData: any;
  onUserSigning: () => void;
  bookingInfo: Booking;
}) {
  const sigPad = useRef<SignaturePad>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [departureMaximumHour, setDepartureMaximumHour] = useState("");
  const date = bookingInfo["Date"];
  const bookingDateYear = moment(date).format("YYYY");
  const bookingDateMonth = moment(date).format("MM");
  const bookingDateDay = moment(date).format("HH");

  const clearSigPad = () => {
    if (sigPad.current) {
      sigPad.current.clear();
      setIsSigned(false);
    }
  };

  const checkSignature = () => {
    setIsSigned(!!sigPad.current && !sigPad.current.isEmpty());
  };

  useEffect(() => {
    const maximumDepartureTime = () => {
      // Split the time string into hours and minutes
      var parts = bookingInfo["Departure Time"].split(":");
      var hours = parseInt(parts[0], 10);
      var minutes = parseInt(parts[1], 10);

      // Add hours
      hours += 8;

      // Ensure that hours do not exceed 24
      if (hours > 21) {
        hours = 21;
      }

      // Formatting hours and minutes to two digits
      var formattedHours = hours.toString().padStart(2, "0");
      var formattedMinutes = minutes.toString().padStart(2, "0");

      // Returning the formatted time string
      const time = formattedHours + ":" + formattedMinutes;
      setDepartureMaximumHour(time);
    };
    if (sigPad.current && !sigPad.current.isEmpty()) {
      setIsSigned(!sigPad.current.isEmpty());
    }
    maximumDepartureTime()
  }, [bookingInfo]);

  // will uncomment later if we need to use it
  // const getSignatureImage = () => {
  //   if (sigPad.current) {
  //     const canvas = sigPad.current.getTrimmedCanvas();
  //     return canvas.toDataURL("image/png");
  //   }
  //   return null;
  // };
  const agreeContract = () => {
    setFormData({ ...formData, signedContract: !formData["signedContract"] });
    closeModal();
    onUserSigning();
  };
  return (
    <Modal isOpen={isOpen} onClose={() => closeModal()}>
      <div className="relative p-2 md:w-[60%] bg-white rounded-lg shadow overflow-y-scroll pt-0 w-[95%] h-[95%] md:px-12 px-2">
        <div className="flex items-center justify-between px-4 pt-6 md:px-4 md:pt-4 sticky top-0 bg-white">
          <button
            onClick={() => closeModal()}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="default-modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
        <div className="text-black mx-4">
          <div className="flex justify-center border-b border-black ">
            <p className="text-sm font-bold text-black justify-center text-center">
              EXPOSE
            </p>
          </div>
          <div className="pt-4 md:pt-5 text-black text-sm">
            <p className="">
              <span className="font-bold">I.</span>- That THE MANAGER, is the
              manager in exclusivity of the following boat:
            </p>
            <p className="">NAME: {boat?.Nombre}</p>
            <p className="">BRAND AND MODEL: {boat.Code}</p>
            <p className="">REGISTRATION PLATE: {boat.RegistrationPlate}</p>
            <p className="mt-6">
              II.- That said vessel is in perfect condition for navigation and
              provided with all the necessary documentation to be allocated to
              this lease.
            </p>
            <p className="mt-6 mb-10">
              III.- That THE LESSEE wishes to lease the boat described in
              EXPOSITION I, under the following:
            </p>
            <div className="border-b border-black mb-4">
              <p className="text-sm font-bold ">STIPULATIONS</p>
            </div>
            <p className="font-bold my-4">FIRST. - OBJECT OF THE CONTRACT</p>
            <p className="mb-6">
              Through this contract, THE MANAGER leases to THE LESSEE the boat
              described in EXPOSITION I, authorized for the transport of{" "}
              {boat["Max.Passengers"]} people for navigation through the waters of
              the Balearic Islands.
            </p>
            <p className="font-bold my-4">
              SECOND. - LEASE PERIOD AND PORT OF EMBARK AND DISEMBARK
            </p>
            <p className="mb-6">The lease period includes:</p>
            <p className="text-sm">
              From: {bookingInfo["Departure Time"]} of the day {bookingDateDay} of{" "}
              {bookingDateMonth} of {bookingDateYear}
            </p>
            <p className="text-sm">
              Until: {departureMaximumHour} hours of the day {bookingDateDay} of{" "}
              {bookingDateMonth} of {bookingDateYear}
            </p>
            <h3>THIRD. – FUEL CONSUMPTION AND ALL-INCLUSIVE CLAUSES</h3>
            <p className="mb-6">
              The fuel consumption of the vessel will be charged at the end of the
              day according to the nautical miles sailed.
            </p>
            <p className="mb-6">
              For all-inclusive cases, fuel consumption will be estimated for 25
              nautical miles. NOT MEANTING THAT IT HAS UNLIMITED NAVIGATION
              INCLUDED.
            </p>
            <h3>FOURTh. - THE CAPTAIN</h3>
            <p className="mb-6">
              Under no circumstances may the authority of the vessel be
              transferred to a person other than the one registered as CAPTAIN.
              Likewise, the CAPTAIN has the last word in decisions of authority
              regarding the security of the boat and/or its passengers.
            </p>
            <h3>FIFTH. - DELIVERY OF THE BOAT</h3>
            <p className="mb-6">
              The boat will be delivered to THE LESSEE at the port and time
              indicated in this contract, ready to navigate. Any delay in boarding
              by THE LESSEE will not imply an extension in the period of the
              lease.All costs of water, electricity and port fees in the base port
              of the ship in Ibiza are included in the charter rate paid by THE
              LESSEE. If the boat is docked at a different port during the
              charter, THE LESSEE will pay mooring fees and charges for the
              consumptions in that port.
            </p>
            <h3>SIXTH. - PERSONAL PROPERTY OF PASSENGERS DURING THE CONTRACT</h3>
            <p className="mb-6">
              The MANAGER/OWNER is not responsible for any damages or losses that
              may occur during the term of leasing on the personal property of
              passengers.
            </p>
            <h3>SEVENTH. - NAVIGATION AREA</h3>
            <p className="mb-6">
              The permitted navigation area is established within the Balearic
              Islands and in accordance to the dispatch issued by captaincy for
              this vessel.
            </p>
            <p className="mb-6">
              Navigation is limited to a maximum of six (6) hours per day, unless
              the captain, at his own discretion, agrees to exceed this time
              limit.
            </p>
            <p className="mb-6">
              Navigation time is restricted from 9:00h until 21:00h, being
              navigation at night forbidden unless the captain, at his own
              discretion, agrees to navigate at night.
            </p>
            <p className="mb-6">
              THE MANAGER does not guarantee the comfort of the boat for
              navigation that occurs within the area planned for the development
              of the charter in bad weather conditions.
            </p>
            <h3>
              EIGHTH. - MAXIMUM NUMBER OF PEOPLE ON BOARD, LIABILITY OF MINORS AND
              HEALTH OF PEOPLE ON BOARD AND BELONGINGS OF THE LESSEE AND THEIR
              GUESTS
            </h3>
            <p className="mb-6">
              The maximum number of people authorized on board for navigation is
              according to the dispatch of the vessel.
            </p>
            <p className="mb-6">
              THE LESSEE will be responsible during the period of charter to
              control that the number of people who navigate aboard the ship do
              not exceed the maximum allowed.
            </p>
            <p className="mb-6">
              Similarly, only a reasonable number of guests/visitors will be
              permitted on board, at the sole discretion of the captain, during
              the moments in which the boat is conveniently moored to the port.
            </p>
            <p className="mb-6">
              In the event that there are minors on board, THE LESSEE will be the
              only one responsible for its security, conduct and entertainment. No
              member of the crew will be held responsible for their safety or
              entertainment.
            </p>
            <p className="mb-6">
              THE MANAGER is not responsible for the loss, theft or deterioration
              of the belongings of THE LESSEE and their guests.
            </p>
            <p className="mb-6">
              The nature of the charter can make it inadvisable for anyone who
              suffers physical disabilities or is under medical treatment. By
              signing this agreement, THE LESSEE guarantees the good health
              conditions of his/her guests/visitors for the trip contemplated in
              this agreement. THE CHARTER is not responsible for the health
              conditions of the people on board.
            </p>
            <h3>NINTH. - USE OF THE BOAT</h3>
            <p className="">
              1. THE LESSEE agrees to use the leased boat diligently, respecting
              the rules of a good navigator, and applying the rules of the Navy,
              Customs, Treasury and other public administrations that may result
              from execution.
            </p>
            <p className="">
              2. It is THE LESSEE’s obligation to keep the leased vessel in good
              using conditions, as well as all its existing installations.
            </p>
            <p className="">
              3. It is completely prohibited to bring animals on board, unless
              there is express authorization from THE MANAGER.
            </p>
            <p className="">
              4. THE LESSEE agrees to not embark drugs, narcotics, illegal
              substances, weapons or any other item which is not allowed by
              applicable laws
            </p>
            <p className="">
              5. The granting or subletting of the vessel to third parties is
              prohibited.
            </p>
            <p className="">
              6. Participation in races of any kind, cabotage or professional
              fishing, teaching navigation courses or using the boat for any other
              lucrative purpose is prohibited, unless expressly authorized by THE
              MANAGER.
            </p>
            <p className="">
              7. If weather conditions are not favorable, the captain may prohibit
              navigation.
            </p>
            <p className="">
              8. Towing other vessels except in emergencies is strictly forbidden,
              likewise, only the boat subject to this contract will be allowed to
              tow in cases of emergency and always with their own ropes to avoid
              the high costs of rescue. THE MANAGER will not accept agreements nor
              assume any type of responsibilities without the express
              authorization of THE MANAGER.
            </p>
            <p className="">
              9. In the event of a rescue or salvage situation of another vessel
              and/or its crew, the captain will be the only authorized person to
              make the decision to proceed with such rescue and the terms thereof.
              In the unlikely event of obtaining an award or compensation for a
              salvage or rescue, this will be equally split between THE MANAGER
              and THE LESSEE.
            </p>
            <p className="">
              10. THE LESSEE will be responsible for all the possible damages
              caused to the boat, either by himself or his guests, as well as the
              loss of objects or breakage of any element or its equipment included
              or not in the inventory of the boat. The value of said damages or
              objects will be discounted from the deposit. If the value of the
              damage or lost or damaged objects exceeds the amount of the deposit
              deposited, THE LESSEE must pay the remaining amount until covering
              the required total.
            </p>
            <h3>TENTH. - RETURN OF THE BOAT</h3>
            <p className="mb-6">
              If THE LESSEE wishes, he/she may return the vessel in the fixed port
              of disembarkation and disembark before the scheduled date for the
              end of the charter. This will not entail any right for THE LESSEE to
              claim any type of refund or compensation in the charter rate.
            </p>
            <h3>ELEVENTH. – USE OF WATER TOYS</h3>
            <p className="mb-6">
              Water toys are understood to be jet skis, seabob, water scooter,
              jetsurf, efoil, jet foil, surf, wakesurf, stand up paddle and any
              other self-propelled toy that can be directed by the lessee.
            </p>
            <p className="mb-6">
              The lessee declares through this contract that he is in a position
              to use the contracted toys and that he will use all the security
              measures provided for their use.
            </p>
            <p className="mb-6">
              The responsibility for the use of the above will fall on the lesse
              or on the person who is using it.
            </p>
            <p className="mb-6">
              The captain/owner/manager will not be responsible for the use made
              of these toys outside the boat.
            </p>
            <h3>TWELFTH. – CANCELLATION DUE TO BAD WEATHER</h3>
            <p className="mb-6">
              Bad weather is defined as winds greater than 20 knots, waves greater
              than 2m and rain. Cloudy skies are not considered bad weather. In
              the event that a rental has to be canceled due to bad weather, the
              client will have the option to modify the date for another available
              day. Cancellation due to bad weather does not imply a refund of the
              rental.
            </p>
            <h3>FOURTEENTH. – TOWING INFLATABLES</h3>
            <p className="mb-6">
              In order to prevent accidents, it is prohibited dragging or towing
              devices such as: Floats, Donuts, etc.
            </p>
            <h3>FOURTEENTH. - CANCELLATION AND RESOLUTION.</h3>
            <p className="mb-6">
              In the event that THE LESSEE cancels the lease up to 15 days before
              the provision of the service, THE MANAGER will retain 50% of the
              total price as a penalty.
            </p>
            <p className="mb-6">
              In case the cancellation occurs less than 15 days before the start
              of the charter, the penalty will be 100% of the total price.
            </p>
            <p className="mb-6">
              The deposit will not be refunded in the cases described above,
              however, if THE MANAGER or THE BROKER manage to re sell the charter
              booked dates by THE LESSEE to another client, the money paid will be
              kept as credit for a later date during the summer or to the
              following year.
            </p>
            <p className="mb-6">
              In the event that THE LESSEE cannot arrive to Ibiza because Spain or
              USA have closed their airspace THE LESSEE will receive a full refund
              of the money paid.
            </p>
            <p className="mb-6">
              In the event that Spain declares a state of emergency that forbids
              chartering and sailing THE LESSEE will receive a full refund of the
              money paid.
            </p>
            <h3>FIFTEENTH. - INSURANCE</h3>
            <p className="mb-6">
              The insurance of the boat is included in the price of the lease, the
              particular conditions of these policies are available to THE LESSEE.
            </p>
            <p className="mb-6">
              THE MANAGER shall not be liable in any case for damages to people,
              losses or damages that may be suffered by the personal possessions
              of THE LESSEE, crew or individuals on board the boat.
            </p>
            <p className="mb-6">
              THE LESSEE expressly accepts responsibility for the payment of any
              damage caused to the boat, this payment will be deducted from the
              deposit.
            </p>
            <h3>SIXTEENTH. - RESPONSIBILITY AGAINST THIRD PARTIES</h3>
            <p className="mb-6">
              THE LESSEE is obliged to indemnify THE MANAGER for damages to third
              parties due to negligence and that are not covered by the insurance,
              also running with all expenses, both material and legal.
            </p>
            <p className="mb-6">
              THE LESSEE takes full responsibility for his acts, especially in
              cases of confiscation of the ship due to any type of legal
              infraction. In the case of claims by third parties against THE
              LESSEE for the use of the leased vessel, THE MANAGER is exonerated
              of any type of responsibility.
            </p>
            <h3>SEVENTEENTH. - RESOLUTION OF DISCREPANCES.</h3>
            <p className="mb-6">
              For the resolution of any controversy, the contracting parties,
              after waiving any other jurisdiction or right that may correspond to
              them, submit to the jurisdiction of the Balearic Courts.
            </p>
            <p className="mb-6">
              And in order for this to be recorded and to have the appropriate
              effects and proof of compliance, the parties sign this document, in
              duplicate copies and for a single purpose, in the place and on the
              date indicated in the heading.
            </p>
          </div>
          <div className="flex flex-wrap justify-between items-end pt-4 md:pt-5 border-gray-200">
            <div className="flex items-end">
              <div className="border border-1">
                <SignaturePad
                  ref={sigPad}
                  penColor="black"
                  canvasProps={{
                    width: 300,
                    height: 120,
                    className: "sigCanvas",
                  }}
                  onEnd={checkSignature}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between m-4 m-md-0 h-min-[80px]">
            <button
              onClick={clearSigPad}
              type="button"
              className=" text-white font-medium rounded-lg text-sm px-2 text-center"
            >
              <svg
                fill="#000000"
                className="w-5 h-5"
                viewBox="0 0 1920 1920"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M960 0v213.333c411.627 0 746.667 334.934 746.667 746.667S1371.627 1706.667 960 1706.667 213.333 1371.733 213.333 960c0-197.013 78.4-382.507 213.334-520.747v254.08H640V106.667H53.333V320h191.04C88.64 494.08 0 720.96 0 960c0 529.28 430.613 960 960 960s960-430.72 960-960S1489.387 0 960 0"
                  fillRule="evenodd"
                />
              </svg>
            </button>
            {isSigned ? (
              <button
                onClick={agreeContract}
                data-modal-hide="default-modal"
                type="button"
                className="text-white bg-buttonColor2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
