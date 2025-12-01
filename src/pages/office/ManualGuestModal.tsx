import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import type { GuestRequest } from "@/store/types";

interface Props {
  onClose: () => void;
}

export const ManualGuestModal = ({ onClose }: Props) => {
  const { state, dispatch } = useApp();
  const [customerId, setCustomerId] = useState(state.customers[0]?.id || "");
  const [guestName, setGuestName] = useState("");
  const [time, setTime] = useState<string>("");

  const handleSubmit = () => {
    const customer = state.customers.find((c) => c.id === customerId);
    if (!customer || !guestName) return;

    const expectedTime = time ? new Date(time).getTime() : Date.now();

    const newGuest: GuestRequest = {
      id: nanoid(),
      customerId,
      customerName: customer.name,
      cabinNumber: customer.cabinNumber,
      guestName,
      expectedTime,
      status: "pending",
      requestedAt: Date.now(),
      addedBy: "office-boy",
    };

    dispatch({ type: "ADD_GUEST", payload: newGuest });
    onClose();
  };

  return (
    <Modal title="Manual Guest Entry" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Customer</label>
          <select
            className="w-full border rounded p-2"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            {state.customers.map((c) => (
              <option key={c.id} value={c.id}>
                {`Cabin ${c.cabinNumber} (${c.name})`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Guest Name</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
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
