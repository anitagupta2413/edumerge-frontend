import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useCrudPage, CrudForm, ActionButtons, PageHeader } from "@/components/shared/CrudHelpers";

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
      <PageHeader title="Manage Departments" onAdd={crud.openAdd} />
      <DataTable columns={columns} data={crud.data} actions={(row) => <ActionButtons onEdit={() => crud.openEdit(row)} onDelete={() => crud.remove(row.id)} />} />
      <Modal isOpen={crud.modalOpen} onClose={crud.close} title={crud.editing ? "Edit Department" : "Add Department"}>
        <CrudForm fields={fields} editing={crud.editing} onSave={crud.save} onClose={crud.close} />
      </Modal>
    </DashboardLayout>
  );
};

export default Department;
