import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { useCrudPage, CrudForm, ActionButtons, PageHeader, DeleteConfirmModal } from "@/components/shared/CrudHelpers";

const columns = [
  { key: "name", label: "Campus Name" },
  { key: "code", label: "Campus Code" },
  { key: "location", label: "Location" },
];

const initialData = [
  { id: "1", name: "Main Campus", code: "MC001", location: "Downtown" },
  { id: "2", name: "North Campus", code: "NC002", location: "Uptown" },
];

const Campus = () => {
  const crud = useCrudPage(initialData);

  const fields = [
    { name: "name", label: "Campus Name" },
    { name: "code", label: "Campus Code", disabled: !!crud.editing },
    { name: "location", label: "Campus Location" },
  ];

  return (
    <DashboardLayout title="Campus">
      {crud.view === "form" ? (
        <>
          <h2 className="text-base font-semibold mb-4">{crud.editing ? "Edit Campus" : "Add Campus"}</h2>
          <CrudForm fields={fields} editing={crud.editing} onSave={crud.save} onCancel={crud.backToTable} />
        </>
      ) : (
        <>
          <PageHeader title="Manage Campuses" onAdd={crud.openAdd} />
          <DataTable
            columns={columns}
            data={crud.data}
            searchKeys={["name", "code", "location"]}
            actions={(row) => (
              <ActionButtons
                onEdit={() => crud.openEdit(row)}
                onDelete={() => crud.confirmDelete(row.id)}
              />
            )}
          />
        </>
      )}
      <DeleteConfirmModal isOpen={!!crud.deleteId} onCancel={crud.cancelDelete} onConfirm={crud.executeDelete} />
    </DashboardLayout>
  );
};

export default Campus;
