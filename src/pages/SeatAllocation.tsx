import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { getStatusColor } from "@/utils/helpers";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";

import { useAuth } from "@/contexts/AuthContext";

const SeatAllocation = () => {
  const { canWrite } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quotaData, setQuotaData] = useState([]);

  const hasWriteAccess = canWrite("seat-allocation");

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    if (selected && selected.programId) {
      api.get(`/seat-allocation?programId=${selected.programId}`)
        .then(res => {
          if (res.data.success) {
            const arr = res.data.data.map(q => ({
              quotaId: q.quotaId,
              quota: q.quotaName,
              total: q.totalSeats,
              filled: q.filledSeats,
              remaining: q.remainingSeats
            }));
            setQuotaData(arr);
          }
        })
        .catch(err => console.error(err));
    }
  }, [selected]);

  const fetchApplicants = () => {
    api.get("/applicants").then((res) => {
      if (res.data.success) {
        setApplicants(res.data.data);
      }
    });
  };

  const newApplicants = applicants.filter((a) => a.status === "NEW");

  const handleAllocate = async (id) => {
    try {
      await api.post("/seat-allocation", {
        applicantId: id,
        programId: selected.programId,
        quotaId: selected.quotaId
      });
      fetchApplicants();
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to allocate seat. Quota may be full.");
    }
  };

  const applicantColumns = [
    { key: "name", label: "Name" },
    { key: "programName", label: "Program", render: (_, row) => row.Program?.name },
    { key: "quotaName", label: "Quota", render: (_, row) => row.Quota?.name },
    { key: "marks", label: "Marks" },
    { key: "status", label: "Status", render: (val) => <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span> },
  ];

  if (selected) {
    const quotaRow = quotaData.find((q) => q.quotaId === selected.quotaId);
    const remaining = quotaRow ? quotaRow.remaining : 0;
    const showAllotment = selected.Quota?.name === "KCET" || selected.Quota?.name === "COMEDK";

    return (
      <DashboardLayout title="Seat Allocation">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
          <ArrowLeft size={16} /> Back to list
        </button>

        <div className="max-w-3xl space-y-5">
          {/* Applicant Info */}
          <div className="bg-card border rounded-xl p-6 card-shadow">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Applicant Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Name</p>
                <p className="font-medium">{selected.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Program</p>
                <p className="font-medium">{selected.Program?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Quota</p>
                <p className="font-medium">{selected.Quota?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Marks</p>
                <p className="font-medium">{selected.marks}</p>
              </div>
            </div>
          </div>

          {/* Seat Availability */}
          <div className="bg-card border rounded-xl p-6 card-shadow">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Seat Availability</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60 border-b">
                    <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Quota</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Total</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Filled</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {quotaData.map((q, i) => (
                    <tr key={q.quota} className={`border-b last:border-0 ${q.quotaId === selected.quotaId ? "bg-primary/[0.04]" : i % 2 === 1 ? "bg-muted/20" : ""}`}>
                      <td className="px-4 py-3 font-medium">{q.quota}</td>
                      <td className="px-4 py-3">{q.total}</td>
                      <td className="px-4 py-3">{q.filled}</td>
                      <td className="px-4 py-3">{q.remaining === 0 ? <span className="text-destructive font-semibold">0</span> : <span className="font-medium">{q.remaining}</span>}</td>
                    </tr>
                  ))}
                  {quotaData.length === 0 && (
                    <tr><td colSpan={4} className="text-center py-4 text-muted-foreground">Loading specific quota availability...</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Allotment Number */}
          {showAllotment && (
            <div className="bg-card border rounded-xl p-6 card-shadow">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Allotment Number</h3>
              <p className="text-sm font-medium">{selected.allotmentNumber || "—"}</p>
            </div>
          )}

          {/* Action */}
          <div className="pt-1">
            {hasWriteAccess ? (
              remaining > 0 ? (
                <button
                  onClick={() => handleAllocate(selected.id)}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
                >
                  Allocate Seat
                </button>
              ) : (
                <div className="inline-flex px-4 py-2.5 text-sm rounded-lg bg-destructive/10 text-destructive font-medium">
                  Quota Full / Not Configured
                </div>
              )
            ) : (
              <div className="inline-flex px-4 py-2.5 text-sm rounded-lg bg-muted text-foreground font-medium">
                View Only Mode
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Seat Allocation">
      <DataTable
        columns={applicantColumns}
        data={newApplicants}
        searchKeys={["name"]}
        actions={(row) => (
          <button
            onClick={() => setSelected(row)}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {hasWriteAccess ? "Allocate" : "View"}
          </button>
        )}
      />
    </DashboardLayout>
  );
};

export default SeatAllocation;
