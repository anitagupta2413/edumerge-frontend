import { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "@/layouts/DashboardLayout";
import FormField from "@/components/shared/FormField";
import { Pencil } from "lucide-react";

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
      <h2 className="text-base font-semibold mb-4">Institution Configuration</h2>

      {showForm ? (
        <div className="bg-card border rounded-lg p-6 max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <FormField label="Institution Name" error={errors.name?.message}>
                <input
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter institution name"
                  {...register("name", { required: "Institution name is required" })}
                />
              </FormField>

              <FormField label="Institution Code" error={errors.code?.message}>
                <input
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted disabled:cursor-not-allowed"
                  placeholder="Enter code"
                  disabled={!!saved}
                  {...register("code", { required: "Code is required" })}
                />
              </FormField>

              <FormField label="Academic Year" error={errors.academicYear?.message}>
                <input
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. 2025-26"
                  {...register("academicYear", { required: "Academic year is required" })}
                />
              </FormField>

              <FormField label="Course Type">
                <div className="flex gap-4 py-2">
                  {["UG", "PG"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 text-sm">
                      <input type="checkbox" value={opt} {...register("courseType")} />
                      {opt}
                    </label>
                  ))}
                </div>
              </FormField>

              <FormField label="Admission Mode">
                <div className="flex gap-4 py-2">
                  {["Government", "Management"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 text-sm">
                      <input type="checkbox" value={opt} {...register("admissionMode")} />
                      {opt}
                    </label>
                  ))}
                </div>
              </FormField>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              {saved && (
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm border rounded-md hover:bg-muted">
                  Cancel
                </button>
              )}
              <button type="submit" className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90">
                {saved ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-6 max-w-2xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold">Institution Details</h3>
            <button onClick={startEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md hover:bg-muted">
              <Pencil size={14} /> Edit
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Institution Name</p>
              <p className="font-medium mt-0.5">{saved.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Institution Code</p>
              <p className="font-medium mt-0.5">{saved.code}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Academic Year</p>
              <p className="font-medium mt-0.5">{saved.academicYear || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Course Type</p>
              <p className="font-medium mt-0.5">{Array.isArray(saved.courseType) ? saved.courseType.join(", ") : saved.courseType || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Admission Mode</p>
              <p className="font-medium mt-0.5">{Array.isArray(saved.admissionMode) ? saved.admissionMode.join(", ") : saved.admissionMode || "—"}</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Institution;
