import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/store/AppContext";

export function GuestModal() {
  const { state, dispatch } = useApp();
  const [guestName, setGuestName] = useState("");
  const [expectedTime, setExpectedTime] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!state.currentUser) return;

    dispatch({
      type: "ADD_GUEST",
      payload: {
        id: crypto.randomUUID(),
        customerId: state.currentUser.id,
        customerName: state.currentUser.name,
        cabinNumber: state.currentUser.cabinNumber,
        guestName,
        expectedTime: new Date(`2000-01-01 ${expectedTime}`).getTime(),
        status: "pending",
        requestedAt: Date.now(),
        addedBy: "customer",
      },
    });

    setGuestName("");
    setExpectedTime("");

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-32 w-full text-2xl bg-blue-200 hover:bg-blue-300 text-blue-900"
          onClick={() => setOpen(true)}
        >
          👤
          <span className="text-lg mt-2 font-semibold">GUEST COMING</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>👤 Guest Information</DialogTitle>
          <DialogDescription>
            Enter guest name & expected arrival time.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4 mt-2"
        >
          <div className="space-y-2">
            <Label>Guest Name</Label>
            <Input
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter guest name"
            />
          </div>

          <div className="space-y-2">
            <Label>Expected Time</Label>
            <Input
              required
              type="time"
              value={expectedTime}
              onChange={(e) => setExpectedTime(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
