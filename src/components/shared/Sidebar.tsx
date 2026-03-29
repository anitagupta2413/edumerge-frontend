import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/utils/constants";
import {
  LayoutDashboard, Building2, MapPin, GraduationCap, BookOpen,
  Grid3X3, Users, Armchair, ClipboardCheck, LogOut, ChevronLeft, ChevronRight
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

const iconMap = {
  LayoutDashboard, Building2, MapPin, GraduationCap, BookOpen,
  Grid3X3, Users, Armchair, ClipboardCheck,
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className="fixed left-0 top-0 h-full z-30 flex flex-col transition-all duration-200"
      style={{
        width: collapsed ? 68 : 248,
        backgroundColor: "hsl(var(--sidebar-bg))",
        color: "hsl(var(--sidebar-fg))",
      }}
    >
      {/* Brand */}
      <div className="flex items-center px-5 h-16 border-b border-white/10">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[hsl(var(--sidebar-active))] text-white font-bold text-sm shrink-0">
          A
        </div>
        {!collapsed && (
          <span className="ml-3 font-semibold text-base tracking-tight text-white">AMS Portal</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2.5 overflow-y-auto space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-150 ${
                isActive
                  ? "bg-[hsl(var(--sidebar-active))] text-white font-medium shadow-sm"
                  : "text-[hsl(var(--sidebar-fg))]/80 hover:bg-[hsl(var(--sidebar-hover))] hover:text-white"
              }`}
            >
              {Icon && <Icon size={18} className="shrink-0" />}
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2.5 border-t border-white/10 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-[hsl(var(--sidebar-fg))]/70 hover:bg-red-500/15 hover:text-red-300 transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-1.5 rounded-lg hover:bg-white/5 text-[hsl(var(--sidebar-fg))]/50 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
