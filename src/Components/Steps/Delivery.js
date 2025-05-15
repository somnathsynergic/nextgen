import './Steps.css'

import React, { useEffect, useState } from "react";
import TDInputTemplate from "../TDInputTemplate";
import VError from "../../Components/VError";
import { Radio } from "antd";
// import { useFormik } from "formik";
// import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { Switch } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, LockFilled, UnlockFilled } from "@ant-design/icons";
import { BlockUI } from 'primereact/blockui';
import BtnGroupReuse from '../BtnGroupReuse';

function Delivery({ pressBack, pressNext, data }) {
  console.log(data);
  const [delValue, setDelValue] = useState(+localStorage.getItem('delFlag')||0);
  const flagSetGeneral = [
    { value: 1, label: "Delivery to Warehouse" },
    { value: 2, label: "Delivery to NGAPL Office" },
  ];
    const [blocked, setBlocked] = useState(false);
    const det = JSON.parse(localStorage.getItem('perm'))
  
  const flagSetProject = [
    { value: 1, label: "Delivery to Warehouse" },
    { value: 2, label: "Delivery to NGAPL Office" },
    { value: 3, label: "Others" },
  ];
  const onChangeFlg = (e) => {
    console.log(e.target.value);
    setDelValue(e.target.value);
    // localStorage.setItem("delFlag", e.target.value);
    if (e.target.value == 1) {
      console.log("hiiiiiii")
      localStorage.setItem("delFlag","1");
      setDelivery(false);
      setDeliveryAdd(
        "NextGen Automation Pvt Ltd , Village : Barunda, Para – Madhya Para, P.O. - Bagnan, District : Howrah, Pin :711303. GSTIN- 19AABCN5744L1Z1"
      );
      localStorage.setItem(
        "ship_to",
        "NextGen Automation Pvt Ltd , Village : Barunda, Para – Madhya Para, P.O. - Bagnan, District : Howrah, Pin :711303. GSTIN- 19AABCN5744L1Z1"
      );
      console.log('hello1',delivery,delValue);
    } else if (e.target.value== 2) {
      localStorage.setItem("delFlag","2");

      setDelivery(false);

      setDeliveryAdd(
        "NextGen Automation Pvt Ltd, Unit - 102, 1st Floor, PS PACE 1/1A, Mahendra Roy Lane Kolkata 700046,GSTIN- 19AABCN5744L1Z1"
      );
      localStorage.setItem(
        "ship_to",
        "NextGen Automation Pvt Ltd, Unit - 102, 1st Floor, PS PACE 1/1A, Mahendra Roy Lane Kolkata 700046,GSTIN- 19AABCN5744L1Z1"
      );
      console.log('hello2',delivery,delValue);
    } else {
      localStorage.setItem("delFlag","3");

      setDeliveryAdd("");
      setDelivery(true);
      localStorage.setItem("ship_to", "");
    }
    localStorage.setItem(
      "ware_house_flag",
      e.target.value == 1 || e.target.value == 2 ? "Y" : "N"
    );
  };
  // localStorage.setItem('ship_to',data.delivery)
  const params = useParams();
  localStorage.setItem(
    "bill_to",
    "NextGen Automation Pvt Ltd, Unit - 102, 1st Floor, PS PACE 1/1A, Mahendra Roy Lane Kolkata 700046,GSTIN- 19AABCN5744L1Z1"
  );
  const [deliveryConfirm, setDelivery] = useState(
    localStorage.getItem("ware_house_flag") == "Y" ? true : false
  );
  const [delivery, setDeliveryAdd] = useState(
    data.delvery ? data.delivery : ""
  );
  // localStorage.getItem('order_type') == "G"
  //   ? "NextGen Automation Pvt Ltd Unit - 102, 1st Floor, PS PACE 1/1A, Mahendra Roy Lane Kolkata 700046"
  //   : (data.delivery?data.delivery:localStorage.getItem('ship_to'))

  useEffect(() => {
    // setBlocked((det.po == 1 || (localStorage.getItem('manager_email')!='FFABC123' && localStorage.getItem('manager_email')!=localStorage.getItem('email'))) ? true : false);
    // 
    setBlocked(det.po == 1 || (localStorage.getItem('email')!=localStorage.getItem("po_created_by") && localStorage.getItem("po_created_by")) ?true:false)
    // setBlocked(false)
    // 


    setDeliveryAdd(
      // localStorage.getItem("order_type") == "G" 
      //   ? localStorage.getItem('delFlag')=="1" ? "NextGen Automation Pvt Ltd Panchla,Beltala,National Highway 6,Surikhali, P.S.- Uluberia, District - Howrah, Pin-711322,GSTIN- 19AABCN5744L1Z1": "NextGen Automation Pvt Ltd Unit - 102, 1st Floor, PS PACE 1/1A, Mahendra Roy Lane Kolkata 700046,GSTIN- 19AABCN5744L1Z1"
      //   : data.delivery
        data.delivery
    );
    localStorage.setItem(
      "ship_to",
      // localStorage.getItem("order_type") == "G"
      //   ?localStorage.getItem('delFlag')=="1" ? "NextGen Automation Pvt Ltd Panchla,Beltala,National Highway 6,Surikhali, P.S.- Uluberia, District - Howrah, Pin-711322,GSTIN- 19AABCN5744L1Z1": "NextGen Automation Pvt Ltd Unit - 102, 1st Floor, PS PACE 1/1A, Mahendra Roy Lane Kolkata 700046,GSTIN- 19AABCN5744L1Z1"
      //   : data.delivery
       data.delivery
    );
    if (localStorage.getItem("order_type") == "G"){
      localStorage.setItem("ware_house_flag", "Y");
      

    }
    // localStorage.setItem("delFlag", data.del);
  }, []);
  // useEffect(()=>{
  //  setDelivery(localStorage.getItem('ware_house_flag')=='Y'?true:false)
  //  setDeliveryAdd(localStorage.getItem('ware_house_flag')=='Y'?"NextGen Automation Pvt Ltd Unit - 102, 1st Floor, PS PACE 1/1A, Mahendra Roy Lane Kolkata 700046":data.delivery)
  // },[localStorage.getItem('ware_house_flag')])

  const onSubmit = () => {
    if (delivery && delValue!=0) {
      console.log(delivery);
      pressNext(delivery);
    }
  };
  return (
    <section className="bg-white dark:bg-[#001529]">
      <div className="py-2 px-4 mx-auto w-full lg:py-2">
        <h2 className="text-2xl text-green-900 font-bold my-3">
          Delivery Detail
        </h2>
              <BlockUI blocked={blocked} template={
                                                  <div className='relative  w-full h-full 0 z-10'>
                                                    <span className='absolute top-1 right-2 font-bold italic text-gray-500'><LockFilled className='text-green-900 '/> Locked</span>
                                                     <span className='absolute bottom-0 right-1 font-bold italic text-gray-500'><UnlockFilled className='text-green-900 '/> Accessible to {localStorage.getItem("po_created_by")}</span>
                                                  </div>
                                                }>
        
        <div className={!blocked?"grid gap-4 sm:grid-cols-2 sm:gap-6":"grid gap-4 sm:grid-cols-2 sm:gap-6 p-2"}>
          <div className="sm:col-span-2">
            <TDInputTemplate
              placeholder="Bill To"
              type="text"
              label="Bill To"
              name="bill_to"
              formControlName={
                "NextGen Automation Pvt Ltd, Unit - 102, 1st Floor, PS PACE 1/1A, Mahendra Roy Lane Kolkata 700046,GSTIN- 19AABCN5744L1Z1"
              }
              disabled={true}
              mode={3}
            />

            {/* {localStorage.getItem('order_type') == "P" && ( */}
            <p
              className="mt-3 text-sm text-gray-500 font-bold float-right dark:text-gray-300"
              id="file_input_help"
            >
              <Radio.Group
                // style={style}
                className="shadow-lg rounded-lg p-2 bg-green-50"
                onChange={onChangeFlg}
                value={delValue}
                disabled={
                  // localStorage.getItem("amend_flag") == "Y" ||
                  localStorage.getItem("po_status") == "A" ||
                  localStorage.getItem("po_status") == "D" ||
                  localStorage.getItem("po_status") == "L"
                    ? true
                    : false
                }
                options={
                  localStorage.getItem("order_type") == "P"
                    ? flagSetProject
                    : flagSetGeneral
                }
              />

              <div className="hidden">
                {" "}
                Delivery to warehouse?{" "}
                <Switch
                  size="small"
                  value={deliveryConfirm}
                  disabled={
                    // localStorage.getItem("amend_flag") == "Y" ||
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                      ? true
                      : false
                  }
                  onClick={(e) => {
                    console.log(e);
                    localStorage.setItem(
                      "ware_house_flag",
                      e == false ? "N" : "Y"
                    );
                    setDelivery(e);
                    if (deliveryConfirm == false) {
                      console.log(deliveryConfirm);
                      setDeliveryAdd(
                        "NextGen Automation Pvt Ltd , Village : Barunda, Para – Madhya Para, P.O. - Bagnan, District : Howrah, Pin :711303. GSTIN- 19AABCN5744L1Z1"
                      );
                      localStorage.setItem(
                        "ship_to",
                        "NextGen Automation Pvt Ltd , Village : Barunda, Para – Madhya Para, P.O. - Bagnan, District : Howrah, Pin :711303. GSTIN- 19AABCN5744L1Z1"
                      );
                      console.log(delivery);
                    } else {
                      setDeliveryAdd("");
                      localStorage.setItem("ship_to", "");
                    }
                  }}
                  defaultChecked
                />
              </div>
            </p>
            {/* )} */}
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2 text-sm font-bold text-green-900 dark:text-gray-100">
              Ship To
            </label>
            <textarea
              rows="8"
              className="bg-white border-1 border-gray-400 text-sm rounded-lg  focus:border-green-900 active:border-green-600 focus:ring-green-600 focus:border-1 duration-500 block w-full p-2.5 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Ship To"
              name="ship_to"
              value={delivery}
              onChange={(text) => {
                setDeliveryAdd(text.target.value);
                localStorage.setItem("ship_to", text.target.value);
              }}
              disabled={
                // localStorage.getItem("order_type") == "G" || (delValue==1||delValue==2)
                //   ? true
                //   : false ||
                    // localStorage.getItem("amend_flag") == "Y" ||
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
            />
            {!delivery && <VError title={"Address is required"} />}
          </div>
        </div>
             </BlockUI>
        
        <div className="flex pt-4 justify-between">
          {/* <button
            className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            onClick={pressBack}
          >
            <span class="relative z-10">
            <ArrowLeftOutlined className="mr-1" />
            Back
            </span>
            <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
          </button> */}
          <BtnGroupReuse flag={2} icon={<ArrowLeftOutlined className="mr-2" />} text="Back" onClick={pressBack}/>
          <BtnGroupReuse flag={1} icon={<ArrowRightOutlined className="mr-2" />} text="Next" onClick={() => onSubmit()}/>
          {/* <button
            type="submit"
           className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            onClick={() => onSubmit()}
          >
            <span class="relative z-10">
            Next <ArrowRightOutlined className="ml-1" />
            </span>
            <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
          </button> */}
        </div>
      </div>
    </section>
  );
}

export default Delivery;
