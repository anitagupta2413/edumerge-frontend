import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useCrudPage, CrudForm, ActionButtons, PageHeader } from "@/components/shared/CrudHelpers";

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
      <PageHeader title="Manage Programs" onAdd={crud.openAdd} />
      <DataTable columns={columns} data={crud.data} actions={(row) => <ActionButtons onEdit={() => crud.openEdit(row)} onDelete={() => crud.remove(row.id)} />} />
      <Modal isOpen={crud.modalOpen} onClose={crud.close} title={crud.editing ? "Edit Program" : "Add Program"}>
        <CrudForm fields={fields} editing={crud.editing} onSave={crud.save} onClose={crud.close} />
      </Modal>
    </DashboardLayout>
  );
};

export default Program;
