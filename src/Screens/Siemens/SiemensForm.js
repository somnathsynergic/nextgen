import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import BtnComp from "../../Components/BtnComp";
import HeadingTemplate from "../../Components/HeadingTemplate";
import VError from "../../Components/VError";
import TDInputTemplate from "../../Components/TDInputTemplate";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Message } from "../../Components/Message";
import { url } from "../../Address/BaseUrl";
import { ClockCircleOutlined, LockFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DialogBox from "../../Components/DialogBox";
import AuditTrail from "../../Components/AuditTrail";
import { ListBox } from 'primereact/listbox';
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import PrintHeader from "../../Components/PrintHeader";
import SpinComp from '../../Components/SpinComp';
import BlockComp from '../../Components/BlockComp';
import Papa from 'papaparse';
import BtnGroupReuse from "../../Components/BtnGroupReuse";
import { OverlayPanel } from "primereact/overlaypanel";
import { Empty } from "antd";
import InfoTags from "../../Components/InfoTags";
import * as XLSX from "xlsx";
function SiemensForm() {
  const params = useParams()
  const [type, setType] = useState('W')
  const navigate = useNavigate()
    const contentRef = useRef(null);
  
    const [isPrinting, setIsPrinting] = useState(true);
  
     const reactToPrintFn = useReactToPrint({
     contentRef
    });
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)
  const [uploadData, setUploadData] = useState()
  const [projectList, setProjectList] = useState([])
  const [prodList, setProdList] = useState([])
  const [project, setProject] = useState("")
  const [projcode, setProjCode] = useState(0)
  const [retrievedData, setRetrievedData] = useState([])
  const [retrieveHeader, setRetrievedHeader] = useState([])
  const [count, setCount] = useState(0)

  // const 
  const op = useRef(null);
  const csvConvert = (e) => {
    console.log(e)

    const file = e.target.files[0];
    if (!file) return;

    if (file.name.split('.')[1] != 'csv') {
      const reader = new FileReader();
      console.log(file)
      reader.onload = (event) => {
        console.log(event)
        console.log("FileReader onload triggered");
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        console.log("Workbook:", workbook);
        const firstSheetName = workbook.SheetNames[0];
        console.log("First sheet name:", firstSheetName);

        const worksheet = workbook.Sheets[firstSheetName];
        console.log("Worksheet:", worksheet);

        const csv = XLSX.utils.sheet_to_csv(worksheet);
        console.log("CSV:", csv); // <- Should not be undefined now
        handleFileUpload(csv);
      };
      reader.readAsArrayBuffer(file);
    }
    else if (file.name.split('.')[1].toLowerCase().includes('xls')) {
      handleFileUpload(e.target.files);

    }
  }

  const handleFileUpload = (event) => {
    // const file = event.target.files[0];
    const file = event;

    if (file) {
      Papa.parse(file, {
        header: true, // Treat the first row as headers
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length) {
            setError(results.errors[0].message);
            setCsvData([]);
            setHeaders([]);
            return;
          }
          if (results.data.length > 0) {
            setHeaders(Object.keys(results.data[0])); // Get headers from the first data row
            setCsvData(results.data.filter(dt=>+dt['Confirmed']>0).map(item => { return { ...item, isSaved: prodList.filter(e => e.prod_name == item['Product ID'].split('-').join('') || e.part_no == item['Product ID'].split('-').join('')).length || projectList.filter(e => e.proj_id == item['Customer Order'].split('/')[1]).length } }));
            setError(null);
            console.log(results.data.map(item => { return { ...item, isSaved: prodList.filter(e => e.prod_name == item['Product ID'].split('-').join('') || e.part_no == item['Product ID'].split('-').join('')).length || projectList.filter(e => e.proj_id == item['Customer Order'].split('/')[1]).length } }))
          } else {
            setError("No data found in the CSV file.");
            setCsvData([]);
            setHeaders([]);
          }
        },
        error: (err) => {
          setError(`Error parsing CSV: ${err.message}`);
          setCsvData([]);
          setHeaders([]);
        }
      });
    }
  };
  useEffect(() => {
    axios.post(url + '/api/getproduct', { id: 0 }).then(res => setProdList(res?.data?.msg))
    axios.post(url + '/api/getproject', { id: 0 }).then(res => setProjectList(res?.data?.msg))
  }, [])
  useEffect(() => {
    console.log(uploadData)
    setCsvData(uploadData)
    if (uploadData) {
      setLoading(true)
      axios.post(url + '/api/check_duplicate_po', { id: uploadData[0].po_no }).then(res => {
        console.log(res); setLoading(false); console.log(res?.data?.msg[0].cnt)
        if (res?.data?.msg[0]?.count == 0) {

          if (uploadData.filter(item => item.prod_id).length == uploadData.length) {
            setLoading(true)

            axios.post(url + '/api/post_siemens', { items: uploadData, user: localStorage.getItem('email') }).then(res => {
              console.log(res)
              setLoading(false)
              if (res?.data?.suc > 0) {
                Message('success', res?.data?.msg)
                setCsvData([])
                setHeaders([])
                navigate(-1)
              }
            })
          }
          else {
            Message('error', 'One or more products may not be in your database, please make sure you upload existing products!')
          }
        }
        else {
          setCsvData([])
          setLoading(false)
          Message('error', "Documents with this PO has already been uploaded")
        }
      })
    }

  }, [uploadData])
  // useEffect(()=>{
  //   if(params.id>0){
  //     setType(project)
  //   }
  // },[project])
  const onProcess = () => {
    // console.log(csvData.map(item =>prodList.filter(e => e.prod_name == item['Product ID'].split('-').join('') || e.part_no == item['Product ID'].split('-').join(''))))
    setCsvData(csvData.map(item => { return { ...item, isSaved: prodList.filter(e => e.prod_name == item['Product ID'].split('-').join('') || e.part_no == item['Product ID'].split('-').join('')).length || projectList.filter(e => e.proj_id == item['Customer Order'].split('/')[1]).length } }))
    setUploadData(csvData.map(item => {
      return {
        po_no: item['Customer Order'],
        proj_id: projcode.toString(),
        // prod_id: item['Product ID'].split('-').join(''),
        prod_id: prodList.filter(e => e.prod_name == item['Product ID'].split('-').join('') || e.part_no == item['Product ID']?.split('-').join(''))[0]?.sl_no.toString(),
        order_qty: +item['Requested'],
        line_no: +item['Line #'],
        mfn: item['MFN'],
        customer_article_no: item['Customer Article Number'],
        delivery_no: item['Delivery No.'],
        list_price: +item['List Price'] || 0.00,
        order_dt: item['Order Date'].split('.').reverse().join('-'),
        approved_qty: +item['Confirmed'],
        status: item['Status'],
        shipped_qty: +item['Shipped'],
        po_issue_dt: item['Order Date'].split('.').reverse().join('-'),
        po_approve_dt: item['Date Confirmed'].split('.').reverse().join('-'),
        shipped_dt: item['Date Shipped'].split('.').reverse().join('-'),
        sie_sale_ord: item['Siemens Sales Order #'],
        customer_no: item['Customer No.'],
        net_price: +item['Net Price'].split(' ')[0].split(',').join(''),
        total_price: +item['Total Price'].split(' ')[0].split(',').join(''),
        description: item['Description'].split('"').join(''),  //previously item['Description']
        isSaved: prodList.filter(e => e.prod_name == item['Product ID'].split('-').join('') || e.part_no == item['Product ID'].split('-').join('')).length || projectList.filter(e => e.proj_id == item['Customer Order'].split('/')[1]).length
      }
    }))
    console.log(csvData)
  }


  useEffect(() => {
    if (params.id > 0) {
      setLoading(true)
      axios.post(url + '/api/getsiemensrow', { id: params.id }).then(res => {
        console.log(res)
        setRetrievedData(res?.data?.msg)
        setRetrievedHeader(Object.keys(res?.data?.msg[0]))
        setProjCode(+res?.data?.proj_id)
        setProject(projectList.filter(e => res?.data?.proj_id == e.sl_no)[0]?.proj_name)
        setType(+res?.data?.proj_id ? 'P' : 'W')
        setLoading(false)
      })
    }
  }, [projectList])
  return (

    <section className="bg-transparent dark:bg-[#001529]">
      {/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
      <HeadingTemplate
        text={"Add/Update Siemens Orders"}
        mode={params.id > 0 ? 1 : 0}
        title={'Category'}
      //   data={params.id && data?data:''}
        onPrinting={()=>{setIsPrinting(false);
        setTimeout(() => {
          reactToPrintFn();
          setIsPrinting(true);
          }, 5);}
        }
      />
      <div  className="grid grid-cols-6 gap-2">
        <div className="w-full col-span-6 bg-white p-6 rounded-2xl">
{!isPrinting && <div className="sm:col-span-6 p-2 border border-green-600 rounded-md h-full">
            <PrintHeader />
          </div>}
          {isPrinting && <div
            className={

              "sm:col-span-6 flex-col justify-end items-end -mt-1"
            }
          >
            {isPrinting && <TDInputTemplate
              placeholder="Type"
              type="text"
              label="Type"
              name="type"
              disabled={
                params.id > 0
              }
              formControlName={type}
              handleChange={(txt) => {
                console.log(txt);
                setType(txt.target.value);
              }}
              data={[

                { code: 'W', name: 'Warehouse' }, { code: 'P', name: 'Project' }
              ]}
              mode={2}
            />}
          

            {!type && <VError title={"Required"} />}

          </div>}
          {type == 'P' && 
          <div
            className={

              "sm:col-span-6 flex-col justify-end items-end mt-3"
            }
          >
            {isPrinting && <TDInputTemplate
              placeholder="Project"
              type="text"
              label="Project"
              name="proj"
              disabled={
                params.id > 0
              }
              formControlName={project}
              handleFocus={(e) => op.current.show(e)}
              handleChange={(txt) => {
                console.log(txt);
                setProject(txt.target.value);
                if (txt.target.value.length) op.current.show(txt);
                else {
                  op.current.hide(txt);
                  setProjCode(0);
                }
              }}
              data={projectList}
              mode={1}
            />}
            
            {!isPrinting && <h2 className="bg-green-500 font-bold text-lg p-3 text-white">Intended For {projcode?project:'Warehouse'}</h2>
            }

            <OverlayPanel
              ref={op}
              className="w-[72.7%] border-2 bg-gray-50 border-[#C4F1BE]"
            >
              <span className="text-xs text-green-900 italic">
                Search results for: "{project}"
              </span>
              <ul class=" divide-y max-h-48 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                {projectList?.filter(
                  (e) =>
                    e.proj_name
                      ?.toLowerCase()
                      .includes(project?.toLowerCase()) ||
                    e.proj_id
                      ?.toLowerCase()
                      .includes(project?.toLowerCase())
                ).length > 0 &&
                  projectList
                    ?.filter(
                      (e) =>
                        e.proj_name
                          ?.toLowerCase()
                          .includes(project?.toLowerCase()) ||
                        e.proj_id
                          ?.toLowerCase()
                          .includes(project?.toLowerCase())
                    )
                    ?.map((lst) => (
                      <li
                        onClick={(e) => {
                          op.current.hide(e);
                          setProject(lst.proj_name);
                          setProjCode(lst.sl_no);
                        }}
                        class="pb-3 cursor-pointer  hover:bg-[#C4F1BE] group active:bg-green-900 rounded-md hover:duration-300 sm:py-1.5"
                      >
                        <div class="flex items-center rtl:space-x-reverse">
                          <div class="flex-1 min-w-0">
                            <p class="text-sm p-0.5 w-full text-green-900 group-active:text-white truncate dark:text-white">
                              {lst.proj_name}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                {projectList.filter(
                  (e) =>
                    e.proj_name
                      ?.toLowerCase()
                      .includes(project?.toLowerCase()) ||
                    e.proj_id
                      ?.toLowerCase()
                      .includes(project?.toLowerCase())
                ).length == 0 && <Empty />}
              </ul>
            </OverlayPanel>
            {!projcode && <VError title={"Required"} />}
            {projcode > 0 && (

              <a
              // onClick={() => {
              //   setFlag(17);
              //   setVisible(true);
              // }}
              >
                {/* <InfoTags color="#eb8d00" text={"Project ID: "+ projID} /> */}
              </a>
            )}
          </div>
}
        </div>
        {params.id == 0 &&
          <div className={'w-full col-span-6  bg-white p-6 rounded-2xl'}>

            <TDInputTemplate
              placeholder="Add File"
              type="file"
              label="Add File"
              name="catnm"
              // formControlName={formik.values.catnm}
              handleChange={(e) => csvConvert(e)}
              // handleBlur={formik.handleBlur}
              mode={1}
            />
            {error && <VError title={error} />}
            {/* <BtnGroupReuse flag={1} text="Process"/> */}
            {csvData?.length === 0 && !error && (
              <p className="text-gray-700 text-xs mt-1">Please upload a CSV file to see the table.</p>
            )}
          </div>
        }
        {csvData?.length > 0 &&
          <div className={'w-full col-span-6 bg-white px-6 py-2 rounded-2xl'}>
            {params.id == 0 &&
              <SpinComp loading={loading}>
                <div className="flex justify-end mb-5">
                  <BtnGroupReuse disabled={!csvData} loading={loading} onClick={() => onProcess()} flag={1} icon={<ClockCircleOutlined className="mr-2" />} text="Process" />

                </div>
                {csvData.length > 0 && (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Optional: Add scroll for large tables */}
                    <table class={"w-full text-sm text-left rtl:text-right shadow-lg text-green-900 dark:text-gray-400"}>
                      <thead className="text-md text-gray-700 capitalize text-nowrap  bg-[#C4F1BE] dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          {headers.map((header, index) => (
                            <th className="border p-3 border-r-gray-300" key={index}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.map((row, rowIndex) => (
                          <tr className={"border border-b-gray-300 bg-gray-50"} key={rowIndex}>
                            {headers.map((header, colIndex) => (
                              <td class={"text-gray-700 px-4 border border-gray-300 py-4 text-gray-600  text-xs"} key={colIndex}>{row[header]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </SpinComp>

            }

          </div>
        }

        {params.id > 0 && retrievedData &&
          <div  className={'w-full col-span-6 bg-white px-6 py-2 rounded-2xl'}>
            {isPrinting && <SpinComp loading={loading}>
              <div style={{ maxHeight: isPrinting?'400px':'', overflowY: 'auto' }}> {/* Optional: Add scroll for large tables */}
                <table class={"w-full text-sm text-left rtl:text-right shadow-lg text-green-900 dark:text-gray-400"}>
                  <thead className={isPrinting?"text-md text-gray-700 capitalize text-nowrap  bg-[#C4F1BE] dark:bg-gray-700 dark:text-gray-400":"text-xs text-white capitalize text-nowrap  bg-green-500 dark:bg-gray-700 dark:text-gray-400"}>
                    <tr >
                      {retrieveHeader.map((header, index) => (
                        <th className="border p-3 border-r-gray-300 capitalize" key={index}>{header.split('_').join(' ')}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {retrievedData.map((row, rowIndex) => (
                      <tr className={"border border-b-gray-300 bg-gray-50"} key={rowIndex}>
                        {retrieveHeader.map((header, colIndex) => (
                          <td class={"text-gray-700 px-4 border border-gray-300 py-4 text-gray-600  text-xs"} key={colIndex}>{row[header]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SpinComp>}
            {!isPrinting && retrievedData &&
            <div className="p-2" ref={contentRef}>
              <div className="sm:col-span-6 p-2 border border-green-600 rounded-md h-full">
            <PrintHeader />
          </div>
           <div className="sm:col-span-6 p-2 h-full"><h2 className="bg-green-500 font-bold text-lg p-3 text-white">Intended For {projcode?project:'Warehouse'}</h2></div>
            {/* <table class={" mx-auto w-full text-sm text-left rtl:text-right shadow-lg text-green-900 dark:text-gray-400"}>
                  <thead className={isPrinting?"text-md text-gray-700 capitalize text-nowrap  bg-[#C4F1BE] dark:bg-gray-700 dark:text-gray-400":"text-xs text-white capitalize text-nowrap  bg-green-500 dark:bg-gray-700 dark:text-gray-400"}>
                    <tr >
                      {retrieveHeader.map((header, index) => (
                        <th className="border p-3 border-r-gray-300 capitalize text-xs" key={index}>{header.split('_').join(' ')}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {retrievedData.map((row, rowIndex) => (
                      <tr className={"border border-b-gray-300 bg-gray-50"} key={rowIndex}>

                        {retrieveHeader.map((header, colIndex) => (<>
                        
                             
                          <td class={"text-gray-700 px-4 border border-gray-300 py-4 text-gray-600 text-xs"} key={colIndex}>{row[header]}</td>
                       </> ))}
                      </tr>
                    ))}
                  </tbody>

                </table> */}
                <table className="mx-auto w-full text-sm text-left rtl:text-right shadow-lg text-green-900 dark:text-gray-400">
  <thead className={isPrinting ? "hidden" : "text-xs text-white capitalize text-nowrap bg-green-500 dark:bg-gray-700 dark:text-gray-400"}>
    <tr>
      <th className="border p-3 text-left text-xs"></th>
      <th className="border p-3 text-left text-xs"></th>
    </tr>
  </thead>
  <tbody>
    {retrievedData.map((row, rowIndex) => (
      <React.Fragment key={rowIndex}>
        <tr className="bg-gray-200">
          <td colSpan={2} className="font-semibold text-sm p-2 text-green-800 border border-gray-300">
            Product #{rowIndex + 1}
          </td>
        </tr>
        {retrieveHeader.map((header, colIndex) => (
          <tr key={colIndex} className="border-b border-gray-300 bg-white">
            <th className="border border-gray-300 p-2 capitalize text-xs text-left text-green-800 bg-gray-100">
              {header.split('_').join(' ')}
            </th>
            <td className="border border-gray-300 p-2 text-xs text-gray-700">
              {row[header]}
            </td>
          </tr>
        ))}
      </React.Fragment>
    ))}
  </tbody>
</table>

                </div>
                
                }

          </div>


        }
      </div>
    </section>
  );
};

export default SiemensForm