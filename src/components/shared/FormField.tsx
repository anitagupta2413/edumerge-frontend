const FormField = ({ label, error, children }) => {
  return (
    <div className="mb-5">
      {label && <label className="block text-sm font-medium mb-1.5 text-foreground">{label}</label>}
      {children}
      {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
    </div>
  );
};

FormField.defaultProps = {
  error: null,
  label: null,
};

export default FormField;
