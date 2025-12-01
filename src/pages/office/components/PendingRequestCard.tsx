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
    <div className="bg-white p-4 rounded shadow-sm
      flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

      <div className="text-sm leading-5">
        {"type" in request ? (
          <>
            ☕ <span className="font-semibold">{request.type.toUpperCase()}</span> 
            {" — "}Cabin {request.cabinNumber} ({request.customerName}){" "}
            {new Date(request.requestedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </>
        ) : (
          <div>
            👤 GUEST — Cabin {request.cabinNumber} ({request.customerName})
            <div className="mt-1">
              Guest: {request.guestName} @{" "}
              {new Date(request.expectedTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        )}
      </div>

      <Button
        size="sm"
        onClick={markComplete}
        className="w-full sm:w-auto"
      >
        ✓ Mark Complete
      </Button>
    </div>
  );
};
