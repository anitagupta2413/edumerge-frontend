import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/utils/constants";
import {
  LayoutDashboard, Building2, MapPin, GraduationCap, BookOpen,
  Grid3X3, Users, Armchair, ClipboardCheck, LogOut, Menu, X
} from "lucide-react";

const iconMap = {
  LayoutDashboard, Building2, MapPin, GraduationCap, BookOpen,
  Grid3X3, Users, Armchair, ClipboardCheck,
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside
      className="fixed left-0 top-0 h-full z-30 flex flex-col transition-all duration-200"
      style={{
        width: collapsed ? 64 : 240,
        backgroundColor: "hsl(var(--sidebar-bg))",
        color: "hsl(var(--sidebar-fg))",
      }}
    >
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
        {!collapsed && <span className="font-bold text-lg tracking-tight">AMS</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-white/10">
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-[hsl(var(--sidebar-active))] text-white font-medium"
                  : "hover:bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-fg))]"
              }`}
            >
              {Icon && <Icon size={18} />}
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[hsl(var(--sidebar-hover))] rounded"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
