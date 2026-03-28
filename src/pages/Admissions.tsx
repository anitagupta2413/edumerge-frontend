import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { getStatusColor } from "@/utils/helpers";

const initialData = [
  { id: "1", name: "Jane Smith", program: "B.Tech Mech", category: "OBC", feeStatus: "Pending", admitted: false },
  { id: "2", name: "Alex Brown", program: "B.Tech CS", category: "General", feeStatus: "Paid", admitted: false },
];

const Admissions = () => {
  const [data, setData] = useState(initialData);

  const handleFeeChange = (id, value) => {
    setData(data.map((d) => (d.id === id ? { ...d, feeStatus: value } : d)));
  };

  const handleConfirm = (id) => {
    setData(data.map((d) => (d.id === id ? { ...d, admitted: true } : d)));
  };

  const columns = [
    { key: "name", label: "Applicant" },
    { key: "program", label: "Program" },
    { key: "category", label: "Category" },
    {
      key: "feeStatus",
      label: "Fee Status",
      render: (val, row) => (
        <select
          value={val}
          onChange={(e) => handleFeeChange(row.id, e.target.value)}
          className="px-2 py-1 border rounded text-sm bg-background"
          disabled={row.admitted}
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>
      ),
    },
    {
      key: "admitted",
      label: "Status",
      render: (val) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${val ? getStatusColor("Confirmed") : getStatusColor("Pending")}`}>
          {val ? "Confirmed" : "Pending"}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout title="Admissions">
      <h2 className="text-base font-semibold mb-4">Manage Admissions</h2>
      <DataTable
        columns={columns}
        data={data}
        actions={(row) =>
          !row.admitted ? (
            <button
              onClick={() => handleConfirm(row.id)}
              disabled={row.feeStatus !== "Paid"}
              className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm Admission
            </button>
          ) : (
            <span className="text-xs text-emerald-600 font-medium">✓ Admitted</span>
          )
        }
      />
    </DashboardLayout>
  );
};

export default Admissions;
