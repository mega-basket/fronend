import { useCallback, useState } from "react";
import { validateField, validateForm } from "../utils/validation";

/**
 * Tracks per-field errors for a form.
 *  - validateAll(values) on submit: shows every error, returns true if valid
 *  - onBlur(name, values): checks a field once the user leaves it
 *  - revalidate(name, values): re-checks while typing, but only for fields
 *    that already show an error (so we don't nag before they've finished)
 */
const useFormValidation = (schema) => {
  const [errors, setErrors] = useState({});

  const setFieldError = (name, error) =>
    setErrors((prev) => {
      if ((prev[name] || "") === error) return prev;
      const next = { ...prev };
      if (error) next[name] = error;
      else delete next[name];
      return next;
    });

  const validateAll = useCallback(
    (values) => {
      const next = validateForm(schema, values);
      setErrors(next);
      return Object.keys(next).length === 0;
    },
    [schema]
  );

  const onBlur = (name, values) => {
    if (schema[name]) setFieldError(name, validateField(schema[name], values[name], values));
  };

  const revalidate = (name, values) => {
    if (errors[name] && schema[name]) setFieldError(name, validateField(schema[name], values[name], values));
  };

  const reset = () => setErrors({});

  return { errors, validateAll, onBlur, revalidate, reset };
};

export default useFormValidation;
