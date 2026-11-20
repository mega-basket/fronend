import { MapPin, Plus, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import FieldError from "../../../components/ui/FieldError";

const inputCls =
  "border border-neutral-200 rounded-lg px-3 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900";
const errInputCls =
  "border border-rose-400 rounded-lg px-3 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500";

const ADDRESS_FIELDS = [
  { name: "fullName", placeholder: "Full name *", autoComplete: "name" },
  { name: "phone", placeholder: "Phone *", autoComplete: "tel", type: "tel", inputMode: "tel" },
  { name: "street", placeholder: "Street / house / area *", autoComplete: "street-address", wide: true },
  { name: "city", placeholder: "City *", autoComplete: "address-level2" },
  { name: "state", placeholder: "State *", autoComplete: "address-level1" },
  { name: "postalCode", placeholder: "PIN code *", autoComplete: "postal-code", inputMode: "numeric", maxLength: 6 },
  { name: "country", placeholder: "Country", autoComplete: "country-name" },
];

const AddressSection = ({
  addresses,
  selectedAddressId,
  onSelect,
  showForm,
  onToggleForm,
  form,
  errors = {},
  onFieldBlur,
  onFormChange,
  onSaveAddress,
  onDeleteAddress,
  saving,
}) => (
  <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-card">
    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-900">
      <MapPin size={20} className="text-brand-600" />
      1. Delivery Address
    </h2>

    {addresses.length === 0 && !showForm && (
      <p className="mb-3 text-neutral-500">No saved addresses — add one to continue.</p>
    )}

    <div className="flex flex-col gap-3">
      {addresses.map((addr) => (
        <label
          key={addr._id}
          className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition ${
            selectedAddressId === addr._id
              ? "border-neutral-900 ring-2 ring-neutral-100 bg-neutral-50"
              : "border-neutral-200 hover:border-neutral-400"
          }`}
        >
          <input
            type="radio"
            name="address"
            className="mt-1.5 accent-neutral-900"
            checked={selectedAddressId === addr._id}
            onChange={() => onSelect(addr._id)}
          />
          <div className="flex-1">
            <p className="font-semibold text-neutral-900">
              {addr.fullName}
              {addr.isDefault && (
                <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                  Default
                </span>
              )}
              {addr.addressType && (
                <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                  {addr.addressType}
                </span>
              )}
            </p>
            <p className="mt-0.5 text-sm text-neutral-600">
              {addr.street}, {addr.city}, {addr.state} — {addr.postalCode}, {addr.country}
            </p>
            <p className="text-sm text-neutral-600">Phone: {addr.phone}</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onDeleteAddress(addr._id);
            }}
            className="p-1.5 text-neutral-400 transition hover:text-rose-500"
            title="Delete address"
          >
            <Trash2 size={16} />
          </button>
        </label>
      ))}
    </div>

    {showForm ? (
      <form onSubmit={onSaveAddress} noValidate className="mt-4 grid grid-cols-1 gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-2">
        {ADDRESS_FIELDS.map((f) => (
          <div key={f.name} className={f.wide ? "sm:col-span-2" : ""}>
            <input
              className={errors[f.name] ? errInputCls : inputCls}
              name={f.name}
              type={f.type || "text"}
              placeholder={f.placeholder}
              aria-label={f.placeholder.replace(" *", "")}
              autoComplete={f.autoComplete}
              inputMode={f.inputMode}
              maxLength={f.maxLength}
              value={form[f.name]}
              onChange={onFormChange}
              onBlur={() => onFieldBlur?.(f.name)}
              aria-invalid={!!errors[f.name]}
              aria-describedby={errors[f.name] ? `address-${f.name}-error` : undefined}
            />
            <FieldError id={`address-${f.name}-error`} message={errors[f.name]} />
          </div>
        ))}
        <select className={`${inputCls} self-start`} name="addressType" aria-label="Address type" value={form.addressType} onChange={onFormChange}>
          <option value="HOME">Home</option>
          <option value="WORK">Work</option>
          <option value="OTHER">Other</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={onFormChange} className="accent-neutral-900" />
          Set as default address
        </label>
        <div className="flex gap-3 sm:col-span-2">
          <Button type="submit" loading={saving}>
            Save Address
          </Button>
          <Button type="button" variant="outline" onClick={() => onToggleForm(false)}>
            Cancel
          </Button>
        </div>
      </form>
    ) : (
      <button
        onClick={() => onToggleForm(true)}
        className="mt-4 flex items-center gap-2 font-semibold text-brand-600 hover:text-brand-700"
      >
        <Plus size={18} /> Add new address
      </button>
    )}
  </section>
);

export default AddressSection;
