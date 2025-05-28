import '../Steps.css'
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import BtnComp from "../../../Components/BtnComp";
import HeadingTemplate from "../../../Components/HeadingTemplate";
import VError from "../../../Components/VError";
import TDInputTemplate from "../../../Components/TDInputTemplate";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Message } from "../../../Components/Message";
import axios from "axios";
import { url } from "../../../Address/BaseUrl";
import { LockFilled } from '@ant-design/icons';
import DialogBox from "../../../Components/DialogBox";
import { useNavigate } from 'react-router-dom';
import AuditTrail from "../../../Components/AuditTrail";
import { useReactToPrint } from "react-to-print";
import PrintHeader from "../../../Components/PrintHeader";
import SpinComp from '../../../Components/SpinComp';
import BlockComp from '../../../Components/BlockComp';

function DeptForm() {
    const params = useParams();
  const [loading,setLoading]=useState(false)
    const contentRef = useRef(null);
  
  const [visible,setVisible]=useState(false)
   const [isPrinting, setIsPrinting] = useState(true);
  
     const reactToPrintFn = useReactToPrint({
     contentRef
    });
  const [count,setCount]=useState(0)
  const [data,setData]=useState()
  const navigate=useNavigate()
  const [flag,setFlag]=useState(4)
  const [blocked, setBlocked] = useState(false);
  const det = JSON.parse(localStorage.getItem('perm'))
    const initialValues = {
        dept_nm: "",
      };
      const [formValues,setValues] = useState(initialValues)
      useEffect(()=>{
     setBlocked(det.masters==1?true:false)

        if(+params.id>0){
          setLoading(true)
            axios.post(url+'/api/getdept',{id:params.id})
            .then(res=>{
          console.log(res.data.msg.dept_name)
          setData(res.data?.msg)
          setLoading(false)
          setValues({dept_nm:res.data.msg.dept_name})
          
        }).catch(err=>{console.log(err); navigate('/error'+'/'+err.code+'/'+err.message)});;
      }
        },[count])
      const onDelete=()=>{
        console.log(params.id)
        setVisible(true)
      }
      const deleteItem=()=>{
        console.log(params.id)
        setVisible(false)
        setLoading(true)
        axios.post(url+'/api/deletedept',{id:params.id,user:localStorage.getItem('email')})
        .then(res=>{
          console.log(res)
          setLoading(false)
          if(res.data.suc>0){
            Message('success',res.data.msg)
            navigate(-1)
          }
          else{
            Message('error',res.data.msg)

          }
        }).catch(err=>{console.log(err); navigate('/error'+'/'+err.code+'/'+err.message)});;
      }
      const onSubmit = (values) => {
        setLoading(true)
        setCount(prev=>prev+1)
        axios.post(url+'/api/adddept',{id:+params.id,name:values.dept_nm,user:localStorage.getItem('email')})
        .then(res=>{
            setLoading(false)
    
            if(res.data.suc>0){
              Message('success',res.data.msg)
              setCount(prev=>prev+1)
              if(params.id==0)
                formik.handleReset()
              
            }
            else{
              Message('error',res.data.msg)
      
            }
          }).catch(err=>{console.log(err); navigate('/error'+'/'+err.code+'/'+err.message)});;
      };
      const validationSchema = Yup.object({
        dept_nm: Yup.string().required("Department name is required"),
      });
    
      const formik = useFormik({
        initialValues:(+params.id>0?formValues:initialValues),
        onSubmit,
        validationSchema,
        validateOnMount: true,
        enableReinitialize:true
      });
      return (
        <section  className="bg-transparent dark:bg-[#001529]">
          {/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
          <HeadingTemplate
              text={params.id > 0 ? "Update department" : "Add department"}
              mode={params.id>0?1:0}
              title={'Department'}
              data={params.id && data?data:''}
              onPrinting={()=>{setIsPrinting(false);
                setTimeout(() => {
                  reactToPrintFn();
                  setIsPrinting(true);
                  }, 5);}
                }
            />
                    <BlockComp blocked={blocked} template={
                                <div className='relative  w-full h-full 0 z-10'>
                                  <span className='absolute top-1 right-1 font-bold italic text-gray-500'><LockFilled className='text-green-900 '/> Locked (Readonly)</span>
                             
                                </div>
                              } >
            
          <div className="w-full bg-white p-6 rounded-2xl">
           
            <SpinComp loading={loading}>
            <form onSubmit={formik.handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="sm:col-span-2">
                  
                  <TDInputTemplate
                    placeholder="Type Department name..."
                    type="text"
                    label="Department name"
                    name="dept_nm"
                    formControlName={formik.values.dept_nm}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
    
                  {formik.errors.dept_nm && formik.touched.dept_nm ? (
                    <VError title={formik.errors.dept_nm} />
                  ) : null}
                </div>
            { params.id>0 && <AuditTrail data={data}/>}
                </div>
               
              <BtnComp mode={params.id>0?'E':'A'} onDelete={()=>onDelete()} onReset={formik.handleReset}/>
            </form>
            </SpinComp>
          </div>
          </BlockComp>
           <div ref={contentRef}  style={{
                    display: !isPrinting ? "block" : "none",
                  }} >
                      <div className="grid  gap-4 p-4 sm:grid-cols-2 sm:gap-6">
                      <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
                        <PrintHeader/>
                      </div>
                      <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
                        <h2 className="bg-green-500 font-bold text-lg p-3 text-white">Department</h2>
                        <table className="border-collapse border border-gray-300 w-full">
                  <tbody>
                   
                      <tr  className="border border-gray-300">
                        <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                          Department
                        </td>
                        <td className="border text-gray-600 border-gray-300 p-2">{formik.values.dept_nm}</td>
                      </tr>
                      <tr  className="border border-gray-300">
                        <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                          Created By
                        </td>
                        <td className="border border-gray-300 p-2 text-gray-600 ">{data?.created_by}</td>
                      </tr>
                      <tr  className="border border-gray-300">
                        <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                          Created At
                        </td>
                        <td className="border border-gray-300 text-gray-600 p-2">{data?.created_at}</td>
                      </tr>
                      <tr  className="border border-gray-300">
                        <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                          Modified By
                        </td>
                        <td className="border border-gray-300 text-gray-600 p-2">{data?.modified_by}</td>
                      </tr>
                      <tr  className="border border-gray-300">
                        <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                          Modified At
                        </td>
                        <td className="border border-gray-300 text-gray-600 p-2">{data?.modified_at}</td>
                      </tr>
                  </tbody>
                </table>
                
                    </div>
                      </div>
                      </div>
          <DialogBox
        visible={visible}
        flag={flag}
        onPress={() => setVisible(false)}
        onDelete={()=>deleteItem()}
      />
        </section>
      );
}

export default DeptForm
