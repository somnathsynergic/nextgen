import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import HeadingTemplate from "../../Components/HeadingTemplate";
import VError from "../../Components/VError";
import TDInputTemplate from "../../Components/TDInputTemplate";
import axios from "axios";
import { Message } from "../../Components/Message";
import { url } from "../../Address/BaseUrl";
import { Empty, Spin, Tag, Tooltip } from "antd";
import {
    ArrowUpOutlined,
  BorderOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  SaveOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import PrintComp from "../../Components/PrintComp";
import { Accordion, AccordionTab } from "primereact/accordion";
import { OverlayPanel } from "primereact/overlaypanel";
import ReportTemplate from "../../Components/ReportTemplate";
import moment from "moment";


function PurMrnReporProj() {
    // const headers= [
    //     { name:'serial_number',value:'#'},
    //     { name: "prod_name", value: "Product" },
    //     { name: "proj_name", value: "Project" },
    //     { name: "project_stock", value: "Project quantity" },
    
    //     // { name: "created_by", value: "Created by" },
    //   ]
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    
    const [projectList, setProjectList] = useState([]);
    const [showProj, setShowProj] = useState(false);
    const [projVal, setProjVal] = useState("");
    const [projCode, setProjCode] = useState();

    const [vendors, setVendors] = useState([]);
    const [vendorList, setVendorList] = useState([]);
    // const [showProj, setShowProj] = useState(false);
    const [venVal, setVenVal] = useState("");
    const [vendorCode, setVendorCode] = useState();

    const [type, setType] = useState("");
    const [dt, setDt] = useState(moment(new Date()).format("yyyy-MM-DD"));
    const [clicked, setClicked] = useState(true);
    const [reportData,setReportData] = useState([])
    const op = useRef(null);
    const op_vendor = useRef(null);
    const [info,setInfo] = useState([])
    const [projId,setProjId] = useState("")
    const headers= [
        {name:'pur_req', value:"Purchase Requisition"},
        {name:'proj_name', value:"Project"},
        {name:'invoice', value:"Invoice"},
        {name:"mrn_no" ,value: "MRN No"},
        {name:"prod_name",value: "Product"},
        {name:"quantity",value:"Ordered Quantity"},
        {name:"rc_qty",value:"Received Quantity"}
      
      // { name: "created_by", value: "Created by" },
    ]
    useEffect(() => {
        axios.post(url + "/api/getvendor", { id: 0 }).then((res) => {
            console.log(res);
            setLoading(false);
            setVendors(res?.data?.msg);
            for (let i of res?.data?.msg) {
              vendorList.push({
                code: i.sl_no,
                name: i.vendor_name,
                phone: i.vendor_phone,
                address:i.vendor_address,
                email:i.vendor_email,
                gst:i.vendor_gst,
                pan:i.vendor_pan
              });
            }
          });
      if (type == "P") {
        setLoading(true);
        projectList.length=0
        // setProjectList([])
        axios.post(url + "/api/getproject", { id: 0 }).then((res) => {
          console.log(res);
          setLoading(false);
          setProjects(res?.data?.msg);
          for (let i of res?.data?.msg) {
            projectList.push({
              code: i.sl_no,
              name: i.proj_name,
              client: i.client_id,
              proj_id:i.proj_id
            });
          }
        });
      }
    }, [type]);
    const onSubmit = () => {
      setInfo([{key:'1',label:'Date',children:<p>{dt}</p>},{key:'2',label:type=='P'?'Project Stock for ':'Warehouse Stock',children:<p>{type=='P'?projVal:'N/A'}</p>}])
      setLoading(true);
      axios
        .post(url + "/api/allstock", { project_id: projCode || 0, dt: dt })
        .then((res) => {
          console.log(res);
          setReportData(res?.data?.msg)
          setLoading(false);
          if(res?.data?.msg?.length==0){
              Message('error','No Data')
          }
          // else{
          //     setClicked(!clicked)
          // }
        });
    };
  
    return (
      <section className="bg-transparent dark:bg-[#001529]">
        <HeadingTemplate
          text={"MRN Report"}
          mode={2}
          title={"Report"}
          // data={params.id && data?data:''}
        />
        {/* <div className="float-end">
                  
                  {clicked &&<Tooltip title='Minimize'> <button className="h-4  w-4 flex justify-center items-center  rounded-full bg-green-900 text-white" onClick={()=>{setClicked(!clicked)}}>
                 <MinusCircleOutlined  className="z-50 text-xs" />
                  </button>
                  </Tooltip>
  }
  
  
                  </div> */}
        <div className="grid grid-cols-6 gap-2">
          <div className="ml-1 -mb-11 z-50">
            {clicked && (
              <Tooltip title="Minimize">
                {" "}
                <button
                  className="h-5 w-5 flex justify-center items-center  rounded-full bg-gray-300 text-gray-600"
                  onClick={() => {
                    setClicked(!clicked);
                  }}
                >
                  <ArrowUpOutlined className="z-50 text-sm" />
                </button>
              </Tooltip>
            )}
          </div>
          <div
            onClick={() => {
              if (!clicked) setClicked(!clicked);
            }}
            className={
              clicked
                ? "w-full col-span-6 -mt-3 bg-white p-6 rounded-2xl delay-100 duration-300"
                : "w-8 rounded-full col-span-6 h-8 flex justify-center items-center z-50 delay-100 text-white duration-300 cursor-pointer bg-green-900 p-1 -mb-8"
            }
          >
            {clicked && (
              <Spin
                indicator={<LoadingOutlined spin />}
                size="large"
                className="text-green-900 dark:text-gray-400"
                spinning={loading}
              >
                <form>
                  <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    {/* <div className="sm:col-span-1">
                      <TDInputTemplate
                        placeholder="From"
                        type="date"
                        label="From"
                        name="dt"
                        formControlName={dt}
                        handleChange={(txt) => setDt(txt.target.value)}
                        mode={1}
                        min={moment(
                          new Date(
                            new Date().setFullYear(new Date().getFullYear() - 3)
                          )
                        ).format("yyyy-MM-DD")} //may need to change
                        max={moment(new Date()).format("yyyy-MM-DD")} 
                      />
  
                      {!dt ? <VError title={"Required"} /> : null}
                    </div> */}
                    <div className="sm:col-span-2">
                      <TDInputTemplate
                        placeholder="Type"
                        type="date"
                        label="Type"
                        name="type"
                        formControlName={type}
                        handleChange={(txt) => {setType(txt.target.value);setProjCode();setProjVal("");setProjId("")}}
                        mode={2}
                        data={[
                          { code: "P", name: "Project" },
                          { code: "W", name: "Warehouse" },
                        ]}
                      />
  
                      {!type ? <VError title={"Required"} /> : null}
                    </div>
                    <div className="sm:col-span-1">
                      {type == "P" && (
                        <TDInputTemplate
                          placeholder="Project"
                          type="text"
                          label="Project"
                          name="proj"
                          // disabled={params.id > 0 || (intended=='W' && !clientcode)}
                          formControlName={projVal}
                          handleFocus={(e) => op.current.show(e)}
                          handleChange={(txt) => {
                            console.log(txt);
                            setProjVal(txt.target.value);
                            if (txt.target.value.length) op.current.show(txt);
                            else {
                              op.current.hide(txt);
                              setProjCode();
                              setProjId("")
                            }
                            // setLoading(true);
                            // getItemDetails(txt.target.value);
                          }}
                          data={projectList}
                          mode={1}
                        />
                      )}
                        {/* {!projCode && type=='P' ? <VError title={"Required"} /> : null} */}
                        {projId ? <Tag className="bg-amber-600 text-white">Project ID:{projId}</Tag> : null}
  
                      <OverlayPanel
                        ref={op}
                        className="w-[485px] border-2 bg-gray-200 border-green-900"
                      >
                        <span className="text-xs text-green-900 italic">
                          Search results for: "{projVal}"
                        </span>
                        <ul class=" divide-y max-h-48 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                          {projectList?.filter((e) =>
                            e.name?.toLowerCase().includes(projVal?.toLowerCase()) || e.proj_id?.toLowerCase().includes(projVal?.toLowerCase())
                          ).length > 0 &&
                            projectList
                              ?.filter((e) =>
                                e.name
                                  ?.toLowerCase()
                                  .includes(projVal?.toLowerCase()) || e.proj_id?.toLowerCase().includes(projVal?.toLowerCase())
                              )
                              ?.map((lst) => (
                                <li
                                  onClick={(e) => {
                                    op.current.hide(e);
                                    setProjVal(lst.name);
                                    setProjCode(lst.code);
                                    setProjId(lst.proj_id)
                                  }}
                                  class="pb-3 cursor-pointer  hover:bg-[#C4F1BE] rounded-md hover:duration-300 sm:pb-4"
                                >
                                  <div class="flex items-center rtl:space-x-reverse">
                                    <div class="flex-1 min-w-0">
                                      <p class="text-sm font-bold p-0.5 w-full text-green-900 truncate dark:text-white">
                                        {lst.name}
                                      </p>
                                    </div>
                                  </div>
                                  {/* <hr className=" border-gray-100"/> */}
                                </li>
                              ))}
                          {projectList.filter((e) =>
                            e.name?.toLowerCase().includes(projVal?.toLowerCase()) || e.proj_id?.toLowerCase().includes(projVal?.toLowerCase())
                          ).length == 0 && <Empty />}
                        </ul>
                      </OverlayPanel>
                    </div>
                    <div className={type!='P'?"sm:col-span-2":"sm:col-span-1"}>
                        <TDInputTemplate
                          placeholder="Vendor"
                          type="text"
                          label="Vendor"
                          name="vend"
                          // disabled={params.id > 0 || (intended=='W' && !clientcode)}
                          formControlName={venVal}
                          handleFocus={(e) => op_vendor.current.show(e)}
                          handleChange={(txt) => {
                            console.log(txt);
                            setVenVal(txt.target.value);
                            if (txt.target.value.length) op_vendor.current.show(txt);
                            else {
                              op_vendor.current.hide(txt);
                              setVendorCode();
                            //   setProjId("")
                            }
                            // setLoading(true);
                            // getItemDetails(txt.target.value);
                          }}
                          data={vendorList}
                          mode={1}
                        />
                        {!vendorCode ? <VError title={"Required"} /> : null}
                      
  
                      <OverlayPanel
                        ref={op_vendor}
                        className={type!='P'?"w-[980px] border-2 bg-gray-200 border-green-900":"w-[485px] border-2 bg-gray-200 border-green-900"}
                      >
                        <span className="text-xs text-green-900 italic">
                          Search results for: "{venVal}"
                        </span>
                        <ul class=" divide-y max-h-48 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                          {vendorList?.filter((e) =>
                            e.name?.toLowerCase().includes(venVal?.toLowerCase()) ||e.email?.toLowerCase().includes(venVal?.toLowerCase()) ||e.gst?.toLowerCase().includes(venVal?.toLowerCase()) || e.pan?.toLowerCase().includes(venVal?.toLowerCase()) ||e.address?.toLowerCase().includes(venVal?.toLowerCase()) || e.phone?.toLowerCase().includes(venVal?.toLowerCase())
                          ).length > 0 &&
                            vendorList
                              ?.filter((e) =>
                                e.name?.toLowerCase().includes(venVal?.toLowerCase()) ||e.email?.toLowerCase().includes(venVal?.toLowerCase()) ||e.gst?.toLowerCase().includes(venVal?.toLowerCase()) || e.pan?.toLowerCase().includes(venVal?.toLowerCase()) ||e.address?.toLowerCase().includes(venVal?.toLowerCase()) || e.phone?.toLowerCase().includes(venVal?.toLowerCase())
                              )
                              ?.map((lst) => (
                                <li
                                  onClick={(e) => {
                                    op_vendor.current.hide(e);
                                    setVenVal(lst.name);
                                    setVendorCode(lst.code);
                                  }}
                                  class="pb-3 cursor-pointer  hover:bg-[#C4F1BE] rounded-md hover:duration-300 sm:pb-4"
                                >
                                  <div class="flex items-center rtl:space-x-reverse">
                                    <div class="flex-1 min-w-0">
                                      <p class="text-sm font-bold p-0.5 w-full text-green-900 truncate dark:text-white">
                                        {lst.name}
                                      </p>
                                    </div>
                                  </div>
                                  {/* <hr className=" border-gray-100"/> */}
                                </li>
                              ))}
                          {projectList.filter((e) =>
                            e.name?.toLowerCase().includes(venVal?.toLowerCase()) ||e.email?.toLowerCase().includes(venVal?.toLowerCase()) ||e.gst?.toLowerCase().includes(venVal?.toLowerCase()) || e.pan?.toLowerCase().includes(venVal?.toLowerCase()) ||e.address?.toLowerCase().includes(venVal?.toLowerCase()) || e.phone?.toLowerCase().includes(venVal?.toLowerCase())
                          ).length == 0 && <Empty />}
                        </ul>
                      </OverlayPanel>
                    </div>
                  </div>
  
                  {/* <BtnComp mode={params.id>0?'E':'A'} onReset={formik.handleReset}/> */}
                </form>
  
                <div className="flex justify-center">
                  <button
                  disabled={!type && !vendorCode}
                    type="submit"
                    className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-1 -mb-2 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                    onClick={() => {
                    //   onSubmit();
                    setLoading(true)
                    console.log(projCode,vendorCode,type)
                    axios.post(url + "/api/mrnprojreport", { proj_id: projCode || 0, vendor_id: vendorCode || 0,dt:dt,type:type }).then((res) => {
                         console.log(res)
                         if(res?.data?.suc>0){
                            setReportData(res?.data?.msg)
                            
                            setLoading(false)
                         }
                    
                    })
                    }}
                  >
                    <SaveOutlined className="mr-2" />
                    Submit
                  </button>
                </div>
              </Spin>
            )}
            {!clicked && <SnippetsOutlined />}
          </div>
        </div>
        {reportData.length>0 &&   <div className={clicked?"grid grid-cols-6 gap-2 my-3":"grid grid-cols-6 gap-2"}>
                <div className='w-full col-span-6 bg-white p-2 rounded-2xl '>
           
  
                <div className="w-full col-span-6 bg-white p-6 rounded-2xl ">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <Tag color="white" >Warehouse quantity of this product: </Tag>
            
              <ReportTemplate data={reportData} headers={headers} info={info} flag={3}/>
            </div>
          </div>
  
          </div>
      
                </div>
             
          }
      </section>
    );
  }

export default PurMrnReporProj
