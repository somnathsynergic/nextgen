import './Steps.css'

import React, { useEffect, useState } from "react";
import TDInputTemplate from "../TDInputTemplate";
import { Button, Popover, Tag,  } from "antd";
import { PlusOutlined,MinusOutlined, ArrowRightOutlined, ArrowLeftOutlined, LockFilled, UnlockFilled } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BlockUI } from 'primereact/blockui';

import { url } from "../../Address/BaseUrl";
import BtnGroupReuse from '../BtnGroupReuse';
import BlockComp from '../BlockComp';
function PaymentTerms({ pressBack, pressNext, data }) {
    const [blocked, setBlocked] = useState(false);
  
  const params=useParams()
  const [termdtls,setDtls]=useState([])
  const [popOpen, setPopOpen] = useState(false);
  const det = JSON.parse(localStorage.getItem('perm'))

  const hide = () => {
    setPopOpen(false);
  };
  useEffect(()=>{
    // setBlocked((det.po == 1 || (localStorage.getItem('manager_email')!='FFABC123' && localStorage.getItem('manager_email')!=localStorage.getItem('email'))) ? true : false);
    setBlocked(det.po == 1 || (localStorage.getItem('email')!=localStorage.getItem("po_created_by") && localStorage.getItem("po_created_by")) ?true:false)


  },[])
  const handleOpenChange = (newOpen) => {
    if(termList.length==1)
    setPopOpen(newOpen);
  };
  const [termList, setTermList] = useState(
    data?.termList?.length
      ? data?.termList
      : [
          {
            sl_no: 0,
            stage: "",
            term: "",
          },
        ]
  );
  const handleDtChange = (index, event) => {
    console.log(event.target.value);
    setDtls([])
    handleOpenChange(false)
    let data = [...termList];
    data[index][event.target.name] = event.target.value;
    setTermList(data)
    console.log(termList)
    localStorage.removeItem('termList')
    localStorage.setItem('termList',JSON.stringify(data))
    if(event.target.value.length>=3){
    axios.post(url+'/api/get_term_dtls',{wrd:event.target.value}).then(res=>{
      if(res.data.msg.length>0){
        setDtls(res.data.msg)
        handleOpenChange(true)
      }
    })
  }
  };
  
  const addDt = (dt) => {
    setTermList([...termList, dt]);

    console.log(termList);
    localStorage.removeItem('termList')
    localStorage.setItem('termList',JSON.stringify(termList))
  };
  const removeDt = (index) => {
    console.log(index)
    let data = [...termList];
    data.splice(index, 1);
    setTermList(data);
    localStorage.removeItem('termList')
    localStorage.setItem('termList',JSON.stringify(data))
  };
  return (
    <div className="py-2 px-4 mx-auto w-full lg:py-2">
      <h2 className="text-2xl text-green-900 font-bold my-3">Payment Terms</h2>
            <BlockComp blocked={blocked} template={
                                    <div className='relative  w-full h-full 0 z-10'>
                                      <span className='absolute top-1 right-2 font-bold italic text-gray-500'><LockFilled className='text-green-900 '/> Locked</span>
                                       <span className='absolute bottom-0 right-1 font-bold italic text-gray-500'><UnlockFilled className='text-green-900 '/> Accessible to {localStorage.getItem("po_created_by")}</span>
                                    </div>
                                  }>
      <div className={blocked?'p-2':''}>
        {termList.map((input, index) => (
          <React.Fragment key={index}>
                {localStorage.getItem('po_status')!='A' &&localStorage.getItem('po_status')!='D' && localStorage.getItem('po_status')!='L' &&  
                localStorage.getItem('amend_flag') !='Y' &&

           <div className=" flex justify-end items-center my-3 gap-2">
              {termList.length > 1 && (
                <Button
                  className="rounded-full text-white bg-red-800 border-red-800"
                  onClick={() => removeDt(index)}
                  icon={<MinusOutlined />}
                ></Button>
              )}

              <Button
                className="rounded-full bg-green-900 text-white"
                onClick={() => {
                  console.log(termList[index],'iiii');
                  addDt({
                    sl_no: 0,
                    stage: "",
                    term: "",
                  });
                }}
                icon={<PlusOutlined />}
              ></Button>
            </div>
}
      <div className="grid gap-4 sm:grid-cols-10 sm:gap-6">

            <div className="sm:col-span-5 hidden">
              <TDInputTemplate
                placeholder="Stage"
                type="text"
                label="Stage"
                name="stage"
                formControlName={input.stage}
                handleChange={(event)=>{
                    handleDtChange(index,event)
                
                }}
                disabled={
                // localStorage.getItem('amend_flag') =='Y' ||
                  localStorage.getItem('po_status')=='A' ||localStorage.getItem('po_status')=='D'||localStorage.getItem('po_status')=='L' ?true:false}

                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
              {/* {formik.errors.price_basis_flag && formik.touched.price_basis_flag && (
                      <VError title={formik.errors.price_basis_flag} />
                    )} */}
            </div>
            <Popover
      content={<>
      <ul>
      {termdtls?.map(price=><li className="my-2">
        <Tag className="cursor-pointer" onClick={()=>{
          console.log(termList,index)
          termList[index]['term']=price.terms_dtls;
          localStorage.removeItem('termList')
          localStorage.setItem('termList',JSON.stringify(termList))
          // console.log()
          handleOpenChange(false)
          }} >
        {price.terms_dtls}
          
          </Tag>  
        </li>)}

      </ul>
     <a onClick={hide}>Close</a>  
      </>}
      title="Do you mean?"
      trigger="click"
      open={popOpen}
      onOpenChange={handleOpenChange}
    >
            <div className="sm:col-span-10">
              <TDInputTemplate
                placeholder="Payment Terms"
                type="text"
                label="Payment Terms"
                name="term"
                formControlName={input.term}
                handleChange={(event)=>{handleDtChange(index,event)}}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={3}
                disabled={
                localStorage.getItem('amend_flag') =='Y' ||
                  localStorage.getItem('po_status')=='A' ||localStorage.getItem('po_status')=='D'||localStorage.getItem('po_status')=='L' ?true:false}

              />
              {/* {formik.errors.price_basis_desc && formik.touched.price_basis_desc && (
                      <VError title={formik.errors.price_basis_desc} />
                    )} */}
                
            </div>
            </Popover>
            </div>
           
          </React.Fragment>
        ))}
        </div>
        </BlockComp>

        <div className="flex pt-4 justify-between">
          {/* <button
            className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            onClick={pressBack}
          >
            <span class="relative z-10">
            <ArrowLeftOutlined className="mr-1"/>
            Back
            </span>
            <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
          </button> */}
          <BtnGroupReuse flag={2} icon={<ArrowLeftOutlined className="mr-2"/>} text="Back"  onClick={pressBack} />
          {/* <button
            type="submit"
            className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            onClick={() => pressNext(termList)}
          >
<span class="relative z-10">
          Next  <ArrowRightOutlined className="ml-1"/>
          </span> */}
          {/* <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
          </button> */}
          <BtnGroupReuse flag={1} icon={<ArrowRightOutlined className="mr-2"/>} text="Next" onClick={() => pressNext(termList)}/>

        </div>
      </div>
  );
}

export default PaymentTerms;
