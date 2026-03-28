import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { getStatusColor } from "@/utils/helpers";
import { ArrowLeft } from "lucide-react";

const inputClass = "px-3 py-2.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

const initialData = [
  { id: "1", name: "Jane Smith", program: "B.Tech Mech", quotaType: "COMEDK", docStatus: "Verified", feeStatus: "Pending", status: "Allocated", admissionNumber: "" },
  { id: "2", name: "Alex Brown", program: "B.Tech CS", quotaType: "KCET", docStatus: "Submitted", feeStatus: "Paid", status: "Allocated", admissionNumber: "" },
];

const Admissions = () => {
  const [data, setData] = useState(initialData);
  const [selected, setSelected] = useState(null);

  const allocatedApplicants = data.filter((d) => d.status === "Allocated");

  const handleFeeChange = (id, value) => {
    setData(data.map((d) => (d.id === id ? { ...d, feeStatus: value } : d)));
    if (selected && selected.id === id) setSelected({ ...selected, feeStatus: value });
  };

  const handleDocChange = (id, value) => {
    setData(data.map((d) => (d.id === id ? { ...d, docStatus: value } : d)));
    if (selected && selected.id === id) setSelected({ ...selected, docStatus: value });
  };

  const handleConfirm = (id) => {
    const admNum = "ADM" + Date.now().toString().slice(-6);
    setData(data.map((d) => (d.id === id ? { ...d, status: "Confirmed", admissionNumber: admNum } : d)));
    setSelected(null);
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "program", label: "Program" },
    { key: "quotaType", label: "Quota" },
    { key: "feeStatus", label: "Fee Status", render: (val) => <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span> },
    { key: "status", label: "Status", render: (val) => <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span> },
  ];

  if (selected) {
    const current = data.find((d) => d.id === selected.id) || selected;
    const canConfirm = current.feeStatus === "Paid";

    return (
      <DashboardLayout title="Admissions">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
          <ArrowLeft size={16} /> Back to list
        </button>

        <div className="max-w-2xl space-y-5">
          <div className="bg-card border rounded-xl p-6 card-shadow">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Applicant Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 text-sm">
              <div className="space-y-1"><p className="text-muted-foreground text-xs">Name</p><p className="font-medium">{current.name}</p></div>
              <div className="space-y-1"><p className="text-muted-foreground text-xs">Program</p><p className="font-medium">{current.program}</p></div>
              <div className="space-y-1"><p className="text-muted-foreground text-xs">Quota</p><p className="font-medium">{current.quotaType}</p></div>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 card-shadow">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Document Status</h3>
            <select value={current.docStatus} onChange={(e) => handleDocChange(current.id, e.target.value)} className={inputClass}>
              <option value="Pending">Pending</option>
              <option value="Submitted">Submitted</option>
              <option value="Verified">Verified</option>
            </select>
          </div>

          <div className="bg-card border rounded-xl p-6 card-shadow">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Fee Status</h3>
            <select value={current.feeStatus} onChange={(e) => handleFeeChange(current.id, e.target.value)} className={inputClass}>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div className="pt-1">
            <button
              onClick={() => handleConfirm(current.id)}
              disabled={!canConfirm}
              className="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              Confirm Admission
            </button>
            {!canConfirm && <p className="text-xs text-destructive mt-2">Fee must be Paid before confirming admission</p>}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admissions">
      <h2 className="text-lg font-semibold mb-5">Allocated Applicants — Pending Confirmation</h2>
      <DataTable
        columns={columns}
        data={allocatedApplicants}
        searchKeys={["name", "program", "quotaType"]}
        actions={(row) => (
          <button onClick={() => setSelected(row)} className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            Confirm
          </button>
        )}
      />
    </DashboardLayout>
  );
};

export default Admissions;
