"use client";

export default function CommonModal({ isOpen, closeModal }: { isOpen: boolean, closeModal: any }) {
  return (
    <div id="default-modal"
      onClick={() => closeModal()}
      aria-hidden="true"
      className={`${isOpen ? "flex" : "hidden"} h-full overflow-y-auto overflow-x-hidden fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-75 backdrop-filter`}>
      <div className="relative p-2 md:w-[60%] w-full md:h-auto bg-white rounded-lg shadow">
        <div className="flex items-center justify-between px-4 pt-4 md:px-4 md:pt-4 ">
          <h3 className="text-xl font-semibold text-black">
            Contract
          </h3>
          <button onClick={() => closeModal()} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
        </div>
        <div className="p-4 md:p-5 space-y-4 text-black">
          <p className="mb-6">
            Confidentiality. During the course of this Agreement, it may be necessary for the Client to share proprietary information, including trade secrets, industry knowledge, and other confidential information, with the Designer in order for the Designer to complete the Graphic Design services and Deliverables in their final form. The Designer will not share any of this proprietary information at any time. The Designer also will not use any of this proprietary information for the Designer’s personal benefit at any time. This section remains in full force and effect even after termination of the Agreement by its natural termination or early termination by either party.
          </p>
          <p className="mb-6">
            Termination. This Agreement shall automatically terminate upon the Client’s acceptance of the Deliverables. This Agreement may otherwise be terminated at any time by either Party upon written notice to the other party. The Client will be responsible for all costs and expenses incurred prior to the date of termination.
          </p>
          <p className="mb-6">
            Upon termination, the Designer shall return all the Client content, materials, and all copies of Deliverables to the Client at its earliest convenience, but in no event beyond thirty (30) days after the date of termination.
          </p>
          <p className="mb-6">
            While the Designer will customize the Client’s Graphic Design Deliverables to the Client’s specifications, the Client recognizes that Graphic Designs generally can have a common structure and basis. The Designer continues to own any and all template designs it may have created prior to this Agreement. The Designer will further own any template designs it may create as a result of this Agreement.
          </p>
          <p className="mb-6">
            Designer. The Designer represents and warrants that the Designer has the right to enter into and perform this Agreement. The Designer further represents and warrants that the Designer has the right to utilize and distribute the designs created for the Client and that such designs are not owned by anyone else to the Designers knowledge. In the event that the Designer does not have these rights, the Designer will reimburse the Client for any associated damages the Client may experience or will take responsibility for such damages so that the Client does not experience any damages.
          </p>
        </div>
        <div className="flex items-center justify-end p-4 md:p-5 border-gray-200">
          <button onClick={() => closeModal()} data-modal-hide="default-modal" type="button" className="text-white bg-buttonColor2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Contract</button>
        </div>
      </div>
    </div>
  );
}
