// Small, dependency-free form validation.
// A schema maps each field name to a list of rules; a rule returns an error
// message, or "" when the value is fine. The first failing rule wins.

const str = (v) => String(v ?? "").trim();

export const required = (msg = "This field is required") => (v) => (str(v) ? "" : msg);

export const minLength = (n, msg) => (v) =>
  !str(v) || str(v).length >= n ? "" : msg || `Must be at least ${n} characters`;

export const maxLength = (n, msg) => (v) =>
  str(v).length <= n ? "" : msg || `Must be at most ${n} characters`;

export const pattern = (regex, msg) => (v) => (!str(v) || regex.test(str(v)) ? "" : msg);

export const email = (msg = "Enter a valid email address") =>
  pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, msg);

// Indian mobile: 10 digits starting 6–9, optional +91 / 0 prefix, spaces or dashes allowed.
export const phone = (msg = "Enter a valid 10-digit mobile number") => (v) => {
  if (!str(v)) return "";
  const digits = str(v).replace(/[\s-]/g, "").replace(/^(\+91|0)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? "" : msg;
};

export const pincode = (msg = "Enter a valid 6-digit PIN code") => pattern(/^[1-9]\d{5}$/, msg);

export const validateField = (rules = [], value, values) => {
  for (const rule of rules) {
    const error = rule(value, values);
    if (error) return error;
  }
  return "";
};

export const validateForm = (schema, values) =>
  Object.fromEntries(
    Object.entries(schema)
      .map(([name, rules]) => [name, validateField(rules, values[name], values)])
      .filter(([, error]) => error)
  );
