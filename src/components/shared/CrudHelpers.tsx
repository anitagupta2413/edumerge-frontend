import { useState } from "react";
import { useForm } from "react-hook-form";
import FormField from "@/components/shared/FormField";
import Modal from "@/components/shared/Modal";
import { generateId } from "@/utils/helpers";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";

// Hook: manages data + inline form/table toggle + delete confirmation
const useCrudPage = (initialData = []) => {
  const [data, setData] = useState(initialData);
  const [view, setView] = useState("table"); // "table" | "form"
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

// Inline form that replaces table view
const CrudForm = ({ fields, editing, onSave, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: editing || {},
  });

  return (
    <div className="bg-card border rounded-lg p-6 max-w-2xl">
      <h3 className="text-base font-semibold mb-4">{editing ? "Edit Record" : "Add New Record"}</h3>
      <form onSubmit={handleSubmit(onSave)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {fields.map((field) => (
            <FormField key={field.name} label={field.label} error={errors[field.name]?.message}>
              {field.type === "select" ? (
                <select
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={field.disabled}
                  {...register(field.name, { required: field.required !== false ? `${field.label} is required` : false })}
                >
                  <option value="">Select {field.label}</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === "multiselect" ? (
                <div className="flex gap-3 flex-wrap">
                  {(field.options || []).map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 text-sm">
                      <input type="checkbox" value={opt} {...register(field.name)} />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type={field.type || "text"}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted disabled:cursor-not-allowed"
                  placeholder={field.placeholder || field.label}
                  disabled={field.disabled}
                  {...register(field.name, { required: field.required !== false ? `${field.label} is required` : false })}
                />
              )}
            </FormField>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border rounded-md hover:bg-muted">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90">
            {editing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Action buttons with edit/delete
const ActionButtons = ({ onEdit, onDelete, onView = null }) => (
  <div className="flex gap-1">
    {onView && (
      <button onClick={onView} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="View">
        <Eye size={14} />
      </button>
    )}
    <button onClick={onEdit} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Edit">
      <Pencil size={14} />
    </button>
    <button onClick={onDelete} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive" title="Delete">
      <Trash2 size={14} />
    </button>
  </div>
);

// Page header with Add New button
const PageHeader = ({ title, onAdd }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-base font-semibold">{title}</h2>
    <button onClick={onAdd} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90">
      <Plus size={16} /> Add New
    </button>
  </div>
);

// Delete confirmation modal
const DeleteConfirmModal = ({ isOpen, onCancel, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onCancel} title="Confirm Delete">
    <p className="text-sm text-muted-foreground mb-4">Are you sure you want to delete this record? This action cannot be undone.</p>
    <div className="flex justify-end gap-2">
      <button onClick={onCancel} className="px-4 py-2 text-sm border rounded-md hover:bg-muted">Cancel</button>
      <button onClick={onConfirm} className="px-4 py-2 text-sm rounded-md bg-destructive text-destructive-foreground hover:opacity-90">Delete</button>
    </div>
  </Modal>
);

export { useCrudPage, CrudForm, ActionButtons, PageHeader, DeleteConfirmModal };
