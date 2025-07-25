import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import HeadingTemplate from "../../Components/HeadingTemplate";
import VError from "../../Components/VError";
import TDInputTemplate from "../../Components/TDInputTemplate";
import axios from "axios";
import { Message } from "../../Components/Message";
import { url } from "../../Address/BaseUrl";
import { Empty, Spin, Tooltip } from "antd";
import {
    ArrowUpOutlined,
  LoadingOutlined,
  SaveOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { OverlayPanel } from "primereact/overlaypanel";
import ReportTemplate from "../../Components/ReportTemplate";
import BtnGroupReuse from "../../Components/BtnGroupReuse";
import InfoTags from "../../Components/InfoTags";
import { formatDate } from "../../Functions/formatDate";
import SpinComp from "../../Components/SpinComp";

function AllStock() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [showProj, setShowProj] = useState(false);
  const [projVal, setProjVal] = useState("");
  const [projCode, setProjCode] = useState();
  const [type, setType] = useState("");
  const [dt, setDt] = useState(formatDate(new Date(),"yyyy-MM-DD"));
  const [clicked, setClicked] = useState(true);
  const [reportData,setReportData] = useState([])
  const op = useRef(null);
  const [info,setInfo] = useState([])
  const [projId,setProjId] = useState("")
  const headers= [
    // { name:'#',value:'#'},
    { name: "Product", value: "Product" },
    { name: "Quantity", value: "Quantity" },

    // { name: "created_by", value: "Created by" },
  ]
  useEffect(() => {
    
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
      {/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
      <HeadingTemplate
        text={"All-Stock Report"}
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
            <SpinComp
              loading={loading}
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
                      min={formatDate(
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 3)
                        )
                     ,"yyyy-MM-DD")} //may need to change
                      max={formatDate(new Date(),"yyyy-MM-DD")} 
                    />

                    {!dt ? <VError title={"Required"} /> : null}
                  </div>
                  <div className="sm:col-span-1">
                    <TDInputTemplate
                      placeholder="Type"
                      type="date"
                      label="Type"
                      name="type"
                      formControlName={type}
                      handleChange={(txt) => {setType(txt.target.value);setProjCode();setProjVal("");setProjId("")}}
                      mode={2}
                      data={[
                        { code: "P", name: "Project Stock" },
                        { code: "W", name: "Warehouse Stock" },
                      ]}
                    />

                    {!type ? <VError title={"Required"} /> : null}
                  </div>
                  <div className="sm:col-span-2">
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
                      {!projCode && type=='P' ? <VError title={"Required"} /> : null}
                      {/* {projId ? <Tag className="bg-amber-600 text-white">Project ID:{projId}</Tag> : null} */}
                      {projId ? <InfoTags bgCol="bg-amber-600 text-white" text={'Project ID:'+projId} /> : null}

                    <OverlayPanel
                      ref={op}
                      className="w-[980px] border-2 bg-gray-50 border-[#C4F1BE]"
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
                                                                class="pb-3 cursor-pointer  hover:bg-[#C4F1BE] group active:bg-green-900 rounded-md hover:duration-300 sm:py-1.5"

                              >
                                <div class="flex items-center rtl:space-x-reverse">
                                  <div class="flex-1 min-w-0">
                                    <p class="text-sm p-0.5 w-full text-green-900 group-active:text-white truncate dark:text-white">
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
                </div>

                {/* <BtnComp mode={params.id>0?'E':'A'} onReset={formik.handleReset}/> */}
              </form>

              <div className="flex justify-center">
                {/* <button
                disabled={!dt ||  !type || (type=='P' && !projCode)}
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
                <BtnGroupReuse loading={loading} icon={<SaveOutlined className='mr-2' />} flag={1} text="Submit" disabled={!dt ||  !type || (type=='P' && !projCode)}  onClick={() => {
                    onSubmit();
                  }}/>
              </div>
            </SpinComp>
          )}
          {!clicked && <SnippetsOutlined />}
        </div>
      </div>
      {reportData.length>0 &&   <div className={clicked?"grid grid-cols-6 gap-2 my-3":"grid grid-cols-6 gap-2"}>
              <div className='w-full col-span-6 bg-white p-2 rounded-2xl '>
         

              <div className="w-full col-span-6 bg-white p-6 rounded-2xl ">
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          {/* <Tag color="white" >Warehouse quantity of this product: </Tag> */}
          <InfoTags color="white" text='Warehouse quantity of this product:' />
          
            <ReportTemplate data={reportData} reportHeader={'Stock for '+(projVal||'Warehouse')} headers={headers} info={info} flag={1}/>
          </div>
        </div>

        </div>
    
              </div>
           
        }
    </section>
  );
}

export default AllStock;
