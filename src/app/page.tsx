import Sidebar from "./components/sidebar/sidebar";
import Booking from "./components/booking";
export default function Home() {
  return (
    <section className="gradient-form justify-center h-screen w-full text-black">
      <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
        <div className="flex md:flex-row flex-col justify-between w-full lg:flex lg:flex-wrap h-screen">
          <Sidebar />
          {/* forms section */}
          <Booking />
        </div>
      </div>
    </section>
  );
}
