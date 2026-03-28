import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { useCrudPage, CrudForm, ActionButtons, PageHeader, DeleteConfirmModal } from "@/components/shared/CrudHelpers";

const columns = [
  { key: "name", label: "Program" },
  { key: "department", label: "Department" },
  { key: "duration", label: "Duration" },
  { key: "seats", label: "Total Seats" },
];

const fields = [
  { name: "name", label: "Program Name" },
  { name: "department", label: "Department", type: "select", options: ["Computer Science", "Mechanical Eng."] },
  { name: "duration", label: "Duration (e.g., 4 Years)" },
  { name: "seats", label: "Total Seats", type: "number" },
];

const initialData = [
  { id: "1", name: "B.Tech CS", department: "Computer Science", duration: "4 Years", seats: 120 },
  { id: "2", name: "B.Tech Mech", department: "Mechanical Eng.", duration: "4 Years", seats: 90 },
];

const Program = () => {
  const crud = useCrudPage(initialData);
  return (
    <DashboardLayout title="Programs">
      {crud.view === "form" ? (
        <>
          <h2 className="text-base font-semibold mb-4">{crud.editing ? "Edit Program" : "Add Program"}</h2>
          <CrudForm fields={fields} editing={crud.editing} onSave={crud.save} onCancel={crud.backToTable} />
        </>
      ) : (
        <>
          <PageHeader title="Manage Programs" onAdd={crud.openAdd} />
          <DataTable
            columns={columns}
            data={crud.data}
            searchKeys={["name", "department"]}
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

export default Program;
