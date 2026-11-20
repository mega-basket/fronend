import { useState } from "react";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock3,
  Info,
  RotateCcw,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import { formatInr } from "../../../components/ui/formatInr";
import {
  useRequestOrderCancellation,
  useRequestOrderReturn,
} from "../../../api/component/useOrder";

const REASONS = {
  cancel: [
    "Changed my mind",
    "Ordered by mistake",
    "Delivery is taking too long",
    "Other",
  ],
  return: [
    "Item arrived damaged",
    "Wrong item received",
    "Item does not match the description",
    "Changed my mind",
    "Other",
  ],
};

const REQUEST_NOTICE = {
  cancellation: {
    REQUESTED: {
      title: "Cancellation request received",
      detail: "We’re reviewing your request. You can follow the decision here.",
      tone: "amber",
      Icon: Clock3,
    },
    APPROVED: {
      title: "Cancellation request approved",
      detail: "The cancellation is awaiting final order processing.",
      tone: "blue",
      Icon: CheckCircle2,
    },
    REJECTED: {
      title: "Cancellation request declined",
      detail: "You can submit another request if the order is still eligible.",
      tone: "rose",
      Icon: XCircle,
    },
    COMPLETED: {
      title: "Order cancelled",
      detail: "This order has been cancelled.",
      tone: "rose",
      Icon: CheckCircle2,
    },
  },
  return: {
    REQUESTED: {
      title: "Return request received",
      detail: "We’re reviewing your request. Keep the item and packaging for now.",
      tone: "amber",
      Icon: Clock3,
    },
    APPROVED: {
      title: "Return request approved",
      detail: "Your order stays marked delivered until the return is completed.",
      tone: "blue",
      Icon: CheckCircle2,
    },
    REJECTED: {
      title: "Return request declined",
      detail: "You can submit another request if the return window is still open.",
      tone: "rose",
      Icon: XCircle,
    },
    RECEIVED: {
      title: "Returned item received",
      detail: "Your return is being processed.",
      tone: "blue",
      Icon: Info,
    },
    REFUNDED: {
      title: "Return completed",
      detail: "The refund has been processed.",
      tone: "green",
      Icon: CheckCircle2,
    },
    COMPLETED: {
      title: "Return completed",
      detail: "This order has been marked as returned.",
      tone: "green",
      Icon: CheckCircle2,
    },
  },
};

