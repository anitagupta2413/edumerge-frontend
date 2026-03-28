import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { getStatusColor } from "@/utils/helpers";

const initialApplicants = [
  { id: "1", name: "John Doe", program: "B.Tech CS", category: "General", status: "New" },
  { id: "2", name: "Jane Smith", program: "B.Tech Mech", category: "OBC", status: "New" },
];

const quotaData = [
  { id: "1", program: "B.Tech CS", category: "General", total: 60, filled: 45, remaining: 15 },
  { id: "2", program: "B.Tech CS", category: "OBC", total: 30, filled: 22, remaining: 8 },
  { id: "3", program: "B.Tech Mech", category: "General", total: 50, filled: 30, remaining: 20 },
  { id: "4", program: "B.Tech Mech", category: "OBC", total: 25, filled: 15, remaining: 10 },
];

const quotaColumns = [
  { key: "program", label: "Program" },
  { key: "category", label: "Category" },
  { key: "total", label: "Total" },
  { key: "filled", label: "Filled" },
  { key: "remaining", label: "Remaining" },
];

const SeatAllocation = () => {
  const [applicants, setApplicants] = useState(initialApplicants);

  const handleAllocate = (id) => {
    setApplicants(applicants.map((a) => (a.id === id ? { ...a, status: "Allocated" } : a)));
  };

  const applicantColumns = [
    { key: "name", label: "Name" },
    { key: "program", label: "Program" },
    { key: "category", label: "Category" },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span>
      ),
    },
  ];

  return (
    <DashboardLayout title="Seat Allocation">
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-semibold mb-3">Quota Availability</h2>
          <DataTable columns={quotaColumns} data={quotaData} />
        </div>

        <div>
          <h2 className="text-base font-semibold mb-3">Applicants</h2>
          <DataTable
            columns={applicantColumns}
            data={applicants}
            actions={(row) =>
              row.status === "New" ? (
                <button
                  onClick={() => handleAllocate(row.id)}
                  className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90"
                >
                  Allocate
                </button>
              ) : (
                <span className="text-xs text-muted-foreground">Allocated</span>
              )
            }
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeatAllocation;
