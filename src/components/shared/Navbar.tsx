import { User } from "lucide-react";

const Navbar = ({ title }) => {
  return (
    <header className="h-14 border-b bg-card card-shadow flex items-center justify-between px-6">
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={16} className="text-primary" />
        </div>
        <span className="hidden sm:inline font-medium">Admin</span>
      </div>
    </header>
  );
};

export default Navbar;
