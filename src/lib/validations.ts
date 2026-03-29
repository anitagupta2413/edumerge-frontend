import { z } from "zod";

// Shared regex for consistency with backend
const phoneRegex = /^\d{10}$/;
const academicYearRegex = /^\d{4}-\d{2}$/;

export const commonSchemas = {
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone is required").regex(phoneRegex, "Phone number must be 10 digits"),
  academicYear: z.string().min(1, "Academic year is required").regex(academicYearRegex, "Must be YYYY-YY (e.g. 2025-26)"),
  requiredString: (name: string) => z.string().min(1, `${name} is required`),
  positiveInt: z.number().int().nonnegative("Must be a positive integer"),
  marks: z.number().min(0, "Min 0").max(100, "Max 100"),
};

// Module specific schemas
export const loginSchema = z.object({
  email: commonSchemas.email,
  password: commonSchemas.requiredString("Password"),
});

export const institutionSchema = z.object({
  name: commonSchemas.requiredString("Institution Name"),
  code: commonSchemas.requiredString("Institution Code"),
  academicYear: commonSchemas.academicYear,
  courseType: z.union([z.string(), z.array(z.string())]).optional(),
});

export const campusSchema = z.object({
  name: commonSchemas.requiredString("Campus Name"),
  code: commonSchemas.requiredString("Campus Code"),
  location: commonSchemas.requiredString("Location"),
});

export const departmentSchema = z.object({
  name: commonSchemas.requiredString("Department Name"),
  code: commonSchemas.requiredString("Department Code"),
  hod: commonSchemas.requiredString("HOD Name"),
  campusId: z.coerce.number().int().min(1, "Campus is required"),
});

export const programSchema = z.object({
  name: commonSchemas.requiredString("Program Name"),
  code: commonSchemas.requiredString("Program Code"),
  duration: commonSchemas.requiredString("Duration"),
  totalIntake: z.preprocess((val) => Number(val), z.number().int().positive("Must be > 0")),
  courseType: z.enum(["UG", "PG"], { required_error: "Course Type is required" }),
  departmentId: z.coerce.number().int().min(1, "Department is required"),
});

export const applicantSchema = z.object({
  name: commonSchemas.requiredString("Full Name"),
  email: commonSchemas.email,
  phone: commonSchemas.phone,
  dob: z.string().min(1, "DOB is required"),
  programId: z.coerce.number().int().min(1, "Program is required"),
  quotaId: z.coerce.number().int().min(1, "Quota is required"),
  category: z.string().optional(),
  entryType: z.string().optional(),
  marks: z.preprocess((val) => Number(val), commonSchemas.marks).optional(),
  allotmentNumber: z.string().optional(),
  docStatus: z.enum(["Pending", "Submitted", "Verified"]).optional(),
});

export const admissionConfirmSchema = z.object({
  feesPaid: z.preprocess((val) => Number(val), z.number().min(0, "Cannot be negative")),
  paymentMethod: commonSchemas.requiredString("Payment Method"),
});
