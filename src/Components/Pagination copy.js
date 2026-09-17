import { Paginator } from 'primereact/paginator'
import React from 'react'

function Pagination({ first, rows, totalRecords, rowsPerPageOptions, onPageChange }) {
  // PrimeReact expects `first` as an absolute record index.
  // Some parent components treat `first` as a page number; ensure we always pass through event.first/rows.
  const handlePageChange = (event) => {
    onPageChange?.(event);
  };

  return (
    <Paginator
      first={first}
      rows={rows}
      totalRecords={totalRecords}
      rowsPerPageOptions={rowsPerPageOptions}
      onPageChange={handlePageChange}
    />
  )
}


export default Pagination

