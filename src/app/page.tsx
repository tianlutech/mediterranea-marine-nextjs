import Image from 'next/image';
import Logo from '@/app/assets/Logo_color 1.png';

export default function Home() {
  return (
    <section className="gradient-form justify-center h-screen w-full">
      <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
        <div className="flex justify-between w-full lg:flex lg:flex-wrap h-screen">
          <div className="bg-red-500 w-[40%] relative h-full rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none">
            <div className='relative'>
              <Image
                width={50}
                height={50}
                src={'https://images.unsplash.com/photo-1535024966840-e7424dc2635b?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                className='object-cover w-full h-screen'
                alt=''
              />
            </div>
            <div className="absolute inset-0 z-10 px-4 py-6 text-white top-[24rem] md:mx-6 md:p-12">
              <h2 className="mb-6 text-3xl font-semibold text-center">
                BOAT BOOKING
              </h2>
              <p className="text-lg">
                Welcome to our Boat Reservation Form! We're excited to help you plan your next water adventure. Please take a moment to provide us with some essential details, so we can ensure you have a smooth and enjoyable experience. Your responses will help us schedule your boat reservation and cater to your specific needs. Thank you for choosing us for your boating adventure!
              </p>
            </div>
          </div>
          <div className="w-[60%] md:px-0">
            <div className="md:mx-6 md:p-12">
              <div className="text-center">
                <Image
                  width={48}
                  height={48}
                  src={Logo}
                  className="mx-auto w-48"
                  alt="logo"
                />
              </div>

              <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base my-10">
                <li className="flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
                  <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    Personal <span className="hidden sm:inline-flex sm:ml-2">Info</span>
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">2</span>
                  Confirmation
                </li>
              </ol>

              <div className="flex flex-col items-center justify-center w-full">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <form className="space-y-4 md:space-y-6" action="#">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="password" name="password" id="password" placeholder="KN 12 street" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
