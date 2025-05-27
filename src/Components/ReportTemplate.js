import React, { useEffect, useRef, useState } from 'react'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilePdfOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

import { useReactToPrint } from "react-to-print";
import PrintHeader from "../Components/PrintHeader";
import InfoTags from './InfoTags';
function ReportTemplate({ headers, net_tot,
  data, info, flag, wStock, reportHeader, grand_tot }) {
  const [first, setFirst] = useState(0); // Pagination state
  const rowsPerPage = 10;
  console.log(data, info, headers, flag, wStock)
  const dt = useRef(null);
  const contentRef = useRef(null);

  const [isPrinting, setIsPrinting] = useState(true);

  const reactToPrintFn = useReactToPrint({
    contentRef,
  });
  console.log(data)
  const [dataCopy, setDataCopy] = useState([])
  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };
  const serialNumberTemplate = (_, { rowIndex }) => {
    const currentPageIndex = Math.floor(first / rowsPerPage);
    return currentPageIndex * rowsPerPage + rowIndex + 1;
  };
  useEffect(() => {
    setDataCopy(data)
  }, [data])
  function print() {

    var divToPrint = document.getElementById('printablediv');

    var WindowObject = window.open('', 'Print-Window');
    WindowObject.document.open();
    WindowObject.document.writeln('<!DOCTYPE html>');
    WindowObject.document.writeln('<html><head><title></title><style type="text/css">');


    WindowObject.document.writeln('@media print { .center { text-align: center;}' +
      '                                         .inline { display: inline; }' +
      '                                         .underline { text-decoration: underline; }' +
      '                                         .left { margin-left: 315px;} ' +
      '                                         .right { margin-right: 375px; display: inline; }' +
      '                                          table { border-collapse: collapse; font-size: 10px;}' +
      '                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}' +
      '                                           th, td { }' +
      '                                         .border { border: 1px solid black; } ' +
      '                                         .bottom { bottom: 5px; width: 100%; position: fixed ' +
      '                                       ' +
      '                                   } .p-paginator-bottom.p-paginator.p-component { display: none; } .heading{display: flex; flex-direction: column; justify-content: center; align-items: center;font-weight:800;margin-bottom:15px} } </style>');
    WindowObject.document.writeln('</head><body onload="window.print()">');
    WindowObject.document.writeln(divToPrint.innerHTML);
    WindowObject.document.writeln('</body></html>');
    WindowObject.document.close();
    setTimeout(function () {
      WindowObject.close();
    }, 10);

  }
  const footer = `Basic Value=${net_tot}, Grand Total = ${grand_tot}`;
  const setSearch = (e) => {
    console.log(e.target.value, flag)
    if (flag == 1) {
      setDataCopy(data?.filter(item => item.prod_name?.toLowerCase().includes(e.target.value.toLowerCase()) || item.stock?.toString().toLowerCase().includes(e.target.value.toLowerCase())))
    }
    if (flag == 2) {
      setDataCopy(data?.filter(item => item.proj_name?.toLowerCase().includes(e.target.value.toLowerCase()) || item.project_stock?.toString().toLowerCase().includes(e.target.value.toLowerCase()) || item.prod_name?.toString().toLowerCase().includes(e.target.value.toLowerCase())))
    }
    if (flag == 3) {
      setDataCopy(data?.filter(item => item.prod_name?.toLowerCase().includes(e.target.value.toLowerCase()) || item.pur_req?.toString().toLowerCase().includes(e.target.value.toLowerCase()) || item.proj_name?.toString().toLowerCase().includes(e.target.value.toLowerCase()) || item.invoice?.toString().toLowerCase().includes(e.target.value.toLowerCase()) || item.proj_name?.toString().toLowerCase().includes(e.target.value.toLowerCase()) || item.vendor_name?.toString().toLowerCase().includes(e.target.value.toLowerCase()) || item.mrn_no?.toString().toLowerCase().includes(e.target.value.toLowerCase())))
    }
    if (flag == 4) {
      setDataCopy(data?.filter(item => item.prod_name?.toLowerCase().includes(e.target.value.toLowerCase()) || item.mrn_no?.toString().toLowerCase().includes(e.target.value.toLowerCase()) || item.invoice?.toString().toLowerCase().includes(e.target.value.toLowerCase()) || item.invoice_dt?.toString().toLowerCase().includes(e.target.value.toLowerCase())))
    }
    if (flag == 5) {
      setDataCopy(data?.filter(item => item.prod_name?.toLowerCase().includes(e.target.value.toLowerCase()) || item.proj_name?.toString().toLowerCase().includes(e.target.value.toLowerCase()) || item.created_by?.toString().toLowerCase().includes(e.target.value.toLowerCase())))
    }
    if (flag == 6) {
      setDataCopy(data?.filter(item => item.pur_no?.toLowerCase().includes(e.target.value.toLowerCase()) || item.status?.toString().toLowerCase().includes(e.target.value.toLowerCase())))
    }

  }
  return (
    <>
      <div className='float-end flex justify-end gap-2 mb-2'>
        <Tooltip title="Print/Export PDF"> <button className='h-7 w-7 rounded-full bg-red-700 text-white' onClick={() => {
          setIsPrinting(false);

          setTimeout(() => {
            reactToPrintFn();
            setIsPrinting(true);
          }, 5);
        }}><FilePdfOutlined /></button></Tooltip>
      </div>
      <div className="card mt-4">

        <div className='mb-2'>
          <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div class="relative">
            <div class={flag == 2 ? "absolute inset-y-0 start-0 flex items-center ps-3 -mb-5 pointer-events-none" : "absolute inset-y-5 start-0 flex items-center ps-3 pointer-events-none"}>
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-900 focus:border-green-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." onChange={e => setSearch(e)} required />

          </div>
        </div>
        <div ref={contentRef} className={isPrinting ? "w-full" : "w-full p-5"}>
          <div className={isPrinting ? "hidden rounded-md w-full" : "w-full border  border-green-500 rounded-md mb-1"}>
            <PrintHeader />
          </div>
          {reportHeader && !isPrinting && <h2 className='bg-green-500 text-white p-2 w-full my-2'>{reportHeader}</h2>}

          {flag == 2 && <InfoTags color={isPrinting ? "#014737" : '#10b981'} text={'Warehouse quantity of this product: ' + wStock} />}
          <DataTable
            value={dataCopy.filter(item => item?.stock > 0 || item.quantity > 0 || item.qty > 0 || item?.rc_qty || item?.project_stock > 0

            )}
            footer={grand_tot > 0 ? footer : ''}
            showGridlines={true}
            stripedRows
            stickyHeader="true"
            scrollable
            paginator
            rows={isPrinting ? 10 : data?.length}
            rowsPerPageOptions={[5, 10, 25, 50, 100, data?.length]}
            rowClassName="bg-white text-justify text-md text-wrap text-gray-800 border border-b-gray-300 border-r-gray-200 border-l-white active:border-0 hover:text-green-700 hover:duration-500 dark:hover:text-[#1e4834] 
                text-ellipsis overflow-hidden truncate w-2 text-wrap"
            tableStyle={{ minWidth: "100%", fontSize: !isPrinting ? "10px" : "12px" }}
            paginatorTemplate="RowsPerPageDropdown  FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            paginatorClassName={isPrinting ? "bg-white text-emerald-500" : "hidden"}
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            styleclassName="p-datatable-gridlines text-justify hover:duration-500 dark:bg-gray-800 dark:text-gray-300 shadow-lg"
            className="shadow-lg rounded-lg"
            selectionMode="single"
            dataKey="id"
            metaKeySelection={false}
          >
            <Column
              header="#"
              body={serialNumberTemplate}
              style={{ width: '5%' }}
              headerClassName={isPrinting ?
                "text-green-900 bg-[#C4F1BE] border-b-green-900 dark:bg-gray-700 dark:text-white dark:font-bold" :
                "text-white bg-green-500 border-b-green-900 dark:bg-gray-700 dark:text-white dark:font-bold"
              }
            />
            {headers.map((item, index) => (
              <Column
                key={index}
                field={item.name}
                header={item.value}
                headerClassName={isPrinting ?
                  "text-green-900 bg-[#C4F1BE] border-b-green-900 dark:bg-gray-700 dark:text-white dark:font-bold" :
                  "text-white bg-green-500 border-b-green-900 dark:bg-gray-700 dark:text-white dark:font-bold"
                }

                style={{ width: "10%" }}
              ></Column>

            ))}

          </DataTable>
        </div>


     
      </div>
    </>
  )
}

export default ReportTemplate
