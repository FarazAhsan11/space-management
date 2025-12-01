import { useApp } from "@/store/AppContext";
import { Button } from "@/components/ui/button";
import { GuestModal } from "./GuestModal";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const user = state.currentUser;
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  }

  const handleOrder = (type: "chai" | "coffee") => {
    if (user.todayChaiCoffeeUsed >= 1) return;
    dispatch({
      type: "PLACE_ORDER",
      payload: {
        id: crypto.randomUUID(),
        customerId: user.id,
        customerName: user.name,
        cabinNumber: user.cabinNumber,
        type,
        status: "pending",
        requestedAt: Date.now(),
        addedBy: "customer",
      },
    });
  };

  const handleCheckIn = () => {
    dispatch({
      type: "CHECK_IN",
      payload: {
        ...state.currentUser,
        addedBy: "customer",
      },
    });
  };

  const handleCheckOut = () => {
    dispatch({
      type: "CHECK_OUT",
      payload: {
        ...state.currentUser,
        addedBy: "customer",
      },
    });
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      
      <div className="mx-auto max-w-4xl mb-6 bg-white shadow-sm px-4 py-4 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-lg sm:text-xl font-semibold text-center sm:text-left">
          Welcome, {user.name}{" "}
          <span className="text-gray-500">(Cabin {user.cabinNumber})</span>
        </h1>

        <Button
          variant="destructive"
          className="w-full sm:w-auto"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">

        <div className="bg-white p-4 rounded-xl shadow text-center sm:text-left">
          <p className="text-lg font-medium">
            Status:{" "}
            <span className={user.isCheckedIn ? "text-green-500" : "text-red-500"}>
              {user.isCheckedIn ? "🟢 Checked In" : "⚫ Checked Out"}
            </span>
          </p>
          <p className="text-gray-600 mt-1">
            Today's Chai/Coffee: <b>{user.todayChaiCoffeeUsed}/1 used</b>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            className="h-28 sm:h-32 text-xl sm:text-2xl bg-orange-200 hover:bg-orange-300 text-orange-900 flex flex-col justify-center"
            disabled={user.todayChaiCoffeeUsed >= 1}
            onClick={() => handleOrder("chai")}
          >
            ☕ <span className="text-base sm:text-lg font-semibold">ORDER CHAI</span>
          </Button>

          <Button
            className="h-28 sm:h-32 text-xl sm:text-2xl bg-amber-900 hover:bg-amber-800 text-white flex flex-col justify-center"
            disabled={user.todayChaiCoffeeUsed >= 1}
            onClick={() => handleOrder("coffee")}
          >
            ☕ <span className="text-base sm:text-lg font-semibold">ORDER COFFEE</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GuestModal />

          <Button
            className="h-28 sm:h-32 text-xl sm:text-2xl bg-green-200 hover:bg-green-300 text-green-900 flex flex-col justify-center"
            onClick={handleCheckIn}
            disabled={user.isCheckedIn}
          >
            🏢 <span className="text-base sm:text-lg font-semibold">CHECK-IN</span>
          </Button>
        </div>

        <div>
          <Button
            className="w-full h-28 sm:h-32 text-xl sm:text-2xl bg-red-200 hover:bg-red-300 text-red-900 flex flex-col justify-center"
            onClick={handleCheckOut}
            disabled={!user.isCheckedIn}
          >
            🚪 <span className="text-base sm:text-lg font-semibold">CHECK-OUT</span>
          </Button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">
            My Activity Today
          </h2>

          <div className="space-y-2 text-gray-700 text-sm sm:text-base">

            {state.orders
              .filter((o) => o.customerId === user.id)
              .map((o) => (
                <p key={o.id} >
                  • Ordered {o.type} at{" "}
                  {new Date(o.requestedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              ))}

            {state.guests
              .filter((g) => g.customerId === user.id)
              .map((g) => (
                <p key={g.id} >
                  • Guest: {g.guestName} at{" "}
                  {new Date(g.expectedTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              ))}

            {state.attendance
              .filter((a) => a.customerId === user.id)
              .map((a) => (
                <p key={a.id} >
                  • Checked in at{" "}
                  {new Date(a.checkInTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                  {a.checkOutTime &&
                    `, Checked out at ${new Date(a.checkOutTime).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )} (${a.hoursSpent} hrs)`}
                </p>
              ))}

            {state.orders.filter(o => o.customerId === user.id).length === 0 &&
              state.guests.filter(g => g.customerId === user.id).length === 0 &&
              state.attendance.filter(a => a.customerId === user.id).length === 0 && (
                <p className="text-gray-500 text-center">No activity yet.</p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
