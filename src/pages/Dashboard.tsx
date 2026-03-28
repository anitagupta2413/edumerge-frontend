import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { Users, Armchair, ClipboardCheck, Grid3X3, TrendingUp } from "lucide-react";
import { getStatusColor } from "@/utils/helpers";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const stats = [
  { label: "Total Applicants", value: 1245, icon: Users, bg: "bg-primary/10", fg: "text-primary" },
  { label: "Total Seats", value: 800, icon: Grid3X3, bg: "bg-emerald-50", fg: "text-emerald-600" },
  { label: "Allocated Seats", value: 623, icon: Armchair, bg: "bg-amber-50", fg: "text-amber-600" },
  { label: "Confirmed", value: 412, icon: ClipboardCheck, bg: "bg-violet-50", fg: "text-violet-600" },
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
  { name: "KCET", value: 450, color: "hsl(217, 91%, 60%)" },
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
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span>
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
            <div key={stat.label} className="bg-card border rounded-xl p-5 card-shadow hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1.5">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon size={22} className={stat.fg} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-5 card-shadow">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-muted-foreground" />
            <h3 className="text-sm font-semibold">Applicants vs Seats</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 18%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(214, 18%, 90%)", fontSize: "12px" }} />
              <Bar dataKey="applicants" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="Applicants" />
              <Bar dataKey="seats" fill="hsl(217, 91%, 60%, 0.3)" radius={[4, 4, 0, 0]} name="Seats" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-xl p-5 card-shadow">
          <h3 className="text-sm font-semibold mb-5">Quota Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={85} innerRadius={45} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(214, 18%, 90%)", fontSize: "12px" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
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
