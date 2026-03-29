import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import FormField from "@/components/shared/FormField";
import Modal from "@/components/shared/Modal";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import api from "@/lib/api";

import { useAuth } from "@/contexts/AuthContext";

const inputClass = "w-full px-3 py-2.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const quotaFormSchema = z.object({
  programId: z.coerce.number().int().min(1, "Program is required"),
  totalIntake: z.any().optional(),
}).passthrough();

const Quota = () => {
  const { canWrite } = useAuth();
  const [data, setData] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [quotas, setQuotas] = useState([]);
  const [view, setView] = useState("table");
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const hasWriteAccess = canWrite("quotas");

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(quotaFormSchema),
  });

  useEffect(() => {
    fetchData();
    api.get("/quotas").then((res) => setQuotas(res.data.data || [])); // Needed for table columns
  }, []);

  const fetchPrograms = async () => {
    if (programs.length > 0) return;
    try {
      const res = await api.get("/programs");
      setPrograms(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      const res = await api.get("/seat-matrix");
      if (res.data.success) {
        // The backend now perfectly provides the grouped layout requested:
        // Array of objects with `{ programId, Program: {...}, details: [...] }`
        
        const formatted = res.data.data.map((groupedItem) => {
          let overallRemaining = 0;
          const row: any = {
            id: groupedItem.programId, 
            programId: groupedItem.programId,
            program: groupedItem.Program?.name,
            totalIntake: groupedItem.Program?.totalIntake || 0,
            details: groupedItem.details
          };
          
          groupedItem.details.forEach((m) => {
            const qName = m.Quota?.name?.toLowerCase();
            if (qName) {
              row[qName] = `${m.remainingSeats} / ${m.totalSeats}`;
              row[`${qName}Raw`] = m.totalSeats;
              row[`${qName}Id`] = m.id;
              overallRemaining += m.remainingSeats;
            }
          });
          
          row.overallRemaining = overallRemaining;
          return row;
        });
        
        setData(formatted);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: "program", label: "Program" },
    { key: "totalIntake", label: "Intake" },
    ...quotas.map(q => ({ 
      key: q.name.toLowerCase(), 
      label: q.name, 
      render: (val) => val || "0 / 0" 
    })),
    { 
      key: "overallRemaining", 
      label: "Remaining", 
      render: (val) => (
        <span className={`font-bold ${val === 0 ? "text-destructive" : "text-emerald-600"}`}>
          {val}
        </span>
      )
    },
  ];

  const openAdd = async () => { 
    await fetchPrograms();
    setEditing(null); 
    reset({ programId: "", totalIntake: "" }); 
    setView("form"); 
  };
  
  const openEdit = async (item) => { 
    await fetchPrograms();
    setEditing(item); 
    
    // Prepare reset data with raw numbers for the form
    const resetData = {
      programId: item.programId,
      totalIntake: item.totalIntake
    };
    
    quotas.forEach(q => {
      resetData[q.name.toLowerCase()] = item[`${q.name.toLowerCase()}Raw`] || 0;
    });

    reset(resetData); 
    setView("form"); 
  };
  const backToTable = () => { setView("table"); setEditing(null); };

  const watchIntake = Number(watch("totalIntake") || 0);
  const watchAllocations = quotas.map(q => Number(watch(q.name.toLowerCase()) || 0));
  const allocated = watchAllocations.reduce((a, b) => a + b, 0);
  const isMismatch = watchIntake > 0 && (allocated > watchIntake || allocated < watchIntake); // Explicit check

  const onSubmit = async (formData) => {
    try {
      const distributions = quotas.map(q => ({
        quotaId: q.id,
        totalSeats: Number(formData[q.name.toLowerCase()] || 0)
      }));

      await api.post("/seat-matrix", {
        programId: formData.programId,
        totalIntake: Number(formData.totalIntake),
        distributions
      });

      fetchData();
      backToTable();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleProgramChange = (id) => {
    const selected = programs.find(p => p.id.toString() === id.toString());
    if (selected) {
      setValue("totalIntake", selected.totalIntake);
    }
  };

  const executeDelete = async () => {
    // Simulated delete
    alert("Delete operation not strictly implemented on backend yet for grouped matrices.");
    setDeleteId(null);
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
                <FormField label="Program" error={errors.programId?.message}>
                  <select 
                    className={inputClass} 
                    {...register("programId", { required: "Program is required" })}
                    onChange={(e) => {
                      register("programId").onChange(e);
                      handleProgramChange(e.target.value);
                    }}
                  >
                    <option value="">Select Program</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Total Intake">
                  <input type="number" className={inputClass} {...register("totalIntake")} />
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
                      {quotas.map((q) => {
                        const key = q.name.toLowerCase();
                        return (
                          <tr key={key} className="border-b last:border-0">
                            <td className="px-4 py-3 font-medium">{q.name}</td>
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
                <button type="submit" disabled={isMismatch && watchIntake > 0} className="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
                  {editing ? "Update" : "Save"}
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
                <Plus size={16} /> Add Matrix
              </button>
            )}
          </div>
          <DataTable
            columns={columns}
            data={data}
            searchKeys={["program"]}
            actions={(row) => (
              <div className="flex gap-0.5">
                {hasWriteAccess ? (
                  <>
                    <button onClick={() => openEdit(row)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit"><Pencil size={15} /></button>
                    <button onClick={() => setDeleteId(row.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete"><Trash2 size={15} /></button>
                  </>
                ) : (
                  <button onClick={() => openEdit(row)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="View Details"><Plus size={15} className="rotate-45" /></button>
                )}
              </div>
            )}
          />
        </>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete">
        <p className="text-sm text-muted-foreground mb-5">Are you sure you want to delete this matrix?</p>
        <div className="flex justify-end gap-2.5">
          <button onClick={() => setDeleteId(null)} className="px-4 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">Cancel</button>
          <button onClick={executeDelete} className="px-4 py-2.5 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity">Delete</button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Quota;
