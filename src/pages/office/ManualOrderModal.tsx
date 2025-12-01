import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import type { Order } from "@/store/types";

interface Props {
  onClose: () => void;
}

export const ManualOrderModal = ({ onClose }: Props) => {
  const { state, dispatch } = useApp();
  const [customerId, setCustomerId] = useState(state.customers[0]?.id || "");
  const [orderType, setOrderType] = useState<"chai" | "coffee">("chai");

  const handleSubmit = () => {
    const customer = state.customers.find((c) => c.id === customerId);
    if (!customer) return;

    const newOrder: Order = {
      id: nanoid(),
      customerId,
      customerName: customer.name,
      cabinNumber: customer.cabinNumber,
      type: orderType,
      status: "pending",
      requestedAt: Date.now(),
      addedBy: "office-boy",
    };
    if(customer.todayChaiCoffeeUsed === 0){
    dispatch({ type: "PLACE_ORDER", payload: newOrder });
    onClose();
    }
    else alert("User have Already Ordered for today");
    
  };

  return (
    <Modal title="Manual Order Entry" onClose={onClose}>
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
          <label className="block mb-1 font-medium">Order Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={orderType === "chai"}
                onChange={() => setOrderType("chai")}
              />{" "}
              Chai
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={orderType === "coffee"}
                onChange={() => setOrderType("coffee")}
              />{" "}
              Coffee
            </label>
          </div>
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
