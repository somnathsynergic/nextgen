import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import BtnComp from "../../../Components/BtnComp";
import HeadingTemplate from "../../../Components/HeadingTemplate";
import VError from "../../../Components/VError";
import TDInputTemplate from "../../../Components/TDInputTemplate";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Message } from "../../../Components/Message";
import { url } from "../../../Address/BaseUrl";
import { Button, Divider, Empty, Popover, Spin, Tag, Tooltip } from "antd";
import {
    DropboxOutlined,
  LoadingOutlined,
  MinusOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
  StockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DialogBox from "../../../Components/DialogBox";
import PrintComp from "../../../Components/PrintComp";
import AuditTrail from "../../../Components/AuditTrail";
import { ListBox } from "primereact/listbox";
import moment from "moment";
import { OverlayPanel } from "primereact/overlaypanel";


function PtoPForm() {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [trans_no,setTransNo] = useState("")
    
    const [data, setData] = useState();
    const [products, setProducts] = useState([]);
    const [productList, setProductList] = useState([]);
    const [count, setCount] = useState(0);
    const [intended_for, setIntended] = useState("W");
    const [trans_dt,setTransDt] = useState(moment(new Date()).format("yyyy-MM-DD"))
    const [purpose, setPurpose] = useState("");
    const [projects, setProjects] = useState([]);
    const [cients, setClients] = useState([]);
    const [clientcode, setClientCode] = useState();
    const [projcode, setProjCode] = useState();
    const [productCode, setProductCode] = useState();
    const [projectList, setProjectList] = useState([]);
    const [clientList, setClientList] = useState([]);
    const [projectCopy, setProjectCopy] = useState([]);
    const [stockLoad,setStockLoad] = useState(false)
    const [wer_stock,setWerStock] = useState(0) 
    const [index,setIndex] = useState(0)
    const [client, setClient] = useState("");
    const [project, setProject] = useState("");
    const [from_project,setFromProject] = useState("")
    const [fromProjectCode,setFromProjectCode] = useState("")
    const [fromProjCopy,setFromProjCopy] = useState([])
  const det = JSON.parse(localStorage.getItem('perm'))

    const [proj_qty,setProjQty] = useState(0)
    const navigate = useNavigate();
    const [flag, setFlag] = useState(4);
    const op = useRef(null);
    const op1 = useRef(null);
    const op_from_proj = useRef(null);
    const [prev_req,setPrevReq] = useState([])
    const [logical_stock,setLogicalStock] = useState(0)
    const [physical_stock,setPhysicalStock] = useState(0)
    const [itemDtls, setItemDtls] = useState(params.id>0?[{ sl_no: 0, item_id: "", qty: 0,error:1 }]:[]);
    const content = (
        <div className={"grid grid-cols-3 gap-1 p-3 bg-green-100 rounded-lg"}>
           {!stockLoad ? (
             <>
               {" "}
               <Tag
                 className={"cursor-pointer col-span-1 px-2 py-0.5 shadow-lg"}
                 color="#eb8d00"
               >
                 <StockOutlined /> Physical Quantity : {physical_stock || 0}
               </Tag>
               <Tag
                 className={"cursor-pointer col-span-1 px-2 py-0.5 shadow-lg"}
                 color="#014737"
               >
                 <StockOutlined /> Logical Quantity : {logical_stock || 0}
               </Tag>
               <Tag
                 className={"cursor-pointer col-span-1 px-2 py-0.5 shadow-lg"}
                 color="#4FB477"
               >
                 <StockOutlined /> Requisition Quantity : {physical_stock-logical_stock || 0}
               </Tag>
             </>
           ) : (
             <span className="text-green-900 flex gap-2">
               Fetching
               <LoadingOutlined className="text-green-900" />
             </span>
           )}
         </div>
    );
    
    const check_item=(val)=>{
      axios.post(url+'/api/check_item',{item_id:+val,trans_no:'TPP-'}).then(res=>{
        console.log(res)
        setPrevReq(res?.data?.msg)
        if(res?.data?.msg?.length){
          setFlag(31)
        setVisible(true)
        }
      
      })
    }
    useEffect(() => {
      if(params.id>0){
          setItemDtls([])
      }
      else{
          setItemDtls([{ sl_no: 0, item_id: "", qty: 0,error:1 }])
      }
      
      axios.post(url + "/api/getproject", { id: 0 }).then((res) => {
        console.log(res);
        setProjects(res?.data?.msg);
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

          fromProjCopy.push({
            code: i.sl_no,
            name: i.proj_name,
            client: i.client_id,
          });
        }
      });
  
      axios.post(url + "/api/getclient", { id: 0 }).then((resC) => {
        console.log(resC);
        setClients(resC?.data?.msg);
        for (let i of resC?.data?.msg) {
          clientList.push({ code: i.sl_no, name: i.client_name });
        }
        setClientList(clientList);
      });
      axios.post(url + "/api/getproduct", { id: 0 }).then((resC) => {
        console.log(resC);
        setProducts(resC?.data?.msg);
        for (let i of resC?.data?.msg) {
          productList.push({ code: i.sl_no, name: i.prod_name });
        }
        setProductList(productList);
      });
      if(params.id>0){
          setLoading(true)
      axios.post(url+'/api/get_tpp_record',{id:params.id}).then(res=>{
          console.log(res)
          setLoading(false)
          setTransDt(res?.data?.msg?.trans_dt)
          setTransNo(res?.data?.msg?.trans_no)
          setIntended(res?.data?.msg?.intended_for)
          setProjCode(res?.data?.msg?.to_proj_id)
          setProject(res?.data?.msg?.proj_name)
          setClientCode(res?.data?.msg?.client_id)
          setClient(res?.data?.msg?.client_name)
          setPurpose(res?.data?.msg?.purpose)
          setFromProject(res?.data?.msg?.from_proj_name)
          setFromProjectCode(res?.data?.msg?.from_proj_id)
          axios.post(url+'/api/get_trans_items',{trans_no:res?.data?.msg?.trans_no}).then(resItems=>{
              console.log(resItems)
              resItems?.data?.msg.forEach(item=>
              setItemDtls((prev)=>[...prev,{
                  sl_no:item.sl_no,
                  item_id:item.item_id,
                  qty:item.qty,
                  error:1
              }
              ])
          )
          })
          
          // setcli(res?.data?.msg[0]?.intended_for)
      })
  
      }
    }, []);
    const onSubmit = () => {
      setLoading(true)
      axios.post(url+'/api/save_transfer_ptop',{sl_no:+params.id,user:localStorage.getItem('email'),trans_dt:trans_dt,intended_for:intended_for,from_project_id:fromProjectCode,client_id:0,project_id:+projcode,purpose:purpose,items:itemDtls}).then(res=>{
          setLoading(false)
          console.log(res)
          if(res?.data?.suc>0){
              navigate(-1)
              Message('success',res?.data.msg)
          }
          else{
              Message('error',res?.data.msg)
          }
         
      }).catch(err=>
              { 
                  setLoading(false)
                  navigate("/error" + "/" + err.code + "/" + err.message)});
    };
    const onDelete = () => {
      console.log(params.id);
      setVisible(true);
    };
    const removeDt = (index) => {
      let data = [...itemDtls];
      data.splice(index, 1);
      setItemDtls(data);
    };
    const handleDtBlur = (index, e) => {
      setLoading(true);
      console.log(itemDtls[index]);
      axios
        .post(url + "/api/get_logical_stock", {
          proj_id: +fromProjectCode,
          prod_id: +itemDtls[index].item_id,
        })
        .then((res) => {
          // console.log(res?.data?.msg[0]?.warehouse_stock);
          setLoading(false);
          if(e.target.value>0 && e.target.value<=(res?.data?.result?.msg[0]?.project_stock - res?.data?.req_stock||0)){
            itemDtls[index]['error']=0
          }
          else{
            itemDtls[index]['error']=1
  
          }
        });
    };
    const handleDtChange = (index, event) => {
      let data = [...itemDtls];
      if(event.target.name=='item_id'){
          check_item(event.target.value)
      }
  
      data[index][event.target.name] = +event.target.value;
      setItemDtls(data);
  
      console.log(data)
  
    }
    const deleteItem = () => {
      setLoading(true);
      //   console.log(params.id)
      //   setVisible(false)
      //   axios.post(url+'/api/deletecategory',{id:params.id,user:localStorage.getItem('email')}).then(res=>{
      //     console.log(res)
      //     setLoading(false)
      //     if(res.data.suc>0){
      //       Message('success',res.data.msg)
      //       navigate(-1)
      //     }
      //     else{
      //       Message('error',res.data.msg)
  
      //     }
      //   }).catch(err=>{console.log(err); navigate('/error'+'/'+err.code+'/'+err.message)});
    };
    // const validationSchema = Yup.object({
    //   catnm: Yup.string().required("Category name is required"),
    // });
    // const formik = useFormik({
    //   initialValues:(+params.id>0?formValues:initialValues),
    //   onSubmit,
    //   validationSchema,
    //   validateOnMount: true,
    //   enableReinitialize:true
    // });
    const addDt = (dt) => {
      setItemDtls([...itemDtls, dt]);
    };
    return (
      <section className="bg-transparent dark:bg-[#001529]">
        {/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
        <HeadingTemplate
          text={"Transfer"}
          mode={params.id > 0 ? 1 : 0}
          title={"Category"}
          data={params.id && data ? data : ""}
        />
        <div className="grid grid-cols-6 gap-2">
          <div className={"w-full col-span-6 bg-white p-6 rounded-2xl"}>
            <Spin
              indicator={<LoadingOutlined spin />}
              size="large"
              className="text-green-900 dark:text-gray-400"
              spinning={loading}
            >
               {params.id > 0 && (
                              <div className="sm:col-span-12 flex justify-end">
                                <Tag color="#014737">Transfer No.: {trans_no} </Tag>
                                </div>
               )}
              <form>
                <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
                  <div className="sm:col-span-12">
                    <TDInputTemplate
                      placeholder="Date"
                      type="date"
                      label="Date"
                      name="dt"
                      disabled
                      formControlName={
                        params.id == 0
                          ? moment(new Date()).format("yyyy-MM-DD")
                          : trans_dt
                      }
                      //   handleChange={formik.handleChange}
                      //   handleBlur={formik.handleBlur}
                      mode={1}
                    />
  
                    {/* {formik.errors.catnm && formik.touched.catnm ? (
                    <VError title={formik.errors.catnm} />
                  ) : null} */}
                  </div>
                  <div
                      className={
                        "sm:col-span-6 flex-col justify-end items-end"
                      }
                    >
                      <TDInputTemplate
                        placeholder="From Project"
                        type="text"
                        label="From Project"
                        name="proj"
                        disabled={
                          params.id > 0 
                        }
                        formControlName={from_project}
                        handleFocus={(e) => op_from_proj.current.show(e)}
                        handleChange={(txt) => {
                          console.log(txt);
                          setFromProject(txt.target.value);
                          if (txt.target.value.length) op_from_proj.current.show(txt);
                          else {
                            op_from_proj.current.hide(txt);
                            setFromProjectCode(0);
                          }
                          // setLoading(true);
                          // getItemDetails(txt.target.value);
                        }}
                        data={projectCopy}
                        mode={1}
                      />
  
                      <OverlayPanel
                        ref={op_from_proj}
                        className="w-[480px] border-2 bg-gray-200 border-green-900"
                      >
                        <span className="text-xs text-green-900 italic">
                          Search results for: "{from_project}"
                        </span>
                        <ul class=" divide-y max-h-48 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                          {projectCopy?.filter((e) =>
                            e.name?.toLowerCase().includes(from_project?.toLowerCase())
                          ).length > 0 &&
                          projectCopy
                              ?.filter((e) =>
                                e.name
                                  ?.toLowerCase()
                                  .includes(from_project?.toLowerCase())
                              )
                              ?.map((lst) => (
                                <li
                                  onClick={(e) => {
                                    op_from_proj.current.hide(e);
                                    setFromProject(lst.name);
                                    setFromProjectCode(lst.code);
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
                          {projectCopy.filter((e) =>
                            e.name?.toLowerCase().includes(project?.toLowerCase())
                          ).length == 0 && <Empty />}
                        </ul>
                      </OverlayPanel>
                      {!fromProjectCode && <VError title={"Required"} />}
                    </div>
                  {/* <div className={intended_for=='C'||intended_for=='A'?"sm:col-span-3":"sm:col-span-6"}>
                    <TDInputTemplate
                      placeholder="Intended for"
                      type="date"
                      label="Intented For"
                      name="intented_for"
                      formControlName={intended_for}
                      disabled={params.id>0}
                      handleChange={(txt) => {
                        setIntended(txt.target.value);
  
                        setClient("");
                        setClientCode(0);
                        setProjectList(projectCopy);
                      }}
                  
                      data={[
                        { code: "A", name: "Assembly Shop" },
                        { code: "C", name: "Client" },
                      ]}
                      mode={2}
                    />
  
                  
                  </div>
                 
                  {intended_for == "C" && (
                    <div className={"sm:col-span-3"}>
                      <TDInputTemplate
                        placeholder="Client"
                        type="text"
                        label="Client"
                        name="client"
                        disabled={params.id > 0}
                        formControlName={client}
                        handleFocus={(e) => op1.current.show(e)}
                        handleChange={(txt) => {
                          console.log(txt);
                          setClient(txt.target.value);
  
                          if (txt.target.value.length) op1.current.show(txt);
                          else {
                            op1.current.hide(txt);
                            setClientCode(0);
                          }
                          
                        }}
                        data={clientList}
                        mode={1}
                      />
                      <OverlayPanel
                        ref={op1}
                        className="w-[310px] border-2 bg-gray-200 border-green-900"
                      >
                        <span className="text-xs text-green-900 italic">
                          Search results for: "{client}"
                        </span>
                        <ul class=" divide-y max-h-48 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                          {clientList?.filter((e) => e.name.includes(client))
                            ?.length > 0 &&
                            clientList
                              ?.filter((e) => e.name.includes(client))
                              ?.map((lst) => (
                                <li
                                  onClick={(e) => {
                                    op1.current.hide(e);
                                    setClient(lst.name);
                                    setClientCode(lst.code);
                                    setProjectList(
                                      projectCopy.filter(
                                        (e) => e.client == lst.code
                                      )
                                    );
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
                                </li>
                              ))}
                          {clientList.filter((e) => e.name.includes(client))
                            .length == 0 && <Empty />}
                        </ul>
                      </OverlayPanel>
                      {!clientcode && <VError title={"Required"} />}
                    </div>
                  )} */}
                 
                  
                    <div
                      className={
                        "sm:col-span-6 flex-col justify-end items-end "
                      }
                    >
                      <TDInputTemplate
                        placeholder="To Project"
                        type="text"
                        label="To Project"
                        name="proj"
                        disabled={
                          params.id > 0 
                        }
                        formControlName={project}
                        handleFocus={(e) => op.current.show(e)}
                        handleChange={(txt) => {
                          console.log(txt);
                          setProject(txt.target.value);
                          if (txt.target.value.length) op.current.show(txt);
                          else {
                            op.current.hide(txt);
                            setProjCode(0);
                          }
                          // setLoading(true);
                          // getItemDetails(txt.target.value);
                        }}
                        data={projectList}
                        mode={1}
                      />
  
                      <OverlayPanel
                        ref={op}
                        className="w-[480px] border-2 bg-gray-200 border-green-900"
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
                                    op.current.hide(e);
                                    setProject(lst.name);
                                    setProjCode(lst.code);
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
                    </div>
                
  
                  <div className={"sm:col-span-12"}>
                    <TDInputTemplate
                      placeholder="Purpose"
                      type="text"
                      label="Purpose"
                      name="purpose"
                      formControlName={purpose}
                      handleChange={(txt) => setPurpose(txt.target.value)}
                      mode={1}
                    />
                 
                  </div>
                </div>
                <Divider />
                {/* <div className="grid gap-2 rounded-lg shadow-lg bg-gray-200 p-5 sm:grid-cols-12 items-end sm:gap-6"> */}
                <table className="w-full my-2 border-separate border border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400">
                  <thead className="text-xs bg-[#C4F1BE] font-bold uppercase text-green-900 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-1.5 w-1/6 text-center font-bold"
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-1.5 w-1/6 text-center font-bold"
                      >
                        Quantity
                      </th>
                     
                        <th
                        scope="col"
                        className="px-6 py-1.5 w-1/6 text-center font-bold"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  {itemDtls.map((item, index) => (
                    <>
                     
                      <tbody>
                        <tr className="bg-[#DDEAE0] border-b-2 text-center border-white my-3 font-bold dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-4 w-1/3  py-1.5 flex-wrap justify-between gap-10 items-center  text-gray-900  dark:text-white"
                          >
                  <div className="flex justify-end float-end items-center gap-1">
                      <a
                         className="ml-52 float-end z-10 -mt-2 -mb-7"
                         onClick={() => {
                           setFlag(25);
                           setIndex(index)
                           setVisible(true)
                         }}
                       >
                       <Tooltip title="Search item">
                         <Tag className="ml-1 border border-transparent  rounded-full  bg-transparent w-4 h-4 flex justify-center items-center" > <SearchOutlined className="text-green-900  font-bold text-xs -mt-5"/></Tag>
                         </Tooltip>
                       </a>
                       {item.item_id && fromProjectCode &&
                         <Popover
                         content={content}
                         title={"Stock level"}
                         trigger="click"
                       >
                      
                       <span   onClick={() => {
                             // setProjStock(items?.filter(e=>e.sl_no==item.item_id)[0]?.project_stock)
                             // setWerStock(items?.filter(e=>e.sl_no==item.item_id)[0]?.warehouse_stock)
                             setStockLoad(true);
                             axios
                               .post(url + "/api/get_logical_stock", {
                                 proj_id: +fromProjectCode,
                                 prod_id: +item.item_id,
                               })
                               .then((res) => {
                                 console.log(res);
                                 setStockLoad(false);
                                 setStockLoad(false);
                                 setLogicalStock(res?.data?.result?.msg[0]?.project_stock - (res?.data?.req_stock||0))
                                 setPhysicalStock(res?.data?.result?.msg[0]?.project_stock)
                                 setProjQty(
                                   res?.data?.result?.msg[0]?.project_stock - (res?.data?.req_stock||0)
                                 );
                                
                               });
                           }} className=" float-end -mt-2 -mb-7 cursor-pointer">
                      
                       {/* <Tag className="ml-1 hover:scale-110 text-md border-gray-200  rounded-full  bg-gray-200 w-8 h-8 flex justify-center items-center" > 
                          <DropboxOutlined className="text-lg"/>
                          </Tag> */}
                       
                       </span>
                       
                       </Popover>
                       }
                       </div>
                        <TDInputTemplate
                          placeholder="Item"
                          type="text"
                          label=" "
                          name="item_id"
                          formControlName={item.item_id}
                          handleChange={(txt) => handleDtChange(index,txt)}
                          mode={2}
                          data={productList}
                        />
                        {/* {!purpose && <VError title={"Required"} />} */}
                        </th>
                        <th
                            scope="row"
                            className="px-4 w-1/3  py-1.5 flex-wrap justify-between gap-10 items-center  text-gray-900  dark:text-white"
                          >
                      <div className={"sm:col-span-5 border-2"}>
                        <TDInputTemplate
                          placeholder="Quantity"
                          type="number"
                          label=""
                          name="qty"
                          formControlName={item.qty}
                          disabled={params.id>0}
                          handleChange={(txt) => handleDtChange(index,txt)}
                          handleBlur={(txt) => handleDtBlur(index, txt)}

                          mode={1}
                        />
                         {itemDtls[index]['error']==1 && <VError title={"Quantity should >0 and <=project stock"} />}
                      </div>
                      </th>
                      <th
                            scope="row"
                            className="px-4 w-1/3 grid-cols-2 py-1.5 flex-nowrap  justify-between gap-5 items-center  text-gray-900  dark:text-white"
                          >
                      <div className={"sm:col-span-1 "}>
                        <Button
                          className="rounded-full bg-green-900 text-white"
                          onClick={() => {
                            addDt({ sl_no: 0, item_id: "", qty: 0,error:1 });
                          }}
                          icon={<PlusOutlined />}
                        ></Button>
                      </div>{" "}
                      <div className={"sm:col-span-1"}>
                        {itemDtls.length > 1 && (
                          <Button
                            className="rounded-full text-white bg-red-800 border-red-800"
                            onClick={() => removeDt(index)}
                            icon={<MinusOutlined />}
                          ></Button>
                        )}
                        {/* {!purpose && <VError title={"Required"} />} */}
                      </div>
                      </th>
                      </tr>
                      </tbody>
                    </>
                  ))}  
                  </table>                
                {/* </div> */}
           
              </form>
              <div className="flex justify-center gap-3 items-center">
              <div className="mx-auto">
                <div className="flex justify-center gap-2 items-center mx-auto">
               
                  {params.id==0 &&  <button
                      // disabled={errorSum(error) || !intended}
                      onClick={() => onSubmit()}
                      className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"

                    disabled={
                      det.stock==1 ||
                      !intended_for || !projcode || (intended_for=='C'&&!clientcode) || !fromProjectCode ||
                      // itemDtls.reduce(=>)
                      itemDtls.reduce((accumulator, item) => {
                         return accumulator + item.error
                      }, 0)>0
                      }

                    >
                     
                             <span class="relative z-10">
                             <SaveOutlined className='mr-2' />
                             Submit
                             </span>
                             <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
                    </button>}
                 
                  {/* {approve_flag != "A" && params.id > 0 && (
                    <button
                    
                      onClick={() => {
                        setFlag(4);
                        setVisible(true);
                      }}
                      className=" disabled:bg-gray-400 mx-auto disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                    >
                      <DeleteOutlined className="mr-1" />
                      Delete
                    </button>
                  )} */}
                 
                </div>
              </div>
              </div>
            </Spin>
          </div>
        </div>
        <DialogBox
        visible={visible}
        flag={flag}
        data={flag!=31?{ info: products, infoCopy: products }:prev_req}
        onPress={() => setVisible(false)}
        onSearch={(val) => {
          console.log(val);
          let data = [...itemDtls];
          data[index]["item_id"] = val;
          setItemDtls(data);
          setVisible(false);
          console.log(data);
          check_item(val);
          //   localStorage.setItem("itemList", JSON.stringify(data));
        }}
        onDelete={() => deleteItem()}
      />
      </section>
    );
}

export default PtoPForm
