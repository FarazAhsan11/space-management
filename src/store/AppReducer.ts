// import type { AppState, Customer } from "./types";
import type { AppState } from "./types";

export const initialState: AppState = {
  customers: [
    {
      id: "1",
      name: "John Doe",
      email: "john@workspace.com",
      password: "password123",
      cabinNumber: "4",
      todayChaiCoffeeUsed: 0,
      isCheckedIn: false,
    },
    {
      id: "2",
      name: "Sara Ali",
      email: "sara@workspace.com",
      password: "password123",
      cabinNumber: "7",
      todayChaiCoffeeUsed: 0,
      isCheckedIn: false,
    },
    {
      id: "3",
      name: "Ahmed Khan",
      email: "ahmed@workspace.com",
      password: "password123",
      cabinNumber: "12",
      todayChaiCoffeeUsed: 0,
      isCheckedIn: false,
    },
  ],
  currentUser: null,
  orders: [],
  guests: [],
  attendance: [],
};

export function appReducer(state: AppState, action: any): AppState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.payload };
    case "LOGOUT":
      return { ...state, currentUser: null };

    case "PLACE_ORDER": {
      const curr = state.currentUser;
      const updatedCustomers = state.customers.map((c) =>
        c.id === action.payload.customerId
          ? { ...c, todayChaiCoffeeUsed: c.todayChaiCoffeeUsed + 1 }
          : c
      );
      const updatedCurrentUser =
        curr && curr.id === action.payload.customerId
          ? { ...curr, todayChaiCoffeeUsed: curr.todayChaiCoffeeUsed + 1 }
          : curr;
      return {
        ...state,
        orders: [...state.orders, action.payload],
        customers: updatedCustomers,
        currentUser: updatedCurrentUser,
      };
    }

    case "ADD_GUEST":
      return { ...state, guests: [...state.guests, action.payload] };

    case "CHECK_IN": {
      const user = action.payload;
      const addedBy = user.addedBy ?? "customer";

      const updatedCustomers = state.customers.map((c) =>
        c.id === user.id
          ? {
              ...c,
              isCheckedIn: true,
              lastCheckIn: user.lastCheckIn ?? Date.now(),
            }
          : c
      );

      return {
        ...state,
        customers: updatedCustomers,
        attendance: [
          ...state.attendance,
          {
            id: crypto.randomUUID(),
            customerId: user.id,
            customerName: user.name,
            cabinNumber: user.cabinNumber,
            checkInTime: user.lastCheckIn ?? Date.now(),
            addedBy,
          },
        ],
        currentUser:
          state.currentUser?.id === user.id
            ? { ...user, isCheckedIn: true }
            : state.currentUser,
      };
    }
    case "CHECK_OUT": {
      const user = action.payload;
      const now = user.lastCheckOut ?? Date.now();
      const addedBy = user.addedBy ?? "customer";
      const checkIn = user.lastCheckIn ?? now;

      const hours = Number(((now - checkIn) / 3600000).toFixed(2));

      const updatedCustomers = state.customers.map((c) =>
        c.id === user.id ? { ...c, isCheckedIn: false, lastCheckOut: now } : c
      );

      const updatedAttendance = state.attendance.map((a) =>
        a.customerId === user.id && !a.checkOutTime
          ? { ...a, checkOutTime: now, hoursSpent: hours, addedBy }
          : a
      );

      return {
        ...state,
        customers: updatedCustomers,
        attendance: updatedAttendance,
        currentUser:
          state.currentUser?.id === user.id
            ? { ...user, isCheckedIn: false }
            : state.currentUser,
      };
    }

    case "MARK_ORDER_COMPLETE":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload.id
            ? {
                ...o,
                status: "completed",
                completedAt: action.payload.completedAt,
              }
            : o
        ),
      };

    case "MARK_GUEST_COMPLETE":
      return {
        ...state,
        guests: state.guests.map((g) =>
          g.id === action.payload.id
            ? {
                ...g,
                status: "completed",
                completedAt: action.payload.completedAt,
              }
            : g
        ),
      };

    default:
      return state;
  }
}

// case "CHECK_IN": {
//   const user: Customer = action.payload;
//   const updatedCustomers = state.customers.map((c) =>
//     c.id === user.id
//       ? { ...c, isCheckedIn: true, lastCheckIn: Date.now() }
//       : c
//   );
//   return {
//     ...state,
//     customers: updatedCustomers,
//     currentUser: { ...user, isCheckedIn: true, lastCheckIn: Date.now() },
//     attendance: [
//       ...state.attendance,
//       {
//         id: crypto.randomUUID(),
//         customerId: user.id,
//         customerName: user.name,
//         cabinNumber: user.cabinNumber,
//         checkInTime: Date.now(),
//         addedBy: "customer",
//       },
//     ],
//   };
// }

// case "CHECK_OUT": {
//   const user = action.payload;
//   const now = Date.now();
//   const hours = Number(
//     ((now - (user.lastCheckIn ?? now)) / 3600000).toFixed(2)
//   );

//   const updatedCustomers = state.customers.map((c) =>
//     c.id === user.id ? { ...c, isCheckedIn: false, lastCheckOut: now } : c
//   );

//   const updatedAttendance = state.attendance.map((a) =>
//     a.customerId === user.id && !a.checkOutTime
//       ? { ...a, checkOutTime: now, hoursSpent: hours }
//       : a
//   );

//   return {
//     ...state,
//     customers: updatedCustomers,
//     attendance: updatedAttendance,
//     currentUser: { ...user, isCheckedIn: false, lastCheckOut: now },
//   };
// }
