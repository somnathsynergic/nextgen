import './Steps.css'

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import HeadingTemplate from "../../../Components/HeadingTemplate";
import { Message } from "../../../Components/Message";
import { useNavigate } from "react-router-dom";
import {
  LoadingOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  InfoOutlined,
  PlusOutlined,
  MinusOutlined,
  FileTextOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileImageOutlined,
  FileExcelOutlined,
  PlusCircleOutlined,
  SaveOutlined,
  LockFilled,
  UnlockFilled,
} from "@ant-design/icons";
import { BlockUI } from 'primereact/blockui';

import { Empty, Popover, Spin } from "antd";
import TDInputTemplate from "../../../Components/TDInputTemplate";
import axios from "axios";
import { url } from "../../../Address/BaseUrl";
import AuditTrail from "../../../Components/AuditTrail";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import DialogBox from "../../../Components/DialogBox";
import Viewdetails from "../../../Components/Viewdetails";
import { Button, Form, Input } from "antd";
import VError from "../../../Components/VError";
import DrawerComp from "../../../Components/DrawerComp";
import { SyncOutlined } from "@ant-design/icons";
import moment from "moment";
import { OverlayPanel } from "primereact/overlaypanel";
import { useReactToPrint } from "react-to-print";
import PrintHeader from "../../../Components/PrintHeader";
import BtnGroupReuse from '../../../Components/BtnGroupReuse';
import InfoTags from '../../../Components/InfoTags';
import { formatDate } from '../../../Functions/formatDate';
function ProjectForm() {
  const navigate = useNavigate();
     const [blocked, setBlocked] = useState(false);
     const det = JSON.parse(localStorage.getItem('perm'))
     const contentRef = useRef(null);
              const [isPrinting, setIsPrinting] = useState(true);
            
               const reactToPrintFn = useReactToPrint({
               contentRef
              });
  
  const [client, setClient] = useState([]);
  const [globalClient, setGlobal] = useState([]);
  const params = useParams();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [pmList, setPMList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [yesNo, setYesNoList] = useState([]);
  const [pocList, setPocList] = useState([]);
  const [nameList, setPocNameList] = useState([]);
  const [priceBais, setPriceBasisList] = useState([]);
  const [selectedPoc, setselectedPoc] = useState(false);
  const [ldClsVal, setLdClsVal] = useState(false);
  const [gstPan, setGstPan] = useState(false);
  const [proj_id, setProjID] = useState("");
  const [assgn_pm, setAssign] = useState("");
  const [projnm, setProjnm] = useState("");
  const [order_id, setOrderID] = useState("");
  const [order_dt, setOrderDt] = useState("");
  const [proj_ordr_val, setOrderVal] = useState("");
  const [prc_basis, setProjBasis] = useState("");
  const [proj_end_delvry_dt, setEndDel] = useState("");
  const [ld_cls, setLdClause] = useState("");
  const [ld_cls_dtl, setDtl] = useState("");
  const [warranty_check, setWarranty] = useState("");
  const [erctn_res, setErection] = useState("");
  const [erctn_res_val, setErectionVal] = useState("");
  const [docs, setDocs] = useState();
  const [docs2, setDocs2] = useState();
  const [docs3, setDocs3] = useState();
  const [locList, setLocList] = useState([]);
  const [client_id, setClientID] = useState("");
  const [end_user, setEndUser] = useState("");
  const [client_loc, setClientLoc] = useState("");
  const [proj_consultant, setConsultant] = useState("");
  const [epc_con, setEPC] = useState("");
  const [p_gst, setGST] = useState("");
  const [p_pan, setPAN] = useState("");
  const [proj_des, setDes] = useState("");
  const [clientLocList, setClientLocList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [clientInfo, setClientInfo] = useState();
  const [flag, setFlag] = useState();
  const [info, setInfo] = useState();
  const [file_paths, setFilePaths] = useState([]);
  const [delId, setDelId] = useState();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(0);
  const [count, setCount] = useState(0);
  const [checkLoad, setCheckLoad] = useState(false);
  const [projunit, setProjUnit] = useState("");
  const [proj_type, setProjType] = useState("");
  const [isEdited, setIsEdited] = useState(params.id > 0 ? 1 : 0);
  const [wlist, setWList] = useState([]);
  const [wrrantypop, setWarrantyPop] = useState([]);
  const [popwOpen, setwPopOpen] = useState(false);
  const [clientCode, setCode] = useState();
  const [pm_code,setPmCode] = useState()
  const [ldlist, setldList] = useState([]);
  const [ldpop, setldPop] = useState([]);
  const [popldOpen, setldPopOpen] = useState(false);
  const op = useRef(null);
  const op1 = useRef(null);
  const [txt, setText] = useState("");
  const [ev,setEv] = useState()
  const hidew = () => {
    setwPopOpen(false);
  };

  const handleOpenChangew = (newOpen) => {
    setwPopOpen(newOpen);
  };

  const hideld = () => {
    setldPopOpen(false);
  };

  const handleOpenChangeld = (newOpen) => {
    setldPopOpen(newOpen);
  };
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setLoading(true);
    axios.post(url + "/api/getclient", { id: 0 }).then((res) => {
      console.log(res, "res client");
      for (let i = 0; i < res?.data?.msg?.length; i++) {
        clientList.push({
          name: res?.data?.msg[i].client_name,
          code: res?.data?.msg[i].sl_no,
        });
      }
      setClient(clientList);
      setGlobal(res.data.msg);
      setLoading(false);
    });
  };
  const [pocSet, setPocSet] = useState([
    {
      sl_no: 0,
      poc_name: "",
      poc_ph_1: "",
      poc_designation: "",
      poc_email: "",
    },
  ]);
  const handleDtChange = (index, event) => {
    // if(params.id==0)
    setIsEdited(1);
    console.log(event);
    const selected = pocList.find((poc) => poc.sl_no == event.target.value);
    console.log(selected);
    let data = [...pocSet];
    console.log(data);
    console.log(event.target.name, event.target.value);

    data[index][event.target.name] = event.target.value;
    // data[index]['poc_name'] = selected.sl_no;
    data[index]["poc_email"] = selected.poc_email;
    data[index]["poc_ph_1"] = selected.poc_ph_1;
    data[index]["poc_designation"] = selected.poc_designation;

    setPocSet(data);
  };
  const addDt = () => {
    setIsEdited(0);
    setPocSet([
      ...pocSet,
      {
        sl_no: 0,
        poc_name: "",
        poc_ph_1: "",
        poc_designation: "",
        poc_email: "",
      },
    ]);
  };
  const removeDt = (index) => {
    let data = [...pocSet];
    data.splice(index, 1);
    setPocSet(data);
  };
  const stepperRef = useRef(null);

  let projectStatusOptions = [
    { code: "O", name: "Open" },
    { code: "C", name: "Close" },
  ];
  let yesNoList = [
    { code: "Y", name: "Yes" },
    { code: "N", name: "No" },
  ];
  let priceBasisList = [
    { code: "F", name: "FOR" },
    { code: "E", name: "Ex-Works" },
  ];

  var clientList = [];
  var pocNameList = [];
  const checkid = () => {
    if (proj_id) {
      setCheckLoad(true);
      axios.post(url + "/api/check_proj_id", { id: proj_id }).then((res) => {
        console.log(res.data.msg[0].count);
        setCheckLoad(false);
        setCount(res.data.msg[0].count);
      });
    }
  };

  const handleChangeClient1 = (event) => {
    setLoading(true);
    console.log(client_id);
    const value = event.target.value;
    console.log(value, "handleChangeClient");
    setLocList([]);

    if (value) {
      setGstPan(true);
    } else {
      setGstPan(false);
    }
    axios.post(url + "/api/getclient", { id: value }).then((res) => {
      setClientInfo(res.data.msg);
      console.log(res.data.msg.client_gst, "getclient project");
    });
    axios.post(url + "/api/getclientpoc", { id: value }).then((res) => {
      console.log(res, "getclientpoc");
      setPocList(res.data.msg);
      for (let i = 0; i < res?.data?.msg?.length; i++) {
        pocNameList.push({
          name: res?.data?.msg[i].poc_name,
          code: res?.data?.msg[i].sl_no,
        });
        setPocNameList(pocNameList);
      }
    });
    axios.post(url + "/api/getclientloc", { id: value }).then((res) => {
      console.log(res, "getclientloc");
      setLocList(res.data.msg);
      setClientLocList(res.data.msg);
      locList.length = 0;

      for (let i = 0; i < res?.data?.msg?.length; i++) {
        locList.push({
          name: res?.data?.msg[i].c_loc,
          code: res?.data?.msg[i].c_loc,
        });
        setLocList(locList);
        setLoading(false);
      }
    });
  };
  const handleChangeClient = (event) => {
    setLoading(true);
    console.log(client_id);
    const value = event;
    console.log(value, "handleChangeClient");
    setLocList([]);

    if (value) {
      setGstPan(true);
    } else {
      setGstPan(false);
    }
    axios.post(url + "/api/getclient", { id: value }).then((res) => {
      setClientInfo(res.data.msg);
      console.log(res.data.msg.client_gst, "getclient project");
    });
    axios.post(url + "/api/getclientpoc", { id: value }).then((res) => {
      console.log(res, "getclientpoc");
      setPocList(res.data.msg);
      for (let i = 0; i < res?.data?.msg?.length; i++) {
        pocNameList.push({
          name: res?.data?.msg[i].poc_name,
          code: res?.data?.msg[i].sl_no,
        });
        setPocNameList(pocNameList);
      }
    });
    axios.post(url + "/api/getclientloc", { id: value }).then((res) => {
      console.log(res, "getclientloc");
      setLocList(res.data.msg);
      setClientLocList(res.data.msg);
      locList.length = 0;

      for (let i = 0; i < res?.data?.msg?.length; i++) {
        locList.push({
          name: res?.data?.msg[i].c_loc,
          code: res?.data?.msg[i].c_loc,
        });
        setLocList(locList);
        setLoading(false);
      }
    });
  };
  const deleteDoc = () => {
    setLoading(true);
    axios
      .post(url + "/api/del_proj_files", { id: file_paths[delId].sl_no })
      .then((res) => {
        console.log(res);
        setLoading(false);
        setVisible(false);
        if (res.data.suc > 0) {
          file_paths.splice(delId, 1);
          setFilePaths(file_paths);
          Message("success", res.data.msg);
        } else Message("error", res.data.msg);
      })
      .catch((err) => Message("error", err));
  };

  useEffect(() => {

    setLoading(true);
    axios.post(url + "/api/getclient", { id: 0 }).then((res) => {
      console.log(res, "res client");
      for (let i = 0; i < res?.data?.msg?.length; i++) {
        clientList.push({
          name: res?.data?.msg[i].client_name,
          code: res?.data?.msg[i].sl_no,
        });
      }
      setClient(clientList);
      setGlobal(res.data.msg);
    });
    axios.post(url + "/api/getuser", { id: 0 }).then((res) => {
      console.log(res.data.msg, "res user");
      const pmlist = res.data.msg
        .filter((user) => user.user_type === "1")
        .map((user) => ({ name: user.user_name, code: user.sl_no }));
      console.log(pmlist, "PMList");
      setLoading(false);
      setPMList(pmlist);
    });
    setStatusList(projectStatusOptions);
    setPriceBasisList(priceBasisList);
    setYesNoList(yesNoList);
    console.log(globalClient);
    if (+params.id > 0) {
      setLoading(true);

      axios.post(url + "/api/getproject", { id: params.id }).then((resProj) => {
        console.log(resProj.data.msg, "getproject");
        setData(resProj.data?.msg);
        // alert(resProj.data?.msg.manager_email)
        setBlocked(det.project==1 || resProj.data?.msg.manager_email!=localStorage.getItem('email')?true:false )
        
        axios
          .post(url + "/api/getclientpoc", { id: resProj?.data?.msg.client_id })
          .then((resPoc) => {
            console.log(resPoc, "getclientpoc");
            setPocList(resPoc.data.msg);
            for (let i = 0; i < resPoc?.data?.msg?.length; i++) {
              pocNameList.push({
                name: resPoc?.data?.msg[i].poc_name,
                code: resPoc?.data?.msg[i].sl_no,
              });
              setPocNameList(pocNameList);
            }
            axios
              .post(url + "/api/getclientloc", {
                id: resProj?.data?.msg.client_id,
              })
              .then((resLoc) => {
                console.log(resLoc, "getclientloc");
                setLocList(resLoc.data.msg);
                setClientLocList(resLoc.data.msg);
                locList.length = 0;

                for (let i = 0; i < resLoc?.data?.msg?.length; i++) {
                  locList.push({
                    name: resLoc?.data?.msg[i].c_loc,
                    code: resLoc?.data?.msg[i].c_loc,
                  });
                  setLocList(locList);
                }
                pocSet.length = 0;
                axios
                  .post(url + "/api/getprojectpoc", {
                    id: resProj?.data?.msg.proj_id,
                  })
                  .then((res) => {
                    for (let i = 0; i < res?.data?.msg?.length; i++) {
                      pocSet.push({
                        sl_no: res?.data?.msg[i].sl_no,
                        poc_name: res?.data?.msg[i].poc_name,
                        poc_ph_1: res?.data?.msg[i].poc_phone_1,
                        poc_designation: res?.data?.msg[i].poc_designation,
                        poc_email: res?.data?.msg[i].poc_email,
                      });
                    }
                    setPocSet(pocSet);
                    setProjID(resProj?.data?.msg.proj_id);
                    setProjUnit(resProj?.data?.msg.proj_unit);
                    setProjType(resProj?.data?.msg.proj_type);
                    // setAssign(pmList.filter(e=>e.code==resProj?.data?.msg.proj_manager)[0]?.name);
                    setAssign(resProj?.data?.msg.proj_manager_name);
                    setPmCode(resProj?.data?.msg.proj_manager)

                    setProjnm(resProj?.data?.msg.proj_name);
                    setClientID(clientList.filter(e=>e.code==resProj?.data?.msg.client_id)[0].name);
                    setCode(resProj?.data?.msg.client_id);
                    console.log(globalClient);
                    axios
                      .post(url + "/api/getclient", { id: 0 })
                      .then((resclientdt) => {
                        setClientInfo(
                          resclientdt.data.msg?.filter(
                            (e) => e.sl_no == resProj?.data?.msg.client_id
                          )[0]
                        );
                        console.log(
                          resclientdt.data.msg?.filter(
                            (e) => e.sl_no == resProj?.data?.msg.client_id
                          )[0],
                          "gggggggg"
                        );
                      });
                    setGST(resProj?.data?.msg.client_gst);
                    setPAN(resProj?.data?.msg.client_pan);
                    setClientLoc(resProj?.data?.msg.client_location);
                    setOrderID(resProj?.data?.msg.order_id);
                    setOrderDt(resProj?.data?.msg.order_date);
                    setDes(resProj?.data?.msg.proj_desc);
                    setEndUser(resProj?.data?.msg.proj_end_user);
                    setConsultant(resProj?.data?.msg.proj_consultant);
                    setEPC(resProj?.data?.msg.epc_contractor);
                    setOrderVal(resProj?.data?.msg.proj_order_val);
                    setProjBasis(resProj?.data?.msg.price_basis);
                    setLdClause(resProj?.data?.msg.ld_clause_flag);
                    setLdClsVal(
                      resProj?.data?.msg.ld_clause_flag == "Y" ? true : false
                    );
                    setDtl(resProj?.data?.msg.ld_clause);
                    setErection(resProj?.data?.msg.erection_responsibility);
                    setErectionVal(resProj?.data?.msg.erection_responsibility_val);
                    setWarranty(resProj?.data?.msg.warranty);
                    setEndDel(resProj?.data?.msg.proj_delivery_date);
                    axios
                      .post(url + "/api/get_proj_files", {
                        id: resProj?.data?.msg.proj_id,
                      })
                      .then((resFiles) => {
                        console.log(resFiles);
                        setFilePaths(resFiles.data.msg);
                        setLoading(false);
                      });
                  });
              });
          });
      });
    }
  }, []);

  const onSubmitClient = (values) => {
    console.log("client called");
    console.log(
      // "",
      // client_id,
      // assgn_pm,
      // client_loc,
      // p_gst,
      // p_pan,
      // proj_des,
      // end_user,
      // proj_consultant,
      // epc_con,
      // pocSet,
      erctn_res,erctn_res_val.length,
      // ((!ldClsVal || (ldClsVal && ld_cls_dtl)) && !proj_ordr_val) ||
      //   (proj_ordr_val > 0 && projunit) 
    );
    const formData = new FormData();
    //  formData.append("id",+params.id)
    //  formData.append("user",localStorage.getItem("email"))

    //  formData.append("proj_id", proj_id);
    //       formData.append("proj_name", projnm);
    //       formData.append("client_id", client_id);
    //       formData.append("client_location", client_loc);
    //       formData.append("client_gst", p_gst);
    //       formData.append("client_pan", p_pan);
    //       formData.append("order_id", order_id);
    //       formData.append("order_date", order_dt);
    //       formData.append("proj_delivery_date", proj_end_delvry_dt);
    //       formData.append("proj_desc", proj_des);
    //       formData.append("proj_order_val", proj_ordr_val);
    //       formData.append("proj_end_user", end_user);
    //       formData.append("proj_consultant", proj_consultant);
    //       formData.append("epc_contractor", epc_con);
    //       formData.append("price_basis", prc_basis);
    //       formData.append("ld_clause_flag", ld_cls);
    //       formData.append("ld_clause", ld_cls_dtl);
    //       formData.append("erection_responsibility", erctn_res);
    //       formData.append("warranty", warranty_check);
    //       formData.append("proj_manager", +assgn_pm);
    //       formData.append("proj_poc", pocSet);
    // console.log(docs);
    // formData.append("docs",docs)

    // arr.push(dt)
    console.log(pocSet.filter((e) => e.poc_name == "").length <= 0);
    if (
      ((count == 0 &&
        client_id &&
        clientCode>0 &&
        pm_code &&
        client_loc &&
        assgn_pm>0 &&
        proj_id &&
        projnm &&
        order_id &&
        order_dt &&
        prc_basis &&
        proj_ordr_val >= 0 &&
        // proj_end_delvry_dt &&
       
        // order_dt <= proj_end_delvry_dt && 
        (!ldClsVal || (ldClsVal && ld_cls_dtl)) &&
        !proj_ordr_val) ||
        (proj_ordr_val > 0 && projunit)) && (erctn_res=='N'||erctn_res=='Y' && erctn_res_val.length) 
        // && pocSet.filter((e) => e.poc_name == "").length <= 0
    ) {
      setLoading(true);

      axios
        .post(url + "/api/addproject", {
          id: +params.id,
          user: localStorage.getItem("email"),
          proj_type: proj_type,
          proj_unit: projunit,
          proj_id: proj_id,
          proj_name: projnm,
          // client_id: client_id,
          client_id: clientCode,
          client_location: client_loc,
          client_gst: p_gst,
          client_pan: p_pan,
          order_id: order_id,
          order_date: order_dt,
          proj_delivery_date: proj_end_delvry_dt||"",
          proj_desc: proj_des,
          proj_order_val: proj_ordr_val,
          proj_end_user: end_user,
          proj_consultant: proj_consultant,
          epc_contractor: epc_con,
          price_basis: prc_basis,
          ld_clause_flag: ld_cls,
          ld_clause: ld_cls_dtl,
          erection_responsibility: erctn_res,
          erection_responsibility_val: erctn_res_val,
          warranty: warranty_check,
          // proj_manager: +assgn_pm,
          proj_manager: +pm_code,
          proj_poc: pocSet,
          // c_location: values.poc_location,
          // c_address: values.poc_address,
        })
        .then((res) => {
          setData(res.data?.msg);
          if (res.data.suc > 0) {
            formData.append("proj_id", proj_id);
            formData.append("user", localStorage.getItem("email"));
            if (docs) formData.append("docs", docs);
            if (docs2) formData.append("docs1", docs2);
            if (docs3) formData.append("docs2", docs3);

            axios
              .post(url + "/api/add_proj_files", formData)
              .then((resProjFile) => {
                setLoading(false);

                if (resProjFile.data.suc > 0) {
                  Message("success", res.data.msg);
                  // if(+params.id==0)
                  navigate(-1);
                } else {
                  Message("error", res.data.msg);
                }
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
                navigate("/error" + "/" + err.code + "/" + err.message);
              });
          } else {
            Message("error", res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          navigate("/error" + "/" + err.code + "/" + err.message);
        });
    }
  };
  const onSubmitProject = () => {
    console.log(docs);
    //  console.log(proj_id, projnm, order_id, order_dt, proj_end_delvry_dt, count==0, order_dt<proj_end_delvry_dt)
    if (
      proj_id &&
      projnm &&
      order_id &&
      order_dt &&
      // proj_end_delvry_dt &&
      proj_type &&
      prc_basis &&
      count == 0 &&
      // proj_ordr_val > 0 &&
      // order_dt <= proj_end_delvry_dt  && (erctn_res=='N'||(erctn_res=='Y' && erctn_res_val))
      order_dt  && (erctn_res=='N'||(erctn_res=='Y' && erctn_res_val))
    ) {
      if (proj_ordr_val > 0) {
        if (projunit) {
          if (!ldClsVal) stepperRef.current.nextCallback();
          else if (ldClsVal && ld_cls_dtl) {
            stepperRef.current.nextCallback();
          }
        } else {
          // if(!ldClsVal)
          //   stepperRef.current.nextCallback();
          //   else if(ldClsVal && ld_cls_dtl){
          //   stepperRef.current.nextCallback();
          //   }
        }
      } else {
        // if(proj_ordr_val=='' && proj_ordr_val!=0) stepperRef.current.nextCallback();
        if (proj_ordr_val != 0 && proj_ordr_val == "") {
          if (!ldClsVal) stepperRef.current.nextCallback();
          else if (ldClsVal && ld_cls_dtl) {
            stepperRef.current.nextCallback();
          }
        }
      }
    }
  };

  return (
    <section className="bg-transparent dark:bg-[#001529]">
      {/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
      <HeadingTemplate
        text={params.id > 0 ? "Update client order" : "Add client order"}
        mode={params.id > 0 ? 1 : 0}
        title={"Project"}
        data={params.id && data ? data : ""}
        onPrinting={()=>{setIsPrinting(false);
          setTimeout(() => {
            reactToPrintFn();
            setIsPrinting(true);
            }, 5);}
          }
      />
      <div className="w-full bg-white p-6 rounded-2xl">
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          className="text-green-900 dark:text-gray-400"
          spinning={loading}
        >
          <div className="card flex justify-content-center">
            <Stepper
              ref={stepperRef}
              style={{ flexBasis: "100%" }}
              linear={params.id > 0 ? false : true}
            >
              <StepperPanel header="Project Details">
                <h2 className="font-bold text-2xl text-green-900 my-3">
                  Project Details
                </h2>
                <BlockUI blocked={blocked} template={
                            <div className='relative  w-full h-full 0 z-10'>
                              <span className='absolute top-1 right-1 font-bold italic text-gray-500'><LockFilled className='text-green-900 '/> Locked</span>
                              <span className='absolute bottom-1 right-1 font-bold italic text-gray-500'><UnlockFilled className='text-green-900 '/> Accessible to {data?.proj_manager_name}</span>
                            </div>
                          } >
            <div className={blocked?'p-2':''}>
                <div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <TDInputTemplate
                      placeholder="Type NGAPL project ID..."
                      type="text"
                      label="NGAPL Project ID"
                      name="proj_id"
                      formControlName={proj_id}
                      handleChange={(txt) => {
                        setProjID(txt.target.value);
                        setCount(0);
                      }}
                      handleBlur={() => checkid()}
                      mode={1}
                      disabled={params.id > 0}
                    />
                    {checkLoad && (
                      // <Tag icon={<SyncOutlined spin />} color="processing">
                      //   Checking...
                      // </Tag>
                      <InfoTags color="processing" icon={<SyncOutlined spin />} text="Checking..."/>
                    )}
                    {!proj_id && (
                      <VError title={"A unique project ID is required!"} />
                    )}
                    {count > 0 && (
                      <VError title={"Project ID already exists!"} />
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <TDInputTemplate
                      placeholder="Type project name..."
                      type="text"
                      label="Project Name"
                      name="projnm"
                      formControlName={projnm}
                      handleChange={(txt) => setProjnm(txt.target.value)}
                      mode={1}
                    />
                    {!projnm && <VError title={"Project name is required!"} />}
                  </div>
                  <div className="sm:col-span-4">
                    <TDInputTemplate
                      placeholder="Select Order Type"
                      type="text"
                      label="Order type"
                      name="proj_type"
                      formControlName={proj_type}
                      handleChange={(txt) => {
                        setProjType(txt.target.value);
                      }}
                      data={[
                        { code: "U", name: "Supply Order" },
                        { code: "E", name: "Service Order" },
                      ]}
                      mode={2}
                    />

                    {!proj_type && <VError title={"Type is required!"} />}
                  </div>
                  <div className="sm:col-span-2">
                    <TDInputTemplate
                      placeholder="Select order no."
                      type="text"
                      label="Order No."
                      name="order_id"
                      formControlName={order_id}
                      handleChange={(txt) => setOrderID(txt.target.value)}
                      mode={1}
                      disabled={params.id > 0}
                    />
                    {!order_id && <VError title={"Order No. is required!"} />}
                  </div>
                  <div className="sm:col-span-2">
                    <TDInputTemplate
                      placeholder="Type order date..."
                      type="date"
                      label="Order Date"
                      name="order_dt"
                      formControlName={order_dt}
                      min={formatDate(
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 3)
                        )
                      ,"yyyy-MM-DD")}
                      max={formatDate(new Date(),"yyyy-MM-DD")} //may need to change
                      handleChange={(txt) => setOrderDt(txt.target.value)}
                      mode={1}
                    />
                    {!order_dt && <VError title={"Date is required!"} />}
                  </div>
                  <div className="sm:col-span-1">
                    <TDInputTemplate
                      placeholder="Type project basic order value..."
                      type="number"
                      label="Project Basic Order Value"
                      name="proj_ordr_val"
                      formControlName={proj_ordr_val}
                      handleChange={(txt) => {
                        setOrderVal(txt.target.value);
                        if (txt.target.value <= 0 || !txt.target.value) {
                          setProjUnit("");
                        }
                      }}
                      mode={1}
                    />
                    {proj_ordr_val <= 0 && (
                      <VError title={"Order value must not be <=0"} />
                    )}
                  </div>
                  <div className="sm:col-span-1">
                    <TDInputTemplate
                      placeholder="Select unit"
                      type="number"
                      label="Unit"
                      name="projunit"
                      disabled={!proj_ordr_val || proj_ordr_val <= 0}
                      formControlName={projunit}
                      handleChange={(txt) => setProjUnit(txt.target.value)}
                      data={[
                        { name: "INR", code: "I" },
                        { name: "USD", code: "U" },
                        { name: "Euro", code: "E" },
                      ]}
                      mode={2}
                    />
                    {proj_ordr_val > 0 && !projunit && (
                      <VError title={"Unit is required"} />
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <TDInputTemplate
                      placeholder="Type price basis"
                      type="text"
                      label="Price Basis"
                      name="prc_basis"
                      formControlName={prc_basis}
                      handleChange={(txt) => setProjBasis(txt.target.value)}
                      data={priceBais}
                      mode={2}
                    />
                                        { !prc_basis && (
                      <VError title={"Price Basis is required"} />
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <TDInputTemplate
                      placeholder="Type order date..."
                      type="date"
                      label="Project end delivery Date"
                      name="proj_end_delvry_dt"
                      min={order_dt}
                      disabled={!order_dt}
                      formControlName={proj_end_delvry_dt}
                      handleChange={(txt) => setEndDel(txt.target.value)}
                      max={formatDate(
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() + 3)
                        )
                      ,"yyyy-MM-DD")} //may need to change
                      mode={1}
                    />
                    {/* {!proj_end_delvry_dt && (
                      <VError title={"Delivery is required!"} />
                    )} */}
                  </div>
                  <div className="sm:col-span-2">
                    <TDInputTemplate
                      placeholder="Type LD clause"
                      type="text"
                      label="LD Clause"
                      name="ld_cls"
                      formControlName={ld_cls}
                      handleChange={(txt) => {
                        setLdClause(txt.target.value);
                        setLdClsVal(txt.target.value == "Y" ? true : false);
                      }}
                      data={yesNo}
                      mode={2}
                    />
                  </div>
                  {ldClsVal && (
                    <Popover
                      content={
                        <>
                          <ul>
                            {ldlist?.map((price) => (
                              <li className="my-2">
                                {/* <Tag
                                  className="cursor-pointer"
                                  onClick={(index) => {
                                    setDtl(price.ld_clause);
                                    // console.log()
                                    handleOpenChangeld(false);
                                  }}
                                >
                                  {price.ld_clause}
                                </Tag> */}
                                <InfoTags onPress={(index) => {
                                    setDtl(price.ld_clause);
                                    handleOpenChangeld(false);
                                  }}
                                  text={price.ld_clause}
                                  bgCol={'cursor-pointer text-green-900 font-semibold'}
                                  />
                              </li>
                            ))}
                          </ul>
                          <a onClick={hideld}>Close</a>
                        </>
                      }
                      title="Do you mean?"
                      trigger="click"
                      open={popldOpen}
                      onOpenChange={handleOpenChangeld}
                    >
                      <div className="sm:col-span-2">
                        <TDInputTemplate
                          placeholder="Type LD clause details"
                          type="text"
                          label="LD Clause Details"
                          name="ld_cls_dtl"
                          formControlName={ld_cls_dtl}
                          handleChange={(txt) => {
                            setDtl(txt.target.value);

                            if (txt.target.value.length >= 3) {
                              axios
                                .post(url + "/api/get_ld_clause", {
                                  wrd: txt.target.value.toString().trim(),
                                })
                                .then((res) => {
                                  console.log(res);
                                  if (res.data.msg.length > 0) {
                                    handleOpenChangeld(true);
                                    setldList(res.data.msg);
                                  } else {
                                    handleOpenChangeld(false);
                                  }
                                });
                            } else handleOpenChangew(false);
                          }}
                          mode={3}
                        />
                        {ldClsVal && !ld_cls_dtl && (
                          <VError title={"Details is required!"} />
                        )}
                      </div>
                    </Popover>
                  )}
                  <Popover
                    content={
                      <>
                        <ul>
                          {wlist?.map((price) => (
                            <li className="my-2">
                              {/* <Tag
                                className="cursor-pointer"
                                onClick={(index) => {
                                  setWarranty(price.warranty);
                                  // console.log()
                                  handleOpenChangew(false);
                                }}
                              >
                                {price.warranty}
                              </Tag> */}
                              <InfoTags text={price.warranty}  onPress={(index) => {
                                  setWarranty(price.warranty);
                                  // console.log()
                                  handleOpenChangew(false);
                                }}
                                bgCol={'cursor-pointer text-green-900 font-semibold'}
                                />

                            </li>
                          ))}
                        </ul>
                        <a onClick={hidew}>Close</a>
                      </>
                    }
                    title="Do you mean?"
                    trigger="click"
                    open={popwOpen}
                    onOpenChange={handleOpenChangew}
                  >
                    <div className="sm:col-span-2">
                      <TDInputTemplate
                        placeholder="Type Warranty"
                        type="text"
                        label="Warranty"
                        name="warranty_check"
                        formControlName={warranty_check}
                        handleChange={(txt) => {
                          setWarranty(txt.target.value);
                          if (txt.target.value.length >= 3) {
                            axios
                              .post(url + "/api/get_warranty", {
                                wrd: txt.target.value.toString().trim(),
                              })
                              .then((res) => {
                                console.log(res);
                                if (res.data.msg.length > 0) {
                                  handleOpenChangew(true);
                                  setWList(res.data.msg);
                                } else {
                                  handleOpenChangew(false);
                                }
                              });
                          } else handleOpenChangew(false);
                        }}
                        data={yesNo}
                        mode={3}
                      />
                    </div>
                  </Popover>
                  <div className="sm:col-span-2">
                    <TDInputTemplate
                      placeholder="Supervision of erection and commissioning..."
                      type="text"
                      label="Supervision of erection and commissioning"
                      name="erctn_res"
                      formControlName={erctn_res}
                      handleChange={(txt) => setErection(txt.target.value)}
                      data={yesNo}
                      mode={2}
                    />
                  </div>
                 {erctn_res=='Y' && <div className="sm:col-span-2">
                    <TDInputTemplate
                      placeholder="Supervision of erection and commissioning..."
                      type="text"
                      label="Supervision of erection and commissioning Description"
                      name="erctn_res_val"
                      formControlName={erctn_res_val}
                      handleChange={(txt) => setErectionVal(txt.target.value)}
                      data={yesNo}
                      mode={3}
                    />
                      {erctn_res && !erctn_res_val && (
                          <VError title={"Details is required!"} />
                        )}
                  </div>}
                </div>
                <div className="grid grid-cols-6 my-6 gap-2">
                  {file_paths?.length < 3 && (
                    <div className="sm:col-span-2">
                      <TDInputTemplate
                        type="file"
                        label="Purchase Order"
                        name="docs"
                        multiple={true}
                        // formControlName={docs[0]}
                        handleChange={(event) => setDocs(event.target.files[0])}
                        mode={1}
                      />
                    </div>
                  )}
                  {file_paths?.length < 2 && (
                    <div className="sm:col-span-2">
                      <TDInputTemplate
                        type="file"
                        label="Document 1"
                        name="docs1"
                        multiple={true}
                        // formControlName={docs[0]}
                        handleChange={(event) =>
                          setDocs2(event.target.files[0])
                        }
                        mode={1}
                      />
                    </div>
                  )}
                  {file_paths?.length < 1 && (
                    <div className="sm:col-span-2">
                      <TDInputTemplate
                        type="file"
                        label="Document 2"
                        name="docs2"
                        multiple={true}
                        // formControlName={docs[0]}
                        handleChange={(event) =>
                          setDocs3(event.target.files[0])
                        }
                        mode={1}
                      />
                    </div>
                  )}
                  <div className="sm:col-span-6 flex justify-start gap-16">
                    {file_paths[0] && (
                      <div className="relative">
                        <p className="text-xs text-green-900 -mb-2 mt-1">
                          {file_paths[0].proj_doc?.split("_")[1]}{" "}
                        </p>
                        <a
                          target="_blank"
                          href={url + "/uploads/" + file_paths[0].proj_doc}
                        >
                          {file_paths[0].proj_doc.split(".")[1] == "pdf" ? (
                            <FilePdfOutlined className="text-6xl my-7 text-red-600" />
                          ) : file_paths[0].proj_doc
                              .split(".")[1]
                              ?.includes("doc") ? (
                            <FileWordOutlined className="text-6xl my-7 text-blue-900" />
                          ) : file_paths[0].proj_doc
                              .split(".")[1]
                              ?.includes("xls") ||
                            file_paths[0].proj_doc
                              .split(".")[1]
                              ?.includes("csv") ? (
                            <FileExcelOutlined className="text-6xl my-7 text-green-800" />
                          ) : file_paths[0].proj_doc
                              .split(".")[1]
                              ?.includes("png") ||
                            file_paths[0].proj_doc
                              .split(".")[1]
                              ?.includes("jpg") ||
                            file_paths[0].proj_doc
                              .split(".")[1]
                              ?.includes("jpeg") ? (
                            <FileImageOutlined className="text-6xl my-7 text-yellow-500" />
                          ) : (
                            <FileTextOutlined className="text-6xl my-7 text-gray-600" />
                          )}
                        </a>
                        {/* <a target="_blank" href={url+'/uploads/'+file_paths[0].proj_doc}>
                  {file_paths[0].proj_doc?.split('').reverse().join('').split(".")[0]=='pdf'?<FilePdfOutlined className="text-6xl my-7 text-red-600"/>:file_paths[0].proj_doc?.split('').reverse().join('').split(".")[0]?.includes('doc')?<FileWordOutlined  className="text-6xl my-7 text-blue-900"/>:(file_paths[0].proj_doc?.split('').reverse().join('').split(".")[0]?.includes('xls')||file_paths[0].proj_doc?.split('').reverse().join('').split(".")[0]?.includes('csv'))? <FileExcelOutlined  className="text-6xl my-7 text-green-800"/>:<FileImageOutlined className="text-6xl my-7 text-yellow-500"/>}
                  
                  
                  </a> */}
                        <DeleteOutlined
                          className="text-red-800 absolute top-6 "
                          onClick={() => {
                            setDelId(0);
                            setFlag(4);
                            setVisible(true);
                          }}
                        />
                      </div>
                    )}
                    {file_paths[1] && (
                      <div className="relative">
                        <p className="text-xs text-green-900  -mb-2 mt-1">
                          {file_paths[1].proj_doc?.split("_")[1]}{" "}
                        </p>

                        <a
                          target="_blank"
                          href={url + "/uploads/" + file_paths[1].proj_doc}
                        >
                          {file_paths[1].proj_doc.split(".")[1] == "pdf" ? (
                            <FilePdfOutlined className="text-6xl my-7 text-red-600" />
                          ) : file_paths[1].proj_doc
                              .split(".")[1]
                              ?.includes("doc") ? (
                            <FileWordOutlined className="text-6xl my-7 text-blue-900" />
                          ) : file_paths[1].proj_doc
                              .split(".")[1]
                              ?.includes("xls") ||
                            file_paths[1].proj_doc
                              .split(".")[1]
                              ?.includes("csv") ? (
                            <FileExcelOutlined className="text-6xl my-7 text-green-800" />
                          ) : file_paths[1].proj_doc
                              .split(".")[1]
                              ?.includes("png") ||
                            file_paths[1].proj_doc
                              .split(".")[1]
                              ?.includes("jpg") ||
                            file_paths[1].proj_doc
                              .split(".")[1]
                              ?.includes("jpeg") ? (
                            <FileImageOutlined className="text-6xl my-7 text-yellow-500" />
                          ) : (
                            <FileTextOutlined className="text-6xl my-7 text-gray-600" />
                          )}
                        </a>

                        <DeleteOutlined
                          className="text-red-800 absolute top-6 "
                          onClick={() => {
                            setDelId(1);
                            setFlag(4);
                            setVisible(true);
                          }}
                        />
                      </div>
                    )}
                    {file_paths[2] && (
                      <div className="relative">
                        <p className="text-xs text-green-900  -mb-2 mt-1">
                          {file_paths[2].proj_doc?.split("_")[1]}{" "}
                        </p>

                        <a
                          target="_blank"
                          href={url + "/uploads/" + file_paths[2].proj_doc}
                        >
                          {file_paths[2].proj_doc.split(".")[1] == "pdf" ? (
                            <FilePdfOutlined className="text-6xl my-7 text-red-600" />
                          ) : file_paths[2].proj_doc
                              .split(".")[1]
                              ?.includes("doc") ? (
                            <FileWordOutlined className="text-6xl my-7 text-blue-900" />
                          ) : file_paths[2].proj_doc
                              .split(".")[1]
                              ?.includes("xls") ||
                            file_paths[2].proj_doc
                              .split(".")[1]
                              ?.includes("csv") ? (
                            <FileExcelOutlined className="text-6xl my-7 text-green-800" />
                          ) : file_paths[2].proj_doc
                              .split(".")[1]
                              ?.includes("png") ||
                            file_paths[2].proj_doc
                              .split(".")[1]
                              ?.includes("jpg") ||
                            file_paths[2].proj_doc
                              .split(".")[1]
                              ?.includes("jpeg") ? (
                            <FileImageOutlined className="text-6xl my-7 text-yellow-500" />
                          ) : (
                            <FileTextOutlined className="text-6xl my-7 text-gray-600" />
                          )}
                        </a>

                        <DeleteOutlined
                          className="text-red-800 absolute top-6 "
                          onClick={() => {
                            setDelId(2);
                            setFlag(4);
                            setVisible(true);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {/* </div> */}
                <div className="flex pt-4 justify-content-end">
                  {/* <button
                    disabled={checkLoad}
                     className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
                    iconPos="right"
                    onClick={() => {
                      onSubmitProject();
                    }}
                  >
                    {" "}
                    <span class="relative z-10">
                    Next
                    <ArrowRightOutlined className="ml-2" />
                    </span>
                    <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
                  </button> */}
                  <BtnGroupReuse flag={1} text={'Next'} icon={
                    <ArrowRightOutlined className="mr-2" />

                  }
                  disabled={checkLoad}
                  loading={loading}
                  onClick={() => {
                      onSubmitProject();
                    }}
                    />
                </div>
                </div>
                </BlockUI>
                {/* </form> */}
              </StepperPanel>
              <StepperPanel header="Client Details">
                <Spin
                  indicator={<LoadingOutlined spin />}
                  size="large"
                  className="text-green-900 dark:text-gray-400"
                  spinning={loading}
                >
                  <h2 className="font-bold text-2xl text-green-900 my-3">
                    Client Details
                  </h2>
                  <BlockUI template={
                              <div className='relative  w-full h-full 0 z-10'>
                                <span className='absolute top-1 right-1 font-bold italic text-gray-500'><LockFilled className='text-green-900 '/> Locked</span>
                                <span className='absolute bottom-1 right-1 font-bold italic text-gray-500'><UnlockFilled className='text-green-900 '/> Accessible to {data?.proj_manager_name}</span>
                              </div>
                            } blocked={blocked} className={'bg-red-500'}>
              <div className={blocked?'p-2':''}>
                  <div className="grid gap-4 sm:grid-cols-6 sm:gap-6">
                    <div className="sm:col-span-4">
                      {/* ============================== */}
                      {/* <TDInputTemplate
                        placeholder="Select client..."
                        type="text"
                        label="Client"
                        name="client_id"
                        formControlName={client_id}
                        handleChange={(text) => {
                          if (text.target.value != "Select client...") {
                            setClientID(text.target.value);
                            console.log(clientLocList, pocList);
                            handleChangeClient(text);
                          }
                        }}
                        data={client}
                        mode={2}
                        disabled={params.id > 0}
                      /> */}
                      {/* ============================================================ */}
                      <TDInputTemplate
                        placeholder="Select client..."
                        type="text"
                        label="Client"
                        name="client_id"
                        formControlName={client_id}
                        handleFocus={(e)=>op.current.show(e)}
                        handleChange={(text) => {
                          setClientID(text.target.value);
                          setEv(text)
                          console.log(clientLocList, pocList);
                          if (text.target.value.length) op.current.show(txt);
                          else {op.current.hide(txt);setCode()}
                          // handleChangeClient(text);
                        }}
                        data={client}
                        mode={1}
                        disabled={params.id > 0}
                      />
                      {/* {clientCode} */}
                      <OverlayPanel
                        ref={op}
                        // style={{marginTop:'420px',marginLeft:'325px'}}
                        className="mt-84 w-[46%] border-2 bg-gray-50 border-[#C4F1BE]"
                      >
                        <span className="text-xs text-green-900 italic">
                          Search results for: "{client_id}"
                        </span>
                        <ul class=" divide-y max-h-32 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                          {client.filter((e) =>
                            e.name
                              ?.toLowerCase()
                              .includes(client_id?.toLowerCase())
                          ).length > 0 &&
                            client
                              .filter((e) => e.name?.toLowerCase().includes(client_id.toLowerCase()))
                              ?.map((lst) => (
                                <li
                                  onClick={(e) => {
                                    op.current.hide(e);
                                    setClientID(lst.name);
                                    setCode(lst.code);
                                    handleChangeClient(lst.code)
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
                          {client.filter((e) =>
                            e.name
                              ?.toLowerCase()
                              .includes(client_id.toLowerCase())
                          ).length == 0 && <Empty />}
                        </ul>
                      </OverlayPanel>
                      <div className="flex justify-between items-center">
                      {!clientCode && <VError title={"Client is required!"} />}

                        {clientCode && (
                          <Viewdetails
                            click={() => {
                              setFlag(5);
                              setVisible(true);
                            }}
                          />
                        )}
                        <a
                          className="my-2"
                          onClick={() => {
                            setMode(4);
                            setOpen(true);
                          }}
                        >
                          {/* <Tag color="#4FB477">
                            {" "}
                            <PlusCircleOutlined /> Not in list?
                          </Tag> */}
                          <InfoTags bgCol={'text-white hover:scale-110 active:scale-90'} icon={ <PlusCircleOutlined />} text="Not in list?" color="#4FB477"/>
                        </a>
                      </div>
                    </div>
                    <div className="sm:col-span-2 flex justify-center">
                      {/* {client_id &&   <button className=" disabled:bg-gray-400 
                  disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600" onClick={()=>{setFlag(5);setVisible(true)}}>
                    View client Details

                   </button>} */}
                    </div>
                    <>
                      {" "}
                      <div className="sm:col-span-2">
                        <TDInputTemplate
                          placeholder="Select client address/location"
                          type="text"
                          label="Client address/Location"
                          name="client_loc"
                          formControlName={client_loc}
                          handleChange={(txt) => {
                            if (txt.target.value != "Select client address/location") {
                              setClientLoc(txt.target.value);
                              console.log(
                                clientLocList,
                                clientLocList?.filter(
                                  (e) => e.c_loc == txt.target.value
                                )
                              );
                              setGST(
                                clientLocList?.filter(
                                  (e) => e.c_loc == txt.target.value
                                )[0].c_gst
                              );
                              setPAN(
                                clientLocList?.filter(
                                  (e) => e.c_loc == txt.target.value
                                )[0].c_pan
                              );
                            }
                          }}
                          data={locList}
                          mode={2}
                          // disabled={params.id > 0}
                        />
                        {!client_loc && (
                          <VError title={"Client address/location is required!"} />
                        )}
                      </div>
                      <div className="col-span-2">
                        <TDInputTemplate
                          placeholder="Type GST"
                          type="text"
                          label="GST"
                          name="p_gst"
                          formControlName={p_gst}
                          disabled
                          mode={1}
                        />
                      </div>
                      <div className="col-span-2">
                        <TDInputTemplate
                          placeholder="Type PAN"
                          type="text"
                          label="PAN"
                          name="p_pan"
                          formControlName={p_pan}
                          mode={1}
                          disabled
                        />
                      </div>
                    </>

                    <div className="sm:col-span-6">
                      <TDInputTemplate
                        placeholder="Type description..."
                        type="text"
                        label="Project Description"
                        name="proj_des"
                        formControlName={proj_des}
                        handleChange={(txt) => setDes(txt.target.value)}
                        mode={3}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <TDInputTemplate
                        placeholder="Type end user..."
                        type="text"
                        label="End User"
                        name="end_user"
                        formControlName={end_user}
                        handleChange={(txt) => setEndUser(txt.target.value)}
                        mode={1}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <TDInputTemplate
                        placeholder="Type consultant..."
                        type="text"
                        label="Consultant"
                        name="proj_consultant"
                        formControlName={proj_consultant}
                        handleChange={(txt) => setConsultant(txt.target.value)}
                        mode={1}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <TDInputTemplate
                        placeholder="Type EPC..."
                        type="text"
                        label="EPC Contractor"
                        name="epc_con"
                        formControlName={epc_con}
                        handleChange={(txt) => setEPC(txt.target.value)}
                        mode={1}
                      />
                    </div>
                  </div>
                  {pocSet.map((input, index) => (
                    <>
                      <div
                        key={index}
                        className="flex-col gap-3 justify-between mt-12"
                      >
                        <div className="flex gap-2 justify-end mt-4 -mb-5">
                          {pocSet?.length > 1 && (
                            <Button
                              className="rounded-full text-white bg-red-800 border-red-800"
                              onClick={() => removeDt(index)}
                              icon={<MinusOutlined />}
                            ></Button>
                          )}

                          <Button
                            className="rounded-full bg-green-900 text-white"
                            onClick={() => addDt()}
                            icon={<PlusOutlined />}
                          ></Button>
                          {pocSet[index]?.poc_name && (
                            <Button
                              className="rounded-full bg-blue-800 text-white"
                              onClick={() => {
                                console.log(pocSet[index]);
                                setFlag(6);
                                setInfo(
                                  pocList.filter(
                                    (e) => e.sl_no == +pocSet[index]?.poc_name
                                  )[0]
                                );
                                setVisible(true);
                              }}
                              icon={<InfoOutlined />}
                            ></Button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-5 mb-5">
                          <div className="col-span-1">
                            <TDInputTemplate
                              placeholder="Choose name"
                              formControlName={input?.poc_name}
                              handleChange={(event) => {
                                if (event.target.value != "Choose name")
                                  handleDtChange(index, event);
                              }}
                              label="Contact Person"
                              name="poc_name"
                              data={nameList}
                              mode={2}
                            />
                          </div>
                          <>
                            <div className="sm:col-span-1 hidden">
                              <TDInputTemplate
                                type="text"
                                label="Email"
                                name="poc_email"
                                formControlName={input?.poc_email}
                                mode={1}
                                disabled
                              />
                            </div>
                            <div className="sm:col-span-1">
                              <TDInputTemplate
                                type="text"
                                label="POC Designation"
                                name="poc_designation"
                                formControlName={input?.poc_designation}
                                mode={1}
                                disabled
                              />
                            </div>
                            <div className="sm:col-span-1">
                              <TDInputTemplate
                                type="text"
                                label="POC Primary Phone No."
                                name="poc_ph_1"
                                formControlName={input?.poc_ph_1}
                                mode={1}
                                disabled
                              />
                              {/* {!isEdited && (
                                <VError
                                  title={"Contact information is required"}
                                />
                              )} */}
                            </div>
                          </>
                        </div>
                      </div>
                    </>
                  ))}
                  {/* {pm_code} */}
                  <div className="sm:col-span-2">
                    <TDInputTemplate
                      placeholder="NGAPL Project Manager..."
                      type="text"
                      label="NGAPL Project Manager"
                      name="assgn_pm"
                      formControlName={assgn_pm}
                      handleFocus={(e)=>op1.current.show(e)}

                      handleChange={(txt) => {setAssign(txt.target.value);
                        if (txt.target.value.length>0) op1.current.show(txt);
                        else {op1.current.hide(txt);setPmCode()}
                      }}
                      data={pmList}
                      mode={1}
                      disabled={params.id > 0}
                    />
                     <OverlayPanel
                        ref={op1}
                        // style={{marginTop:'420px',marginLeft:'325px'}}
                        className=" w-[69.8%] border-2 bg-gray-50 border-[#C4F1BE]"
                      >
                        <span className="text-xs text-green-900 italic">
                          Search results for: "{assgn_pm}"
                        </span>
                        <ul class=" divide-y max-h-32 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
                          {pmList.filter((e) =>
                            e.name?.toLowerCase().includes(assgn_pm?.toLowerCase())
                          ).length > 0 &&
                          pmList
                              .filter((e) => e.name?.toLowerCase().includes(assgn_pm?.toLowerCase()))
                              ?.map((lst) => (
                                <li
                                  onClick={(e) => {
                                    op1.current.hide(e);
                                    setAssign(lst.name);
                                    setPmCode(lst.code);
                                    // handleChangeClient(lst.code)
                                  }}
                                  class="pb-3 cursor-pointer  hover:bg-[#C4F1BE] group active:bg-green-900 rounded-md hover:duration-300 sm:py-1.5"
                                >
                                  <div class="flex items-center rtl:space-x-reverse">
                                    <div class="flex-1 min-w-0">
                                      <p class="text-sm  p-0.5 w-full text-green-900 group-active:text-white truncate dark:text-white">
                                        {lst.name}
                                      </p>
                                    </div>
                                  </div>
                                  {/* <hr className="text-green-900 border-gray-300  bg-green-900"/> */}
                                </li>
                              ))}
                          {pmList.filter((e) =>
                            e.name?.toLowerCase().includes(assgn_pm?.toLowerCase())
                          ).length == 0 && <Empty />}
                        </ul>
                      </OverlayPanel>
                    {!pm_code && (
                      <VError title={"Project manager is required!"} />
                    )}
                  </div>
                  {params.id > 0 && <AuditTrail data={data} />}
                  {/* {isEdited} */}
                  <div className="flex pt-4 justify-between gap-2">
                    {/* <button

                     className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
                      onClick={() => stepperRef.current.prevCallback()}
                    >
                      <span class="relative z-10">
                      <ArrowLeftOutlined className="mr-2" />
                      Back
                      </span>
                      <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
                    </button> */}
                    <BtnGroupReuse loading={loading} flag={2} icon={<ArrowLeftOutlined className="mr-2" />} onClick={() => stepperRef.current.prevCallback()} text={'Back'}/>
                    {/* <button
                     className="relative ml-3 disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
                      onClick={() => onSubmitClient()}
                      disabled={!pm_code}
                    > 
                    <span class="relative z-10">
                      <SaveOutlined className="mr-1" />
                      Submit
                      </span>
                      <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
                    </button> */}
                    <BtnGroupReuse loading={loading} onClick={() => onSubmitClient()} disabled={!pm_code} icon={<SaveOutlined className="mr-2" />} flag={1} text={'Submit'}/>
                  </div>
                  </div>
                  </BlockUI>
                </Spin>
              </StepperPanel>
            </Stepper>
          </div>
        </Spin>
      </div>
       <div ref={contentRef}  style={{
                display: !isPrinting ? "block" : "none",
              }} >
                  <div className="grid  gap-4 p-4 sm:grid-cols-2 sm:gap-6">
                  <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
                    <PrintHeader/>
                  </div>
                  <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
                    <h2 className="bg-green-500 font-bold text-lg p-3 text-white">Project Details</h2>
                    <table className="border-collapse border border-gray-300 w-full">
              <tbody>
               
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Project ID
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{proj_id}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Project 
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{projnm}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Type 
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{proj_type=='U'?'Supply Order':'Service Order'}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Order No. 
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{order_id}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Order Date 
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{order_dt}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Project Basic Order Value 
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{proj_ordr_val} (in {projunit=='I'?'INR':projunit=='U'?'USD':'Euro'})</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Price Basis 
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{prc_basis=='F'?'FOR':'Ex-Works'}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                     Project End Delivery Date 
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{proj_end_delvry_dt}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                     Project End Delivery Date 
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{proj_end_delvry_dt}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                     LD Clause
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{ld_cls=='N'?'':ld_cls_dtl}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                     Warranty
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{warranty_check}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                     Supervision of Erection & Commissioning
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{erctn_res=='N'?'':erctn_res_val}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Created By
                    </td>
                    <td className="border border-gray-300 p-2 text-gray-600 ">{data?.created_by}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Created At
                    </td>
                    <td className="border border-gray-300 text-gray-600 p-2">{data?.created_at}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Modified By
                    </td>
                    <td className="border border-gray-300 text-gray-600 p-2">{data?.modified_by}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Modified At
                    </td>
                    <td className="border border-gray-300 text-gray-600 p-2">{data?.modified_at}</td>
                  </tr>
              </tbody>
            </table>
            <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
                    <h2 className="bg-green-500 font-bold text-lg p-3 text-white">Client Details</h2>
                    <table className="border-collapse border border-gray-300 w-full">
              <tbody>
               
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Client
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{client_id}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Location/Address
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{client_loc}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      GST
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{p_gst}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      PAN
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{ p_pan}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Project Description
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{ proj_des}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      End User
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{ end_user}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      Consultant
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{ proj_consultant}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      EPC Contractor
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{ epc_con}</td>
                  </tr>
                  <tr  className="border border-gray-300">
                    <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                      NGAPL Project Manager
                    </td>
                    <td className="border text-gray-600 border-gray-300 p-2">{ assgn_pm}</td>
                  </tr>
                  </tbody>
                  </table>
                  <h2 className="bg-green-500 font-bold text-lg p-3 mt-2 text-white">Contact Person Details</h2>
      
      <table className="border-collapse border border-gray-500 w-full text-center">
      <thead>
      <tr className="text-green-500 font-bold text-center">
        
        <th  className="border border-gray-300 p-2 capitalize">
          Contact Person
        </th>
       
        <th  className="border border-gray-300 p-2 capitalize">
          Phone
        </th>
       
        <th  className="border border-gray-300 p-2 capitalize">
          Email
        </th>
        
      </tr>
      </thead>
      <tbody className="text-gray-600 text-xs">
      {pocList.map(item=><tr>
       
        <td className="border flex flex-col justify-center items-center border-gray-300 p-2">
          {item.poc_name}
        {/* {pocList.filter(                                   (e) => e.sl_no == +pocSet[index]?.poc_name
                                  )[0]
} */}
         
        </td>
       
        <td className="border border-gray-300 p-2">
          {item.poc_designation}
        </td>
       
        <td className="border border-gray-300 p-2">
          {item.poc_ph_1}
        </td>
       
      
      </tr>)}
      </tbody>
      </table>
      
                  </div>
                </div>
                  </div>
                  </div>
      <DialogBox
        visible={visible}
        flag={flag}
        data={
          flag == 5
            ? { poc: pocList, loc: clientLocList, info: clientInfo }
            : { info: info }
        }
        onPress={() => setVisible(false)}
        onDelete={() => deleteDoc()}
      />
      <DrawerComp open={open} flag={mode} onClose={() => onClose()} />
    </section>
  );
}

export default ProjectForm;
