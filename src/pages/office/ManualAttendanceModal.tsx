import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
}

export const ManualAttendanceModal = ({ onClose }: Props) => {
  const { state, dispatch } = useApp();
  const [customerId, setCustomerId] = useState(state.customers[0].id);
  const [action, setAction] = useState<"checkin" | "checkout">("checkin");
  const [time, setTime] = useState<string>("");

  const handleSubmit = () => {
    const customer = state.customers.find((c) => c.id === customerId);
    if (!customer) return;

    const timestamp = time ? new Date(time).getTime() : Date.now();
    if (action === "checkin") {
      if (customer.isCheckedIn) {
        toast.error("Customer already Checked In!");
        return;
      }

      dispatch({
        type: "CHECK_IN",
        payload: {
          ...customer,
          lastCheckIn: timestamp,
          addedBy: "office-boy",
        },
      });
    } else if (action === "checkout") {
      if (!customer.isCheckedIn) {
        toast.error("Customer already Checked Out!");
        return;
      }

      dispatch({
        type: "CHECK_OUT",
        payload: {
          ...customer,
          lastCheckOut: timestamp,
          addedBy: "office-boy",
        },
      });
    }

    onClose();
  };

  return (
    <Modal title="Manual Check-in/out" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Customer</label>
          <select
            className="w-full border rounded p-2"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            {state.customers.map((c) => (
              <option
                key={c.id}
                value={c.id}
              >{`Cabin ${c.cabinNumber} (${c.name})`}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Action</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={action === "checkin"}
                onChange={() => setAction("checkin")}
              />{" "}
              Check-in
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={action === "checkout"}
                onChange={() => setAction("checkout")}
              />{" "}
              Check-out
            </label>
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Time</label>
          <input
            type="datetime-local"
            className="w-full border rounded p-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </Modal>
  );
};
