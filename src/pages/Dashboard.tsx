import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { Users, Armchair, ClipboardCheck, Grid3X3 } from "lucide-react";
import { getStatusColor, capitalize, confirmationLabel } from "@/utils/helpers";
import api from "@/lib/api";

const recentColumns = [
  { key: "name", label: "Name" },
  { key: "program", label: "Program", render: (_, row) => row.Program?.name || "—" },
  { key: "quota", label: "Quota", render: (_, row) => row.Quota?.name || "—" },
  {
    key: "feeStatus",
    label: "Fee",
    render: (_, row) => {
      const status = row.Admission?.feeStatus;
      if (!status) return "—";
      const label = capitalize(status);
      return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(label)}`}>{label}</span>;
    },
  },
  {
    key: "docStatus",
    label: "Documents",
    render: (val) => (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span>
    ),
  },
  {
    key: "admissionConfirmation",
    label: "Admission",
    render: (_, row) => {
      const confirmed = row.Admission?.admissionConfirmation;
      if (confirmed === undefined || confirmed === null) return "—";
      const label = confirmationLabel(confirmed);
      return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(label)}`}>{label}</span>;
    },
  },
];

const Dashboard = () => {
  const [stats, setStats] = useState([
    { label: "Total Applicants", value: 0, icon: Users, bg: "bg-primary/10", fg: "text-primary" },
    { label: "Total Seats", value: 0, icon: Grid3X3, bg: "bg-emerald-50", fg: "text-emerald-600" },
    { label: "Allocated Seats", value: 0, icon: Armchair, bg: "bg-amber-50", fg: "text-amber-600" },
    { label: "Confirmed", value: 0, icon: ClipboardCheck, bg: "bg-violet-50", fg: "text-violet-600" },
  ]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [applicantsRes, programsRes, admissionsRes] = await Promise.all([
          api.get("/applicants"),
          api.get("/programs"),
          api.get("/admissions"),
        ]);

        const applicants = applicantsRes.data.data || [];
        const programs = programsRes.data.data || [];
        const admissions = admissionsRes.data.data || [];

        // Total Applicants (any status)
        const totalApplicants = applicants.length;

        // Total Seats (sum of totalIntake in programs)
        const totalSeats = programs.reduce((sum, p) => sum + (p.totalIntake || 0), 0);

        // Confirmed Admissions (from admissions table, check admissionConfirmation)
        const confirmedAdmissions = admissions.filter(a => a.Admission?.admissionConfirmation === true).length;

        // Allocated Seats (allocated + confirmed, since confirmed also holds a seat)
        const allocatedSeats = applicants.filter(a => a.seatAllocated === true).length;

        setStats([
          { label: "Total Applicants", value: totalApplicants, icon: Users, bg: "bg-primary/10", fg: "text-primary" },
          { label: "Total Seats", value: totalSeats, icon: Grid3X3, bg: "bg-emerald-50", fg: "text-emerald-600" },
          { label: "Allocated Seats", value: allocatedSeats, icon: Armchair, bg: "bg-amber-50", fg: "text-amber-600" },
          { label: "Confirmed", value: confirmedAdmissions, icon: ClipboardCheck, bg: "bg-violet-50", fg: "text-violet-600" },
        ]);

        // Recent 5 applicants
        setRecentApplicants(applicants.slice(0, 5));
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout title="Dashboard">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border rounded-xl p-5 card-shadow hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1.5">{loading ? "..." : stat.value.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon size={22} className={stat.fg} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Applicants */}
      <div className="bg-card border rounded-xl p-5 card-shadow">
        <h3 className="text-sm font-semibold mb-4">Recent Applicants</h3>
        <DataTable columns={recentColumns} data={recentApplicants} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
