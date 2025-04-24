import React, { useEffect, useRef, useState } from 'react'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FileExcelOutlined, FilePdfFilled, FilePdfOutlined } from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import { Descriptions } from "antd";
import { useReactToPrint } from "react-to-print";
import PrintHeader from "../Components/PrintHeader";
function ReportTemplate( {headers,
    data,info,flag,wStock}) {
      console.log(data,info,headers,flag,wStock)
        const dt = useRef(null);
            const contentRef = useRef(null);
        
        const [isPrinting, setIsPrinting] = useState(true);
        
          const reactToPrintFn = useReactToPrint({
            contentRef,
          });
        console.log(data)
        const [dataCopy,setDataCopy] = useState([])
        const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };
   useEffect(()=>{
    setDataCopy(data)
   },[data])
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
      const setSearch = (e)=>{
          if(flag==1){
            setDataCopy(data?.filter(item=>item.prod_name?.toLowerCase().includes(e.target.value.toLowerCase())||item.stock?.toString().toLowerCase().includes(e.target.value.toLowerCase())))
          }
          if(flag==2){
            setDataCopy(data?.filter(item=>item.proj_name?.toLowerCase().includes(e.target.value.toLowerCase())||item.project_stock?.toString().toLowerCase().includes(e.target.value.toLowerCase()) ||item.prod_name?.toString().toLowerCase().includes(e.target.value.toLowerCase())))
            if(flag==3){
              setDataCopy(data?.filter(item=>item.prod_name?.toLowerCase().includes(e.target.value.toLowerCase())||item.pur_req?.toString().toLowerCase().includes(e.target.value.toLowerCase()) ||item.pur_req?.toString().toLowerCase().includes(e.target.value.toLowerCase()) || item.invoice?.toString().toLowerCase().includes(e.target.value.toLowerCase())))
            }
          }
      }
  return (
    <>
    <div className='float-end flex justify-end gap-2 mb-2'>
       {/* <Tooltip title="Export CSV"> <button className='h-7 w-7 rounded-full bg-green-700 text-white' onClick={()=>exportCSV(false)}><FileExcelOutlined/></button></Tooltip> */}
       <Tooltip title="Print/Export PDF"> <button className='h-7 w-7 rounded-full bg-red-700 text-white' onClick={() => {
              setIsPrinting(false);

              setTimeout(() => {
                reactToPrintFn();
                setIsPrinting(true);
              }, 5);
            }}><FilePdfOutlined/></button></Tooltip>
    </div>
    <div className="card mt-4">
       
<div className='mb-2'>
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <div class={flag==2?"absolute inset-y-0 start-0 flex items-center ps-3 -mb-5 pointer-events-none":"absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"}>
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-900 focus:border-green-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." onChange={e=>setSearch(e)} required />
       
    </div>
    </div>
  <div ref={contentRef} className={isPrinting?"w-full":"w-full p-5"}>
                         <div className={isPrinting?"hidden rounded-md w-full":"w-full border  border-green-500 rounded-md mb-1"}>
                                      <PrintHeader />
                                      </div>
                                      {flag==2 &&<Tag color="#014737">Warehouse quantity of this product: {wStock}</Tag>}

<DataTable
                value={dataCopy.filter(item=>item?.stock>0 || item.quantity>0)}
                showGridlines={true}
                stripedRows
                stickyHeader="true"
                scrollable
                paginator 
                rows={isPrinting?10:data?.length}
                // body={statusBodyTemplate}
                rowsPerPageOptions={[5, 10, 25, 50, 100, data?.length]}
                rowClassName="bg-white text-md text-nowrap text-gray-800 border border-b-gray-300 border-r-gray-200 border-l-white active:border-0 hover:text-green-700 hover:duration-500 dark:hover:text-[#1e4834] 
              text-ellipsis overflow-hidden truncate w-2"
                tableStyle={{ minWidth: "100%", fontSize: !isPrinting?"10px":"12px" }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                paginatorClassName={isPrinting?"bg-white text-emerald-500":"hidden"}
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                
                // paginatorLeft={paginatorLeft}
                // paginatorRight={paginatorRight}
                styleclassName="p-datatable-gridlines hover:duration-500 dark:bg-gray-800 dark:text-gray-300 shadow-lg"
                className="shadow-lg rounded-lg"
                selectionMode="single"
                // selection={selectedItem}
                // onSelectionChange={(e) => setSelectedItem(e.value)}
                dataKey="id"
                // onRowSelect={onRowSelect}
                // onRowUnselect={onRowUnselect}
                metaKeySelection={false}
              >
                {headers.map((item, index) => (
                  <Column
                    key={index}
                    field={item.name}
                    header={item.value}
                    headerClassName={ isPrinting?
                      "text-green-900 bg-[#C4F1BE] border-b-green-900 dark:bg-gray-700 dark:text-white dark:font-bold":
                      "text-white bg-green-500 border-b-green-900 dark:bg-gray-700 dark:text-white dark:font-bold"
                    }
                    // headerClassName={'text-green-900 bg-green-300 border-b-green-900 dark:bg-gray-700 dark:text-white dark:font-bold'}

                    style={{ width: "10%" }}
                  ></Column>
                ))}

              </DataTable>
              </div>


              {/* <div className='hidden' id="printablediv">
<Descriptions title="Report details" items={info} />
{flag==2 && <Tag color="#014737">Warehouse quantity of this product: {wStock}</Tag>}
              <DataTable
                value={dataCopy}
                showGridlines={true}
                stripedRows
                stickyHeader="true"
                scrollable
                paginator
                rows={10}
                ref={dt}
                // body={statusBodyTemplate}
                rowsPerPageOptions={[data.length,5, 10, 25, 50, 100, data?.length]}
                rowClassName="bg-white text-nowrap text-gray-800 border border-b-gray-300 border-r-gray-200 border-l-white active:border-0 hover:text-green-700 hover:duration-500 dark:hover:text-[#1e4834] 
              text-ellipsis overflow-hidden truncate w-2"
                tableStyle={{ minWidth: "100%", fontSize: "14px" }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                paginatorClassName="bg-white text-emerald-500"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                
                // paginatorLeft={paginatorLeft}
                // paginatorRight={paginatorRight}
                styleclassName="p-datatable-gridlines hover:duration-500 dark:bg-gray-800 dark:text-gray-300 shadow-lg"
                className="shadow-lg rounded-lg"
                selectionMode="single"
                // selection={selectedItem}
                // onSelectionChange={(e) => setSelectedItem(e.value)}
                dataKey="id"
                // onRowSelect={onRowSelect}
                // onRowUnselect={onRowUnselect}
                metaKeySelection={false}
              >
                {headers.map((item, index) => (
                  <Column
                    key={index}
                    field={item.name}
                    header={item.value}
                    headerClassName={
                      "text-green-900 bg-[#C4F1BE] border-b-green-900 dark:bg-gray-700 dark:text-white dark:font-bold"
                    }
                    // headerClassName={'text-green-900 bg-green-300 border-b-green-900 dark:bg-gray-700 dark:text-white dark:font-bold'}

                    style={{ width: "10%" }}
                  ></Column>
                ))}

              </DataTable>
              </div> */}
</div>
</>
  )
}

export default ReportTemplate
