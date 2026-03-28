import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useCrudPage, CrudForm, ActionButtons, PageHeader } from "@/components/shared/CrudHelpers";

const columns = [
  { key: "program", label: "Program" },
  { key: "category", label: "Category" },
  { key: "totalSeats", label: "Total" },
  { key: "filledSeats", label: "Filled" },
  { key: "remaining", label: "Remaining", render: (_, row) => row.totalSeats - row.filledSeats },
];

const fields = [
  { name: "program", label: "Program", type: "select", options: ["B.Tech CS", "B.Tech Mech"] },
  { name: "category", label: "Category", type: "select", options: ["General", "OBC", "SC", "ST", "EWS"] },
  { name: "totalSeats", label: "Total Seats", type: "number" },
  { name: "filledSeats", label: "Filled Seats", type: "number" },
];

const initialData = [
  { id: "1", program: "B.Tech CS", category: "General", totalSeats: 60, filledSeats: 45 },
  { id: "2", program: "B.Tech CS", category: "OBC", totalSeats: 30, filledSeats: 22 },
  { id: "3", program: "B.Tech Mech", category: "General", totalSeats: 50, filledSeats: 30 },
];

const Quota = () => {
  const crud = useCrudPage(initialData);
  return (
    <DashboardLayout title="Seat Matrix / Quota">
      <PageHeader title="Manage Quotas" onAdd={crud.openAdd} />
      <DataTable columns={columns} data={crud.data} actions={(row) => <ActionButtons onEdit={() => crud.openEdit(row)} onDelete={() => crud.remove(row.id)} />} />
      <Modal isOpen={crud.modalOpen} onClose={crud.close} title={crud.editing ? "Edit Quota" : "Add Quota"}>
        <CrudForm fields={fields} editing={crud.editing} onSave={crud.save} onClose={crud.close} />
      </Modal>
    </DashboardLayout>
  );
};

export default Quota;
