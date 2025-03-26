import React, { useEffect, useState } from "react";
import TDInputTemplate from "../TDInputTemplate";
import { Button, Popover, Tag,  } from "antd";
import { PlusOutlined,MinusOutlined, ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BlockUI } from 'primereact/blockui';

import { url } from "../../Address/BaseUrl";
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
    setBlocked(det.po==1?true:false)

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
            <BlockUI blocked={blocked} className={'bg-red-500'}>
      
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
                localStorage.getItem('amend_flag') =='Y' ||
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
        </BlockUI>

        <div className="flex pt-4 justify-between">
          <button
            className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-[#92140C] bg-[#92140C] transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 rounded-full  dark:focus:ring-primary-900"
            onClick={pressBack}
          >
            <ArrowLeftOutlined className="mr-1"/>
            Back
          </button>
          <button
            type="submit"
            className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
            onClick={() => pressNext(termList)}
          >

          Next  <ArrowRightOutlined className="ml-1"/>
           
          </button>
        </div>
      </div>
  );
}

export default PaymentTerms;
