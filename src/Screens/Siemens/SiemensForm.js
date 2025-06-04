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
function SiemensForm() {
 const params = useParams()
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState(null);
  const [loading,setLoading] = useState(false)
  const [uploadData,setUploadData] = useState()
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

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
            setCsvData(results.data);
            setError(null);
            console.log(results.data)
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
  useEffect(()=>{
     console.log(uploadData)

  },[uploadData])
  const onProcess = ()=>{
     setUploadData(csvData.map(item=>{
      return {
        po_no:item['Customer Order'],
        proj_id:item['Customer Order'].split('/')[1],
        prod_id:item['Product ID'].split('-').join(''),
        order_qty:+item['Requested'],
        approved_qty:+item['Confirmed'],
        po_issue_dt:item['Order Date'],
        po_approve_dt:item['Date Confirmed'],
        sie_sale_ord:item['Siemens Sales Order #'],
        customer_no:item['Customer No.'],
        net_price:item['Net Price'].split(' ')[0].split(',').join(''),
        total_price:item['Total Price'].split(' ')[0].split(',').join('')
      }
     }))
     setLoading(true)
     axios.post(url+'/api/post_siemens',{items:
      csvData.map(item=>{
      return {
        po_no:item['Customer Order'],
        proj_id:item['Customer Order'].split('/')[1],
        prod_id:item['Product ID'].split('-').join(''),
        order_qty:+item['Requested'],
        approved_qty:+item['Confirmed'],
        po_issue_dt:item['Order Date'],
        po_approve_dt:item['Date Confirmed'],
        sie_sale_ord:item['Siemens Sales Order #'],
        customer_no:item['Customer No.'],
        net_price:+item['Net Price'].split(' ')[0].split(',').join(''),
        total_price:+item['Total Price'].split(' ')[0].split(',').join('')
      }
     })
     }).then(res=>{console.log(res)
      setLoading(false)
      if(res?.data?.suc>0){
        Message('success',res?.data?.msg)
      }
     })
  }

  return (
   
    <section  className="bg-transparent dark:bg-[#001529]">
          {/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
          <HeadingTemplate
              text={ "Add/Update Siemens Orders"}
              mode={params.id>0?1:0}
              title={'Category'}
            //   data={params.id && data?data:''}
            //   onPrinting={()=>{setIsPrinting(false);
            //   setTimeout(() => {
            //     reactToPrintFn();
            //     setIsPrinting(true);
            //     }, 5);}
            //   }
            />
             <div className="grid grid-cols-6 gap-2">
              
            <div className={'w-full col-span-6  bg-white p-6 rounded-2xl'}>
             
                 <TDInputTemplate
                placeholder="Add File"
                type="file"
                label="Add File"
                name="catnm"
                // formControlName={formik.values.catnm}
                handleChange={(e)=>handleFileUpload(e)}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
               {error && <VError  title={error}/>}
            {/* <BtnGroupReuse flag={1} text="Process"/> */}
               
            </div>
           
 <div className={'w-full col-span-6 bg-white px-6 py-2 rounded-2xl'}>
   <div className="flex justify-end mb-5">
            <BtnGroupReuse loading={loading} onClick={()=>onProcess()} flag={1} icon={<ClockCircleOutlined className="mr-2" />} text="Process"/>

            </div>
                 {csvData.length > 0 && (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Optional: Add scroll for large tables */}
          <table class={"w-full text-sm text-left rtl:text-right shadow-lg text-green-900 dark:text-gray-400"}>
            <thead className=" text-md  text-gray-700 capitalize text-nowrap  bg-[#C4F1BE] dark:bg-gray-700 dark:text-gray-400">
              <tr >
                {headers.map((header, index) => (
                  <th className="border p-3 border-r-gray-300" key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, rowIndex) => (
                <tr className="border border-b-gray-300 bg-gray-50" key={rowIndex}>
                  {headers.map((header, colIndex) => (
                    <td class="px-4 border border-gray-300 py-4 text-gray-600  text-xs" key={colIndex}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {csvData.length === 0 && !error && (
        <p>Please upload a CSV file to see the table.</p>
      )}
    
            </div>
          </div>
    </section>
  );
};

export default SiemensForm