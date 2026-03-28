import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { getStatusColor, generateId } from "@/utils/helpers";
import { ArrowLeft } from "lucide-react";

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
    if (selected && selected.id === id) {
      setSelected({ ...selected, feeStatus: value });
    }
  };

  const handleDocChange = (id, value) => {
    setData(data.map((d) => (d.id === id ? { ...d, docStatus: value } : d)));
    if (selected && selected.id === id) {
      setSelected({ ...selected, docStatus: value });
    }
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
    { key: "feeStatus", label: "Fee Status", render: (val) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span> },
    { key: "status", label: "Status", render: (val) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span> },
  ];

  if (selected) {
    const current = data.find((d) => d.id === selected.id) || selected;
    const canConfirm = current.feeStatus === "Paid";

    return (
      <DashboardLayout title="Admissions">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={16} /> Back to list
        </button>

        <div className="max-w-2xl space-y-4">
          {/* Applicant Info */}
          <div className="bg-card border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-3">Applicant Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div><p className="text-muted-foreground">Name</p><p className="font-medium">{current.name}</p></div>
              <div><p className="text-muted-foreground">Program</p><p className="font-medium">{current.program}</p></div>
              <div><p className="text-muted-foreground">Quota</p><p className="font-medium">{current.quotaType}</p></div>
            </div>
          </div>

          {/* Document Status */}
          <div className="bg-card border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-3">Document Status</h3>
            <select
              value={current.docStatus}
              onChange={(e) => handleDocChange(current.id, e.target.value)}
              className="px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Pending">Pending</option>
              <option value="Submitted">Submitted</option>
              <option value="Verified">Verified</option>
            </select>
          </div>

          {/* Fee Status */}
          <div className="bg-card border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-3">Fee Status</h3>
            <select
              value={current.feeStatus}
              onChange={(e) => handleFeeChange(current.id, e.target.value)}
              className="px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          {/* Confirm */}
          <div>
            <button
              onClick={() => handleConfirm(current.id)}
              disabled={!canConfirm}
              className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm Admission
            </button>
            {!canConfirm && <p className="text-xs text-destructive mt-1">Fee must be Paid to confirm admission</p>}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admissions">
      <h2 className="text-base font-semibold mb-4">Allocated Applicants — Pending Confirmation</h2>
      <DataTable
        columns={columns}
        data={allocatedApplicants}
        searchKeys={["name", "program", "quotaType"]}
        actions={(row) => (
          <button
            onClick={() => setSelected(row)}
            className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90"
          >
            Confirm
          </button>
        )}
      />
    </DashboardLayout>
  );
};

export default Admissions;
