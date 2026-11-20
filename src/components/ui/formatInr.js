export const formatInr = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;
