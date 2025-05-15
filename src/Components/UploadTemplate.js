import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import HeadingTemplate from "../Components/HeadingTemplate";
import VError from "../Components/VError";
import TDInputTemplate from "../Components/TDInputTemplate";
import axios from "axios";
import { url } from "../Address/BaseUrl";
import { BlockUI } from 'primereact/blockui';

import {
  DeleteOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  LoadingOutlined,
  SaveOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DialogBox from "../Components/DialogBox";
import PrintComp from "../Components/PrintComp";
import AuditTrail from "../Components/AuditTrail";
import Viewdetails from "../Components/Viewdetails";
import { Spin, Tag, Tooltip } from "antd";
import { Message } from "./Message";
import moment from "moment";
import BtnGroupReuse from "./BtnGroupReuse";

function UploadTemplate({ onSubmit, flag, title }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [checkLoad, setCheckLoad] = useState(false);
   const [blocked, setBlocked] = useState(false);
      const det = JSON.parse(localStorage.getItem('perm'))
    
  const [itemList, setItemList] = useState([]);
  const navigate = useNavigate();
  const [flag1, setFlag] = useState(4);
  const [id, setId] = useState();
  const [itemInfo, setItemInfo] = useState();
  const [items, setItems] = useState([]);
  const [qty, setQty] = useState();
  const [qty1, setQty1] = useState();
  const [rcv_qty, setRcv] = useState();
  const [tc_qty, setTc] = useState();
  const [test_dt, setTestDt] = useState("");
  const [test_place, setTestPlace] = useState("");
  const [item_no, setItemNo] = useState("");
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState("");
  const [test_person, setPerson] = useState("");
  const [doc1, setDoc1] = useState();
  const [doc2, setDoc2] = useState();
  const [fileList, setFileList] = useState([]);
  const [qtySet, setQtySet] = useState([]);
  const params = useParams();
  const [po_no, setPoNo] = useState(decodeURIComponent(params.po_no));
  const [sumRcv, setSumRcv] = useState(0);
  const [sumTc, setSumTc] = useState(0);
  const [item_id, setItemId] = useState(0);
  useEffect(() => {
    getItemInfo(decodeURIComponent(params.po_no));
    // if (params.id > 0) {
    //     setLoading(true)
    //   setCount(1);
    //   if (flag == "T") {
    //     axios
    //       .post(url + "/api/gettc", { id: params.id })
    //       .then((res) => {
    //         setLoading(false)
    //         console.log(res);
    //         setTestDt(res?.data?.msg?.test_dt);
    //         setTestPlace(res?.data?.msg?.test_place);
    //         setPerson(res?.data?.msg?.test_person);
    //         setPoNo(res?.data?.msg?.po_no);
    //         setComments(res?.data?.msg?.comments);
    //         getItemInfo(res?.data?.msg?.po_no);
    //         setItemNo(res?.data?.msg?.item)
    //         setQty(res?.data?.msg?.qty)
    //         setStatus(res?.data?.msg?.status)
    //         axios
    //         .post(url + "/api/gettcdoc", { id: params.id, item: res?.data?.msg?.item.toString() })
    //         .then((res) => {
    //           console.log(res);
    //           for (let i of res?.data?.msg) {
    //             fileList.push(i.doc1);
    //             console.log(i.doc1);
    //           }
    //           setFileList(fileList);

    //           // setQty(res?.data?.msg[0]?.qty)
    //           // setStatus(res?.data?.msg[0]?.status)
    //         });
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         navigate("/error" + "/" + err.code + "/" + err.message);
    //       });
    //   } else {
    //     axios
    //       .post(url + "/api/getmdcc", { id: params.id })
    //       .then((res) => {
    //         setLoading(false)
    //         console.log(res);
    //         setTestDt(res?.data?.msg?.test_dt);
    //         setPoNo(res?.data?.msg?.po_no);
    //         setComments(res?.data?.msg?.comments);
    //         getItemInfo(res?.data?.msg?.po_no);
    //         setItemNo(res?.data?.msg?.item)
    //         setQty(res?.data?.msg?.qty)
    //         setStatus(res?.data?.msg?.status)
    //         axios
    //         .post(url + "/api/getmdccdoc", { id: params.id, item: res?.data?.msg?.item.toString()})
    //         .then((res) => {
    //           console.log(res);
    //           for (let i of res?.data?.msg) {
    //             fileList.push(i.doc1);
    //             console.log(i.doc1);
    //           }
    //           setFileList(fileList);
    //         });

    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         navigate("/error" + "/" + err.code + "/" + err.message);
    //       });
    //   }

    // }
  }, []);
  
  const deleteItem = () => {
    setLoading(true);
    let u = flag == "M" ? "/api/deletemdcc" : "/api/deletetc";
    axios
      .post(url + u, { po_no:po_no, item:item_id, user: localStorage.getItem("email") })
      .then((res) => {
        setLoading(false);
        setVisible(false);
        if (res?.data?.suc > 0) {
          Message("success", res?.data?.msg);
          navigate(-1);
        } else {
          Message("success", res?.data?.msg);
        }
      });
  };
  const getItemInfo = (po_no) => {
    setLoading(true);
    axios
      .post(url + "/api/getpo", { id: 0 })
      .then((resPO) => {
        setId(resPO?.data?.msg?.filter((e) => e.po_no == po_no)[0]?.sl_no);

        axios
          .post(url + "/api/getpoitemfortc", {
            id: resPO?.data?.msg?.filter((e) => e.po_no == po_no)[0]?.sl_no,
            po_no: decodeURIComponent(po_no),
          })
          .then((resItems) => {
            if (flag == "T") {
              axios
                .post(url + "/api/getitemdoctc", { po_no: po_no })
                .then((restc) => {
                  console.log(restc);
                  setLoading(false);
                  console.log(resItems);
                  setItems(resItems?.data?.msg);
                  // if(params.id==0){
                  // for (let i of resItems?.data?.msg) {
                  //   let f=0
                  //   for(let j of restc?.data?.msg){
                  //     if(+j.item_id==+i.sl_no)
                  //       f=1
                  //   }
                  //   if(f==0)
                  //   itemList.push({ code: i.sl_no, name: i.prod_name });
                  // }}
                  // else{
                  for (let i of resItems?.data?.msg) {
                    itemList.push({
                      code: i.sl_no,
                      name: i.prod_name,
                      qty: i.quantity,
                    });

                    // }
                  }
                  setItemList(itemList);
                  console.log(itemList);
                });
            } else {
              axios
                .post(url + "/api/getitemdocmdcc", { po_no: po_no })
                .then((resmdcc) => {
                  console.log(resmdcc);
                  setLoading(false);
                  console.log(resItems);
                  setItems(resItems?.data?.msg);
                  // if(params.id==0){
                  // for (let i of resItems?.data?.msg) {
                  //   let f=0
                  //   for(let j of resmdcc?.data?.msg){
                  //     if(+j.item_id==+i.sl_no)
                  //       f=1
                  //   }
                  //   if(f==0)
                  //   itemList.push({ code: i.sl_no, name: i.prod_name });
                  // }}
                  // else{
                  for (let i of resItems?.data?.msg) {
                    itemList.push({
                      code: i.sl_no,
                      name: i.prod_name,
                      qty: i.quantity,
                    });
                  }
                  setItemList(itemList);
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
  };
  const onsubmit = () => {
    onSubmit({
      po_no: po_no,
      doc1: doc1,
      item_no: item_no,
      qty: qty,
      rcv_qty: rcv_qty,
      tc_qty: tc_qty,
    });
  };
  const onChangeItem = (value) => {
    console.log(value)
    setFileList([]);
    fileList.length = 0;
    // if (params.id == 0) {
    setItemId(value)
    setRcv(0)
    setTc(0)
    setQty(0)
    setQty1(0)
    console.log(value);
    if(value!='Items'){
    setLoading(true)

    console.log(items.filter((e) => e.sl_no == value)[0]);
    setQty(items.filter((e) => e.sl_no == value)[0].quantity);
    setQty1(items.filter((e) => e.sl_no == value)[0].quantity);
    setSumRcv(items?.filter((e) => e.sl_no == value).reduce((a, e) => a + e.rc_qty, 0));
    setSumTc(items?.filter((e) => e.sl_no == value).reduce((a, e) => a + e.tc_qty, 0));
    setQtySet(items);
    console.log(items);
    setLoading(false)
    axios
      .post(url + "/api/gettcbyitem", { item: value, po: decodeURIComponent(po_no)}).then(resTc=>{
        console.log(resTc)
        if(resTc?.data?.msg?.length>0){

        setSumTc(resTc?.data?.msg?.reduce((a, e) => a + e.tc_qty, 0));
        axios
          .post(url + "/api/gettcdoc", { id: decodeURIComponent(params.po_no), item: value })
          .then((res) => {
            setLoading(false)
            console.log(res);
            for (let i of res?.data?.msg) {
              fileList.push(i.doc1);
              console.log(i.doc1);
            }
            setFileList(fileList);
          });
        }
        else{
        setSumTc(0);

        }
      })
    // axios
    //   .post(url + "/api/gettcbyitem", { item: value, po: decodeURIComponent(po_no)})
    //   .then((res) => {
    //     console.log(res);
    //     setSumRcv(res?.data?.msg?.reduce((a, e) => a + e.rc_qty, 0));
    //     setSumTc(res?.data?.msg?.reduce((a, e) => a + e.tc_qty, 0));
    //     setQtySet(res?.data?.msg);
    //     axios
    //       .post(url + "/api/gettcdoc", { id: decodeURIComponent(params.po_no), item: value })
    //       .then((res) => {
    //         setLoading(false)
    //         console.log(res);
    //         for (let i of res?.data?.msg) {
    //           fileList.push(i.doc1);
    //           console.log(i.doc1);
    //         }
    //         setFileList(fileList);
    //       });
    //   });
    }
  };
  const checkid = () => {
    if (po_no) {
      setCheckLoad(true);
      axios
        .post(url + "/api/check_po_no_for_doc", { po_no: po_no })
        .then((res) => {
          console.log(res.data.msg[0].count);
          setCheckLoad(false);
          setCount(res.data.msg[0].count);
          itemList.length = 0;
          setItemList([]);
          if (res.data.msg[0].count > 0) {
            getItemInfo(po_no);
          }
        })
        .catch((err) =>
          navigate("/error" + "/" + err.code + "/" + err.message)
        );
    }
  };
  return (
    <section className="bg-transparent dark:bg-[#001529]">
      <HeadingTemplate
        text={title}
        mode={params.id > 0 ? 1 : 0}
        title={"Category"}
        data={""}
      />
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
                  handleBlur={() => checkid()}
                  disabled={true}
                  mode={1}
                />
                <Viewdetails click={()=>{{setFlag(14);setVisible(true)}}} />
              </div>
              <div className="sm:col-span-12">
                <TDInputTemplate
                  placeholder="Items"
                  type="text"
                  label="Items"
                  name="item"
                  formControlName={item_no}
                  handleChange={(e) => {
                    {
                      setItemNo(e.target.value);
                      onChangeItem(e.target.value);
                    }
                  }}
                  mode={2}
                  data={itemList}
                />

              </div>
              <div className="relative overflow-x-auto sm:col-span-12">
                {qtySet.length > 0 && (
                  <table className="w-full border-separate border border-[#C4F1BE] text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400">
                    <thead className="text-xs bg-[#C4F1BE] font-bold uppercase text-green-900 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3 font-bold">
                          Ordered Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 font-bold">
                          Received Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 font-bold">
                         Saved TC Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 font-bold">
                        Remaining TC Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 font-bold">
                          Document(s)
                        </th>
                        {/* <th scope="col" className="px-6 py-3 font-bold">
                          
                        </th> */}
                      </tr>
                    </thead>
                    {/* {qty} */}
                    <tbody>
                      <tr className="bg-[#DDEAE0] border-b-2 border-white mt-3 font-bold dark:bg-gray-800 dark:border-gray-700">
                        {/* <td className="px-6 py-2 w-3/12">{qtySet[0].quantity}</td> */}
                        <td className="px-6 py-2 w-3/12">{qty}</td>
                        <td className="px-6 py-2 w-3/12">{sumRcv}</td>
                        <td className="px-6 py-2 w-3/12">{sumTc} (Remaining: {sumRcv-sumTc})</td>
                        <td className="px-6 py-2 w-3/12">
                        <TDInputTemplate
                  placeholder="TC Quantity"
                  type="number"
                  label=""
                  // disabled={params.id > 0}
                  name="tc_qty"
                  formControlName={tc_qty}
                  handleChange={(txt) => setTc(txt.target.value)}
                  mode={1}
                />
                {!tc_qty ? (
                  <VError title={"Quantity is required"} />
                ) : null}
                {tc_qty < 0 ? (
                  <VError title={"Quantity should be non-zero positive"} />
                ) : null}
                {+tc_qty > +(sumRcv-sumTc) ? (
                  <VError
                    title={"Invalid quantity (should be <= " + sumRcv-sumTc + ")"}
                  />
                ) : null}
                {/* {(qtySet.length>0 && (tc_qty > (sumTc-rcv_qty))) ? (
                  <VError
                    title={"Invalid quantity (should be <= " + (sumRcv-rcv_qty) + ")"}
                  />
                ) : null} */}
                        
                        </td>
                        <td className="px-6 py-2 w-3/12">
                          {fileList?.map((item) => (
                            <a target="_blank" href={url + "/uploads/" + item}>
                              {item.toString().split(".")[1] == "pdf" ? (
                                <FilePdfOutlined className="text-4xl my-7 text-red-600" />
                              ) : item
                                  .toString()
                                  .split(".")[1]
                                  ?.includes("doc") ? (
                                <FileWordOutlined className="text-4xl my-7 text-blue-900" />
                              ) : item
                                  .toString()
                                  .split(".")[1]
                                  ?.includes("xls") ||
                                item
                                  .toString()
                                  .split(".")[1]
                                  ?.includes("csv") ? (
                                <FileExcelOutlined className="text-4xl my-7 text-green-800" />
                              ) : (
                                <FileImageOutlined className="text-4xl my-7 text-yellow-500" />
                              )}
                            </a>
                          ))}
                        </td>
                        {/* <td className="px-6 py-2 w-3/12">
                        <Tooltip title="Delete">
                <DeleteOutlined className="text-red-900 text-lg"  onClick={()=>setVisible(true)}/>
                </Tooltip>
                       
                        </td> */}
                      </tr>
                    </tbody>
                  </table>
             )} 
              </div>

<>
              {/* <div className="sm:col-span-3">
                <TDInputTemplate
                  placeholder="Ordered quantity"
                  type="number"
                  label="Ordered quantity"
                  disabled={true}
                  name="qty"
                  formControlName={qty}
                  handleChange={(txt) => setQty(txt.target.value)}
                  mode={1}
                />

                {!qty && params.id == 0 ? (
                  <VError title={"Quantity is required"} />
                ) : null}
                {qty < 0 ? (
                  <VError title={"Quantity should be non-zero positive"} />
                ) : null}
                {qty > qty1 ? (
                  <VError
                    title={"Invalid quantity (should be <= " + qty1 + ")"}
                  />
                ) : null}
              </div>
              <div className="sm:col-span-3">
                <TDInputTemplate
                  placeholder="Received Quantity"
                  type="number"
                  label="Received Quantity"
                  // disabled={params.id > 0}
                  name="rcv_qty"
                  formControlName={rcv_qty}
                  handleChange={(txt) => setRcv(txt.target.value)}
                  mode={1}
                />

                {!rcv_qty  ? (
                  <VError title={"Quantity is required"} />
                ) : null}
                {rcv_qty < 0 ? (
                  <VError title={"Quantity should be non-zero positive"} />
                ) : null}
                {rcv_qty > qty1 ? (
                  <VError
                    title={"Invalid quantity (should be <= " + qty1 + ")"}
                  />
                ) : null}
                {qtySet.length>0 && (rcv_qty > (qty1-sumRcv)) ? (
                  <VError
                    title={"Invalid quantity (should be <= " + (qty1-sumRcv) + ")"}
                  />
                ) : null}
              </div> */}
              {/* <div className="sm:col-span-3">
                <TDInputTemplate
                  placeholder="TC Quantity"
                  type="number"
                  label="TC Quantity"
                  name="tc_qty"
                  formControlName={tc_qty}
                  handleChange={(txt) => setTc(txt.target.value)}
                  mode={1}
                />
                {!tc_qty ? (
                  <VError title={"Quantity is required"} />
                ) : null}
                {tc_qty < 0 ? (
                  <VError title={"Quantity should be non-zero positive"} />
                ) : null}
                {+tc_qty > +rcv_qty ? (
                  <VError
                    title={"Invalid quantity (should be <= " + rcv_qty + ")"}
                  />
                ) : null}
              
              </div> */}
              {qtySet.length > 0 && ( <div className="sm:col-span-12 bg-[#DDEAE0] p-3">
                <TDInputTemplate
                  placeholder="Comments"
                  type="file"
                  label="Test Certificate"
                  accept={"application/pdf"}
                  name="doc1"
                  handleChange={(txt) => {
                    if (txt.target.files[0]?.size / 1000000 <= 1) {
                      setDoc1(txt.target.files[0]);
                    } else {
                      setDoc1(null);
                      Message("warning", "File size exceeds 1MB");
                    }

                    if (
                      txt.target.files[0]?.name?.split(".")[1].toLowerCase() !=
                      "pdf"
                    ) {
                      setDoc1(null);
                      Message("warning", "Unsupported file!");
                    }
                  }}
                  mode={1}
                />
                <p
                  id="helper-text-explanation"
                  class="mt-2 text-xs text-gray-500 dark:text-gray-400"
                >
                  Accepts PDF only. (Max 1MB){" "}
                </p>
                {!doc1 ? (
                  <VError title={"Must upload a file (max 1MB)"} />
                ) : null}
              </div>)}
            </>

            </div>

          {det.po!=1 &&  <div className="flex justify-center">
              {/* <button
                onClick={() => onsubmit()}
                disabled={!doc1}
                // disabled={tc_qty <= 0 || rcv_qty <= 0 || (qtySet.length>0 && (rcv_qty > (qty1-sumRcv) ))|| rcv_qty>qty1 }
                        className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"

              >
                 <span class="relative z-10">
                        <SaveOutlined className='mr-2' />
                Submit
                 </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
              </button> */}
              <BtnGroupReuse disabled={!doc1} text={'Submit'} onClick={() => onsubmit()} flag={1} icon={<SaveOutlined className='mr-2' />}/>

              {/* {params.id > 0 && (
              <button
                onClick={() =>setVisible(true)}
                className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
              >
                Delete
              </button>
            )} */}
            </div>
}
          </div>
        </div>
      </Spin>
      <DialogBox
        visible={visible}
        flag={flag1}
        id={id}
        onPress={() => setVisible(false)}
        onDelete={() => deleteItem()}
      />
    </section>
  );
}

export default UploadTemplate;
