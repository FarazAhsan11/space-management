import { toast } from "sonner";
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
    if (!customer) {
      toast.error("Please select a customer.");
      return;
    }

    if (!guestName.trim()) {
      toast.error("Guest name is required.");
      return;
    }

    if (!time) {
      toast.error("Please select a time.");
      return;
    }

   
    const [hours, minutes] = time.split(":").map(Number);

    const now = new Date();
    const expected = new Date();
    expected.setHours(hours, minutes, 0, 0);

    const expectedTime = expected.getTime();

    if (expectedTime < now.getTime()) {
      toast.error("Time cannot be in the past.");
      return;
    }

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

    toast.success(`Guest request added for ${guestName}.`);

    onClose();
  };

  return (
    <Modal title="Manual Guest Entry" onClose={onClose}>
      <form className="space-y-4">

        <div>
          <label className="block mb-1 font-medium">Customer</label>
          <select
            required
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
            required
            type="text"
            className="w-full border rounded p-2"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Time</label>
          <input
            required
            type="time"
            className="w-full border rounded p-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
};


// import { useState } from "react";
// import { useApp } from "@/store/AppContext";
// import { Modal } from "@/components/ui/modal";
// import { Button } from "@/components/ui/button";
// import { nanoid } from "nanoid";
// import type { GuestRequest } from "@/store/types";

// interface Props {
//   onClose: () => void;
// }

// export const ManualGuestModal = ({ onClose }: Props) => {
//   const { state, dispatch } = useApp();
//   const [customerId, setCustomerId] = useState(state.customers[0]?.id || "");
//   const [guestName, setGuestName] = useState("");
//   const [time, setTime] = useState<string>("");

//   const handleSubmit = () => {
//     const customer = state.customers.find((c) => c.id === customerId);
//     if (!customer || !guestName) return;

//     const expectedTime = time ? new Date(time).getTime() : Date.now();

//     const newGuest: GuestRequest = {
//       id: nanoid(),
//       customerId,
//       customerName: customer.name,
//       cabinNumber: customer.cabinNumber,
//       guestName,
//       expectedTime,
//       status: "pending",
//       requestedAt: Date.now(),
//       addedBy: "office-boy",
//     };
//     if(expectedTime>=Date.now()){
//     dispatch({ type: "ADD_GUEST", payload: newGuest });
//     onClose();
//   }
//     else alert("Time cannot be in past")
    
//   };

//   return (
//     <Modal title="Manual Guest Entry" onClose={onClose}>
//       <form className="space-y-4">
//         <div>
//           <label className="block mb-1 font-medium">Customer</label>
//           <select
//             required
//             className="w-full border rounded p-2"
//             value={customerId}
//             onChange={(e) => setCustomerId(e.target.value)}
//           >
//             {state.customers.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {`Cabin ${c.cabinNumber} (${c.name})`}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Guest Name</label>
//           <input
//           required
//             type="text"
//             className="w-full border rounded p-2"
//             value={guestName}
//             onChange={(e) => setGuestName(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Time</label>
//           <input
//           required
//             type="datetime-local"
//             className="w-full border rounded p-2"
//             value={time}
//             onChange={(e) => setTime(e.target.value)}
//           />
//         </div>

//         <div className="flex justify-end gap-2">
//           <Button variant="ghost" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit}>Submit</Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };
