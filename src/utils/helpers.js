export const getStatusColor = (status) => {
  const colors = {
    New: "bg-muted text-muted-foreground",
    Allocated: "bg-primary/10 text-primary",
    Confirmed: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Paid: "bg-emerald-50 text-emerald-700",
    Verified: "bg-emerald-50 text-emerald-700",
    Submitted: "bg-primary/10 text-primary",
  };
  return colors[status] || "bg-muted text-muted-foreground";
};

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const confirmationLabel = (confirmed) => confirmed ? "Confirmed" : "Pending";

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
