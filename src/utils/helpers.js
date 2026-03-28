export const getStatusColor = (status) => {
  const colors = {
    New: "bg-blue-100 text-blue-700",
    Allocated: "bg-amber-100 text-amber-700",
    Confirmed: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Paid: "bg-emerald-100 text-emerald-700",
  };
  return colors[status] || "bg-muted text-muted-foreground";
};

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
