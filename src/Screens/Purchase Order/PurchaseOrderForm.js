import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import BasicDetails from "../../Components/Steps/BasicDetails";
import Delivery from "../../Components/Steps/Delivery";
import More from "../../Components/Steps/More";
import TermsConditions from "../../Components/Steps/TermsConditions";
import ProductDetails from "../../Components/Steps/ProductDetails";
import HeadingTemplate from "../../Components/HeadingTemplate";
import Notes from "../../Components/Steps/Notes";
import { Badge, Card, Space } from "antd";
// import Tooltip from '@mui/material/Tooltip';
import { Popover, Tooltip } from "antd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  ClusterOutlined,
  EyeOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  InfoOutlined,
  LoadingOutlined,
  LockOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
  TruckOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Button, FloatButton } from "antd";
import PaymentTerms from "../../Components/Steps/PaymentTerms";
import axios from "axios";
import { url } from "../../Address/BaseUrl";
import { Spin } from "antd";
import { Message } from "../../Components/Message";
import DialogBox from "../../Components/DialogBox";
import { Tag } from "antd";
import { BlockUI } from "primereact/blockui";
import { SaveOutlined } from "@mui/icons-material";
import PoLogs from "../../Components/Steps/PoLogs";
import { motion } from "framer-motion";

function PurchaseOrderForm() {
  const stepperRef = useRef(null);
  const params = useParams();
  console.log(params, "params");
  localStorage.setItem("id", params.id);
  var act = 0;
  const det = JSON.parse(localStorage.getItem('perm'))

  const [floatShow, setFloatShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [delivery, setDeliveryAdd] = useState("");
  const [order_type, setOrderType] = useState("");
  const [delFlag,setDelfFlag] = useState(0)
  const [b_order_dt, setBOrderDt] = useState("");
  const [proj_name, setProjectName] = useState("");
  const [vendor_name, setVendorName] = useState("");
  const [vend_ref, setVendRef] = useState("");
  const [po_issue_date, setPoIssueDate] = useState("");
  const [order_id, setOrderId] = useState("");
  const [itemList, setItemList] = useState([]);
  const [termList, setTermList] = useState([]);
  const [notes, setNotes] = useState("");
  const [activeStep, setActiveStep] = useState(null);
  const [insp_flag, setInspFlag] = useState("N");
  const [insp, setInsp] = useState("");
  const [drawing_flag, setDrawingFlag] = useState("N");
  const [drawing, setDrawing] = useState("");
  const [mdcc_flag, setMdccFlag] = useState("N");
  const [mdcc, setMdcc] = useState("");
  const [drawingDate, setDrawingDate] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [dispatch_dt, setdispatchdt] = useState(false);
  const [comm_dt, setcommdt] = useState(false);
  const [price_basis_flag, setPriceBasisFlag] = useState("");
  const [price_basis_desc, setPriceBasisDesc] = useState("");
  const [packing_forwarding, setPackingForwarding] = useState("");
  const [packing_forwardingExtra, setPackingForwardingExtra] = useState("");
  const [packing_forwardingExtraVal, setPackingForwardingExtraVal] =
    useState("");
  const [pur_req,setPurReq] = useState(0)
  const [pf_cgst, setpfcgst] = useState("");
  const [pf_sgst, setpfsgst] = useState("");
  const [pf_igst, setpfigst] = useState("");
  const [pf_currency, setpfcurrency] = useState("");
  const [freight_insurance, setFreightInsurance] = useState("");
  const [freight_insurance_val, setFreightInsuranceVal] = useState("");
  var pur = ''
  const [freight_extra, setFreightExtra] = useState("");
  const [freight_extra_val, setFreightExtraVal] = useState("");
  const [freight_cgst, setfreightcgst] = useState("");
  const [freight_sgst, setfreightsgst] = useState("");
  const [freight_igst, setfreightigst] = useState("");
  const [freight_currency, setfreightcurrency] = useState("");

  const [ins_extra, setinsExtra] = useState("");
  const [ins_extra_val, setinsExtraVal] = useState("");
  const [ins_cgst, setinscgst] = useState("");
  const [ins_sgst, setinssgst] = useState("");
  const [ins_igst, setinsigst] = useState("");
  const [ins_currency, setinscurrency] = useState("");

  const [insurance, setInsurance] = useState("");
  const [insurance_val, setInsuranceVal] = useState("");
  const [test_certificate, setTestCertificate] = useState("");
  const [test_certificate_desc, setTestCertificateDesc] = useState("");
  const [ld_applicable_date, setLDApplicableDate] = useState("");
  const [others_ld, setOthersLd] = useState("");
  const [ld_applied_on, setLDAppliedOn] = useState("");
  const [others_applied, setOthersApplied] = useState("");
  const [ld_value, setLDValue] = useState("");
  const [po_min_value, setPOMinValue] = useState("");
  const [warranty_guarantee_flag, setWarrantyFlag] = useState("");
  const [duration, setDuration] = useState("");
  const [duration_val, setDurationVal] = useState("");
  const [duration_val_to, setDurationValTo] = useState("");
  const [om_manual_flag, setOMFlag] = useState("");
  const [om_manual_desc, setOMDesc] = useState("");
  const [oi_flag, setOIFlag] = useState("");
  const [oi_desc, setOIDesc] = useState("");
  const [ware_house_flag, setWareHouse] = useState("");
  const [packing_type, setPackingType] = useState("");
  const [packing_val, setPackingVal] = useState("");
  const [manufacture_clearance, setManufactureClearance] = useState("");
  const [manufacture_clearance_desc, setManufactureDesc] = useState("");
  const [comment, setComment] = useState("");
  const [clickFlag, setClickFlag] = useState("P");
  const [po_no, setPoNo] = useState("");
  const [count, setCount] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [amendnote, setAmendNote] = useState("");

  const [mdcc_doc, setMdccDoc] = useState();
  const [insp_doc, setInspDoc] = useState();
  const [draw_doc, setDrawDoc] = useState();
  const navigate = useNavigate();
  
  const addcomment = () => {
    if (localStorage.getItem("po_comments")) {
      setLoading(true);
      axios
        .post(url + "/api/addpocomments", {
          id: +params.id,
          comments: localStorage.getItem("po_comments"),
          user: localStorage.getItem("email"),
        })
        .then((res) => {
          console.log(res);
          if (res.data.suc > 0) {
            setCount((prev) => prev + 1);
            Message("success", res?.data?.msg);
            axios
              .post(url + "/api/getpocomments", { id: +params.id })
              .then((resCom) => {
                // setTimeline([])
                console.log(resCom);
                for (let i = 0; i < resCom?.data?.msg?.length; i++) {
                  timeline.push({
                    label: resCom?.data?.msg[i].created_at
                      .toString()
                      .split("T")
                      .join(" "),
                    children:
                      resCom?.data?.msg[i].proj_remarks +
                      " by " +
                      resCom?.data?.msg[i].created_by.toString(),
                    // status:resCom?.data?.msg[i].created_at.toString().split('T').join(' '),
                    // date:resCom?.data?.msg[i].proj_remarks+' by '+resCom?.data?.msg[i].created_by.toString()
                  });
                }
                setTimeline(timeline);
                console.log(timeline);
              });
          }
        });
      setLoading(false);
    }
  };

  const approvepo = () => {
    setLoading(true);
    axios
      .post(url + "/api/approvepo", {
        id: +params.id,
        status: localStorage.getItem("po_status"),
        user: localStorage.getItem("email"),
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        if (res?.data?.suc > 0) {
          Message("success", res?.data?.msg);
          navigate(-1);
        } else {
          Message("error", res?.data?.msg);
        }
      })
      .catch((err) => {
        Message("error", err);
        navigate("/error" + "/" + err.code + "/" + err.message);
      });
  };
  const submitPo = () => {
    // for(let i of JSON.parse(localStorage.getItem('pur_req'))){
      pur=JSON.parse(localStorage.getItem('pur_req')).join(',')
    // }
    axios
      .post(url + "/api/addpo", {
        sl_no: +localStorage.getItem("id"),
        po_status: localStorage.getItem("po_status"),
        po_issue_date: localStorage.getItem("po_issue_date"),
        po_id: localStorage.getItem("order_id"),
        po_date: localStorage.getItem("order_date"),
        po_type: localStorage.getItem("order_type"),
        po_no: localStorage.getItem("po_no"),
        project_id: localStorage.getItem("proj_name"),
        vendor_id: localStorage.getItem("vendor_name"),
        vend_ref: localStorage.getItem("vend_ref"),
        // pur_req: localStorage.getItem("pur_req"),
        pur_req:pur,
        item_dtl: JSON.parse(localStorage.getItem("itemList")),
        price_basis: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).price_basis_flag
          : "",
        price_basis_desc: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).price_basis_desc
          : "",
        packing_fwd_val: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).packing_forwarding_val
          : "",
        packing_fwd_extra: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(
              JSON.parse(localStorage.getItem("terms")).packing_forwarding_extra
            )
          : 0.0,
        packing_fwd_extra_val: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(
              JSON.parse(localStorage.getItem("terms"))
                .packing_forwarding_extra_val
            )
          : 0.0,
        pf_currency: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).pf_currency
          : "",
        pf_cgst: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(JSON.parse(localStorage.getItem("terms")).pf_cgst)
          : 0.0,
        pf_sgst: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(JSON.parse(localStorage.getItem("terms")).pf_sgst)
          : 0.0,
        pf_igst: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(JSON.parse(localStorage.getItem("terms")).pf_igst)
          : 0.0,
        freight_ins: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).freight_insurance
          : "",
        freight_ins_val: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).freight_insurance_val
          : "",
        //
        freight_extra: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(JSON.parse(localStorage.getItem("terms")).freight_extra)
          : 0.0,
        freight_extra_val: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(
              JSON.parse(localStorage.getItem("terms")).freight_extra_val
            )
          : 0.0,
        freight_cgst: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(JSON.parse(localStorage.getItem("terms")).freight_cgst)
          : 0.0,
        freight_sgst: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(JSON.parse(localStorage.getItem("terms")).freight_sgst)
          : 0.0,
        freight_igst: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(JSON.parse(localStorage.getItem("terms")).freight_igst)
          : 0.0,
        freight_currency: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).freight_currency
          : "",
        //
        ins: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).insurance
          : "",
        ins_val: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).insurance_val
          : "",

        ins_extra: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(JSON.parse(localStorage.getItem("terms")).ins_extra)
          : 0.0,
        ins_extra_val: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(JSON.parse(localStorage.getItem("terms")).ins_extra_val)
          : 0.0,
        ins_cgst: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(JSON.parse(localStorage.getItem("terms")).ins_cgst)
          : 0.0,
        ins_sgst: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(JSON.parse(localStorage.getItem("terms")).ins_sgst)
          : 0.0,
        ins_igst: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(JSON.parse(localStorage.getItem("terms")).ins_igst)
          : 0.0,
        ins_currency: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).ins_currency
          : "",
        //
        test_certificate: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).test_certificate
          : "",
        test_certificate_desc: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).test_certificate_desc
          : "",
        ld_date: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).ld_applicable_date
          : "",
        ld_date_desc: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).others_ld
          : "",
        ld_val: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).ld_applied_on
          : "",
        ld_val_desc: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).others_applied
          : "",
        ld_val_per: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(JSON.parse(localStorage.getItem("terms")).ld_value)
            ? parseFloat(JSON.parse(localStorage.getItem("terms")).ld_value)
            : 0.0
          : 0.0,
        min_per: JSON.parse(localStorage.getItem("terms"))
          ? parseFloat(JSON.parse(localStorage.getItem("terms")).po_min_value)
            ? parseFloat(JSON.parse(localStorage.getItem("terms")).po_min_value)
            : 0.0
          : 0.0,
        warranty_guaranty: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).warranty_guarantee_flag
          : "",
        dispatch_dt: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).dispatch_dt == true
            ? "Y"
            : "N"
          : "N",
        comm_dt: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).comm_dt == true
            ? "Y"
            : "N"
          : "N",
        duration: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).duration
          : "",
        duration_value: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).duration_val
          : "",
          duration_value_to: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).duration_val_to
          : "",
        o_m_manual: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).om_manual_flag
          : "",
        o_m_desc: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).om_manual_desc
          : "",
        operation_installation: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).oi_flag
          : "",
        operation_installation_desc: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).oi_desc
          : "",
        packing_type: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).packing_type
          : "",
        packing_val: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).packing_val
          : "",
        manufacture_clearance: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).manufacture_clearance
          : "",
        manufacture_clearance_desc: JSON.parse(localStorage.getItem("terms"))
          ? JSON.parse(localStorage.getItem("terms")).manufacture_clearance_desc
          : "",
        payment_terms: JSON.parse(localStorage.getItem("termList")),
        bill_to:
          "NextGen Automation Pvt Ltd Unit - 102, 1st Floor, PS PACE 1/1A, Mahendra Roy Lane Kolkata 700046",
        ship_to: localStorage.getItem("ship_to"),
        warehouse_flag: localStorage.getItem("ware_house_flag")
          ? localStorage.getItem("ware_house_flag")
          : "N",
        del_flag: localStorage.getItem('delFlag')||'',
        po_notes: localStorage.getItem("notes"),
        mdcc: localStorage.getItem("mdcc_flag"),
        mdcc_scope: localStorage.getItem("mdcc"),
        inspection: localStorage.getItem("insp_flag"),
        inspection_scope: localStorage.getItem("insp"),
        draw: localStorage.getItem("drawing_flag"),
        draw_scope: localStorage.getItem("drawing"),
        draw_period: localStorage.getItem("dt"),
        final_save:
          localStorage.getItem("po_status") == "U" &&
          localStorage.getItem("po_no") == "null"
            ? 1
            : 0,
        fresh_flag: params.flag == "F" ? "Y" : "N",
        user: localStorage.getItem("email"),
      })
      .then((res) => {
        console.log(res);
        if (res.data.suc > 0) {
          const formData = new FormData();
          formData.append("user", localStorage.getItem("email"));
          
          if (mdcc_doc) formData.append("mdcc_doc", mdcc_doc);
          if (insp_doc) formData.append("insp_doc", insp_doc);
          if (draw_doc) formData.append("draw_doc", draw_doc);
          // if (params.id == 0) handleReset();
          console.log("====================================");
          console.log(res.data.po_sl_no);
          console.log(mdcc_doc, insp_doc, draw_doc);
          console.log("====================================");
          formData.append("po_sl_no", res.data.po_sl_no);
          axios.post(url + "/api/add_po_more_img", formData).then((resImg) => {
            if (resImg?.data?.suc > 0) {
              setLoading(false);
              Message("success", res.data.msg);
              navigate(-1);
            } else {
              Message("error", res.data.msg);
              setLoading(false);
            }
          });

          // setTimeout(navigate(-1),2500)
        } else {
          Message("error", res.data.msg);
          setLoading(false);
        }
        console.log(res);
      })
      .catch((err) => navigate("/error" + "/" + err.code + "/" + err.message));
  };
  useEffect(() => {
  
    if (+params.id == 0) localStorage.setItem("po_status", "P");
    if (params.flag == "F") {
      localStorage.setItem("po_no", "null");
      setPoNo(null);
    }
    setClickFlag(localStorage.getItem("po_status"));
    // },[localStorage.getItem('po_status')])
  }, []);
  useEffect(() => {
    setFloatShow(
      (localStorage.getItem("po_status") == "P" ||
        localStorage.getItem("po_status") == "U") &&
        (localStorage.getItem("order_date") ||
          localStorage.getItem("vendor_name"))
        ? true
        : false
    );
  }, [localStorage.getItem("order_date"), localStorage.getItem("vendor_name")]);

  useEffect(() => {
    if (+params.id > 0) {
      axios
        .post(url + "/api/getpo", { id: +params.id })
        .then((res) => {
          console.log(res);
          localStorage.setItem("id", params.id);
          localStorage.setItem("order_id", res?.data?.msg?.po_id);
          localStorage.setItem("order_date", res?.data?.msg?.po_date);
          localStorage.setItem("order_type", res?.data?.msg?.type);
          localStorage.setItem("proj_name", res?.data?.msg?.project_id);
          localStorage.setItem("vendor_name", res?.data?.msg?.vendor_id);
          localStorage.setItem("vend_ref", res?.data?.msg?.vend_ref);
          localStorage.setItem("po_status", res?.data?.msg?.po_status);
          localStorage.setItem("po_issue_date", res?.data?.msg?.po_issue_date);
          localStorage.setItem("po_no", res?.data?.msg?.po_no);
          localStorage.setItem("amend_note", res?.data?.msg?.amend_note);
          localStorage.setItem("amend_flag", res?.data?.msg?.amend_flag);
          localStorage.setItem("pur_req", JSON.stringify(res?.data?.msg?.pur_req.split(',')));
          setBlocked(
            localStorage.getItem("amend_flag") == "Y" &&
              localStorage.getItem("amend_note") == "null"
              ? true
              : false
          );
          console.log("type   ", typeof localStorage.getItem("po_no"));
          console.log(localStorage.getItem("amend_note"), "note");
          setClickFlag(res?.data?.msg?.po_status);
          setBOrderDt(res?.data?.msg?.po_date);
          setOrderType(res?.data?.msg?.type);
          setOrderId(res?.data?.msg?.po_id);
          setProjectName(res?.data?.msg?.project_id);
          setVendorName(res?.data?.msg?.vendor_id);
          setVendRef(res?.data?.msg?.vend_ref);
          setPoIssueDate(res?.data?.msg?.po_issue_date);
          setPoNo(res?.data?.msg?.po_no);
          setPurReq(res?.data?.msg?.pur_req.split(','))
          axios
            .post(url + "/api/getpoitem", { id: +params.id })
            .then((resItem) => {
              console.log(resItem);
              for (let i = 0; i < resItem?.data?.msg?.length; i++) {
                itemList.push({
                  sl_no: resItem?.data?.msg[i].sl_no,
                  item_name: resItem?.data?.msg[i].item_id,
                  qty: resItem?.data?.msg[i].quantity,
                  rate: resItem?.data?.msg[i].item_rt,
                  unit: resItem?.data?.msg[i].unit_id,
                  disc: resItem?.data?.msg[i].discount,
                  disc_prtg: resItem?.data?.msg[i].discount_percent,
                  SGST: resItem?.data?.msg[i].sgst_id,
                  CGST: resItem?.data?.msg[i].cgst_id,
                  IGST: resItem?.data?.msg[i].igst_id,
                  unit_price:
                    resItem?.data?.msg[i].item_rt -
                    resItem?.data?.msg[i].discount,
                  delivery_date: resItem?.data?.msg[i].delivery_dt, //
                  delivery_to: resItem?.data?.msg[i].delivery_to, //
                  currency: resItem?.data?.msg[i].currency,
                  total: resItem?.data?.msg[i].cgst_id
                    ? ((resItem?.data?.msg[i].item_rt -
                        resItem?.data?.msg[i].discount) *
                        resItem?.data?.msg[i].quantity *
                        resItem?.data?.msg[i].cgst_id) /
                        100 +
                      ((resItem?.data?.msg[i].item_rt -
                        resItem?.data?.msg[i].discount) *
                        resItem?.data?.msg[i].quantity *
                        resItem?.data?.msg[i].sgst_id) /
                        100 +
                      (resItem?.data?.msg[i].item_rt -
                        resItem?.data?.msg[i].discount) *
                        resItem?.data?.msg[i].quantity
                    : ((resItem?.data?.msg[i].item_rt -
                        resItem?.data?.msg[i].discount) *
                        resItem?.data?.msg[i].quantity *
                        resItem?.data?.msg[i].igst_id) /
                        100 +
                      (resItem?.data?.msg[i].item_rt -
                        resItem?.data?.msg[i].discount) *
                        resItem?.data?.msg[i].quantity,
                });
              }
              setItemList(itemList);
              localStorage.setItem("itemList", JSON.stringify(itemList));
              axios
                .post(url + "/api/getpoterms", { id: +params.id })
                .then((resTerm) => {
                  console.log(resTerm);
                  setPriceBasisFlag(resTerm?.data?.msg[0]?.price_basis);
                  setPriceBasisDesc(resTerm?.data?.msg[0]?.price_basis_desc);
                  setPackingForwarding(resTerm?.data?.msg[0]?.packing_fwd_val);
                  setPackingForwardingExtra(
                    resTerm?.data?.msg[0]?.packing_fwd_extra
                  );
                  setPackingForwardingExtraVal(
                    resTerm?.data?.msg[0]?.packing_fwd_extra_val
                  );
                  setpfcgst(resTerm?.data?.msg[0]?.pf_cgst);
                  setpfsgst(resTerm?.data?.msg[0]?.pf_sgst);
                  setpfigst(resTerm?.data?.msg[0]?.pf_igst);
                  setpfcurrency(resTerm?.data?.msg[0]?.pf_currency);
                  setFreightInsurance(resTerm?.data?.msg[0]?.freight_ins);
                  setFreightInsuranceVal(
                    resTerm?.data?.msg[0]?.freight_ins_val
                  );
                  setFreightExtra(resTerm?.data?.msg[0]?.freight_extra);
                  setFreightExtraVal(resTerm?.data?.msg[0]?.freight_extra_val);
                  setfreightcgst(resTerm?.data?.msg[0]?.freight_cgst);
                  setfreightsgst(resTerm?.data?.msg[0]?.freight_sgst);
                  setfreightigst(resTerm?.data?.msg[0]?.freight_igst);
                  setfreightcurrency(resTerm?.data?.msg[0]?.freight_currency);
                  setInsurance(resTerm?.data?.msg[0]?.ins);
                  setInsuranceVal(resTerm?.data?.msg[0]?.ins_val);
                  setinsExtra(resTerm?.data?.msg[0]?.ins_extra);
                  setinsExtraVal(resTerm?.data?.msg[0]?.ins_extra_val);
                  setinscgst(resTerm?.data?.msg[0]?.ins_cgst);
                  setinssgst(resTerm?.data?.msg[0]?.ins_sgst);
                  setinsigst(resTerm?.data?.msg[0]?.ins_igst);
                  setinscurrency(resTerm?.data?.msg[0]?.ins_currency);
                  setTestCertificate(resTerm?.data?.msg[0]?.test_certificate);
                  setTestCertificateDesc(
                    resTerm?.data?.msg[0]?.test_certificate_desc
                  );
                  setLDApplicableDate(resTerm?.data?.msg[0]?.ld_date);
                  setOthersLd(resTerm?.data?.msg[0]?.ld_date_desc);
                  setLDAppliedOn(resTerm?.data?.msg[0]?.ld_val);
                  setOthersApplied(resTerm?.data?.msg[0]?.ld_val_desc);
                  setLDValue(resTerm?.data?.msg[0]?.ld_val_per);
                  setPOMinValue(resTerm?.data?.msg[0]?.min_per);
                  setWarrantyFlag(resTerm?.data?.msg[0]?.warranty_guarantee);
                  setDuration(resTerm?.data?.msg[0]?.duration);
                  setDurationValTo(resTerm?.data?.msg[0]?.duration_value_to);
                  setDurationVal(resTerm?.data?.msg[0]?.duration_value);
                  setOMFlag(resTerm?.data?.msg[0]?.o_m_manual);
                  setOMDesc(resTerm?.data?.msg[0]?.o_m_desc);
                  setOIFlag(resTerm?.data?.msg[0]?.operation_installation);
                  setOIDesc(resTerm?.data?.msg[0]?.operation_installation_desc);
                  setPackingType(resTerm?.data?.msg[0]?.packing_type);
                  setPackingVal(resTerm?.data?.msg[0]?.packing_val);
                  setManufactureClearance(
                    resTerm?.data?.msg[0]?.manufacture_clearance
                  );
                  setManufactureDesc(
                    resTerm?.data?.msg[0]?.manufacture_clearance_desc
                  );
                  setdispatchdt(
                    resTerm?.data?.msg[0]?.dispatch_dt == "Y" ? true : false
                  );
                  setcommdt(
                    resTerm?.data?.msg[0]?.comm_dt == "Y" ? true : false
                  );
                  const terms_conditions = {
                    price_basis_flag: resTerm?.data?.msg[0]?.price_basis,
                    price_basis_desc: resTerm?.data?.msg[0]?.price_basis_desc,
                    packing_forwarding_val:
                      resTerm?.data?.msg[0]?.packing_fwd_val,
                    packing_forwarding_extra:
                      resTerm?.data?.msg[0]?.packing_fwd_extra,
                    packing_forwarding_extra_val:
                      resTerm?.data?.msg[0]?.packing_fwd_extra_val,
                    pf_currency: resTerm?.data?.msg[0]?.pf_currency,
                    pf_cgst: resTerm?.data?.msg[0]?.pf_cgst,
                    pf_sgst: resTerm?.data?.msg[0]?.pf_sgst,
                    pf_igst: resTerm?.data?.msg[0]?.pf_igst,
                    freight_insurance: resTerm?.data?.msg[0]?.freight_ins,
                    freight_insurance_val:
                      resTerm?.data?.msg[0]?.freight_ins_val,
                    freight_extra: resTerm?.data?.msg[0]?.freight_extra,
                    freight_extra_val: resTerm?.data?.msg[0]?.freight_extra_val,
                    freight_currency: resTerm?.data?.msg[0]?.freight_currency,
                    freight_cgst: resTerm?.data?.msg[0]?.freight_cgst,
                    freight_sgst: resTerm?.data?.msg[0]?.freight_sgst,
                    freight_igst: resTerm?.data?.msg[0]?.freight_igst,
                    test_certificate: resTerm?.data?.msg[0]?.test_certificate,
                    test_certificate_desc:
                      resTerm?.data?.msg[0]?.test_certificate_desc,
                    ld_applicable_date: resTerm?.data?.msg[0]?.ld_date,
                    ld_applied_on: resTerm?.data?.msg[0]?.ld_val,
                    ld_value: resTerm?.data?.msg[0]?.ld_val_per,
                    po_min_value: resTerm?.data?.msg[0]?.min_per,
                    others_ld: resTerm?.data?.msg[0]?.ld_date_desc,
                    others_applied: resTerm?.data?.msg[0]?.ld_val_desc,
                    warranty_guarantee_flag:
                      resTerm?.data?.msg[0]?.warranty_guarantee,
                    duration: resTerm?.data?.msg[0]?.duration,
                    duration_val: resTerm?.data?.msg[0]?.duration_value,
                    duration_val_to: resTerm?.data?.msg[0]?.duration_value_to,
                    om_manual_flag: resTerm?.data?.msg[0]?.o_m_manual,
                    om_manual_desc: resTerm?.data?.msg[0]?.o_m_desc,
                    oi_flag: resTerm?.data?.msg[0]?.operation_installation,
                    oi_desc: resTerm?.data?.msg[0]?.operation_installation_desc,
                    packing_type: resTerm?.data?.msg[0]?.packing_type,
                    manufacture_clearance:
                      resTerm?.data?.msg[0]?.manufacture_clearance,
                    manufacture_clearance_desc:
                      resTerm?.data?.msg[0]?.manufacture_clearance_desc,
                    dispatch_dt:
                      resTerm?.data?.msg[0]?.dispatch_dt == "Y" ? true : false,
                    comm_dt:
                      resTerm?.data?.msg[0]?.comm_dt == "Y" ? true : false,
                    insurance: resTerm?.data?.msg[0]?.ins,
                    insurance_val: resTerm?.data?.msg[0]?.ins_val,
                    ins_extra: resTerm?.data?.msg[0]?.ins_extra,
                    ins_extra_val: resTerm?.data?.msg[0]?.ins_extra_val,
                    ins_currency: resTerm?.data?.msg[0]?.ins_currency,
                    ins_cgst: resTerm?.data?.msg[0]?.ins_cgst,
                    ins_sgst: resTerm?.data?.msg[0]?.ins_sgst,
                    ins_igst: resTerm?.data?.msg[0]?.ins_igst,
                  };
                  console.log(terms_conditions);
                  localStorage.setItem(
                    "terms",
                    JSON.stringify(terms_conditions)
                  );
                })
                .catch((err) =>
                  navigate("/error" + "/" + err.code + "/" + err.message)
                );
              axios
                .post(url + "/api/getpopayterms", { id: +params.id })
                .then((resPay) => {
                  console.log(resPay);
                  for (let i = 0; i < resPay?.data?.msg?.length; i++) {
                    termList.push({
                      sl_no: resPay?.data?.msg[i]?.sl_no,
                      stage: resPay?.data?.msg[i]?.stage_no,
                      term: resPay?.data?.msg[i]?.terms_dtls,
                    });
                  }
                  setTermList(termList);
                  localStorage.setItem("termList", JSON.stringify(termList));
                  axios
                    .post(url + "/api/getpodelivery", { id: +params.id })
                    .then((resDel) => {
                      console.log(resDel);
                      setDeliveryAdd(resDel?.data?.msg[0]?.ship_to);
                      localStorage.setItem(
                        "ship_to",
                        resDel?.data?.msg[0]?.ship_to
                      );
                      setDelfFlag(resDel?.data?.msg[0]?.del_flag);
                      localStorage.setItem(
                        "delFlag",
                        resDel?.data?.msg[0]?.del_flag
                      );
                      setWareHouse(resDel?.data?.msg[0]?.ware_house_flag);
                      localStorage.setItem(
                        "ware_house_flag",
                        resDel?.data?.msg[0]?.ware_house_flag
                      );
                      setNotes(resDel?.data?.msg[0]?.po_notes);
                      localStorage.setItem(
                        "notes",
                        resDel?.data?.msg[0]?.po_notes
                      );
                      axios
                        .post(url + "/api/getpomore", { id: +params.id })
                        .then((resMore) => {
                          console.log(resMore);
                          setInspFlag(resMore?.data?.msg[0]?.inspection);
                          setInsp(resMore?.data?.msg[0]?.inspection_scope);
                          setMdccFlag(resMore?.data?.msg[0]?.mdcc);
                          setMdcc(resMore?.data?.msg[0]?.mdcc_scope);
                          setDrawingFlag(resMore?.data?.msg[0]?.draw);
                          setDrawing(resMore?.data?.msg[0]?.draw_scope);
                          setDrawingDate(resMore?.data?.msg[0]?.draw_period);
                          localStorage.setItem(
                            "mdcc_flag",
                            resMore?.data?.msg[0]?.mdcc
                          );
                          localStorage.setItem(
                            "mdcc",
                            resMore?.data?.msg[0]?.mdcc_scope
                          );
                          localStorage.setItem(
                            "insp_flag",
                            resMore?.data?.msg[0]?.inspection
                          );
                          localStorage.setItem(
                            "insp",
                            resMore?.data?.msg[0]?.inspection_scope
                          );
                          localStorage.setItem(
                            "drawing_flag",
                            resMore?.data?.msg[0]?.draw
                          );
                          localStorage.setItem(
                            "drawing",
                            resMore?.data?.msg[0]?.draw_scope
                          );
                          localStorage.setItem(
                            "dt",
                            resMore?.data?.msg[0]?.draw_period
                          );
                          localStorage.setItem(
                            "mdcc_doc",
                            resMore?.data?.msg[0]?.mdcc_doc
                          );
                          localStorage.setItem(
                            "insp_doc",
                            resMore?.data?.msg[0]?.insp_doc
                          );
                          localStorage.setItem(
                            "draw_doc",
                            resMore?.data?.msg[0]?.draw_doc
                          );
                          axios
                            .post(url + "/api/getpocomments", {
                              id: +params.id,
                            })
                            .then((resCom) => {
                              // setTimeline([])
                              console.log(resCom);
                              for (
                                let i = 0;
                                i < resCom?.data?.msg?.length;
                                i++
                              ) {
                                timeline.push({
                                  label: resCom?.data?.msg[i].created_at
                                    .toString()
                                    .split("T")
                                    .join(" "),
                                  children:
                                    resCom?.data?.msg[i].proj_remarks +
                                    " by " +
                                    resCom?.data?.msg[i].created_by.toString(),
                                });
                              }
                              setTimeline(timeline);
                              console.log(timeline);
                            });
                        });
                    });
                })
                .catch((err) =>
                  navigate("/error" + "/" + err.code + "/" + err.message)
                );
            })
            .catch((err) =>
              navigate("/error" + "/" + err.code + "/" + err.message)
            );
        })
        .catch((err) =>
          navigate("/error" + "/" + err.code + "/" + err.message)
        );
    }
  }, []);

  const content = (
    <div>
      <p>{localStorage.getItem("amend_note")}</p>
      <p>Content</p>
    </div>
  );

  return (
    <>
      {floatShow &&
        (localStorage.getItem("user_type") == "2" ||
          localStorage.getItem("user_type") == 5) && (
          <FloatButton
            icon={loading ? <LoadingOutlined spin /> : <FileTextOutlined />}
            tooltip="Save draft"
            disabled={loading || blocked ? true : false}
            type="primary"
            style={{
              insetInlineEnd: 100,
              right: 20,
              bottom: 100,
              height: 50,
              width: 50,
            }}
            onClick={() => {
              setLoading(true);
              setClickFlag("P");
              localStorage.setItem("po_status", "P");
              submitPo();
            }}
          />
        )}
      <HeadingTemplate
        text={params.id > 0 ? "Update purchase order" : "Create purchase order"}
        mode={params.id > 0 ? 1 : 0}
        title={"Purchase Order"}
        data={""}
      />

      {(localStorage.getItem("po_no") != "null" && localStorage.getItem('po_no'))&& (
        <Tag color="#4FB477">PO: {localStorage.getItem("po_no")}</Tag>
      )}

      <BlockUI
        blocked={
          blocked &&
          localStorage.getItem("po_status") != "A" &&
          localStorage.getItem("po_status") != "D" &&
          localStorage.getItem("po_status") != "L"
        }
        template={
          <div className="flex-col justify-center items-center gap-5 -mt-72">
            <LockOutlined className="text-9xl ml-44 mb-2 text-green-700 animate-bounce" />
            <p className="text-white text-xl mb-2">
              Please cite a ground for amendment to unlock the form.(
              {amendnote.length}/500)
            </p>
            <textarea
              rows="5"
              maxLength={500}
              className="bg-white border-1 border-gray-400 text-sm rounded-lg  focus:border-green-900 active:border-green-600 focus:ring-green-600 focus:border-1 duration-500 block w-full p-1.5 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={amendnote}
              onChange={(e) => {
                setAmendNote(e.target.value);
              }}
            />
            {/* <input type="text"/> */}

            <button
              type="submit"
              disabled={!amendnote || loading}
              className="float-end disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-end px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-green-900 bg-white transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
              onClick={() => {
                setLoading(true);
                axios
                  .post(url + "/api/addamendnote", {
                    id: +params.id,
                    status: amendnote,
                    user: localStorage.getItem("email"),
                  })
                  .then((res) => {
                    console.log(res);
                    setLoading(false);
                    if (res?.data?.suc > 0) {
                      setBlocked(false);
                      localStorage.setItem("amend_note", amendnote);
                    } else {
                      Message("error", res?.data?.msg);
                    }
                  })
                  .catch((err) => {
                    Message("error", err);
                    navigate("/error" + "/" + err.code + "/" + err.message);
                  });
              }}
            >
              <UnlockOutlined /> Unlock
            </button>
          </div>
        }
      >
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          className="text-green-900 dark:text-gray-400"
          spinning={loading}
        >
          <div className="card bg-white rounded-lg p-5">
            {clickFlag && (
              <>
                <div className={"flex gap-5 justify-end"}>
                  {clickFlag == "P" ? (
                    <Tag
                      bordered={false}
                      className="text-base rounded-full shadow-sm p-1.5 ml-10"
                      color="processing"
                      icon={<SyncOutlined spin />}
                    >
                      In Progress
                    </Tag>
                  ) : clickFlag == "U" ? (
                    <Tag
                      bordered={false}
                      icon={<ClockCircleOutlined className="animate-pulse" />}
                      className="text-base rounded-full shadow-sm p-1.5 ml-10"
                      color="error"
                    >
                      Approval Pending
                    </Tag>
                  ) : clickFlag == "A" ? (
                    <Tag
                      bordered={false}
                      icon={<CheckCircleOutlined />}
                      className="text-base rounded-full shadow-sm p-1.5 ml-10"
                      color="green"
                    >
                      Approved
                    </Tag>
                  ) : clickFlag == "D" ? (
                    <Tag
                      icon={<TruckOutlined />}
                      bordered={false}
                      className="text-base rounded-full shadow-sm p-1.5 ml-10"
                      color="lime"
                    >
                      Delivered
                    </Tag>
                  ) : (
                    <Tag
                      bordered={false}
                      icon={<TruckOutlined />}
                      className="text-base rounded-full shadow-sm p-1.5 ml-10"
                      color="purple"
                    >
                      Partially Delivered
                    </Tag>
                  )}

                  {localStorage.getItem("amend_note") != "null" &&
                    localStorage.getItem("amend_flag") == "Y" && (
                      <Tooltip
                        title={
                          "Amendment note- " +
                          localStorage.getItem("amend_note")
                        }
                      >
                        <QuestionCircleOutlined className="text-gray-500 z-50" />
                      </Tooltip>
                    )}
                </div>
              </>
            )}

            <Stepper
              ref={stepperRef}
              style={{ flexBasis: "100%" }}
              orientation="vertical"
              linear={
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? false
                  : true
              }
              className={"-mt-11"}
            >
              <StepperPanel header="Basic Details">
                <BasicDetails
                  data={{
                    order_date: localStorage.getItem("order_date"),
                    proj_name: localStorage.getItem("proj_name"),
                    vendor_name: localStorage.getItem("vendor_name"),
                    vend_ref: localStorage.getItem("vend_ref"),
                    type: localStorage.getItem("order_type"),
                    order_id: localStorage.getItem("order_id"),
                    po_issue_date: localStorage.getItem("po_issue_date"),
                    po_no: localStorage.getItem("po_no"),
                    pur_req: localStorage.getItem("pur_req")
                    // pur_req: JSON.stringify(pur_req)
                  }}
                  pressNext={(values,pur_req) => {
                    console.log(values,pur_req,localStorage.getItem('pur_req'));
                    // if(values){
                    setPurReq(pur_req)
                    setOrderType(values?.type);
                    setBOrderDt(values?.order_date);
                    setVendorName(values?.vendor_name);
                    setVendRef(values?.vend_ref);
                    setProjectName(values?.proj_name);
                    setOrderId(values?.order_id);
                    setPoIssueDate(values?.po_issue_date);
                    setPoNo(values?.po_no);
                    stepperRef.current.nextCallback();
                    // }
                  }}
                  pressBack={(values) => {
                    stepperRef.current.prevCallback();
                  }}
                />
              </StepperPanel>
              <StepperPanel header="Item Details">
                <ProductDetails
                  data={{ itemList: itemList,pur_req:pur_req }}
                  pressNext={(values) => {
                    console.log(values);
                    setItemList(values);
                    stepperRef.current.nextCallback();
                  }}
                  pressBack={() => {
                    stepperRef.current.prevCallback();
                  }}
                />
              </StepperPanel>
              <StepperPanel header="Terms & Conditions">
                <TermsConditions
                  data={{
                    price_basis_flag: price_basis_flag,
                    price_basis_desc: price_basis_desc,
                    packing_forwarding_val: packing_forwarding,
                    packing_forwarding_extra: packing_forwardingExtra,
                    packing_forwarding_extra_val: packing_forwardingExtraVal,
                    pf_cgst: pf_cgst,
                    pf_sgst: pf_sgst,
                    pf_igst: pf_igst,
                    pf_currency: pf_currency,
                    freight_insurance: freight_insurance,
                    freight_insurance_val: freight_insurance_val,
                    freight_extra: freight_extra,
                    freight_extra_val: freight_extra_val,
                    freight_cgst: freight_cgst,
                    freight_sgst: freight_sgst,
                    freight_igst: freight_igst,
                    freight_currency: freight_currency,
                    test_certificate: test_certificate,
                    test_certificate_desc: test_certificate_desc,
                    ld_applicable_date: ld_applicable_date,
                    ld_applied_on: ld_applied_on,
                    ld_value: ld_value,
                    po_min_value: po_min_value,
                    others_ld: others_ld,
                    others_applied: others_applied,
                    warranty_guarantee_flag: warranty_guarantee_flag,
                    duration: duration,
                    duration_val: duration_val,
                    duration_val_to: duration_val_to,
                    om_manual_flag: om_manual_flag,
                    om_manual_desc: om_manual_desc,
                    oi_flag: oi_flag,
                    oi_desc: oi_desc,
                    packing_type: packing_type,
                    packing_val: packing_val,
                    manufacture_clearance: manufacture_clearance,
                    manufacture_clearance_desc: manufacture_clearance_desc,
                    dispatch_dt: dispatch_dt,
                    comm_dt: comm_dt,
                    insurance: insurance,
                    insurance_val: insurance_val,
                    ins_extra: ins_extra,
                    ins_extra_val: ins_extra_val,
                    ins_cgst: ins_cgst,
                    ins_sgst: ins_sgst,
                    ins_igst: ins_igst,
                    ins_currency: ins_currency,
                  }}
                  pressNext={(values) => {
                    console.log(values);
                    setPriceBasisFlag(values.price_basis_flag);
                    setPriceBasisDesc(values.price_basis_desc);
                    setPackingForwarding(values.packing_forwarding_val);
                    setPackingForwardingExtra(values.packing_forwarding_extra);
                    setPackingForwardingExtraVal(
                      values.packing_forwarding_extra_val
                    );
                    setFreightInsurance(values.freight_insurance);
                    setFreightInsuranceVal(values.freight_insurance_val);
                    setFreightExtra(values.freight_extra);
                    setFreightExtraVal(values.freight_extra_val);
                    setfreightcurrency(values.freight_currency);
                    setfreightcgst(values.freight_cgst);
                    setfreightsgst(values.freight_sgst);
                    setfreightigst(values.freight_igst);
                    setInsurance(values.insurance);
                    setInsuranceVal(values.insurance_val);
                    setinsExtra(values.ins_extra);
                    setinsExtraVal(values.ins_extra_val);
                    setinscurrency(values.ins_currency);
                    setinscgst(values.ins_cgst);
                    setinssgst(values.ins_sgst);
                    setinsigst(values.ins_igst);
                    setTestCertificate(values.test_certificate);
                    setTestCertificateDesc(values.test_certificate_desc);
                    setLDApplicableDate(values.ld_applicable_date);
                    setLDAppliedOn(values.ld_applied_on);
                    setOthersApplied(values.others_applied);
                    setOthersLd(values.others_ld);
                    setLDValue(values.ld_value);
                    setPOMinValue(values.po_min_value);
                    setWarrantyFlag(values.warranty_guarantee_flag);
                    setDuration(values.duration);
                    setDurationVal(values.duration_val);
                    setDurationValTo(values.duration_val_to);
                    setOMFlag(values.om_manual_flag);
                    setOMDesc(values.om_manual_desc);
                    setOIFlag(values.oi_flag);
                    setOIDesc(values.oi_desc);
                    setPackingType(values.packing_type);
                    setPackingVal(values.packing_val);
                    setManufactureClearance(values.manufacture_clearance);
                    setManufactureDesc(values.manufacture_clearance_desc);
                    setdispatchdt(values.dispatch_dt);
                    setcommdt(values.comm_dt);
                    setpfcgst(values.pf_cgst);
                    setpfsgst(values.pf_sgst);
                    setpfigst(values.pf_igst);
                    setpfcurrency(values.pf_currency);
                    stepperRef.current.nextCallback();
                  }}
                  pressBack={() => {
                    stepperRef.current.prevCallback();
                  }}
                />
              </StepperPanel>
              <StepperPanel header="Payment Terms">
                <PaymentTerms
                  data={{ termList: termList }}
                  pressNext={(values) => {
                    setTermList(values);
                    stepperRef.current.nextCallback();
                  }}
                  pressBack={() => {
                    stepperRef.current.prevCallback();
                  }}
                />
              </StepperPanel>
              <StepperPanel header="Delivery Details">
                <Delivery
                  data={{
                    type: order_type,
                    delivery: delivery,
                    ware_house_flag: ware_house_flag,
                    // delFlag:delFlag
                  }}
                  pressNext={(values) => {
                    console.log(values);
                    setDeliveryAdd(values);
                    localStorage.setItem("ship_to", values);
                    // localStorage.setItem("delFlag", values.delFlag);
                    stepperRef.current.nextCallback();
                  }}
                  pressBack={() => {
                    stepperRef.current.prevCallback();
                  }}
                />
              </StepperPanel>
              <StepperPanel header="More">
                <More
                  data={{
                    mdcc_flag: mdcc_flag,
                    mdcc: mdcc,
                    drawing_flag: drawing_flag,
                    drawing: drawing,
                    insp_flag: insp_flag,
                    insp: insp,
                    drawingDate: drawingDate,
                  }}
                  onMdccChange={(val)=>{
                    setMdccDoc(val);
                    
                  }}
                  onInspChange={(val)=>{
                    setInspDoc(val);
                  
                  }}
                  onDrawChange={(val)=>{
                    setDrawDoc(val);
                  
                  }}
                  pressNext={(values) => {
                    console.log(values);
                    setMdccFlag(values.mdcc_flag);
                    setMdcc(values.mdcc);
                    setDrawingFlag(values.drawing_flag);
                    setDrawing(values.drawing);
                    setInspFlag(values.insp_flag);
                    setInsp(values.insp);
                    setDrawingDate(values.drawingDate);
                    setMdccDoc(values.mdcc_doc);
                    setInspDoc(values.insp_doc);
                    setDrawDoc(values.draw_doc);

                    stepperRef.current.nextCallback();
                  }}
                  pressBack={() => {
                    stepperRef.current.prevCallback();
                  }}
                />
              </StepperPanel>
              <StepperPanel header="Notes">
                <Notes
                  data={{ notes: notes }}
                  pressNext={(values) => {
                    console.log(values);
                    setNotes(values);
                    stepperRef.current.nextCallback();
                  }}
                  pressBack={() => {
                    stepperRef.current.prevCallback();
                  }}
                />
              </StepperPanel>
              <StepperPanel header="Preview">
                <div className="ml-72 border-b-gray-300 w-1/4 flex justify-center items-center rounded-full gap-5 -mt-16">
                  <Tooltip title="Back">
                    <Button
                      type="submit"
                      className="justify-center disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                      onClick={() => {
                        stepperRef.current.prevCallback();
                      }}
                      icon={<ArrowBackIcon />}
                    >
                      Back
                    </Button>
                  </Tooltip>
                  {params.id > 0 && (
                    <Tooltip title="View PO">
                      <Button
                        type="submit"
                        className="justify-center disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-[#eb8d00] transition ease-in-out duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                        onClick={() => setVisible(true)}
                        tooltip={"View Purchase Order"}
                        icon={<EyeOutlined />}
                      >
                        View PO
                      </Button>
                    </Tooltip>
                  )}

                  {(det.approve_po!=1 && localStorage.getItem("po_status") == "U" )&&
                    (
                      <>
                        <Tooltip title="Approve PO">
                          <Button
                            type="submit"
                            className="justify-center disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                            onClick={() => {
                              localStorage.setItem("po_status", "A");
                              approvepo();
                            }}
                            icon={<CheckOutlined />}
                          >
                            Approve
                          </Button>
                        </Tooltip>

                        {/* <Tooltip title='Reject PO'>
       
        <Button
          type="submit"
          className=" w-1/6 justify-center disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-500 transition ease-in-out  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
          onClick={()=>{localStorage.setItem('po_status','U');approvepo()}}
          icon={<CloseOutlined />}
        />
       </Tooltip> */}
                      </>
                    )}
                  {(det.po!=1 && (
                    (localStorage.getItem("po_status") == "U" ||
                    localStorage.getItem("po_status") == "P")) &&
                     (
                      <Tooltip title="Save PO">
                        <Button
                          type="submit"
                          className="justify-center disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-500 transition ease-in-out duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                          onClick={() => {
                            setLoading(true);
                            setClickFlag(params.flag == "F" ? "U" : "A");
                            localStorage.setItem(
                              "po_status",
                              params.flag == "F" ? "U" : "A"
                            );
                            submitPo();
                          }}
                          tooltip={"Save Purchase Order"}
                          icon={<SaveOutlined />}
                        >
                          Save PO
                        </Button>
                      </Tooltip>
                    ))}
                </div>
                <PoLogs data={timeline} />
              </StepperPanel>
            </Stepper>
          </div>
        </Spin>
      </BlockUI>
      <DialogBox
        visible={visible}
        flag={10}
        data={""}
        onPress={() => setVisible(false)}
      />
    </>
  );
}

export default PurchaseOrderForm;
