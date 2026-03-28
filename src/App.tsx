import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Institution from "./pages/Institution";
import Campus from "./pages/Campus";
import Department from "./pages/Department";
import Program from "./pages/Program";
import Quota from "./pages/Quota";
import Applicants from "./pages/Applicants";
import SeatAllocation from "./pages/SeatAllocation";
import Admissions from "./pages/Admissions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/institution" element={<Institution />} />
          <Route path="/campus" element={<Campus />} />
          <Route path="/department" element={<Department />} />
          <Route path="/program" element={<Program />} />
          <Route path="/quota" element={<Quota />} />
          <Route path="/applicants" element={<Applicants />} />
          <Route path="/seat-allocation" element={<SeatAllocation />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
