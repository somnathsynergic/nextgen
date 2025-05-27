
import './Steps.css'
import React, { useEffect, useRef, useState } from "react";
import { BlockUI } from 'primereact/blockui';

import { useParams } from "react-router";
import HeadingTemplate from "../Components/HeadingTemplate";
import VError from "../Components/VError";
import TDInputTemplate from "../Components/TDInputTemplate";
import axios from "axios";
import { ScrollPanel } from "primereact/scrollpanel";
import { url } from "../Address/BaseUrl";
import { Empty, Popover } from "antd";
import {
  BranchesOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  ClockCircleFilled,
  CloseCircleOutlined,
  ClusterOutlined,
  DeleteOutlined,
  DropboxOutlined,
  FileDoneOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  LoadingOutlined,
  LockFilled,
  SaveOutlined,
  StockOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DialogBox from "../Components/DialogBox";
import Viewdetails from "../Components/Viewdetails";
import { Spin } from "antd";
import { Message } from "./Message";
import { Checkbox, Col, Row } from "antd";
import { OverlayPanel } from "primereact/overlaypanel";
import BtnGroupReuse from './BtnGroupReuse';
import InfoTags from './InfoTags'
import { formatDate } from '../Functions/formatDate';

function DeliveryFormComp({ flag, title, onSubmit }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const det = JSON.parse(localStorage.getItem("perm"));
   const [blocked, setBlocked] = useState(false);

  const [itemForm, setItemForm] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [mrnList, setMrnList] = useState([]);
  const navigate = useNavigate();
  const [flag1, setFlag] = useState(4);
  const [id, setId] = useState();
  const [items, setItems] = useState([]);
  const [po_no, setPoNo] = useState("");
  const [fileList, setFileList] = useState([]);
  const params = useParams();
  const [ot_desc, setOtDesc] = useState("");
  const [invoice, setInvoice] = useState("");
  const [inv_dt, setInvoiceDt] = useState("");
  const [lr_no, setLrNo] = useState("");
  const [waybill, setWayBill] = useState("");
  const [inv_el, setInvEl] = useState("");
  const [stockData, setStockData] = useState([]);
  const [reqQty, setReqQty] = useState(0);
  const op = useRef(null);
  const [txt, setText] = useState("");
  const [rej_note, setRejNote] = useState("");
  // const [invList,setInvList]=useState([{sl:0,invoice:'',inv_dt:'',lr_no:'',waybill:''}])
  const [doc, setDoc] = useState("");
  const [itemInfo, setItemInfo] = useState("");
  const [mrn_no, setMrnNo] = useState("");
  const [ic, setIc] = useState(false);
  const [og, setOg] = useState(false);
  const [dc, setDc] = useState(false);
  const [lr, setLr] = useState(false);
  const [wb, setWb] = useState(false);
  const [pl, setPl] = useState(false);
  const [om, setOm] = useState(false);
  const [ws, setWs] = useState(false);
  const [tc, setTc] = useState(false);
  const [wc, setWc] = useState(false);
  const [ot, setOt] = useState(false);
  const [om_manual, setOmManual] = useState(false);
  const [con, setCon] = useState(false);
  const [isError, setIsError] = useState([]);
  const [zeroError, setZeroError] = useState(0);
  const [project_id, setProjectId] = useState();
  const [received_log, setReceivedLod] = useState([]);
  const [count, setCount] = useState(0);
  const [checkload, setCheckLoad] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [delMode, setDelMode] = useState(0);
  const [proj_stock, setProjStock] = useState(0);
  const [wer_stock, setWerStock] = useState(0);
  const [stockLoad, setStockLoad] = useState(false);
  const [itemFormCopy, setItemFormCopy] = useState([]);
  const [mrn_code, setCode] = useState();
  const [mrnDetails, setMrnDetails] = useState([]);
  const [approve_flag, setApproveFlag] = useState("");
  const [po_type, setPoType] = useState("");

  // const []
  useEffect(() => {
    if (lr_no) setLr(true);
    else setLr(false);
  }, [lr_no]);

  useEffect(() => {
    if (waybill) setWb(true);
    else setWb(false);
  }, [waybill]);

  const onChangeIc = (e) => {
    console.log("checked = ", e.target);
    if (e.target.name == "ic") setIc(e.target.checked);
    if (e.target.name == "og") setOg(e.target.checked);
    if (e.target.name == "dc") setDc(e.target.checked);
    if (e.target.name == "lr") setLr(e.target.checked);
    if (e.target.name == "wb") setWb(e.target.checked);
    if (e.target.name == "pl") setPl(e.target.checked);
    if (e.target.name == "om") setOm(e.target.checked);
    if (e.target.name == "om_manual") setOmManual(e.target.checked);
    if (e.target.name == "ws") setWs(e.target.checked);
    if (e.target.name == "tc") setTc(e.target.checked);
    if (e.target.name == "wc") setWc(e.target.checked);
    if (e.target.name == "ot") setOt(e.target.checked);
    if (e.target.name == "con") setCon(e.target.checked);
  };
  useEffect(() => {
    setShowDel(false);
    axios
      .post(url + "/api/get_mrn_list", { last_req_id: decodeURIComponent(params.po_no) })
      .then((res) => {
        console.log(res);
        setMrnDetails(res?.data?.msg);

        for (let i of res?.data?.msg) {
          mrnList.push({
            name: i.invoice,
            code: i.invoice,
          });
        }
      });
    setBlocked(det.mrn==1?true:false)

  }, []);
  const getMrnLog = () => {
    axios
      .post(url + "/api/get_received_items", { invoice: inv_el, id: params.id })
      .then((res) => {
        console.log(res);
        setItemInfo(res?.data?.msg);
        setVisible(true);
      });
  };
  useEffect(() => {
    getItemInfo(decodeURIComponent(params.po_no));
    axios.post(url + "/api/getpoinfo", { id: decodeURIComponent(params.po_no) }).then((res) => {
      console.log(res);
      setPoType(res?.data?.msg[0]?.po_type);
    });
  }, []);
  const content = (
    <div className={"grid grid-cols-2 gap-3 p-3 bg-green-100 rounded-lg"}>
      {!stockLoad ? (
        <>
          {" "}
          {po_type != "G" && (
            // <Tag
            //   className="cursor-pointer col-span-1 px-2 py-0.5 shadow-lg"
            //   color="#4FB477"
            // >
            //   <StockOutlined /> Project Quantity : {proj_stock || 0}
            // </Tag>
            <InfoTags icon={<StockOutlined />} text={"Project Quantity : " +(proj_stock || 0)}  color="#4FB477" bgCol={"cursor-pointer col-span-1 px-2 py-0.5 shadow-lg"}/>
          )}
          {/* <Tag
            className={
              po_type != "G"
                ? "cursor-pointer col-span-1 px-2 py-0.5 shadow-lg"
                : "cursor-pointer col-span-2 px-2 py-0.5 shadow-lg"
            }
            color="#014737"
          >
            <StockOutlined /> Warehouse Quantity : {wer_stock || 0}
          </Tag> */}
            <InfoTags icon={<StockOutlined />} text={"Warehouse Quantity : " +(wer_stock || 0)}   color="#014737" bgCol={ po_type != "G"
                ? "cursor-pointer col-span-1 px-2 py-0.5 shadow-lg"
                : "cursor-pointer col-span-2 px-2 py-0.5 shadow-lg"}/>

          {/* {reqQty>0 && <Tag
            className="cursor-pointer col-span-1 px-2 py-0.5 shadow-lg"
            color="#eb8d00"
          >
            <StockOutlined /> Requisition Quantity : {reqQty || 0}
          </Tag>} */}
        </>
      ) : (
        <span className="text-green-900 flex gap-2">
          Fetching
          <LoadingOutlined className="text-green-900" />
        </span>
      )}
    </div>
  );
  const deleteItem = () => {
    setLoading(true);
    if (delMode == 1) {
      axios
        .post(url + "/api/deletedeliverydoc", {
          po_no: decodeURIComponent(params.po_no).toString(),
          user: localStorage.getItem("email"),
          id: id,
        })
        .then((res) => {
          setLoading(false);
          setVisible(false);
          if (res?.data?.suc > 0) {
            Message("success", res?.data?.msg);
            fileList.splice(0, 1);
          } else {
            Message("error", res?.data?.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          navigate("/error" + "/" + err.code + "/" + err.message);
        });
    } else {
      console.log(delMode);
      axios
        .post(url + "/api/deletemrn", { id: invoice })
        .then((res) => {
          setLoading(false);
          setVisible(false);
          if (res?.data?.suc > 0) {
            Message("success", res?.data?.msg);
            fileList.splice(0, 1);
            navigate(-1);
          } else {
            Message("error", res?.data?.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          navigate("/error" + "/" + err.code + "/" + err.message);
        });
    }
  };
  const getItemInfo = (po_no) => {
    setLoading(true);
    axios
      .post(url + "/api/getpo", { id: 0 })
      .then((resPO) => {
        setId(
          resPO?.data?.msg?.filter((e) => e.po_no == decodeURIComponent(params.po_no))[0]?.sl_no
        );
        setProjectId(
          resPO?.data?.msg?.filter((e) => e.po_no == decodeURIComponent(params.po_no))[0]
            ?.project_id
        );
        axios
          .post(url + "/api/getpoitemfordel", {
            id: resPO?.data?.msg?.filter((e) => e.po_no == decodeURIComponent(params.po_no))[0]
              ?.sl_no,
          })
          .then((resItems) => {
            console.log(resItems);
            setLoading(false);
            setItems(resItems?.data?.msg);

            for (let i of resItems?.data?.msg) {
              itemList.push({
                item_sl: i.item_sl,
                item_id: i.sl_no,
                sl_no: i.sl_no,
                name: i.prod_name,
                sl: i.sl,
                remarks: i.remarks,
                quantity: i.quantity,
                rc_qty: i.rc_qty,
                rc_by: i.created_by,
                rc_at: i.created_at,
                mrn_no: i.mrn_no,
                invoice: i.invoice,
                invoice_dt: i.invoice_dt,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            navigate("/error" + "/" + err.code + "/" + err.message);
          });
      })
      .catch((err) => {
        console.log(err);
        navigate("/error" + "/" + err.code + "/" + err.message);
      });

    axios
      .post(url + "/api/getpoitemforedit", {
        id: params.id,
      })
      .then((resPoItems) => {
        console.log(resPoItems);
        for (let i of resPoItems?.data?.msg) {
          isError.push({ flag: 0 });
          itemForm.push({
            item_id: i.sl_no,
            prod_id: i.item_id,
            sl_no: i.sl_no,
            name:
              i.prod_name +
              "@" +
              "Part No.:" +
              i.part_no +
              ", " +
              "Article No.:" +
              i.article_no +
              ", " +
              "Model No.:" +
              i.model_no,
            sl: "",
            remarks: "",
            quantity: i.quantity,
            rc_qty: 0,
          });
          itemFormCopy.push({
            item_id: i.sl_no,
            prod_id: i.item_id,
            sl_no: i.sl_no,
            name:
              i.prod_name +
              "@" +
              "Part No.:" +
              i.part_no +
              ", " +
              "Article No.:" +
              i.article_no +
              ", " +
              "Model No.:" +
              i.model_no,
            sl: "",
            remarks: "",
            quantity: i.quantity,
            rc_qty: 0,
          });
        }
        setItemForm(itemForm);
        console.log(itemForm, isError);
      });
  };

  const handleDtChange1 = (index, event) => {
    console.log(isError);
    console.log(event);
    let data = [...itemFormCopy];
    console.log(itemFormCopy, index);
    data[index][event.target.name] = event.target.value;
    if (!mrn_no) {
      if (data[index]["rc_qty"] > 0) setZeroError(0);
      else setZeroError(1);
    }

    if (
      data[index]["rc_qty"] < 0 ||
      +data[index]["rc_qty"] +
        rowSum(
          itemList.filter((e) => e.sl_no == data[index]["item_id"]),
          data[index]["quantity"]
        ).sum >
        data[index]["quantity"]
    ) {
      isError[index].flag = 1;
    } else {
      isError[index].flag = 0;
    }

    setItemForm(data);
    console.log(data);
    console.log(isError);
  };

  const handleDtChange = (index, event) => {
    console.log(isError);
    console.log(event);
    let data = [...itemFormCopy];
    let data1 = [...itemForm];
    data[index][event.target.name] = event.target.value;
    console.log(
      itemForm.findIndex((e) => e.sl_no == itemFormCopy[index].sl_no)
    );
    data1[itemForm.findIndex((e) => e.sl_no == itemFormCopy[index].sl_no)][
      event.target.name
    ] = event.target.value;
    if (!mrn_no) {
      if (data[index]["rc_qty"] > 0) setZeroError(0);
      else setZeroError(1);
    }

    if (
      data[index]["rc_qty"] < 0 ||
      +data[index]["rc_qty"] +
        rowSum(
          itemList.filter((e) => e.sl_no == data[index]["item_id"]),
          data[index]["quantity"]
        ).sum >
        data[index]["quantity"]
    ) {
      isError[index].flag = 1;
    } else {
      isError[index].flag = 0;
    }

    // setItemForm(data);
    setItemFormCopy(data);
    setItemForm(data1);
    console.log(data);
    console.log(isError);
    console.log(itemFormCopy, itemForm, "listtttttttttt");
  };
  const errorSum = (dt) => {
    let err = 0;
    for (let i of dt) err += i.flag;
    return err;
  };
  useEffect(() => {
    console.log(showDel);
    setShowDel(inv_el != "" ? true : false);
    console.log(
      mrnDetails.filter((e) => e.invoice == inv_el),
      showDel,
      inv_el
    );
    setInvoice(mrnDetails.filter((e) => e.invoice == inv_el)[0]?.invoice || "");
    setInvoiceDt(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.invoice_dt || ""
    );
    console.log(mrnDetails.filter((e) => e.invoice == inv_el)[0]?.approve_flag);
    setApproveFlag(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.approve_flag || ""
    );

    setRejNote(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.rejection_note || ""
    );

    setLrNo(mrnDetails.filter((e) => e.invoice == inv_el)[0]?.lr_no || "");
    setWayBill(mrnDetails.filter((e) => e.invoice == inv_el)[0]?.waybill || "");
    setIc(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.ic == "Y" ? true : false
    );
    setOg(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.og == "Y" ? true : false
    );
    setDc(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.dc == "Y" ? true : false
    );
    setLr(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.lr == "Y" ? true : false
    );
    setWb(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.wb == "Y" ? true : false
    );
    setPl(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.pl == "Y" ? true : false
    );
    setOm(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.om == "Y" ? true : false
    );
    setOmManual(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.om_manual == "Y"
        ? true
        : false
    );
    setWs(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.ws == "Y" ? true : false
    );
    setTc(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.tc == "Y" ? true : false
    );
    setWc(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.wc == "Y" ? true : false
    );
    // setOt(mrnDetails.filter(e=>e.invoice==inv_el)[0]?.ot == "Y" ? true : false);
    // setOtDesc(mrnDetails.filter(e=>e.invoice==inv_el)[0]?.ot_desc);
    setMrnNo(mrnDetails.filter((e) => e.invoice == inv_el)[0]?.mrn_no);
    setCon(
      mrnDetails.filter((e) => e.invoice == inv_el)[0]?.confirm == "Y"
        ? true
        : false
    );
    fileList.length = 0;
    if (inv_el)
      axios
        .post(url + "/api/getdeliverydoc", { po_no: inv_el })
        .then((resDoc) => {
          console.log(resDoc);
          for (let i of resDoc?.data?.msg) {
            fileList.push({
              sl_no: i.sl_no,
              doc: i.doc,
            });
          }
          setFileList(fileList);
          console.log(fileList);
          setOt(
            mrnDetails.filter((e) => e.invoice == inv_el)[0]?.ot == "Y"
              ? true
              : false
          );
          setOtDesc(mrnDetails.filter((e) => e.invoice == inv_el)[0]?.ot_desc);
        });
    else {
      setOt(false);
      setOtDesc("");
      fileList.length = 0;
    }
    // }, [inv_el]);
  }, [mrn_code]);
  const onsubmit = () => {
    onSubmit({
      po_no: decodeURIComponent(params.po_no),
      items: itemForm,
      lr_no: lr_no,
      invoice: invoice,
      ot_desc: ot_desc,
      doc1: doc,
      invoice_dt: inv_dt,
      waybill: waybill,
      ic: ic,
      og: og,
      dc: dc,
      lr: lr,
      wb: wb,
      pl: pl,
      om: om,
      om_manual: om_manual,
      ws: ws,
      tc: tc,
      wc: wc,
      ot: ot,
      confirm: con,
    });
  };
  // const zeroError=()=>{
  //   let flag=0
  //   if(!mrn_no){
  //     for(let i of itemForm){
  //       if(i.rc_qty>0){
  //         flag=1
  //         break
  //       }

  //     }
  //   }
  //   return flag
  // }
  const rowSum = (items, qty) => {
    let sum = 0;
    for (let i of items) sum += i.rc_qty;

    if (sum == qty) return { flag: 1, sum: sum };
    else return { flag: 0, sum: sum };
  };
  return (
    <section className="bg-transparent dark:bg-[#001529]">
      <HeadingTemplate
        text={title}
        mode={params.id > 0 ? 1 : 0}
        title={"Category"}
        data={""}
      />
       <BlockUI blocked={blocked} template={
                                                                           <div className='relative  w-full h-full 0 z-10'>
                                                                             <span className='absolute top-1 right-1 font-bold italic text-gray-500'><LockFilled className='text-green-900 '/> Locked (Readonly)</span>
                                                                        
                                                                           </div>
                                                                         } className={'bg-red-500'}>
      <Spin
        indicator={<LoadingOutlined spin />}
        size="large"
        className="text-green-900 dark:text-gray-400"
        spinning={loading}
      >
        <div className="grid grid-cols-12 gap-2">
          <div className={"w-full col-span-12 bg-white p-6 rounded-2xl"}>
            <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
              <div className="sm:col-span-12">
                <TDInputTemplate
                  placeholder="PO No."
                  type="text"
                  label="PO No."
                  name="po_no"
                  formControlName={decodeURIComponent(params.po_no)}
                  handleChange={(txt) => setPoNo(txt.target.value)}
                  disabled={params.id > 0}
                  mode={1}
                />
                {decodeURIComponent(params.po_no) && (
                  <div className="flex justify-between gap-2">
                    <Viewdetails
                      click={() => {
                        setFlag(14);
                        setVisible(true);
                      }}
                    />
                  </div>
                )}
              </div>
              {mrnList.length > 0 && (
                <div className="sm:col-span-12">
                  {/* <TDInputTemplate
                    placeholder="Select invoice"
                    type="text"
                    name="inv_el"
                    label="Invoice"
                    data={mrnList}
                    formControlName={inv_el}
                    handleChange={(event) => setInvEl(event.target.value)}
                    mode={2}
                  /> */}
                  <TDInputTemplate
                    placeholder="Select invoice"
                    type="text"
                    name="inv_el"
                    label="Invoice"
                    data={mrnList}
                    formControlName={inv_el}
                    handleFocus={(e) => op.current.show(e)}
                    handleChange={(event) => {
                      setInvEl(event.target.value);

                      if (event.target.value.length) op.current.show(event);
                      else {
                        op.current.hide(event);
                        setInvEl("");
                        setMrnNo("");
                        setCode("");
                      }
                    }}
                    mode={1}
                  />

                  <OverlayPanel
                    ref={op}
                    className="w-[72.7%]  border-2 bg-gray-50 border-[#C4F1BE]"
                  >
                    <span className="text-xs text-green-900 italic">
                      Search results for: "{inv_el}"
                    </span>
                    <ul class=" divide-y max-h-48 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                      {mrnList.filter((e) =>
                        e.name?.toLowerCase().includes(inv_el?.toLowerCase())
                      ).length > 0 &&
                        mrnList
                          .filter((e) =>
                            e.name
                              ?.toLowerCase()
                              .includes(inv_el?.toLowerCase())
                          )
                          ?.map((lst) => (
                            <li
                              onClick={(e) => {
                                op.current.hide(e);
                                setInvEl(lst.name);
                                setCode(lst.code);
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
                            </li>
                          ))}
                      {mrnList.filter((e) =>
                        e.name.toLowerCase().includes(inv_el?.toLowerCase())
                      ).length == 0 && <Empty />}
                    </ul>
                  </OverlayPanel>
                  {mrn_code && (
                    <span
                      scope="row"
                      className=" w-1/6 py-2 flex justify-between gap-10 items-center text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <a
                        onClick={() => {
                          setFlag(16);
                          // setItemInfo(
                          //   itemList.filter(
                          //     (e) => e.sl_no == item.sl_no
                          //   )
                          // );
                          getMrnLog();
                        }}
                      >
                        {/* <Tag color="#4FB477">
                          {" "}
                          <ClusterOutlined /> Items under this invoice
                        </Tag> */}
                        <InfoTags icon={<ClusterOutlined />} bgCol={'hover:scale-105 active:scale-90'} text="Items under this invoice" color="#4FB477"/>
                      </a>
                    </span>
                  )}
                </div>
              )}
              {mrn_no && (
                <div className="sm:col-span-12 flex justify-between">
                  {approve_flag == "A" ? (
                    // <Tag
                    //   className="text-[12px] p-1 rounded-full w-36"
                    //   icon={<CheckCircleOutlined />}
                    //   color="success"
                    // >
                    //   Approved
                    // </Tag>
                    <InfoTags text="Approved" icon={<CheckCircleOutlined />} color="success" bgCol={"text-[12px] p-1 rounded-full w-36"}/>
                  ) : approve_flag == "P" ? (
                    // <Tag
                    //   className="text-[12px] p-1 rounded-full w-36"
                    //   icon={<SyncOutlined spin />}
                    //   color="processing"
                    // >
                    //   Pending
                    // </Tag>
                    <InfoTags text="Pending" icon={<SyncOutlined spin />} color="processing" bgCol={"text-[12px] p-1 rounded-full w-36"}/>

                  ) : (
                    // <Tag
                    //   className="text-[12px] p-1 rounded-full w-auto"
                    //   icon={<CloseCircleOutlined className="animate-spin" />}
                    //   color="error"
                    // >
                    //   Rejected | {rej_note}
                    // </Tag>
                    <InfoTags text={"Rejected |"+rej_note} icon={<CloseCircleOutlined className="animate-spin" />} color="error" bgCol={"text-[12px] p-1 rounded-full w-auto"}/>

                  )}
                  {/* <Tag className="text-lg" color="#eb8d00">
                    {mrn_no}
                  </Tag> */}
                  <InfoTags text={mrn_no} icon={<FileDoneOutlined/>} bgCol={'text-lg'} color="#eb8d00"/>
                </div>
              )}

              <table className="w-full border-separate border border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400 sm:col-span-12">
                <thead className="text-xs bg-[#C4F1BE] font-bold uppercase text-green-900 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 w-1/4 font-bold">
                      Invoice No.{" "}
                      <span className="text-xs text-red-600">*</span>
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/4 font-bold">
                      Invoice Date{" "}
                      <span className="text-xs text-red-600">*</span>
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/4 font-bold">
                      LR No.
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/4 font-bold">
                      Waybill
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-[#DDEAE0]  border-b-2 border-white my-3 font-bold dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-4 w-1/4 py-4  text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <TDInputTemplate
                        placeholder="Invoice No."
                        type="text"
                        name="invoice"
                        formControlName={invoice}
                        handleChange={(txt) => {
                          setInvoice(txt.target.value);
                        }}
                        handleBlur={(txt) => {
                          if (txt.target.value) {
                            setCheckLoad(true);
                            axios
                              .post(url + "/api/checkinvoice", {
                                inv_no: txt.target.value,
                              })
                              .then((res) => {
                                console.log(res.data.msg.count);
                                setCheckLoad(false);
                                setCount(res.data.msg.count);
                              });
                          }
                        }}
                        disabled={inv_el != "" && inv_el != "Select invoice"}
                        mode={1}
                      />
                      {checkload && (
                        // <Tag icon={<SyncOutlined spin />} color="processing">
                        //   Checking...
                        // </Tag>
                        <InfoTags text="Checking..." icon={<SyncOutlined spin />} color="processing"/>
                      )}
                      {count > 0 && (
                        <VError title={"Invoice No. already exists"} />
                      )}
                    </th>
                    <td className="px-6 py-4 w-1/4">
                      <TDInputTemplate
                        placeholder="Invoice Date"
                        type="date"
                        name="inv_dt"
                        formControlName={inv_dt}
                        handleChange={(txt) => setInvoiceDt(txt.target.value)}
                        // min={moment(
                        //   new Date(
                        //     new Date().setFullYear(new Date().getFullYear() - 3)
                        //   )
                        // ).format("yyyy-MM-DD")}
                        // max={moment(new Date()).format("yyyy-MM-DD")} 
                         min={formatDate(
                          new Date(
                            new Date().setFullYear(new Date().getFullYear() - 3)
                          )
                        ,"yyyy-MM-DD")}
                        max={formatDate(new Date(),"yyyy-MM-DD")} 
                        mode={1}
                      />

                    </td>
                    <td className="px-6 py-4 w-1/4">
                      <TDInputTemplate
                        placeholder="LR No."
                        type="text"
                        name="lr_no"
                        formControlName={lr_no}
                        handleChange={(txt) => setLrNo(txt.target.value)}
                        mode={1}
                      />
                      {lr && !lr_no && <VError title="Required" />}
                    </td>
                    <td className="px-6 py-4 w-1/4">
                      <TDInputTemplate
                        placeholder="Waybill"
                        type="text"
                        name="waybill"
                        formControlName={waybill}
                        handleChange={(txt) => setWayBill(txt.target.value)}
                        mode={1}
                      />
                      {wb && !waybill && <VError title="Required" />}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="bg-[#C4F1BE] px-6 py-3  sm:col-span-12 text-green-900 font-bold text-xs uppercase">
                Documents
              </div>
              <div
                style={{ width: "100%" }}
                className="border-2 bg-[#DDEAE0] rounded-b-lg p-3 -mt-6  sm:col-span-12 border-gray-300"
              >
                <Row>
                  <Col span={8}>
                    <Checkbox checked={ic} name="ic" onChange={onChangeIc}>
                      Insurance Certificate
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox checked={og} name="og" onChange={onChangeIc}>
                      Original Copy
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox checked={dc} name="dc" onChange={onChangeIc}>
                      Duplicate Copy
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox checked={lr} name="lr" onChange={onChangeIc}>
                      LR
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox checked={wb} name="wb" onChange={onChangeIc}>
                      Waybill
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox checked={pl} name="pl" onChange={onChangeIc}>
                      Packing List
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox checked={om} name="om" onChange={onChangeIc}>
                      Operation and Maintenance
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox
                      checked={om_manual}
                      name="om_manual"
                      onChange={onChangeIc}
                    >
                      O&M Manual
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox checked={ws} name="ws" onChange={onChangeIc}>
                      Weighing Slip
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox checked={tc} name="tc" onChange={onChangeIc}>
                      TC
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox checked={wc} name="wc" onChange={onChangeIc}>
                      Warranty Certificate
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox checked={ot} name="ot" onChange={onChangeIc}>
                      Others
                    </Checkbox>
                  </Col>
                </Row>
                {ot == true && (
                  <Row>
                    <Col span={24} className="my-2">
                      <TDInputTemplate
                        placeholder="Specify Document"
                        type="text"
                        name="ot_desc"
                        label="Specify Document"
                        formControlName={ot_desc}
                        handleChange={(txt) => setOtDesc(txt.target.value)}
                        mode={3}
                      />
                    </Col>
                  </Row>
                )}
                {ot == true && (
                  <Row>
                    <Col span={24} className="my-2">
                      <TDInputTemplate
                        placeholder="Other Document"
                        type="file"
                        name="ot_desc"
                        label="Other Document"
                        // formControlName={ot_desc}
                        handleChange={(txt) => setDoc(txt.target.files[0])}
                        mode={1}
                      />
                      {fileList?.map((item) => (
                        <div className="relative">
                          <a
                            target="_blank"
                            href={url + "/uploads/" + item.doc}
                          >
                            {item?.doc?.toString().split(".")[1] == "pdf" ? (
                              <FilePdfOutlined className="text-6xl my-7 text-red-600" />
                            ) : item?.doc
                                ?.toString()
                                .split(".")[1]
                                ?.includes("doc") ? (
                              <FileWordOutlined className="text-6xl my-7 text-blue-900" />
                            ) : item?.doc
                                ?.toString()
                                .split(".")[1]
                                ?.includes("xls") ||
                              item?.doc
                                ?.toString()
                                .split(".")[1]
                                ?.includes("csv") ? (
                              <FileExcelOutlined className="text-6xl my-7 text-green-800" />
                            ) : (
                              <FileImageOutlined className="text-6xl my-7 text-yellow-500" />
                            )}
                          </a>
                          <DeleteOutlined
                            className="text-red-800 absolute top-6 "
                            onClick={() => {
                              setId(item.sl_no);
                              setFlag(4);
                              setDelMode(1);
                              setVisible(true);
                            }}
                          />
                        </div>
                      ))}
                    </Col>
                  </Row>
                )}
              </div>

              <ScrollPanel
                style={{
                  width: "100%",
                  maxheight: "900px",
                  minHeight: "250px",
                }}
                className="relative border-2 overflow-x-hidden border-gray-300 p-2 rounded-lg sm:col-span-12"
              >
                <input
                  type="search"
                  id="default-search"
                  className="bg-gray-200 border-gray-300 border-2 sticky shadow-lg top-1 z-10 rounded-full  text-gray-800 text-sm  my-1 mb-2 p-2  duration-500 block w-full focus:border-gray-200 focus:ring-gray-200 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={(e) => {
                    setItemFormCopy(
                      itemForm.filter((lst) =>
                        lst.name
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase())
                      )
                    );
                    console.log(
                      itemForm.filter((lst) =>
                        lst.name
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase())
                      )
                    );
                  }}
                  placeholder="Search by items, part no.,article no.,model_no."
                />

                <div>
                  {itemFormCopy.map((item, index) => (
                    <>
                      {/* {itemFormCopy.length > 1 && (
                        <Divider
                          style={{ borderColor: "#014737", color: "#A8A29E" }}
                        >
                          <span className="text-green-900 flex justify-between">
                            {rowSum(
                              itemList.filter((e) => e.sl_no == item.item_id),
                              item.quantity
                            ).flag == 1 ? (
                              <CheckCircleFilled className="text-lg text-green-900" />
                            ) : rowSum(
                                itemList.filter((e) => e.sl_no == item.item_id),
                                item.quantity
                              ).sum > 0 ? (
                              <ClockCircleFilled className="text-lg text-amber-600" />
                            ) : (
                              <CloseCircleFilled className="text-[#92140C]" />
                            )}{" "}
                          </span>
                        </Divider>
                      )} */}
                      <table className="w-full my-2 border-separate border border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400">
                        <thead className="text-xs bg-[#C4F1BE] font-bold uppercase text-green-900 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-1.5 w-1/6 font-bold"
                            >
                              Item
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-1.5 w-1/6 font-bold text-nowrap"
                            >
                              Ordered Quantity
                            </th>
                            {rowSum(
                              itemList.filter((e) => e.sl_no == item.item_id),
                              item.quantity
                            ).sum > 0 &&
                              rowSum(
                                itemList.filter((e) => e.sl_no == item.item_id),
                                item.quantity
                              ).sum < item.quantity && (
                                <th
                                  scope="col"
                                  className="px-6 py-1.5 w-1/6 font-bold text-nowrap"
                                >
                                  Already Received
                                </th>
                              )}
                            <th
                              scope="col"
                              className="px-6 py-1.5 w-1/6 font-bold text-nowrap"
                            >
                              Received Quantity
                            </th>
                            {rowSum(
                              itemList.filter((e) => e.sl_no == item.item_id),
                              item.quantity
                            ).flag == 0 && (
                              <th
                                scope="col"
                                className="px-6 py-1.5 w-1/6 font-bold"
                              >
                                Sl No.
                              </th>
                            )}
                            {rowSum(
                              itemList.filter((e) => e.sl_no == item.item_id),
                              item.quantity
                            ).flag == 0 && (
                              <th
                                scope="col"
                                className="px-6 py-1.5 w-1/6 font-bold"
                              >
                                Remarks
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-[#DDEAE0] border-b-2 border-white my-3 font-bold dark:bg-gray-800 dark:border-gray-700">
                            <th
                              scope="row"
                              className="px-4 w-1/6  py-1.5 max-w-52 flex-wrap justify-between gap-10 items-center  text-gray-900  dark:text-white"
                            >
                              <div className="flex gap-2 text-wrap justify-start items-center">
                                {index+1} &nbsp;
                                {/* <Tag
                                className='text-wrap'
                                  color={
                                    rowSum(
                                      itemList.filter(
                                        (e) => e.sl_no == item.item_id
                                      ),
                                      item.quantity
                                    ).flag == 1
                                      ? "#014737"
                                      : rowSum(
                                          itemList.filter(
                                            (e) => e.sl_no == item.item_id
                                          ),
                                          item.quantity
                                        ).sum > 0
                                      ? "#eb8d00"
                                      : "#92140C"
                                  }
                                >
                                  {" "}
                                  {item.name.split("@")[0]}{" "} 
                                </Tag> */}
                                <InfoTags text={item.name.split("@")[0]+' '}   color={
                                    rowSum(
                                      itemList.filter(
                                        (e) => e.sl_no == item.item_id
                                      ),
                                      item.quantity
                                    ).flag == 1
                                      ? "#014737"
                                      : rowSum(
                                          itemList.filter(
                                            (e) => e.sl_no == item.item_id
                                          ),
                                          item.quantity
                                        ).sum > 0
                                      ? "#eb8d00"
                                      : "#92140C"
                                  }
                                  bgCol={'text-wrap'}/>

                                <Popover
                                  content={content}
                                  title={"Stock level (Physical Quantities)"}
                                  trigger="click"
                                >
                                  <span
                                    onClick={() => {
                                      // setProjStock(items?.filter(e=>e.sl_no==item.item_id)[0]?.project_stock)
                                      // setWerStock(items?.filter(e=>e.sl_no==item.item_id)[0]?.warehouse_stock)
                                      setStockLoad(true);
                                      axios
                                        .post(url + "/api/getstock", {
                                          proj_id: project_id,
                                          prod_id: item.prod_id,
                                        })
                                        .then((res) => {
                                          console.log(res);
                                          setStockLoad(false);

                                          setProjStock(
                                            res?.data?.result?.msg[0]
                                              ?.project_stock
                                            // res?.data?.result?.msg[0]?.project_stock - res?.data?.req_stock
                                          );
                                          setWerStock(
                                            res?.data?.result?.msg[0]
                                              ?.warehouse_stock || 0
                                          );
                                          setReqQty(res?.data?.req_stock || 0);
                                        });
                                    }}
                                  >
                                    <div>
                                      <DropboxOutlined className="text-sm cursor-pointer hover:scale-150 hover:duration-300 hover:text-green-500 " />
                                      <p className="text-xs -ml-2"> Stock </p>
                                    </div>
                                  </span>
                                </Popover>
                              </div>
                              {/* <Tag
                                color="green"
                                className="text-[10px] text-wrap whitespace-wrap block my-1"
                              >
                                {" "}
                                {item.name.split("@")[1]}{" "}
                              </Tag> */}
                              <InfoTags text={item.name.split("@")[1]+' '} color="green"
                                bgCol="text-[10px] text-wrap whitespace-wrap block my-1"/>
                            </th>
                            <th
                              scope="row"
                              className="px-4 w-1/6 py-1.5  text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {rowSum(
                                itemList.filter((e) => e.sl_no == item.item_id),
                                item.quantity
                              ).flag == 0 ? (
                                <TDInputTemplate
                                  placeholder="Quantity"
                                  type="number"
                                  name="quantity"
                                  disabled={true}
                                  formControlName={item.quantity}
                                  mode={1}
                                />
                              ) : (
                                <span className="flex justify-between">
                                  <span className="text-green-900">
                                    {item.quantity}
                                  </span>

                                  <a
                                    className="my-2"
                                    onClick={() => {
                                      setFlag(15);
                                      setItemInfo(
                                        itemList.filter(
                                          (e) => e.sl_no == item.sl_no
                                        )
                                      );
                                      setVisible(true);
                                    }}
                                  >
                                    {/* <Tag color="#4FB477">
                                      {" "}
                                      <BranchesOutlined /> View Log
                                    </Tag> */}
                                    <InfoTags color="#4FB477" icon={<BranchesOutlined />} text="View Log" bgCol={'hover:scale-105 active:scale-90'}/>
                                  </a>
                                </span>
                              )}
                            </th>
                            {rowSum(
                              itemList.filter((e) => e.sl_no == item.item_id),
                              item.quantity
                            ).sum > 0 &&
                              rowSum(
                                itemList.filter((e) => e.sl_no == item.item_id),
                                item.quantity
                              ).sum < item.quantity && (
                                <th
                                  scope="row"
                                  className="px-4 w-1/6 py-1.5 flex justify-between gap-10 items-center text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                  <span>
                                    {
                                      rowSum(
                                        itemList.filter(
                                          (e) => e.sl_no == item.item_id
                                        ),
                                        item.quantity
                                      ).sum
                                    }
                                  </span>
                                  <a
                                    className="my-2"
                                    onClick={() => {
                                      setFlag(15);
                                      setItemInfo(
                                        itemList.filter(
                                          (e) => e.sl_no == item.sl_no
                                        )
                                      );
                                      setVisible(true);
                                    }}
                                  >
                                    {/* <Tag color="#4FB477">
                                      {" "}
                                      <BranchesOutlined /> View Log
                                    </Tag> */}
                                    <InfoTags color="#4FB477" icon={<BranchesOutlined />} text="View Log" bgCol={'hover:scale-105 active:scale-90'}/>

                                    <p className="my-2 ">
                                      {/* <Tag
                                        onClick={(e) => e.preventDefault()}
                                        color="#92140C"
                                      >
                                        {" "}
                                        Pending :{" "}
                                        {parseFloat(item.quantity -
                                          rowSum(
                                            itemList.filter(
                                              (e) => e.sl_no == item.item_id
                                            ),
                                            item.quantity
                                          ).sum).toFixed(3)}{" "}
                                      </Tag>{" "} */}
                                    <InfoTags onPress={(e) => e.preventDefault()} color="#92140C" icon={<BranchesOutlined />} text={` Pending ${parseFloat(item.quantity -
                                          rowSum(
                                            itemList.filter(
                                              (e) => e.sl_no == item.item_id
                                            ),
                                            item.quantity
                                          ).sum).toFixed(3)}`} bgCol={'hover:scale-105 active:scale-90'}/>

                                    </p>
                                  </a>
                                </th>
                              )}
                            <td className="px-6 py-1.5 w-1/6">
                              {rowSum(
                                itemList.filter((e) => e.sl_no == item.item_id),
                                item.quantity
                              ).flag == 0 ? (
                                <TDInputTemplate
                                  placeholder="Quantity"
                                  type="number"
                                  name="rc_qty"
                                  formControlName={item.rc_qty}
                                  handleChange={(event) =>
                                    handleDtChange(index, event)
                                  }
                                  mode={1}
                                />
                              ) : (
                                <span className="text-green-900 flex justify-between">
                                  {
                                    rowSum(
                                      itemList.filter(
                                        (e) => e.sl_no == item.item_id
                                      ),
                                      item.quantity
                                    ).sum
                                  }
                                  {rowSum(
                                    itemList.filter(
                                      (e) => e.sl_no == item.item_id
                                    ),
                                    item.quantity
                                  ).flag == 1 ? (
                                    <CheckCircleFilled className="text-lg text-green-900" />
                                  ) : (
                                    <ClockCircleFilled className="text-lg text-amber-600" />
                                  )}{" "}
                                </span>
                              )}
                              {item.quantity <
                              +item.rc_qty +
                                rowSum(
                                  itemList.filter(
                                    (e) => e.sl_no == item.item_id
                                  ),
                                  item.quantity
                                ).sum ? (
                                <VError
                                  title={
                                    "Invalid quantity,should be <=" +
                                    (item.quantity -
                                      rowSum(
                                        itemList.filter(
                                          (e) => e.sl_no == item.item_id
                                        ),
                                        item.quantity
                                      ).sum)
                                  }
                                />
                              ) : null}
                              {item.rc_qty < 0 ? (
                                <VError
                                  title={"Invalid quantity should be >0"}
                                />
                              ) : null}
                            </td>
                            {rowSum(
                              itemList.filter((e) => e.sl_no == item.item_id),
                              item.quantity
                            ).flag == 0 ? (
                              <td className="px-6 py-1.5 w-1/6">
                                <TDInputTemplate
                                  placeholder="Sl No."
                                  type="text"
                                  name="sl"
                                  formControlName={item.sl}
                                  handleChange={(event) =>
                                    handleDtChange(index, event)
                                  }
                                  mode={1}
                                />
                              </td>
                            ) : null}
                            {rowSum(
                              itemList.filter((e) => e.sl_no == item.item_id),
                              item.quantity
                            ).flag == 0 && (
                              <td className="px-6 py-1.5 w-1/4">
                                <TDInputTemplate
                                  placeholder="Remarks"
                                  type="text"
                                  name="remarks"
                                  formControlName={item.remarks}
                                  handleChange={(event) =>
                                    handleDtChange(index, event)
                                  }
                                  mode={1}
                                />
                              </td>
                            )}
                          </tr>
                        </tbody>
                      </table>
                      {/* <table className="w-full border-separate border border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400">
                        {rowSum(
                          itemList.filter((e) => e.sl_no == item.item_id),
                          item.quantity
                        ).flag == 0 && (
                          <>
                            <thead className="text-xs bg-[#C4F1BE] font-bold uppercase text-green-900 dark:bg-gray-700 dark:text-gray-400">
                              <tr>
                              
                                <th
                                  scope="col"
                                  className="px-6 py-3 w-1/4 font-bold"
                                >
                                  Remarks
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-[#DDEAE0] border-b-2 border-white my-3 font-bold dark:bg-gray-800 dark:border-gray-700">
                             
                                <td className="px-6 py-4 w-1/4">
                                  <TDInputTemplate
                                    placeholder="Remarks"
                                    type="text"
                                    name="remarks"
                                    formControlName={item.remarks}
                                    handleChange={(event) =>
                                      handleDtChange(index, event)
                                    }
                                    mode={1}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </>
                        )}
                      </table> */}
                    </>
                  ))}
                </div>
              </ScrollPanel>
            </div>
            {/* <Tag className="my-5 border-green-900 " color="#C4F1BE">
              <Checkbox
                className="italic font-bold"
                checked={con}
                name="con"
                onChange={onChangeIc}
              >
                I have checked all the materials and have gone through the
                quantities and the serial numbers of each
              </Checkbox>
            </Tag> */}
            <InfoTags text={
              <Checkbox
                className="italic font-bold"
                checked={con}
                name="con"
                onChange={onChangeIc}
              >
                I have checked all the materials and have gone through the
                quantities and the serial numbers of each
              </Checkbox>
            }
            bgCol="my-5 border-green-900 " color="#C4F1BE"/>
            {zeroError ? (
              <p>
                <VError title={"Must enter atleast one received quantity"} />
              </p>
            ) : null}
            <div className="flex justify-center items-center gap-4">
              {/* {!con } {errorSum(isError)} {zeroError} { invoice } {inv_dt}  */}
              {showDel && approve_flag != "A" && det.mrn != 1 && (
                // <button
                //   // disabled={!con || errorSum(isError) ||zeroError || !invoice || !inv_dt || checkload || count>0}
                //   onClick={() => {
                //     setFlag(4);
                //     setDelMode(2);
                //     setVisible(true);
                //   }}
                //   className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
                // >
                //   <span class="relative z-10">
                //   <DeleteOutlined className="mr-1" />
                //   Delete
                //   </span>
                //   <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
                // </button>
                <BtnGroupReuse flag={2} text="Delete" icon={<DeleteOutlined className="mr-2"/>}  onClick={() => {
                    setFlag(4);
                    setDelMode(2);
                    setVisible(true);
                  }} 
                  
                  
                  />
              )}
              {!showDel && det.mrn != 1 && (
                // <button
                //   disabled={
                //     !con ||
                //     errorSum(isError) ||
                //     zeroError ||
                //     !invoice ||
                //     !inv_dt ||
                //     checkload ||
                //     count > 0 ||
                //     (wb && !waybill) ||
                //     (!lr_no && lr)
                //   }
                //   onClick={() => onsubmit()}
                //   className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
                // >
                //  <span class="relative z-10">
                //          <SaveOutlined className='mr-2' />
                //          Submit
                //          </span>
                //          <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
                // </button>
                <BtnGroupReuse flag={1} onClick={() => onsubmit()}  disabled={
                    !con ||
                    errorSum(isError) ||
                    zeroError ||
                    !invoice ||
                    !inv_dt ||
                    checkload ||
                    count > 0 ||
                    (wb && !waybill) ||
                    (!lr_no && lr)
                  }
                  icon={ 
                         <SaveOutlined className='mr-2' />

                  } 
                  loading={loading} text="Submit"/>
              )}
            </div>
          </div>
        </div>
      </Spin>
      </BlockUI>
      <DialogBox
        visible={visible}
        flag={flag1}
        id={id}
        // data={itemList}
        data={itemInfo}
        onPress={() => setVisible(false)}
        onDelete={() => deleteItem()}
        confirm={(value) => {
          if (value) {
            setVisible(false);
            window.location.reload();
          }
        }}
      />
    </section>
  );
}

export default DeliveryFormComp;
