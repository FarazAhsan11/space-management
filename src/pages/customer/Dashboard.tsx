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
    // dispatch({ type: "CHECK_IN", payload: user });
    dispatch({
      type: "CHECK_IN",
      payload: {
        ...state.currentUser,
        addedBy: "customer",
      },
    });
  };

  const handleCheckOut = () => {
    // dispatch({ type: "CHECK_OUT", payload: user });
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
      <div className="mx-auto max-w-4xl mb-6 bg-white shadow-sm px-4 py-4 rounded-xl flex justify-between">
        <h1 className="text-lg font-semibold">
          Welcome, {user.name}{" "}
          <span className="text-gray-500">(Cabin {user.cabinNumber})</span>
        </h1>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-lg font-medium">
            Status:{" "}
            <span
              className={user.isCheckedIn ? "text-green-500" : "text-red-500"}
            >
              {user.isCheckedIn ? "🟢 Checked In" : "⚫ Checked Out"}
            </span>
          </p>
          <p className="text-gray-600">
            Today's Chai/Coffee: <b>{user.todayChaiCoffeeUsed}/1 used</b>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            className="h-32 text-2xl bg-orange-200 hover:bg-orange-300 text-orange-900"
            disabled={user.todayChaiCoffeeUsed >= 1}
            onClick={() => handleOrder("chai")}
          >
            ☕ <span className="text-lg mt-2 font-semibold">ORDER CHAI</span>
          </Button>

          <Button
            className="h-32 text-2xl bg-amber-900 hover:bg-amber-800 text-white"
            disabled={user.todayChaiCoffeeUsed >= 1}
            onClick={() => handleOrder("coffee")}
          >
            ☕ <span className="text-lg mt-2 font-semibold">ORDER COFFEE</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <GuestModal />

          <Button
            className="h-32 text-2xl bg-green-200 hover:bg-green-300 text-green-900"
            onClick={handleCheckIn}
            disabled={user.isCheckedIn}
          >
            🏢 <span className="text-lg mt-2 font-semibold">CHECK-IN</span>
          </Button>
        </div>

        <div className="mt-4">
          <Button
            className="w-full h-32 text-2xl bg-red-200 hover:bg-red-300 text-red-900"
            onClick={handleCheckOut}
            disabled={!user.isCheckedIn}
          >
            🚪 <span className="text-lg mt-2 font-semibold">CHECK-OUT</span>
          </Button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">My Activity Today</h2>

          <div className="space-y-2 text-gray-700">
            {state.orders
              .filter((o) => o.customerId === user.id)
              .map((o) => (
                <p key={o.id}>
                  • Ordered {o.type} at{" "}
                  {new Date(o.requestedAt).toLocaleTimeString()}
                </p>
              ))}

            {state.guests
              .filter((g) => g.customerId === user.id)
              .map((g) => (
                <p key={g.id}>
                  • Guest: {g.guestName} at{" "}
                  {new Date(g.expectedTime).toLocaleTimeString()}
                </p>
              ))}

            {state.attendance
              .filter((a) => a.customerId === user.id)
              .map((a) => (
                <p key={a.id}>
                  • Checked in at {new Date(a.checkInTime).toLocaleTimeString()}
                  {a.checkOutTime &&
                    `, Checked out at ${new Date(
                      a.checkOutTime
                    ).toLocaleTimeString()} (${a.hoursSpent} hrs)`}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
