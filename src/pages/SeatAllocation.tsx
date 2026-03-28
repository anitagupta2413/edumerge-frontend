import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { getStatusColor } from "@/utils/helpers";
import { ArrowLeft } from "lucide-react";

const initialApplicants = [
  { id: "1", name: "John Doe", program: "B.Tech CS", quotaType: "KCET", marks: "85", allotmentNumber: "KC12345", status: "New" },
  { id: "2", name: "Sara Davis", program: "B.Tech Mech", quotaType: "COMEDK", marks: "78", allotmentNumber: "CD99999", status: "New" },
  { id: "3", name: "Tom Brown", program: "B.Tech CS", quotaType: "Management", marks: "70", allotmentNumber: "", status: "New" },
];

const quotaData = [
  { quota: "KCET", total: 50, filled: 45, remaining: 5 },
  { quota: "COMEDK", total: 40, filled: 40, remaining: 0 },
  { quota: "Management", total: 30, filled: 20, remaining: 10 },
];

const SeatAllocation = () => {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [selected, setSelected] = useState(null);

  const newApplicants = applicants.filter((a) => a.status === "New");

  const handleAllocate = (id) => {
    setApplicants(applicants.map((a) => (a.id === id ? { ...a, status: "Allocated" } : a)));
    setSelected(null);
  };

  const applicantColumns = [
    { key: "name", label: "Name" },
    { key: "program", label: "Program" },
    { key: "quotaType", label: "Quota" },
    { key: "marks", label: "Marks" },
    { key: "status", label: "Status", render: (val) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span> },
  ];

  if (selected) {
    const quotaRow = quotaData.find((q) => q.quota === selected.quotaType);
    const remaining = quotaRow ? quotaRow.remaining : 0;
    const showAllotment = selected.quotaType === "KCET" || selected.quotaType === "COMEDK";

    return (
      <DashboardLayout title="Seat Allocation">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={16} /> Back to list
        </button>

        <div className="max-w-3xl space-y-4">
          {/* Applicant Info */}
          <div className="bg-card border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-3">Applicant Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div><p className="text-muted-foreground">Name</p><p className="font-medium">{selected.name}</p></div>
              <div><p className="text-muted-foreground">Program</p><p className="font-medium">{selected.program}</p></div>
              <div><p className="text-muted-foreground">Quota</p><p className="font-medium">{selected.quotaType}</p></div>
              <div><p className="text-muted-foreground">Marks</p><p className="font-medium">{selected.marks}</p></div>
            </div>
          </div>

          {/* Seat Availability */}
          <div className="bg-card border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-3">Seat Availability</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Quota</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Total</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Filled</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {quotaData.map((q) => (
                    <tr key={q.quota} className={`border-b last:border-0 ${q.quota === selected.quotaType ? "bg-primary/5" : ""}`}>
                      <td className="px-4 py-2 font-medium">{q.quota}</td>
                      <td className="px-4 py-2">{q.total}</td>
                      <td className="px-4 py-2">{q.filled}</td>
                      <td className="px-4 py-2">{q.remaining === 0 ? <span className="text-destructive font-medium">0</span> : q.remaining}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Allotment Number */}
          {showAllotment && (
            <div className="bg-card border rounded-lg p-5">
              <h3 className="text-sm font-semibold mb-2">Allotment Number</h3>
              <p className="text-sm font-medium">{selected.allotmentNumber || "—"}</p>
            </div>
          )}

          {/* Action */}
          <div className="flex gap-2">
            {remaining > 0 ? (
              <button
                onClick={() => handleAllocate(selected.id)}
                className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90"
              >
                Allocate Seat
              </button>
            ) : (
              <div className="px-4 py-2 text-sm rounded-md bg-destructive/10 text-destructive font-medium">
                Quota Full — Cannot Allocate
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Seat Allocation">
      <h2 className="text-base font-semibold mb-4">Applicants — Pending Allocation</h2>
      <DataTable
        columns={applicantColumns}
        data={newApplicants}
        searchKeys={["name", "program", "quotaType"]}
        actions={(row) => (
          <button
            onClick={() => setSelected(row)}
            className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90"
          >
            Allocate
          </button>
        )}
      />
    </DashboardLayout>
  );
};

export default SeatAllocation;
