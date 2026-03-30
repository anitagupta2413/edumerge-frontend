import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { getStatusColor, confirmationLabel } from "@/utils/helpers";
import { ArrowLeft, CheckCircle2, AlertCircle, Save } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const Admissions = () => {
  const { canWrite } = useAuth();
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form state for the selected applicant
  const [feeStatus, setFeeStatus] = useState("PENDING");
  const [admissionConfirmation, setAdmissionConfirmation] = useState(false);

  const hasWriteAccess = canWrite("admissions");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/admissions");
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (item) => {
    setSelected(item);
    // Initialize form states from existing data
    setFeeStatus(item.Admission?.feeStatus || "PENDING");
    setAdmissionConfirmation(item.Admission?.admissionConfirmation || false);
  };

  const onSaveStatus = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await api.post("/admissions/confirm", {
        applicantId: selected.id,
        feeStatus: feeStatus,
        documentStatus: selected.docStatus === 'Verified' ? 'VALID' : 'PENDING',
        admissionConfirmation: admissionConfirmation
      });
      await fetchData();
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update admission status");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "id", label: "App ID" },
    { key: "name", label: "Name" },
    { key: "program", label: "Program", render: (_, row) => row.Program?.name },
    { key: "quota", label: "Quota", render: (_, row) => row.Quota?.name },
    { 
      key: "fee", 
      label: "Fee Status", 
      render: (_, row) => (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${row.Admission?.feeStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {row.Admission?.feeStatus || "PENDING"}
        </span>
      ) 
    },
    { key: "docStatus", label: "Doc Status", render: (val) => <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span> },
    { 
      key: "admissionId", 
      label: "Admission ID", 
      render: (_, row) => (
        <span className="font-mono text-xs font-semibold text-primary">
          {row.Admission?.admissionNumber && row.Admission?.admissionNumber !== 'PENDING' ? row.Admission.admissionNumber : "—"}
        </span>
      ) 
    },
    {
      key: "Admission.admissionConfirmation",
      label: "Final Status",
      render: (_, row) => {
        const label = confirmationLabel(row.Admission?.admissionConfirmation === true);
        return (
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(label)}`}>
            {label}
          </span>
        );
      }
    },
  ];

  if (selected) {
    const isPaid = feeStatus === "PAID";
    
    return (
      <DashboardLayout title="Admission Management">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
          <ArrowLeft size={16} /> Back to list
        </button>

        <div className="max-w-3xl space-y-6">
          {/* Status Banner */}
          {selected.Admission?.admissionNumber && selected.Admission?.admissionNumber !== 'PENDING' && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="text-primary" size={20} />
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Admission Confirmed</p>
                <p className="text-sm font-bold text-foreground font-mono">{selected.Admission.admissionNumber}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-xl p-6 card-shadow space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Applicant Details</h3>
              <div className="space-y-3 text-sm">
                {[
                  ["ID", selected.id],
                  ["Name", selected.name],
                  ["Program", selected.Program?.name],
                  ["Quota", selected.Quota?.name],
                  ["Phone", selected.phone],
                  ["Documents", selected.docStatus]
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between border-b border-muted py-1">
                    <span className="text-muted-foreground text-xs">{l}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded-xl p-6 card-shadow space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verification & Approval</h3>
              
              {/* Fee Status Radios */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-foreground">Fee Status</label>
                <div className="flex gap-4">
                  {["PENDING", "PAID"].map((opt) => (
                    <label key={opt} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${feeStatus === opt ? "border-primary bg-primary/5 text-primary" : "border-muted hover:border-muted-foreground/30 text-muted-foreground"}`}>
                      <input 
                        type="radio" 
                        className="hidden" 
                        name="feeStatus" 
                        value={opt} 
                        checked={feeStatus === opt} 
                        onChange={(e) => setFeeStatus(e.target.value)} 
                        disabled={!hasWriteAccess}
                      />
                      <span className="text-sm font-semibold">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Admission Confirmation Radios */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-foreground">Admission Confirmation</label>
                <div className="flex gap-4">
                  {[
                    { label: "Pending", value: false },
                    { label: "Confirmed", value: true }
                  ].map((opt) => (
                    <label key={opt.label} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${admissionConfirmation === opt.value ? "border-primary bg-primary/5 text-primary" : "border-muted hover:border-muted-foreground/30 text-muted-foreground"} ${opt.value && !isPaid ? "opacity-50 cursor-not-allowed" : ""}`}>
                      <input 
                        type="radio" 
                        className="hidden" 
                        name="admissionStatus" 
                        checked={admissionConfirmation === opt.value} 
                        onChange={() => isPaid || !opt.value ? setAdmissionConfirmation(opt.value) : null} 
                        disabled={!hasWriteAccess || (opt.value && !isPaid)}
                      />
                      <span className="text-sm font-semibold">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {!isPaid && (
                  <p className="text-[10px] text-amber-600 flex items-center gap-1 font-medium">
                    <AlertCircle size={10} /> Admission can only be confirmed if Fee is Paid
                  </p>
                )}
              </div>

              {hasWriteAccess && (
                <button
                  onClick={onSaveStatus}
                  disabled={loading || (admissionConfirmation && feeStatus === "PENDING")}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} /> {loading ? "Updating..." : "Save Admission Details"}
                </button>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admission Management">
      <DataTable
        columns={columns}
        data={data}
        searchKeys={["name"]}
        actions={(row) => (
          <button onClick={() => handleSelect(row)} className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
            Manage
          </button>
        )}
      />
    </DashboardLayout>
  );
};

export default Admissions;
