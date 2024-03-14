import Sidebar from "@/components/sidebar/sidebar";
import { useTranslation } from "react-i18next";
import { Boat, Booking } from "@/models/models";
import moment from "moment";

export default function BookingInfoSidebar({
  bookingInfo,
  boatInfo,
  showRemainingPayment,
}: {
  bookingInfo: Booking;
  boatInfo: Boat;
  showRemainingPayment: boolean
}) {
  const { t } = useTranslation();

  return (
    <Sidebar title={t("sidebar.boat_booking")} image={boatInfo.cover}>
      <div className="px-4 py-4 text-textSecondaryColor lg:text-base text-sm">
        <p
          dangerouslySetInnerHTML={{
            __html:
              showRemainingPayment ?
                t("sidebar.booking_info", {
                  boat: boatInfo.Nombre,
                  date: moment(bookingInfo.Date).format("DD/MM/YY"),
                  payment: bookingInfo.OutstandingPayment || 0,
                  location: bookingInfo.BoatLocation,
                })
                :
                t("sidebar.booking_info_without_remain", {
                  boat: boatInfo.Nombre,
                  date: moment(bookingInfo.Date).format("DD/MM/YY"),
                  location: bookingInfo.BoatLocation,
                })
            ,
          }}
        />
        <br />
        <p className="mb-6">
          {t(
            "sidebar.we_are_excited_to_help_you_plan_your_next_water_adventure"
          )}
        </p>
        <p className="mb-6">{t("sidebar.sidebar_p1")}</p>
        <p className="mb-6">{t("sidebar.sidebar_p2")}</p>
      </div>{" "}
    </Sidebar>
  );
}
