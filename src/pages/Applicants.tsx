import { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/shared/FormField";
import { generateId, getStatusColor } from "@/utils/helpers";
import { Plus } from "lucide-react";

const initialApplicants = [
  { id: "1", name: "John Doe", email: "john@mail.com", phone: "9876543210", program: "B.Tech CS", category: "General", status: "New" },
  { id: "2", name: "Jane Smith", email: "jane@mail.com", phone: "9876543211", program: "B.Tech Mech", category: "OBC", status: "Allocated" },
  { id: "3", name: "Mike Wilson", email: "mike@mail.com", phone: "9876543212", program: "B.Tech CS", category: "SC", status: "Confirmed" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "program", label: "Program" },
  { key: "category", label: "Category" },
  {
    key: "status",
    label: "Status",
    render: (val) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(val)}`}>{val}</span>
    ),
  },
];

const Applicants = () => {
  const [data, setData] = useState(initialApplicants);
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (formData) => {
    setData([...data, { id: generateId(), ...formData, status: "New" }]);
    setModalOpen(false);
    reset();
  };

  return (
    <DashboardLayout title="Applicants">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Manage Applicants</h2>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90">
          <Plus size={16} /> Add Applicant
        </button>
      </div>

      <DataTable columns={columns} data={data} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Applicant">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Full Name" error={errors.name?.message}>
            <input className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" {...register("name", { required: "Name is required" })} />
          </FormField>
          <FormField label="Email" error={errors.email?.message}>
            <input type="email" className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" {...register("email", { required: "Email is required" })} />
          </FormField>
          <FormField label="Phone" error={errors.phone?.message}>
            <input className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" {...register("phone", { required: "Phone is required" })} />
          </FormField>
          <FormField label="Program" error={errors.program?.message}>
            <select className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" {...register("program", { required: "Program is required" })}>
              <option value="">Select Program</option>
              <option value="B.Tech CS">B.Tech CS</option>
              <option value="B.Tech Mech">B.Tech Mech</option>
            </select>
          </FormField>
          <FormField label="Category" error={errors.category?.message}>
            <select className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" {...register("category", { required: "Category is required" })}>
              <option value="">Select Category</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </FormField>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border rounded-md hover:bg-muted">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90">Create</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Applicants;
