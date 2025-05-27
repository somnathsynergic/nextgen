import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import BtnComp from "../../Components/BtnComp";
import HeadingTemplate from "../../Components/HeadingTemplate";
import VError from "../../Components/VError";
import TDInputTemplate from "../../Components/TDInputTemplate";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { url } from "../../Address/BaseUrl";
import { Spin} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DialogBox from "../../Components/DialogBox";
import { Accordion, AccordionTab } from 'primereact/accordion';
import SpinComp from "../../Components/SpinComp";
function Projectwise() {
    const params = useParams();
    const [loading,setLoading]=useState(false)
    const [visible,setVisible]=useState(false)
    const [data,setData]=useState()
    const [products,setProducts]=useState([])
    const [count,setCount]=useState(0)
  
    const navigate=useNavigate()
    const [flag,setFlag]=useState(4)
    const initialValues = {
      from_dt: "",
      to_dt:""
    };
    const [formValues,setValues] = useState(initialValues)
    var result;
     useEffect(()=>{
      if(+params.id>0){
        setLoading(true)
          axios.post(url+'/api/getcategory',{id:params.id}).then(res=>{
        console.log(res.data.msg.catg_name)
        setData(res.data?.msg)
        // setLoading(false)
        setValues({catnm:res.data.msg.catg_name})
      }).catch(err=>{console.log(err); navigate('/error'+'/'+err.code+'/'+err.message)});
      axios.post(url+'/api/getCatWithProd',{id:params.id}).then(res=>{
        console.log(res)
        // console.log(res.data.msg.catg_name)
        setProducts(res.data?.msg)
        setLoading(false)
        products.length=0
        for(let i=0;i<res?.data?.msg.length;i++){
          products.push({name:res?.data?.msg[i]?.prod_name,code:res?.data?.msg[i]?.sl_no})
        }
        setProducts(products)
  
        console.log(products)
        // setValues({catnm:res.data.msg.catg_name})
      }).catch(err=>{console.log(err); navigate('/error'+'/'+err.code+'/'+err.message)});
    }
      },[count])
    const onSubmit = (values) => {
      console.log(values);
    //   setLoading(true)
    //   axios.post(url+'/api/addcategory',{id:+params.id,name:values.catnm,user:localStorage.getItem('email')}).then(res=>{
    //     setLoading(false)
    //     if(res.data.suc>0){
    //       Message('success',res.data.msg)
    //       if(params.id==0)
    //         formik.handleReset()
    //         setCount(prev=>prev+1)
    //     }
    //     else{
    //       Message('error',res.data.msg)
  
    //     }
    //   }).catch(err=>{console.log(err); navigate('/error'+'/'+err.code+'/'+err.message)});
      
      console.log(result)
    };
 
    const validationSchema = Yup.object({
      from_dt: Yup.string().required("Required"),
      to_dt: Yup.string().required("Required"),
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
                text={"Projectwise Stock Report"}
                mode={params.id>0?1:0}
                title={'Report'}
                data={params.id && data?data:''}
              />
              <div className="grid grid-cols-6 gap-2 resize">
              <div className={'w-full col-span-6 bg-white p-1 rounded-2xl '}>
              <Accordion activeIndex={0} className="">
                <AccordionTab header="Report Criteria">
                <SpinComp loading={loading}>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-1">
                
                <TDInputTemplate
                  placeholder="From"
                  type="date"
                  label="From"
                  name="from_dt"
                  formControlName={formik.values.from_dt}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={1}
                />
  
                {formik.errors.from_dt && formik.touched.from_dt ? (
                  <VError title={formik.errors.from_dt} />
                ) : null}
              </div>
              <div className="sm:col-span-1">
                
                <TDInputTemplate
                  placeholder="To"
                  type="date"
                  label="To"
                  name="to_dt"
                  formControlName={formik.values.to_dt}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={1}
                />
  
                {formik.errors.to_dt && formik.touched.to_dt ? (
                  <VError title={formik.errors.to_dt} />
                ) : null}
              </div>
              
            </div>
  
      
            <BtnComp mode={params.id>0?'E':'A'} onReset={formik.handleReset}/>
           
          </form>
          </SpinComp>
                </AccordionTab>
                </Accordion>
          
        </div>
    
              </div>
              <div className="grid grid-cols-6 gap-2 my-3">
              <div className='w-full col-span-6 bg-white p-6 rounded-2xl'>
         

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                    Product name
                </th>
                <th scope="col" class="px-6 py-3">
                    Color
                </th>
                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                    Category
                </th>
                <th scope="col" class="px-6 py-3">
                    Price
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="border-b border-gray-200 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                    Apple MacBook Pro 17"
                </th>
                <td class="px-6 py-4">
                    Silver
                </td>
                <td class="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                    Laptop
                </td>
                <td class="px-6 py-4">
                    $2999
                </td>
            </tr>
            <tr class="border-b border-gray-200 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                    Microsoft Surface Pro
                </th>
                <td class="px-6 py-4">
                    White
                </td>
                <td class="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                    Laptop PC
                </td>
                <td class="px-6 py-4">
                    $1999
                </td>
            </tr>
            <tr class="border-b border-gray-200 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                    Magic Mouse 2
                </th>
                <td class="px-6 py-4">
                    Black
                </td>
                <td class="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                    Accessories
                </td>
                <td class="px-6 py-4">
                    $99
                </td>
            </tr>
            <tr class="border-b border-gray-200 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                    Google Pixel Phone
                </th>
                <td class="px-6 py-4">
                    Gray
                </td>
                <td class="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                    Phone
                </td>
                <td class="px-6 py-4">
                    $799
                </td>
            </tr>
            <tr>
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                    Apple Watch 5
                </th>
                <td class="px-6 py-4">
                    Red
                </td>
                <td class="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                    Wearables
                </td>
                <td class="px-6 py-4">
                    $999
                </td>
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
        />
      </section>
    );
  };
export default Projectwise
