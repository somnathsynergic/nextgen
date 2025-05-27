import '../Steps.css'
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import BtnComp from "../../../Components/BtnComp";
import HeadingTemplate from "../../../Components/HeadingTemplate";
import VError from "../../../Components/VError";
import TDInputTemplate from "../../../Components/TDInputTemplate";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Message } from "../../../Components/Message";
import { BlockUI } from 'primereact/blockui';

import { url } from "../../../Address/BaseUrl";
import { Spin} from 'antd';
import { LoadingOutlined, LockFilled } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import DialogBox from "../../../Components/DialogBox";
import AuditTrail from "../../../Components/AuditTrail";
import { useReactToPrint } from "react-to-print";
import PrintHeader from "../../../Components/PrintHeader";
// import { OverlayPanel } from 'primereact/overlaypanel';
function UnitForm() {
  const params = useParams();
  const contentRef = useRef(null);
    const [isPrinting, setIsPrinting] = useState(true);
  
     const reactToPrintFn = useReactToPrint({
     contentRef
    });
  const [loading,setLoading]=useState(false)
  const [visible,setVisible]=useState(false)
  const [count,setCount]=useState(0)
  const [data,setData]=useState()
  const navigate=useNavigate()
  const [flag,setFlag]=useState(4)
     const [blocked, setBlocked] = useState(false);
     const det = JSON.parse(localStorage.getItem('perm'))
  
  // const op = useRef(null);
  // const [txt,setText] = useState("")
  const initialValues = {
    u_nm: "",
  };
  const [formValues, setValues] = useState(initialValues);

  // const [names,setNames] = useState([{name:'Somnath',code:1},{name:'Souvik',code:2},{name:'Tamal',code:3},{name:'Deep',code:4},{name:'Tanmoy',code:5},{name:'Deepanjan',code:6}])
  // const [namesCopy,setNamesCopy] = useState([{name:'Somnath',code:1},{name:'Souvik',code:2},{name:'Tamal',code:3},{name:'Deep',code:4},{name:'Tanmoy',code:5},{name:'Deepanjan',code:6}])
  useEffect(() => {
    setBlocked(det.masters==1?true:false)

    if (+params.id > 0){
      setLoading(true)
      axios.post(url + "/api/getunit", { id: params.id })
      .then((res) => {
        console.log(res.data.msg.unit_name);
        setData(res.data?.msg)

        setLoading(false)
        setValues({ u_nm: res.data.msg.unit_name });
      }).catch(err=>{console.log(err); navigate('/error'+'/'+err.code+'/'+err.message)});
    }
  }, [count]);
  const onSubmit = (values) => {
    setLoading(true)
    console.log(values);
    axios
      .post(url + "/api/addunit", {
        id: +params.id,
        name: values.u_nm,
        user: localStorage.getItem("email"),
      })
      .then((res) => {
        setLoading(false)
        if (res.data.suc > 0) {
          Message("success", res.data.msg);
          setCount(prev=>prev+1)
          if(params.id==0)
            formik.handleReset();
        } else {
          Message("error", res.data.msg);
        }
      }).catch(err=>{console.log(err); navigate('/error'+'/'+err.code+'/'+err.message)});
  };
  const validationSchema = Yup.object({
    u_nm: Yup.string().required("Unit name is required"),
  });
  const onDelete=()=>{
    console.log(params.id)
    setVisible(true)
  }
  const deleteItem=()=>{
    console.log(params.id)
    setVisible(false)
    setLoading(true)
    axios.post(url+'/api/deleteunit',{id:params.id,user:localStorage.getItem('email')}).then(res=>{
      console.log(res)
      setLoading(false)
      if(res.data.suc>0){
        Message('success',res.data.msg)
        navigate(-1)
      }
      else{
        Message('error',res.data.msg)
      }
    })
  }
  const formik = useFormik({
    initialValues: +params.id > 0 ? formValues : initialValues,
    onSubmit,
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });


  return (
    <section  className="bg-transparent dark:bg-[#001529]">
          {/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
          <HeadingTemplate
              text={params.id > 0 ? "Update unit" : "Add unit"}
              mode={params.id>0?1:0}
              title={'Unit'}
              data={params.id && data?data:''}
              onPrinting={()=>{setIsPrinting(false);
                setTimeout(() => {
                  reactToPrintFn();
                  setIsPrinting(true);
                  }, 5);}
                }
            />
                  <BlockUI blocked={blocked} template={
                                                  <div className='relative  w-full h-full 0 z-10'>
                                                    <span className='absolute top-1 right-1 font-bold italic text-gray-500'><LockFilled className='text-green-900 '/> Locked (Readonly)</span>
                                               
                                                  </div>
                                                } className={'bg-red-500'}>
            
          <div className="w-full bg-white p-6 rounded-2xl">
           
        <Spin indicator={<LoadingOutlined spin />} size="large" className="text-green-900 dark:text-gray-400" spinning={loading}>   
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <TDInputTemplate
                placeholder="Type Unit name..."
                type="text"
                label="Unit name"
                name="u_nm"
                formControlName={formik.values.u_nm}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />

              {formik.errors.u_nm && formik.touched.u_nm ? (
                <VError title={formik.errors.u_nm} />
              ) : null}
            </div>
            { params.id>0 && <AuditTrail data={data}/>}
          </div>
          <BtnComp
            mode={params.id > 0 ? "E" : "A"}
            onReset={formik.handleReset}
            onDelete={()=>onDelete()}
            
          />
        </form>
        </Spin>

        {/* <TDInputTemplate
                placeholder="Type Unit name..."
                type="text"
                label="Unit name"
                name="u_nm"
                formControlName={txt}
                handleChange={(e) => {
                  setText(e.target.value)
                  setNamesCopy(names.filter(ev=>ev.name.toLowerCase().includes(e.target.value.toLowerCase())))
                  if(names.filter(ev=>ev.name.toLowerCase().includes(e.target.value.toLowerCase())).length)
                  op.current.show(e);
                else{
                  op.current.hide(e)
                }

                
                }}
                // handleBlur={formik.handleBlur}
                mode={1}
              /> */}
{/* <div className="card flex justify-content-center relative">
           
            <OverlayPanel className="w-96 " closeIcon={true} ref={op}>
                <ul >
                  {namesCopy.map(lst=><li className="cursor-pointer" onClick={()=>{setText(lst.code)}}>{lst.name}</li>)}
                  </ul>
            </OverlayPanel>
        </div> */}
      </div>
      </BlockUI>
      <div ref={contentRef}  style={{
          display: !isPrinting ? "block" : "none",
        }} >
            <div className="grid  gap-4 p-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
              <PrintHeader/>
            </div>
            <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
              <h2 className="bg-green-500 font-bold text-lg p-3 text-white">Unit</h2>
              <table className="border-collapse border border-gray-300 w-full">
        <tbody>
         
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Unit
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{formik.values.u_nm}</td>
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

export default UnitForm;
