import React, { useEffect, useRef, useState } from "react";
import TDInputTemplate from "../TDInputTemplate";
import VError from "../../Components/VError";
import { useParams } from "react-router-dom";
import { url } from "../../Address/BaseUrl";
import axios from "axios";
import { BlockUI } from "primereact/blockui";

import { Empty, Spin } from "antd";
import {
  ArrowRightOutlined,
  CloseCircleFilled,
  LoadingOutlined,
  PlusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import Viewdetails from "../Viewdetails";
import DialogBox from "../DialogBox";
import moment from "moment";
import DrawerComp from "../DrawerComp";
import { Tag } from "antd";
import { OverlayPanel } from "primereact/overlaypanel";
import { Chip } from "primereact/chip";

function BasicDetails({ pressNext, pressBack, data }) {
  console.log(data);
  const [blocked, setBlocked] = useState(false);
  const params = useParams();
  const [projectList, setProjectList] = useState([]);
  const [projects, setProjects] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorsList, setVendorList] = useState([]);
  const det = JSON.parse(localStorage.getItem("perm"));
  const [pur_req__list, setPurReqList] = useState([]);
  const [pur_req__listCopy, setPurReqListCopy] = useState([]);
  const [pur_req_items, setPurReqItems] = useState([]);
  const [pur_req, setPurReq] = useState("");

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(data.type);
  const [proj_name, setProjName] = useState(data.proj_name);
  const [order_id, setOrderId] = useState(data.order_id);
  const [order_date, setOrderDate] = useState(data.order_date);
  const [vendor_name, setVendorName] = useState(data.vendor_name);
  const [vend_ref, setVendRef] = useState(data.vend_ref);
  const [po_issue_date, setPoIssueDate] = useState(data.po_issue_date);
  const [bank, setBank] = useState([]);
  const [visible, setVisible] = useState(false);
  const [projectInfo, setProjectInfo] = useState([]);
  const [vendorInfo, setVendorInfo] = useState([]);
  const [pocList, setPoc] = useState([]);
  const [deals, setDeals] = useState([]);
  const [vendorPocList, setPocList] = useState([]);
  const [flag, setFlag] = useState(0);
  const [val, setVal] = useState();
  const [po_no, setPoNo] = useState(data.po_no);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(0);
  const [count, setCount] = useState(0);
  const [checkLoad, setCheckLoad] = useState(false);
  const [projCode, setProjCode] = useState();
  const [vendorCode, setVendorCode] = useState();
  const [purCode, setPurCode] = useState();
  const [projID,setProjID] = useState("")
  const op_project = useRef(null);
  const op_vendor = useRef(null);
  const op_pur_req = useRef(null);
  const [selectedList,setSelectedList] = useState(JSON.parse(data?.pur_req) ||[])
  const [selectedListCopy,setSelectedListCopy] = useState(JSON.parse(data?.pur_req) ||[])
  var purList = []
  
  const showDrawer = () => {
    setOpen(true);
  };
  const checkid = () => {
    if (po_no) {
      setCheckLoad(true);
      axios.post(url + "/api/check_po_no", { po_no: po_no }).then((res) => {
        console.log(res.data.msg[0].count);
        setCheckLoad(false);
        setCount(res.data.msg[0].count);
      });
    }
  };
  const onClose = () => {
    setOpen(false);
    if (mode == 1) {
      setLoading(true);

      vendorsList.length = 0;
      setVendorList([]);
      axios.post(url + "/api/getvendor", { id: 0 }).then((resVendor) => {
        setVendorList(resVendor?.data?.msg);
        setVendors(resVendor?.data?.msg);
        for (let i = 0; i < resVendor?.data?.msg?.length; i++) {
          vendorsList.push({
            name: resVendor?.data?.msg[i].vendor_name,
            code: resVendor?.data?.msg[i].sl_no,
          });
        }
        setLoading(false);
        setVendorList(vendorsList);
      });
    }
    if (mode == 2) {
      projectList.length = 0;
      setProjects([]);
      setLoading(true);
      axios.post(url + "/api/getproject", { id: 0 }).then((resProj) => {
        setProjects(resProj?.data?.msg);
        for (let i = 0; i < resProj?.data?.msg?.length; i++) {
          projectList.push({
            name: resProj?.data?.msg[i].proj_name,
            code: resProj?.data?.msg[i].sl_no,
            proj_id: resProj?.data?.msg[i].proj_id,
          });
        }
        setProjectList(projectList);
        setLoading(false);
      });
    }
  };
  console.log(params.id, params.flag);
  const onSubmit = () => {
    console.log(type, proj_name, order_id, order_date, vendor_name, pur_req);
    if (type != "P") {
      if (type && vendorCode && vend_ref) {
        // if (type && vendorCode && vend_ref) {
        if (params.flag == "E") {
          if (po_no && count == 0) {
            setVal({
              type: type,
              proj_name: proj_name,
              order_date: order_date,
              order_id: order_id,
              vendor_name: vendor_name,
              vend_ref: vend_ref,
              po_no: po_no,
              pur_req: pur_req,
            });
            pressNext(val, pur_req);
          }
        } else {
          setVal({
            type: type,
            proj_name: proj_name,
            order_date: order_date,
            order_id: order_id,
            vendor_name: vendor_name,
            po_no: po_no,
            vend_ref: vend_ref,
            pur_req: selectedList,
          });
          pressNext(val, selectedList);
        }
      }
    } else {
      console.log("if 1");
      if (type && vendorCode && projCode && vend_ref ) {
        if (params.flag == "E") {
          if (po_no) {
            setVal({
              type: type,
              proj_name: proj_name,
              order_date: order_date,
              order_id: order_id,
              vendor_name: vendor_name,
              po_no: po_no,
              vend_ref: vend_ref,
              pur_req: selectedList,
            });
            pressNext(val);
          }
        } else {
          console.log("if 2");
          setVal({
            type: type,
            proj_name: proj_name,
            order_date: order_date,
            order_id: order_id,
            vendor_name: vendor_name,
            po_no: po_no,
            vend_ref: vend_ref,
            pur_req: selectedList,
          });
          console.log(
            type,
            proj_name,
            order_date,
            order_id,
            vendor_name,
            po_no,
            vend_ref,
            pur_req
          );
          pressNext(val, selectedList);
        }
      }
    }
  };
  useEffect(() => {
    if(params.id>0)
    setBlocked((det.po == 1 || (localStorage.getItem('manager_email')!='FFABC123' && localStorage.getItem('manager_email')!=localStorage.getItem('email'))) ? true : false);
    else{
      setBlocked(false)
    }
    


    // alert("hii")
    console.log(
      projectList.filter((e) => e.code == +localStorage.getItem("proj_name"))[0]
        ?.name
    );

    setProjCode(localStorage.getItem("proj_name"));
    setProjName(
      projectList.filter((e) => e.code == +localStorage.getItem("proj_name"))[0]
        ?.name
    );
    setVendorName(localStorage.getItem("vendor_name"));
    setOrderDate(localStorage.getItem("order_date"));
    setOrderId(localStorage.getItem("order_id"));
    setType(localStorage.getItem("order_type"));
    setPoIssueDate(localStorage.getItem("po_issue_date"));
    setVendRef(localStorage.getItem("vend_ref"));
    setPoNo(localStorage.getItem("po_no"));
    setSelectedList(JSON.parse(localStorage.getItem('pur_req')))
    // setPurReq(localStorage.getItem("pur_req"));
    // setPurCode(localStorage.getItem("pur_req"));
    setPurReq(localStorage.getItem(""));
    setPurCode(localStorage.getItem(""));
    // localStorage.setItem("pur_req",JSON.stringify(selectedList));
    setProjID(projectList.filter((e) => e.code == +projCode)[0]?.projID)

    purList=[]
  }, [data.type]);

  const addItem = (lst) => {
    setSelectedList(prev => [...prev, lst.pur_no]);

  };
  const closeItem = (index)=>{
    let dt = [...selectedList]
    dt.splice(index,1)
    setSelectedList(dt)
  }
  useEffect(()=>{
    console.log(selectedList)
    localStorage.setItem("pur_req",JSON.stringify(selectedList));
  },[])
  useEffect(()=>{
    console.log(selectedList)

    localStorage.setItem("pur_req",JSON.stringify(selectedList));
  },[selectedList])
  useEffect(() => {
    setLoading(true);
    console.log(proj_name);
    setVendorList([]);
    setVendors([]);
    setProjects([]);
    setProjectList([]);
    setPurReqList([]);
    setPurReqItems([]);

    const date = new Date();
    console.log(date);
    if (
      params.id == 0 &&
      (localStorage.getItem("po_issue_date") == "null" ||
        !localStorage.getItem("po_issue_date"))
    ) {
      setPoIssueDate(moment(date).format("yyyy-MM-DD"));
      localStorage.setItem("po_issue_date", moment(date).format("yyyy-MM-DD"));
    }
    axios.post(url + "/api/getproject", { id: 0 }).then((resProj) => {
      console.log(resProj);
      setProjects(resProj?.data?.msg);

      for (let i of resProj?.data?.msg) {
        projectList.push({
          name: i.proj_name,
          code: i.sl_no,
          projID:i.proj_id
        });
      }
      setProjectList(projectList);
      // console.log(projectList)

      axios.post(url + "/api/getvendor", { id: 0 }).then((resVendor) => {
        setVendorList(resVendor?.data?.msg);
        setVendors(resVendor?.data?.msg);
        for (let i = 0; i < resVendor?.data?.msg?.length; i++) {
          vendorsList.push({
            name: resVendor?.data?.msg[i].vendor_name,
            code: resVendor?.data?.msg[i].sl_no,
          });
        }
        setVendorList(vendorsList);
        setVendorInfo(
          resVendor?.data?.msg?.filter((e) => e.sl_no == data.vendor_name)
        );
        setProjectInfo(
          resProj?.data?.msg.filter((e) => e.sl_no == +data.proj_name)
        );
        console.log(
          resProj?.data?.msg.filter((e) => e.sl_no == +data.proj_name),
          data.proj_name,
          "projectinfo",
          resProj,
          resVendor
        );
        setProjCode(localStorage.getItem("proj_name"));
        setProjName(
          projectList.filter(
            (e) => e.code == +localStorage.getItem("proj_name")
          )[0]?.name
        );
        setVendorCode(localStorage.getItem("vendor_name"));
        setVendorName(
          vendorsList.filter(
            (e) => e.code == +localStorage.getItem("vendor_name")
          )[0]?.name
        );
        axios
          .post(url + "/api/get_purchase_req_items_search", { pur_no: "" })
          .then((resPur) => {
            console.log(resPur);
            setPurReqList(
              resPur?.data?.msg.filter(e=>e.ordered_qty<e.qty)
            );
            setPurReqListCopy(
              resPur?.data?.msg.filter(e=>e.ordered_qty<e.qty)
            );
            setLoading(false);
          });
      });

      // setLoading(false);
    });

    console.log(data);
    // if(localStorage.getItem('proj_name')!=null){
    console.log(
      localStorage.getItem("proj_name"),
      localStorage.getItem("vendor_name"),
      data.proj_name,
      data.vendor_name
    );
    //  if(localStorage.getItem('proj_name') && localStorage.getItem('vendor_name')){
    //   debugger
    if (data.proj_name && data.vendor_name) {
      setLoading(true);
      //   axios.post(url + "/api/getprojectpoc", { id: projects.filter((e) => e.sl_no == +data.proj_name)[0]?.proj_id}).then((res) => {
      //     console.log(res)
      //     setPoc(res?.data?.msg)
      //     setLoading(false)
      // })

      axios
        .post(url + "/api/getvendorpoc", {
          id: +data?.vendor_name
            ? +data?.vendor_name
            : +localStorage.getItem("vendor_name"),
        })
        .then((resPoc) => {
          console.log(resPoc);
          setPocList(resPoc?.data?.msg);
          axios
            .post(url + "/api/getvendordealsinfo", {
              id: +data?.vendor_name
                ? +data?.vendor_name
                : localStorage.getItem("vendor_name"),
            })
            .then((resDeals) => {
              console.log(resDeals);
              setDeals(resDeals?.data?.msg);
              axios
                .post(url + "/api/getvendorbank", {
                  id: +data?.vendor_name
                    ? +data?.vendor_name
                    : localStorage.getItem("vendor_name"),
                })
                .then((resBank) => {
                  setBank(resBank?.data?.msg);
                  setLoading(false);
                });
            });
        });
    }

    // }
  }, []);
  useEffect(()=>{
    // alert("I am here")
    if(localStorage.getItem('order_type')=='P'){
    setPurReqList(pur_req__listCopy.filter(e=>e.pur_proj==+localStorage.getItem('proj_name')))
  console.log(pur_req__listCopy.filter(e=>e.pur_proj==+localStorage.getItem('proj_name')))
    }
  else{
  setPurReqList(pur_req__listCopy.filter(e=>e.pur_proj==0))
  console.log(pur_req__listCopy.filter(e=>e.pur_proj==0))
  }

  },[localStorage.getItem('proj_name')])
  const onSelectProject = (event) => {
    console.log(event.target.value);
    console.log(projects.filter((e) => e.sl_no == event.target.value));
    setProjectInfo(projects.filter((e) => e.sl_no == event.target.value));
    setOrderDate(
      projects.filter((e) => e.sl_no == event.target.value)[0].order_date
    );
    localStorage.setItem(
      "order_date",
      projects.filter((e) => e.sl_no == event.target.value)[0].order_date
    );
    setOrderId(
      projects.filter((e) => e.sl_no == event.target.value)[0].order_id
    );
    localStorage.setItem(
      "order_id",
      projects.filter((e) => e.sl_no == event.target.value)[0].order_id
    );
    setLoading(true);
    axios
      .post(url + "/api/getprojectpocinfo", {
        id: projects.filter((e) => e.sl_no == event.target.value)[0].proj_id,
      })
      .then((res) => {
        console.log(res);
        setPoc(res?.data?.msg);
        setLoading(false);
      });
  };

  const onSelectVendor = (event) => {
    // console.log(event.target.value)
    setLoading(true);
    axios.post(url + "/api/getvendorpoc", { id: event }).then((resPoc) => {
      console.log(resPoc);
      setPocList(resPoc?.data?.msg);
      axios
        .post(url + "/api/getvendordealsinfo", { id: event })
        .then((resDeals) => {
          console.log(resDeals);
          setDeals(resDeals?.data?.msg);
          axios
            .post(url + "/api/getvendorbank", { id: event })
            .then((resBank) => {
              setBank(resBank?.data?.msg);
              setLoading(false);
            });
        });
    });
  };
  useEffect(()=>{
    setProjID(projectList.filter((e) => e.code == +projCode)[0]?.projID)
  },[projCode])
  return (
    <section className="bg-white dark:bg-[#001529]">
      <Spin
        indicator={<LoadingOutlined spin />}
        size="large"
        className="text-green-900 dark:text-gray-400"
        spinning={loading}
      >
        <div className="py-2 px-4 mx-auto w-full lg:py-2">
          <h2 className="text-2xl text-green-900 font-bold my-3">
            Basic Details
          </h2>
          <BlockUI blocked={blocked} className={"bg-red-500"}>
            <div className="grid gap-4 sm:grid-cols-6 sm:gap-6">
             
              <div className="sm:col-span-3">
                <TDInputTemplate
                  placeholder="PO Date"
                  type="date"
                  label="PO Date"
                  name="po_issue_date"
                  min={moment(
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 3)
                    )
                  ).format("yyyy-MM-DD")} //may need to change
                  disabled={
                    params.flag == "F" ||
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                      ? true
                      : false
                  }
                  formControlName={localStorage.getItem("po_issue_date")}
                  max={moment(new Date()).format("yyyy-MM-DD")} //may need to change
                  handleChange={(txt) => {
                    setPoIssueDate(txt.target.value);
                    localStorage.setItem("po_issue_date", txt.target.value);
                  }}
                  mode={1}
                />
                {/* {formik.errors.order_type && formik.touched.order_type && (
            <VError title={formik.errors.order_type} />
          )} */}
              </div>
              <div className="sm:col-span-3">
                <TDInputTemplate
                  placeholder="Order type"
                  type="text"
                  label="Order type"
                  name="order_type"
                  data={[
                    { name: "General", code: "G" },
                    { name: "Project Specific", code: "P" },
                  ]}
                  formControlName={type}
                  handleChange={(txt) => {
                    setType(txt.target.value);
                    localStorage.setItem("order_type", txt.target.value);
                    // ===================================================
                    if (txt.target.value == "G") {
                      setProjCode();
                      setProjName("");
                      localStorage.setItem("proj_name", "0");
                    }
                    setSelectedList([])
                    setSelectedListCopy([])
                    // ===================================================
                  }}
                  mode={2}
                  disabled={
                    // true
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                      ? true
                      : false
                  }
                />
                {!type && <VError title={"Select type!"} />}
              </div>
              {params.flag == "E" && (
                <div className="sm:col-span-6">
                  <TDInputTemplate
                    placeholder="PO No."
                    type="text"
                    label="PO No."
                    name="po_no"
                    formControlName={po_no}
                    handleBlur={() => checkid()}
                    handleChange={(txt) => {
                      setPoNo(txt.target.value);
                      localStorage.setItem("po_no", txt.target.value);
                    }}
                    mode={1}
                    disabled={
                      localStorage.getItem("po_status") == "A" ||
                      localStorage.getItem("po_status") == "D" ||
                      localStorage.getItem("po_status") == "L" ||
                      (params.id > 0 && po_no)
                        ? true
                        : false
                    }
                  />
                  {params.flag == "E" && !po_no && (
                    <VError title={"Po Number is required!"} />
                  )}
                  {checkLoad && (
                    <Tag icon={<SyncOutlined spin />} color="processing">
                      Checking...
                    </Tag>
                  )}
                  {count > 0 && <VError title={"PO No. already exists!"} />}
                </div>
              )}
              {type == "P" && (
                <>
                  <div className="sm:col-span-6">
                    <TDInputTemplate
                      placeholder="Project name"
                      type="text"
                      label="Project Name"
                      name="project_name"
                      formControlName={proj_name}
                      handleFocus={(e) => {
                        op_project.current.show(e);

                        setProjectList(projectList);
                        console.log(projectList);
                      }}
                      handleChange={(event) => {
                        // localStorage.setItem('proj_name',event.target.value)
                        setProjName(event.target.value);

                        // if(event.target.value!='Project name')
                        //   {onSelectProject(event)}
                        //   else{
                        //     setOrderId('');setOrderDate('')
                        //   }

                        if (event.target.value.length > 0) {
                          op_project.current.show(event);
                        } else {
                          op_project.current.hide(event);
                          setProjCode();
                          setOrderId("");
                          setOrderDate("");
                        }
                      }}
                      data={projectList}
                      mode={1}
                      disabled={
                        // true
                        localStorage.getItem("po_status") == "A" ||
                        localStorage.getItem("po_status") == "D" ||
                        localStorage.getItem("po_status") == "L"
                          ? true
                          : false
                      }
                    />
                    <OverlayPanel
                      ref={op_project}
                      // style={{width:'1200}}
                      className="w-[67.5%] border-2 bg-gray-200 border-green-900"
                    >
                      <span className="text-xs text-green-900 italic">
                        Search results for: "{proj_name}"
                      </span>
                      <ul class=" divide-y max-h-32 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                        {/* projectList?.filter((e) =>
                        e.name?.toLowerCase().includes(proj_name!=undefined?proj_name?.toLowerCase():"")
                      ).length > 0 && */}
                        {projectList?.filter((e) =>
                          e.name
                            ?.toLowerCase()
                            .includes(
                              proj_name != undefined
                                ? proj_name?.toLowerCase()
                                : ""
                            ) || e?.projID?.toLowerCase().includes(proj_name)
                        ).length > 0 &&
                          projectList
                            ?.filter((e) =>
                              e.name
                                ?.toLowerCase()
                                .includes(
                                  proj_name != undefined
                                    ? proj_name?.toLowerCase()
                                    : ""
                                ) || e?.projID?.toLowerCase().includes(proj_name?.toLowerCase())
                            )
                            ?.map((lst) => (
                              <li
                                onClick={(e) => {
                                  op_project.current.hide(e);
                                  console.log(lst)
                                  setProjName(lst.name);
                                  setProjCode(lst.code);
                                  setProjID(lst.projID);
                                  localStorage.setItem("proj_name", lst.code);
                                  setSelectedList([])
                                  setSelectedListCopy([])
                                }}
                                class=" cursor-pointer py-2 hover:bg-[#C4F1BE] rounded-md hover:duration-300 "
                              >
                                <div class="flex items-center rtl:space-x-reverse">
                                  <div class="flex-1 min-w-0">
                                    <p class="text-sm font-bold w-full text-green-900 truncate dark:text-white">
                                      {lst.name}
                                    </p>
                                  </div>
                                </div>
                                <hr className="text-green-900 border-gray-300  bg-green-900" />
                              </li>
                            ))}
                        {projectList.filter((e) =>
                          e.name
                            ?.toLowerCase()
                            .includes(
                              proj_name != undefined
                                ? proj_name?.toLowerCase()
                                : ""
                            ) || e?.projID?.toLowerCase().includes(proj_name?.toLowerCase())
                        ).length == 0 && <Empty />}
                      </ul>
                    </OverlayPanel>
                    {/* <AutoComplete
      style={{ width: 200 }}
      onSearch={handleSearch}
      placeholder="input here"
      options={projectList}
    /> */}
                    <div
                      className={
                        // proj_name ? "flex justify-between" : "flex justify-end"
                        "flex justify-between items-center" 
                      }
                    >
                        {!projCode && type == "P" && (
                        <VError title={"Project is required!"} />
                      )}
                        {projID &&  <Tag className="bg-amber-600 text-white">Project ID: {projID}</Tag>
}
                      {projCode && (
                        <Viewdetails
                          click={() => {
                            setFlag(7);
                            console.log(proj_name);
                            setProjectInfo(
                              projects.filter((e) => e.sl_no == projCode)
                            );
                            axios
                              .post(url + "/api/getprojectpocinfo", {
                                id: projects.filter(
                                  (e) => e.sl_no == +projCode
                                )[0]?.proj_id,
                              })
                              .then((res) => {
                                console.log(res);
                                setPoc(res?.data?.msg);
                                setLoading(false);
                              });
                            setVisible(true);
                          }}
                        />
                      )}
                                          
                      
                    
                      {localStorage.getItem("po_status") != "A" &&
                        localStorage.getItem("po_status") != "D" &&
                        localStorage.getItem("po_status") != "L" && (
                          <a
                            
                            onClick={() => {
                              setMode(2);
                              setOpen(true);
                            }}
                          >
                            <Tag color="#4FB477">
                              {" "}
                              <PlusCircleOutlined /> Not in list?
                            </Tag>
                          </a>
                        )}
                      {/* <p>Not in list?</p> */}
                    </div>
                  </div>
                  <div className="sm:col-span-0 hidden">
                    <div className="flex flex-col">
                      <TDInputTemplate
                        placeholder="Client Order date"
                        type="date"
                        label="Client Order Date"
                        name="order_date"
                        formControlName={order_date}
                        disabled={true}
                        mode={1}
                      />
                      {/* {formik.errors.order_date && formik.touched.order_date && (
                  <VError title={formik.errors.order_date} />
                )} */}
                    </div>
                  </div>
                  <div className="sm:col-span-0 hidden">
                    <div className="flex flex-col">
                      <TDInputTemplate
                        placeholder="Client Order No."
                        type="text"
                        label="Client Order No."
                        name="order_no"
                        formControlName={order_id}
                        disabled={true}
                        mode={1}
                      />
                      {/* {formik.errors.order_no && formik.touched.order_no && (
                  <VError title={formik.errors.order_no} />
                )} */}
                    </div>
                  </div>
                </>
              )}
              <div className="sm:col-span-3">
                <TDInputTemplate
                  placeholder="Vendor name"
                  type="text"
                  label="Vendor name"
                  name="vendor_name"
                  data={vendorsList}
                  formControlName={vendor_name}
                  handleFocus={(e) => op_vendor.current.show(e)}
                  handleChange={(event) => {
                    setVendorName(event.target.value);
                    // if(event.target.value!='Vendor name')
                    //   {
                    //     onSelectVendor(event)
                    //   localStorage.setItem('vendor_name',event.target.value)
                    // setVendorInfo(vendors?.filter(e=>e.sl_no==event.target.value))
                    //   }
                    // else{
                    //   setVendorName('')
                    // }
                    if (event.target.value.length > 0) {
                      op_vendor.current.show(event);
                    } else {
                      op_vendor.current.hide(event);
                      setVendorCode();
                      setVendorName("");
                    }
                  }}
                  // handleBlur={formik.handleBlur}
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                      ? true
                      : false
                  }
                  mode={1}
                />
                <OverlayPanel
                  ref={op_vendor}
                  // style={{marginLeft:'325px'}}
                  className=" w-[32.7%] border-2 bg-gray-200 border-green-900"
                >
                  <span className="text-xs text-green-900 italic">
                    Search results for: "{vendor_name}"
                  </span>
                  <ul class=" divide-y max-h-32 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                    {vendorsList.filter((e) =>
                      e.name
                        ?.toLowerCase()
                        .includes(
                          vendor_name != undefined
                            ? vendor_name?.toLowerCase()
                            : ""
                        )
                    ).length > 0 &&
                      vendorsList
                        .filter((e) =>
                          e.name
                            ?.toLowerCase()
                            .includes(
                              vendor_name != undefined
                                ? vendor_name?.toLowerCase()
                                : ""
                            )
                        )
                        ?.map((lst) => (
                          <li
                            onClick={(e) => {
                              op_vendor.current.hide(e);
                              setVendorName(lst.name);
                              setVendorCode(lst.code);
                              localStorage.setItem("vendor_name", lst.code);
                              setVendorInfo(
                                vendors?.filter((e) => e.sl_no == lst.code)
                              );

                              onSelectVendor(lst.code);
                            }}
                            class=" cursor-pointer py-2 hover:bg-[#C4F1BE] rounded-md hover:duration-300 "
                          >
                            <div class="flex items-center rtl:space-x-reverse">
                              <div class="flex-1 min-w-0">
                                <p class="text-sm font-bold w-full text-green-900 truncate dark:text-white">
                                  {lst.name}
                                </p>
                              </div>
                            </div>
                            <hr className="text-green-900 border-gray-300  bg-green-900" />
                          </li>
                        ))}
                    {vendorsList.filter((e) =>
                      e.name
                        ?.toLowerCase()
                        .includes(
                          vendor_name != undefined
                            ? vendor_name?.toLowerCase()
                            : ""
                        )
                    ).length == 0 && <Empty />}
                  </ul>
                </OverlayPanel>
               
                <div
                  className={
                    // vendorCode ? "flex justify-between" : "flex justify-end"
                  "flex justify-between" 
                  }
                >
                   {!vendor_name && <VError title={"Vendor is required!"} />}
                  {vendor_name && (
                    <Viewdetails
                      click={() => {
                        setVisible(true);
                        setVendorInfo(
                          vendors?.filter((e) => e.sl_no == vendorCode)
                        );

                        // axios.post(url+'/api/getvendorpoc',{id:+data?.vendor_name?+data?.vendor_name:+localStorage.getItem('vendor_name')}).then((resPoc)=>{
                        axios
                          .post(url + "/api/getvendorpoc", {
                            id: +localStorage.getItem("vendor_name"),
                          })
                          .then((resPoc) => {
                            console.log(resPoc);
                            setPocList(resPoc?.data?.msg);
                            axios
                              .post(url + "/api/getvendordealsinfo", {
                                id: localStorage.getItem("vendor_name"),
                              })
                              .then((resDeals) => {
                                console.log(resDeals);
                                setDeals(resDeals?.data?.msg);
                                axios
                                  .post(url + "/api/getvendorbank", {
                                    id: localStorage.getItem("vendor_name"),
                                  })
                                  .then((resBank) => {
                                    setBank(resBank?.data?.msg);
                                    setLoading(false);

                                    setFlag(8);
                                  });
                              });
                          });
                      }}
                    />
                  )}
                  {localStorage.getItem("po_status") != "A" &&
                    localStorage.getItem("po_status") != "D" &&
                    localStorage.getItem("po_status") != "L" && (
                      <a
                        className="my-2"
                        onClick={() => {
                          setMode(1);
                          setOpen(true);
                        }}
                      >
                        <Tag color="#4FB477">
                          <PlusCircleOutlined /> Not in list?
                        </Tag>
                      </a>
                    )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <TDInputTemplate
                  placeholder="Vendor Reference"
                  type="text"
                  label="Vendor Reference"
                  name="vend_ref"
                  formControlName={vend_ref}
                  handleChange={(event) => {
                    setVendRef(event.target.value);
                    localStorage.setItem("vend_ref", event.target.value);
                  }}
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                      ? true
                      : false
                  }
                  // handleBlur={formik.handleBlur}
                  mode={1}
                />
                {!vend_ref && (
                  <VError title={"Vendor reference is required!"} />
                )}
              </div>

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
                      setPurReqList(pur_req__listCopy.filter(e=>e.pur_proj==+localStorage.getItem('proj_name')))
                    console.log(pur_req__listCopy.filter(e=>e.pur_proj==+localStorage.getItem('proj_name')))
                      }
                    else{
                    setPurReqList(pur_req__listCopy.filter(e=>e.pur_proj==0))
                    console.log(pur_req__listCopy.filter(e=>e.pur_proj==0))
                    }
                  }}
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                      ? true
                      : false
                  }
                  mode={1}
                />
                {!selectedList.length>0 && (
                  <VError title={"Purchase Requisition is required"} />
                )}

                <OverlayPanel
                  ref={op_pur_req}
                  // style={{marginLeft:'325px'}}
                  className="w-[67.5%] border-2 bg-gray-200 border-green-900"
                >
                  <span className="text-xs text-green-900 italic">
                    Search results for: "{pur_req}"
                  </span>
                  <ul class=" divide-y max-h-32 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                    {/* projectList?.filter((e) =>
                        e.name?.toLowerCase().includes(proj_name!=undefined?proj_name?.toLowerCase():"")
                      ).length > 0 && */}
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
                              // setType(lst.pur_proj > 0 ? "P" : "G");
                              // localStorage.setItem(
                              //   "order_type",
                              //   lst.pur_proj > 0 ? "P" : "G"
                              // );
                              // setProjCode(lst.pur_proj);
                              // localStorage.setItem("proj_name", lst.pur_proj);
                              // setProjName(
                              //   projectList.filter(
                              //     (e) => e.code == lst.pur_proj
                              //   )[0]?.name
                              // );
                              op_pur_req.current.hide(e);
                              // setPurReq(lst.pur_no);
                              // setPurCode(lst.pur_no);
                              addItem(lst)
                              purList.push(lst.pur_no)

                              console.log(selectedList)
                            }}
                            class=" cursor-pointer py-2 hover:bg-[#C4F1BE] rounded-md hover:duration-300 "
                          >
                            <div class="flex items-center rtl:space-x-reverse">
                              <div class="flex-1 min-w-0">
                                <p class="text-sm font-bold w-full text-green-900 truncate dark:text-white">
                                  {lst.pur_no}
                                </p>
                              </div>
                            </div>
                            <hr className="text-green-900 border-gray-300  bg-green-900" />
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
                <div className="flex justify-start items-center gap-2">
            {selectedList.length>0 && selectedList.map((item,index)=><Chip
                                className="text-xs mt-4 bg-[#C4F1BE]"
                                label={<span className="flex justify-center gap-2 items-center">{item} <CloseCircleFilled onClick={()=>closeItem(index)} className="cursor-pointer text-sm text-green-900 hover:text-red-600 duration-300"/></span>}
                              />)
                }
            </div>
              </div>}
            
            </div>
          
            
          </BlockUI>
          <div className="flex pt-4 justify-end">
            {/* <button
              className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-[#92140C] bg-[#92140C] transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 rounded-full  dark:focus:ring-primary-900"
              onClick={pressBack}
            >
              Back
            </button> */}
            <button
              type="submit"
              // disabled={checkLoad || (params.flag=='F' && selectedList.length==0)}
              className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
              onClick={() => onSubmit()}
            >
              Next <ArrowRightOutlined className="ml-1" />
            </button>
          </div>
        </div>
      </Spin>
      <DialogBox
        visible={visible}
        flag={flag}
        data={
          flag == 7
            ? { info: projectInfo[0], poc: pocList }
            : {
                info: vendorInfo[0],
                deals: deals,
                poc: vendorPocList,
                bank: bank,
              }
        }
        onPress={() => setVisible(false)}
      />
      <DrawerComp open={open} flag={mode} onClose={() => onClose()} />
    </section>
  );
}

export default BasicDetails;
