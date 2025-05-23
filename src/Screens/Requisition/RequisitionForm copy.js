import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import HeadingTemplate from "../../Components/HeadingTemplate";
import VError from "../../Components/VError";
import TDInputTemplate from "../../Components/TDInputTemplate";
import axios from "axios";
import { ScrollPanel } from "primereact/scrollpanel";
import { url } from "../../Address/BaseUrl";
import {
  BuildOutlined,
  CheckCircleOutlined,
  ClockCircleFilled,
  CloseCircleOutlined,
  DeleteOutlined,
  DropboxOutlined,
  InfoCircleFilled,
  InfoOutlined,
  LoadingOutlined,
  ProfileOutlined,
  SaveOutlined,
  StockOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DialogBox from "../../Components/DialogBox";
import { Alert, Empty, Spin, Tag } from "antd";
import { Message } from "../../Components/Message";
import moment from "moment/moment";
import { Popover } from "antd";
import { OverlayPanel } from "primereact/overlaypanel";
import { formatDate } from "../../Functions/formatDate";

function RequisitionForm() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [id, setId] = useState();
  const [req_date, setReqDate] = useState("");
  const [type, setType] = useState("");
  const [intended, setIntended] = useState("");
  const [project, setProject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [projectData, setProjectData] = useState([]);
  const det = JSON.parse(localStorage.getItem('perm'))

  const [clientData, setClientData] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [itemDtlsForm, setItemDtlsForm] = useState([]);
  const [client, setClient] = useState([]);
  const [error, setError] = useState([]);
  const [flag, setFlag] = useState();
  const [breakupinfo, setBreakUpInfo] = useState([]);
  const [approve_flag, setApproveFlag] = useState("");
  const [projID, setProjID] = useState("");
  const [req_no, setReqNo] = useState("");
  const [count, setCount] = useState(0);
  const [reason, setReason] = useState("");
  const [stockData, setStockData] = useState([]);
  const [stockData1, setStockData1] = useState([]);
  const [proj_stock, setProjStock] = useState(0);
  const [wer_stock, setWerStock] = useState(0);
  const [stockLoad, setStockLoad] = useState(false);
  const [itemDtlsFormCopy, setItemDtlsFormCopy] = useState([]);
  const [projcode, setProjCode] = useState();
  const [clientcode, setClientCode] = useState();
  const [projectCopy, setProjectCopy] = useState([]);
  const [logical_stock, setLogicalStock] = useState([]);
  const params = useParams();
  const op = useRef(null);
  const op1 = useRef(null);
  const [txt, setText] = useState("");
  const [can_stock,setCanStock] = useState(0)
  const [reqQty, setReqQty] = useState(0);
  const content = (
    <div className={"grid grid-cols-2 gap-3 p-3 bg-green-100 rounded-lg"}>
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
            <StockOutlined /> Project Quantity (Logical) : {(logical_stock || 0) - (can_stock||0)}
          </Tag>
          <Tag
            className="cursor-pointer col-span-1 px-2 py-0.5 shadow-lg"
            color="#014737"
          >
            <StockOutlined /> Warehouse Quantity : {wer_stock || 0}
          </Tag>
          <Tag
            className="cursor-pointer col-span-1 px-2 py-0.5 shadow-lg"
            color="#4FB477"
          >
            <StockOutlined />
            Unapproved Requisition Quantity : {reqQty || 0}
          </Tag>
          <Tag
            className="cursor-pointer col-span-2 px-2 py-0.5 shadow-lg"
            color="#eb8d00"
          >
            <StockOutlined /> Approved Requisition Quantity:{" "}
            {proj_stock - logical_stock - reqQty || 0}
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

    axios.post(url + "/api/getclient", { id: 0 }).then((resC) => {
      console.log(resC);
      setClientData(resC?.data?.msg);
      for (let i of resC?.data?.msg) {
        clientList.push({ code: i.sl_no, name: i.client_name });
        // projectList.push({ value: i.sl_no, label: i.proj_name });
      }
      setClientList(clientList);
    });
  }, []);

  const deleteItem = () => {
    setLoading(true);
    axios
      .post(url + "/api/deleterequisition", { id: req_no })
      .then((res) => {
        setLoading(false);
        setVisible(false);
        if (res?.data?.suc > 0) {
          Message("success", res?.data?.msg);
          navigate(-1)
          // fileList.splice(0,1);
        } else {
          Message("error", res?.data?.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/error" + "/" + err.code + "/" + err.message);
      });
  };
  const errorSum = (dt) => {
    let err = 0;
    for (let i of dt) err += i.flag;
    return err;
  };
  const onApprove = (status, val) => {
    setLoading(true);
    axios
      .post(url + "/api/approve_req", {
        status: status,
        user: localStorage.getItem("email"),
        id: +params.id,
        items: itemDtlsForm,
        in_out_flag: 0,
        project_id: project,
        reason: val,
      })
      .then((res) => {
        console.log(res);
        if (res?.data?.suc > 0) {
          Message("success", res?.data?.msg);
          setLoading(false);
          navigate(-1);
        } else {
          Message("error", res?.data?.msg);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/error" + "/" + err.code + "/" + err.message);
      });
  };
  // useEffect(() => {
  //   if(intended=='W')
  //   setProjectList(projectCopy.filter(e=>e.client==client))
  // console.log(projectCopy.filter(e=>e.client==client))
  // }, [client]);
  const handleDtChange1 = (index, event) => {
    console.log(index, event.target.value);
    let data = [...itemDtlsForm];
    data[index][event.target.name] = event.target.value;
    if (
      data[index]["rc_qty"] < data[index]["req_qty"] ||
      data[index]["req_qty"] < 0
    ) {
      error[index]["flag"] = 1;
    } else {
      error[index]["flag"] = 0;
    }
    setItemDtlsForm(data);
    console.log(itemDtlsForm);
  };
  const handleDtChange = (index, event) => {
    console.log(index, event.target.value);
    let data = [...itemDtlsFormCopy];
    let data1 = [...itemDtlsForm];
    data[index][event.target.name] = event.target.value;
    data1[
      itemDtlsForm.findIndex(
        (e) => e.item_id == itemDtlsFormCopy[index].item_id
      )
    ][event.target.name] = event.target.value;
    if (
      // data[index]["rc_qty"] < data[index]["req_qty"] ||
      data[index]["stock"] < data[index]["req_qty"] ||
      data[index]["req_qty"] < 0
    ) {
      error[index]["flag"] = 1;
    } else {
      error[index]["flag"] = 0;
    }
    setItemDtlsFormCopy(data);
    setItemDtlsForm(data1);
    // console.log(itemDtlsForm, itemDtlsFormCopy, "listttttt");
  };
  useEffect(() => {
    if (+params.id > 0) {
      setLoading(true);
      axios
        .post(url + "/api/get_requisition", { id: +params.id })
        .then((res) => {
          console.log(res);

          setReqDate(res?.data?.msg?.req_date);
          setIntended(res?.data?.msg?.intended_for);
          setType(res?.data?.msg?.req_type);
          setProjCode(res?.data?.msg?.project_id);
          setProject(
            projectList.filter((e) => e.code == +res?.data?.msg?.project_id)[0]
              ?.name
          );

          console.log(
            clientList.filter((e) => e.code == res?.data?.msg?.client_id)[0]
              ?.name
          );
          setClientCode(res?.data?.msg?.client_id);
          setClient(
            clientList.filter((e) => e.code == +res?.data?.msg?.client_id)[0]
              ?.name
          );

          setPurpose(res?.data?.msg?.purpose);
          setApproveFlag(res?.data?.msg?.approve_flag);
          setReqNo(res?.data?.msg?.req_no);
          setReason(res?.data?.msg?.reason);
          axios
            .post(url + "/api/get_proj_id", {
              Proj_id: res?.data?.msg?.project_id,
            })
            .then((res) => {
              console.log(res);
              setProjID(res?.data?.msg[0]?.proj_id);
            });
          axios
            .post(url + "/api/checkmin", { req_no: res?.data?.msg?.req_no })
            .then((res) => {
              console.log(res);
              setCount(res.data);
            });
          axios
            .post(url + "/api/req_item_dtls", { last_req_id: +params.id })
            .then((resItems) => {
              console.log(resItems);
              setStockData(resItems?.data?.msg);
              setProject(
                projectList.filter(
                  (e) => e.code == +res?.data?.msg?.project_id
                )[0]?.name
              );

              console.log(
                clientList.filter((e) => e.code == res?.data?.msg?.client_id)[0]
                  ?.name
              );
              setClientCode(res?.data?.msg?.client_id);
              setClient(
                clientList.filter(
                  (e) => e.code == +res?.data?.msg?.client_id
                )[0]?.name
              );

              for (let i of resItems?.data?.msg) {
                error.push({ flag: 0 });
                itemDtlsForm.push({
                  sl_no: +params.id > 0 ? +params.id : 0,
                  po_no: i.po_no,
                  item_id: i.item_id,
                  prod_name:
                    i.prod_name +
                    "@" +
                    " Part No.: " +
                    i.part_no +
                    ", Article No.: " +
                    i.article_no +
                    ", Model No.: " +
                    i.model_no,
                  rc_qty: i.rc_qty,
                  req_qty: i.req_qty,
                  stock: i.project_stock,
                  approved_qty:i.approved_qty
                  // req_qty: i.project_stock,
                });
                itemDtlsFormCopy.push({
                  sl_no: +params.id > 0 ? +params.id : 0,
                  po_no: i.po_no,
                  item_id: i.item_id,
                  prod_name:
                    i.prod_name +
                    "@" +
                    " Part No.: " +
                    i.part_no +
                    ", Article No.: " +
                    i.article_no +
                    ", Model No.: " +
                    i.model_no,

                  rc_qty: i.rc_qty,
                  req_qty: i.req_qty,
                  stock: i.project_stock,
                  approved_qty:i.approved_qty

                  // req_qty:i.proj_stock
                });
                setItemDtlsForm(itemDtlsForm);
                setItemDtlsFormCopy(itemDtlsFormCopy);
                axios
                  .post(url + "/api/item_dtls_trans", {
                    Proj_id: +res?.data?.msg?.project_id,
                  })
                  .then((res_trans) => {
                    console.log(res_trans);

                    for (let i of res_trans?.data?.msg) {
                      console.log(
                        itemDtlsForm.filter((item) => item.item_id == i.prod_id)
                      );
                      if (
                        itemDtlsForm.filter((item) => item.item_id == i.prod_id)
                          .length == 0
                      ) {
                        error.push({ flag: 0 });

                        itemDtlsForm.push({
                          sl_no: +params.id > 0 ? +params.id : 0,
                          item_id: i.prod_id,
                          prod_name:
                            i.prod_name +
                            "@" +
                            " Part No.: " +
                            i.part_no +
                            ", Article No.: " +
                            i.article_no +
                            ", Model No.: " +
                            i.model_no,
                          rc_qty: i.tot_rc_qty,
                          // req_qty: i.tot_rc_qty,
                          req_qty: i.project_stock,
                          stock: i.project_stock,
                        });
                        itemDtlsFormCopy.push({
                          sl_no: +params.id > 0 ? +params.id : 0,
                          item_id: i.prod_id,
                          prod_name:
                            i.prod_name +
                            "@" +
                            " Part No.: " +
                            i.part_no +
                            ", Article No.: " +
                            i.article_no +
                            ", Model No.: " +
                            i.model_no,
                          rc_qty: i.tot_rc_qty,
                          // req_qty: i.tot_rc_qty,
                          req_qty: i.project_stock,
                          stock: i.project_stock,
                        });
                      }
                    }
                    setItemDtlsForm(itemDtlsForm);
                    setItemDtlsFormCopy(itemDtlsFormCopy);
                  });
              }

              setItemDtlsForm(itemDtlsForm);
              setItemDtlsFormCopy(itemDtlsFormCopy);
              setLoading(false);
            });

          axios
            .post(url + "/api/get_item_dtls", {
              Proj_id: +res?.data?.msg?.project_id,
            })
            .then((res) => {
              console.log(res);
              setLoading(false);
              for (let i of res?.data?.msg) {
                error.push({ flag: 0 });
                if (i.rc_qty)
                  breakupinfo.push({
                    sl_no: +params.id > 0 ? +params.id : 0,
                    item_id: i.prod_id,
                    po_no: i.po_no,
                    prod_name: i.prod_name,
                    rc_qty: i.rc_qty,
                    req_qty: i.tot_rc_qty,
                  });
              }
              axios
                .post(url + "/api/item_dtls", {
                  Proj_id: +params.id,
                })
                .then((resDtl) => {
                  setLoading(false);
                  console.log(resDtl);
                  for (let i of resDtl?.data?.msg) {
                    error.push({ flag: 0 });
                    itemDtlsForm.push({
                      sl_no: +params.id > 0 ? +params.id : 0,
                      item_id: i.prod_id,
                      prod_name: i.prod_name,
                      rc_qty: i.tot_rc_qty,
                      // req_qty: i.tot_rc_qty,
                      req_qty: i.project_stock,
                      stock: i.project_stock,
                    });
                    itemDtlsFormCopy.push({
                      sl_no: +params.id > 0 ? +params.id : 0,
                      item_id: i.prod_id,
                      prod_name: i.prod_name,
                      rc_qty: i.tot_rc_qty,
                      req_qty: i.tot_rc_qty,
                      stock: i.project_stock,
                    });
                  }
                });
            });
        });
    } else {
      setReqDate(formatDate(new Date(),"yyyy-MM-DD"));
      axios
        .post(url + "/api/req_item_dtls", { last_req_id: +params.id })
        .then((resItems) => {
          console.log(resItems);
          setStockData(resItems?.data?.msg);
          setStockData1(resItems?.data?.msg);
          // for (let i of resItems?.data?.msg) {
          //   error.push({ flag: 0 });
          //   itemDtlsForm.push({
          //     sl_no: +params.id > 0 ? +params.id : 0,
          //     po_no: i.po_no,
          //     item_id: i.item_id,
          //     prod_name: i.prod_name,
          //     rc_qty: i.rc_qty,
          //     req_qty: i.req_qty,
          //   }

          // );
          // }
          setItemDtlsForm(itemDtlsForm);
          setLoading(false);
        });
    }
  }, []);
  const getItemDetails = (id) => {
    // setBreakUpInfo([]);
    // itemDtlsForm.length = 0;
    // setItemDtlsForm([]);
    if (id && id != "Project") {
      setLoading(true);
      if (params.id == 0)
        setStockData(stockData1.filter((e) => e.project_id == id));
      axios.post(url + "/api/get_proj_id", { Proj_id: id }).then((res) => {
        console.log(res);
        setProjID(res?.data?.msg[0]?.proj_id);
      });
      // itemDtlsForm.length = 0;
      axios
        .post(url + "/api/get_item_dtls", {
          Proj_id: +id,
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
          breakupinfo.length = 0;
          setBreakUpInfo([]);
          for (let i of res?.data?.msg) {
            error.push({ flag: 0 });
            if (i.rc_qty)
              breakupinfo.push({
                sl_no: +params.id > 0 ? +params.id : 0,
                item_id: i.prod_id,
                po_no: i.po_no,
                prod_name: i.prod_name,
                rc_qty: i.rc_qty,
                req_qty: i.tot_rc_qty,
              });
          }
          setBreakUpInfo(breakupinfo);
        });
      axios
        .post(url + "/api/item_dtls", {
          Proj_id: +id,
        })
        .then((res) => {
          setLoading(false);
          console.log(res);
          // setItemDtlsForm([]);
          // setItemDtlsFormCopy([]);

          itemDtlsForm.length = 0;
          itemDtlsFormCopy.length = 0;
          for (let i of res?.data?.msg) {
            error.push({ flag: 0 });
            itemDtlsForm.push({
              sl_no: +params.id > 0 ? +params.id : 0,
              item_id: i.prod_id,
              prod_name:
                i.prod_name +
                "@" +
                " Part No.: " +
                i.part_no +
                ", Article No.: " +
                i.article_no +
                ", Model No.: " +
                i.model_no,
              rc_qty: i.tot_rc_qty,
              req_qty: i.tot_rc_qty - i.tot_req,
              stock: i.project_stock,
            });
            itemDtlsFormCopy.push({
              sl_no: +params.id > 0 ? +params.id : 0,
              item_id: i.prod_id,
              prod_name:
                i.prod_name +
                "@" +
                " Part No.: " +
                i.part_no +
                ", Article No.: " +
                i.article_no +
                ", Model No.: " +
                i.model_no,
              rc_qty: i.tot_rc_qty,
              // req_qty: i.tot_rc_qty,
              req_qty: i.tot_rc_qty - i.tot_req,

              stock: i.project_stock,
            });
           
          }
          console.log(itemDtlsFormCopy)
          setItemDtlsForm(itemDtlsForm);
          setItemDtlsFormCopy(itemDtlsFormCopy);
        
          axios
            .post(url + "/api/item_dtls_trans", {
              Proj_id: +id,
            })
            .then((res_trans) => {
              console.log(res_trans);
          console.log(itemDtlsFormCopy)

              // if(res_trans?.data?.msg){
              for (let i of res_trans?.data?.msg) {
                console.log(
                  itemDtlsForm.filter((item) => item.item_id == i.prod_id)
                );

                if (
                  itemDtlsForm.filter((item) => item.item_id == i.prod_id)
                    .length == 0
                ) {
                  error.push({ flag: 0 });
                 
                  itemDtlsForm.push({
                    sl_no: +params.id > 0 ? +params.id : 0,
                    item_id: i.prod_id,
                    prod_name:
                      i.prod_name +
                      "@" +
                      " Part No.: " +
                      i.part_no +
                      ", Article No.: " +
                      i.article_no +
                      ", Model No.: " +
                      i.model_no,
                    rc_qty: i.tot_rc_qty,
                    req_qty: i.project_stock,
                    stock: i.project_stock,
                  });
                  itemDtlsFormCopy.push({
                    sl_no: +params.id > 0 ? +params.id : 0,
                    item_id: i.prod_id,
                    prod_name:
                      i.prod_name +
                      "@" +
                      " Part No.: " +
                      i.part_no +
                      ", Article No.: " +
                      i.article_no +
                      ", Model No.: " +
                      i.model_no,
                    rc_qty: i.tot_rc_qty,
                    req_qty: i.project_stock,
                    stock: i.project_stock,
                  });
                  console.log(
                    itemDtlsForm.filter((item) => item.item_id == i.prod_id)
                  );
                  console.log(itemDtlsForm);
                }
              }
            // }
          console.log(itemDtlsForm)
            
            });
          // console.log(itemDtlsForm)
          setItemDtlsForm(itemDtlsForm);
          setItemDtlsFormCopy(itemDtlsFormCopy);
        });
        // setItemDtlsForm(itemDtlsForm);

        // setItemDtlsFormCopy(itemDtlsFormCopy);
       
    }
  };

  const getWarehouseItemDetails = (id) => {
    itemDtlsForm.length = 0;
    axios
      .post(url + "/api/get_item_dtls", {
        Proj_id: +id,
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        for (let i of res?.data?.msg) {
          error.push({ flag: 0 });
          if (i.rc_qty)
            breakupinfo.push({
              sl_no: +params.id > 0 ? +params.id : 0,
              item_id: i.prod_id,
              po_no: i.po_no,
              prod_name: i.prod_name,
              rc_qty: i.rc_qty,
              req_qty: i.tot_rc_qty,
            });
        }
        axios
          .post(url + "/api/item_dtls", {
            Proj_id: +id,
          })
          .then((res) => {
            setLoading(false);
            console.log(res);
            for (let i of res?.data?.msg) {
              error.push({ flag: 0 });
              itemDtlsForm.push({
                sl_no: +params.id > 0 ? +params.id : 0,
                item_id: i.prod_id,
                prod_name: i.prod_name,
                rc_qty: i.tot_rc_qty,
                // req_qty: i.tot_rc_qty,
                req_qty: i.project_stock,
                stock: i.project_stock,
              });
              itemDtlsFormCopy.push({
                sl_no: +params.id > 0 ? +params.id : 0,
                item_id: i.prod_id,
                prod_name: i.prod_name,
                rc_qty: i.tot_rc_qty,
                // req_qty: i.tot_rc_qty,
                req_qty: i.project_stock,
                stock: i.project_stock,
              });
            }
          });
      });
  };
  useEffect(() => {
    axios
      .post(url + "/api/item_dtls", { Proj_id: +params.id })
      .then((res) => console.log(res));
  }, []);
  const onSubmit = () => {
    let c = 0;
    for (let i of itemDtlsForm) {
      if (i.req_qty == 0) c++;
    }
    console.log(c);
    if (c != itemDtlsForm.length) {
      setLoading(true);
      axios
        .post(url + "/api/save_requisition", {
          user: localStorage.getItem("email"),
          sl_no: +params.id > 0 ? +params.id : 0,
          intended_for: intended,
          req_date: req_date,
          project_id: projcode || 0,
          // req_type: type,
          client_id: clientcode || 0,
          purpose: purpose,
          items: itemDtlsForm,
          in_out_flag: -1,
        })
        .then((res) => {
          setLoading(false);

          console.log(res);
          if (res?.data?.suc > 0) {
            Message("success", res?.data?.msg);
            if (+params.id == 0) {
              navigate(-1);
            }
          } else {
            Message("success", res?.data?.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          navigate("/error" + "/" + err.code + "/" + err.message);
        });
    } else {
      Message("error", "Seams like all the requisition quantities are zero!");
    }
  };
  return (
    <section className="bg-transparent dark:bg-[#001529]">
      <HeadingTemplate
        text={
          +params.id > 0 ? "Update Floor Requisition" : "New Floor Requisition"
        }
        mode={params.id > 0 ? 1 : 0}
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
            {/* <span className="flex justify-start my-2">
              </span> */}
            <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
              {params.id > 0 && (
                <div className="sm:col-span-12 flex justify-end">
                  <Tag color="#014737">Requisition: {req_no} </Tag>

                  {/* {approve_flag == "A" && (
                    <Tag
                      className="text-[12px] rounded-full w-36"
                      icon={<CheckCircleOutlined />}
                      color="success"
                    >
                      Approved
                    </Tag>
                  )}
                  {approve_flag == "R" && (
                    <Tag
                      className="text-[12px] rounded-full w-36"
                      icon={<CloseCircleOutlined className="animate-spin" />}
                      color="error"
                    >
                      Rejected
                    </Tag>
                  )}
                  {approve_flag == "P" && (
                    <Tag
                      className="text-[12px] rounded-full w-36"
                      icon={<SyncOutlined spin />}
                      color="processing"
                    >
                      Pending
                    </Tag>
                  )} */}
                </div>
              )}
              <div
                className={intended != "C" ? "sm:col-span-6" : "sm:col-span-4"}
              >
                <TDInputTemplate
                  placeholder="Date"
                  type="date"
                  label="Date"
                  name="dt"
                  min={formatDate(
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 3)
                    )
                  ,"yyyy-MM-DD")} //may need to change
                  formControlName={
                    params.id > 0
                      ? req_date
                      : formatDate(new Date(),"yyyy-MM-DD")
                  }
                  max={formatDate(new Date(),"yyyy-MM-DD")}
                  // formControlName={params.po_no}
                  disabled={true}
                  mode={1}
                />
              </div>
              <div
                className={intended != "C" ? "sm:col-span-6" : "sm:col-span-4"}
              >
                <TDInputTemplate
                  placeholder="Intended For"
                  type="date"
                  label="Intended For"
                  name="int"
                  formControlName={intended}
                  handleChange={(txt) => {
                    setIntended(txt.target.value);

                    setClient("");
                    setClientCode(0);
                    setProjectList(projectCopy);
                    // setProjCode(0)
                    // setProject("")

                    // if (txt.target.value == "W") {
                    //   getWarehouseItemDetails(0);
                    //   setProject(0);
                    // }
                  }}
                  disabled={params.id > 0}
                  data={[
                    { name: "Project", code: "C" },
                    { name: "Warehouse", code: "W" },
                  ]}
                  mode={2}
                />
                {!intended && <VError title={"Required"} />}
              </div>
              {/* <div
                className={intended == "C" ? "sm:col-span-6" : "sm:col-span-12"}
              >
                <TDInputTemplate
                  placeholder="Requisition Type"
                  type="date"
                  label="Requisition Type"
                  name="req"
                  formControlName={type}
                  handleChange={(txt) => setType(txt.target.value)}
                  data={[
                    { name: "Production", code: "P" },
                    { name: "Preissue", code: "I" },
                    { name: "Resale", code: "R" },
                  ]}
                  mode={2}
                />
                {!type && <VError title={"Required"} />}
              </div> */}
              {intended == "W" && (
                <div
                  className={
                    "sm:col-span-4 flex-col justify-end items-end -mt-1"
                  }
                >
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
                                getItemDetails(lst.code);
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
                              {/* <hr className=" border-gray-100"/> */}
                            </li>
                          ))}
                      {clientList.filter((e) => e.name.includes(client))
                        .length == 0 && <Empty />}
                    </ul>
                  </OverlayPanel>
                  {!clientcode && <VError title={"Required"} />}
                </div>
              )}
              {(intended == "C" || intended == "W") && (
                <div
                  className={
                    intended == "C"
                      ? "sm:col-span-4 flex-col justify-end items-end"
                      : "sm:col-span-4 flex-col justify-end items-end -mt-1"
                  }
                >
                  <TDInputTemplate
                    placeholder="Project"
                    type="text"
                    label="Project"
                    name="proj"
                    disabled={params.id > 0 || (intended == "W" && !clientcode)}
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
                    className="w-[310px] border-2 bg-gray-200 border-green-900"
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
                                getItemDetails(lst.code);
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
                        onClick={() => {
                          setFlag(17);
                          setVisible(true);
                        }}
                      >
                        <Tag color="#4FB477" className="mt-1">
                          <BuildOutlined /> Itemwise breakup
                        </Tag>
                      </a>
                      <a
                      // onClick={() => {
                      //   setFlag(17);
                      //   setVisible(true);
                      // }}
                      >
                        <Tag color="#eb8d00">Project ID: {projID}</Tag>
                      </a>
                    </span>
                  )}
                </div>
              )}
              <div
                className={
                  intended != "W"
                    ? "sm:col-span-12 -mt-5"
                    : "sm:col-span-4 -mt-1"
                }
              >
                <TDInputTemplate
                  placeholder="Purpose"
                  type="text"
                  label="Purpose"
                  name="purpose"
                  formControlName={purpose}
                  handleChange={(txt) => setPurpose(txt.target.value)}
                  mode={1}
                />
                {/* {!purpose && <VError title={"Required"} />} */}
              </div>
              {/* <span className="col-span-8">
                <Tag className="italic text-xs w-full col-span-8" color="blue">
                  <InfoCircleFilled /> If the requisition quantity is found to
                  be ordered quantity, then it is because it is using the
                  project stock.
                </Tag>
              </span> */}
              {itemDtlsForm.length > 0 && (
                <ScrollPanel
                  style={{ width: "100%", maxheight: "900px",minHeight:"250px" }}
                  className="relative border-2 overflow-x-hidden border-gray-300 p-2 rounded-lg sm:col-span-12"
                >
                  <input
                    type="search"
                    id="default-search"
                    className="bg-gray-200 border-gray-300 border-2 sticky shadow-lg top-1 z-10 rounded-full  text-gray-800 text-sm  my-1 mb-2 p-2  duration-500 block w-full focus:border-gray-200 focus:ring-gray-200 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search by items, part no.,article no.,model_no."
                    onChange={(e) =>
                      setItemDtlsFormCopy(
                        itemDtlsForm.filter((lst) =>
                          lst.prod_name
                            ?.toLowerCase()
                            .includes(e.target.value.toLowerCase())
                        )
                      )
                    }
                  />
                  <div>
                    {/* // itemDtlsForm.map((item, index) => ( */}
                    {itemDtlsFormCopy.length > 0 &&
                      itemDtlsFormCopy.map((item, index) => (
                        <>
                          {(params.id > 0 ||
                            (item.stock > 0 && params.id == 0)) && (
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
                                    Received Quantity
                                  </th>

                                  <th
                                    scope="col"
                                    className="px-6 py-1.5 text-nowrap w-1/6 font-bold"
                                  >
                                    Requisition Quantity
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="bg-[#DDEAE0] border-b-2 mt-1 text-lg border-white my-3 font-bold  dark:bg-gray-800 dark:border-gray-700">
                                  <td
                                    scope="row"
                                    className="px-4 w-1/6 py-1.5 flex-wrap justify-between gap-10 items-center text-sm text-gray-900 whitespace-nowrap dark:text-white"
                                  >
                                    <div className="flex gap-7 justify-start items-center">
                                      <p className="font-bold text-green-900">
                                        {" "}
                                        {item.prod_name.split("@")[0]}
                                      </p>
                                      <Popover
                                        content={content}
                                        title="Stock level"
                                        trigger="click"
                                      >
                                        <span
                                          onClick={() => {
                                            // setProjStock(stockData?.filter(e=>e.item_id==item.item_id)[0].project_stock)
                                            // setWerStock(stockData?.filter(e=>e.item_id==item.item_id)[0].warehouse_stock)
                                            // setStockLoad(true);
                                            // axios
                                            //   .post(url + "/api/getstock", {
                                            //     proj_id: projcode,
                                            //     prod_id: item.item_id,
                                            //   })
                                            //   .then((res) => {
                                            //     console.log(res);
                                            //     setStockLoad(false);

                                            //     setProjStock(
                                            //       res?.data?.msg[0]
                                            //         ?.project_stock
                                            //     );
                                            //     setWerStock(
                                            //       res?.data?.msg[0]
                                            //         ?.warehouse_stock
                                            //     );
                                            //     setReqQty(
                                            //       res?.data?.req_stock
                                            //     );
                                            //   });

                                            setStockLoad(true);
                                            axios
                                              .post(
                                                url +
                                                  "/api/get_logical_stock_req",
                                                {
                                                  proj_id: projcode,
                                                  prod_id: item.item_id,
                                                }
                                              )
                                              .then((res) => {
                                                console.log(res);
                                                setStockLoad(false);

                                                setProjStock(
                                                  res?.data?.result?.msg[0]
                                                    ?.project_stock
                                                  // res?.data?.result?.msg[0]?.project_stock - res?.data?.req_stock
                                                );
                                                setCanStock(
                                                  res?.data?.cancel_stock

                                                )
                                                setLogicalStock(
                                                  res?.data?.result?.msg[0]
                                                    ?.project_stock -
                                                    res?.data?.tot_stock
                                                );
                                                setWerStock(
                                                  res?.data?.result?.msg[0]
                                                    ?.warehouse_stock || 0
                                                );
                                                setReqQty(
                                                  res?.data?.req_stock || 0
                                                );
                                              });
                                          }}
                                          className="flex-col cursor-pointer justify-center items-center"
                                        >
                                          <DropboxOutlined className="text-md hover:scale-150 hover:duration-300 hover:text-green-500 " />
                                          <p className="text-xs -ml-2">
                                            {" "}
                                            Stock{" "}
                                          </p>
                                        </span>
                                      </Popover>
                                    </div>
                                    <Tag
                                      color="green"
                                      className="text-[10px] text-nowrap block my-1"
                                    >
                                      {" "}
                                      {item.prod_name.split("@")[1]}{" "}
                                    </Tag>
                                  </td>

                                  <td
                                    scope="row"
                                    className="px-4 w-1/6 py-1.5 text-sm text-gray-900 whitespace-nowrap dark:text-white"
                                  >
                                    {item.rc_qty}
                                  </td>
                                  <td className="px-4 w-1/6 py-1.5 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                                    <TDInputTemplate
                                      placeholder="Quantity"
                                      type="number"
                                      name="req_qty"
                                      formControlName={item.req_qty}
                                      handleChange={(event) =>
                                        handleDtChange(index, event)
                                      }
                                      mode={1}
                                    />
                                    {/* {item.stock == 0 && <Tag color="#92140C">Out of stock</Tag>} */}
                                    {error[index]["flag"] == 1 && (
                                      <VError title={"Invalid value"} />
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          )}
                        </>
                      ))}
                  </div>
                </ScrollPanel>
              )}
            </div>
            {/* {approve_flag == "R" && (
              <div className="mx-auto flex justify-center">
                <Alert message={`Rejection note- ${reason}`} type="error"/>
              </div>
            )} */}
            {/* <span > {projcode} {clientcode} </span>  */}
            <div className="mx-auto">
              <div className="flex justify-center gap-2 items-center mx-auto">
                {/* {params.id > 0 &&
                  approve_flag == "P" &&
                  (localStorage.getItem("user_type") == "4" ||
                    localStorage.getItem("user_type") == "5") &&
                  count > 0 && (
                    <button
                      disabled={errorSum(error) || !intended}
                      onClick={() => onApprove("A", "")}
                      className=" disabled:bg-gray-400 mx-auto disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-500 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                    >
                      <CheckCircleOutlined className="mr-1" />
                      Approve
                    </button>
                  )} */}
                {(params.id > 0 &&  itemDtlsFormCopy.filter(item=>+item.approved_qty>0).length==0) && <button
                    disabled={itemDtlsFormCopy.filter(item=>+item.approved_qty>0).length>0}
                    onClick={() =>{
                      setFlag(4)
                      setVisible(true)
                    }
                    }
                    className=" disabled:bg-gray-400 mx-auto disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                  >
                    <SaveOutlined className="mr-1" />
                    Delete
                  </button>
}
                {params.id == 0 && (
                  <button
                    disabled={errorSum(error) || !intended || det.requisition==1}
                    onClick={() => onSubmit()}
                    className=" disabled:bg-gray-400 mx-auto disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                  >
                    <SaveOutlined className="mr-1" />
                    Submit
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
                {/* {params.id > 0 &&
                  approve_flag == "P" &&
                  (localStorage.getItem("user_type") == "4" ||
                    localStorage.getItem("user_type") == "5") &&
                  count > 0 && (
                    <button
                      disabled={
                        errorSum(error) || !intended 
                      }
                      onClick={() => {
                        setFlag(20);
                        setVisible(true);
                      }}
                      className=" disabled:bg-gray-400 mx-auto disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-500 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                    >
                      <CloseCircleOutlined className="mr-1" />
                      Reject
                    </button>
                  )} */}
              </div>
            </div>
          </div>
        </div>
      </Spin>
      <DialogBox
        visible={visible}
        flag={flag}
        id={id}
        // data={itemList}
        //   data={itemInfo}
        data={breakupinfo}
        onPress={() => setVisible(false)}
        onDelete={() => deleteItem()}
        onDeactivate={(val) => {
          console.log(val);
          setReason(val);
          setVisible(false);
          onApprove("R", val);
        }}
      />
    </section>
  );
}

export default RequisitionForm;
