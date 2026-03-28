import { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import FormField from "@/components/shared/FormField";
import Modal from "@/components/shared/Modal";
import { generateId, getStatusColor } from "@/utils/helpers";
import { Plus, Pencil, Trash2, Eye, ArrowLeft } from "lucide-react";

const inputClass = "w-full px-3 py-2.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const initialApplicants = [
  { id: "1", name: "John Doe", email: "john@mail.com", phone: "9876543210", dob: "2000-05-12", program: "B.Tech CS", category: "GM", entryType: "Regular", quotaType: "KCET", marks: "85", allotmentNumber: "KC12345", docStatus: "Verified", status: "New" },
  { id: "2", name: "Jane Smith", email: "jane@mail.com", phone: "9876543211", dob: "2001-03-20", program: "B.Tech Mech", category: "SC", entryType: "Lateral", quotaType: "Management", marks: "72", allotmentNumber: "", docStatus: "Pending", status: "Allocated" },
  { id: "3", name: "Mike Wilson", email: "mike@mail.com", phone: "9876543212", dob: "2000-11-05", program: "B.Tech CS", category: "ST", entryType: "Regular", quotaType: "COMEDK", marks: "90", allotmentNumber: "CD67890", docStatus: "Submitted", status: "Confirmed" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "program", label: "Program" },
  { key: "quotaType", label: "Quota" },
  { key: "marks", label: "Marks" },
  { key: "docStatus", label: "Doc Status", render: (val) => <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span> },
  { key: "status", label: "Status", render: (val) => <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span> },
];

