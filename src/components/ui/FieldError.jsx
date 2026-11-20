import { AlertCircle } from "lucide-react";

/** Inline error message shown under a form input. */
const FieldError = ({ id, message }) =>
  message ? (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
      <AlertCircle size={13} className="shrink-0" />
      {message}
    </p>
  ) : null;

export default FieldError;
