import { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "@/layouts/DashboardLayout";
import FormField from "@/components/shared/FormField";
import { Pencil } from "lucide-react";

const inputClass = "w-full px-3 py-2.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const Institution = () => {
  const [saved, setSaved] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: saved || {},
  });

  const onSubmit = (data) => {
    setSaved(data);
    setIsEditing(false);
  };

  const startEdit = () => {
    reset(saved);
    setIsEditing(true);
  };

  const showForm = !saved || isEditing;

  return (
    <DashboardLayout title="Institution">
      <h2 className="text-lg font-semibold mb-5">Institution Configuration</h2>

      {showForm ? (
        <div className="bg-card border rounded-xl p-6 max-w-2xl card-shadow">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
              <FormField label="Institution Name" error={errors.name?.message}>
                <input className={inputClass} placeholder="Enter institution name" {...register("name", { required: "Institution name is required" })} />
              </FormField>
              <FormField label="Institution Code" error={errors.code?.message}>
                <input className={`${inputClass} disabled:bg-muted disabled:cursor-not-allowed`} placeholder="Enter code" disabled={!!saved} {...register("code", { required: "Code is required" })} />
              </FormField>
              <FormField label="Academic Year" error={errors.academicYear?.message}>
                <input className={inputClass} placeholder="e.g. 2025-26" {...register("academicYear", { required: "Academic year is required" })} />
              </FormField>
              <FormField label="Course Type">
                <div className="flex gap-5 py-2">
                  {["UG", "PG"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" value={opt} className="rounded border-border" {...register("courseType")} />
                      {opt}
                    </label>
                  ))}
                </div>
              </FormField>
              <FormField label="Admission Mode">
                <div className="flex gap-5 py-2">
                  {["Government", "Management"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" value={opt} className="rounded border-border" {...register("admissionMode")} />
                      {opt}
                    </label>
                  ))}
                </div>
              </FormField>
            </div>

            <div className="flex justify-end gap-2.5 mt-2 pt-4 border-t">
              {saved && (
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                  Cancel
                </button>
              )}
              <button type="submit" className="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
                {saved ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-card border rounded-xl p-6 max-w-2xl card-shadow">
          <div className="flex justify-between items-start mb-5">
            <h3 className="text-sm font-semibold">Institution Details</h3>
            <button onClick={startEdit} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
              <Pencil size={14} /> Edit
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            {[
              ["Institution Name", saved.name],
              ["Institution Code", saved.code],
              ["Academic Year", saved.academicYear || "—"],
              ["Course Type", Array.isArray(saved.courseType) ? saved.courseType.join(", ") : saved.courseType || "—"],
              ["Admission Mode", Array.isArray(saved.admissionMode) ? saved.admissionMode.join(", ") : saved.admissionMode || "—"],
            ].map(([label, val]) => (
              <div key={label} className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">{label}</p>
                <p className="font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Institution;
