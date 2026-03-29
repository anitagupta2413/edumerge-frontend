import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { institutionSchema } from "@/lib/validations";
import DashboardLayout from "@/layouts/DashboardLayout";
import FormField from "@/components/shared/FormField";
import { Pencil } from "lucide-react";
import api from "@/lib/api";

import { useAuth } from "@/contexts/AuthContext";

const inputClass = "w-full px-3 py-2.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const Institution = () => {
  const { canWrite } = useAuth();
  const [saved, setSaved] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const hasWriteAccess = canWrite("institutions");

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(institutionSchema),
  });

  useEffect(() => {
    api.get("/institutions").then((res) => {
      if (res.data.success && res.data.data.length > 0) {
        const inst = res.data.data[0];
        // Convert strings back to arrays for the checkboxes
        inst.courseType = inst.courseType ? (typeof inst.courseType === 'string' ? inst.courseType.split(", ") : inst.courseType) : [];
        setSaved(inst);
      }
    }).finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        courseType: Array.isArray(data.courseType) ? data.courseType.join(", ") : data.courseType,
      };

      let response;
      if (saved && saved.id) {
        response = await api.put(`/institutions/${saved.id}`, payload);
      } else {
        response = await api.post("/institutions", payload);
      }
      
      const updatedData = response.data.data;
      // Convert strings back to arrays for checkboxes if needed
      if (updatedData.courseType && typeof updatedData.courseType === 'string') {
        updatedData.courseType = updatedData.courseType.split(", ");
      }
      
      setSaved(updatedData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save institution");
    }
  };

  const startEdit = () => {
    reset(saved);
    setIsEditing(true);
  };

  if (loading) return <DashboardLayout title="Institution"><div className="p-5">Loading...</div></DashboardLayout>;

  const showForm = !saved || (isEditing && hasWriteAccess);

  return (
    <DashboardLayout title="Institution Configuration">
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
            {hasWriteAccess && (
              <button onClick={startEdit} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
                <Pencil size={14} /> Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            {[
              ["Institution Name", saved.name],
              ["Institution Code", saved.code],
              ["Academic Year", saved.academicYear || "—"],
              ["Course Type", Array.isArray(saved.courseType) ? saved.courseType.join(", ") : saved.courseType || "—"],
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
