import { Button } from "@/components/ui/button";
import { useApp } from "@/store/AppContext";
import type { Order, GuestRequest } from "@/store/types";

interface Props {
  request: Order | GuestRequest;
}

export const PendingRequestCard = ({ request }: Props) => {
  const { dispatch } = useApp();

  const markComplete = () => {
    if ("type" in request) {
      dispatch({
        type: "MARK_ORDER_COMPLETE",
        payload: { id: request.id, completedAt: Date.now() },
      });
    } else {
      dispatch({
        type: "MARK_GUEST_COMPLETE",
        payload: { id: request.id, completedAt: Date.now() },
      });
    }
  };

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded shadow-sm">
      <div>
        {"type" in request
          ? `${request.type.toUpperCase()} - Cabin ${request.cabinNumber} (${
              request.customerName
            }) requested at (${new Date(
              request.requestedAt
            ).toLocaleTimeString()})`
          : `GUEST - Cabin ${request.cabinNumber} (${request.customerName})`}
      </div>
      <Button size="sm" onClick={markComplete}>
        ✓ Mark Complete
      </Button>
    </div>
  );
};
