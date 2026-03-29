import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { useCrudPage, CrudForm, ActionButtons, PageHeader, DeleteConfirmModal } from "@/components/shared/CrudHelpers";
import api from "@/lib/api";
import { programSchema } from "@/lib/validations";

const columns = [
  { key: "name", label: "Program" },
  { key: "departmentName", label: "Department" },
  { key: "courseType", label: "Type" },
  { key: "duration", label: "Duration" },
  { key: "totalIntake", label: "Total Seats" },
];

const Program = () => {
  const crud = useCrudPage("/programs");
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    if (departments.length > 0) return;
    try {
      const res = await api.get("/departments");
      setDepartments(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    await fetchDepartments();
    crud.openAdd();
  };

  const handleEdit = async (item) => {
    await fetchDepartments();
    crud.openEdit(item);
  };

  const fields = [
    { name: "name", label: "Program Name" },
    { name: "code", label: "Program Code" },
    {
      name: "departmentId",
      label: "Department",
      type: "select",
      options: departments.map(d => ({ label: d.name, value: d.id }))
    },
    {
      name: "courseType",
      label: "Course Type",
      type: "select",
      options: ["UG", "PG"]
    },
    { name: "duration", label: "Duration (e.g., 4 Years)" },
    { name: "totalIntake", label: "Total Seats", type: "number" },
  ];

  const displayData = crud.data.map(p => ({
    ...p,
    departmentName: p.Department?.name || '—'
  }));

  return (
    <DashboardLayout title="Programs">
      {crud.view === "form" ? (
        <>
          <h2 className="text-base font-semibold mb-4">{crud.editing ? "Edit Program" : "Add Program"}</h2>
          <CrudForm fields={fields} editing={crud.editing} onSave={crud.save} onCancel={crud.backToTable} validationSchema={programSchema} />
        </>
      ) : (
        <>
          <PageHeader title="" onAdd={handleAdd} module="programs" />
          <DataTable
            columns={columns}
            data={displayData}
            searchKeys={["name", "departmentName", "courseType"]}
            actions={(row) => (
              <ActionButtons
                onEdit={() => handleEdit(row)}
                onDelete={() => crud.confirmDelete(row.id)}
                module="programs"
              />
            )}
          />
        </>
      )}
      <DeleteConfirmModal isOpen={!!crud.deleteId} onCancel={crud.cancelDelete} onConfirm={crud.executeDelete} />
    </DashboardLayout>
  );
};

export default Program;
