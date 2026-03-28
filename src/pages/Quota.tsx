import { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import FormField from "@/components/shared/FormField";
import Modal from "@/components/shared/Modal";
import { generateId } from "@/utils/helpers";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";

const inputClass = "w-full px-3 py-2.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";
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
          <button onClick={backToTable} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
            <ArrowLeft size={16} /> Back to list
          </button>
          <div className="bg-card border rounded-xl p-6 max-w-2xl card-shadow">
            <h3 className="text-lg font-semibold mb-5">{editing ? "Edit Quota" : "Add Quota"}</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                <FormField label="Program" error={errors.program?.message}>
                  <select className={inputClass} {...register("program", { required: "Program is required" })}>
                    <option value="">Select Program</option>
                    <option value="B.Tech CS">B.Tech CS</option>
                    <option value="B.Tech Mech">B.Tech Mech</option>
                  </select>
                </FormField>
                <FormField label="Total Intake" error={errors.totalIntake?.message}>
                  <input type="number" className={inputClass} placeholder="Enter total intake" {...register("totalIntake", { required: "Required", min: { value: 1, message: "Must be > 0" } })} />
                </FormField>
              </div>

              <div className="mt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 pb-2 border-b">Quota Distribution</h4>
                <div className="border rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/60 border-b">
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Quota</th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Seats</th>
                      </tr>
                    </thead>
                    <tbody>
                      {QUOTA_TYPES.map((qt) => {
                        const key = qt.toLowerCase();
                        return (
                          <tr key={qt} className="border-b last:border-0">
                            <td className="px-4 py-3 font-medium">{qt}</td>
                            <td className="px-4 py-3">
                              <input type="number" className="w-24 px-2.5 py-1.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" {...register(key, { required: "Required", min: 0 })} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className={`text-sm font-medium mb-5 px-3 py-2 rounded-lg ${isMismatch ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground"}`}>
                  Allocated: {allocated} / {watchIntake || 0}
                  {isMismatch && <span className="ml-2 text-xs">(Must equal total intake)</span>}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t">
                <button type="button" onClick={backToTable} className="px-4 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={isMismatch} className="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
                  {editing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Manage Quotas</h2>
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
              <Plus size={16} /> Add New
            </button>
          </div>
          <DataTable
            columns={columns}
            data={data}
            searchKeys={["program"]}
            actions={(row) => (
              <div className="flex gap-0.5">
                <button onClick={() => openEdit(row)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Pencil size={15} /></button>
                <button onClick={() => setDeleteId(row.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={15} /></button>
              </div>
            )}
          />
        </>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete">
        <p className="text-sm text-muted-foreground mb-5">Are you sure you want to delete this quota entry?</p>
        <div className="flex justify-end gap-2.5">
          <button onClick={() => setDeleteId(null)} className="px-4 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">Cancel</button>
          <button onClick={() => { setData(data.filter((d) => d.id !== deleteId)); setDeleteId(null); }} className="px-4 py-2.5 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity">Delete</button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Quota;
