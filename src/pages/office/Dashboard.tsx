import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { PendingRequestCard } from "./components/PendingRequestCard";
import { ManualOrderModal } from "./ManualOrderModal";
import { ManualGuestModal } from "./ManualGuestModal";
import { ManualAttendanceModal } from "./ManualAttendanceModal";
import { StatsCard } from "./components/StatsCard";
import { DropdownMenu } from "./components/DropdownMenu";

export const Dashboard = () => {
  const { state } = useApp();
  const [modal, setModal] = useState<"order" | "guest" | "attendance" | null>(
    null
  );

  const pendingOrders = state.orders.filter((o) => o.status === "pending");
  const completedOrders = state.orders.filter((o) => o.status === "completed");
  const pendingGuests = state.guests.filter((g) => g.status === "pending");
  const completedGuests = state.guests.filter((g) => g.status === "completed");
  const pendingCount = pendingOrders.length + pendingGuests.length;
  const completedCount = completedOrders.length + completedGuests.length;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl  font-semibold tracking-tight">
          Office Boy Dashboard
        </h1>

        <DropdownMenu
          items={[
            {
              label: "Add Chai/Coffee Order",
              onClick: () => setModal("order"),
            },
            { label: "Add Guest Entry", onClick: () => setModal("guest") },
            { label: "Manual Check-in", onClick: () => setModal("attendance") },
            {
              label: "Manual Check-out",
              onClick: () => setModal("attendance"),
            },
          ]}
          label="Manual Entry"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-xl p-4 border">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4 border">
          <p className="text-gray-500 text-sm">Completed Today</p>
          <p className="text-2xl font-bold">{completedCount}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4 border">
          <StatsCard />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-5 border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-red-500">●</span> Pending Requests (
          {pendingCount})
        </h2>

        <div className="space-y-3">
          {pendingOrders.map((o) => (
            <PendingRequestCard key={o.id} request={o} />
          ))}
          {pendingGuests.map((g) => (
            <PendingRequestCard key={g.id} request={g} />
          ))}

          {pendingCount === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">
              No pending requests 🎉
            </p>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-5 border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-green-500">✓</span> Completed Today (
          {completedCount})
        </h2>

        <ul className="space-y-2">
          {completedOrders.map((o) => (
            <li
              key={o.id}
              className="text-gray-700 text-sm border-b pb-2 last:border-none"
            >
              {`${o.type} - Cabin ${o.cabinNumber} (${o.customerName})`}
              <span className="font-semibold ml-2">
                {new Date(o.completedAt!).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
              </span>
            </li>
          ))}

          {completedGuests.map((g) => (
            <li
              key={g.id}
              className="text-gray-700 text-sm border-b pb-2 last:border-none"
            >
              {`Guest (${g.guestName}) - Cabin ${g.cabinNumber} (${g.customerName})`}
              <span className="font-semibold ml-2">
                {new Date(g.completedAt!).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
              </span>
            </li>
          ))}

          {completedCount === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">
              Nothing completed yet.
            </p>
          )}
        </ul>
      </div>

      {modal === "order" && <ManualOrderModal onClose={() => setModal(null)} />}
      {modal === "guest" && <ManualGuestModal onClose={() => setModal(null)} />}
      {modal === "attendance" && (
        <ManualAttendanceModal onClose={() => setModal(null)} />
      )}
    </div>
  );
};
