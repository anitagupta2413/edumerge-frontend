import { useState } from "react";
import { useForm } from "react-hook-form";
import FormField from "@/components/shared/FormField";
import Modal from "@/components/shared/Modal";
import { generateId } from "@/utils/helpers";
import { Pencil, Trash2, Plus, Eye, ArrowLeft } from "lucide-react";

const useCrudPage = (initialData = []) => {
  const [data, setData] = useState(initialData);
  const [view, setView] = useState("table");
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const openAdd = () => { setEditing(null); setView("form"); };
  const openEdit = (item) => { setEditing(item); setView("form"); };
  const backToTable = () => { setView("table"); setEditing(null); };

  const save = (formData) => {
    if (editing) {
      setData(data.map((d) => (d.id === editing.id ? { ...d, ...formData } : d)));
    } else {
      setData([...data, { id: generateId(), ...formData }]);
    }
    backToTable();
  };

  const confirmDelete = (id) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);
  const executeDelete = () => {
    setData(data.filter((d) => d.id !== deleteId));
    setDeleteId(null);
  };

  return { data, view, editing, deleteId, openAdd, openEdit, backToTable, save, confirmDelete, cancelDelete, executeDelete };
};

const inputClass = "w-full px-3 py-2.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";
const inputDisabledClass = `${inputClass} disabled:bg-muted disabled:cursor-not-allowed`;

const CrudForm = ({ fields, editing, onSave, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: editing || {},
  });

  return (
    <div className="bg-card border rounded-xl p-6 max-w-2xl card-shadow">
      <div className="flex items-center gap-3 mb-5">
        <button type="button" onClick={onCancel} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft size={18} />
        </button>
        <h3 className="text-base font-semibold">{editing ? "Edit Record" : "Add New Record"}</h3>
      </div>
      <form onSubmit={handleSubmit(onSave)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          {fields.map((field) => (
            <FormField key={field.name} label={field.label} error={errors[field.name]?.message}>
              {field.type === "select" ? (
                <select
                  className={inputClass}
                  disabled={field.disabled}
                  {...register(field.name, { required: field.required !== false ? `${field.label} is required` : false })}
                >
                  <option value="">Select {field.label}</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === "multiselect" ? (
                <div className="flex gap-4 flex-wrap py-1">
                  {(field.options || []).map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" value={opt} className="rounded border-border" {...register(field.name)} />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type={field.type || "text"}
                  className={inputDisabledClass}
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  disabled={field.disabled}
                  {...register(field.name, { required: field.required !== false ? `${field.label} is required` : false })}
                />
              )}
            </FormField>
          ))}
        </div>
        <div className="flex justify-end gap-2.5 mt-2 pt-4 border-t">
          <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            {editing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

const ActionButtons = ({ onEdit, onDelete, onView = null }) => (
  <div className="flex gap-0.5">
    {onView && (
      <button onClick={onView} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="View">
        <Eye size={15} />
      </button>
    )}
    <button onClick={onEdit} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
      <Pencil size={15} />
    </button>
    <button onClick={onDelete} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
      <Trash2 size={15} />
    </button>
  </div>
);

const PageHeader = ({ title, onAdd }) => (
  <div className="flex items-center justify-between mb-5">
    <h2 className="text-lg font-semibold">{title}</h2>
    <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
      <Plus size={16} /> Add New
    </button>
  </div>
);

const DeleteConfirmModal = ({ isOpen, onCancel, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onCancel} title="Confirm Delete">
    <p className="text-sm text-muted-foreground mb-5">Are you sure you want to delete this record? This action cannot be undone.</p>
    <div className="flex justify-end gap-2.5">
      <button onClick={onCancel} className="px-4 py-2.5 text-sm font-medium border rounded-lg hover:bg-muted transition-colors">Cancel</button>
      <button onClick={onConfirm} className="px-4 py-2.5 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity">Delete</button>
    </div>
  </Modal>
);

export { useCrudPage, CrudForm, ActionButtons, PageHeader, DeleteConfirmModal };
