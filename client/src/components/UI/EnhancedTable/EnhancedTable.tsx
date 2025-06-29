import React, { useState, useMemo } from 'react';
import { Table, Pagination, Form, Row, Col, Button, InputGroup, Dropdown } from 'react-bootstrap';
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import './EnhancedTable.module.css';

export interface TableColumn<T> {
  key: keyof T | string;
  displayName: string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
  transform?: (row: T) => any;
  filterOptions?: { value: string; label: string }[];
}

export interface EnhancedTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  itemsPerPage?: number;
  searchable?: boolean;
  sortable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  className?: string;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  showFilters?: boolean;
}

export function EnhancedTable<T extends Record<string, any>>({
  data,
  columns,
  itemsPerPage = 10,
  searchable = true,
  sortable = true,
  loading = false,
  emptyMessage = "No data found",
  emptyIcon,
  className = "",
  onRowClick,
  actions,
  showFilters = true
}: EnhancedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filter data based on search term and column filters
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(row => {
        return columns.some(column => {
          if (!column.searchable) return false;
          
          const value = column.transform ? column.transform(row) : row[column.key];
          if (value == null) return false;
          
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }

    // Apply column filters
    Object.entries(filters).forEach(([key, filterValue]) => {
      if (filterValue) {
        filtered = filtered.filter(row => {
          const column = columns.find(col => String(col.key) === key);
          if (!column) return true;
          
          const value = column.transform ? column.transform(row) : row[column.key];
          if (value == null) return false;
          
          return String(value).toLowerCase() === filterValue.toLowerCase();
        });
      }
    });

    return filtered;
  }, [data, searchTerm, filters, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = columns.find(col => col.key === sortConfig.key)?.transform?.(a) ?? a[sortConfig.key];
      const bValue = columns.find(col => col.key === sortConfig.key)?.transform?.(b) ?? b[sortConfig.key];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortConfig.direction === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredData, sortConfig, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  // Calculate pagination info
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, sortedData.length);

  // Handle sorting
  const handleSort = (key: keyof T | string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (current?.key === key) {
        if (current.direction === 'asc') {
          return { key, direction: 'desc' as const };
        } else {
          return null; // Remove sorting
        }
      } else {
        return { key, direction: 'asc' as const };
      }
    });
  };

  // Get sort icon
  const getSortIcon = (key: keyof T | string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort className="text-muted" />;
    }
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSortConfig(null);
  };

  // Get active filters count
  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0) + (sortConfig ? 1 : 0);

  // Reset to first page when search or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortConfig]);

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`enhanced-table ${className}`}>
      {/* Search and Controls */}
      <Row className="mb-3">
        {searchable && (
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
        )}
        <Col md={searchable ? 6 : 12} className="text-end">
          <div className="d-flex justify-content-end align-items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={clearAllFilters}
                className="d-flex align-items-center gap-1"
              >
                <FaTimes />
                Clear Filters ({activeFiltersCount})
              </Button>
            )}
            <small className="text-muted">
              Showing {startItem}-{endItem} of {sortedData.length} items
            </small>
          </div>
        </Col>
      </Row>

      {/* Column Filters */}
      {showFilters && (
        <Row className="mb-3">
          {columns.map((column) => {
            if (!column.filterOptions) return null;
            
            return (
              <Col key={String(column.key)} md={3} className="mb-2">
                <Form.Group>
                  <Form.Label className="small text-muted mb-1">
                    Filter {column.displayName}
                  </Form.Label>
                  <Form.Select
                    size="sm"
                    value={filters[String(column.key)] || ''}
                    onChange={(e) => handleFilterChange(String(column.key), e.target.value)}
                  >
                    <option value="">All {column.displayName}</option>
                    {column.filterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Table */}
      {sortedData.length === 0 ? (
        <div className="text-center p-5">
          {emptyIcon && <div className="mb-3">{emptyIcon}</div>}
          <h5 className="text-muted">{emptyMessage}</h5>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th 
                    key={String(column.key)}
                    style={{ width: column.width }}
                    className={column.sortable ? 'cursor-pointer' : ''}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span>{column.displayName}</span>
                      {column.sortable && (
                        <span className="ms-2">
                          {getSortIcon(column.key)}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {actions && <th style={{ width: '120px' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr 
                  key={index}
                  className={onRowClick ? 'cursor-pointer' : ''}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={String(column.key)}>
                      {column.render 
                        ? column.render(column.transform ? column.transform(row) : row[column.key], row)
                        : column.transform 
                          ? column.transform(row)
                          : String(row[column.key] ?? '')
                      }
                    </td>
                  ))}
                  {actions && (
                    <td onClick={(e) => e.stopPropagation()}>
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                <small className="text-muted">
                  Page {currentPage} of {totalPages}
                </small>
              </div>
              <Pagination style={{
                '--bs-pagination-hover-bg': '#81B214',
                '--bs-pagination-hover-border-color': '#81B214',
                '--bs-pagination-hover-color': 'white',
                '--bs-pagination-active-bg': '#206A5D',
                '--bs-pagination-active-border-color': '#206A5D',
                '--bs-pagination-active-color': 'white',
                '--bs-pagination-color': '#81B214',
                '--bs-pagination-bg': 'white',
              } as React.CSSProperties}>
                <Pagination.First 
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Pagination.Item
                      key={pageNum}
                      active={pageNum === currentPage}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Item>
                  );
                })}
                
                <Pagination.Next 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last 
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
} 