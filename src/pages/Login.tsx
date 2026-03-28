import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FormField from "@/components/shared/FormField";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      setError("");
      // Mock login — replace with real API call
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
      <div className="w-full max-w-sm">
        <div className="bg-card border rounded-lg p-8 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-foreground">Admission Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-destructive/10 text-destructive text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Email" error={errors.email?.message}>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="admin@ams.com"
                {...register("email", { required: "Email is required" })}
              />
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
              />
            </FormField>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Demo: admin@ams.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
