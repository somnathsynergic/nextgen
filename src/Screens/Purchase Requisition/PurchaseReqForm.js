import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import BtnComp from "../../Components/BtnComp";
import HeadingTemplate from "../../Components/HeadingTemplate";
import VError from "../../Components/VError";
import TDInputTemplate from "../../Components/TDInputTemplate";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Message } from "../../Components/Message";
import { url } from "../../Address/BaseUrl";
import { BlockUI } from "primereact/blockui";
import { useReactToPrint } from "react-to-print";
import PrintHeader from "../../Components/PrintHeader";

import { Button, Divider, Empty, Popover, Spin, Tag, Tooltip } from "antd";
import {
  DropboxOutlined,
  LoadingOutlined,
  MinusOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
  StockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DialogBox from "../../Components/DialogBox";
import PrintComp from "../../Components/PrintComp";
import AuditTrail from "../../Components/AuditTrail";
import { ListBox } from "primereact/listbox";
import moment from "moment";
import { OverlayPanel } from "primereact/overlaypanel";
import DrawerComp from "../../Components/DrawerComp";

function PurchaseReqForm() {
  const params = useParams();
  const contentRef = useRef(null);
           const [isPrinting, setIsPrinting] = useState(true);
         
            const reactToPrintFn = useReactToPrint({
            contentRef
           });
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [trans_no, setTransNo] = useState("");
  const [item_info, setItemInfo] = useState([]);
  const [proj_id,setProjId] = useState("")
  // const [errors,setErrors] = useState([])
  const [blocked, setBlocked] = useState(false);
  const [data, setData] = useState();
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [count, setCount] = useState(0);
  const [intended_for, setIntended] = useState("W");
  const [trans_dt, setTransDt] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  const [logData,setLogData] = useState([])
  const [purpose, setPurpose] = useState(localStorage.getItem("email"));
  const [projects, setProjects] = useState([]);
  const [cients, setClients] = useState([]);
  const [clientcode, setClientCode] = useState();
  const [projcode, setProjCode] = useState(0);
  const [productCode, setProductCode] = useState();
  const [projectList, setProjectList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [projectCopy, setProjectCopy] = useState([]);
  const [stockLoad, setStockLoad] = useState(false);
  const [wer_stock, setWerStock] = useState(0);
  const [index, setIndex] = useState(0);
  const [client, setClient] = useState("");
  const [project, setProject] = useState("");
  const navigate = useNavigate();
  const [flag, setFlag] = useState(4);
  const [prev_req, setPrevReq] = useState([]);
  const op = useRef(null);
  const op1 = useRef(null);
  const [logical_stock, setLogicalStock] = useState(0);
  const [created_by, setCreatedBy] = useState('');
  const [modified_by, setModifiedBy] = useState('');
  const [created_at, setCreatedAt] = useState('');
  const [modified_at, setModifiedAt] = useState('');
  const [physical_stock, setPhysicalStock] = useState(0);
  const det = JSON.parse(localStorage.getItem("perm"));
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(0);
  const [po_no, setPoNo] = useState(0);
  const [itemDtls, setItemDtls] = useState(
    params.id > 0 ? [{ sl_no: 0, item_id: "", qty: 0, error: 1 }] : []
  );
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
            <StockOutlined /> Requisition Quantity :{" "}
            {physical_stock - logical_stock || 0}
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

  const check_item = (val) => {
    axios
      .post(url + "/api/check_item", { item_id: +val, trans_no: "TWP-" })
      .then((res) => {
        console.log(res);
        setPrevReq(res?.data?.msg);
        if (res?.data?.msg?.length) {
          setFlag(31);
          setVisible(true);
        }
      });
  };
  const handleDtBlur = (index, e) => {
    setLoading(true);
    console.log(itemDtls[index]);
    axios
      .post(url + "/api/get_logical_stock", {
        proj_id: 0,
        prod_id: +itemDtls[index].item_id,
      })
      .then((res) => {
        // console.log(res?.data?.msg[0]?.warehouse_stock);
        setLoading(false);
        if (
          e.target.value > 0 &&
          e.target.value <=
            (res?.data?.result?.msg[0]?.warehouse_stock -
              res?.data?.req_stock || 0)
        ) {
          itemDtls[index]["error"] = 0;
        } else {
          itemDtls[index]["error"] = 1;
        }
      });
  };
  useEffect(() => {
    if (params.id > 0) {
      setItemDtls([]);
    } else {
      setItemDtls([{ sl_no: 0, item_id: "", qty: 0, error: 1 }]);
    }
    axios.post(url + "/api/getproject", { id: 0 }).then((res) => {
      console.log(res);
      setProjects(res?.data?.msg);
      for (let i of res?.data?.msg) {
        setProjectList(prev=>[...prev,{
          code: i.sl_no,
          name: i.proj_name,
          client: i.client_id,
          proj_id:i.proj_id
        }]);
        setProjectCopy(prev=>[...prev,{
          code: i.sl_no,
          name: i.proj_name,
          client: i.client_id,
          proj_id:i.proj_id
        }]);
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
        productList.push({
          code: i.sl_no,
          name: i.prod_name,
          part_no: i.part_no,
          make: i.prod_make,
          prod_desc: i.prod_desc,
          model_no: i.model_no,
          article_no: i.article_no,
        });
      }
      setProductList(productList);
    });

    if (params.id > 0) {
      setLoading(true);
      axios
        .post(url + "/api/get_purchase_req", { id: params.id })
        .then((res) => {
          console.log(res);
          setLoading(false);
          setTransDt(res?.data?.msg?.pur_date);
          setTransNo(res?.data?.msg?.pur_no);
          setProjCode(res?.data?.msg?.p_id || 0);
          // setProjId(projectList.filter(e=>e?.code==+res?.data?.msg?.p_id)[0]?.proj_id)
          setProject(res?.data?.msg?.proj_name || "Warehouse");
          setIntended(res?.data?.msg?.intended);
          setCreatedBy(res?.data?.msg?.created_by);
          setModifiedBy(res?.data?.msg?.modified_by||'');
          setCreatedAt(res?.data?.msg?.created_at);
          setModifiedAt(res?.data?.msg?.modified_at||'');
          axios
            .post(url + "/api/get_purchase_req_items_for_edit", {
              pur_no: res?.data?.msg?.pur_no,
            })
            .then((resItems) => {
              console.log(resItems);
              setPoNo(resItems?.data?.msg[0]?.po_no);
              resItems?.data?.msg.forEach((item) =>
                setItemDtls((prev) => [
                  ...prev,
                  {
                    sl_no: item.item_sl,
                    item_id: item.item_id,
                    qty: item.qty,
                    ordered_qty: item.ordered_qty,
                    error: 0,
                    tot_rc:item.tot_rc
                  },
                ])
              );
            });

          // setcli(res?.data?.msg[0]?.intended_for)
        });
    }
    setBlocked(det?.purchase_req == 1 ? true : false);
  }, []);
  const onClose = () => {
    setOpen(false);
    setLoading(true);
    axios.post(url + "/api/getproduct", { id: 0 }).then((resC) => {
      console.log(resC);
      setProducts(resC?.data?.msg);
      setLoading(false);
      productList.length = [];
      for (let i of resC?.data?.msg) {
        productList.push({
          code: i.sl_no,
          name: i.prod_name,
          part_no: i.part_no,
          make: i.prod_make,
          prod_desc: i.prod_desc,
          model_no: i.model_no,
          article_no: i.article_no,
        });
      }
      setProductList(productList);
    });
  };
  useEffect(()=>{
    console.log(projcode,projectList.filter(e=>e?.code==+projcode)[0]?.proj_id,projectList)
    setProjId(projectList.filter(e=>e?.code==+projcode)[0]?.proj_id)
  },[projcode,projectCopy])
  const onSubmit = () => {
    setLoading(true);
    console.log(itemDtls);
    axios
      .post(url + "/api/save_pur_req", {
        sl_no: +params.id,
        user: localStorage.getItem("email"),
        pur_dt: trans_dt,
        project_id: +projcode,
        purpose: purpose,
        items: itemDtls,
        intended: intended_for,
      })
      .then((res) => {
        setLoading(false);
        console.log(res);
        if (res?.data?.suc > 0) {
          navigate(-1);
          Message("success", res?.data.msg);
        } else {
          Message("error", res?.data.msg);
        }
      })
      .catch((err) => {
        setLoading(false);
        navigate("/error" + "/" + err.code + "/" + err.message);
      });
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
  const handleDtChange = (index, event) => {
    let data = [...itemDtls];
    console.log(productList.filter((e) => e.code == event.target.value));
    if (event.target.name == "item_id") {
      // check_item(event.target.value);
    }

    data[index][event.target.name] = +event.target.value;
    if (event.target.name == "qty") {
      if (+event.target.value > 0) {
        data[index]["error"] = 0;
      } else {
        data[index]["error"] = 1;
      }
    }
    setItemDtls(data);

    console.log(data);
  };
  const deleteItem = () => {
    setLoading(true);
    console.log(params.id);
    setVisible(false);
    axios
      .post(url + "/api/delete_pur_req", { id: trans_no })
      .then((res) => {
        console.log(res);
        setLoading(false);
        if (res.data.suc > 0) {
          Message("success", res.data.msg);
          navigate(-1);
        } else {
          Message("error", res.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/error" + "/" + err.code + "/" + err.message);
      });
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
        text={"Purchase Requisition"}
        mode={params.id > 0 ? 1 : 0}
        title={"Category"}
        data={params.id && data ? data : ""}
        onPrinting={()=>{setIsPrinting(false);
          setTimeout(() => {
            reactToPrintFn();
            setIsPrinting(true);
            }, 5);}
          }
      />
      <BlockUI blocked={blocked} className={"bg-red-500"}>
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
                  <Tag color="#014737">
                    Purchase Requisition No.: {trans_no}{" "}
                  </Tag>
                </div>
              )}
              {/* {trans_dt} */}
              <form>
                <div className="grid gap-4 sm:grid-cols-6 sm:gap-6">
                  <div className="sm:col-span-3">
                    <TDInputTemplate
                      placeholder="Date"
                      type="date"
                      label="Date"
                      name="dt"
                      disabled
                      formControlName={
                        !trans_dt
                          ? moment(new Date()).format("yyyy-MM-DD")
                          : moment(trans_dt).format("yyyy-MM-DD")
                      }
                      //   handleChange={formik.handleChange}
                      //   handleBlur={formik.handleBlur}
                      mode={1}
                    />

                    {/* {formik.errors.catnm && formik.touched.catnm ? (
                    <VError title={formik.errors.catnm} />
                  ) : null} */}
                  </div>
                  <div className="sm:col-span-3">
                    <TDInputTemplate
                      placeholder="Intended For"
                      type="text"
                      label="Intended For"
                      name="intended_for"
                      formControlName={intended_for}
                      //   handleChange={formik.handleChange}
                      //   handleBlur={formik.handleBlur}
                      disabled={params.id > 0}
                      mode={2}
                      data={[
                        { name: "Warehouse", code: "W" },
                        { name: "Project", code: "P" },
                      ]}
                      handleChange={(txt) => {
                        setIntended(txt.target.value);
                      }}
                    />

                    {/* {formik.errors.catnm && formik.touched.catnm ? (
                    <VError title={formik.errors.catnm} />
                  ) : null} */}
                  </div>
                  {/* <div className="sm:col-span-3">
                    <TDInputTemplate
                      placeholder="Intended for"
                      type="date"
                      label="Intented For"
                      name="intented_for"
                      formControlName={intended_for}
                      handleChange={(txt) => {
                        setIntended(txt.target.value);
  
                        setClient("");
                        setClientCode(0);
                        setProjectList(projectCopy);
                      }}
                      //   handleBlur={formik.handleBlur}
                      data={[
                        { code: "A", name: "Assembly Shop" },
                        { code: "C", name: "Client" },
                      ]}
                      mode={2}
                    />
  
                    {!intended_for ? <VError title={"Required"} /> : null}
                  </div> */}
                  {/* { params.id>0 &&  <AuditTrail data={data}/>} */}
                  {/* {intended_for == "C" && (
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
                          // setLoading(true);
                          // getItemDetails(txt.target.value);
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
                  {intended_for == "P" && (
                    <div
                      className={
                        "sm:col-span-3 flex-col justify-end items-end "
                      }
                    >
                      <TDInputTemplate
                        placeholder="Project"
                        type="text"
                        label="Project"
                        name="proj"
                        disabled={params.id > 0}
                        formControlName={project}
                        handleFocus={(e) => op.current.show(e)}
                        handleChange={(txt) => {
                          console.log(txt);
                          setProject(txt.target.value);
                          if (txt.target.value.length) op.current.show(txt);
                          else {
                            op.current.hide(txt);
                            setProjCode(0);
                            setProjId("")
                          }
                          // setLoading(true);
                          // getItemDetails(txt.target.value);
                        }}
                        data={projectList}
                        mode={1}
                      />

                      <OverlayPanel
                        ref={op}
                        className="w-[35.5%]  border-2 bg-gray-200 border-green-900"
                      >
                        <span className="text-xs text-green-900 italic">
                          Search results for: "{project}"
                        </span>
                        <ul class=" divide-y max-h-48 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                          {projectList?.filter((e) =>
                            e.name
                              ?.toLowerCase()
                              .includes(project?.toLowerCase()) ||  e.proj_id?.toLowerCase().includes(project?.toLowerCase())
                          ).length > 0 &&
                            projectList
                              ?.filter((e) =>
                                e.name
                                  ?.toLowerCase()
                                  .includes(project?.toLowerCase())||  e.proj_id?.toLowerCase().includes(project?.toLowerCase())
                              )
                              ?.map((lst) => (
                                <li
                                  onClick={(e) => {
                                    op.current.hide(e);
                                    setProject(lst.name);
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
                            e.name
                              ?.toLowerCase()
                              .includes(project?.toLowerCase()) || e.proj_id?.toLowerCase().includes(project?.toLowerCase())
                          ).length == 0 && <Empty />}
                        </ul>
                      </OverlayPanel>
                      <span className="flex justify-end items-center">

                     {!projcode && <VError title={"Required"} />}
                     {proj_id && <Tag className="bg-amber-600 mt-1 text-white">Project ID: {proj_id}</Tag>
}
                      </span>
                    </div>
                  )}
                  <div className={intended_for == "P"?"sm:col-span-3 ":"sm:col-span-6 -mt-2"}>
                    <TDInputTemplate
                      placeholder="Requisition Given By"
                      type="text"
                      label="Requisition Given By"
                      name="Requisition Given By"
                      formControlName={purpose}
                      handleChange={(txt) => setPurpose(txt.target.value)}
                      mode={1}
                      disabled={true}
                    />
                    {/* {!purpose && <VError title={"Required"} />} */}
                  </div>
                </div>

                <Divider />
                {/* <div className="flex justify-between items-center">
                  <a
                    className="my-2"
                    onClick={() => {
                      setMode(3);
                      setOpen(true);
                    }}
                  >
                    <Tag color="#4FB477">
                      {" "}
                      <PlusCircleOutlined /> Not in list?
                    </Tag>
                  </a>
                </div> */}
                {/* <div className="grid gap-2 rounded-lg shadow-lg bg-gray-200 p-5 sm:grid-cols-12 items-end sm:gap-6"> */}
                {params.id > 0 && po_no > 0 ? (
                  <div className="sm:col-span-12 flex justify-between items-center">
                    <a
                      className="my-2"
                      onClick={() => {
                        setMode(3);
                        setOpen(true);
                      }}
                    >
                      <Tag color="#4FB477">
                        {" "}
                        <PlusCircleOutlined /> Not in list?
                      </Tag>
                    </a>
                    <Tag color="#014737">PO No.: {po_no} </Tag>
                  </div>
                ) : (
                  <div className="sm:col-span-12 flex justify-start items-center">
                    <a
                      className="my-2"
                      onClick={() => {
                        setMode(3);
                        setOpen(true);
                      }}
                    >
                      <Tag color="#4FB477">
                        {" "}
                        <PlusCircleOutlined /> Not in list?
                      </Tag>
                    </a>
                  </div>
                )}
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
                     {params.id>0 && <th
                        scope="col"
                        className="px-6 py-1.5 w-1/6 text-center font-bold"
                      >
                        Status
                      </th>}
                      {!itemDtls.reduce((accumulator, item) => {
                                    return accumulator + item.ordered_qty;
                                  }, 0)  &&    <th
                        scope="col"
                        className="px-6 py-1.5 w-1/6 text-center font-bold"
                      >
                        Action
                      </th>}
                    </tr>
                  </thead>

                  {itemDtls.map((item, index) => (
                    <>
                      <tbody>
                        <tr className="bg-[#DDEAE0] border-b-2 text-center border-white my-3 font-bold dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-4 w-1/6  py-1.5 flex-wrap justify-between gap-10 items-center  text-gray-900  dark:text-white"
                          >
                            <div >
                              {/* <div className="flex justify-end float-end gap-1"></div> */}
                              <a
                                className="ml-52 float-end -mt-3 -mr-2  z-10 "
                                onClick={() => {
                                  setFlag(25);
                                  setIndex(index);
                                  setVisible(true);
                                }}
                              >
                                <Tooltip title="Search item">
                                  <Tag className="ml-1 hover:scale-110 hover:text-white border-transparent rounded-full  bg-transparent w-5 h-5 flex justify-center items-center">
                                    {" "}
                                    <SearchOutlined className="text-green-900  font-bold text-sm hover:scale-95" />
                                  </Tag>
                                </Tooltip>
                              </a>
                              <TDInputTemplate
                                placeholder="Item"
                                type="text"
                                label=""
                                name="item_id"
                                formControlName={item.item_id}
                                handleChange={(txt) =>
                                  handleDtChange(index, txt)
                                }
                                mode={2}
                                data={productList?.filter(item =>item?.code ==itemDtls[index]?.item_id || !itemDtls.map(obj => +obj?.item_id).includes(item?.code))}
                                disabled = {
                                  itemDtls.reduce((accumulator, item) => {
                                    return accumulator + item.ordered_qty;
                                  }, 0) > 0
                                }
                              />
                              <p className="flex justify-between items-center">
                              <div>
                              {item.item_id && (
                                <p
                                  class="mt-1 text-xs text-gray-500 dark:text-gray-300"
                                  id="file_input_help"
                                >
                                  <Tag className="text-xs my-2 p-2 sm:text-wrap" color="green">
                                    {"   "}
                                    {
                                      productList.filter(
                                        (e) => e.code == item.item_id
                                      )[0]?.part_no? <> <span className="font-bold"> Part No.: </span>
                                    {
                                      productList.filter(
                                        (e) => e.code == item.item_id
                                      )[0]?.part_no
                                    }{"   "}</>:null}
                                    {
                                      productList.filter(
                                        (e) => e.code == item.item_id
                                      )[0]?.model_no? <><span className="font-bold"> Model No.:</span>
                                    {
                                      productList.filter(
                                        (e) => e.code == item.item_id
                                      )[0]?.model_no
                                    }{"   "}</>:null}
                                    {
                                      productList.filter(
                                        (e) => e.code == item.item_id
                                      )[0]?.article_no? <><span className="font-bold"> Article No.: </span>
                                    {
                                      productList.filter(
                                        (e) => e.code == item.item_id
                                      )[0]?.article_no
                                    }{"   "}</>:null}
                                    {
                                      productList.filter(
                                        (e) => e.code == item.item_id
                                      )[0]?.make? <><span className="font-bold"> Make: </span>
                                    {
                                      productList.filter(
                                        (e) => e.code == item.item_id
                                      )[0]?.make
                                    }{" "}</>:null}
                                   {
                                      productList.filter(
                                        (e) => e.code == item.item_id
                                      )[0]?.prod_desc? <><span className="font-bold">   Description: </span>
                                    {
                                      productList.filter(
                                        (e) => e.code == item.item_id
                                      )[0]?.prod_desc
                                    }{" "}</>:null}
                                  </Tag>
                                </p>
                              )}
                              </div>
                             
                             
                             </p>
                              {/* {!purpose && <VError title={"Required"} />} */}
                            </div>
                          </th>
                          <th
                            scope="row"
                            className="px-4 w-1/6  py-1.5 flex-wrap justify-between gap-10 items-center  text-gray-900  dark:text-white"
                          >
                            <div className={"sm:col-span-5 border-2"}>
                              <TDInputTemplate
                                placeholder="Quantity"
                                type="number"
                                label=""
                                name="qty"
                                formControlName={item.qty}
                                handleChange={(txt) =>
                                  handleDtChange(index, txt)
                                }
                                //   handleBlur={(txt) => handleDtBlur(index, txt)}
                                mode={1}
                                disabled = {
                                  itemDtls.reduce((accumulator, item) => {
                                    return accumulator + item.ordered_qty;
                                  }, 0) > 0
                                }
                              />
                              {/* {itemDtls[index]['error']==1 && <VError title={"Quantity should >0 and <=warehouse stock"} />} */}
                            </div>
                          </th>
                          {params.id>0 && <th
                            scope="row"
                            className="px-4 w-1/6  py-1.5 flex-wrap justify-between gap-10 items-center  text-gray-900  dark:text-white"
                          >
                            <div
                              className={
                                "sm:col-span-5 border-2 flex-col gap-10"
                              }
                            >
                              {((item.qty == item.ordered_qty) && (item.qty>0)) && <Tag onClick={
                                ()=>{axios.post(url+'/api/get_order_log',{item_id:item.item_id,pur_no:trans_no}).then(res=>{console.log(res);setFlag(39);setVisible(true); setLogData(res?.data?.msg)})}
                              } className="bg-green-900 cursor-pointer text-white">Fully Ordered</Tag>}
                              {((item.qty > item.ordered_qty) && item.ordered_qty>0) && <Tag onClick={
                                ()=>{axios.post(url+'/api/get_order_log',{item_id:item.item_id,pur_no:trans_no}).then(res=>{console.log(res);setFlag(39);setVisible(true); setLogData(res?.data?.msg)})}
                              } className="bg-yellow-500 cursor-pointer text-white">Partly Ordered</Tag>}
                              {((item.ordered_qty==0) && (item.qty>0)) && <Tag className="bg-red-800 text-white">Not Ordered</Tag>}

                              {
                                <Tag
                                  onClick={() => {
                                    if(item.tot_rc)
                                     { axios
                                        .post(url + "/api/get_receive_log", {
                                          pur_no: trans_no,
                                          item_id:item.item_id
                                        })
                                        .then((res) => {
                                          console.log(res);
                                          setItemInfo(res.data.msg);
                                          setFlag(40);
                                          setVisible(true);
                                        });
                                      }
                                    
                                  }}
                                  className={
                                    !item.tot_rc
                                      ? "bg-red-800 mt-2 text-white"
                                      : +item.tot_rc < +item.ordered_qty
                                      ? "bg-yellow-500 cursor-pointer mt-2 text-white"
                                      : "bg-green-900 cursor-pointer mt-2  text-white"
                                  }
                                >
                                  {!item.tot_rc 
                                    ? "Not Received"
                                    : +item.tot_rc < +item.ordered_qty
                                    ? "Partly Received"
                                    : "Fully Received"}
                                </Tag>
                              } 
                            </div>
                          </th>}
                          {!itemDtls.reduce((accumulator, item) => {
                                    return accumulator + item.ordered_qty;
                                  }, 0)  &&   <th  scope="row"
                            className="px-4 w-1/6  py-1.5 grid-cols-10 justify-between gap-10 items-center  text-gray-900  dark:text-white">
                          {!po_no ? <div  className={
                                "sm:col-span-5 border-2"
                              }>
                               
                                <Button
                                  className="rounded-full bg-green-900 text-white"
                                  onClick={() => {
                                    addDt({
                                      sl_no: 0,
                                      item_id: "",
                                      qty: 0,
                                      error: 1,
                                    });
                                  }}
                                  icon={<PlusOutlined />}
                                ></Button>
                              
                            </div>: null}
                           
                              {itemDtls.length > 1 && !po_no && (  <div  className={
                                "sm:col-span-5 border-2"
                              }>
                                <Button
                                  className="rounded-full text-white bg-red-800 border-red-800"
                                  onClick={() => removeDt(index)}
                                  icon={<MinusOutlined />}
                                ></Button>
                            </div>  )}
                              {/* {!purpose && <VError title={"Required"} />} */}
                            
                          </th>}
                        </tr>
                      </tbody>
                    </>
                  ))}
                </table>
              </form>
              <div className="flex justify-center gap-3 items-center">
                <div className="mx-auto">
                  <div className="flex justify-center gap-2 items-center mx-auto">
                    {/* {!itemDtls.reduce((accumulator, item) => {
                            return accumulator + item.ordered_qty;
                          }, 0)  && ( */}
                      <button
                        // disabled={errorSum(error) || !intended}
                        onClick={() => onSubmit()}
                        className=" disabled:bg-gray-400 mx-auto disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                        disabled={
                          !intended_for ||
                          (intended_for == "P" && !projcode) ||
                          itemDtls.reduce((accumulator, item) => {
                            return accumulator + item.error;
                          }, 0) > 0
                        }
                      >
                        <SaveOutlined className="mr-1" />
                        Submit
                      </button>
                    {/* )} */}

                    { (!itemDtls.reduce((accumulator, item) => {
                            return accumulator + item.ordered_qty;
                          }, 0)  && params.id > 0) && (
                      <button
                        // disabled={errorSum(error) || !intended}
                        onClick={() => {
                          setFlag(4);
                          setVisible(true);
                        }}
                        className=" disabled:bg-gray-400 mx-auto disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                      >
                        <SaveOutlined className="mr-1" />
                        Delete
                      </button>
                    )}

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
      </BlockUI>
         <div ref={contentRef}  style={{
                            display: !isPrinting ? "block" : "none",
                          }} >
                              <div className="grid  gap-4 p-4 sm:grid-cols-2 sm:gap-6">
                              <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
                                <PrintHeader/>
                              </div>
                              <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
                                <h2 className="bg-green-500 font-bold text-lg p-3 text-white">Purchase Requisition ({trans_no})</h2>
                                <table className="border-collapse text-xs border border-gray-300 w-full">
                          <tbody>
                           
                              <tr  className="border border-gray-300">
                                <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                                  Date
                                </td>
                                <td className="border text-gray-600 border-gray-300 p-2">{trans_dt||new Date()}</td>
                              </tr>
                              <tr  className="border border-gray-300">
                                <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                                  Intended For
                                </td>
                                <td className="border text-gray-600 border-gray-300 p-2">{intended_for=='W'?'Warehouse':project}</td>
                              </tr>
                              <tr  className="border border-gray-300">
                                <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                                  Requisition Given By
                                </td>
                                <td className="border text-gray-600 border-gray-300 p-2">{localStorage.getItem('email')}</td>
                              </tr>
                              
                              <tr  className="border border-gray-300">
                                <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                                  Created By
                                </td>
                                <td className="border border-gray-300 p-2 text-gray-600 ">{created_by}</td>
                              </tr>
                              <tr  className="border border-gray-300">
                                <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                                  Created At
                                </td>
                                <td className="border border-gray-300 text-gray-600 p-2">{created_at}</td>
                              </tr>
                              <tr  className="border border-gray-300">
                                <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                                  Modified By
                                </td>
                                <td className="border border-gray-300 text-gray-600 p-2">{modified_by}</td>
                              </tr>
                              <tr  className="border border-gray-300">
                                <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                                  Modified At
                                </td>
                                <td className="border border-gray-300 text-gray-600 p-2">{modified_at}</td>
                              </tr>
                          </tbody>
                        </table>
                        <h2 className="bg-green-500 font-bold text-lg p-3 mt-2 text-white">Item Details</h2>
            
                        <table className="border-collapse border border-gray-500 w-full text-center">
                    <thead>
                      <tr className="text-green-500 font-bold text-center">
                          <th className="border border-gray-300 p-2 capitalize">
                            Item
                          </th>
                          <th className="border border-gray-300 p-2 capitalize">
                            Quantity
                          </th>
                          <th className="border border-gray-300 p-2 capitalize">
                            Status
                          </th>
                         
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-xs">
                      {itemDtls.map(item=><tr>
                          <td className="border border-gray-300 p-2">
                            {productList.filter(e=>e.code==+item.item_id)[0]?.name}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {item.qty}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {item.qty==item.ordered_qty?'Fully Ordered':item.qty>item.ordered_qty  && item.ordered_qty>0?'Partly Ordered':'Not Ordered'} - 
                            {item.tot_rc==0?'Not Received':item.tot_rc<item.ordered_qty?'Partly Received':'Fully Received'}
                          </td>
                         
                      </tr>)}
                    </tbody>
                  </table>
                 
                       
                            </div>
                              </div>
                              </div>
      <DialogBox
        visible={visible}
        flag={flag}
        data={
          flag != 39
            ? flag != 40
              ? { info: products, infoCopy: products }
              : flag != 4
              ? item_info
              : prev_req
            : logData
        }
        onPress={() => setVisible(false)}
        onSearch={(val) => {
          console.log(val);
          let data = [...itemDtls];
          data[index]["item_id"] = val;
          console.log(productList.filter((e) => e.code == val));
          setItemDtls(data);
          setVisible(false);
          console.log(data);
          // check_item(val);
          //   localStorage.setItem("itemList", JSON.stringify(data));
        }}
        onDelete={() => deleteItem()}
      />

      <DrawerComp open={open} flag={mode} onClose={() => onClose()} />
    </section>
  );
}
export default PurchaseReqForm;