const NOTICE_TONE = {
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  blue: "border-blue-200 bg-blue-50 text-blue-900",
  rose: "border-rose-200 bg-rose-50 text-rose-900",
  green: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

export default function OrderActions({ order }) {
  const [dialogAction, setDialogAction] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitError, setSubmitError] = useState("");

  const cancelRequest = useRequestOrderCancellation();
  const returnRequest = useRequestOrderReturn();

  const mutation = dialogAction === "cancel" ? cancelRequest : returnRequest;

  const canCancel =
    ["PLACED", "CONFIRMED"].includes(order.orderStatus) &&
    [undefined, "NONE", "REJECTED"].includes(order.cancellationRequest?.status);

  const canReturn =
    order.orderStatus === "DELIVERED" &&
    [undefined, "NONE", "REJECTED"].includes(order.returnRequest?.status);

  const notices = [
    {
      kind: "cancellation",
      status:
        order.orderStatus === "CANCELLED"
          ? "COMPLETED"
          : order.cancellationRequest?.status,
    },
    {
      kind: "return",
      status:
        order.orderStatus === "RETURNED"
          ? "COMPLETED"
          : order.returnRequest?.status,
    },
  ]
    .map(({ kind, status }) => ({
      kind,
      ...REQUEST_NOTICE[kind][status],
    }))
    .filter(({ title }) => Boolean(title));

  const closeDialog = () => {
    setDialogAction(null);
    setSelectedReason("");
    setDetails("");
    setSubmitError("");
  };

  const openDialog = (action) => {
    setDialogAction(action);
    setSelectedReason("");
    setDetails("");
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reason = [selectedReason, details.trim()]
      .filter(Boolean)
      .join(": ")
      .slice(0, 500);

    if (!reason) {
      setSubmitError("Choose a reason to continue.");
      return;
    }

    try {
      await mutation.mutateAsync({ orderId: order._id, reason });

      toast.success(
        dialogAction === "cancel"
          ? "Cancellation request submitted"
          : "Return request submitted",
      );

      closeDialog();
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          "We couldn't submit your request. Please try again.",
      );
    }
  };

  const isCancel = dialogAction === "cancel";
  const orderLabel = order.orderNumber || order._id.slice(-8);
  const reasons = dialogAction ? REASONS[dialogAction] : [];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 bg-neutral-50/70 px-5 py-3">
        <div aria-live="polite" className="min-w-0 flex-1 space-y-2">
          {notices.map(({ kind, title, detail, tone, Icon }) => (
            <div
              key={`${kind}-${title}`}
              className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm ${NOTICE_TONE[tone]}`}
            >
              <Icon size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-0.5 text-xs opacity-80">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap gap-2">
          {canCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => openDialog("cancel")}
            >
              <Ban size={15} />
              Cancel order
            </Button>
          )}

          {canReturn && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => openDialog("return")}
            >
              <RotateCcw size={15} />
              Request return
            </Button>
          )}
        </div>
      </div>

      {dialogAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !mutation.isPending) {
              closeDialog();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`order-action-title-${order._id}`}
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <header className="flex items-start gap-4 border-b border-neutral-100 px-6 py-5">
              <div
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                  isCancel
                    ? "bg-rose-50 text-rose-600"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {isCancel ? (
                  <AlertTriangle size={21} />
                ) : (
                  <RotateCcw size={21} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  id={`order-action-title-${order._id}`}
                  className="text-lg font-bold text-neutral-900"
                >
                  {isCancel ? "Request order cancellation" : "Request a return"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Order #{orderLabel}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDialog}
                disabled={mutation.isPending}
                aria-label="Close dialog"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5 px-6 py-5">
                <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <span className="text-sm text-neutral-600">
                    {order.items?.length || 0}{" "}
                    {(order.items?.length || 0) === 1 ? "item" : "items"}
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {formatInr(order.totalAmount)}
                  </span>
                </div>

                <div>
                  <label
                    htmlFor={`request-reason-${order._id}`}
                    className="mb-2 block text-sm font-semibold text-neutral-800"
                  >
                    Why are you {isCancel ? "cancelling" : "returning"} this
                    order?
                  </label>

                  <select
                    id={`request-reason-${order._id}`}
                    required
                    value={selectedReason}
                    onChange={(event) => setSelectedReason(event.target.value)}
                    className="h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  >
                    <option value="" disabled>
                      Select a reason
                    </option>
                    {reasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={`request-details-${order._id}`}
                    className="mb-2 block text-sm font-semibold text-neutral-800"
                  >
                    Additional details{" "}
                    <span className="font-normal text-neutral-500">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id={`request-details-${order._id}`}
                    value={details}
                    onChange={(event) => setDetails(event.target.value)}
                    maxLength={400}
                    rows={3}
                    placeholder="Share anything else that would help us review your request"
                    className="w-full resize-y rounded-xl border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  />
                  <p className="mt-1 text-right text-xs text-neutral-400">
                    {details.length}/400
                  </p>
                </div>

                <div className="flex gap-3 rounded-xl bg-neutral-50 p-3.5 text-sm leading-5 text-neutral-600">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-neutral-500"
                  />
                  <p>
                    {isCancel
                      ? "Your request will be reviewed before the order is cancelled. Any applicable refund will be handled after approval."
                      : "We’ll review your request and share the next steps. Please keep the item and packaging until then."}
                  </p>
                </div>

                {submitError && (
                  <p role="alert" className="text-sm font-medium text-rose-700">
                    {submitError}
                  </p>
                )}
              </div>

              <footer className="flex flex-col-reverse gap-2 border-t border-neutral-100 bg-neutral-50/70 px-6 py-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                  disabled={mutation.isPending}
                >
                  Keep order
                </Button>
                <Button
                  type="submit"
                  variant={isCancel ? "danger" : "brand"}
                  loading={mutation.isPending}
                >
                  {isCancel
                    ? "Submit cancellation request"
                    : "Submit return request"}
                </Button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
