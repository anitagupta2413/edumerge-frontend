import { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import FormField from "@/components/shared/FormField";
import Modal from "@/components/shared/Modal";
import { generateId } from "@/utils/helpers";
import { Plus, Pencil, Trash2 } from "lucide-react";

const QUOTA_TYPES = ["KCET", "COMEDK", "Management"];

const initialData = [
  { id: "1", program: "B.Tech CS", totalIntake: 120, kcet: 50, comedk: 40, management: 30 },
  { id: "2", program: "B.Tech Mech", totalIntake: 90, kcet: 40, comedk: 25, management: 25 },
];

const columns = [
  { key: "program", label: "Program" },
  { key: "totalIntake", label: "Total Intake" },
  { key: "kcet", label: "KCET" },
  { key: "comedk", label: "COMEDK" },
  { key: "management", label: "Management" },
  { key: "filled", label: "Filled", render: () => 0 },
  { key: "remaining", label: "Remaining", render: (_, row) => row.totalIntake },
];

const Quota = () => {
  const [data, setData] = useState(initialData);
  const [view, setView] = useState("table");
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  const openAdd = () => { setEditing(null); reset({ program: "", totalIntake: "", kcet: "", comedk: "", management: "" }); setView("form"); };
  const openEdit = (item) => { setEditing(item); reset(item); setView("form"); };
  const backToTable = () => { setView("table"); setEditing(null); };

  const watchIntake = Number(watch("totalIntake") || 0);
  const watchKcet = Number(watch("kcet") || 0);
  const watchComedk = Number(watch("comedk") || 0);
  const watchMgmt = Number(watch("management") || 0);
  const allocated = watchKcet + watchComedk + watchMgmt;
  const isMismatch = watchIntake > 0 && allocated !== watchIntake;

  const onSubmit = (formData) => {
    const parsed = {
      ...formData,
      totalIntake: Number(formData.totalIntake),
      kcet: Number(formData.kcet),
      comedk: Number(formData.comedk),
      management: Number(formData.management),
    };
    if (editing) {
      setData(data.map((d) => (d.id === editing.id ? { ...d, ...parsed } : d)));
    } else {
      setData([...data, { id: generateId(), ...parsed }]);
    }
    backToTable();
  };

  return (
    <DashboardLayout title="Seat Matrix / Quota">
      {view === "form" ? (
        <>
          <h2 className="text-base font-semibold mb-4">{editing ? "Edit Quota" : "Add Quota"}</h2>
          <div className="bg-card border rounded-lg p-6 max-w-2xl">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <FormField label="Program" error={errors.program?.message}>
                  <select className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" {...register("program", { required: "Program is required" })}>
                    <option value="">Select Program</option>
                    <option value="B.Tech CS">B.Tech CS</option>
                    <option value="B.Tech Mech">B.Tech Mech</option>
                  </select>
                </FormField>
                <FormField label="Total Intake" error={errors.totalIntake?.message}>
                  <input type="number" className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" {...register("totalIntake", { required: "Required", min: { value: 1, message: "Must be > 0" } })} />
                </FormField>
              </div>

              <h3 className="text-sm font-semibold mt-4 mb-2">Quota Distribution</h3>
              <div className="border rounded-md overflow-hidden mb-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">Quota</th>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">Seats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {QUOTA_TYPES.map((qt) => {
                      const key = qt.toLowerCase();
                      return (
                        <tr key={qt} className="border-b last:border-0">
                          <td className="px-4 py-2">{qt}</td>
                          <td className="px-4 py-2">
                            <input type="number" className="w-24 px-2 py-1 border rounded text-sm bg-background" {...register(key, { required: "Required", min: 0 })} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className={`text-sm font-medium mb-4 ${isMismatch ? "text-destructive" : "text-foreground"}`}>
                Allocated: {allocated} / {watchIntake || 0}
                {isMismatch && <span className="ml-2 text-xs">(Must equal total intake)</span>}
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={backToTable} className="px-4 py-2 text-sm border rounded-md hover:bg-muted">Cancel</button>
                <button type="submit" disabled={isMismatch} className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
                  {editing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Manage Quotas</h2>
            <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90">
              <Plus size={16} /> Add New
            </button>
          </div>
          <DataTable
            columns={columns}
            data={data}
            searchKeys={["program"]}
            actions={(row) => (
              <div className="flex gap-1">
                <button onClick={() => openEdit(row)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
              </div>
            )}
          />
        </>
      )}

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete">
        <p className="text-sm text-muted-foreground mb-4">Are you sure you want to delete this quota entry?</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm border rounded-md hover:bg-muted">Cancel</button>
          <button onClick={() => { setData(data.filter((d) => d.id !== deleteId)); setDeleteId(null); }} className="px-4 py-2 text-sm rounded-md bg-destructive text-destructive-foreground hover:opacity-90">Delete</button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Quota;
