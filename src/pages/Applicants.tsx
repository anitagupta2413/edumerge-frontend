import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicantSchema } from "@/lib/validations";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import FormField from "@/components/shared/FormField";
import Modal from "@/components/shared/Modal";
import { getStatusColor } from "@/utils/helpers";
import { Plus, Pencil, Trash2, Eye, ArrowLeft } from "lucide-react";
import api from "@/lib/api";

import { useAuth } from "@/contexts/AuthContext";

const inputClass = "w-full px-3 py-2.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const columns = [
  { key: "name", label: "Name" },
  { key: "docStatus", label: "Doc Status", render: (val) => <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span> },
  { key: "programName", label: "Program" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "quotaName", label: "Quota" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status", render: (val) => <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span> },
];

const Applicants = () => {
  const { canWrite, isAdmin } = useAuth();
  const [data, setData] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [quotas, setQuotas] = useState([]);
  const [view, setView] = useState("table");
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const hasWriteAccess = canWrite("applicants");

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(applicantSchema),
  });

  const fetchFormOptions = async () => {
    if (programs.length > 0 && quotas.length > 0) return;
    try {
      const [progRes, quotaRes] = await Promise.all([
        api.get("/programs"),
        api.get("/quotas")
      ]);
      setPrograms(progRes.data.data || []);
      setQuotas(quotaRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/applicants");
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const watchQuotaId = watch("quotaId");
  const selectedQuota = quotas.find(q => q.id.toString() === watchQuotaId?.toString());
  const showAllotment = selectedQuota && (selectedQuota.name === "KCET" || selectedQuota.name === "COMEDK");

  const openAdd = async () => { 
    await fetchFormOptions();
    setEditing(null); 
    reset({ 
      name: "", 
      email: "", 
      phone: "", 
      dob: "", 
      programId: "", 
      quotaId: "", 
      category: "", 
      entryType: "", 
      marks: "", 
      allotmentNumber: "",
      status: "NEW", 
      docStatus: "Pending" 
    }); 
    setView("form"); 
  };
  
  const openEdit = async (item) => { 
    await fetchFormOptions(); // Wait for options to load!
    setEditing(item); 
    // Ensure IDs are strings for select inputs and dates are formatted
    reset({
      ...item,
      programId: item.programId?.toString() || "",
      quotaId: item.quotaId?.toString() || "",
      dob: item.dob ? new Date(item.dob).toISOString().split('T')[0] : ""
    }); 
    setView("form"); 
  };
  
  const openView = (item) => { setViewing(item); setView("detail"); };
  const backToTable = () => { setView("table"); setEditing(null); setViewing(null); };

  const onSubmit = async (formData) => {
    try {
      if (editing) {
        await api.put(`/applicants/${editing.id}`, formData);
      } else {
        await api.post("/applicants", formData);
      }
      fetchData();
      backToTable();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const executeDelete = async () => {
    try {
      await api.delete(`/applicants/${deleteId}`);
      setData(data.filter((d) => d.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const displayData = data.map(d => ({
    ...d,
    programName: d.Program?.name || '—',
    quotaName: d.Quota?.name || '—'
  }));

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
                ["Date of Birth", viewing.dob || "—"],
                ["Program", viewing.Program?.name || "—"],
                ["Category", viewing.category || "—"],
                ["Entry Type", viewing.entryType || "—"],
                ["Quota Type", viewing.Quota?.name || "—"],
                ["Marks", viewing.marks || "—"],
                ["Allotment Number", viewing.allotmentNumber || "—"],
                ["Document Status", viewing.docStatus || "—"],
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
                    <input type="date" className={inputClass} {...register("dob")} />
                  </FormField>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b">Academic Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  <FormField label="Program" error={errors.programId?.message}>
                    <select className={inputClass} {...register("programId", { required: "Program is required" })}>
                      <option value="">Select Program</option>
                      {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Category" error={errors.category?.message}>
                    <select className={inputClass} {...register("category")}>
                      <option value="">Select Category</option>
                      <option value="GM">GM</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                  </FormField>
                  <FormField label="Entry Type" error={errors.entryType?.message}>
                    <select className={inputClass} {...register("entryType")}>
                      <option value="">Select Entry Type</option>
                      <option value="Regular">Regular</option>
                      <option value="Lateral">Lateral</option>
                    </select>
                  </FormField>
                  <FormField label="Quota Type" error={errors.quotaId?.message}>
                    <select className={inputClass} {...register("quotaId", { required: "Required" })}>
                      <option value="">Select Quota</option>
                      {quotas.map(q => <option key={q.id} value={q.id}>{q.name}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Marks / Percentage" error={errors.marks?.message}>
                    <input type="number" step="0.01" className={inputClass} placeholder="Enter marks" {...register("marks")} />
                  </FormField>
                  {showAllotment && (
                    <FormField label="Allotment Number" error={errors.allotmentNumber?.message}>
                      <input className={inputClass} placeholder="Enter allotment number" {...register("allotmentNumber")} />
                    </FormField>
                  )}
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
          <div className="flex items-center justify-end mb-5">
            {hasWriteAccess && (
              <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
                <Plus size={16} /> Add Applicant
              </button>
            )}
          </div>
          <DataTable
            columns={columns}
            data={displayData}
            searchKeys={["name", "programName", "quotaName", "status"]}
            actions={(row) => (
              <div className="flex gap-0.5">
                <button onClick={() => openView(row)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="View"><Eye size={15} /></button>
                {hasWriteAccess && (
                  <button onClick={() => openEdit(row)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit"><Pencil size={15} /></button>
                )}
                {isAdmin && (
                  <button onClick={() => setDeleteId(row.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete"><Trash2 size={15} /></button>
                )}
              </div>
            )}
          />
        </>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete">
        <p className="text-sm text-muted-foreground mb-5">Are you sure you want to delete this applicant?</p>
        <div className="flex justify-end gap-2.5">
          <button onClick={() => setDeleteId(null)} className="px-4 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">Cancel</button>
          <button onClick={executeDelete} className="px-4 py-2.5 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity">Delete</button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Applicants;
