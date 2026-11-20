import { Check, PackageCheck, Truck } from "lucide-react";

const STEPS = [
  { status: "PLACED", label: "Placed", Icon: Check },
  { status: "CONFIRMED", label: "Confirmed", Icon: Check },
  { status: "SHIPPED", label: "Shipped", Icon: Truck },
  { status: "DELIVERED", label: "Delivered", Icon: PackageCheck },
];

function formatDate(date) {
  if (!date) return null;

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function OrderTimeline({ order }) {
  if (order.orderStatus === "CANCELLED" || order.orderStatus === "RETURNED") {
    const event = order.statusHistory?.find(
      (item) => item.status === order.orderStatus
    );

    return (
      <div className="border-t border-neutral-100 px-5 py-4">
        <p className="font-semibold text-neutral-800">
          Order {order.orderStatus.toLowerCase()}
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          {formatDate(event?.changedAt) || "Date unavailable"}
        </p>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex(
    (step) => step.status === order.orderStatus
  );
  const safeCurrentIndex = Math.max(currentIndex, 0);

  const eventDates = new Map(
    (order.statusHistory || []).map((event) => [
      event.status,
      event.changedAt,
    ])
  );

  if (!eventDates.has("PLACED") && order.createdAt) {
    eventDates.set("PLACED", order.createdAt);
  }

  const progressWidth = `${(safeCurrentIndex / (STEPS.length - 1)) * 100}%`;

  return (
    <div
      className="border-t border-neutral-100 px-5 py-5"
      aria-label="Order tracking"
    >
      <div className="relative">
        {/* Connector line behind the status icons */}
        <div className="absolute left-[12.5%] right-[12.5%] top-5 h-0.5 bg-neutral-200">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: progressWidth }}
          />
        </div>

        <ol className="relative grid grid-cols-4">
          {STEPS.map(({ status, label, Icon }, index) => {
            const complete = index < safeCurrentIndex;
            const current = index === safeCurrentIndex;
            const date = eventDates.get(status);

            let dateLabel = formatDate(date);
            if (!dateLabel) {
              dateLabel =
                index < safeCurrentIndex
                  ? "Date unavailable"
                  : current
                    ? "In progress"
                    : "Waiting";
            }

            return (
              <li key={status} className="min-w-0 text-center">
                <span
                  className={`relative mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full border-2 ${
                    complete
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : current
                        ? "border-blue-600 bg-blue-600 text-white ring-4 ring-blue-100"
                        : "border-neutral-300 bg-white text-neutral-400"
                  }`}
                  aria-current={current ? "step" : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                </span>

                <span
                  className={`block text-xs font-semibold sm:text-sm ${
                    current ? "text-blue-700" : "text-neutral-800"
                  }`}
                >
                  {label}
                </span>

                <time className="mt-1 block text-[11px] leading-4 text-neutral-500 sm:text-xs">
                  {dateLabel}
                </time>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}