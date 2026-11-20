import { User, Mail, Phone } from "lucide-react";
import Button from "../../../components/ui/Button";

const PersonalInfoCard = ({ isEditing, form, onFormChange, onSave, saving, data }) => (
  <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
    <h3 className="mb-4 text-base font-semibold text-neutral-900">Personal Information</h3>

    {isEditing ? (
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-neutral-500">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Phone</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => onFormChange({ ...form, phone: e.target.value })}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        <Button fullWidth onClick={onSave} loading={saving}>
          Save Changes
        </Button>
      </div>
    ) : (
      <div className="space-y-3">
        <InfoRow icon={<User className="h-4 w-4" />} label="Name" value={data?.name || "—"} />
        <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={data?.email || "—"} />
        <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={data?.phone || "N/A"} />
      </div>
    )}
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
      {icon}
    </div>
    <div>
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-sm font-medium text-neutral-900">{value}</div>
    </div>
  </div>
);

export default PersonalInfoCard;
