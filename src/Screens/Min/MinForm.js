import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import HeadingTemplate from "../../Components/HeadingTemplate";
import VError from "../../Components/VError";
import TDInputTemplate from "../../Components/TDInputTemplate";
import axios from "axios";
import { url } from "../../Address/BaseUrl";
import { Divider, Input, Tag } from "antd";
import { BlockUI } from 'primereact/blockui';

import {
  BranchesOutlined,
  CheckCircleOutlined,
  ClockCircleFilled,
  CloseCircleOutlined,
  DropboxOutlined,
  LoadingOutlined,
  LockFilled,
  SaveOutlined,
  StockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DialogBox from "../../Components/DialogBox";
import Viewdetails from "../../Components/Viewdetails";
import { Spin } from "antd";
import { Message } from "../../Components/Message";
import { Checkbox, Col, Row } from "antd";
import moment from "moment/moment";
import { Popover } from "antd";
import { ScrollPanel } from "primereact/scrollpanel";
import BtnGroupReuse from "../../Components/BtnGroupReuse";
import { formatDate } from "../../Functions/formatDate";
function MinForm() {
     const [blocked, setBlocked] = useState(false);
     const det = JSON.parse(localStorage.getItem('perm'))
  
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemForm, setItemForm] = useState([]);
  const navigate = useNavigate();
  const [flag1, setFlag] = useState(4);
  const [id, setId] = useState();
  const [items, setItems] = useState([]);
  const [po_no, setPoNo] = useState("");
  const params = useParams();
  const [delFlag, setDelFlag] = useState();
  const [index, setIndex] = useState();
  const [item, setItem] = useState("");
  const [opn_qty, setOpnQty] = useState(0);
  const [issue_qty, setIssueQty] = useState(0);
  const [issue_qtyCopy, setIssueQtyCopy] = useState(0);
  const [purpose, setPurpose] = useState("");
  const [notes, setnotes] = useState("");
  const [req, setReq] = useState("");
  const [logList, setLogList] = useState([]);
  const [filteredLogList, setFilteredLogList] = useState([]);
  const [proj_name, setProjName] = useState("");
  const [proj_id, setProjId] = useState("");
  const [stockData, setStockData] = useState([]);
  const [proj_stock, setProjStock] = useState(0);
  const [wer_stock, setWerStock] = useState(0);
  const [stockLoad, setStockLoad] = useState(false);
  const [p_id, setP_id] = useState(0);
  const [min_dt, setMinDt] = useState("");
  const [itemFormCopy, setItemFormCopy] = useState([]);
  const [reqQty, setReqQty] = useState(0);
  const [approve_flag, setApproveFlag] = useState("");
  const [can_stock,setCanStock] = useState(0)
  
  const [req_date, setReqDate] = useState("");
  const [logical_stock,setLogicalStock] = useState(0)
  useEffect(() => {
    getItemInfo(params.po_no);
    setBlocked(det.min==1?true:false)

  }, []);
  const content = (
     <div
       className={
        
            "grid grid-cols-2 gap-3 p-3 bg-green-100 rounded-lg"
       }
     >
       {!stockLoad ? (
         <>
           {" "}
           <Tag
             className="cursor-pointer col-span-1 px-2 py-0.5 shadow-lg"
             color="#4FB477"
           >
             <StockOutlined /> Project Quantity (Physical) : {proj_stock || 0}
           </Tag>
           <Tag
             className="cursor-pointer col-span-1 px-2 py-0.5 shadow-lg"
             color="#014737"
           >
             <StockOutlined /> Requisition Quantity :  {(reqQty || 0)}
           </Tag>
           <Tag
             className="cursor-pointer col-span-2 px-2 py-0.5 shadow-lg"
             color="#014737"
           >
             <StockOutlined /> Warehouse Quantity : {wer_stock || 0}
           </Tag>
          
             {/* <Tag
               className="cursor-pointer col-span-1 px-2 py-0.5 shadow-lg"
               color="#4FB477"
             >
               <StockOutlined /> Unapproved Requisition Quantity : {reqQty || 0}
             </Tag>

               <Tag
                         className="cursor-pointer col-span-2 px-2 py-0.5 shadow-lg"
                         color="#eb8d00"
                       >
                         <StockOutlined /> Approved Requisition Quantity: {proj_stock - logical_stock - reqQty || 0}
                       </Tag> */}
         
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
    if (delFlag == 1) {
      let u = "/api/deletetc";
      axios
        .post(url + u, {
          po_no: params.po_no.toString(),
          user: localStorage.getItem("email"),
          item: +item,
        })
        .then((res) => {
          setLoading(false);
          setVisible(false);
          if (res?.data?.suc > 0) {
            Message("success", res?.data?.msg);
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
  useEffect(() => {
    setLoading(true);
    axios
      .post(url + "/api/get_req_min", { Proj_id: +params.id })
      .then((res) => {
        console.log(res, res?.data?.msg[0]?.req_date);
        setReq(res?.data?.msg[0]?.req_no);
        setP_id(res?.data?.msg[0]?.project_id);
        setApproveFlag(res?.data?.msg[0]?.approve_flag);
        setReqDate(res?.data?.msg[0]?.req_date);
        setMinDt(
          res?.data?.msg[0]?.req_date
            ? res?.data?.msg[0]?.req_date
            : formatDate(new Date(),"yyyy-MM-DD")
        );
        axios
          .post(url + "/api/get_proj_id", {
            Proj_id: res?.data?.msg[0]?.project_id,
          })
          .then((res) => {
            console.log(res);
            setProjId(res?.data?.msg[0]?.proj_id);
            setProjName(res?.data?.msg[0]?.proj_name);
           
            // setMinDt(res?.data?.msg[0]?.req_date)
          });
        axios
          .post(url + "/api/get_item_req_min", {
            Proj_id: +params.id,
            req_no: res?.data?.msg[0]?.req_no,
          })
          .then((resItems) => {
            console.log(resItems);
            setLoading(false);
            setStockData(resItems?.data?.msg);
            for (let i of resItems?.data?.msg) {
              itemForm.push({
                sl_no: i.sl_no,
                item_id: i.item_id,
                name: i.prod_name+'@'+' Part No.: '+i.part_no+', Article No.: '+i.article_no+', Model No.: '+i.model_no,
                quantity: i.req_qty,
                tot_qty: i.tot_issue_qty,
                issue_qty: i.req_qty,
                notes: i.notes || "",
                purpose: i.purpose || "",
              });
              itemFormCopy.push({
                sl_no: i.sl_no,
                item_id: i.item_id,
                name: i.prod_name+'@'+' Part No.: '+i.part_no+', Article No.: '+i.article_no+', Model No.: '+i.model_no,
                quantity: i.req_qty,
                tot_qty: i.tot_issue_qty,
                issue_qty: i.req_qty,
                notes: i.notes || "",
                purpose: i.purpose || "",
              });
            }
            axios
              .post(url + "/api/testing", { req_no: res?.data?.msg[0]?.req_no })
              .then((res) => {
                console.log(res);
                setLogList(res?.data?.msg);
              });
          });
      });
  }, []);
  const getItemInfo = (po_no) => {
    // setLoading(true);
    axios
      .post(url + "/api/getpo", { id: 0 })
      .then((resPO) => {
        setId(resPO?.data?.msg?.filter((e) => e.po_no == po_no)[0]?.sl_no);
        // axios
        //   .post(url + "/api/item_req_dtls", {      //getmindel
        //     id: +params.id,
        //   })
        //   .then((resItems) => {
        //     console.log(resItems);
        //     setLoading(false);
        //     setItems(resItems?.data?.msg);
        //     for (let i of resItems?.data?.msg) {
        //       itemForm.push({
        //         sl_no: i.sl_no,
        //         item_id: i.sl_no,
        //         name: i.prod_name,
        //         quantity: i.rc_qty,
        //         issue_qty: i.issue_qty || 0,
        //         notes: i.notes || "",
        //         purpose: i.purpose,
        //       });
        //     }
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     navigate("/error" + "/" + err.code + "/" + err.message);
        //   });
      })
      .catch((err) => {
        console.log(err);
        navigate("/error" + "/" + err.code + "/" + err.message);
      });
  };

  const handleDtChange1 = (index, event) => {
    let data = [...itemForm];
    data[index][event.target.name] = event.target.value;

    setItemForm(data);
    console.log(data);
  };

  const handleDtChange = (index, event) => {
    let data = [...itemFormCopy];
    let data1 = [...itemForm];

    data[index][event.target.name] = event.target.value;
    data1[itemForm.findIndex((e) => e.sl_no == itemFormCopy[index].sl_no)][
      event.target.name
    ] = event.target.value;

    setItemForm(data1);
    setItemFormCopy(data);
    console.log(itemForm, itemFormCopy);
  };

  const onsubmit = () => {
    setLoading(true);
    axios
      .post(url + "/api/addmin", {
        req_no: req,
        min_dt: min_dt,
        user: localStorage.getItem("email"),
        min: itemForm,
      })
      .then((res) => {
        setLoading(false);
        if (res?.data?.suc > 0) {
          Message("success", res?.data?.msg);
          navigate(-1);
        } else {
          Message("error", res?.data?.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/error" + "/" + err.code + "/" + err.message);
      });
  };

  return (
    
    <section className="bg-transparent dark:bg-[#001529]">
      <HeadingTemplate
        text={"Update Material Issue Note"}
        mode={params.id > 0 ? 1 : 0}
        title={"Category"}
        data={""}
      />
            <BlockUI blocked={blocked} template={
                                                                                             <div className='relative  w-full h-full 0 z-10'>
                                                                                               <span className='absolute top-1 right-1 font-bold italic text-gray-500'><LockFilled className='text-green-900 '/> Locked (Readonly)</span>
                                                                                          
                                                                                             </div>
                                                                                           } 
                                                                                           > 
      
      <Spin
        indicator={<LoadingOutlined spin />}
        size="large"
        className="text-green-900 dark:text-gray-400"
        spinning={loading}
      >
        <div className="grid grid-cols-12 gap-2">
          <div className={"w-full col-span-12 bg-white p-6 rounded-2xl"}>
            <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
              <div className="sm:col-span-6">
                <TDInputTemplate
                  placeholder="Requisition"
                  type="text"
                  label="Requisition"
                  name="po_no"
                  formControlName={req}
                  handleChange={(txt) => setPoNo(txt.target.value)}
                  disabled={true}
                  mode={1}
                />
                <span className="flex justify-end my-2">
                 {proj_name && <Tag color="#014737">
                    Project:{proj_name} | Project ID:{proj_id}{" "}
                  </Tag>}
                </span>
              </div>
              {/* {min_dt} {req_date} */}
              <div className="sm:col-span-6">
                <TDInputTemplate
                  placeholder="Date"
                  type="date"
                  label="Date"
                  name="min_dt"
                  formControlName={min_dt}
                  handleChange={(txt) => setMinDt(txt.target.value)}
                  disabled={params.id > 0 ? true : false}
                  min={formatDate(
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 3)
                    )
                 ,"yyyy-MM-DD")} //may need to change
                  max={formatDate(new Date(),"yyyy-MM-DD")} //may need to change
                  mode={1}
                />
                {!min_dt ? <VError title={"Required"} /> : null}
              </div>
              <>
                <ScrollPanel
                  style={{ width: "100%", maxheight: "900px",minHeight:"250px" }}
                  className="relative border-2 overflow-x-hidden border-gray-300 p-2 rounded-lg sm:col-span-12"
                >
                  <input
                    type="search"
                    id="default-search"
                    className="bg-gray-200 border-gray-300  border-2 my-2 mb-2 sticky shadow-lg top-1 z-10 rounded-full  text-gray-800 text-sm p-2  duration-500 block w-full focus:border-gray-200 focus:ring-gray-200 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={(e) =>
                      setItemFormCopy(
                        itemForm.filter((lst) =>
                          lst.name
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase())
                        )
                      )
                    }
                    placeholder="Search by items, part no.,article no.,model_no."
                  />
                  {itemFormCopy?.length > 0 &&
                    itemFormCopy.map((item, index) => (
                      <>
                        {item.quantity != 0 && (
                          <>
                            {" "}
                            <table className="w-full border-separate border my-1 border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400">
                              <thead className="text-xs bg-[#C4F1BE] font-bold uppercase text-green-900 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-1.5 text-nowrap w-1/4 font-bold"
                                  >
                                    Item
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-1.5 text-nowrap w-1/4 font-bold"
                                  >
                                    Opening Quantity
                                  </th>
                                  {item.issue_qty > 0 && (
                                    <th
                                      scope="col"
                                      className="px-6 py-1.5 text-nowrap w-1/4 font-bold"
                                    >
                                      Already Issued
                                    </th>
                                  )}
                                  {item.quantity > item.issue_qty && (
                                    <th
                                      scope="col"
                                      className="px-6 py-1.5 text-nowrap w-1/4 font-bold"
                                    >
                                      Issue Quantity
                                    </th>
                                  )}
                                  {item.quantity > item.issue_qty && (
                                    <th
                                      scope="col"
                                      className="px-6 py-1.5 text-nowrap w-1/4 font-bold"
                                    >
                                      Purpose
                                    </th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="bg-[#DDEAE0] border-b-2 mt-1 border-white my-3 font-bold dark:bg-gray-800 dark:border-gray-700">
                                  <th
                                    scope="row"
                                     className="px-4 w-1/6 py-1.5 flex-wrap justify-between text-wrap gap-10 items-center text-sm text-gray-900 whitespace-nowrap dark:text-white"
                                  >
                                     <div className="flex gap-7 text-wrap justify-start items-center">
                                     <p className="font-bold text-green-900 text-wrap"> {item.name.split('@')[0]}</p>
                                    <Popover
                                      content={content}
                                      title={"Stock level"}
                                      trigger="click"
                                    >
                                      <span
                                        onClick={() => {
                                      
                                          setStockLoad(true);
                                          // axios
                                          //   .post(url + "/api/getstock", {
                                          //     proj_id: p_id,
                                          //     prod_id: item.item_id,
                                          //   })
                                          //   .then((res) => {
                                          //     console.log(res);
                                          //     setStockLoad(false);

                                          //     setProjStock(
                                          //       res?.data?.msg[0]?.project_stock
                                          //     );
                                          //     setWerStock(
                                          //       res?.data?.msg[0]
                                          //         ?.warehouse_stock
                                          //     );
                                          //     setReqQty(
                                          //       res?.data?.msg[0]?.req_qty
                                          //     );
                                          //   });

                                          axios
                                          .post(url + "/api/get_logical_stock_req", {
                                            proj_id: p_id,
                                            prod_id: item.item_id,
                                          })
                                          .then((res) => {
                                            console.log(res);
                                            setStockLoad(false);

                                            setProjStock(
                                              // res?.data?.result?.msg[0]?.project_stock - res?.data?.req_stock

                                              res?.data?.project_stock
                                            );
                                            setCanStock(
                                              res?.data?.cancel_stock

                                            )
                                            setLogicalStock( res?.data
                                              ?.project_stock - res?.data?.tot_stock )
                                            setWerStock(
                                              res?.data
                                                ?.warehouse_stock || 0
                                            );
                                            setReqQty(
                                              res?.data?.req_stock - res?.data?.del_stock || 0
                                            );
                                          })

                                        }}
                                       className="flex-col cursor-pointer justify-center items-center"
                                      >
                                         <DropboxOutlined className="text-md hover:scale-150 hover:duration-300 hover:text-green-500 " />
                                         <p className="text-xs -ml-2"> Stock </p>
                                      </span>
                                    </Popover>
                                    </div>
                                    <Tag color="green" className="text-[10px] text-wrap block my-1"> {item.name?.split("@")[1]}{" "}</Tag>
                                  </th>
                                  <th
                                    scope="row"
                                    className="px-4 w-1/4 py-1.5  text-gray-900 whitespace-nowrap dark:text-white"
                                  >
                                    <TDInputTemplate
                                      placeholder="Opening Quantity"
                                      type="number"
                                      name="opn_qty"
                                      disabled={true}
                                      formControlName={item.quantity}
                                      handleChange={(event) =>
                                        handleDtChange(index, event)
                                      }
                                      mode={1}
                                    />
                                  </th>

                                  {item.quantity - item.issue_qty !=
                                    item.quantity && (
                                    <td className="px-6 py-1.5 w-1/4">
                                      <a
                                        className="my-2"
                                        onClick={() => {
                                          setFlag(18);
                                          setFilteredLogList(
                                            logList.filter(
                                              (e) => e.item_id == item.item_id
                                            )
                                          );
                                          setVisible(true);
                                        }}
                                      >
                                        <Tag color="#4FB477">
                                          {" "}
                                          <BranchesOutlined /> View Log
                                        </Tag>
                                      </a>
                                      {item.issue_qty > item.quantity ? (
                                        <VError title={"Invalid value"} />
                                      ) : null}
                                      {!item.issue_qty ? (
                                        <VError title={"Required"} />
                                      ) : null}
                                    </td>
                                  )}
                                  {item.quantity > item.issue_qty && (
                                    <td className="px-6 py-1.5 w-1/4">
                                      <TDInputTemplate
                                        placeholder="Quantity"
                                        type="number"
                                        name="issue_qty"
                                        formControlName={item.issue_qty}
                                        handleChange={(event) =>
                                          handleDtChange(index, event)
                                        }
                                        mode={1}
                                      />
                                      {item.issue_qty > item.quantity ? (
                                        <VError title={"Invalid value"} />
                                      ) : null}
                                      {!item.issue_qty ? (
                                        <VError title={"Required"} />
                                      ) : null}
                                    </td>
                                  )}
                                  {item.quantity > item.issue_qty && (
                                    <td className="px-6 py-1.5 w-1/4">
                                      <TDInputTemplate
                                        placeholder="Purpose"
                                        type="number"
                                        name="purpose"
                                        formControlName={item.purpose}
                                        handleChange={(event) =>
                                          handleDtChange(index, event)
                                        }
                                        data={[
                                          {
                                            name: "Manufacturing Activity",
                                            code: "M",
                                          },
                                          { name: "Resale", code: "R" },
                                        ]}
                                        mode={2}
                                      />
                                      {!item.purpose ? (
                                        <VError title={"Required"} />
                                      ) : null}
                                    </td>
                                  )}
                                </tr>
                              </tbody>
                            </table>
                            <table className="w-full border-separate border border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400">
                              <thead className="text-xs bg-[#C4F1BE] font-bold uppercase text-green-900 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-2 w-1/4 font-bold"
                                  >
                                    Notes
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="bg-[#DDEAE0] border-b-2 border-white my-3 font-bold dark:bg-gray-800 dark:border-gray-700">
                                  <th
                                    scope="row"
                                    className="px-4 w-1/4 py-4  text-gray-900 whitespace-nowrap dark:text-white"
                                  >
                                    <TDInputTemplate
                                      placeholder="Notes"
                                      type="text"
                                      name="notes"
                                      formControlName={item.notes}
                                      handleChange={(event) =>
                                        handleDtChange(index, event)
                                      }
                                      mode={1}
                                    />
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </>
                        )}
                      </>
                    ))}
                </ScrollPanel>
              </>
            </div>

            <div className="flex justify-center gap-4">
              { logList[0]?.count==0 ? (
                // <button
                //   onClick={() => onsubmit()}
                //   className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
                // >
                //   <span class="relative z-10">
                //           <SaveOutlined className='mr-2' />
                //           Submit
                //           </span>
                //           <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
                // </button>
                <BtnGroupReuse flag={1} loading={loading} onClick={() => onsubmit()} icon={ <SaveOutlined className='mr-2' />} text="Submit"/>
              ) : approve_flag == "A" ? (
                <Tag
                  className="text-sm p-1 rounded-full my-2"
                  icon={<CheckCircleOutlined />}
                  color="success"
                >
                  This requisition was approved
                </Tag>
              ) :  approve_flag == "R" ?(
                <Tag
                  className="text-sm p-1 rounded-full my-2"
                  icon={<CloseCircleOutlined className="animate-spin" />}
                  color="error"
                >
                  This requisition was rejected
                </Tag>
              ):null}
            </div>
          </div>
        </div>
      </Spin>
     </BlockUI>
      <DialogBox
        visible={visible}
        flag={flag1}
        id={id}
        data={filteredLogList}
        onPress={() => setVisible(false)}
        onDelete={() => deleteItem()}
      />
    </section>
  );
}

export default MinForm;
