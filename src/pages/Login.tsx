import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FormField from "@/components/shared/FormField";
import { Lock, Mail, GraduationCap } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      setError("");
      if (data.email === "admin@ams.com" && data.password === "admin123") {
        localStorage.setItem("token", "mock-jwt-token");
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[hsl(var(--sidebar-bg))] px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
              <GraduationCap size={28} className="text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-white">Admission Management</h1>
            <p className="text-sm text-white/60 mt-1.5">Sign in to your account</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-5 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">{error}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <FormField label="Email Address" error={errors.email?.message}>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    placeholder="admin@ams.com"
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
              </FormField>

              <FormField label="Password" error={errors.password?.message}>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    placeholder="••••••••"
                    {...register("password", { required: "Password is required" })}
                  />
                </div>
              </FormField>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6 bg-muted px-3 py-2.5 rounded-lg">
              Demo: <strong>admin@ams.com</strong> / <strong>admin123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
