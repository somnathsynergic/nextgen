import './Steps.css'
import React, { useEffect, useState } from "react";
import TDInputTemplate from "../TDInputTemplate";
import { useFormik, yupToFormErrors } from "formik";
import { BlockUI } from 'primereact/blockui';

import * as Yup from "yup";
import VError from "../../Components/VError";
import { useParams } from "react-router-dom";
import { Checkbox } from "antd";
import { Tag } from "antd";
import { motion } from "framer-motion";
import { url } from "../../Address/BaseUrl";
import axios from "axios";
import { Popover } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, LockFilled, UnlockFilled } from "@ant-design/icons";
function TermsConditions({ pressNext, pressBack, data }) {
  const [grand_total, setGrand] = useState(0);
  const [checked, setChecked] = useState(true);
    const [blocked, setBlocked] = useState(false);
    const det = JSON.parse(localStorage.getItem('perm'))
  
  const [disabled, setDisabled] = useState(false);
  const [gstList, setGstList] = useState([]);
  const [cgstList, setcGstList] = useState([]);
  const [sgstList, setsGstList] = useState([]);
  const [igstList, setiGstList] = useState([]);
  const [pricePlace, setPricePlace] = useState([]);
  const [freightdesc, setFreightDesc] = useState([]);
  const [mcdesc, setmcDesc] = useState([]);
  const [insdesc, setInsDesc] = useState([]);
  const [tcdesc, settcDesc] = useState([]);
  const [omdesc, setomDesc] = useState([]);
  const [oidesc, setoiDesc] = useState([]);
  const [ldothers, setldothers] = useState([]);
  const [ldval, setldval] = useState([]);
  const [popOpen, setPopOpen] = useState(false);
  const [popfrOpen, setfrPopOpen] = useState(false);
  const [popinsOpen, setinsPopOpen] = useState(false);
  const [poptcOpen, settcPopOpen] = useState(false);
  const [popomOpen, setomPopOpen] = useState(false);
  const [popoiOpen, setoiPopOpen] = useState(false);
  const [popmcOpen, setmcPopOpen] = useState(false);
  const [popldOthersOpen, setldOthersPopOpen] = useState(false);
  const [popldvalOpen, setldvalPopOpen] = useState(false);
  console.log(data);
  const hide = () => {
    setPopOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setPopOpen(newOpen);
  };
  const hidefr = () => {
    setfrPopOpen(false);
  };

  const handlefrOpenChange = (newOpen) => {
    setfrPopOpen(newOpen);
  };
  const hideins = () => {
    setinsPopOpen(false);
  };
  const handleldothersOpenChange = (newOpen) => {
    setldOthersPopOpen(newOpen);
  };
  const hideldothers = () => {
    setldOthersPopOpen(false);
  };
  const handleldvalOpenChange = (newOpen) => {
    setldvalPopOpen(newOpen);
  };
  const hideldval = () => {
    setldvalPopOpen(false);
  };
  const handleinsOpenChange = (newOpen) => {
    setinsPopOpen(newOpen);
  };
  const hidetc = () => {
    settcPopOpen(false);
  };

  const handletcOpenChange = (newOpen) => {
    settcPopOpen(newOpen);
  };
  const hideom = () => {
    setomPopOpen(false);
  };

  const handleomOpenChange = (newOpen) => {
    setomPopOpen(newOpen);
  };
  const hideoi = () => {
    setoiPopOpen(false);
  };

  const handleoiOpenChange = (newOpen) => {
    setoiPopOpen(newOpen);
  };
  const hidemc = () => {
    setmcPopOpen(false);
  };

  const handlemcOpenChange = (newOpen) => {
    setmcPopOpen(newOpen);
  };
  const toggleChecked = () => {
    setChecked(!checked);
  };

  const toggleDisable = () => {
    setDisabled(!disabled);
  };

  const onChange = (e) => {
    console.log("checked = ", e.target.checked);
    setChecked(e.target.checked);
  };
  console.log(data);
  console.log(JSON.parse(localStorage.getItem("itemList")));
  var tot = 0;
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("itemList"))) {
      for (let item of JSON.parse(localStorage.getItem("itemList"))) {
        console.log(item);
        tot += item.qty * item.unit_price;
      }
    }
    console.log(tot);
    setGrand(tot);
  }, []);

  useEffect(() => {
    // setBlocked((det.po == 1 || (localStorage.getItem('manager_email')!='FFABC123' && localStorage.getItem('manager_email')!=localStorage.getItem('email'))) ? true : false);
    setBlocked(det.po == 1 || (localStorage.getItem('email')!=localStorage.getItem("po_created_by") && localStorage.getItem("po_created_by")) ?true:false)


    axios.post(url + "/api/getgst", { id: 0 }).then((resGst) => {
      setGstList(resGst?.data?.msg);
      for (let i = 0; i < resGst?.data?.msg?.length; i++) {
        if (
          resGst?.data?.msg[i].gst_type == "CGST" ||
          resGst?.data?.msg[i].gst_type == "cgst" ||
          resGst?.data?.msg[i].gst_type.toString().toLowerCase() == "cgst"
        )
          cgstList.push({
            name: resGst?.data?.msg[i].gst_rate,
            code: resGst?.data?.msg[i].gst_rate,
          });
        if (
          resGst?.data?.msg[i].gst_type == "IGST" ||
          resGst?.data?.msg[i].gst_type == "igst" ||
          resGst?.data?.msg[i].gst_type.toString().toLowerCase() == "igst"
        )
          igstList.push({
            name: resGst?.data?.msg[i].gst_rate,
            code: resGst?.data?.msg[i].gst_rate,
          });
        if (
          resGst?.data?.msg[i].gst_type == "SGST" ||
          resGst?.data?.msg[i].gst_type == "sgst" ||
          resGst?.data?.msg[i].gst_type.toString().toLowerCase() == "sgst"
        )
          sgstList.push({
            name: resGst?.data?.msg[i].gst_rate,
            code: resGst?.data?.msg[i].gst_rate,
          });
      }
      // setLoading(false);
    });
  }, []);
  const params = useParams();
  useEffect(() => {
    console.log(data.ins_currency);
  }, [data]);
  const initialValues = {
    price_basis_flag: data.price_basis_flag ? data.price_basis_flag : "",
    price_basis_desc: data.price_basis_desc ? data.price_basis_desc : "",
    // packing_forwarding_val:data.packing_forwarding_val?data.packing_forwarding_val:"",
    packing_forwarding_val: data.packing_forwarding_val
      ? data.packing_forwarding_val
      : "",
    packing_forwarding_extra: data.packing_forwarding_val
      ? data.packing_forwarding_extra
      : "",
    packing_forwarding_extra_val: data.packing_forwarding_val
      ? data.packing_forwarding_extra_val
      : "",

    pf_sgst: data.packing_forwarding_val ? data.pf_sgst : "",
    pf_cgst: data.packing_forwarding_val ? data.pf_cgst : "",
    pf_igst: data.packing_forwarding_val ? data.pf_igst : "",
    pf_currency: data.pf_currency ? data.pf_currency : "",

    freight_insurance: data.freight_insurance ? data.freight_insurance : "",
    freight_insurance_val: data.freight_insurance
      ? data.freight_insurance_val
      : "",
    freight_extra: data.freight_extra ? data.freight_extra : "",
    freight_extra_val: data.freight_extra_val ? data.freight_extra_val : "",
    freight_currency: data.freight_currency ? data.freight_currency : "",
    freight_cgst: data.freight_cgst ? data.freight_cgst : "",
    freight_sgst: data.freight_sgst ? data.freight_sgst : "",
    freight_igst: data.freight_igst ? data.freight_igst : "",
    insurance: data.insurance ? data.insurance : "",
    insurance_val: data.insurance_val ? data.insurance_val : "",
    ins_extra: data.ins_extra ? data.ins_extra : "",
    ins_extra_val: data.ins_extra_val ? data.ins_extra_val : "",
    ins_currency: data.ins_currency ? data.ins_currency : "",
    ins_cgst: data.ins_cgst ? data.ins_cgst : "",
    ins_sgst: data.ins_sgst ? data.ins_sgst : "",
    ins_igst: data.ins_igst ? data.ins_igst : "",

    test_certificate: data.test_certificate ? data.test_certificate : "",
    test_certificate_desc: data.test_certificate_desc
      ? data.test_certificate_desc
      : "",
    ld_applicable_date: data.ld_applicable_date ? data.ld_applicable_date : "",
    ld_applied_on: data.ld_applied_on ? data.ld_applied_on : "",
    ld_value: data.ld_value ? data.ld_value : "",
    po_min_value: data.po_min_value ? data.po_min_value : "",
    others_ld: data.others_ld ? data.others_ld : "",
    others_applied: data.others_applied ? data.others_applied : "",
    dispatch_dt: data.dispatch_dt,
    comm_dt: data.comm_dt,

    warranty_guarantee_flag: data.warranty_guarantee_flag
      ? data.warranty_guarantee_flag
      : "",
    duration: data.duration ? data.duration : "",
    duration_val: data.duration_val ? data.duration_val : "",
    duration_val_to: data.duration_val_to ? data.duration_val_to : "",
    om_manual_flag: data.om_manual_flag ? data.om_manual_flag : "",
    om_manual_desc: data.om_manual_desc ? data.om_manual_desc : "",
    oi_flag: data.oi_flag ? data.oi_flag : "",
    oi_desc: data.oi_desc ? data.oi_desc : "",
    packing_type: data.packing_type ? data.packing_type : "",
    packing_val: data.packing_val ? data.packing_val : "",
    manufacture_clearance: data.manufacture_clearance
      ? data.manufacture_clearance
      : "",
    manufacture_clearance_desc: data.manufacture_clearance_desc
      ? data.manufacture_clearance_desc
      : "",
  };

  const [formValues, setValues] = useState(initialValues);
  const validationSchema = Yup.object({
    price_basis_flag: Yup.string().required("Price basis date is required"),
    packing_forwarding_val: Yup.string().required(
      "Packing & Forwarding is required"
    ),
    packing_forwarding_extra: Yup.string().when("packing_forwarding_val", {
      is: "E",
      then: () =>
        Yup.number()
          .required("Extra is required!")
          .min(0.0000000000000001, "Please enter a non-zero positive input!"),
      otherwise: () => Yup.string(),
    }),
    packing_forwarding_extra_val: Yup.string().when("packing_forwarding_val", {
      is: "E",
      then: () =>
        Yup.string()
          .required("Required")
          .matches(/^[0-9.]+$/, "Invalid value"),
      otherwise: () => Yup.string(),
    }),

    freight_insurance: Yup.string().required("Freight is required"),
    // freight_extra: Yup.string().when("freight_insurance", {
    //   is: "E",
    //   then: () =>
    //     Yup.number()
    //       .required("Extra is required!")
    //       .min(0.0000000000000001, "Please enter a non-zero positive input!"),
    //   otherwise: () => Yup.string(),
    // }),
    // freight_extra_val: Yup.string().when("freight_insurance", {
    //   is: "E",
    //   then: () =>
    //     Yup.string()
    //       .required("Required")
    //       .matches(/^[0-9.]+$/, "Invalid value"),
    //   otherwise: () => Yup.string(),
    // }),
    insurance: Yup.string().required("Insurance is required"),
    // insurance_val: Yup.string().when("insurance", {
    //   is: "Y",
    //   then: () => Yup.string().required("Description is required"),
    //   otherwise: () => Yup.string(),
    // }),
    // ins_extra: Yup.string().when("insurance", {
    //   is: "Y",
    //   then: () =>
    //     Yup.number()
    //       .required("Required")
    //       .min(0.0000000000000001, "Please enter a non-zero positive input!"),
    //   otherwise: () => Yup.string(),
    // }),
    // ins_extra_val: Yup.string().when("insurance", {
    //   is: "Y",
    //   then: () => Yup.string().required("Required"),
    //   otherwise: () => Yup.string(),
    // }),
    // ins_currency: Yup.string().when("insurance", {
    //   is: "Y",
    //   then: () => Yup.string().required("Required"),
    //   otherwise: () => Yup.string(),
    // }),
    // ins_currency:data.insurace?data.ins_currency:"",
    // ins_cgst:data.insurance?data.ins_cgst:"",
    // ins_sgst:data.insurance?data.ins_sgst:"",
    // ins_igst:data.insurance?data.ins_sgst:"",

    test_certificate: Yup.string().required("Test Certificate is required"),
    // test_certificate_desc: Yup.string().when('test_certificate', {
    //   is: 'Y',
    //   then: () => Yup.string().required("Test Certificate description is required"),
    //   otherwise: () => Yup.string()}),
    pf_currency: Yup.string().when("packing_forwarding_val", {
      is: "E",
      then: () => Yup.string().required("Currency is required"),
      otherwise: () => Yup.string(),
    }),
    // freight_currency: Yup.string().when("freight_insurance", {
    //   is: "E",
    //   then: () => Yup.string().required("Currency is required"),
    //   otherwise: () => Yup.string(),
    // }),
    ld_applicable_date: Yup.string().required("LD applicable date is required"),
    others_ld: Yup.string().when("ld_applicable_date", {
      is: "O",
      then: () => Yup.string().required("Required"),
      otherwise: () => Yup.string(),
    }),

    ld_applied_on: Yup.string().when("ld_applicable_date", {
      is: (val) =>
        val === "M" ||
        val === "D" ||
        val == "O" ||
        val == "" ||
        val == "LD applicable date",
      then: () => Yup.string().required("LD applied on is required"),
      otherwise: () => Yup.string(),
    }),
    others_applied: Yup.string().when("ld_applied_on", {
      is: "O",
      then: () => Yup.string().required("Required"),
      otherwise: () => Yup.string(),
    }),
    ld_value: Yup.string().when("ld_applicable_date", {
      is: (val) =>
        val === "M" ||
        val === "D" ||
        val == "O" ||
        val == "" ||
        val == "LD applicable date",
      // then: () => Yup.string().min(0,'Invalid value').matches(/^[0-9.]+$/,'Invalid value'),
      then: () =>
        Yup.number()
          .min(0.5, "Must be between 0.5% and 5%")
          .max(5, "Must be between 0.5 and 5%"),
      otherwise: () => Yup.string(),
    }),
    // ld_value:Yup.string().min(0.5,'Invalid value').max(5,'Invalid value'),
    po_min_value: Yup.number()
      .min(0.5, "Invalid value")
      .max(5, "Invalid value"),
    warranty_guarantee_flag: Yup.string().required(
      "Warranty/Guarantee is required"
    ),
    duration: Yup.string().required("Duration is required"),
    duration_val: Yup.string()
      .required("Duration value is required")
      .min(0, "Invalid value")
      .matches(/^[0-9]+$/, "Only whole numbers allowed"),
    duration_val_to: Yup.string().when("warranty_guarantee_flag", {
      is: "N",
      then: () => Yup.string().required("Duration value is required")
      .min(0, "Invalid value")
      .matches(/^[0-9]+$/, "Only whole numbers allowed"),
      otherwise: () => Yup.string(),
    }),
    om_manual_flag: Yup.string().required("O&M Manual is required"),

    // om_manual_desc: Yup.string().when('om_manual_flag', {
    //   is: 'A',
    //   then: () => Yup.string().required("O&M Manual description is required"),
    //   otherwise: () => Yup.string()}),
    oi_flag: Yup.string().required("Operation/Installation is required"),
    // oi_desc: Yup.string().when('oi_flag', {
    //   is: 'A',
    //   then: () => Yup.string().required("Operation/Installation description is required"),
    //   otherwise: () => Yup.string()}),
    packing_val: Yup.string().when("packing_type", {
      is: "O",
      then: () => Yup.string().required("Description is required"),
      otherwise: () => Yup.string(),
    }),
    manufacture_clearance: Yup.string().required(
      "Manufacture clearance is required"
    ),
    // manufacture_clearance_desc: Yup.string().when('manufacture_clearance', {
    //   is: 'A',
    //   then: () => Yup.string().required("Manufacture clearance description is required"),
    //   otherwise: () => Yup.string()}),
  });

  const onSubmit = (values) => {
    console.log(values);
    pressNext(values);
  };
  const formik = useFormik({
    initialValues: +params.id > 0 ? formValues : initialValues,
    validate: (values) => {
      const errors = {};
      console.log(values);
      if (values.packing_forwarding_val === "E" && values.pf_currency == "I") {
        // If "extra" is selected, enforce either (CGST + SGST) or IGST
        if (
          (!values.pf_cgst || values.pf_cgst == "CGST") &&
          (!values.pf_sgst || values.pf_sgst == "SGST") &&
          (!values.pf_igst || values.pf_igst == "IGST")
        ) {
          errors.pf_cgst = "Either CGST + SGST or IGST is required";
          errors.pf_sgst = "Either CGST + SGST or IGST is required";
          errors.pf_igst = "Either CGST + SGST or IGST is required";
        } else if (
          (values.pf_cgst &&
            values.pf_cgst != "CGST" &&
            (!values.pf_sgst || values.pf_sgst == "SGST")) ||
          ((!values.pf_cgst || values.pf_cgst == "CGST") &&
            values.pf_sgst &&
            values.pf_sgst != "SGST")
        ) {
          errors.pf_cgst = "Both CGST and SGST must be filled together";
          errors.pf_sgst = "Both CGST and SGST must be filled together";
        } else if (
          values.pf_igst &&
          values.pf_igst != "IGST" &&
          ((values.pf_cgst && values.pf_cgst != "CGST") ||
            (values.pf_sgst && values.pf_sgst != "SGST"))
        ) {
          errors.pf_igst =
            "IGST should be filled alone or leave CGST and SGST empty";
        }
      }
      if (values.freight_insurance === "E" && values.freight_currency == "I") {
        // If "extra" is selected, enforce either (CGST + SGST) or IGST
        if (
          (!values.freight_cgst || values.freight_cgst == "CGST") &&
          (!values.freight_sgst || values.freight_sgst == "SGST") &&
          (!values.freight_igst || values.freight_igst == "IGST")
        ) {
          errors.freight_cgst = "Either CGST + SGST or IGST is required";
          errors.freight_sgst = "Either CGST + SGST or IGST is required";
          errors.freight_igst = "Either CGST + SGST or IGST is required";
        } else if (
          (values.freight_cgst &&
            values.freight_cgst != "CGST" &&
            (!values.freight_sgst || values.freight_sgst == "SGST")) ||
          ((!values.freight_cgst || values.freight_cgst == "CGST") &&
            values.freight_sgst &&
            values.freight_sgst != "SGST")
        ) {
          errors.freight_cgst = "Both CGST and SGST must be filled together";
          errors.freight_sgst = "Both CGST and SGST must be filled together";
        } else if (
          values.freight_igst &&
          values.freight_igst != "IGST" &&
          ((values.freight_cgst && values.freight_cgst != "CGST") ||
            (values.freight_sgst && values.freight_sgst != "SGST"))
        ) {
          errors.freight_igst =
            "IGST should be filled alone or leave CGST and SGST empty";
        }
      }
      if (values.insurance === "Y" && values.ins_currency == "I") {
        if (
          (!values.ins_cgst || values.ins_cgst == "CGST") &&
          (!values.ins_sgst || values.ins_sgst == "SGST") &&
          (!values.ins_igst || values.ins_igst == "IGST")
        ) {
          errors.ins_cgst = "Either CGST + SGST or IGST is required";
          errors.ins_sgst = "Either CGST + SGST or IGST is required";
          errors.ins_igst = "Either CGST + SGST or IGST is required";
        } else if (
          (values.ins_cgst &&
            values.ins_cgst != "CGST" &&
            (!values.ins_sgst || values.ins_sgst == "SGST")) ||
          ((!values.ins_cgst || values.ins_cgst == "CGST") &&
            values.ins_sgst &&
            values.ins_sgst != "SGST")
        ) {
          errors.ins_cgst = "Both CGST and SGST must be filled together";
          errors.ins_sgst = "Both CGST and SGST must be filled together";
        } else if (
          values.ins_igst &&
          values.ins_igst != "IGST" &&
          ((values.ins_cgst && values.ins_cgst != "CGST") ||
            (values.ins_sgst && values.ins_sgst != "SGST"))
        ) {
          errors.ins_igst =
            "IGST should be filled alone or leave CGST and SGST empty";
        }
      }
      if (values.duration_val <= 0) {
        errors.duration_val = "Duration must be >0";
      }
      if (values.warranty_guarantee_flag=='N' && values.duration_val_to <= 0) {
        errors.duration_val_to = "Duration must be >0";
      }
      if (values.ld_value > values.po_min_value) {
        errors.ld_value = "LD value must be <= Maximum %";
        errors.po_min_value = "LD value must be <= Maximum %";
      }

      return errors;
    },
    onSubmit,
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });
  const onChangeVal = (e) => {
    formik.handleChange(e);
    formik.setFieldValue(
      "packing_forwarding_extra",
      ((e.target.value / grand_total) * 100).toFixed(2)
    );
    // formik.values.packing_forwarding_extra=(e.target.value/grand_total)*100
  };
  const onChangeExtra = (e) => {
    formik.handleChange(e);
    formik.setFieldValue(
      "packing_forwarding_extra_val",
      ((e.target.value * grand_total) / 100).toFixed(2)
    );
    // formik.values.packing_forwarding_extra_val=(e.target.value*grand_total)/100
  };
  const onChangeValFr = (e) => {
    formik.handleChange(e);
    formik.setFieldValue(
      "freight_extra",
      ((e.target.value / grand_total) * 100).toFixed(2)
    );
    // formik.values.packing_forwarding_extra=(e.target.value/grand_total)*100
  };
  const onChangeExtraFr = (e) => {
    formik.handleChange(e);
    formik.setFieldValue(
      "freight_extra_val",
      ((e.target.value * grand_total) / 100).toFixed(2)
    );
    // formik.values.packing_forwarding_extra_val=(e.target.value*grand_total)/100
  };
  const onChangePfCurrencyFr = (e) => {
    formik.handleChange(e);
    if (e.target.value != "I") {
      formik.setFieldValue("freight_cgst", "");
      formik.setFieldValue("freight_sgst", "");
      formik.setFieldValue("freight_igst", "");
    }
    // formik.values.packing_forwarding_extra_val=(e.target.value*grand_total)/100
  };
  const onChangePfCurrency = (e) => {
    formik.handleChange(e);
    if (e.target.value != "I") {
      formik.setFieldValue("pf_cgst", "");
      formik.setFieldValue("pf_sgst", "");
      formik.setFieldValue("pf_igst", "");
    }
    // formik.values.packing_forwarding_extra_val=(e.target.value*grand_total)/100
  };

  const onChangeValIns = (e) => {
    formik.handleChange(e);
    formik.setFieldValue(
      "ins_extra",
      ((e.target.value / grand_total) * 100).toFixed(2)
    );
    // formik.values.packing_forwarding_extra=(e.target.value/grand_total)*100
  };
  const onChangeExtraIns = (e) => {
    formik.handleChange(e);
    formik.setFieldValue(
      "ins_extra_val",
      ((e.target.value * grand_total) / 100).toFixed(2)
    );
    // formik.values.packing_forwarding_extra_val=(e.target.value*grand_total)/100
  };
  const onChangePfCurrencyIns = (e) => {
    formik.handleChange(e);
    if (e.target.value != "I") {
      formik.setFieldValue("ins_cgst", "");
      formik.setFieldValue("ins_sgst", "");
      formik.setFieldValue("ins_igst", "");
    }
    // formik.values.packing_forwarding_extra_val=(e.target.value*grand_total)/100
  };

  const onChangePhrase = (e) => {
    formik.handleChange(e);
    if (e.target.value.length >= 3) {
      axios
        .post(url + `/api/get_${e.target.name}`, {
          wrd: e.target.value.toString().trim(),
        })
        .then((res) => {
          console.log(res);
          if (res.data.msg.length > 0) {
            setPricePlace([]);
            setFreightDesc([]);
            setInsDesc([]);
            settcDesc([]);
            setomDesc([]);
            setoiDesc([]);
            setmcDesc([]);
            setldothers([]);
            setldval([]);
            handleOpenChange(false);
            handlefrOpenChange(false);
            handleinsOpenChange(false);
            handletcOpenChange(false);
            handleomOpenChange(false);
            handleoiOpenChange(false);
            handlemcOpenChange(false);
            handleldothersOpenChange(false);
            handleldvalOpenChange(false);
            if (e.target.name == "price_basis_desc") {
              handleOpenChange(true);
              setPricePlace(res.data.msg);
            }
            if (e.target.name == "freight_insurance_val") {
              handlefrOpenChange(true);
              setFreightDesc(res.data.msg);
            }
            if (e.target.name == "freight_insurance_val") {
              handlefrOpenChange(true);
              setFreightDesc(res.data.msg);
            }
            if (e.target.name == "insurance_val") {
              handleinsOpenChange(true);
              setInsDesc(res.data.msg);
            }
            if (e.target.name == "test_certificate_desc") {
              handletcOpenChange(true);
              settcDesc(res.data.msg);
            }
            if (e.target.name == "om_manual_desc") {
              handleomOpenChange(true);
              setomDesc(res.data.msg);
            }
            if (e.target.name == "oi_desc") {
              handleoiOpenChange(true);
              setoiDesc(res.data.msg);
            }
            if (e.target.name == "manufacture_clearance_desc") {
              handlemcOpenChange(true);
              setmcDesc(res.data.msg);
            }
            if (e.target.name == "others_ld") {
              handleldothersOpenChange(true);
              setldothers(res.data.msg);
            }
            if (e.target.name == "others_applied") {
              handleldvalOpenChange(true);
              setldval(res.data.msg);
            }
          } else {
            handleOpenChange(false);
            handlefrOpenChange(false);
            handleinsOpenChange(false);
            handletcOpenChange(false);
            handleomOpenChange(false);
            handleoiOpenChange(false);
            handlemcOpenChange(false);
            handleldothersOpenChange(false);
            setPricePlace([]);
            setFreightDesc([]);
            setInsDesc([]);
            settcDesc([]);
            setomDesc([]);
            setoiDesc([]);
            setmcDesc([]);
            setldothers([]);
          }
        });
    }
  };

  useEffect(() => {
    localStorage.removeItem("terms");
    if (formik.values.ld_applicable_date == "NA") {
      formik.values.ld_applied_on = "";
      formik.values.ld_value = "";
      formik.values.po_min_value = "";
    }

    if (formik.values.warranty_guarantee_flag == "N") {
      formik.values.duration = "M";
      formik.values.dispatch_dt=true
      formik.values.comm_dt=true
      // formik.values.ld_value = "";
      // formik.values.po_min_value = "";
    }
    console.log(formik);
    // console.log(formik.values);

    localStorage.setItem("terms", JSON.stringify(formik.values));
  }, [formik.values]);
  return (
    <div className="py-2 px-4 mx-auto w-full lg:py-2">
      <h2 className="text-2xl text-green-900 font-bold my-3">
        Terms & Conditions
      </h2>
      <form onSubmit={formik.handleSubmit}>
              <BlockUI blocked={blocked} template={
                                    <div className='relative  w-full h-full 0 z-10'>
                                      <span className='absolute top-1 right-2 font-bold italic text-gray-500'><LockFilled className='text-green-900 '/> Locked</span>
                                       <span className='absolute bottom-1 right-1 font-bold italic text-gray-500'><UnlockFilled className='text-green-900 '/> Accessible to {localStorage.getItem("po_created_by")}</span>
                                    </div>
                                  } className={'bg-red-500'}>
        <div className={blocked?'p-2':''}>
        
        <div className={"grid gap-4 sm:grid-cols-10 sm:gap-6"}>
          <div className="sm:col-span-10">
            <TDInputTemplate
              placeholder="Price Basis"
              type="text"
              label="Price Basis"
              name="price_basis_flag"
              data={[
                { name: "FOR", code: "F" },
                { name: "EX-WORKS", code: "E" },
              ]}
              formControlName={formik.values.price_basis_flag}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={2}
              disabled={
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
            />
            {formik.errors.price_basis_flag &&
              formik.touched.price_basis_flag && (
                <VError title={formik.errors.price_basis_flag} />
              )}
          </div>
          <div className="sm:col-span-10">
            {/* {pricePlace} */}
            <Popover
              content={
                <>
                  <ul>
                    {pricePlace?.map((price) => (
                      <li className="my-2">
                        <Tag
                          className="cursor-pointer"
                          onClick={() => {
                            formik.setFieldValue(
                              "price_basis_desc",
                              price.price_basis_desc
                            );
                            handleOpenChange(false);
                          }}
                        >
                          {price.price_basis_desc}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                  <a onClick={hide}>Close</a>
                </>
              }
              title="Do you mean?"
              trigger="click"
              open={popOpen}
              onOpenChange={handleOpenChange}
            >
              <TDInputTemplate
                placeholder="Price Basis Description"
                type="text"
                label="Price Basis Description"
                name="price_basis_desc"
                formControlName={formik.values.price_basis_desc}
                // handleChange={formik.handleChange}

                handleChange={(e) => {
                  onChangePhrase(e);
                }}
                handleBlur={formik.handleBlur}
                mode={3}
                disabled={
                  localStorage.getItem("po_status") == "A" ||
                  localStorage.getItem("po_status") == "D" ||
                  localStorage.getItem("po_status") == "L"
                    ? true
                    : false
                }
              />
            </Popover>
            {formik.errors.price_basis_desc &&
              formik.touched.price_basis_desc && (
                <VError title={formik.errors.price_basis_desc} />
              )}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-6 sm:gap-6 mt-4">
          <div className={formik.values.packing_forwarding_val=='E'?"sm:col-span-2":"sm:col-span-6"}>
            <TDInputTemplate
              placeholder="Packing & Forwarding"
              type="number"
              label="Packing & Forwarding"
              name="packing_forwarding_val"
              data={[
                { name: "Inclusive", code: "I" },
                { name: "Extra(%)", code: "E" },
              ]}
              formControlName={formik.values.packing_forwarding_val}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              disabled={
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
              mode={2}
            />
            {formik.errors.packing_forwarding_val &&
              formik.touched.packing_forwarding_val && (
                <VError title={formik.errors.packing_forwarding_val} />
              )}
          </div>
          <div className="sm:col-span-2">
            {formik.values.packing_forwarding_val == "E" && (
              <TDInputTemplate
                placeholder="Packing & Forwarding Extra"
                type="number"
                label="Packing & Forwarding Extra"
                name="packing_forwarding_extra"
                disabled={
                  localStorage.getItem("po_status") == "A" ||
                  localStorage.getItem("po_status") == "D" ||
                  localStorage.getItem("po_status") == "L"
                    ? true
                    : false
                }
                formControlName={formik.values.packing_forwarding_extra}
                handleChange={(e) => onChangeExtra(e)}
                // handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
            )}
            {formik.errors.packing_forwarding_extra &&
              formik.touched.packing_forwarding_extra && (
                <VError title={formik.errors.packing_forwarding_extra} />
              )}
          </div>

          <div className="sm:col-span-2">
            {/* {grand_total} */}
            {formik.values.packing_forwarding_val == "E" && (
              <TDInputTemplate
                placeholder="Packing & Forwarding Extra Value"
                type="number"
                label="Packing & Forwarding Value"
                name="packing_forwarding_extra_val"
                disabled={
                  localStorage.getItem("po_status") == "A" ||
                  localStorage.getItem("po_status") == "D" ||
                  localStorage.getItem("po_status") == "L"
                    ? true
                    : false
                }
                // formControlName={(
                //   (+formik.values.packing_forwarding_extra * grand_total) /
                //   100
                // ).toFixed(2)}
                formControlName={formik.values.packing_forwarding_extra_val}
                handleChange={(e) => onChangeVal(e)}
                // handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
            )}
            {formik.errors.packing_forwarding_extra_val &&
              formik.touched.packing_forwarding_extra_val && (
                <VError title={formik.errors.packing_forwarding_extra_val} />
              )}
          </div>
          <div className="sm:col-span-1">
            {formik.values.packing_forwarding_val == "E" && (
              <>
                <TDInputTemplate
                  placeholder="Currency"
                  type="number"
                  label="Currency"
                  name="pf_currency"
                  // data={[{name:'Inclusive',code:"I"},{name:'Extra(%)',code:'E'}]}
                  formControlName={formik.values.pf_currency}
                  handleChange={(e) => onChangePfCurrency(e)}
                  handleBlur={formik.handleBlur}
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                      ? true
                      : false
                  }
                  data={[
                    { code: "I", name: "INR" },
                    { code: "U", name: "USD" },
                    { code: "E", name: "Euro" },
                  ]}
                  mode={2}
                />
              </>
            )}
            {formik.errors.pf_currency && formik.touched.pf_currency && (
              <VError title={formik.errors.pf_currency} />
            )}
          </div>
          <div className="sm:col-span-1">
            {formik.values.packing_forwarding_val == "E" && (
              <>
                <TDInputTemplate
                  placeholder="CGST"
                  type="number"
                  label="CGST"
                  name="pf_cgst"
                  // data={[{name:'Inclusive',code:"I"},{name:'Extra(%)',code:'E'}]}
                  formControlName={formik.values.pf_cgst}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L" ||
                    formik.values.pf_currency != "I" ||
                    (formik.values.pf_igst > 0 &&
                      formik.values.pf_igst != "IGST")
                      ? true
                      : false
                  }
                  data={cgstList}
                  mode={2}
                />
                {formik.values.pf_cgst > 0 &&
                  formik.values.pf_cgst != "CGST" && (
                    <Tag
                      className=" flex justify-center  w-1/2 px-2 my-2"
                      color="#eb8d00"
                    >
                      &#8377;{" "}
                      {(
                        (((+formik.values.packing_forwarding_extra *
                          grand_total) /
                          100) *
                          formik.values.pf_cgst) /
                        100
                      ).toFixed(2)}
                    </Tag>
                  )}
              </>
            )}
            {formik.errors.pf_cgst && formik.touched.pf_cgst && (
              <VError title={formik.errors.pf_cgst} />
            )}
          </div>
          <div className="sm:col-span-1">
            {formik.values.packing_forwarding_val == "E" && (
              <>
                <TDInputTemplate
                  placeholder="SGST"
                  type="number"
                  label="SGST"
                  name="pf_sgst"
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L" ||
                    formik.values.pf_currency != "I" ||
                    (formik.values.pf_igst > 0 &&
                      formik.values.pf_igst != "IGST")
                      ? true
                      : false
                  }
                  data={sgstList}
                  formControlName={formik.values.pf_sgst}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={2}
                />
                {formik.values.pf_sgst > 0 &&
                  formik.values.pf_sgst != "SGST" && (
                    <Tag
                      className=" flex justify-center  w-1/2 px-2 my-2"
                      color="#eb8d00"
                    >
                      &#8377;{" "}
                      {(
                        (((+formik.values.packing_forwarding_extra *
                          grand_total) /
                          100) *
                          formik.values.pf_sgst) /
                        100
                      ).toFixed(2)}
                    </Tag>
                  )}
              </>
            )}
            {formik.errors.pf_sgst && formik.touched.pf_sgst && (
              <VError title={formik.errors.pf_sgst} />
            )}
          </div>

          <div className="sm:col-span-1">
            {/* {grand_total} */}
            {formik.values.packing_forwarding_val == "E" && (
              <>
                <TDInputTemplate
                  placeholder="IGST"
                  type="number"
                  label="IGST"
                  name="pf_igst"
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L" ||
                    formik.values.pf_currency != "I" ||
                    formik.values.pf_cgst > 0 ||
                    formik.values.pf_sgst > 0
                      ? true
                      : false
                  }
                  data={igstList}
                  formControlName={formik.values.pf_igst}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={2}
                />
                {formik.values.pf_igst > 0 &&
                  formik.values.pf_igst != "IGST" && (
                    <Tag
                      className=" flex justify-center  w-1/2 px-2 my-2"
                      color="#eb8d00"
                    >
                      &#8377;{" "}
                      {(
                        (((+formik.values.packing_forwarding_extra *
                          grand_total) /
                          100) *
                          formik.values.pf_igst) /
                        100
                      ).toFixed(2)}
                    </Tag>
                  )}
              </>
            )}
            {formik.errors.pf_igst && formik.touched.pf_igst && (
              <VError title={formik.errors.pf_igst} />
            )}
          </div>
          <div className="sm:col-span-1">
            {/* {grand_total} */}
            {formik.values.packing_forwarding_val == "E" && (
              <TDInputTemplate
                placeholder="Total GST"
                type="number"
                label="Total GST"
                name="total_gst"
                disabled={true}
                formControlName={
                  formik.values.pf_igst > 0 && formik.values.pf_igst != "IGST"
                    ? (
                        (((+formik.values.packing_forwarding_extra *
                          grand_total) /
                          100) *
                          formik.values.pf_igst) /
                        100
                      ).toFixed(2)
                    : (
                        (((+formik.values.packing_forwarding_extra *
                          grand_total) /
                          100) *
                          formik.values.pf_sgst) /
                          100 +
                        (((+formik.values.packing_forwarding_extra *
                          grand_total) /
                          100) *
                          formik.values.pf_cgst) /
                          100
                      ).toFixed(2)
                }
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
            )}
            {/* {formik.errors.packing_forwarding_extra_val &&
              formik.touched.packing_forwarding_extra_val && (
                <VError title={formik.errors.packing_forwarding_extra_val} />
              )} */}
          </div>
          <div className="sm:col-span-1">
            {/* {grand_total} */}
            {formik.values.packing_forwarding_val == "E" && (
              <TDInputTemplate
                placeholder="Total Value with GST"
                type="number"
                label="Total with GST"
                name="packing_forwarding_extra_val"
                disabled={true}
                formControlName={
                  formik.values.pf_igst > 0 && formik.values.pf_igst != "IGST"
                    ? (
                        (((+formik.values.packing_forwarding_extra *
                          grand_total) /
                          100) *
                          formik.values.pf_igst) /
                          100 +
                        (formik.values.packing_forwarding_extra * grand_total) /
                          100
                      ).toFixed(2)
                    : (
                        (((+formik.values.packing_forwarding_extra *
                          grand_total) /
                          100) *
                          formik.values.pf_sgst) /
                          100 +
                        (((+formik.values.packing_forwarding_extra *
                          grand_total) /
                          100) *
                          formik.values.pf_cgst) /
                          100 +
                        (formik.values.packing_forwarding_extra * grand_total) /
                          100
                      ).toFixed(2)
                }
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
            )}
            {/* {formik.errors.packing_forwarding_extra_val &&
              formik.touched.packing_forwarding_extra_val && (
                <VError title={formik.errors.packing_forwarding_extra_val} />
              )} */}
          </div>
          <div className={formik.values.packing_forwarding_val=='E'?"sm:col-span-6":"sm:col-span-6 -mt-12"}>
            <TDInputTemplate
              placeholder="Freight"
              type="text"
              label="Freight"
              name="freight_insurance"
              data={[
                { name: "Inclusive", code: "I" },
                { name: "Extra", code: "E" },
              ]}
              disabled={
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
              formControlName={formik.values.freight_insurance}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={2}
            />
            {formik.errors.freight_insurance &&
              formik.touched.freight_insurance && (
                <VError title={formik.errors.freight_insurance} />
              )}
          </div>
          <Popover
            content={
              <>
                <ul>
                  {freightdesc?.map((price) => (
                    <li className="my-2">
                      <Tag
                        className="cursor-pointer"
                        onClick={() => {
                          formik.setFieldValue(
                            "freight_insurance_val",
                            price.freight_ins_val
                          );
                          handlefrOpenChange(false);
                        }}
                      >
                        {price.freight_ins_val}
                      </Tag>
                    </li>
                  ))}
                </ul>
                <a onClick={hidefr}>Close</a>
              </>
            }
            title="Do you mean?"
            trigger="click"
            open={popfrOpen}
            onOpenChange={handlefrOpenChange}
          >
            <div className="sm:col-span-6">
              <TDInputTemplate
                placeholder="Freight Description"
                type="text"
                label="Freight Description"
                name="freight_insurance_val"
                disabled={
                  localStorage.getItem("po_status") == "A" ||
                  localStorage.getItem("po_status") == "D" ||
                  localStorage.getItem("po_status") == "L"
                    ? true
                    : false
                }
                formControlName={formik.values.freight_insurance_val}
                handleChange={(e) => onChangePhrase(e)}
                handleBlur={formik.handleBlur}
                mode={3}
              />
              {formik.errors.freight_insurance_val &&
                formik.touched.freight_insurance_val && (
                  <VError title={formik.errors.freight_insurance_val} />
                )}
            </div>
          </Popover>
          {/*  */}
        </div>
        <div className="grid gap-4 sm:grid-cols-6 sm:gap-6 mt-4">
          <div className="sm:col-span-3">
            {formik.values.freight_insurance == "E" && (
              <TDInputTemplate
                placeholder="Freight Extra(%)"
                type="number"
                label="Freight Extra(%)"
                name="freight_extra"
                disabled={
                  localStorage.getItem("po_status") == "A" ||
                  localStorage.getItem("po_status") == "D" ||
                  localStorage.getItem("po_status") == "L"
                    ? true
                    : false
                }
                formControlName={formik.values.freight_extra}
                handleChange={(e) => onChangeExtraFr(e)}
                // handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
            )}
            {formik.errors.freight_extra && formik.touched.freight_extra && (
              <VError title={formik.errors.freight_extra} />
            )}
          </div>

          <div className="sm:col-span-3">
            {/* {grand_total} */}
            {formik.values.freight_insurance == "E" && (
              <TDInputTemplate
                placeholder="Freight Extra Value"
                type="number"
                label="Freight Extra Value"
                name="freight_extra_val"
                disabled={
                  localStorage.getItem("po_status") == "A" ||
                  localStorage.getItem("po_status") == "D" ||
                  localStorage.getItem("po_status") == "L"
                    ? true
                    : false
                }
                // formControlName={(
                //   (+formik.values.packing_forwarding_extra * grand_total) /
                //   100
                // ).toFixed(2)}
                formControlName={formik.values.freight_extra_val}
                handleChange={(e) => onChangeValFr(e)}
                // handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
            )}
            {formik.errors.freight_extra_val &&
              formik.touched.freight_extra_val && (
                <VError title={formik.errors.freight_extra_val} />
              )}
          </div>
          <div className="sm:col-span-1">
            {formik.values.freight_insurance == "E" && (
              <>
                <TDInputTemplate
                  placeholder="Currency"
                  type="number"
                  label="Currency"
                  name="freight_currency"
                  // data={[{name:'Inclusive',code:"I"},{name:'Extra(%)',code:'E'}]}
                  formControlName={formik.values.freight_currency}
                  handleChange={(e) => onChangePfCurrencyFr(e)}
                  handleBlur={formik.handleBlur}
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                      ? true
                      : false
                  }
                  data={[
                    { code: "I", name: "INR" },
                    { code: "U", name: "USD" },
                    { code: "E", name: "Euro" },
                  ]}
                  mode={2}
                />
              </>
            )}
            {formik.errors.freight_currency &&
              formik.touched.freight_currency && (
                <VError title={formik.errors.freight_currency} />
              )}
          </div>
          <div className="sm:col-span-1">
            {formik.values.freight_insurance == "E" && (
              <>
                <TDInputTemplate
                  placeholder="CGST"
                  type="number"
                  label="CGST"
                  name="freight_cgst"
                  // data={[{name:'Inclusive',code:"I"},{name:'Extra(%)',code:'E'}]}
                  formControlName={formik.values.freight_cgst}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L" ||
                    formik.values.freight_currency != "I" ||
                    (formik.values.freight_igst > 0 &&
                      formik.values.freight_igst != "IGST")
                      ? true
                      : false
                  }
                  data={cgstList}
                  mode={2}
                />
                {formik.values.freight_cgst > 0 &&
                  formik.values.freight_cgst != "CGST" && (
                    <Tag
                      className=" flex justify-center  w-1/2 px-2 my-2"
                      color="#eb8d00"
                    >
                      &#8377;{" "}
                      {(
                        (((+formik.values.freight_extra * grand_total) / 100) *
                          formik.values.freight_cgst) /
                        100
                      ).toFixed(2)}
                    </Tag>
                  )}
              </>
            )}
            {formik.errors.freight_cgst && formik.touched.freight_cgst && (
              <VError title={formik.errors.freight_cgst} />
            )}
          </div>
          <div className="sm:col-span-1">
            {formik.values.freight_insurance == "E" && (
              <>
                <TDInputTemplate
                  placeholder="SGST"
                  type="number"
                  label="SGST"
                  name="freight_sgst"
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L" ||
                    formik.values.freight_currency != "I" ||
                    (formik.values.freight_igst > 0 &&
                      formik.values.freight_igst != "IGST")
                      ? true
                      : false
                  }
                  data={sgstList}
                  formControlName={formik.values.freight_sgst}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={2}
                />
                {formik.values.freight_sgst > 0 &&
                  formik.values.freight_sgst != "SGST" && (
                    <Tag
                      className=" flex justify-center  w-1/2 px-2 my-2"
                      color="#eb8d00"
                    >
                      &#8377;{" "}
                      {(
                        (((+formik.values.freight_extra * grand_total) / 100) *
                          formik.values.freight_sgst) /
                        100
                      ).toFixed(2)}
                    </Tag>
                  )}
              </>
            )}
            {formik.errors.freight_sgst && formik.touched.freight_sgst && (
              <VError title={formik.errors.freight_sgst} />
            )}
          </div>

          <div className="sm:col-span-1">
            {/* {grand_total} */}
            {formik.values.freight_insurance == "E" && (
              <>
                <TDInputTemplate
                  placeholder="IGST"
                  type="number"
                  label="IGST"
                  name="freight_igst"
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L" ||
                    formik.values.freight_currency != "I" ||
                    formik.values.freight_cgst > 0 ||
                    formik.values.freight_sgst > 0
                      ? true
                      : false
                  }
                  data={igstList}
                  formControlName={formik.values.freight_igst}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={2}
                />
                {formik.values.freight_igst > 0 &&
                  formik.values.freight_igst != "IGST" && (
                    <Tag
                      className=" flex justify-center  w-1/2 px-2 my-2"
                      color="#eb8d00"
                    >
                      &#8377;{" "}
                      {(
                        (((+formik.values.freight_extra * grand_total) / 100) *
                          formik.values.freight_igst) /
                        100
                      ).toFixed(2)}
                    </Tag>
                  )}
              </>
            )}
            {formik.errors.freight_igst && formik.touched.freight_igst && (
              <VError title={formik.errors.freight_igst} />
            )}
          </div>
          <div className="sm:col-span-1">
            {/* {grand_total} */}
            {formik.values.freight_insurance == "E" && (
              <TDInputTemplate
                placeholder="Total GST"
                type="number"
                label="Total GST"
                name="total_gst_freight"
                disabled={true}
                formControlName={
                  formik.values.freight_igst > 0 &&
                  formik.values.freight_igst != "IGST"
                    ? (
                        (((+formik.values.freight_extra * grand_total) / 100) *
                          formik.values.freight_igst) /
                        100
                      ).toFixed(2)
                    : (
                        (((+formik.values.freight_extra * grand_total) / 100) *
                          formik.values.freight_sgst) /
                          100 +
                        (((+formik.values.freight_extra * grand_total) / 100) *
                          formik.values.freight_cgst) /
                          100
                      ).toFixed(2)
                }
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
            )}
            {/* {formik.errors.packing_forwarding_extra_val &&
              formik.touched.packing_forwarding_extra_val && (
                <VError title={formik.errors.packing_forwarding_extra_val} />
              )} */}
          </div>
          <div className="sm:col-span-1">
            {/* {grand_total} */}
            {formik.values.freight_insurance == "E" && (
              <TDInputTemplate
                placeholder="Total Value with GST"
                type="number"
                label="Total with GST"
                name="total_val_freight"
                disabled={true}
                formControlName={
                  formik.values.freight_igst > 0 &&
                  formik.values.freight_igst != "IGST"
                    ? (
                        (((+formik.values.freight_extra * grand_total) / 100) *
                          formik.values.freight_igst) /
                          100 +
                        (formik.values.freight_extra * grand_total) / 100
                      ).toFixed(2)
                    : (
                        (((+formik.values.freight_extra * grand_total) / 100) *
                          formik.values.freight_sgst) /
                          100 +
                        (((+formik.values.freight_extra * grand_total) / 100) *
                          formik.values.freight_cgst) /
                          100 +
                        (formik.values.freight_extra * grand_total) / 100
                      ).toFixed(2)
                }
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
            )}
            {/* {formik.errors.packing_forwarding_extra_val &&
              formik.touched.packing_forwarding_extra_val && (
                <VError title={formik.errors.packing_forwarding_extra_val} />
              )} */}
          </div>
        </div>
        <div className={formik.values.freight_insurance=='E'?"grid gap-4 sm:grid-cols-6 sm:gap-6 mt-4":"grid gap-4 sm:grid-cols-6 sm:gap-6 -mt-4"}>
          <div className="sm:col-span-6">
            <TDInputTemplate
              placeholder="Insurance"
              type="text"
              label="Insurance"
              name="insurance"
              data={[
                { name: "Yes", code: "Y" },
                { name: "No", code: "N" },
              ]}
              disabled={
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
              formControlName={formik.values.insurance}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={2}
            />
            {formik.errors.insurance && formik.touched.insurance && (
              <VError title={formik.errors.insurance} />
            )}
          </div>
          {formik.values.insurance == "Y" && (
            <Popover
              content={
                <>
                  <ul>
                    {insdesc?.map((price) => (
                      <li className="my-2">
                        <Tag
                          className="cursor-pointer"
                          onClick={() => {
                            formik.setFieldValue(
                              "insurance_val",
                              price.ins_val
                            );
                            handleinsOpenChange(false);
                          }}
                        >
                          {price.ins_val}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                  <a onClick={hideins}>Close</a>
                </>
              }
              title="Do you mean?"
              trigger="click"
              open={popinsOpen}
              onOpenChange={handleinsOpenChange}
            >
              <div className="sm:col-span-6">
                <TDInputTemplate
                  placeholder="Insurance Description"
                  type="text"
                  label="Insurance Description"
                  name="insurance_val"
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                      ? true
                      : false
                  }
                  formControlName={formik.values.insurance_val}
                  // handleChange={formik.handleChange}
                  handleChange={(e) => onChangePhrase(e)}
                  handleBlur={formik.handleBlur}
                  mode={3}
                />
                {formik.errors.insurance_val &&
                  formik.touched.insurance_val && (
                    <VError title={formik.errors.insurance_val} />
                  )}
              </div>
            </Popover>
          )}
          {/*  */}
        </div>
        <div className="grid gap-4 sm:grid-cols-6 sm:gap-6 mt-6">
          <div className="sm:col-span-3">
            {formik.values.insurance == "Y" && (
              <TDInputTemplate
                placeholder="Insurance Extra(%)"
                type="number"
                label="Insurance Extra(%)"
                name="ins_extra"
                disabled={
                  localStorage.getItem("po_status") == "A" ||
                  localStorage.getItem("po_status") == "D" ||
                  localStorage.getItem("po_status") == "L"
                    ? true
                    : false
                }
                formControlName={formik.values.ins_extra}
                handleChange={(e) => onChangeExtraIns(e)}
                // handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
            )}
            {formik.errors.ins_extra && formik.touched.ins_extra && (
              <VError title={formik.errors.ins_extra} />
            )}
          </div>

          <div className="sm:col-span-3">
            {/* {grand_total} */}
            {formik.values.insurance == "Y" && (
              <TDInputTemplate
                placeholder="Insurance Extra Value"
                type="number"
                label="Insurance Extra Value"
                name="ins_extra_val"
                disabled={
                  localStorage.getItem("po_status") == "A" ||
                  localStorage.getItem("po_status") == "D" ||
                  localStorage.getItem("po_status") == "L"
                    ? true
                    : false
                }
                // formControlName={(
                //   (+formik.values.packing_forwarding_extra * grand_total) /
                //   100
                // ).toFixed(2)}
                formControlName={formik.values.ins_extra_val}
                handleChange={(e) => onChangeValIns(e)}
                // handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
            )}
            {formik.errors.ins_extra_val && formik.touched.ins_extra_val && (
              <VError title={formik.errors.ins_extra_val} />
            )}
          </div>
          <div className="sm:col-span-1">
            {formik.values.insurance == "Y" && (
              <>
                <TDInputTemplate
                  placeholder="Currency"
                  type="number"
                  label="Currency"
                  name="ins_currency"
                  // data={[{name:'Inclusive',code:"I"},{name:'Extra(%)',code:'E'}]}
                  formControlName={formik.values.ins_currency}
                  handleChange={(e) => onChangePfCurrencyIns(e)}
                  handleBlur={formik.handleBlur}
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                      ? true
                      : false
                  }
                  data={[
                    { code: "I", name: "INR" },
                    { code: "U", name: "USD" },
                    { code: "E", name: "Euro" },
                  ]}
                  mode={2}
                />
              </>
            )}
            {formik.errors.ins_currency && formik.touched.ins_currency && (
              <VError title={formik.errors.ins_currency} />
            )}
          </div>
          <div className="sm:col-span-1">
            {formik.values.insurance == "Y" && (
              <>
                <TDInputTemplate
                  placeholder="CGST"
                  type="number"
                  label="CGST"
                  name="ins_cgst"
                  // data={[{name:'Inclusive',code:"I"},{name:'Extra(%)',code:'E'}]}
                  formControlName={formik.values.ins_cgst}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L" ||
                    formik.values.ins_currency != "I" ||
                    (formik.values.ins_igst > 0 &&
                      formik.values.ins_igst != "IGST")
                      ? true
                      : false
                  }
                  data={cgstList}
                  mode={2}
                />
                {formik.values.ins_cgst > 0 &&
                  formik.values.ins_cgst != "CGST" && (
                    <Tag
                      className=" flex justify-center  w-1/2 px-2 my-2"
                      color="#eb8d00"
                    >
                      &#8377;{" "}
                      {(
                        (((+formik.values.ins_extra * grand_total) / 100) *
                          formik.values.ins_cgst) /
                        100
                      ).toFixed(2)}
                    </Tag>
                  )}
              </>
            )}
            {formik.errors.ins_cgst && formik.touched.ins_cgst && (
              <VError title={formik.errors.ins_cgst} />
            )}
          </div>
          <div className="sm:col-span-1">
            {formik.values.insurance == "Y" && (
              <>
                <TDInputTemplate
                  placeholder="SGST"
                  type="number"
                  label="SGST"
                  name="ins_sgst"
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L" ||
                    formik.values.ins_currency != "I" ||
                    (formik.values.ins_igst > 0 &&
                      formik.values.ins_igst != "IGST")
                      ? true
                      : false
                  }
                  data={sgstList}
                  formControlName={formik.values.ins_sgst}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={2}
                />
                {formik.values.ins_sgst > 0 &&
                  formik.values.ins_sgst != "SGST" && (
                    <Tag
                      className=" flex justify-center  w-1/2 px-2 my-2"
                      color="#eb8d00"
                    >
                      &#8377;{" "}
                      {(
                        (((+formik.values.ins_extra * grand_total) / 100) *
                          formik.values.ins_sgst) /
                        100
                      ).toFixed(2)}
                    </Tag>
                  )}
              </>
            )}
            {formik.errors.ins_sgst && formik.touched.ins_sgst && (
              <VError title={formik.errors.ins_sgst} />
            )}
          </div>

          <div className="sm:col-span-1">
            {/* {grand_total} */}
            {formik.values.insurance == "Y" && (
              <>
                <TDInputTemplate
                  placeholder="IGST"
                  type="number"
                  label="IGST"
                  name="ins_igst"
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L" ||
                    formik.values.ins_currency != "I" ||
                    formik.values.ins_cgst > 0 ||
                    formik.values.ins_sgst > 0
                      ? true
                      : false
                  }
                  data={igstList}
                  formControlName={formik.values.ins_igst}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={2}
                />
                {formik.values.ins_igst > 0 &&
                  formik.values.ins_igst != "IGST" && (
                    <Tag
                      className=" flex justify-center  w-1/2 px-2 my-2"
                      color="#eb8d00"
                    >
                      &#8377;{" "}
                      {(
                        (((+formik.values.ins_extra * grand_total) / 100) *
                          formik.values.ins_igst) /
                        100
                      ).toFixed(2)}
                    </Tag>
                  )}
              </>
            )}
            {formik.errors.ins_igst && formik.touched.ins_igst && (
              <VError title={formik.errors.ins_igst} />
            )}
          </div>
          <div className="sm:col-span-1">
            {/* {grand_total} */}
            {formik.values.insurance == "Y" && (
              <TDInputTemplate
                placeholder="Total GST"
                type="number"
                label="Total GST"
                name="total_gst_ins"
                disabled={true}
                formControlName={
                  formik.values.ins_igst > 0 && formik.values.ins_igst != "IGST"
                    ? (
                        (((+formik.values.ins_extra * grand_total) / 100) *
                          formik.values.ins_igst) /
                        100
                      ).toFixed(2)
                    : (
                        (((+formik.values.ins_extra * grand_total) / 100) *
                          formik.values.ins_sgst) /
                          100 +
                        (((+formik.values.ins_extra * grand_total) / 100) *
                          formik.values.ins_cgst) /
                          100
                      ).toFixed(2)
                }
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
            )}
            {/* {formik.errors.packing_forwarding_extra_val &&
              formik.touched.packing_forwarding_extra_val && (
                <VError title={formik.errors.packing_forwarding_extra_val} />
              )} */}
          </div>
          <div className="sm:col-span-1">
            {/* {grand_total} */}
            {formik.values.insurance == "Y" && (
              <TDInputTemplate
                placeholder="Total Value with GST"
                type="number"
                label="Total with GST"
                name="total_val_ins"
                disabled={true}
                formControlName={
                  formik.values.ins_igst > 0 && formik.values.ins_igst != "IGST"
                    ? (
                        (((+formik.values.ins_extra * grand_total) / 100) *
                          formik.values.ins_igst) /
                          100 +
                        (formik.values.ins_extra * grand_total) / 100
                      ).toFixed(2)
                    : (
                        (((+formik.values.ins_extra * grand_total) / 100) *
                          formik.values.ins_sgst) /
                          100 +
                        (((+formik.values.ins_extra * grand_total) / 100) *
                          formik.values.ins_cgst) /
                          100 +
                        (formik.values.ins_extra * grand_total) / 100
                      ).toFixed(2)
                }
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
            )}
            {/* {formik.errors.packing_forwarding_extra_val &&
              formik.touched.packing_forwarding_extra_val && (
                <VError title={formik.errors.packing_forwarding_extra_val} />
              )} */}
          </div>
        </div>
        <div className={formik.values.insurance=='Y'?"grid gap-4 sm:grid-cols-10 sm:gap-6 mt-4" : "grid gap-4 sm:grid-cols-10 sm:gap-6 -mt-6"} >
          <div className="sm:col-span-10">
            <TDInputTemplate
              placeholder="Test Certificate"
              type="text"
              label="Test Certificate"
              name="test_certificate"
              disabled={
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
              formControlName={formik.values.test_certificate}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              data={[
                { code: "Y", name: "Yes" },
                { code: "N", name: "No" },
              ]}
              mode={2}
            />
            {formik.errors.test_certificate &&
              formik.touched.test_certificate && (
                <VError title={formik.errors.test_certificate} />
              )}
          </div>
          <Popover
            content={
              <>
                <ul>
                  {tcdesc?.map((price) => (
                    <li className="my-2">
                      <Tag
                        className="cursor-pointer"
                        onClick={() => {
                          formik.setFieldValue(
                            "test_certificate_desc",
                            price.test_certificate_desc
                          );
                          handletcOpenChange(false);
                        }}
                      >
                        {price.test_certificate_desc}
                      </Tag>
                    </li>
                  ))}
                </ul>
                <a onClick={hidetc}>Close</a>
              </>
            }
            title="Do you mean?"
            trigger="click"
            open={poptcOpen}
            onOpenChange={handletcOpenChange}
          >
            <div className="sm:col-span-10">
              {formik.values.test_certificate == "Y" && (
                <TDInputTemplate
                  placeholder="Test Certificate Description"
                  type="text"
                  label="Test Certificate Description"
                  name="test_certificate_desc"
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                      ? true
                      : false
                  }
                  formControlName={formik.values.test_certificate_desc}
                  // handleChange={formik.handleChange}
                  handleChange={(e) => onChangePhrase(e)}
                  handleBlur={formik.handleBlur}
                  mode={3}
                />
              )}
              {formik.errors.test_certificate_desc &&
                formik.touched.test_certificate_desc && (
                  <VError title={formik.errors.test_certificate_desc} />
                )}
            </div>
          </Popover>
          <div className={ formik.values.test_certificate == "Y"?"sm:col-span-2":"sm:col-span-2 -mt-5"}>
            <TDInputTemplate
              placeholder="LD applicable date"
              type="date"
              label="LD applicable date"
              name="ld_applicable_date"
              data={[
                { name: "Required Delivery Date", code: "M" },
                { name: "Dispatch Date", code: "D" },
                { name: "Others", code: "O" },
                { name: "Not Applicable", code: "NA" },
              ]}
              disabled={
                // localStorage.getItem("amend_flag") == "Y" ||
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
              formControlName={formik.values.ld_applicable_date}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={2}
            />
            {formik.errors.ld_applicable_date &&
              formik.touched.ld_applicable_date && (
                <VError title={formik.errors.ld_applicable_date} />
              )}
          </div>
          <div className="sm:col-span-2"></div>

          <div className={ formik.values.test_certificate == "Y"?"sm:col-span-2":"sm:col-span-2 -mt-5"}>
            <TDInputTemplate
              placeholder="LD value applied on"
              type="text"
              label="LD value applied on"
              name="ld_applied_on"
              disabled={
                // localStorage.getItem("amend_flag") == "Y" ||
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L" ||
                formik.values.ld_applicable_date == "NA"
                  ? true
                  : false
              }
              data={[
                { code: "T", name: "PO Total Value" },
                { code: "P", name: "Pending Material Value" },
                { name: "Others", code: "O" },
              ]}
              formControlName={formik.values.ld_applied_on}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={2}
            />
            {formik.errors.ld_applied_on && formik.touched.ld_applied_on && (
              <VError title={formik.errors.ld_applied_on} />
            )}
          </div>
          <div className="sm:col-span-2"></div>
          <div className={ formik.values.test_certificate == "Y"?"sm:col-span-2":"sm:col-span-2 -mt-5"}>
            <TDInputTemplate
              placeholder="LD value (%)"
              type="number"
              label="LD value (%)"
              name="ld_value"
              disabled={
                // localStorage.getItem("amend_flag") == "Y" ||
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L" ||
                formik.values.ld_applicable_date == "NA"
                  ? true
                  : false
              }
              formControlName={formik.values.ld_value}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={1}
            />
            {formik.errors.ld_value && formik.touched.ld_value && (
              <VError title={formik.errors.ld_value} />
            )}
          </div>
          <Popover
            content={
              <>
                <ul>
                  {ldothers?.map((price) => (
                    <li className="my-2">
                      <Tag
                        className="cursor-pointer"
                        onClick={() => {
                          formik.setFieldValue("others_ld", price.ld_date_desc);
                          handleldothersOpenChange(false);
                        }}
                      >
                        {price.ld_date_desc}
                      </Tag>
                    </li>
                  ))}
                </ul>
                <a onClick={hideldothers}>Close</a>
              </>
            }
            title="Do you mean?"
            trigger="click"
            open={popldOthersOpen}
            onOpenChange={handleldothersOpenChange}
          >
            <div className="sm:col-span-10">
              {formik.values.ld_applicable_date == "O" && (
                <TDInputTemplate
                  placeholder="Others (LD Applicable Date)"
                  type="text"
                  label="Others (LD Applicable Date)"
                  name="others_ld"
                  disabled={
                    // localStorage.getItem("amend_flag") == "Y" ||
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L" ||
                    formik.values.ld_applicable_date == "NA"
                      ? true
                      : false
                  }
                  formControlName={formik.values.others_ld}
                  handleChange={(e) => onChangePhrase(e)}
                  handleBlur={formik.handleBlur}
                  mode={3}
                />
              )}
              {formik.errors.others_ld && formik.touched.others_ld && (
                <VError title={formik.errors.others_ld} />
              )}
            </div>
          </Popover>
          <Popover
            content={
              <>
                <ul>
                  {ldval?.map((price) => (
                    <li className="my-2">
                      <Tag
                        className="cursor-pointer"
                        onClick={() => {
                          formik.setFieldValue(
                            "others_applied",
                            price.ld_val_desc
                          );
                          handleldvalOpenChange(false);
                        }}
                      >
                        {price.ld_val_desc}
                      </Tag>
                    </li>
                  ))}
                </ul>
                <a onClick={hideldval}>Close</a>
              </>
            }
            title="Do you mean?"
            trigger="click"
            open={popldvalOpen}
            onOpenChange={handleldvalOpenChange}
          >
            <div className="sm:col-span-10">
              {formik.values.ld_applied_on == "O" &&
                formik.values.ld_applicable_date != "NA" && (
                  <TDInputTemplate
                    placeholder="Others (LD Value applied on)"
                    type="text"
                    label="Others (LD Value applied on)"
                    name="others_applied"
                    disabled={
                      // localStorage.getItem("amend_flag") == "Y" ||
                      localStorage.getItem("po_status") == "A" ||
                      localStorage.getItem("po_status") == "D" ||
                      localStorage.getItem("po_status") == "L" ||
                      formik.values.ld_applicable_date == "NA"
                        ? true
                        : false
                    }
                    formControlName={formik.values.others_applied}
                    handleChange={(e) => onChangePhrase(e)}
                    handleBlur={formik.handleBlur}
                    mode={3}
                  />
                )}
              {formik.errors.others_applied &&
                formik.touched.others_applied && (
                  <VError title={formik.errors.others_applied} />
                )}
            </div>
          </Popover>
          <div className={ formik.values.ld_applicable_date == "O" || formik.values.ld_applied_on == "O" ?"sm:col-span-10":"sm:col-span-10 -mt-10"}>
            <TDInputTemplate
              placeholder="Maximum % on PO value"
              type="number"
              label="Maximum % on PO value"
              name="po_min_value"
              disabled={
                // localStorage.getItem("amend_flag") == "Y" ||
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L" ||
                formik.values.ld_applicable_date == "NA"
                  ? true
                  : false
              }
              formControlName={formik.values.po_min_value}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={1}
            />
            {formik.errors.po_min_value && formik.touched.po_min_value && (
              <VError title={formik.errors.po_min_value} />
            )}
          </div>

          <div className="sm:col-span-5">
            <TDInputTemplate
              placeholder="Warranty/Guarantee"
              type="text"
              label="Warranty/Guarantee"
              name="warranty_guarantee_flag"
              data={[
                { code: "N", name: "None" },
                { code: "W", name: "Warranty" },
                { code: "G", name: "Guarantee" },
              ]}
              disabled={
                // localStorage.getItem("amend_flag") == "Y" ||
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
              formControlName={formik.values.warranty_guarantee_flag}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={2}
            />
            {formik.errors.warranty_guarantee_flag &&
              formik.touched.warranty_guarantee_flag && (
                <VError title={formik.errors.warranty_guarantee_flag} />
              )}
          </div>

          <div className="sm:col-span-5 flex justify-start gap-2 mt-7">
            {/* {(formik.values.warranty_guarantee_flag == "W" || formik.values.warranty_guarantee_flag == "G") && ( */}
              <>
                <p>
                  <Checkbox
                    checked={formik.values.dispatch_dt}
                    name="dispatch_dt"
                    disabled={
                      // localStorage.getItem("amend_flag") == "Y" ||
                      localStorage.getItem("po_status") == "A" ||
                      localStorage.getItem("po_status") == "D" ||
                      localStorage.getItem("po_status") == "L"
                    }
                    onChange={formik.handleChange}
                  >
                    Date of dispatch
                  </Checkbox>
                </p>
                <p>
                  <Checkbox
                    checked={formik.values.comm_dt}
                    name="comm_dt"
                    disabled={
                      // localStorage.getItem("amend_flag") == "Y" ||
                      localStorage.getItem("po_status") == "A" ||
                      localStorage.getItem("po_status") == "D" ||
                      localStorage.getItem("po_status") == "L"
                    }
                    onChange={formik.handleChange}
                  >
                    Date of commission
                  </Checkbox>
                  {formik.values.dispatch_dt && formik.values.comm_dt && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 60 }}
                    >
                      <Tag className="ml-3" color="#b71c1c">
                        Whichever is earlier.
                      </Tag>
                    </motion.span>
                  )}
                </p>
              </>
            {/* // )} */}
          </div>
          <div className="sm:col-span-5">
            <TDInputTemplate
              placeholder="Duration"
              type="date"
              label="Duration"
              name="duration"
              data={[
                { code: "D", name: "Day" },
                { code: "M", name: "Month" },
                { name: "Year", code: "Y" },
              ]}
              formControlName={formik.values.duration}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={2}
              disabled={
                // localStorage.getItem("amend_flag") == "Y" ||
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
            />
            {formik.errors.duration && formik.touched.duration && (
              <VError title={formik.errors.duration} />
            )}
          </div>
       <div className={formik.values.warranty_guarantee_flag=='N'?"sm:col-span-2":"sm:col-span-5"}>
            <TDInputTemplate
              placeholder={formik.values.warranty_guarantee_flag!='N'?"Duration Value":'Commission Date'}
              type="text"
              label={formik.values.warranty_guarantee_flag!='N'?"Duration Value":'Commission Date'}
              name="duration_val"
              disabled={
                // localStorage.getItem("amend_flag") == "Y" ||
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
              formControlName={formik.values.duration_val}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={1}
            />
            {formik.errors.duration_val && formik.touched.duration_val && (
              <VError title={formik.errors.duration_val} />
            )}
          </div>

          {formik.values.warranty_guarantee_flag=='N' && <div className="sm:col-span-2">
            <TDInputTemplate
              placeholder='Dispatch Date'
              type="text"
              label="Dispatch Date"
              name="duration_val_to"
              disabled={
                // localStorage.getItem("amend_flag") == "Y" ||
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
              formControlName={formik.values.duration_val_to}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={1}
            />
            {formik.errors.duration_val_to && formik.touched.duration_val_to && (
              <VError title={formik.errors.duration_val_to} />
            )}
          </div>
}
          <div className="sm:col-span-5">
            <TDInputTemplate
              placeholder="O&M Manual"
              type="text"
              label="O&M Manual"
              name="om_manual_flag"
              data={[
                { name: "Applicable", code: "A" },
                { name: "Not Applicable", code: "NA" },
              ]}
              disabled={
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
              formControlName={formik.values.om_manual_flag}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={2}
            />
            {formik.errors.om_manual_flag && formik.touched.om_manual_flag && (
              <VError title={formik.errors.om_manual_flag} />
            )}
          </div>
         
          <div className="sm:col-span-5">
            <TDInputTemplate
              placeholder="Operation/Installation"
              type="text"
              label="Operation/Installation"
              name="oi_flag"
              data={[
                { name: "Applicable", code: "A" },
                { name: "Not Applicable", code: "NA" },
              ]}
              formControlName={formik.values.oi_flag}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={2}
              disabled={
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
            />
            {formik.errors.oi_flag && formik.touched.oi_flag && (
              <VError title={formik.errors.oi_flag} />
            )}
          </div>
          <div className="sm:col-span-5">
            <Popover
              content={
                <>
                  <ul>
                    {omdesc?.map((price) => (
                      <li className="my-2">
                        <Tag
                          className="cursor-pointer"
                          onClick={() => {
                            formik.setFieldValue(
                              "om_manual_desc",
                              price.o_m_desc
                            );
                            handleomOpenChange(false);
                          }}
                        >
                          {price.o_m_desc}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                  <a onClick={hideom}>Close</a>
                </>
              }
              title="Do you mean?"
              trigger="click"
              open={popomOpen}
              onOpenChange={handleomOpenChange}
            >
              {formik.values.om_manual_flag == "A" && (
                <TDInputTemplate
                  placeholder="O&M Manual Description"
                  type="text"
                  label="O&M Manual Description"
                  name="om_manual_desc"
                  formControlName={formik.values.om_manual_desc}
                  // handleChange={formik.handleChange}
                  handleChange={(e) => onChangePhrase(e)}
                  handleBlur={formik.handleBlur}
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                      ? true
                      : false
                  }
                  mode={3}
                />
              )}
              {formik.errors.om_manual_desc &&
                formik.touched.om_manual_desc && (
                  <VError title={formik.errors.om_manual_desc} />
                )}
            </Popover>
          </div>
          <div className="sm:col-span-5">
            <Popover
              content={
                <>
                  <ul>
                    {oidesc?.map((price) => (
                      <li className="my-2">
                        <Tag
                          className="cursor-pointer"
                          onClick={() => {
                            formik.setFieldValue(
                              "oi_desc",
                              price.operation_installation_desc
                            );
                            handleoiOpenChange(false);
                          }}
                        >
                          {price.operation_installation_desc}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                  <a onClick={hideoi}>Close</a>
                </>
              }
              title="Do you mean?"
              trigger="click"
              open={popoiOpen}
              onOpenChange={handleoiOpenChange}
            >
              {formik.values.oi_flag == "A" && (
                <TDInputTemplate
                  placeholder="Operation/Installation Description"
                  type="text"
                  label="Operation/Installation Description"
                  name="oi_desc"
                  formControlName={formik.values.oi_desc}
                  // handleChange={formik.handleChange}
                  handleChange={(e) => onChangePhrase(e)}
                  handleBlur={formik.handleBlur}
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                      ? true
                      : false
                  }
                  mode={3}
                />
              )}
              {formik.errors.oi_desc && formik.touched.oi_desc && (
                <VError title={formik.errors.oi_desc} />
              )}
            </Popover>
          </div>
         
          <div className="sm:col-span-5 -mt-3">
            <TDInputTemplate
              placeholder="Packing type"
              type="text"
              label="Packing type"
              name="packing_type"
              formControlName={formik.values.packing_type}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              disabled={
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
              data={[
                { code: "W", name: "Wooden" },
                { code: "P", name: "Plastic Wrap" },
                { code: "S", name: "Steel-worthy" },
                { code: "C", name: "Crate Packing" },
                { code: "O", name: "Others" },
              ]}
              mode={2}
            />
            {formik.errors.packing_type && formik.touched.packing_type && (
              <VError title={formik.errors.packing_type} />
            )}
          </div>
          <div className="sm:col-span-5 -mt-3">
            <TDInputTemplate
              placeholder="Manufacture Clearance"
              type="text"
              label="Manufacture Clearance"
              name="manufacture_clearance"
              data={[
                { name: "Applicable", code: "A" },
                { name: "Not Applicable", code: "NA" },
              ]}
              formControlName={formik.values.manufacture_clearance}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              disabled={
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L"
                  ? true
                  : false
              }
              mode={2}
            />
            {formik.errors.manufacture_clearance &&
              formik.touched.manufacture_clearance && (
                <VError title={formik.errors.manufacture_clearance} />
              )}
          </div>
          
          <div className="sm:col-span-5 ">
            {formik.values.packing_type == "O" && (
              <TDInputTemplate
                placeholder="Packing type description"
                type="text"
                label="Packing Type Description"
                name="packing_val"
                formControlName={formik.values.packing_val}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                disabled={
                  localStorage.getItem("po_status") == "A" ||
                  localStorage.getItem("po_status") == "D" ||
                  localStorage.getItem("po_status") == "L"
                    ? true
                    : false
                }
                mode={3}
              />
            )}

            {formik.errors.packing_val && formik.touched.packing_val && (
              <VError title={formik.errors.packing_val} />
            )}
          </div>

          
         
          <div className="sm:col-span-5 ">
            <Popover
              content={
                <>
                  <ul>
                    {mcdesc?.map((price) => (
                      <li className="my-2">
                        <Tag
                          className="cursor-pointer"
                          onClick={() => {
                            formik.setFieldValue(
                              "manufacture_clearance_desc",
                              price.manufacture_clearance_desc
                            );
                            handlemcOpenChange(false);
                          }}
                        >
                          {price.manufacture_clearance_desc}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                  <a onClick={hidemc}>Close</a>
                </>
              }
              title="Do you mean?"
              trigger="click"
              open={popmcOpen}
              onOpenChange={handlemcOpenChange}
            >
              {formik.values.manufacture_clearance == "A" && (
                <TDInputTemplate
                  placeholder="Manufacture Clearance Description"
                  type="text"
                  label="Manufacture Clearance Description"
                  name="manufacture_clearance_desc"
                  formControlName={formik.values.manufacture_clearance_desc}
                  // handleChange={formik.handleChange}
                  handleChange={(e) => onChangePhrase(e)}
                  handleBlur={formik.handleBlur}
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L"
                      ? true
                      : false
                  }
                  mode={3}
                />
              )}
              {formik.errors.manufacture_clearance_desc &&
                formik.touched.manufacture_clearance_desc && (
                  <VError title={formik.errors.manufacture_clearance_desc} />
                )}
            </Popover>
          </div>
        </div>
        </div>
        </BlockUI>
        <div className="flex pt-4 justify-between w-full">
          <button
            type="button"
            className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-[#92140C] bg-[#92140C] transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 rounded-full  dark:focus:ring-primary-900"
            onClick={pressBack}
          > <ArrowLeftOutlined className="mr-1"/>
            Back
          </button>
          <button
            type="submit"
            className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
          >
            Next <ArrowRightOutlined className="ml-1"/>
          </button>
        </div>
        
      </form>
    </div>
  );
}

export default TermsConditions;
