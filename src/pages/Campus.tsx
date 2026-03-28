import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useCrudPage, CrudForm, ActionButtons, PageHeader } from "@/components/shared/CrudHelpers";

const columns = [
  { key: "name", label: "Campus Name" },
  { key: "institution", label: "Institution" },
  { key: "location", label: "Location" },
];

const fields = [
  { name: "name", label: "Campus Name" },
  { name: "institution", label: "Institution", type: "select", options: ["State University", "Technical Institute"] },
  { name: "location", label: "Location" },
];

const initialData = [
  { id: "1", name: "Main Campus", institution: "State University", location: "Downtown" },
  { id: "2", name: "North Campus", institution: "Technical Institute", location: "Uptown" },
];

const Campus = () => {
  const crud = useCrudPage(initialData);
  return (
    <DashboardLayout title="Campus">
      <PageHeader title="Manage Campuses" onAdd={crud.openAdd} />
      <DataTable columns={columns} data={crud.data} actions={(row) => <ActionButtons onEdit={() => crud.openEdit(row)} onDelete={() => crud.remove(row.id)} />} />
      <Modal isOpen={crud.modalOpen} onClose={crud.close} title={crud.editing ? "Edit Campus" : "Add Campus"}>
        <CrudForm fields={fields} editing={crud.editing} onSave={crud.save} onClose={crud.close} />
      </Modal>
    </DashboardLayout>
  );
};

export default Campus;
