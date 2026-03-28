import { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/shared/FormField";
import { generateId } from "@/utils/helpers";
import { Pencil, Trash2, Plus } from "lucide-react";

const useCrudPage = (initialData = []) => {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); setModalOpen(true); };
  const close = () => { setModalOpen(false); setEditing(null); };

  const save = (formData) => {
    if (editing) {
      setData(data.map((d) => (d.id === editing.id ? { ...d, ...formData } : d)));
    } else {
      setData([...data, { id: generateId(), ...formData }]);
    }
    close();
  };

  const remove = (id) => setData(data.filter((d) => d.id !== id));

  return { data, modalOpen, editing, openAdd, openEdit, close, save, remove };
};

const CrudForm = ({ fields, editing, onSave, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: editing || {},
  });

  return (
    <form onSubmit={handleSubmit(onSave)}>
      {fields.map((field) => (
        <FormField key={field.name} label={field.label} error={errors[field.name]?.message}>
          {field.type === "select" ? (
            <select
              className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              {...register(field.name, { required: `${field.label} is required` })}
            >
              <option value="">Select {field.label}</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || "text"}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={field.placeholder || field.label}
              {...register(field.name, { required: `${field.label} is required` })}
            />
          )}
        </FormField>
      ))}
      <div className="flex justify-end gap-2 mt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded-md hover:bg-muted">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90">
          {editing ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

const ActionButtons = ({ onEdit, onDelete }) => (
  <div className="flex gap-1">
    <button onClick={onEdit} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
      <Pencil size={14} />
    </button>
    <button onClick={onDelete} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
      <Trash2 size={14} />
    </button>
  </div>
);

const PageHeader = ({ title, onAdd }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-base font-semibold">{title}</h2>
    <button onClick={onAdd} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90">
      <Plus size={16} /> Add New
    </button>
  </div>
);

export { useCrudPage, CrudForm, ActionButtons, PageHeader };
