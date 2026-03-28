import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { useCrudPage, CrudForm, ActionButtons, PageHeader, DeleteConfirmModal } from "@/components/shared/CrudHelpers";

const columns = [
  { key: "name", label: "Department" },
  { key: "campus", label: "Campus" },
  { key: "hod", label: "HOD" },
];

const fields = [
  { name: "name", label: "Department Name" },
  { name: "campus", label: "Campus", type: "select", options: ["Main Campus", "North Campus"] },
  { name: "hod", label: "HOD Name" },
];

const initialData = [
  { id: "1", name: "Computer Science", campus: "Main Campus", hod: "Dr. Smith" },
  { id: "2", name: "Mechanical Eng.", campus: "North Campus", hod: "Dr. Johnson" },
];

const Department = () => {
  const crud = useCrudPage(initialData);
  return (
    <DashboardLayout title="Departments">
      {crud.view === "form" ? (
        <>
          <h2 className="text-base font-semibold mb-4">{crud.editing ? "Edit Department" : "Add Department"}</h2>
          <CrudForm fields={fields} editing={crud.editing} onSave={crud.save} onCancel={crud.backToTable} />
        </>
      ) : (
        <>
          <PageHeader title="Manage Departments" onAdd={crud.openAdd} />
          <DataTable
            columns={columns}
            data={crud.data}
            searchKeys={["name", "campus", "hod"]}
            actions={(row) => (
              <ActionButtons onEdit={() => crud.openEdit(row)} onDelete={() => crud.confirmDelete(row.id)} />
            )}
          />
        </>
      )}
      <DeleteConfirmModal isOpen={!!crud.deleteId} onCancel={crud.cancelDelete} onConfirm={crud.executeDelete} />
    </DashboardLayout>
  );
};

export default Department;
