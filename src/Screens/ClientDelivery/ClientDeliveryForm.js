import React, { useEffect, useRef, useState } from "react";
import HeadingTemplate from "../../Components/HeadingTemplate";
import { Empty, Spin, Tag } from "antd";
import {
  ClusterOutlined,
  EyeOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { BlockUI } from "primereact/blockui";

import { useNavigate, useParams } from "react-router-dom";
import TDInputTemplate from "../../Components/TDInputTemplate";
import DialogBox from "../../Components/DialogBox";
import Viewdetails from "../../Components/Viewdetails";
import axios from "axios";
import { url } from "../../Address/BaseUrl";
import VError from "../../Components/VError";
import { Message } from "../../Components/Message";
import { Checkbox, Col, Row } from "antd";

import { Popover} from "antd";
import { SyncOutlined } from "@mui/icons-material";
import { OverlayPanel } from "primereact/overlaypanel";
import { formatDate } from "../../Functions/formatDate";
function ClientDeliveryForm() {
  const op = useRef(null);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [invoice, setInvoice] = useState("");
  const [inv_dt, setInvoiceDt] = useState("");
  const [lr_no, setLrNo] = useState("");
  const [waybill, setWayBill] = useState("");
  const [inv_el, setInvEl] = useState("");
  const [stockData, setStockData] = useState([]);
  const [reqQty, setReqQty] = useState(0);
  const [txt, setText] = useState("");
  const [rej_note, setRejNote] = useState("");
  const [con, setCon] = useState(false);
  const [checkload, setCheckLoad] = useState(false);

  // const [invList,setInvList]=useState([{sl:0,invoice:'',inv_dt:'',lr_no:'',waybill:''}])
  // const [doc, setDoc] = useState("");
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
  const [inv_list,setInvList] = useState([])
  const [remarks, setRemarks] = useState("");
  const [del_date, setDelDate] = useState("");
  const [remarkstoEdit, setRemarksEdit] = useState("");
  const [del_datetoEdit, setDelDateEdit] = useState("");
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState(0);
  const [itemDelivery, setItemDelivery] = useState([]);
  const [project_id, setProjectId] = useState(0);
  const [doc, setDoc] = useState("");
  const [delNo, setDelNo] = useState("");
  const [flag, setFlag] = useState(0);
  const [index, setIndex] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [prevLoad, setPrevLoad] = useState(false);
  const [delList, setDelList] = useState([]);
  const [item_id, setItemId] = useState(0);
  const [prod_name, setProdName] = useState("");
  const [rec_qty, setMrnQty] = useState(0);
  const [rec_by, setRecBy] = useState(0);
  const [invData, setInvData] = useState([]);
  // const [inv_el, setInvEl] = useState([]);
  const [code,setCode] = useState()
  const navigate = useNavigate();
  const [blocked, setBlocked] = useState(false);
  const det = JSON.parse(localStorage.getItem("perm"));
  const content = (
    <div className="bg-gray-300 max-w-48 rounded-md p-3 flex flex-wrap gap-3">
      {!prevLoad &&
        delList.map((item) => (
          <Tag
            onClick={() => getDelDetails(item.del_no, item_id)}
            className="bg-green-900 cursor-pointer border-green-900 text-white"
          >
            {item.del_no}
          </Tag>
        ))}

      {prevLoad && <LoadingOutlined className="text-green-900" spin />}
    </div>
  );
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
    setBlocked(det.mrn == 1 ? true : false);

    setLoading(true);
    axios.post(url + "/api/getpoinfo", { id: decodeURIComponent(params.po_no) }).then((res) => {
      console.log(res);
      setId(res?.data?.msg[0]?.sl_no);
      setProjectId(res?.data?.msg[0]?.project_id);
      axios
        .post(url + "/api/getpoitemfordirectdelivery", {
          id: res?.data?.msg[0]?.sl_no,
        })
        .then((resItem) => {
          setLoading(false);
          console.log(resItem);
          setItemDelivery([]);
          itemDelivery.length = 0;
          for (let i of resItem?.data?.msg) {
            itemDelivery.push({
              prod_name: i.prod_name,
              item_id: i.item_id,
              rc_qty: i.quantity,
              prev: i.prev_mrn || 0,
              mrn_qty: i.quantity - (i.prev_mrn || 0),
              error: 0,
            });
          }
          setItemDelivery(itemDelivery);
          axios
            .post(url + "/api/get_vtoc_invoice_list", { po_no:  decodeURIComponent(params.po_no) })
            .then((res) => {console.log(res)
              setInvList(res?.data?.msg)
            });
        });
    });
  }, []);

  //   {
  //     "sl_no": 1,
  //     "del_no": "DEL-1731932982",
  //     "po_no": "2024000177",
  //     "del_date": "2024-11-18",
  //     "remarks": "Remarks",
  //     "created_by": "user_test@gmail.com",
  //     "created_at": "2024-11-18T17:59:42",
  //     "modified_by": null,
  //     "modified_at": null
  // }
  const handleDtChange = (e, i) => {
    let dt = [...itemDelivery];
    if (+e.target.value >= dt[i]["rc_qty"] - dt[i]["prev"]) dt[i]["error"] = 1;
    else dt[i]["error"] = 0;
    dt[i][e.target.name] = +e.target.value;
    setItemDelivery(dt);
  };
  // useEffect(() => {
  const getDelNo = (item_id) => {
    setPrevLoad(true);
    setItemId(item_id);
    axios
      .post(url + "/api/getprevdelno", {
        po_no:  decodeURIComponent(params.po_no),
        item_id: item_id,
      })
      .then((res) => {
        console.log(res);
        setDelList(res?.data?.msg);
        setPrevLoad(false);
      });
  };
  const getDelDetails = (del_no, item_id) => {
    setPrevLoad(true);
    axios
      .post(url + "/api/get_vtoc", { del_no: del_no, item_id: item_id })
      .then((res) => {
        console.log(res);

        setDelDate(res?.data?.msg[0]?.del_date || "");
        setRemarks(res?.data?.msg[0]?.remarks || "");
        setDelNo(res?.data?.msg[0]?.del_no);
        setIndex(res?.data?.msg[0]?.sl_no);
        setProdName(res?.data?.msg[0]?.prod_name);
        setMrnQty(res?.data?.msg[0]?.qty);
        setRecBy(res?.data?.msg[0]?.created_by);
        setInvData(res?.data?.msg);
        if (res?.data?.msg[0]?.sl_no.toString()) {
          axios
            .post(url + "/api/get_vtoc_doc", {
              del_sl_no: res?.data?.msg[0]?.sl_no.toString(),
            })
            .then((resDoc) => {
              setPrevLoad(false);
              setFlag(36);
              setVisible(true);

              console.log(resDoc);
              setFileList(resDoc?.data?.msg);
            });
        }
      });
  };
  // axios.post(url + "/api/get_vtoc", { po_no: params.po_no }).then((res) => {
  //   console.log(res);
  //   setDelDate(res?.data?.msg[0]?.del_date || "");
  //   setRemarks(res?.data?.msg[0]?.remarks || "");
  //   setDelNo(res?.data?.msg[0]?.del_no);
  //   setIndex(res?.data?.msg[0]?.sl_no);
  //   if (res?.data?.msg[0]?.sl_no.toString()) {
  //     axios
  //       .post(url + "/api/get_vtoc_doc", {
  //         del_sl_no: res?.data?.msg[0]?.sl_no.toString(),
  //       })
  //       .then((resDoc) => {
  //         console.log(resDoc);
  //         setFileList(resDoc?.data?.msg);
  //       });
  //   }
  // });
  // }, []);
  const onSubmit = () => {
    setLoading(true);
    axios
      .post(url + "/api/add_v_to_c", {
        po_no:  decodeURIComponent(params.po_no),
        project_id: project_id,
        items: itemDelivery.filter((e) => e.mrn_qty != 0),
        user: localStorage.getItem("email"),
        del_dt: del_datetoEdit,
        remarks: remarkstoEdit,
        invoice: invoice,
        invoice_dt: inv_dt,
        lr_no: lr_no,
        waybill: waybill,
        ic: ic ? "Y" : "N",
        og: og ? "Y" : "N",
        dc: dc ? "Y" : "N",
        lr: lr ? "Y" : "N",
        wb: wb ? "Y" : "N",
        pl: pl ? "Y" : "N",
        om: om ? "Y" : "N",
        ws: ws ? "Y" : "N",
        tc: tc ? "Y" : "N",
        wc: wc ? "Y" : "N",
        om_manual: om_manual ? "Y" : "N",
        confirm: con ? "Y" : "N",
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        if (res?.data?.suc > 0) {
          const formData = new FormData();
          formData.append("user", localStorage.getItem("email"));
          formData.append("lastID", res?.data?.lastID);
          formData.append("v_to_c_img", doc);
          axios.post(url + "/api/add_vtoc_img", formData).then((resImg) => {
            console.log(resImg);
            if (resImg?.data?.suc > 0) {
              Message("success", resImg?.data?.msg);
              navigate(-1);
            } else {
              Message("error", resImg?.data?.msg);
            }
          });
        } else {
          Message("error", res?.data?.msg);
        }
      });
  };
  const onDelete = () => {};
  return (
    <section className="bg-transparent dark:bg-[#001529]">
      <HeadingTemplate
        text={"Update Delivery"}
        mode={params.id > 0 ? 1 : 0}
        data={""}
      />
      <BlockUI blocked={blocked} className={"bg-red-500"}>
        <div className="grid grid-cols-12 gap-2">
          <div className={"w-full col-span-12 bg-white p-6 rounded-2xl"}>
            <Spin
              indicator={<LoadingOutlined spin />}
              size="large"
              className="text-green-900 dark:text-gray-400"
              spinning={loading}
            >
              {/* <span className="flex justify-start my-2">
            </span> */}
              <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
                {/* {delNo && (
                <div className="sm:col-span-12 flex justify-end">
                  <Tag color="#eb8d00"> {delNo} </Tag>
                </div>
              )} */}
                <div className="sm:col-span-6 ">
                  <TDInputTemplate
                    placeholder="PO"
                    type="text"
                    label="PO"
                    name="po"
                    formControlName={ decodeURIComponent(params.po_no)}
                    disabled={true}
                    mode={1}
                  />
                  { decodeURIComponent(params.po_no) && (
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
                <div className={"sm:col-span-6"}>
                  <TDInputTemplate
                    placeholder="Date"
                    type="date"
                    label="Date"
                    name="dt"
                    handleChange={(txt) => setDelDateEdit(txt.target.value)}
                    min={formatDate(
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 3)
                      )
                    ,"yyyy-MM-DD")} //may need to change
                    formControlName={del_datetoEdit}
                    max={formatDate(new Date(),"yyyy-MM-DD")}
                    // formControlName={params.po_no}
                    // disabled={true}
                    mode={1}
                  />
                  {!del_datetoEdit && <VError title={"Date is required"} />}
                </div>
                <div className="sm:col-span-12 ">
                  <TDInputTemplate
                    placeholder="Remarks"
                    type="text"
                    label="Remarks"
                    name="remarks"
                    formControlName={remarkstoEdit}
                    handleChange={(txt) => setRemarksEdit(txt.target.value)}
                    //   disabled={true}
                    mode={3}
                  />
                </div>
                <div className="sm:col-span-12 ">
                  <TDInputTemplate
                    placeholder="Document"
                    type="file"
                    label="Document"
                    name="doc"
                    // formControlName={remarks}
                    handleChange={(txt) => setDoc(txt.target.files[0])}
                    // disabled={true}
                    mode={1}
                  />
                </div>
                {/*  */}

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
                                .post(url + "/api/checkinvoice_vtoc", {
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
                          <Tag
                            icon={
                              <SyncOutlined
                                className="animate-spin text-xs"
                                spin
                              />
                            }
                            color="processing"
                          >
                            Checking...
                          </Tag>
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
                          min={formatDate(
                            new Date(
                              new Date().setFullYear(
                                new Date().getFullYear() - 3
                              )
                            )
                          ,"yyyy-MM-DD")} //may need to change
                          max={formatDate(new Date(),"yyyy-MM-DD")} //may need to change
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
                    {/* <Col span={8}>
                    <Checkbox checked={ot} name="ot" onChange={onChangeIc}>
                      Others
                    </Checkbox>
                  </Col> */}
                  </Row>
                  {/* {ot == true && (
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
                )} */}
                </div>

                {/*  */}
                {/* <div className="sm:col-span-6 flex justify-start gap-16">
                {fileList?.length > 0 && (
                  <div className="relative">
                    <p className="text-xs text-green-900 -mb-2 mt-1">
                      {fileList[0]?.proj_doc?.split("_")[1]}{" "}
                    </p>
                    <a
                      target="_blank"
                      href={url + "/uploads/" + fileList[0]?.vtoc_img}
                    >
                      {fileList[0]?.vtoc_img.split(".")[1] == "pdf" ? (
                        <FilePdfOutlined className="text-6xl my-7 text-red-600" />
                      ) : fileList[0]?.vtoc_img
                          .split(".")[1]
                          ?.includes("doc") ? (
                        <FileWordOutlined className="text-6xl my-7 text-blue-900" />
                      ) : fileList[0]?.vtoc_img
                          .split(".")[1]
                          ?.includes("xls") ||
                        fileList[0]?.vtoc_img.split(".")[1]?.includes("csv") ? (
                        <FileExcelOutlined className="text-6xl my-7 text-green-800" />
                      ) : fileList[0]?.vtoc_img
                          .split(".")[1]
                          ?.includes("png") ||
                        fileList[0]?.vtoc_img.split(".")[1]?.includes("jpg") ||
                        fileList[0]?.vtoc_img
                          .split(".")[1]
                          ?.includes("jpeg") ? (
                        <FileImageOutlined className="text-6xl my-7 text-yellow-500" />
                      ) : (
                        <FileTextOutlined className="text-6xl my-7 text-gray-600" />
                      )}
                    </a>
                  </div>
                )}
              </div> */}
               {inv_list.length > 0 && (
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
                                 {/* <TDInputTemplate
                                  placeholder="Select invoice"
                                  type="text"
                                  name="inv_el"
                                  label="Invoice"
                                  data={inv_list}
                                  formControlName={inv_el}
                                  handleFocus = {e=>op.current.show(e)}
              
                                  handleChange={(event) => {setInvEl(event.target.value)
              
                                    if(event.target.value.length)
                                      op.current.show(event)
                                    else{
                                    op.current.hide(event)
                                     setInvEl("")
                                     setCode("")
                                    }
                                  }}
                                  mode={1}
                                /> 
               */}
              <OverlayPanel ref={op} className='w-[980px]  border-2 bg-gray-200 border-green-900'>
                 <span className='text-xs text-green-900 italic'>Search results for: "{inv_el}"</span>
                      <ul class=" divide-y max-h-48 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                      {inv_list?.filter(e=>e.invoice?.toLowerCase().includes(inv_el?.toLowerCase())).length>0 && inv_list?.filter(e=>e.invoice?.toLowerCase().includes(inv_el?.toLowerCase()))?.map(lst=><li onClick={(e)=>{op.current.hide(e);setInvEl(lst.name);setCode(lst.code)}} class="pb-3 cursor-pointer  hover:bg-[#C4F1BE] rounded-md hover:duration-300 sm:pb-4">
                          <div class="flex items-center rtl:space-x-reverse">
                          
                           <div class="flex-1 min-w-0">
                              <p class="text-sm font-bold  w-full text-green-900 truncate dark:text-white">
                               {lst.name}
                              </p>
                             
                            </div>
                          
                          </div>
                        </li>)}
                       {inv_list?.filter(e=>e.invoice?.toLowerCase().includes(inv_el?.toLowerCase())).length==0 && <Empty/>}
                      </ul>
                    </OverlayPanel>
                                {inv_el  && (
                                  
                                  <span
                                    scope="row"
                                    className=" w-1/6 py-2 flex justify-between gap-10 items-center text-gray-900 whitespace-nowrap dark:text-white"
                                  >
                                    <a
                                      onClick={() => {
                                        // setFlag(16);
                                        // setItemInfo(
                                        //   itemList.filter(
                                        //     (e) => e.sl_no == item.sl_no
                                        //   )
                                        // );
                                        // getMrnLog();
                                      }}
                                    >
                                      <Tag color="#4FB477">
                                        {" "}
                                        <ClusterOutlined /> Items under this invoice
                                      </Tag>
                                    </a>
                                  </span>
                                )}
                              </div>
                            )}
                <div className="col-span-12 my-1">
                  {/* {itemDtlsForm.length > 0 && */}
                  {/* // itemDtlsForm.map((item, index) => ( */}
                  {itemDelivery.length > 0 && (
                    // itemDelivery.map((item, index) => (
                    <>
                      <table className="w-full border-separate border border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400">
                        <thead className="text-xs bg-[#C4F1BE] font-bold uppercase text-green-900 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-1.5 text-nowrap w-1/6 font-bold"
                            >
                              Item
                            </th>

                            <th
                              scope="col"
                              className="px-6 py-1.5 text-nowrap w-1/6 font-bold"
                            >
                              PO Quantity
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-1.5 text-nowrap w-1/6 font-bold"
                            >
                              Received Quantity
                            </th>

                            <th
                              scope="col"
                              className="px-6 py-1.5 text-nowrap w-1/6 font-bold"
                            >
                              To Receive
                            </th>
                          </tr>
                        </thead>
                        {itemDelivery.map((item, index) => (
                          <tbody>
                            <tr className="bg-[#DDEAE0] border-b-2 mt-1 text-lg border-white my-3 font-bold  dark:bg-gray-800 dark:border-gray-700">
                              <td
                                scope="row"
                                className="px-4 w-1/6  py-1.5 flex justify-between gap-5 items-center text-sm text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                {item.prod_name}
                              </td>

                              <td
                                scope="row"
                                className="px-4 w-1/6 py-1.5 text-sm text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                {item.rc_qty}
                              </td>
                              <td
                                scope="row"
                                className="px-4 w-1/6 py-4 text-sm text-gray-900 whitespace-nowrap flex justify-between items-center gap-6 dark:text-white"
                              >
                                {item.prev}
                                {item.prev > 0 && (
                                  <Popover
                                    content={content}
                                    title="Click to view details"
                                    trigger="click"
                                  >
                                    <Tag
                                      onClick={() => getDelNo(item.item_id)}
                                      className="bg-green-500 text-white cursor-pointer"
                                    >
                                      <EyeOutlined /> View Log
                                    </Tag>
                                  </Popover>
                                )}
                              </td>
                              <td
                                scope="row"
                                className="px-4 w-1/6 py-1.5 text-sm text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                {/* {item.rc_qty} */}
                                <TDInputTemplate
                                  placeholder="Quantity to receive"
                                  type="number"
                                  // label="Remarks"
                                  name="mrn_qty"
                                  formControlName={item.mrn_qty}
                                  handleChange={(txt) =>
                                    handleDtChange(txt, index)
                                  }
                                  //   disabled={true}
                                  mode={1}
                                />
                                {/* // if(e.target.value<=dt[i]['rd_qty']) */}
                                {item.rc_qty - +item.prev < +item.mrn_qty && (
                                  <VError title={"Invalid Quantity"} />
                                )}
                              </td>
                            </tr>
                          </tbody>
                        ))}
                      </table>
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-center items-center">
                <button
                  disabled={
                    !del_datetoEdit ||
                    !invoice ||
                    !inv_dt ||
                    itemDelivery?.reduce((accumulator, currentValue) => {
                      return accumulator + currentValue.error;
                    }, 0) == 1
                  }
                  onClick={() => onSubmit()}
                  className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                >
                  <SaveOutlined className="mr-1" />
                  Submit
                </button>

                {/* {delNo && (
                <button
                  disabled={!del_date}
                  onClick={() => {
                    setFlag(4);
                    setVisible(true);
                  }}
                  className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                >
                  <DeleteOutlined className="mr-1" />
                  Delete
                </button>
              )} */}
              </div>
            </Spin>
          </div>
        </div>
      </BlockUI>
      <DialogBox
        visible={visible}
        flag={flag}
        id={id}
        onPress={() => setVisible(false)}
        data={{
          po_no:  decodeURIComponent(params.po_no),
          del_date: del_date,
          remarks: remarks,
          del_no: delNo,
          index: index,
          prod_name: prod_name,
          mrn_qty: rec_qty,
          rec_by: rec_by,
          fileList: fileList,
          confirm: invData[0]?.confirm,
          dc: invData[0]?.dc,
          ic: invData[0]?.ic,
          invoice: invData[0]?.invoice,
          invoice_dt: invData[0]?.invoice_dt,
          lr: invData[0]?.lr,
          lr_no: invData[0]?.lr_no,
          og: invData[0]?.og,
          om: invData[0]?.om,
          om_manual: invData[0]?.om_manual,
          pl: invData[0]?.pl,
          tc: invData[0]?.tc,
          waybill: invData[0]?.waybill,
          wb: invData[0]?.wb,
          wc: invData[0]?.wc,
          ws: invData[0]?.ws,
        }}
        onDelete={() => {
          axios
            .post(url + "/api/delete_vtoc", {
              po_no:  decodeURIComponent(params.po_no),
              id: index,
              del_no: delNo,
              item_id: item_id,
            })
            .then((res) => {
              console.log(res);
              setVisible(false);
              if (res?.data?.suc > 0) {
                Message("success", res?.data?.msg);
                navigate(-1);
              } else {
                Message("error", res?.data?.msg);
              }
            });
        }}
      />
    </section>
  );
}

export default ClientDeliveryForm;
