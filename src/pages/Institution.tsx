import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useCrudPage, CrudForm, ActionButtons, PageHeader } from "@/components/shared/CrudHelpers";

const columns = [
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "address", label: "Address" },
];

const fields = [
  { name: "name", label: "Institution Name" },
  { name: "code", label: "Code" },
  { name: "address", label: "Address" },
];

const initialData = [
  { id: "1", name: "State University", code: "SU001", address: "Main Street, City" },
  { id: "2", name: "Technical Institute", code: "TI002", address: "Tech Park, Town" },
];

const Institution = () => {
  const crud = useCrudPage(initialData);

  return (
    <DashboardLayout title="Institutions">
      <PageHeader title="Manage Institutions" onAdd={crud.openAdd} />
      <DataTable
        columns={columns}
        data={crud.data}
        actions={(row) => <ActionButtons onEdit={() => crud.openEdit(row)} onDelete={() => crud.remove(row.id)} />}
      />
      <Modal isOpen={crud.modalOpen} onClose={crud.close} title={crud.editing ? "Edit Institution" : "Add Institution"}>
        <CrudForm fields={fields} editing={crud.editing} onSave={crud.save} onClose={crud.close} />
      </Modal>
    </DashboardLayout>
  );
};

export default Institution;
