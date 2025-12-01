import { useApp } from "@/store/AppContext";
export const StatsCard = () => {
  const { state } = useApp();

  const totalChai = state.orders.filter((o) => o.type === "chai").length;
  const totalCoffee = state.orders.filter((o) => o.type === "coffee").length;
  const guests = state.guests.length;
  const checkins = state.attendance.filter((a) => a.checkInTime).length;
  const inOffice = state.customers.filter((c) => c.isCheckedIn).length;

  const stats = [
    { label: "Chai", value: totalChai },
    { label: "Coffee", value: totalCoffee },
    { label: "Guests", value: guests },
    { label: "Check-ins", value: checkins },
    { label: "In Office", value: inOffice },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <p className="text-gray-500 text-sm mb-3 font-medium">
        Statistics Overview
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-2 rounded-lg bg-gray-50 border">
            <p className="text-xs text-gray-600">{stat.label}</p>
            <p className="text-lg font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
