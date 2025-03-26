import React, { useState } from 'react'
import { routePaths } from '../Assets/Data/Routes';
import { useNavigate } from 'react-router-dom';
import TDInputTemplate from './TDInputTemplate';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Checkbox, Spin } from 'antd';
import { Message } from './Message';
import axios from 'axios';
import { url } from '../Address/BaseUrl';
import { LoadingOutlined } from '@ant-design/icons';
import VError from './VError';
const PasswordComp = ({mode}) => {
  const [type,setType]=useState('password')
  const navigate=useNavigate()
  const [loading,setLoading]=useState(false)
  const initialValues = {
    old_pass: "",
    new_pass: "",
    confirm_pass: "",
  };
  const validationSchema = Yup.object({
    old_pass: Yup.string().required("Old password is required"),
    new_pass: Yup.string().required("New password is required"),
    // old_pass: Yup.string().required("Old password is required"),
  });
  const onSubmit=(values)=>{
    setLoading(true)
    console.log(values)
    axios.post(url+'/api/reset_pass',{oldPass:values.old_pass,newPass:values.new_pass,user:localStorage.getItem('email')}).then(res=>{
      setLoading(false)
      if(res.data.suc>0){
        Message('success',res?.data?.msg)
        formik.resetForm()
      }
      else{
        Message('error',res?.data?.msg)

      }
    })
  }
  const formik = useFormik({
    initialValues:initialValues,
    onSubmit,
    validationSchema,
    validateOnMount: true,
    enableReinitialize:true
  });

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
    if(e.target.checked==false){
      setType('password')
    }
    else{
      setType('text')

    }
  };
  // const [formValues,setValues] = useState(initialValues)
  return (
      

    <div className="max-w-sm mx-auto" >
      
      <form onSubmit={formik.handleSubmit}>
      <div className="mb-5 relative">
      <TDInputTemplate
                    placeholder="*****"
                    type={type}
                    label="Old password"
                    name="old_pass"
                    formControlName={formik.values.old_pass}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                   {formik.errors.old_pass && formik.touched.old_pass ? (
                <VError title={formik.errors.old_pass} />
              ) : null}
      </div>
      <div className="mb-5">
      <TDInputTemplate
                    placeholder="*****"
                    type={type}
                    label="New password"
                    name="new_pass"
                    formControlName={formik.values.new_pass}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {formik.errors.new_pass && formik.touched.new_pass ? (
                <VError title={formik.errors.new_pass} />
              ) : null}
      </div>
      <div className="mb-5">
      <TDInputTemplate
                    placeholder="*****"
                    type={type}
                    label="Confirm password"
                    name="confirm_pass"
                    formControlName={formik.values.confirm_pass}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                   {formik.errors.confirm_pass && formik.touched.confirm_pass ? (
                <VError title={formik.errors.confirm_pass} />
              ) : null}
               {formik.values.confirm_pass !=formik.values.new_pass ? (
                <VError title={'Passwords don\'t match'} />
              ) : null}
      </div>
      <div className="flex items-start mb-5">
        <div className="flex items-center h-5">
        <Checkbox onChange={onChange}>Show Password</Checkbox>
        </div>
       
      </div>
      <div className='flex justify-between'>
     {mode==3 && <button type="submit" onClick={()=>{localStorage.clear();navigate(routePaths.LANDING)}} className="text-white bg-green-900 hover:bg-
      green-900 focus:ring-4 mr-4 focus:outline-none focus:ring-green-900 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:bg-blue-400">
        Sign Out
      </button>}

      <Spin indicator={<LoadingOutlined spin />} size="large" className="text-green-900 dark:text-gray-400" spinning={loading}>
      <button type="submit" 
      disabled={formik.values.confirm_pass!=formik.values.new_pass} 
      className="text-white bg-green-900 hover:bg-
      green-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-full sm:w-full px-5 py-2.5 text-center dark:bg-green-500 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:bg-blue-400">
        Submit
      </button>
      </Spin>
      </div>
     </form>
    </div>
    
  )
}

export default PasswordComp