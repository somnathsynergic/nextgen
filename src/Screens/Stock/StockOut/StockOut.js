import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import HeadingTemplate from "../../../Components/HeadingTemplate";
import VError from "../../../Components/VError";
import TDInputTemplate from "../../../Components/TDInputTemplate";
import axios from "axios";
import { Message } from "../../../Components/Message";
import { url } from "../../../Address/BaseUrl";
import { Empty, Spin, Tag, Tooltip } from "antd";
import {
  ArrowUpOutlined,
  BorderOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  SaveOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import PrintComp from "../../../Components/PrintComp";
import { OverlayPanel } from "primereact/overlaypanel";
import moment from "moment";
// import StockInViewComp from "../../../Components/StockInViewComp";
import StockOutComponent from "../../../Components/StockOutComponent";

function StockOut() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [projcode, setProjCode] = useState();
  const [out_from,setOutFrom] = useState("")
  const [projectCopy, setProjectCopy] = useState([]);
  const [products, setProducts] = useState([]);
  const [prodList, setProdList] = useState([]);
  const [showProd, setShowProd] = useState(false);
  const [prodVal, setProdVal] = useState("");
  const [prodCode, setProdCode] = useState();
  const [dt, setDt] = useState(moment(new Date()).format("yyyy-MM-DD"));
  const [clicked, setClicked] = useState(true);
  const [req_person, setReqPerson] = useState(
    localStorage.getItem(localStorage.getItem("email"))
  );
  const op = useRef(null);
  const op1 = useRef(null);

  const [reportData, setReportData] = useState([]);
  const [reportDataCopy, setReportDataCopy] = useState([]);
  const [info, setInfo] = useState([]);

  const headers = [
    { name: "serial_number", value: "#" },
    { name: "prod_name", value: "Product" },
    { name: "proj_name", value: "Project" },
    { name: "req_stock", value: "Requisition Quantity" },
    { name: "project_stock", value: "Project quantity" },

    // { name: "created_by", value: "Created by" },
  ];
  useEffect(() => {
    axios.post(url + "/api/getproject", { id: 0 }).then((res) => {
      console.log(res);
      setProjectData(res?.data?.msg);
      for (let i of res?.data?.msg) {
        projectList.push({
          code: i.sl_no,
          name: i.proj_name,
          client: i.client_id,
        });
        projectCopy.push({
          code: i.sl_no,
          name: i.proj_name,
          client: i.client_id,
        });
        // projectList.push({ value: i.sl_no, label: i.proj_name });
      }
    });

    setReqPerson(localStorage.getItem("email"));
  }, []);
  useEffect(() => {
    setLoading(true);
    axios.post(url + "/api/getproduct", { id: 0 }).then((res) => {
      console.log(res);
      setLoading(false);
      setProducts(res?.data?.msg);
      for (let i of res?.data?.msg) {
        prodList.push({
          code: i.sl_no,
          name: i.prod_name,
          part_no: i.part_no,
          make: i.prod_make,
          article_no: i.article_no,
          model_no: i.model_no,
        });
      }
    });
  }, []);
  const onSubmit = (values) => {
    setInfo([
      { key: "1", label: "Date", children: <p>{dt}</p> },
      { key: "2", label: "Item", children: <p>{prodVal}</p> },
    ]);
    setLoading(true);
    // axios
    //   .post(url + "/api/itemwisestockin", { item_id: prodCode, dt: dt })
    //   .then((res) => {
    //     console.log(res);
    //     setReportData(res?.data?.msg)
    //     setLoading(false);
    //     if(res?.data?.msg?.length==0){
    //         Message('error','No Data')
    //     }
    //     // else{
    //     //     setClicked(!clicked)
    //     // }
    //   });

    axios
      .post(url + "/api/get_stock_out_data", { dt: dt, proj_id: projcode })
      .then((res) => {
        console.log(res);
        setReportData(res?.data?.msg);
        setReportDataCopy([])
       res?.data?.msg?.forEach(e=>{
            setReportDataCopy(prev=>[...prev,{
              id:e.id,
              name:e.name,
              stock:e.stock,
              req_stock:e.req_stock || 0,
              stock_out:0,
              error:0,
              req_no:e.req_no,
              req_list:e.req_list.filter(item=>item.copy_qty-item.del_qty>0)
            }])
        }
      )
        setLoading(false);
        if (res?.data?.msg?.length == 0) {
          Message("error", "No Data");
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
        text={"Stock Out"}
        mode={1}
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
              ? "w-full -mt-3 col-span-6  bg-white p-6 rounded-2xl delay-100 duration-300"
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
                      placeholder="Date"
                      type="date"
                      label="Date"
                      name="dt"
                      disabled={true}
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
                    <TDInputTemplate
                      placeholder="Stock out from"
                      type="text"
                      label="Stock out from"
                      name="out_from"
                      formControlName={out_from}
                      handleChange={(txt) => {
                         setOutFrom(txt.target.value);
                         setProjCode(0);
                         
                      }}
                      mode={2}
                      data={[{code:'W',name:'Warehouse'},{code:'P',name:'Project'}]}
                    />

                    {!out_from ? <VError title={"Required"} /> : null}
                  </div>
                  {out_from=='P' && <div
                    className={"sm:col-span-2 flex-col justify-end items-end "}
                  >
                    <TDInputTemplate
                      placeholder="Project"
                      type="text"
                      label="Project"
                      name="proj"
                      disabled={params.id > 0}
                      formControlName={project}
                      handleFocus={(e) => op1.current.show(e)}
                      handleChange={(txt) => {
                        console.log(txt);
                        setProject(txt.target.value);
                        if (txt.target.value.length) op1.current.show(txt);
                        else {
                          op1.current.hide(txt);
                          setProjCode(0);
                        }
                        // setLoading(true);
                        // getItemDetails(txt.target.value);
                      }}
                      data={projectList}
                      mode={1}
                    />

                    <OverlayPanel
                      ref={op1}
                      className="w-[985px] border-2 bg-gray-200 border-green-900"
                    >
                      <span className="text-xs text-green-900 italic">
                        Search results for: "{project}"
                      </span>
                      <ul class=" divide-y max-h-48 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                        {projectList?.filter((e) =>
                          e.name?.toLowerCase().includes(project?.toLowerCase())
                        ).length > 0 &&
                          projectList
                            ?.filter((e) =>
                              e.name
                                ?.toLowerCase()
                                .includes(project?.toLowerCase())
                            )
                            ?.map((lst) => (
                              <li
                                onClick={(e) => {
                                  op1.current.hide(e);
                                  setProject(lst.name);
                                  setProjCode(lst.code);
                                  // getItemDetails(lst.code);
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
                          e.name?.toLowerCase().includes(project?.toLowerCase())
                        ).length == 0 && <Empty />}
                      </ul>
                    </OverlayPanel>
                    {!projcode && <VError title={"Required"} />}
                    {projcode > 0 && (
                      <span className="flex justify-between mt-1 items-center">
                        <a
                        // onClick={() => {
                        //   setFlag(17);
                        //   setVisible(true);
                        // }}
                        >
                          {/* <Tag color="#eb8d00">Project ID: {projID}</Tag> */}
                        </a>
                      </span>
                    )}
                  </div>}

                  {/* <div className="sm:col-span-2">
             <TDInputTemplate
                    placeholder="Search by item, part no., model no., article no., make..."
                    type="text"
                    label="Items"
                    name="prod"
                    formControlName={prodVal}
                    handleFocus={e=>op.current.show(e)}
                    handleChange={(txt) => {
                      console.log(txt);
                      setProdVal(txt.target.value);
                      if(txt.target.value.length)
                        op.current.show(txt)
                      else{
                      op.current.hide(txt)
                      setProdCode()
                      }
                    
                    }}
                    data={prodList}
                    mode={1}
                  />
                    {!prodCode ? <VError title={"Required"} /> : null}
                

<OverlayPanel ref={op} className='w-[470px] border-2 bg-gray-200 border-green-900'>
   <span className='text-xs text-green-900 italic'>Search results for: "{prodVal}"</span>
        <ul class=" divide-y max-h-48 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
        {prodList?.filter(e=>e.name?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.part_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.part_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.model_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.article_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.make?.toLowerCase().includes(prodVal?.toLowerCase()) ).length>0 && prodList?.filter(e=>e.name?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.part_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.part_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.model_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.article_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.make?.toLowerCase().includes(prodVal?.toLowerCase()) )?.map(lst=><li onClick={(e)=>{op.current.hide(e);setProdVal(lst.name);setProdCode(lst.code) }} class="pb-3 cursor-pointer  hover:bg-[#C4F1BE] rounded-md hover:duration-300 sm:pb-4">
            <div class="flex items-center rtl:space-x-reverse">
            
             <div class="flex-1 min-w-0">
                <p class="text-sm font-bold p-0.5 w-full text-green-900 truncate dark:text-white">
                 {lst.name}
                </p>
               
              </div>
            
            </div>
          </li>)}
         {prodList.filter(e=>e.name?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.part_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.part_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.model_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.article_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.make?.toLowerCase().includes(prodVal?.toLowerCase()) ).length==0 && <Empty/>}
        </ul>
      </OverlayPanel>
              </div> */}
                  <div className="sm:col-span-2">
                    <TDInputTemplate
                      placeholder="Requisition given by"
                      type="text"
                      label="Requisition given by"
                      name="dt"
                      disabled={true}
                      formControlName={localStorage.getItem("email")}
                      // handleChange={localStorage.getItem('email')}
                      mode={1}
                    />

                    {!req_person ? <VError title={"Required"} /> : null}
                  </div>
                </div>
              </form>
              <div className="flex justify-center items-center">
                <button
                  disabled={(out_from=='P' && !projcode)|| !out_from}
                  type="submit"
                  className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                  onClick={() => onSubmit()}
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
      {reportData.length > 0 && (
        <div
          className={
            clicked ? "grid grid-cols-6 gap-2 my-3" : "grid grid-cols-6 gap-2"
          }
        >
          <div className="w-full col-span-6 bg-white p-2 rounded-2xl ">
            <div className="w-full col-span-6 bg-white p-6 rounded-2xl ">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                {/* <Tag color="#014737">Warehouse quantity of this product: {reportData[0].warehouse_stock || 0}</Tag> */}
                <Spin
              indicator={<LoadingOutlined spin />}
              size="large"
              className="text-green-900 dark:text-gray-400"
              spinning={loading}
            >
                <StockOutComponent
                  data={reportDataCopy}
                  headers={headers}
                  onPress={(values)=>{
                    console.log(values)
                    setLoading(true)
                    axios.post(url+'/api/save_stock_out',{
                      proj_id:projcode,
                      dt:dt,
                      user:localStorage.getItem('email'),
                      items:values
                    }).then(res=>{
                      setLoading(false)
                      if(res?.data?.suc>0){
                        Message('success',res?.data?.msg)
                        // setClicked(!clicked)
                        setProjCode(0)
                        setProject("")
                        setReportData([])

                      }
                      else{
                        Message('error',res?.data?.msg)
 
                      }
                    })
                  
                  
                  }}
                  info={info}
                  // wStock={reportData[0].warehouse_stock || 0}
                  proj_id={projcode}
                  flag={2}
                />
                 </Spin>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default StockOut;
