import { Card } from "../Card";
import { TrashIcon, EditIcon, LoadingSpinner } from "../SVGs";

interface ColumnConfig {
  key: string; // matches your Product interface properties
  displayName: string; // what you want to show in the header
}

interface CustomTableProps {
  columns: ColumnConfig[];
  data: Record<string, any>[];
  loading: boolean;
  onDelete: (id: string | number) => void;
  onEdit: (id: string | number) => void;
}

export const CustomTable = ({
  columns,
  data,
  loading,
  onDelete,
  onEdit,
}: CustomTableProps) => {
  const handleEdit = (id: string | number) => {
    onEdit(id);
  };

  const handleDelete = (id: string | number) => {
    onDelete(id);
  };

  return (
    <>
      <Card>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {data.length === 0 ? (
              <p className="text-center mt-3 text-primary bolder">
                No data available :/
              </p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index}>{column.displayName}</th>
                    ))}
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex}>{row[column.key]}</td>
                      ))}
                      <td className="text-end">
                        <div
                          className="btn-group"
                          role="group"
                          aria-label="Basic mixed styles example"
                        >
                          <button
                            onClick={() => handleEdit(row.id)}
                            type="button"
                            className="btn btn-warning"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            type="button"
                            className="btn btn-danger"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </Card>
    </>
  );
};
