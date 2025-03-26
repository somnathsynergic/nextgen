import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import BtnComp from "../../../Components/BtnComp";
import HeadingTemplate from "../../../Components/HeadingTemplate";
import VError from "../../../Components/VError";
import TDInputTemplate from "../../../Components/TDInputTemplate";
import { BlockUI } from 'primereact/blockui';

import { useNavigate } from "react-router-dom";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Message } from "../../../Components/Message";
import { url } from "../../../Address/BaseUrl";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Radio } from "antd";
import AuditTrail from "../../../Components/AuditTrail";
// import { Button } from 'primereact/button';
import { useReactToPrint } from "react-to-print";
import PrintHeader from "../../../Components/PrintHeader";
function VendorForm() {
  const stepperRef = useRef(null);
  const contentRef = useRef(null);
         const [isPrinting, setIsPrinting] = useState(true);
       
          const reactToPrintFn = useReactToPrint({
          contentRef
         });
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [msmeList, setMsmeList] = useState([]);
  const [msmeVal, setmsmeVal] = useState(false);
  const [tdsPercTrue, setTdsPercTrue] = useState(false);
  const [tcsPercTrue, setTcsPercTrue] = useState(false);
  const [compositeTrue, setCompositeTrue] = useState(false);
  const [stateTrue, setStateTrue] = useState(false);
  const [gstNoTrue, setGstNoTrue] = useState(false);
  const [exFlag, setExempted] = useState(false);
  const [cat, setCat] = useState([]);
  const [count, setCount] = useState(0);
  const [vendordeals,setVendorDeals] = useState([]);
  const [vendorpoc,setVendorPoc] = useState([]);
  const [vendorbank,setVendorBank] = useState([]);
   const [blocked, setBlocked] = useState(false);
   const det = JSON.parse(localStorage.getItem('perm'))

  console.log(params, "params");
  var categories = [];

  // const [msmeValue,setmsmeValue] = useState('')

  let msmeOptions = [
    { code: "Y", name: "Yes" },
    { code: "N", name: "No" },
  ];

  const handleChangeMsme = (event, handleChange) => {
    // console.log("Custom handleChange logic for", event.target.name, event.target.value);
    handleChange(event);
    const value = event.target.value;
    if (value === "Y") {
      setmsmeVal(true);
    } else {
      setmsmeVal(false);
    }
  };
  const handleChangetds = (event, handleChange) => {
    handleChange(event);
    const value = event.target.value;
    if (value === "Y") {
      setTdsPercTrue(true);
    } else {
      setTdsPercTrue(false);
    }
  };
  const handleChangetcs = (event, handleChange) => {
    handleChange(event);
    const value = event.target.value;
    if (value === "Y") {
      setTcsPercTrue(true);
    } else {
      setTcsPercTrue(false);
    }
  };
  const handleChangeSupply = (event, handleChange) => {
    handleChange(event);
    const value = event.target.value;
    if (value === "R") {
      setGstNoTrue(true);
      setCompositeTrue(true);
      setStateTrue(true);
      setExempted(true);
    } else if (value === "U") {
      setCompositeTrue(false);
      setStateTrue(true);
      setExempted(false);
      setGstNoTrue(false);
    } else {
      setCompositeTrue(false);
      setStateTrue(false);
      setGstNoTrue(false);
      setExempted(false);
    }
  };
  // const handleChangemsme = (e) => {
  //   const value = e.target.value;
  //   setmsmeValue(value);
  //   if (value === 'Y') {
  //     setmsmeVal(true);
  //   } else {
  //     setmsmeVal(false);
  //   }
  // };

  const [formValues, setValues] = useState({
    v_type:"",
    v_name: "",
    v_email: "",
    v_phone: "",
    v_gst: "",
    v_pan: "",
    v_msme: "",
    v_msmeno: "",
    v_bankdtls: "",
    v_remarks: "",
    v_address: "",
    v_tan: "",
    dynamicFields_bank: [
      {
        sl_no: 0,
        v_banknm: "",
        v_brnnm: "",
        v_ifsc: "",
        v_micr: "",
        v_ac: "",
      },
    ],
    // v_brnnm:"",
    dynamicFields_category: [
      {
        sl_no: 0,
        category_id: "",
      },
    ],
    dynamicFields: [
      {
        sl_no: 0,
        poc_name: "",
        poc_ph_1: "",
        poc_ph_2: "",
        poc_email: "",
      },
    ],
  });

  const initialValues = {
    v_type:"",
    v_name: "",
    v_email: "",
    v_phone: "",
    v_gst: "",
    v_pan: "",
    // v_reg: "",
    v_msme: "",
    v_msmeno: "",
    // v_banknm: "",
    // v_brnnm:"",
    // v_ifsc:"",
    // v_micr:"",
    // v_ac:"",
    v_tan: "",
    v_tds: "",
    tds_perc: "",
    v_tcs: "",
    tcs_perc: "",
    supply_flag: "",
    v_composite: "",
    v_e_r_supply: "",
    v_state: "",
    v_address: "",
    dynamicFields: [
      {
        sl_no: 0,
        poc_name: "",
        poc_ph_1: "",
        poc_ph_2: "",
        poc_email: "",
      },
    ],
    dynamicFields_bank: [
      {
        sl_no: 0,
        v_banknm: "",
        v_brnnm: "",
        v_ifsc: "",
        v_micr: "",
        v_ac: "",
      },
    ],
    dynamicFields_category: [
      {
        sl_no: 0,
        category_id: "",
      },
    ],
  };

  const validationSchema = Yup.object({
    v_type: Yup.string().required("Type is required"),
    v_name: Yup.string().required("Name is required"),
    v_phone: Yup.string()
      .required("Phone is required")
      .length(10, "Must be 10 digits!")
      .matches(/^[2-9]{2}[0-9]{8}$/, "Invalid phone no."),
    v_email: Yup.string()
      .required("Email is required")
      .email("Incorrect format!"),
    v_pan: Yup.string().matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Incorrect format"
    ),
    v_tan:Yup.string().matches(/^[A-Za-z]{4}[0-9]{5}[A-Za-z]{1}$/,'Incorrect format'),
    // v_msme: Yup.string().required("MSME is required"),
    v_msmeno: Yup.string().when("v_msme", {
      is: "Y",
      then: () => Yup.string().required("MSME No. is required"),
      otherwise: () => Yup.string(),
    }),
    dynamicFields_bank: Yup.array().of(
      Yup.object().shape({
        v_brnnm: Yup.string().required("Branch name required"),
        v_micr: Yup.string().matches(/^[0-9]{1,9}$/, "Invalid MICR!"),
        v_banknm: Yup.string().required("Bank name required"),
        v_ac: Yup.string()
          .required("Account no. required")
          .matches(/^[0-9]{9,18}$/, "Invalid account no.!"),
        v_ifsc: Yup.string()
          .required("IFSC required")
          .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Incorrect format!"),
      })
    ),
    // v_tds: Yup.string().required("TDS is required"),
    tds_perc: Yup.number().when("v_tds", {
      is: "Y",
      then: () =>
        Yup.number()
          .required("TDS percentage is required")
          .max(100, "Invalid value!")
          .min(0.00001, "Invalid Value"),
          // .matches(/^[0-9.]+$/, "Invalid value"),
      otherwise: () => Yup.string(),
    }),
    // v_tcs: Yup.string().required("TCS is required"),
    tcs_perc: Yup.number().when("v_tcs", {
      is: "Y",
      then: () =>
        Yup.number()
          .required("TCS percentage is required")
          .max(100, "Invalid value!")
          .min(0.00001, "Invalid Value"),
          // .matches(/^[0-9.]+$/, "Invalid value"),
      otherwise: () => Yup.string(),
    }),
    supply_flag: Yup.string().required("Required"),
    v_gst: Yup.string().when("supply_flag", {
      is: "R",
      then: () =>
        Yup.string()
          .matches(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            "Incorrect format!"
          )
          .required("GST is required!"),
    }),
    v_composite: Yup.string().when("supply_flag", {
      is: "R",
      then: () => Yup.string().required("Required!"),
    }),
    v_state: Yup.string().when("supply_flag", {
      is: (val) => val === "R" || val === "U",
      then: () => Yup.string().required("State is required"),
    }),
    v_e_r_supply: Yup.string().when("v_composite", {
      is: "O",
      then: () => Yup.string().required("Required!"),
    }),
    v_address: Yup.string().required("Address is required"),
    dynamicFields: Yup.array().of(
      Yup.object().shape({
        poc_name: Yup.string().required("Contact person is required"),
        poc_ph_1: Yup.string()
          .required("Phone is required")
          .length(10, "Must be 10 digits!")
          .matches(/^[2-9]{2}[0-9]{8}$/, "Invalid phone no."),
        poc_ph_2: Yup.string()
          .length(10, "Must be 10 digits!")
          .matches(/^[2-9]{2}[0-9]{8}$/, "Invalid phone no."),
        poc_email: Yup.string()
          .required("Email is required")
          .email("Incorrect format!"),
      })
    ),
    dynamicFields_category: Yup.array().of(
      Yup.object().shape({
        category_id: Yup.string().required("Deals in required"),
      })
    ),
  });

  useEffect(() => {
    setBlocked(det.masters==1?true:false)

    setMsmeList(msmeOptions);
    axios.post(url + "/api/getcategory", { id: 0 }).then((res) => {
      for (let i = 0; i < res?.data?.msg?.length; i++) {
        categories.push({
          name: res?.data?.msg[i].catg_name,
          code: res?.data?.msg[i].sl_no,
        });
      }
      setCat(categories);
    });

    if (+params.id > 0) {
      setLoading(true);

      axios
        .post(url + "/api/getvendor", { id: params.id })
        .then((resVendor) => {
          setData(resVendor.data?.msg);

          axios
            .post(url + "/api/getvendorbank", { id: params.id })
            .then((resBank) => {
              setVendorBank(resBank.data.msg);
              axios
                .post(url + "/api/getvendordeals", {
                  id: params.id,
                })
                .then((resDeals) => {
                  setVendorDeals(resDeals.data.msg);
                  axios
                    .post(url + "/api/getvendorpoc", { id: params.id })
                    .then((resPoc) => {
                      setVendorPoc(resPoc.data.msg);
                      setmsmeVal(
                        resVendor.data.msg.msme_flag == "Y" ? true : false
                      );
                      setTdsPercTrue(
                        resVendor.data.msg.tds_flag == "Y" ? true : false
                      );
                      setTcsPercTrue(
                        resVendor.data.msg.tcs_flag == "Y" ? true : false
                      );
                      if (resVendor.data.msg.supply_flag === "R") {
                        setGstNoTrue(true);
                        setCompositeTrue(true);
                        setStateTrue(true);
                        setExempted(true);
                      } else if (resVendor.data.msg.supply_flag === "U") {
                        setCompositeTrue(false);
                        setStateTrue(true);
                        setExempted(false);
                        setGstNoTrue(false);
                      } else {
                        setCompositeTrue(false);
                        setStateTrue(false);
                        setGstNoTrue(false);
                        setExempted(false);
                      }
                      setValues((prevValues) => ({
                        ...prevValues,
                        v_type:resVendor.data.msg.vendor_type,
                        v_name: resVendor.data.msg.vendor_name,
                        v_email: resVendor.data.msg.vendor_email,
                        v_phone: resVendor.data.msg.vendor_phone,
                        v_gst: resVendor.data.msg.vendor_gst,
                        v_pan: resVendor.data.msg.vendor_pan,
                        v_msme: resVendor.data.msg.vendor_msme,
                        v_msmeno: resVendor.data.msg.v_msmeno,
                        v_remarks: resVendor.data.msg.vendor_remarks,
                        v_address: resVendor.data.msg.vendor_address,
                        v_msme: resVendor.data.msg.msme_flag,
                        v_msmeno: resVendor.data.msg.msme_no,
                        v_bankdtls: resVendor.data.msg.bank_details,
                        v_tan: resVendor.data.msg.tan_no,
                        v_tds: resVendor.data.msg.tds_flag,
                        tds_perc: resVendor.data.msg.tds_prtg,
                        v_tcs: resVendor.data.msg.tcs_flag,
                        tcs_perc: resVendor.data.msg.tcs_prtg,
                        supply_flag: resVendor.data.msg.supply_flag,
                        v_composite: resVendor.data.msg.org_type,
                        v_e_r_supply: resVendor.data.msg.e_r_supply,
                        v_state: resVendor.data.msg.state,
                        dynamicFields_bank: resBank.data.msg.map((item) => ({
                        sl_no:item.sl_no,
                        v_micr:item.micr_code,
                        v_ifsc:item.ifsc,
                        v_ac:item.ac_no,
                        v_banknm:item.bank_name,
                        v_brnnm:item.branch_name,
                        })),
                        dynamicFields: resPoc.data.msg.map((item) => ({
                          sl_no: item.sl_no,
                          poc_name: item.poc_name,
                          poc_ph_1: item.poc_ph_1,
                          poc_ph_2: item.poc_ph_2,
                          poc_email: item.poc_email,
                        })),
                        dynamicFields_category: resDeals.data.msg.map(
                          (item, index) => ({
                            sl_no: item.sl_no,
                            category_id: item.category_id,
                          })
                        ),
                      }));
                      setLoading(false);
                    });
                })
                .catch((err) => {
                  console.log(err);
                  navigate("/error" + "/" + err.code + "/" + err.message);
                });
            });
        });
      // axios.post(url + "/api/getvendorbank", { id: params.id }).then((res) => {
      //   console.log(res.data.msg[0].micr_code,'getvendorbank');
      //   setValues({
      //     v_micr:res.data.msg[0].micr_code,
      //     v_ifsc:res.data.msg[0].ifsc,
      //     v_ac:res.data.msg[0].ac_no,
      //     v_banknm:res.data.msg[0].bank_name,
      //     v_brnnm:res.data.msg[0].branch_name,
      //   })})
      // axios
      // .post(url + "/api/getvendordeals", {
      //   id: params.id,
      // })
      // .then((res) => {
      //   console.log(res.data.msg[0], "res");
      //   // res.data.msg.map((item, index) =>({console.log(item)}))
      //   setValues(prev => ({
      //     ...prev,
      //     dynamicFields_category: res.data.msg.map((item, index) => ({
      //       sl_no: item.sl_no,
      //       category_id: item.category_id,
      //     })),
      //   }));
      // })
      // .catch((err) => {
      //   console.log(err);
      //   navigate("/error" + "/" + err.code + "/" + err.message);
      // });
      // axios.post(url + "/api/getvendorpoc", { id: params.id }).then((res) => {
      //   console.log(res.data.msg[0], 'res getvendorpoc');
      //   setValues(prevValues => ({
      //     ...prevValues,
      //     dynamicFields: res.data.msg.map((item) => ({
      //       sl_no: item.sl_no,
      //       poc_name: item.poc_name,
      //       poc_ph_1: item.poc_ph_1,
      //       poc_ph_2: item.poc_ph_2,
      //       poc_email:item.poc_email
      //     }))
      //   }));
      //   setLoading(false);
      // });
    }
  }, [count]);

  const onSubmit = (values) => {
    console.log("onsubmit called");
    console.log(values, "onsubmit vendor");
    setLoading(true);
    axios
      .post(url + "/api/addVendor", {
        v_id: +params.id,
        user: localStorage.getItem("email"),
        v_type:values.v_type,
        v_name: values.v_name,
        v_gst: values.v_gst,
        v_pan: values.v_pan,
        v_phone: values.v_phone,
        v_email: values.v_email,
        msme_flag: values.v_msme,
        msme_no: values.v_msmeno,
        // v_banknm: values.v_banknm,
        // v_brnnm: values.v_brnnm,
        // v_ifsc: values.v_ifsc,
        // v_micr: values.v_micr,
        // v_ac: values.v_ac,
        tan_no: values.v_tan,
        tds_flag: values.v_tds,
        tds_prtg: values.tds_perc ? values.tds_perc : 0.0,
        tcs_flag: values.v_tcs,
        tcs_prtg: values.tcs_perc ? values.tcs_perc : 0.0,
        supply_flag: values.supply_flag,
        composite: values.v_composite,
        e_r_supply: values.v_e_r_supply,
        state: values.v_state,
        v_address: values.v_address,
        v_poc: values.dynamicFields,
        v_deals: values.dynamicFields_category,
        v_bank:values.dynamicFields_bank
      })
      .then((res) => {
        setLoading(false);
        if (res.data.suc > 0) {
          Message("success", res.data.msg);
          setCount((prev) => prev + 1);
          if (params.id == 0) navigate(-1);
        } else {
          Message("error", res.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/error" + "/" + err.code + "/" + err.message);
      });
  };
  // const formik = useFormik({
  //   initialValues: +params.id > 0 ? formValues : initialValues,
  //   onSubmit,
  //   validationSchema,
  //   validateOnMount: true,
  //   enableReinitialize: true,
  // });
  return (
    <section className="bg-transparent dark:bg-[#001529]">
      {/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
      <HeadingTemplate
        text={params.id > 0 ? "Update vendor" : "Add vendor"}
        mode={params.id > 0 ? 1 : 0}
        title={"Vendor"}
        data={params.id && data ? data : ""}
        onPrinting={()=>{setIsPrinting(false);
          setTimeout(() => {
            reactToPrintFn();
            setIsPrinting(true);
            }, 5);}
          }
      />
            <BlockUI blocked={blocked} className={'bg-red-500'}>
      
      <div className="w-full bg-white p-6 rounded-2xl">
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          className="text-green-900 dark:text-gray-400"
          spinning={loading}
        >
          <Formik
            initialValues={+params.id > 0 ? formValues : initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnMount={true}
            enableReinitialize={true}
          >
            {({
              values,
              handleReset,
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              touched,
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="card flex flex-col justify-center">
                  {/*  <Stepper ref={stepperRef} style={{ flexBasis: '80rem' }}>
                    <StepperPanel header="Header I">*/}
                  <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
                  <div className="sm:col-span-3">
                      <TDInputTemplate
                        placeholder="Select type"
                        type="text"
                        label="Vendor type"
                        name="v_type"
                        formControlName={values.v_type}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        data={[{name:'Service',code:'E'},{name:'Supplier',code:'U'}]}
                        mode={2}
                      />
                      {errors.v_type && touched.v_type ? (
                        <VError title={errors.v_type} />
                      ) : null}
                    </div>
                    <div className="sm:col-span-3">
                      <TDInputTemplate
                        placeholder="Type name..."
                        type="text"
                        label="Vendor name"
                        name="v_name"
                        formControlName={values.v_name}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        mode={1}
                      />
                      {errors.v_name && touched.v_name ? (
                        <VError title={errors.v_name} />
                      ) : null}
                    </div>
                    <div className="sm:col-span-3">
                      <TDInputTemplate
                        placeholder="Type TAN..."
                        type="text"
                        label="TAN"
                        name="v_tan"
                        formControlName={values.v_tan}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        mode={1}
                      />
                      {errors.v_tan && touched.v_tan ? (
                        <VError title={errors.v_tan} />
                      ) : null}
                    </div>
                    <div className="sm:col-span-3">
                      <TDInputTemplate
                        placeholder="Type PAN..."
                        type="text"
                        label="PAN"
                        name="v_pan"
                        formControlName={values.v_pan}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        mode={1}
                      />
                      {errors.v_pan && touched.v_pan ? (
                        <VError title={errors.v_pan} />
                      ) : null}
                    </div>

                    {/* <div className="sm:col-span-6"> */}

                    <FieldArray name="dynamicFields_category">
                      {({ push, remove, insert, unshift }) => (
                        <>
                          {values.dynamicFields_category?.map(
                            (field, index) => (
                              <React.Fragment key={index}>
                                <div className="sm:col-span-10 mb-5">
                                  <TDInputTemplate
                                    placeholder="Deals in"
                                    type="text"
                                    label="Deals in"
                                    name={`dynamicFields_category[${index}].category_id`}
                                    formControlName={field.category_id}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    data={cat}
                                    mode={2}
                                  />
                                  {errors.dynamicFields_category?.[index]
                                    ?.category_id &&
                                  touched.dynamicFields_category?.[index]
                                    ?.category_id ? (
                                    <VError
                                      title={
                                        errors.dynamicFields_category[index]
                                          .category_id
                                      }
                                    />
                                  ) : null}
                                </div>
                                {/* <div className="sm:col-span-1"></div> */}
                                <div className="sm:col-span-2 flex gap-2 justify-end item-center mt-5">
                                  {values.dynamicFields_category?.length >
                                    1 && (
                                    <Button
                                      className="rounded-full text-white bg-red-800 border-red-800"
                                      onClick={() => remove(index)}
                                      icon={<MinusOutlined />}
                                    ></Button>
                                  )}

                                  <Button
                                    className="rounded-full bg-green-900 text-white"
                                    onClick={() =>
                                      push({ sl_no: 0, category_id: "" })
                                    }
                                    icon={<PlusOutlined />}
                                  ></Button>
                                </div>
                              </React.Fragment>
                            )
                          )}
                         
                        </>
                      )}
                    </FieldArray>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <TDInputTemplate
                        placeholder="Select MSME"
                        type="text"
                        label="MSME"
                        name="v_msme"
                        formControlName={values.v_msme}
                        handleChange={(event) =>
                          handleChangeMsme(event, handleChange)
                        }
                        handleBlur={handleBlur}
                        data={msmeList}
                        mode={2}
                      />
                      {errors.v_msme && touched.v_msme ? (
                        <VError title={errors.v_msme} />
                      ) : null}
                    </div>

                    <div className="col-span-1">
                      {msmeVal && (
                        <TDInputTemplate
                          placeholder="Type MSME No."
                          type="text"
                          label="MSME No."
                          name="v_msmeno"
                          formControlName={values.v_msmeno}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          mode={1}
                        />
                      )}
                      {errors.v_msmeno && touched.v_msmeno ? (
                        <VError title={errors.v_msmeno} />
                      ) : null}
                    </div>
                    <FieldArray name="dynamicFields_bank" className="my-3">
                      {({ push, remove }) => (
                        <>
                          {values.dynamicFields_bank?.map((field, index) => (
                            <React.Fragment key={index}>

<div className="sm:col-span-2 flex gap-2 justify-end item-center ">
                              {values.dynamicFields_bank?.length > 1 && (
                                <Button
                                  className="rounded-full text-white bg-red-800 border-red-800"
                                  onClick={() => remove(index)}
                                  icon={<MinusOutlined />}
                                ></Button>
                              )}

                              <Button
                                className="rounded-full bg-green-900 text-white"
                                onClick={() =>
                                  push({
                                    sl_no: 0,
                                    v_banknm: "",
                                    v_brnnm: "",
                                    v_ifsc: "",
                                    v_micr: "",
                                    v_ac: "",
                                  })
                                }
                                icon={<PlusOutlined />}
                              ></Button>
                              </div>
                              <div className="sm:col-span-1">
                                <TDInputTemplate
                                  placeholder="Type Bank Name..."
                                  type="text"
                                  label="Bank Name"
                                  // name="v_banknm"
                                  name={`dynamicFields_bank[${index}].v_banknm`}
                                  formControlName={field.v_banknm}
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields_bank?.[index]?.v_banknm &&
                                touched.dynamicFields_bank?.[index]
                                  ?.v_banknm ? (
                                  <VError
                                    title={
                                      errors.dynamicFields_bank?.[index]
                                        ?.v_banknm
                                    }
                                  />
                                ) : null}
                              </div>
                              <div className="sm:col-span-1">
                                <TDInputTemplate
                                  placeholder="Type Branch Name..."
                                  type="text"
                                  label="Branch Name"
                                  // name="v_brnnm"
                                  name={`dynamicFields_bank[${index}].v_brnnm`}
                                  formControlName={field.v_brnnm}
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields_bank?.[index]?.v_brnnm &&
                                touched.dynamicFields_bank?.[index]?.v_brnnm ? (
                                  <VError
                                    title={
                                      errors.dynamicFields_bank?.[index]
                                        ?.v_brnnm
                                    }
                                  />
                                ) : null}
                              </div>
                              <div>
                                <TDInputTemplate
                                  placeholder="Type A/C No."
                                  type="text"
                                  label="A/C No."
                                  // name="v_ac"
                                  name={`dynamicFields_bank[${index}].v_ac`}
                                  formControlName={field.v_ac}
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields_bank?.[index]?.v_ac &&
                                touched.dynamicFields_bank?.[index]?.v_ac ? (
                                  <VError
                                    title={
                                      errors.dynamicFields_bank?.[index]?.v_ac
                                    }
                                  />
                                ) : null}
                              </div>
                              <div>
                                <TDInputTemplate
                                  placeholder="Type IFSC"
                                  type="text"
                                  label="IFSC"
                                  // name="v_ifsc"
                                  name={`dynamicFields_bank[${index}].v_ifsc`}
                                  formControlName={field.v_ifsc}
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields_bank?.[index]?.v_ifsc &&
                                touched.dynamicFields_bank?.[index]?.v_ifsc ? (
                                  <VError
                                    title={
                                      errors.dynamicFields_bank?.[index]?.v_ifsc
                                    }
                                  />
                                ) : null}
                              </div>
                              <div className="sm:col-span-2">
                                <TDInputTemplate
                                  placeholder="Type MICR Code"
                                  type="text"
                                  label="MICR Code"
                                  // name="v_micr"
                                  name={`dynamicFields_bank[${index}].v_micr`}
                                  formControlName={field.v_micr}
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields_bank?.[index]?.v_micr &&
                                touched.dynamicFields_bank?.[index]?.v_micr ? (
                                  <VError
                                    title={
                                      errors.dynamicFields_bank?.[index]?.v_micr
                                    }
                                  />
                                ) : null}
                              </div>
                              
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </FieldArray>
                    {/* <div className="sm:col-span-1"></div> */}

                    {/* <div className="sm:col-span-1"></div> */}

                    {/* <div className="sm:col-span-1"></div> */}

                    <div>
                      <TDInputTemplate
                        placeholder="Select TDS"
                        type="text"
                        label="TDS"
                        name="v_tds"
                        formControlName={values.v_tds}
                        handleChange={(event) =>
                          handleChangetds(event, handleChange)
                        }
                        handleBlur={handleBlur}
                        data={msmeList}
                        mode={2}
                      />
                      {errors.v_tds && touched.v_tds ? (
                        <VError title={errors.v_tds} />
                      ) : null}
                    </div>
                    {tdsPercTrue && (
                      <div>
                        <TDInputTemplate
                          placeholder="Type TDS Percentage"
                          type="number"
                          label="TDS Percentage"
                          name="tds_perc"
                          formControlName={values.tds_perc}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          mode={1}
                        />
                        {errors.tds_perc && touched.tds_perc ? (
                          <VError title={errors.tds_perc} />
                        ) : null}
                      </div>
                    )}

                    <div>
                      <TDInputTemplate
                        placeholder="Select TCS"
                        type="text"
                        label="TCS"
                        name="v_tcs"
                        formControlName={values.v_tcs}
                        handleChange={(event) =>
                          handleChangetcs(event, handleChange)
                        }
                        handleBlur={handleBlur}
                        data={msmeList}
                        mode={2}
                      />
                      {errors.v_tcs && touched.v_tcs ? (
                        <VError title={errors.v_tcs} />
                      ) : null}
                    </div>
                    {tcsPercTrue && (
                      <div>
                        <TDInputTemplate
                          placeholder="Type TCS Percentage"
                          type="number"
                          label="TCS Percentage"
                          name="tcs_perc"
                          formControlName={values.tcs_perc}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          mode={1}
                        />
                        {errors.tcs_perc && touched.tcs_perc ? (
                          <VError title={errors.tcs_perc} />
                        ) : null}
                      </div>
                    )}
                    <Radio.Group
                      name="supply_flag"
                      className="my-2"
                      value={values.supply_flag}
                      onChange={(event) =>
                        handleChangeSupply(event, handleChange)
                      }
                      onBlur={handleBlur}
                    >
                      <Radio value={"R"}>Registered</Radio>
                      <Radio value={"U"}>Unregistered</Radio>
                      <Radio value={"O"}>Overseas Supplier</Radio>
                    </Radio.Group>
                    {errors.supply_flag && touched.supply_flag ? (
                      <VError title={errors.supply_flag} />
                    ) : null}
                    {gstNoTrue && (
                      <div className="sm:col-span-2">
                        <TDInputTemplate
                          placeholder="Type GST..."
                          type="text"
                          label="GST"
                          name="v_gst"
                          formControlName={values.v_gst}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          mode={1}
                        />
                        {errors.v_gst && touched.v_gst ? (
                          <VError title={errors.v_gst} />
                        ) : null}
                      </div>
                    )}
                    {compositeTrue && (
                      <div className="sm:col-span-2">
                        <TDInputTemplate
                          placeholder="Choose Tax Payer Type"
                          type="text"
                          label="Tax Payer Type"
                          name="v_composite"
                          formControlName={values.v_composite}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          data={[
                            { name: "Regular", code: "R" },
                            { name: "Composite", code: "c2" },
                            { name: "Others", code: "O" },
                          ]}
                          mode={2}
                        />
                        {errors.v_composite && touched.v_composite ? (
                          <VError title={errors.v_composite} />
                        ) : null}
                      </div>
                    )}

                    {exFlag && values.v_composite == "O" && (
                      <div className="sm:col-span-2">
                        <TDInputTemplate
                          placeholder="Other"
                          type="text"
                          label="Other"
                          name="v_e_r_supply"
                          formControlName={values.v_e_r_supply}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          mode={3}
                        />
                        {errors.v_e_r_supply && touched.v_e_r_supply ? (
                          <VError title={errors.v_e_r_supply} />
                        ) : null}
                      </div>
                    )}
                    {stateTrue && (
                      <div className="my-2">
                        <Radio.Group
                          name="v_state"
                          value={values.v_state}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <Radio value={"E"}>Interstate</Radio>
                          <Radio value={"A"}>Intrastate</Radio>
                        </Radio.Group>
                        {errors.v_state && touched.v_state ? (
                          <VError title={errors.v_state} />
                        ) : null}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-6 sm:gap-6 mt-5">
                    <div className="col-span-3">
                      <TDInputTemplate
                        placeholder="Type Phone No...."
                        type="text"
                        label="Vendor phone No."
                        name="v_phone"
                        formControlName={values.v_phone}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        mode={1}
                      />
                      {errors.v_phone && touched.v_phone ? (
                        <VError title={errors.v_phone} />
                      ) : null}
                    </div>
                    <div className="col-span-3">
                      <TDInputTemplate
                        placeholder="Type email..."
                        type="text"
                        label="Vendor email"
                        name="v_email"
                        formControlName={values.v_email}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        mode={1}
                      />
                      {errors.v_email && touched.v_email ? (
                        <VError title={errors.v_email} />
                      ) : null}
                    </div>
                    <div className="sm:col-span-3">
                      <TDInputTemplate
                        placeholder="Type vendor address here..."
                        type="text"
                        label="Address"
                        name="v_address"
                        formControlName={values.v_address}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        mode={3}
                      />
                      {errors.v_address && touched.v_address ? (
                        <VError title={errors.v_address} />
                      ) : null}
                    </div>
                    <FieldArray name="dynamicFields">
                      {({ push, remove, insert, unshift }) => (
                        <>
                          {values.dynamicFields?.map((field, index) => (
                            <React.Fragment key={index}>
                              <div className="sm:col-span-6 flex gap-2 justify-end mt-2 -mb-12">
                                {values.dynamicFields?.length > 1 && (
                                  <Button
                                    className="rounded-full text-white bg-red-800 border-red-800"
                                    onClick={() => remove(index)}
                                    icon={<MinusOutlined />}
                                  ></Button>
                                )}

                                <Button
                                  className="rounded-full bg-green-900 text-white"
                                  onClick={() =>
                                    push({
                                      sl_no: 0,
                                      poc_name: "",
                                      poc_ph_1: "",
                                      poc_ph_2: "",
                                      poc_email: " ",
                                    })
                                  }
                                  icon={<PlusOutlined />}
                                ></Button>
                              </div>
                              <div className="sm:col-span-3">
                                <TDInputTemplate
                                  placeholder="Type contact person name..."
                                  type="text"
                                  label="Contact person name"
                                  name={`dynamicFields[${index}].poc_name`}
                                  formControlName={field.poc_name}
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields?.[index]?.poc_name &&
                                touched.dynamicFields?.[index]?.poc_name ? (
                                  <VError
                                    title={errors.dynamicFields[index].poc_name}
                                  />
                                ) : null}
                              </div>
                              <div className="sm:col-span-3"></div>
                              {/* <div className="grid grid-cols-6"> */}
                              <div className="sm:col-span-2">
                                <TDInputTemplate
                                  placeholder="Type contact person primary phone..."
                                  type="text"
                                  label="Contact person primary phone no."
                                  name={`dynamicFields[${index}].poc_ph_1`}
                                  formControlName={field.poc_ph_1}
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields?.[index]?.poc_ph_1 &&
                                touched.dynamicFields?.[index]?.poc_ph_1 ? (
                                  <VError
                                    title={errors.dynamicFields[index].poc_ph_1}
                                  />
                                ) : null}
                              </div>
                              <div className="sm:col-span-2">
                                <TDInputTemplate
                                  placeholder="Type contact secondary person phone..."
                                  type="text"
                                  label="Contact person secondary phone no."
                                  name={`dynamicFields[${index}].poc_ph_2`}
                                  formControlName={field.poc_ph_2}
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields?.[index]?.poc_ph_2 &&
                                touched.dynamicFields?.[index]?.poc_ph_2 ? (
                                  <VError
                                    title={errors.dynamicFields[index].poc_ph_2}
                                  />
                                ) : null}
                              </div>
                              <div className="sm:col-span-2">
                                <TDInputTemplate
                                  placeholder="Type contact person email..."
                                  type="text"
                                  label="Contact person email"
                                  name={`dynamicFields[${index}].poc_email`}
                                  formControlName={field.poc_email}
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields?.[index]?.poc_email &&
                                touched.dynamicFields?.[index]?.poc_email ? (
                                  <VError
                                    title={
                                      errors.dynamicFields[index].poc_email
                                    }
                                  />
                                ) : null}
                              </div>

                              {/* </div> */}
                            </React.Fragment>
                          ))}
                          {/* <div className="sm:col-span-2">
                          <Button type="dashed" onClick={() => push({ sl_no: 0, poc_name: "", poc_ph_1: "" })} icon={<PlusOutlined />}>
                            Add field
                          </Button>
                        </div> */}
                        </>
                      )}
                    </FieldArray>
                  </div>

                  {/* <Button className="inline-flex items-center px-5 py-5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-[#92140C] bg-[#92140C] transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 rounded-full  dark:focus:ring-primary-900" onClick={() => stepperRef.current.prevCallback()}>
                                            <ArrowLeftOutlined className='mr-2' />
                                            Back
                                        </Button> */}
                  {params.id > 0 && <AuditTrail data={data} />}

                  <BtnComp
                    mode={params.id > 0 ? "E" : "A"}
                    onReset={handleReset}
                  />
                  {/* </StepperPanel> */}
                  {/* </Stepper> */}
                </div>
              </form>
            )}
          </Formik>
        </Spin>
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
                          <h2 className="bg-green-500 font-bold text-lg p-3 text-white">Vendor</h2>
                          <table className="border-collapse text-xs border border-gray-300 w-full">
                    <tbody>
                     
                        <tr  className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                            Vendor
                          </td>
                          <td className="border text-gray-600 border-gray-300 p-2">{data?.vendor_name}</td>
                        </tr>
                        <tr  className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                            Vendor Type
                          </td>
                          <td className="border text-gray-600 border-gray-300 p-2">{data?.vendor_type=='U'?'Supplier':'Service'}</td>
                        </tr>
                        <tr  className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                            Tax Payer Type
                          </td>
                          <td className="border text-gray-600 border-gray-300 p-2">{data?.org_type=='R'?'Regular':data?.org_type=='c2'?'Composite':data?.e_r_supply}</td>
                        </tr>
                        <tr  className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                            Phone
                          </td>
                          <td className="border text-gray-600 border-gray-300 p-2">{data?.vendor_phone}</td>
                        </tr>
                        <tr  className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                            Email
                          </td>
                          <td className="border text-gray-600 border-gray-300 p-2">{data?.vendor_email}</td>
                        </tr>
                        <tr  className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                            TAN
                          </td>
                          <td className="border text-gray-600 border-gray-300 p-2">{data?.tan_no}</td>
                        </tr>
                        <tr  className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                            PAN
                          </td>
                          <td className="border text-gray-600 border-gray-300 p-2">{data?.vendor_pan}</td>
                        </tr>
                        <tr  className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                            GST
                          </td>
                          <td className="border text-gray-600 border-gray-300 p-2">{data?.vendor_gst}</td>
                        </tr>
                        <tr  className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                            Address
                          </td>
                         
                          <td className="border text-gray-600 border-gray-300 p-2">{data?.vendor_address}</td>
                        </tr>
                        <tr  className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                            MSME
                          </td>
                          <td className="border text-gray-600 border-gray-300 p-2">{data?.msme_flag=='Y'?data?.msme_no:''}</td>
                        </tr>
                        <tr  className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                            TCS
                          </td>
                          <td className="border text-gray-600 border-gray-300 p-2">{data?.tcs_flag=='Y'?data?.tcs_prtg:''}</td>
                        </tr>
                        <tr  className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                            TDS
                          </td>
                          <td className="border text-gray-600 border-gray-300 p-2">{data?.tcs_flag=='Y'?data?.tds_prtg:''}</td>
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
                  <h2 className="bg-green-500 font-bold text-lg p-3 mt-2 text-white">Dealing Details</h2>
      
                  <table className="border-collapse border border-gray-500 w-full text-center">
              <thead>
                <tr className="text-green-500 font-bold text-center">
                    <th className="border border-gray-300 p-2 capitalize">
                      Deals in
                    </th>
                   
                </tr>
              </thead>
              <tbody className="text-gray-600 text-xs">
                {vendordeals.map(item=><tr>
                    <td className="border border-gray-300 p-2">
                      {cat.filter(e=>e.code==+item.category_id)[0].name}
                    </td>
                   
                </tr>)}
              </tbody>
            </table>
            <h2 className="bg-green-500 font-bold text-lg p-3 mt-2 text-white">Bank Details</h2>
      
      <table className="border-collapse border border-gray-500 w-full text-center">
  <thead>
    <tr className="text-green-500 font-bold text-center">
        <th className="border border-gray-300 p-2 capitalize">
          Bank
        </th>
        <th className="border border-gray-300 p-2 capitalize">
          Branch
        </th>
        <th className="border border-gray-300 p-2 capitalize">
          A/C No.
        </th>
        <th className="border border-gray-300 p-2 capitalize">
          IFSC
        </th>
        <th className="border border-gray-300 p-2 capitalize">
          MICR
        </th>
       
    </tr>
  </thead>
  <tbody className="text-gray-600 text-xs">
    {vendorbank.map(item=><tr>
        <td className="border border-gray-300 p-2">
          {item.bank_name}
        </td>
        <td className="border border-gray-300 p-2">
          {item.branch_name}
        </td>
        <td className="border border-gray-300 p-2">
          {item.ac_no}
        </td>
        <td className="border border-gray-300 p-2">
          {item.ifsc}
        </td>
        <td className="border border-gray-300 p-2">
          {item.micr_code}
        </td>
       
    </tr>)}
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
      {vendorpoc.map(item=><tr>
       
        <td className="border flex flex-col justify-center items-center border-gray-300 p-2">
          {item.poc_name}
         
        </td>
       
        <td className="border border-gray-300 p-2">
          {item.poc_ph_1} {item.poc_ph_2?'/ '+item.poc_ph_2:''}
        </td>
       
        <td className="border border-gray-300 p-2">
          {item.email}
        </td>
       
      
      </tr>)}
      </tbody>
      </table>
      
                 
                      </div>
                        </div>
                        </div>
    </section>
  );
}

export default VendorForm;