const Applicants = () => {
  const [data, setData] = useState(initialApplicants);
  const [view, setView] = useState("table");
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const watchQuota = watch("quotaType");
  const showAllotment = watchQuota === "KCET" || watchQuota === "COMEDK";

  const openAdd = () => { setEditing(null); reset({ status: "New", docStatus: "Pending" }); setView("form"); };
  const openEdit = (item) => { setEditing(item); reset(item); setView("form"); };
  const openView = (item) => { setViewing(item); setView("detail"); };
  const backToTable = () => { setView("table"); setEditing(null); setViewing(null); };

  const onSubmit = (formData) => {
    if (editing) {
      setData(data.map((d) => (d.id === editing.id ? { ...d, ...formData } : d)));
    } else {
      setData([...data, { id: generateId(), ...formData, status: "New" }]);
    }
    backToTable();
  };

  return (
    <DashboardLayout title="Applicants">
      {view === "detail" && viewing ? (
        <>
          <button onClick={backToTable} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
            <ArrowLeft size={16} /> Back to list
          </button>
          <div className="bg-card border rounded-xl p-6 max-w-2xl card-shadow">
            <h3 className="text-lg font-semibold mb-5">Applicant Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              {[
                ["Full Name", viewing.name],
                ["Email", viewing.email],
                ["Phone", viewing.phone],
                ["Date of Birth", viewing.dob],
                ["Program", viewing.program],
                ["Category", viewing.category],
                ["Entry Type", viewing.entryType],
                ["Quota Type", viewing.quotaType],
                ["Marks", viewing.marks],
                ["Allotment Number", viewing.allotmentNumber || "—"],
                ["Document Status", viewing.docStatus],
                ["Status", viewing.status],
              ].map(([label, val]) => (
                <div key={label} className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">{label}</p>
                  <p className="font-medium">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : view === "form" ? (
        <>
          <button onClick={backToTable} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
            <ArrowLeft size={16} /> Back to list
          </button>
          <div className="bg-card border rounded-xl p-6 max-w-3xl card-shadow">
            <h3 className="text-lg font-semibold mb-6">{editing ? "Edit Applicant" : "Create Applicant"}</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Personal */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b">Personal Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  <FormField label="Full Name" error={errors.name?.message}>
                    <input className={inputClass} placeholder="Enter full name" {...register("name", { required: "Name is required" })} />
                  </FormField>
                  <FormField label="Email" error={errors.email?.message}>
                    <input type="email" className={inputClass} placeholder="email@example.com" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} />
                  </FormField>
                  <FormField label="Phone Number" error={errors.phone?.message}>
                    <input className={inputClass} placeholder="Enter phone number" {...register("phone", { required: "Phone is required" })} />
                  </FormField>
                  <FormField label="Date of Birth" error={errors.dob?.message}>
                    <input type="date" className={inputClass} {...register("dob", { required: "DOB is required" })} />
                  </FormField>
                </div>
              </div>

              {/* Academic */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b">Academic Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  <FormField label="Program" error={errors.program?.message}>
                    <select className={inputClass} {...register("program", { required: "Program is required" })}>
                      <option value="">Select Program</option>
                      <option value="B.Tech CS">B.Tech CS</option>
                      <option value="B.Tech Mech">B.Tech Mech</option>
                    </select>
                  </FormField>
                  <FormField label="Category" error={errors.category?.message}>
                    <select className={inputClass} {...register("category", { required: "Category is required" })}>
                      <option value="">Select Category</option>
                      <option value="GM">GM</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                  </FormField>
                  <FormField label="Entry Type" error={errors.entryType?.message}>
                    <select className={inputClass} {...register("entryType", { required: "Required" })}>
                      <option value="">Select Entry Type</option>
                      <option value="Regular">Regular</option>
                      <option value="Lateral">Lateral</option>
                    </select>
                  </FormField>
                  <FormField label="Quota Type" error={errors.quotaType?.message}>
                    <select className={inputClass} {...register("quotaType", { required: "Required" })}>
                      <option value="">Select Quota</option>
                      <option value="KCET">KCET</option>
                      <option value="COMEDK">COMEDK</option>
                      <option value="Management">Management</option>
                    </select>
                  </FormField>
                  <FormField label="Marks / Percentage" error={errors.marks?.message}>
                    <input type="number" step="0.01" className={inputClass} placeholder="Enter marks" {...register("marks", { required: "Marks required", min: { value: 0, message: "Min 0" }, max: { value: 100, message: "Max 100" } })} />
                  </FormField>
                  {showAllotment && (
                    <FormField label="Allotment Number" error={errors.allotmentNumber?.message}>
                      <input className={inputClass} placeholder="Enter allotment number" {...register("allotmentNumber")} />
                    </FormField>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div className="mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b">Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  <FormField label="Document Upload (optional)">
                    <input type="file" className={inputClass} {...register("document")} />
                  </FormField>
                  <FormField label="Document Status">
                    <select className={inputClass} {...register("docStatus")}>
                      <option value="Pending">Pending</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Verified">Verified</option>
                    </select>
                  </FormField>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t">
                <button type="button" onClick={() => reset()} className="px-4 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">Reset</button>
                <button type="button" onClick={backToTable} className="px-4 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
                  {editing ? "Update" : "Create Applicant"}
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Manage Applicants</h2>
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
              <Plus size={16} /> Add Applicant
            </button>
          </div>
          <DataTable
            columns={columns}
            data={data}
            searchKeys={["name", "program", "quotaType", "status"]}
            actions={(row) => (
              <div className="flex gap-0.5">
                <button onClick={() => openView(row)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="View"><Eye size={15} /></button>
                <button onClick={() => openEdit(row)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit"><Pencil size={15} /></button>
                <button onClick={() => setDeleteId(row.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete"><Trash2 size={15} /></button>
              </div>
            )}
          />
        </>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete">
        <p className="text-sm text-muted-foreground mb-5">Are you sure you want to delete this applicant?</p>
        <div className="flex justify-end gap-2.5">
          <button onClick={() => setDeleteId(null)} className="px-4 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">Cancel</button>
          <button onClick={() => { setData(data.filter((d) => d.id !== deleteId)); setDeleteId(null); }} className="px-4 py-2.5 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity">Delete</button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Applicants;
