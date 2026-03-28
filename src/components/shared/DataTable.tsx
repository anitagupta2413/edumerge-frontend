import { useState, useMemo } from "react";
import { Search } from "lucide-react";

const ROWS_PER_PAGE = 8;

const DataTable = ({ columns, data, actions = null, searchKeys = [] }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search.trim() || searchKeys.length === 0) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => String(row[key] || "").toLowerCase().includes(q))
    );
  }, [data, search, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  return (
    <div className="space-y-3">
      {searchKeys.length > 0 && (
        <div className="relative max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
        </div>
      )}

      <div className="border rounded-lg overflow-hidden bg-card card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/60">
                {columns.map((col) => (
                  <th key={col.key} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    {col.label}
                  </th>
                ))}
                {actions && <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-10 text-center text-muted-foreground">
                    No records found
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr key={row.id || i} className={`border-b last:border-0 transition-colors hover:bg-primary/[0.03] ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
          <span>Showing {page * ROWS_PER_PAGE + 1}–{Math.min((page + 1) * ROWS_PER_PAGE, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 border rounded-lg text-xs font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 border rounded-lg text-xs font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
