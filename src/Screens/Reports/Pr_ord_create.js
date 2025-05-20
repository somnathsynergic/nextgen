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
import InfoTags from "../../Components/InfoTags";
import BtnGroupReuse from "../../Components/BtnGroupReuse";

function Pr_ord_create() {
  const params = useParams();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [showProj, setShowProj] = useState(false);
    const [purCode, setPurCode] = useState();

    const [projVal, setProjVal] = useState("");
    const [projCode, setProjCode] = useState();
    const [type, setType] = useState("");
    const [dt, setDt] = useState(moment(new Date()).format("yyyy-MM-DD"));
    const [clicked, setClicked] = useState(true);
    const [reportData,setReportData] = useState([])
    const [pur_req__list, setPurReqList] = useState([]);
    const [pur_req__listCopy, setPurReqListCopy] = useState([]);
    const [pur_req_items, setPurReqItems] = useState([]);
    const [pur_req, setPurReq] = useState("");
    const op = useRef(null);
    const op_pur_req = useRef(null);
    
    const [info,setInfo] = useState([])
    const [projId,setProjId] = useState("")
    const headers= [
      { name: "pur_no", value: "PR No." },
      { name: "proj_name", value: "Intended For" },
      { name: "qty", value: "PR Quantity" },
      { name: "po_no", value: "PO No.(s)" },
      { name: "ordered_qty", value: "Ordered Quantity" },
      { name: "free_qty", value: "Free For Requisition" },

      { name: "approved_ord_qty", value: "Approved Quantity" },

      // { name: "approved_ord_qty", value: "Approved Quantity" },
     
  
      // { name: "created_by", value: "Created by" },
    ]
    useEffect(() => {
        axios
        .post(url + "/api/get_purchase_req_items_search", { pur_no: "" })
        .then((resPur) => {
          console.log(resPur);
          setPurReqList(
            resPur?.data?.msg
          );
          setPurReqListCopy(
            resPur?.data?.msg
          );
          setLoading(false);
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
        .post(url + "/api/pr_ord_create", { pur_no: purCode})
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
          text={"PR-wise Order Creation Report"}
          mode={2}
          title={"Report"}
        />
     
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
                    <div className="sm:col-span-1">
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
                    </div>
                    <div className="sm:col-span-1">
                    {params.flag!='E' && <div className="sm:col-span-6">
                <TDInputTemplate
                  placeholder="Search by Purchase Requisition,item name, item make, part no.,article no.,model no.,project name"
                  type="text"
                  label="Purchase Requisition"
                  data={pur_req__list}
                  formControlName={pur_req}
                  name="pur_req"
                  handleChange={(event) => {
                    setPurReq(event.target.value);

                    console.log(event.target.value);
                    if (event.target.value.length > 0) {
                      op_pur_req.current.show(event);
                    } else {
                      op_pur_req.current.hide(event);
                      setPurCode();
                    }
                  }}
                  handleFocus={(e) => {
                    op_pur_req.current.show(e);
                    if(localStorage.getItem('order_type')=='P'){
                      setPurReqList(pur_req__listCopy)
                    console.log(pur_req__listCopy)
                      }
                    else{
                    setPurReqList(pur_req__listCopy)
                    console.log(pur_req__listCopy)
                    }
                  }}
                  // disabled={
                  //   localStorage.getItem("po_status") == "A" ||
                  //   localStorage.getItem("po_status") == "D" ||
                  //   localStorage.getItem("po_status") == "L"
                  //     ? true
                  //     : false
                  // }
                  mode={1}
                />
               

                <OverlayPanel
                  ref={op_pur_req}
                  className="w-[35.5%] border-2 bg-gray-50 border-[#C4F1BE]"
                >
                  <span className="text-xs text-green-900 italic">
                    Search results for: "{pur_req}"
                  </span>
                  <ul class=" divide-y max-h-32 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                  
                    {pur_req__list?.filter(
                      (e) =>
                        e?.pur_no?.toLowerCase().includes(pur_req||"") ||
                      e?.proj_name?.toLowerCase().includes(pur_req||"") ||
                        e?.prod_name
                          ?.toLowerCase()
                          .includes(pur_req?.toLowerCase()||"") ||
                        e?.prod_make
                          ?.toLowerCase()
                          .includes(pur_req?.toLowerCase()||"") ||
                        e.part_no
                          ?.toLowerCase()
                          .includes(pur_req?.toLowerCase()||"") ||
                        e?.article_no
                          ?.toLowerCase()
                          .includes(pur_req?.toLowerCase()||"") ||
                        e?.model_no
                          ?.toLowerCase()
                          .includes(pur_req?.toLowerCase()||"")
                    ).length > 0 &&
                      pur_req__list
                        ?.filter(
                          (e) =>
                            e?.pur_no?.toLowerCase().includes(pur_req?.toLowerCase()||"") ||
                          e?.proj_name?.toLowerCase().includes(pur_req?.toLowerCase()||"") ||
                            e?.prod_name
                              ?.toLowerCase()
                              .includes(pur_req?.toLowerCase()||"") ||
                            e?.prod_make
                              ?.toLowerCase()
                              .includes(pur_req?.toLowerCase()||"") ||
                            e?.part_no
                              ?.toLowerCase()
                              .includes(pur_req?.toLowerCase()||"") ||
                            e?.article_no
                              ?.toLowerCase()
                              .includes(pur_req?.toLowerCase()||"") ||
                            e?.model_no
                              ?.toLowerCase()
                              .includes(pur_req?.toLowerCase()||"")
                        )
                        ?.map((lst) => (
                          <li
                            onClick={(e) => {
                              console.log(lst);
                             
                              op_pur_req.current.hide(e);
                              setPurReq(lst.pur_no);
                              setPurCode(lst.pur_no);
                            }}
                                                            class="pb-3 cursor-pointer  hover:bg-[#C4F1BE] group active:bg-green-900 rounded-md hover:duration-300 sm:py-1.5"

                          >
                            <div class="flex items-center rtl:space-x-reverse">
                              <div class="flex-1 min-w-0">
                                <p class="text-sm p-0.5 w-full text-green-900 group-active:text-white truncate dark:text-white">
                                  {lst.pur_no}
                                </p>
                              </div>
                            </div>
                            {/* <hr className="text-green-900 border-gray-300  bg-green-900" /> */}
                          </li>
                        ))}
                    {pur_req__list?.filter(
                      (e) =>
                        e.pur_no?.toLowerCase().includes(pur_req||"") ||
                        e.prod_name
                          .toLowerCase()
                          .includes(pur_req?.toLowerCase()||"") ||
                        e.prod_make
                          .toLowerCase()
                          .includes(pur_req?.toLowerCase()||"") ||
                        e.part_no
                          .toLowerCase()
                          .includes(pur_req?.toLowerCase()||"") ||
                        e.article_no
                          .toLowerCase()
                          .includes(pur_req?.toLowerCase()||"") ||
                        e.model_no
                          .toLowerCase()
                          .includes(pur_req?.toLowerCase()||"")
                    ).length == 0 && <Empty />}
                  </ul>
                </OverlayPanel>
              
              </div>}
  
                      {!purCode ? <VError title={"Required"} /> : null}
                    </div>
                   
                  </div>
                </form>
  
                <div className="flex justify-center">
                  {/* <button
               
                    type="submit"
                    className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
                    onClick={() => {
                      onSubmit();
                    }}
                  >
                   <span class="relative z-10">
                           <SaveOutlined className='mr-2' />
                           Submit
                           </span>
                           <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
                  </button> */}
                  <BtnGroupReuse loading={loading} disabled={!purCode} text="Submit" onClick={() => {onSubmit();}} flag={1} icon={<SaveOutlined className='mr-2' />}/>
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
            <InfoTags color="white" text='Warehouse quantity of this product: ' />
            
              <ReportTemplate reportHeader={'Order Creation Report for '+pur_req} data={reportData} headers={headers} info={info} flag={1}/>
            </div>
          </div>
  
          </div>
      
                </div>
             
          }
      </section>
    );
  
}

export default Pr_ord_create