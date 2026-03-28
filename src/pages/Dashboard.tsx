import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { Users, Armchair, ClipboardCheck, Grid3X3, TrendingUp } from "lucide-react";
import { getStatusColor } from "@/utils/helpers";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const stats = [
  { label: "Total Applicants", value: 1245, icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "Total Seats", value: 800, icon: Grid3X3, color: "bg-emerald-50 text-emerald-600" },
  { label: "Allocated Seats", value: 623, icon: Armchair, color: "bg-amber-50 text-amber-600" },
  { label: "Confirmed Admissions", value: 412, icon: ClipboardCheck, color: "bg-violet-50 text-violet-600" },
];

const recentApplicants = [
  { id: "1", name: "John Doe", program: "B.Tech CS", quota: "KCET", status: "New" },
  { id: "2", name: "Jane Smith", program: "B.Tech Mech", quota: "COMEDK", status: "Allocated" },
  { id: "3", name: "Mike Wilson", program: "B.Tech CS", quota: "Management", status: "Confirmed" },
  { id: "4", name: "Sara Davis", program: "B.Tech Mech", quota: "KCET", status: "New" },
  { id: "5", name: "Tom Brown", program: "B.Tech CS", quota: "COMEDK", status: "Allocated" },
];

const barData = [
  { name: "B.Tech CS", applicants: 520, seats: 300 },
  { name: "B.Tech Mech", applicants: 380, seats: 250 },
  { name: "B.Tech ECE", applicants: 200, seats: 150 },
  { name: "B.Tech Civil", applicants: 145, seats: 100 },
];

const pieData = [
  { name: "KCET", value: 450, color: "hsl(215, 80%, 48%)" },
  { name: "COMEDK", value: 380, color: "hsl(142, 71%, 45%)" },
  { name: "Management", value: 415, color: "hsl(38, 92%, 50%)" },
];

const recentColumns = [
  { key: "name", label: "Name" },
  { key: "program", label: "Program" },
  { key: "quota", label: "Quota" },
  {
    key: "status",
    label: "Status",
    render: (val) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span>
    ),
  },
];

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-muted-foreground" />
            <h3 className="text-sm font-semibold">Applicants vs Seats by Program</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="applicants" fill="hsl(215, 80%, 48%)" radius={[3, 3, 0, 0]} name="Applicants" />
              <Bar dataKey="seats" fill="hsl(215, 80%, 48%, 0.35)" radius={[3, 3, 0, 0]} name="Seats" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Applicants by Quota</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Applicants Table */}
      <div className="bg-card border rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-3">Recent Applicants</h3>
        <DataTable columns={recentColumns} data={recentApplicants} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
