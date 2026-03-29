import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/components/shared/DataTable";
import { useCrudPage, CrudForm, ActionButtons, PageHeader, DeleteConfirmModal } from "@/components/shared/CrudHelpers";
import api from "@/lib/api";
import { departmentSchema } from "@/lib/validations";

const columns = [
  { key: "name", label: "Department" },
  { key: "campusName", label: "Campus" },
  { key: "hod", label: "HOD" },
];

const Department = () => {
  const crud = useCrudPage("/departments");
  const [campuses, setCampuses] = useState([]);

  const fetchCampuses = async () => {
    if (campuses.length > 0) return;
    try {
      const res = await api.get("/campuses");
      setCampuses(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    await fetchCampuses();
    crud.openAdd();
  };

  const handleEdit = async (item) => {
    await fetchCampuses();
    crud.openEdit(item);
  };

  const fields = [
    { name: "name", label: "Department Name" },
    { name: "code", label: "Department Code" },
    {
      name: "campusId",
      label: "Campus",
      type: "select",
      options: campuses.map(c => ({ label: c.name, value: c.id }))
    },
    { name: "hod", label: "HOD Name" },
  ];

  // Data mapping is now simpler because backend provides the Campus object
  const displayData = crud.data.map(d => ({
    ...d,
    campusName: d.Campus?.name || '—'
  }));

  return (
    <DashboardLayout title="Departments">
      {crud.view === "form" ? (
        <>
          <h2 className="text-base font-semibold mb-4">{crud.editing ? "Edit Department" : "Add Department"}</h2>
          <CrudForm fields={fields} editing={crud.editing} onSave={crud.save} onCancel={crud.backToTable} validationSchema={departmentSchema} />
        </>
      ) : (
        <>
          <PageHeader title="" onAdd={handleAdd} module="departments" />
          <DataTable
            columns={columns}
            data={displayData}
            searchKeys={["name", "campusName", "hod"]}
            actions={(row) => (
              <ActionButtons
                onEdit={() => handleEdit(row)}
                onDelete={() => crud.confirmDelete(row.id)}
                module="departments"
              />
            )}
          />
        </>
      )}
      <DeleteConfirmModal isOpen={!!crud.deleteId} onCancel={crud.cancelDelete} onConfirm={crud.executeDelete} />
    </DashboardLayout>
  );
};

export default Department;
