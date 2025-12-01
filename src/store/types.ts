export interface Customer {
  id: string;
  name: string;
  email: string;
  password: string;
  cabinNumber: string;
  todayChaiCoffeeUsed: number;
  isCheckedIn: boolean;
  lastCheckIn?: number;
  lastCheckOut?: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  cabinNumber: string;
  type: "chai" | "coffee";
  status: "pending" | "completed";
  requestedAt: number;
  completedAt?: number;
  addedBy: "customer" | "office-boy";
}

export interface GuestRequest {
  id: string;
  customerId: string;
  customerName: string;
  cabinNumber: string;
  guestName: string;
  expectedTime: number;
  status: "pending" | "completed";
  requestedAt: number;
  completedAt?: number;
  addedBy: "customer" | "office-boy";
}

export interface AttendanceLog {
  id: string;
  customerId: string;
  customerName: string;
  cabinNumber: string;
  checkInTime: number;
  checkOutTime?: number;
  hoursSpent?: number;
  addedBy: "customer" | "office-boy";
}

export interface AppState {
  customers: Customer[];
  currentUser: Customer | null;
  orders: Order[];
  guests: GuestRequest[];
  attendance: AttendanceLog[];
}
