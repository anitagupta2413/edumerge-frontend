import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { useCrudPage, CrudForm, ActionButtons, PageHeader, DeleteConfirmModal } from "@/components/shared/CrudHelpers";
import { campusSchema } from "@/lib/validations";

const columns = [
  { key: "name", label: "Campus Name" },
  { key: "institutionName", label: "Institution" },
  { key: "code", label: "Campus Code" },
  { key: "location", label: "Location" },
];

const Campus = () => {
  const crud = useCrudPage("/campuses");

  const fields = [
    { name: "name", label: "Campus Name" },
    { name: "code", label: "Campus Code", disabled: !!crud.editing },
    { name: "location", label: "Campus Location" },
  ];

  const mappedData = crud.data.map(c => ({
    ...c,
    institutionName: c.Institution?.name || 'Unknown'
  }));

  return (
    <DashboardLayout title="Campus">
      {crud.view === "form" ? (
        <>
          <h2 className="text-base font-semibold mb-4">{crud.editing ? "Edit Campus" : "Add Campus"}</h2>
          <CrudForm fields={fields} editing={crud.editing} onSave={crud.save} onCancel={crud.backToTable} validationSchema={campusSchema} />
        </>
      ) : (
        <>
          <PageHeader title="" needTitle={false} onAdd={crud.openAdd} module="campuses" />
          <DataTable
            columns={columns}
            data={mappedData}
            searchKeys={["name", "institutionName", "code", "location"]}
            actions={(row) => (
              <ActionButtons
                onEdit={() => crud.openEdit(row)}
                onDelete={() => crud.confirmDelete(row.id)}
                module="campuses"
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
