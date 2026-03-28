const DataTable = ({ columns, data, actions = null }) => {
  return (
    <div className="border rounded-md overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-3 font-medium text-muted-foreground">
                  {col.label}
                </th>
              ))}
              {actions && <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-8 text-center text-muted-foreground">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id || i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3">{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
