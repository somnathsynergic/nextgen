import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import BtnComp from "../Components/BtnComp";
import HeadingTemplate from "../Components/HeadingTemplate";
import VError from "../Components/VError";
import TDInputTemplate from "../Components/TDInputTemplate";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Message } from "../Components/Message";
import axios from "axios";
import { url } from "../Address/BaseUrl";
import { Checkbox, Spin} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import DialogBox from "../Components/DialogBox";
import { useNavigate } from 'react-router-dom';
import PrintComp from "../Components/PrintComp";
import AuditTrail from "../Components/AuditTrail";

function ForgotPass({onClose,onLoading}) {
    const params = useParams();
    const [loading,setLoading]=useState(false)
    const [visible,setVisible]=useState(false)
    const [count,setCount]=useState(0)
    const [data,setData]=useState()
    const navigate=useNavigate()
  const [showPass,setShowPass] = useState(false)

    const [flag,setFlag]=useState(4)

    const onChange = () =>{
      setShowPass(!showPass)
    }
      const initialValues = {
          newPass: "",
        };
        const [formValues,setValues] = useState(initialValues)
       
        useEffect(()=>{onLoading(loading)},[loading])
        const onSubmit = (values) => {
          setLoading(true)
          setCount(prev=>prev+1)
          axios.post(url+'/api/forgot_pass',{newPass:values.newPass,id:+params.id,user:localStorage.getItem('email')})
          .then(res=>{
              setLoading(false)
      
              if(res.data.suc>0){
                Message('success',res.data.msg)
               onClose()
                
              }
              else{
                Message('error',res.data.msg)
        
              }
            }).catch(err=>{console.log(err); navigate('/error'+'/'+err.code+'/'+err.message)});;
        };
        const validationSchema = Yup.object({
          newPass: Yup.string().required("Password is required"),
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
            {/* <HeadingTemplate
                text={params.id > 0 ? "Update department" : "Add department"}
                mode={params.id>0?1:0}
                title={'Department'}
                data={params.id && data?data:''}
              /> */}
            <div className="w-full bg-white p-6 rounded-2xl">
             
              <Spin indicator={<LoadingOutlined spin />} size="large" className="text-green-900 dark:text-gray-400" spinning={loading}>
              <form onSubmit={formik.handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="sm:col-span-2">
                    
                    <TDInputTemplate
                      placeholder="New Password"
                      type={!showPass?"password":"text"}
                      label="New Password"
                      name="newPass"
                      formControlName={formik.values.newPass}
                      handleChange={formik.handleChange}
                      handleBlur={formik.handleBlur}
                      mode={1}
                    />
      
                    {formik.errors.newPass && formik.touched.newPass ? (
                      <VError title={formik.errors.newPass} />
                    ) : null}
                  </div>
                  <div className="pt-3">
        <Checkbox onChange={onChange}>Show Password</Checkbox>
       
      </div>
                  </div>
                 
                <BtnComp mode={'A'} onReset={formik.handleReset}/>
              </form>
              </Spin>
            </div>
          
          </section>
        );
  }
export default ForgotPass
