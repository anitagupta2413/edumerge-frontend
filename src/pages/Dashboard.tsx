import DashboardLayout from "@/layouts/DashboardLayout";
import { Users, Armchair, ClipboardCheck, Grid3X3 } from "lucide-react";

const stats = [
  { label: "Total Applicants", value: 1245, icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "Total Seats", value: 800, icon: Grid3X3, color: "bg-emerald-50 text-emerald-600" },
  { label: "Allocated Seats", value: 623, icon: Armchair, color: "bg-amber-50 text-amber-600" },
  { label: "Confirmed Admissions", value: 412, icon: ClipboardCheck, color: "bg-violet-50 text-violet-600" },
];

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </DashboardLayout>
  );
};

export default Dashboard;
