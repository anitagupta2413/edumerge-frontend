const FormField = ({ label, error, children }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1.5 text-foreground">{label}</label>}
      {children}
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
