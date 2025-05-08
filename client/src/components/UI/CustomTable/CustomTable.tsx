import { CustomCard } from "../CustomCard";
import {
  TrashIcon,
  EditIcon,
  LoadingSpinner,
  PlusIcon,
  Alert,
} from "../../../assets";

import { CustomTableProps } from "../../../types";

export const CustomTable = ({
  columns,
  data,
  loading,
  entityName,
  title,
  messages = [],
  onDelete,
  onEdit,
  onCreate,
  onCloseMessage,
}: CustomTableProps) => {
  //okay so what these functions do [handleEdit(), handleCreate() and handleDelete()]is that they get call the custom implementations of onEdit(id) and onDelete(id) that is passed to them, whenever edit or delete button is clicked
  const handleEdit = (id: string | number) => onEdit(id);
  const handleDelete = (id: string | number) => onDelete(id);
  const handleCreate = () => onCreate();

  return (
    <>
      {/* Table Title and create button */}
      <div className="d-flex align-items-center justify-content-between mx-3 mt-3">
        <h1 className="ml-auto color-1 fw-bold">{title}</h1>
        <button
          className="btn background-1 color-white mt-3 mb-2"
          onClick={() => handleCreate()}
          aria-label={`Create ${entityName}`}
        >
          <PlusIcon /> {`Add new ${entityName || "item"}`}
        </button>
      </div>

      {/* Table */}
      <CustomCard className="m-3 overflow-auto">
        {loading ? ( // conditional display, if loading is set to true show the spinner!
          <LoadingSpinner />
        ) : (
          <>
            {data.length === 0 ? ( // If the fetch request(?) returns nothing display this message (look into custom mesage here)
              <p className="text-center mt-3 color-2 fs-1">
                {`No data available :(`}
              </p>
            ) : (
              <table className="table">
                {/* Columns */}
                <thead>
                  <tr>
                    {/* Checkout the built in .map() function docs if you want to better understand this, but index is just the coulmns index nr inside the columns array ...if that makes sense */}
                    {columns.map((column) => (
                      <th className="color-2 fs-5" key={column.key}>
                        {column.displayName}
                      </th>
                    ))}
                    <th className="text-end color-1 fs-4">Actions</th>
                  </tr>
                </thead>
                {/* Record Data */}
                <tbody>
                  {/* Data[] gets spit into rows */}
                  {data.map((row) => (
                    <tr key={row.id}>
                      {/* Each row is a record */}
                      {columns.map((column) => (
                        // that rows data gets mapped into the repective column via this:
                        <td key={`${row.id}-${column.key}`}>
                          {row[column.key]}
                        </td>
                      ))}
                      {/* Action buttons for every record */}
                      <td className="text-end">
                        <div className="btn-group" role="group">
                          <button
                            onClick={() => handleEdit(row.id)}
                            type="button"
                            className="btn btn-warning"
                            aria-label={`Edit ${entityName}`}
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            type="button"
                            className="btn btn-danger"
                            aria-label={`Delete ${entityName}`}
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
      </CustomCard>
      {/* Messages */}
      {messages.map((message, index) => (
        <Alert
          key={`alert-${index}`}
          show={message.show}
          type={message.type}
          onClose={() => onCloseMessage?.(index)}
          autoCloseDelay={message.autoCloseDelay}
        >
          {message.title && <h4 className="alert-heading">{message.title}</h4>}
          <div>{message.content}</div>
        </Alert>
      ))}
    </>
  );
};
