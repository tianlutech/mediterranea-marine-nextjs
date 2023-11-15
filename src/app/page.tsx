import Image from "next/image";
import Logo from "@/app/assets/Logo_color 1.png";
import Boat from "@/app/assets/boat.png"

export default function Home() {
  return (
    <section className="gradient-form justify-center h-screen w-full text-black">
      <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
        <div className="flex md:flex-row flex-col justify-between w-full lg:flex lg:flex-wrap h-screen">
          <div className="relative bg-white md:w-[23%] w-full h-full ">
            <div className="flex flex-col justify-center items-center my-4">
              <Image
                width={60}
                height={48}
                src={Logo}
                className="w-60"
                alt="logo"
              />
              <span className="text-black">Language: </span>
            </div>
            <div className="bg-chocolate py-4 flex justify-center items-center">
              <span className="font-extrabold text-3xl text-white">BOAT BOOKING</span>
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
          <div className="md:w-[77%] w-full md:p-6 p-2">
            <div className="justify-between w-full ">
              <div className="md:flex justify-between w-full ">
                {/* first form */}
                <div className="flex md:flex-row flex-col md:w-[49%] w-full">
                  <div className="w-full bg-white rounded-lg">
                    <div className="md:p-6 sm:p-8 p-6">
                      <form className="" action="#">
                        <div className="flex justify-between w-full">
                          <div className="relative w-[48%]">
                            <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 bottom-[1.8rem] bg-white left-4 px-2">First name</label>
                            <input type="email" name="email" id="email" className=" w-full border border-gray-300 text-black text-start p-[0.7rem] rounded-lg" placeholder="Your first name" />
                          </div>
                          <div className="relative w-[48%]">
                            <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 bottom-[1.8rem] bg-white left-4 px-2">Last name</label>
                            <input type="email" name="email" id="email" className="w-full border border-gray-300 text-black text-start p-[0.7rem] rounded-lg" placeholder="Your last name" />
                          </div>
                        </div>
                        <div className="relative w-full mt-6">
                          <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 bottom-[1.8rem] bg-white left-4 px-2">Identity / Passport ID</label>
                          <input type="email" name="email" id="email" className="w-full border border-gray-300 text-black text-start p-[0.7rem] px-8 rounded-lg" placeholder="name@company.com" />
                        </div>
                        <div className="relative w-full mt-6 border border-gray-300 p-[0.7rem] md:px-6 px-2 rounded-lg">
                          <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 top-[-0.6rem] bg-white left-4 px-2">Identity / Passport Picture (Front)</label>
                          <div className="flex mt-3">
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <path d="M32 32L24 24L16 32" stroke="black" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M24 24V42" stroke="black" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M40.78 36.78C42.7307 35.7165 44.2717 34.0338 45.1597 31.9973C46.0478 29.9607 46.2324 27.6865 45.6844 25.5334C45.1364 23.3803 43.887 21.471 42.1333 20.1069C40.3797 18.7428 38.2217 18.0015 36 18H33.48C32.8746 15.6585 31.7463 13.4847 30.1799 11.642C28.6135 9.7993 26.6497 8.3357 24.4362 7.36121C22.2227 6.38673 19.8171 5.92672 17.4002 6.01576C14.9834 6.10481 12.6181 6.7406 10.4823 7.87533C8.34657 9.01006 6.49582 10.6142 5.06924 12.5672C3.64266 14.5201 2.67738 16.7711 2.24596 19.1508C1.81454 21.5305 1.92821 23.9771 2.57842 26.3065C3.22864 28.636 4.39848 30.7877 6 32.6" stroke="black" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M32 32L24 24L16 32" stroke="black" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </div>
                            <div className="flex flex-col ml-4">
                              <span className="text-black">Select a file or drag and drop here</span>
                              <span className="greytext mt-2">JPG, PNG or PDF, file size no more than 10MB</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4 p-2 bg-bgColor1">
                            <div className="flex justify-center items-center text-center">
                              <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M9.75301 10.5C10.0485 10.5 10.3411 10.4418 10.614 10.3287C10.887 10.2157 11.1351 10.0499 11.344 9.84099C11.5529 9.63206 11.7187 9.38402 11.8317 9.11104C11.9448 8.83806 12.003 8.54547 12.003 8.25C12.003 7.95453 11.9448 7.66194 11.8317 7.38896C11.7187 7.11598 11.5529 6.86794 11.344 6.65901C11.1351 6.45008 10.887 6.28434 10.614 6.17127C10.3411 6.0582 10.0485 6 9.75301 6C9.15627 6 8.58397 6.23705 8.16202 6.65901C7.74006 7.08097 7.50301 7.65326 7.50301 8.25C7.50301 8.84674 7.74006 9.41903 8.16202 9.84099C8.58397 10.2629 9.15627 10.5 9.75301 10.5Z" fill="#202945" />
                                  <path d="M21 21C21 21.7956 20.6839 22.5587 20.1213 23.1213C19.5587 23.6839 18.7956 24 18 24H6C5.20435 24 4.44129 23.6839 3.87868 23.1213C3.31607 22.5587 3 21.7956 3 21V3C3 2.20435 3.31607 1.44129 3.87868 0.87868C4.44129 0.316071 5.20435 0 6 0L14.25 0L21 6.75V21ZM6 1.5C5.60218 1.5 5.22064 1.65804 4.93934 1.93934C4.65804 2.22064 4.5 2.60218 4.5 3V18L7.836 14.664C7.95422 14.5461 8.10843 14.4709 8.27417 14.4506C8.43992 14.4302 8.60773 14.4657 8.751 14.5515L12 16.5L15.2355 11.97C15.2988 11.8815 15.3806 11.8078 15.4753 11.754C15.5699 11.7003 15.6751 11.6678 15.7836 11.6588C15.8921 11.6498 16.0012 11.6645 16.1034 11.702C16.2056 11.7394 16.2985 11.7986 16.3755 11.8755L19.5 15V6.75H16.5C15.9033 6.75 15.331 6.51295 14.909 6.09099C14.4871 5.66903 14.25 5.09674 14.25 4.5V1.5H6Z" fill="#202945" />
                                </svg>
                              </div>
                              <span className="text-black text-center md:ml-4 ml-2 md:text-base text-xs">Passport Front.png</span>
                              <span className="text-black md:ml-4 ml-2 md:text-base text-xs text-center">Preview</span>
                            </div>
                            <span className="text-black md:text-base text-xs">5.7 MB</span>
                          </div>
                        </div>
                        <div className="relative w-full mt-6 border border-gray-300 p-[0.7rem] px-6 rounded-lg">
                          <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 top-[-0.6rem] bg-white left-4 px-2">Identity / Passport Picture (Back)</label>
                          <div className="flex mt-3">
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <path d="M32 32L24 24L16 32" stroke="black" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M24 24V42" stroke="black" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M40.78 36.78C42.7307 35.7165 44.2717 34.0338 45.1597 31.9973C46.0478 29.9607 46.2324 27.6865 45.6844 25.5334C45.1364 23.3803 43.887 21.471 42.1333 20.1069C40.3797 18.7428 38.2217 18.0015 36 18H33.48C32.8746 15.6585 31.7463 13.4847 30.1799 11.642C28.6135 9.7993 26.6497 8.3357 24.4362 7.36121C22.2227 6.38673 19.8171 5.92672 17.4002 6.01576C14.9834 6.10481 12.6181 6.7406 10.4823 7.87533C8.34657 9.01006 6.49582 10.6142 5.06924 12.5672C3.64266 14.5201 2.67738 16.7711 2.24596 19.1508C1.81454 21.5305 1.92821 23.9771 2.57842 26.3065C3.22864 28.636 4.39848 30.7877 6 32.6" stroke="black" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M32 32L24 24L16 32" stroke="black" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </div>
                            <div className="flex flex-col ml-4">
                              <span className="text-black">Select a file or drag and drop here</span>
                              <span className="greytext mt-2">JPG, PNG or PDF, file size no more than 10MB</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4 p-2 bg-bgColor1">
                            <div className="flex justify-center items-center text-center">
                              <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M9.75301 10.5C10.0485 10.5 10.3411 10.4418 10.614 10.3287C10.887 10.2157 11.1351 10.0499 11.344 9.84099C11.5529 9.63206 11.7187 9.38402 11.8317 9.11104C11.9448 8.83806 12.003 8.54547 12.003 8.25C12.003 7.95453 11.9448 7.66194 11.8317 7.38896C11.7187 7.11598 11.5529 6.86794 11.344 6.65901C11.1351 6.45008 10.887 6.28434 10.614 6.17127C10.3411 6.0582 10.0485 6 9.75301 6C9.15627 6 8.58397 6.23705 8.16202 6.65901C7.74006 7.08097 7.50301 7.65326 7.50301 8.25C7.50301 8.84674 7.74006 9.41903 8.16202 9.84099C8.58397 10.2629 9.15627 10.5 9.75301 10.5Z" fill="#202945" />
                                  <path d="M21 21C21 21.7956 20.6839 22.5587 20.1213 23.1213C19.5587 23.6839 18.7956 24 18 24H6C5.20435 24 4.44129 23.6839 3.87868 23.1213C3.31607 22.5587 3 21.7956 3 21V3C3 2.20435 3.31607 1.44129 3.87868 0.87868C4.44129 0.316071 5.20435 0 6 0L14.25 0L21 6.75V21ZM6 1.5C5.60218 1.5 5.22064 1.65804 4.93934 1.93934C4.65804 2.22064 4.5 2.60218 4.5 3V18L7.836 14.664C7.95422 14.5461 8.10843 14.4709 8.27417 14.4506C8.43992 14.4302 8.60773 14.4657 8.751 14.5515L12 16.5L15.2355 11.97C15.2988 11.8815 15.3806 11.8078 15.4753 11.754C15.5699 11.7003 15.6751 11.6678 15.7836 11.6588C15.8921 11.6498 16.0012 11.6645 16.1034 11.702C16.2056 11.7394 16.2985 11.7986 16.3755 11.8755L19.5 15V6.75H16.5C15.9033 6.75 15.331 6.51295 14.909 6.09099C14.4871 5.66903 14.25 5.09674 14.25 4.5V1.5H6Z" fill="#202945" />
                                </svg>
                              </div>
                              <span className="text-black text-center md:ml-4 ml-2 md:text-base text-xs">Passport back.png</span>
                              <span className="text-black md:ml-4 ml-2 md:text-base text-xs text-center">Preview</span>
                            </div>
                            <span className="text-black md:text-base text-xs">5.7 MB</span>
                          </div>
                        </div>
                        <div className="relative w-full mt-6">
                          <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 bottom-[1.8rem] bg-white left-4 px-2">Billing address</label>
                          <input type="email" name="email" id="email" className="w-full border border-gray-300 text-black text-start p-[0.7rem] px-8 rounded-lg" placeholder="name@company.com" />
                        </div>
                        <div className="flex justify-between w-full mt-6">
                          <div className="relative w-[48%]">
                            <label className="block absolute px-2 text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">Adults passengers</label>
                            <select id="countries" className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-4 ">
                              <option selected>1</option>
                              <option value="US">2</option>
                              <option value="CA">3</option>
                              <option value="FR">4</option>
                              <option value="DE">5</option>
                            </select>
                          </div>
                          <div className="relative w-[48%]">
                            <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">Kids passengers</label>
                            <select id="countries" className="border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-4">
                              <option selected>1</option>
                              <option value="US">2</option>
                              <option value="CA">3</option>
                              <option value="FR">4</option>
                              <option value="DE">5</option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-6 text-black flex">
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M6.5 11.5H8M9.5 11.5H8M8 11.5V7.5H6.5M8.5 5C8.5 5.27614 8.27614 5.5 8 5.5C7.72386 5.5 7.5 5.27614 7.5 5C7.5 4.72386 7.72386 4.5 8 4.5C8.27614 4.5 8.5 4.72386 8.5 5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                              <circle cx="8" cy="8" r="6.5" stroke="black" />
                            </svg>
                          </div>
                          <span className="text-sm ml-2">We require to know this information to prepare the lifevest
                            and other equipment accordingly</span>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Second form */}

                <div className="flex md:mt-0 mt-4 md:flex-row flex-col md:w-[49%] w-full">
                  <div className="w-full bg-white rounded-lg">
                    <div className="md:p-6 sm:p-8 p-6">
                      <form className="" action="#">
                        <div className="relative w-full">
                          <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">Arrival time</label>
                          <select id="countries" className="border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-4">
                            <option selected>10:00 AM</option>
                            <option value="US">10:00 AM</option>
                            <option value="CA">10:00 AM</option>
                            <option value="FR">10:00 AM</option>
                            <option value="DE">10:00 AM</option>
                          </select>
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
                            <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 bottom-[1.8rem] bg-white left-4 px-2">First name</label>
                            <input type="email" name="email" id="email" className=" w-full border border-gray-300 text-black text-start p-[0.85rem] rounded-lg" placeholder="Your first name" />
                          </div>
                          <div className="relative w-[48%]">
                            <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">Kids passengers</label>
                            <select id="countries" className="border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-4">
                              <option selected>1</option>
                              <option value="US">2</option>
                              <option value="CA">3</option>
                              <option value="FR">4</option>
                              <option value="DE">5</option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-6 text-black flex">
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M6.5 11.5H8M9.5 11.5H8M8 11.5V7.5H6.5M8.5 5C8.5 5.27614 8.27614 5.5 8 5.5C7.72386 5.5 7.5 5.27614 7.5 5C7.5 4.72386 7.72386 4.5 8 4.5C8.27614 4.5 8.5 4.72386 8.5 5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                              <circle cx="8" cy="8" r="6.5" stroke="black" />
                            </svg>
                          </div>
                          <span className="text-sm ml-2">Is common for our clients to book in a restuarant, providing to us the
                            restuarnat name and the meal appointment  can help our captian to
                            adjust and apdat the route of your sail</span>
                        </div>
                        <div className="relative w-full mt-6">
                          <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 bottom-[2.8rem] bg-white left-4 px-2">General comments</label>
                          <textarea id="message" className="block p-2.5 w-full text-sm text-black rounded-lg border border-gray-300" placeholder=""></textarea>
                        </div>
                        <div className="relative w-full mt-6">
                          <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">Prepayment of fuel</label>
                          <select id="countries" className="border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-4">
                            <option selected>25 Nautical Miles - 250€</option>
                            <option value="US">25 Nautical Miles - 250€</option>
                            <option value="CA">25 Nautical Miles - 250€</option>
                            <option value="FR">25 Nautical Miles - 250€</option>
                            <option value="DE">25 Nautical Miles - 250€</option>
                          </select>
                        </div>
                        <div className="mt-2 text-black flex">
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M6.5 11.5H8M9.5 11.5H8M8 11.5V7.5H6.5M8.5 5C8.5 5.27614 8.27614 5.5 8 5.5C7.72386 5.5 7.5 5.27614 7.5 5C7.5 4.72386 7.72386 4.5 8 4.5C8.27614 4.5 8.5 4.72386 8.5 5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                              <circle cx="8" cy="8" r="6.5" stroke="black" />
                            </svg>
                          </div>
                          <span className="text-sm ml-2">inviting the user to pay the fuel at the beginning.</span>
                        </div>
                        <div className="relative w-full mt-6 flex justify-between items-center">
                          <div className="w-[90%]">
                            <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">Toy: Stand Up Paddle</label>
                            <select id="countries" className="border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-4">
                              <option selected>10:00 AM</option>
                              <option value="US">10:00 AM</option>
                              <option value="CA">10:00 AM</option>
                              <option value="FR">10:00 AM</option>
                              <option value="DE">10:00 AM</option>
                            </select>
                          </div>
                          <div className="w-[8%]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                              <path d="M20 37.9167C16.4564 37.9167 12.9924 36.8659 10.046 34.8972C7.09964 32.9285 4.80322 30.1303 3.44715 26.8564C2.09108 23.5826 1.73627 19.9801 2.42758 16.5046C3.1189 13.0291 4.8253 9.8367 7.33099 7.33101C9.83668 4.82532 13.0291 3.11892 16.5046 2.4276C19.9801 1.73628 23.5826 2.09109 26.8564 3.44716C30.1302 4.80323 32.9284 7.09966 34.8972 10.046C36.8659 12.9924 37.9167 16.4564 37.9167 20C37.9122 24.7504 36.0232 29.3051 32.6641 32.6641C29.305 36.0232 24.7504 37.9123 20 37.9167ZM20 4.58334C16.9509 4.58334 13.9702 5.48751 11.4349 7.18151C8.89969 8.87552 6.9237 11.2833 5.75685 14.1003C4.58999 16.9173 4.28469 20.0171 4.87955 23.0076C5.4744 25.9982 6.9427 28.7452 9.09876 30.9012C11.2548 33.0573 14.0018 34.5256 16.9923 35.1204C19.9829 35.7153 23.0827 35.41 25.8997 34.2431C28.7167 33.0763 31.1245 31.1003 32.8185 28.565C34.5125 26.0298 35.4167 23.0491 35.4167 20C35.4122 15.9126 33.7866 11.9939 30.8963 9.10365C28.0061 6.21342 24.0874 4.58775 20 4.58334Z" fill="#6C727F" />
                              <path d="M17.8167 28.7167C16.9327 28.7167 16.0848 28.3655 15.4597 27.7404C14.8346 27.1152 14.4834 26.2674 14.4834 25.3833V15.3833C14.4942 14.7826 14.6672 14.196 14.9841 13.6855C15.3009 13.175 15.7499 12.7596 16.2834 12.4833C16.8207 12.2095 17.4223 12.0866 18.024 12.1277C18.6257 12.1688 19.2049 12.3723 19.7001 12.7167L26.8501 17.7167C27.2769 18.0257 27.6244 18.4315 27.8641 18.9009C28.1037 19.3702 28.2286 19.8897 28.2286 20.4167C28.2286 20.9437 28.1037 21.4631 27.8641 21.9325C27.6244 22.4018 27.2769 22.8076 26.8501 23.1167L19.7001 28.1167C19.1474 28.5025 18.4907 28.7117 17.8167 28.7167ZM17.8167 14.6167C17.6898 14.6167 17.5645 14.6452 17.4501 14.7C17.3187 14.7678 17.2086 14.8706 17.1321 14.9971C17.0556 15.1236 17.0157 15.2688 17.0167 15.4167V25.4167C17.0157 25.5645 17.0556 25.7097 17.1321 25.8362C17.2086 25.9628 17.3187 26.0656 17.4501 26.1333C17.5709 26.2143 17.713 26.2575 17.8584 26.2575C18.0038 26.2575 18.1459 26.2143 18.2667 26.1333L25.4167 21.1333C25.5233 21.0617 25.6106 20.9649 25.671 20.8516C25.7313 20.7382 25.7629 20.6118 25.7629 20.4833C25.7629 20.3549 25.7313 20.2285 25.671 20.1151C25.6106 20.0018 25.5233 19.905 25.4167 19.8333L18.3334 14.7667C18.1864 14.653 18.0017 14.5994 17.8167 14.6167Z" fill="#6C727F" />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-2 text-black flex">
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M6.5 11.5H8M9.5 11.5H8M8 11.5V7.5H6.5M8.5 5C8.5 5.27614 8.27614 5.5 8 5.5C7.72386 5.5 7.5 5.27614 7.5 5C7.5 4.72386 7.72386 4.5 8 4.5C8.27614 4.5 8.5 4.72386 8.5 5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                              <circle cx="8" cy="8" r="6.5" stroke="black" />
                            </svg>
                          </div>
                          <span className="text-sm ml-2">Click here to see the video of the SUP</span>
                        </div>
                        <div className="relative w-full mt-6 flex justify-between items-center">
                          <div className="w-[90%]">
                            <label className="block px-2 absolute text-black bottom-[2.7rem] z-10 bg-white left-4 text-sm font-medium">Toy: SEABOB </label>
                            <select id="countries" className="border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-4">
                              <option selected>10:00 AM</option>
                              <option value="US">10:00 AM</option>
                              <option value="CA">10:00 AM</option>
                              <option value="FR">10:00 AM</option>
                              <option value="DE">10:00 AM</option>
                            </select>
                          </div>
                          <div className="w-[8%]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                              <path d="M20 37.9167C16.4564 37.9167 12.9924 36.8659 10.046 34.8972C7.09964 32.9285 4.80322 30.1303 3.44715 26.8564C2.09108 23.5826 1.73627 19.9801 2.42758 16.5046C3.1189 13.0291 4.8253 9.8367 7.33099 7.33101C9.83668 4.82532 13.0291 3.11892 16.5046 2.4276C19.9801 1.73628 23.5826 2.09109 26.8564 3.44716C30.1302 4.80323 32.9284 7.09966 34.8972 10.046C36.8659 12.9924 37.9167 16.4564 37.9167 20C37.9122 24.7504 36.0232 29.3051 32.6641 32.6641C29.305 36.0232 24.7504 37.9123 20 37.9167ZM20 4.58334C16.9509 4.58334 13.9702 5.48751 11.4349 7.18151C8.89969 8.87552 6.9237 11.2833 5.75685 14.1003C4.58999 16.9173 4.28469 20.0171 4.87955 23.0076C5.4744 25.9982 6.9427 28.7452 9.09876 30.9012C11.2548 33.0573 14.0018 34.5256 16.9923 35.1204C19.9829 35.7153 23.0827 35.41 25.8997 34.2431C28.7167 33.0763 31.1245 31.1003 32.8185 28.565C34.5125 26.0298 35.4167 23.0491 35.4167 20C35.4122 15.9126 33.7866 11.9939 30.8963 9.10365C28.0061 6.21342 24.0874 4.58775 20 4.58334Z" fill="#6C727F" />
                              <path d="M17.8167 28.7167C16.9327 28.7167 16.0848 28.3655 15.4597 27.7404C14.8346 27.1152 14.4834 26.2674 14.4834 25.3833V15.3833C14.4942 14.7826 14.6672 14.196 14.9841 13.6855C15.3009 13.175 15.7499 12.7596 16.2834 12.4833C16.8207 12.2095 17.4223 12.0866 18.024 12.1277C18.6257 12.1688 19.2049 12.3723 19.7001 12.7167L26.8501 17.7167C27.2769 18.0257 27.6244 18.4315 27.8641 18.9009C28.1037 19.3702 28.2286 19.8897 28.2286 20.4167C28.2286 20.9437 28.1037 21.4631 27.8641 21.9325C27.6244 22.4018 27.2769 22.8076 26.8501 23.1167L19.7001 28.1167C19.1474 28.5025 18.4907 28.7117 17.8167 28.7167ZM17.8167 14.6167C17.6898 14.6167 17.5645 14.6452 17.4501 14.7C17.3187 14.7678 17.2086 14.8706 17.1321 14.9971C17.0556 15.1236 17.0157 15.2688 17.0167 15.4167V25.4167C17.0157 25.5645 17.0556 25.7097 17.1321 25.8362C17.2086 25.9628 17.3187 26.0656 17.4501 26.1333C17.5709 26.2143 17.713 26.2575 17.8584 26.2575C18.0038 26.2575 18.1459 26.2143 18.2667 26.1333L25.4167 21.1333C25.5233 21.0617 25.6106 20.9649 25.671 20.8516C25.7313 20.7382 25.7629 20.6118 25.7629 20.4833C25.7629 20.3549 25.7313 20.2285 25.671 20.1151C25.6106 20.0018 25.5233 19.905 25.4167 19.8333L18.3334 14.7667C18.1864 14.653 18.0017 14.5994 17.8167 14.6167Z" fill="#6C727F" />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-2 text-black flex">
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M6.5 11.5H8M9.5 11.5H8M8 11.5V7.5H6.5M8.5 5C8.5 5.27614 8.27614 5.5 8 5.5C7.72386 5.5 7.5 5.27614 7.5 5C7.5 4.72386 7.72386 4.5 8 4.5C8.27614 4.5 8.5 4.72386 8.5 5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                              <circle cx="8" cy="8" r="6.5" stroke="black" />
                            </svg>
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
        </div>
      </div>
    </section>
  );
}
