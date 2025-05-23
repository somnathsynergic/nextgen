import { Paginator } from 'primereact/paginator'
import React from 'react'

function Pagination({first,rows,totalRecords,rowsPerPageOptions,onPageChange}) {
  return (
     <Paginator
              first={first}
              rows={rows}
              totalRecords={totalRecords}
              rowsPerPageOptions={rowsPerPageOptions}
              onPageChange={onPageChange}
            />
  )
}

export default Pagination