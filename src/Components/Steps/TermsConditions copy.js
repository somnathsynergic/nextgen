import React, { useEffect, useState } from "react";
import TDInputTemplate from "../TDInputTemplate";
import { useFormik } from "formik";
import * as Yup from "yup";
import VError from "../../Components/VError";
import { useParams } from "react-router-dom";
import { Checkbox } from "antd";
import { Tag } from "antd";
import { motion } from "framer-motion";
import { url } from "../../Address/BaseUrl";
import axios from "axios";

function TermsConditions({ pressNext, pressBack, data }) {
  const [grand_total, setGrand] = useState(0);
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [gstList, setGstList] = useState([]);
  const [cgstList, setcGstList] = useState([]);
  const [sgstList, setsGstList] = useState([]);
  const [igstList, setiGstList] = useState([]);
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
        tot += item.total;
      }
    }
    console.log(tot);
    setGrand(tot);
  }, []);

  useEffect(() => {
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
  useEffect(() => {}, [data]);
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

    freight_insurance: data.freight_insurance ? data.freight_insurance : "",
    freight_insurance_val: data.freight_insurance
      ? data.freight_insurance_val
      : "",

    insurance: data.insurance ? data.insurance : "",
    insurance_val: data.insurance ? data.insurance_val : "",

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
    // warranty_guarantee_flag:JSON.parse(localStorage.getItem('terms'))?.warranty_guarantee_flag?JSON.parse(localStorage.getItem('terms'))?.warranty_guarantee_flag:"",
    warranty_guarantee_flag: data.warranty_guarantee_flag
      ? data.warranty_guarantee_flag
      : "",
    duration: data.duration ? data.duration : "",
    duration_val: data.duration_val ? data.duration_val : "",
    om_manual_flag: data.om_manual_flag ? data.om_manual_flag : "",
    om_manual_desc: data.om_manual_desc ? data.om_manual_desc : "",
    oi_flag: data.oi_flag ? data.oi_flag : "",
    oi_desc: data.oi_desc ? data.oi_desc : "",
    packing_type: data.packing_type ? data.packing_type : "",
    packing_val: data.packing_type ? data.packing_val : "",
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
      then: () => Yup.string().required('Required').matches(/^[0-9.]+$/, "Invalid value"),
      otherwise: () => Yup.string(),
    }),

    // 
    

// 

    freight_insurance: Yup.string().required("Freight is required"),
    insurance: Yup.string().required("Insurance is required"),
    insurance_val: Yup.string().when("insurance", {
      is: "Y",
      then: () => Yup.string().required("Description is required"),
      otherwise: () => Yup.string(),
    }),
    test_certificate: Yup.string().required("Test Certificate is required"),
    // test_certificate_desc: Yup.string().when('test_certificate', {
    //   is: 'Y',
    //   then: () => Yup.string().required("Test Certificate description is required"),
    //   otherwise: () => Yup.string()}),
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
       console.log(values)
      if (values.packing_forwarding_val === 'E') {
        // If "extra" is selected, enforce either (CGST + SGST) or IGST
        if ((!values.pf_cgst || values.pf_cgst=='CGST') && (!values.pf_sgst || values.pf_sgst=='SGST') && (!values.pf_igst||values.pf_igst=='IGST')) {
          errors.pf_cgst = 'Either CGST + SGST or IGST is required';
          errors.pf_sgst = 'Either CGST + SGST or IGST is required';
          errors.pf_igst = 'Either CGST + SGST or IGST is required';
        } else if ((values.pf_cgst && values.pf_cgst!='CGST' && (!values.pf_sgst||values.pf_sgst=='SGST')) || ((!values.pf_cgst || values.pf_cgst=='CGST') && values.pf_sgst && values.pf_sgst!='SGST')) {
          errors.pf_cgst = 'Both CGST and SGST must be filled together';
          errors.pf_sgst = 'Both CGST and SGST must be filled together';
        } else if (values.pf_igst && values.pf_igst!='IGST' && ((values.pf_cgst && values.pf_cgst!='CGST') || (values.pf_sgst && values.pf_sgst!='SGST'))) {
          errors.pf_igst = 'IGST should be filled alone or leave CGST and SGST empty';
        }
      }

      return errors;
    },
    onSubmit,
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });
  const onChangeVal=(e)=>{
    formik.handleChange(e)
    formik.setFieldValue('packing_forwarding_extra',((e.target.value/grand_total)*100).toFixed(2))
    // formik.values.packing_forwarding_extra=(e.target.value/grand_total)*100
  }
  const onChangeExtra=(e)=>{
    formik.handleChange(e)
    formik.setFieldValue('packing_forwarding_extra_val',((e.target.value*grand_total)/100).toFixed(2))
    // formik.values.packing_forwarding_extra_val=(e.target.value*grand_total)/100
  }
  useEffect(() => {
    localStorage.removeItem("terms");
    if (formik.values.ld_applicable_date == "NA") {
      formik.values.ld_applied_on = "";
      formik.values.ld_value = "";
      formik.values.po_min_value = "";
    }
    console.log(formik)
    // console.log(formik.values);
    
    localStorage.setItem("terms", JSON.stringify(formik.values));
  }, [formik.values]);
  return (
    <div className="py-2 px-4 mx-auto w-full lg:py-2">
      <h2 className="text-2xl text-green-900 font-bold my-3">
        Terms & Conditions
      </h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-10 sm:gap-6">
          <div className="sm:col-span-5">
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
          <div className="sm:col-span-5">
            <TDInputTemplate
              placeholder="Price Basis Description"
              type="text"
              label="Price Basis Description"
              name="price_basis_desc"
              formControlName={formik.values.price_basis_desc}
              handleChange={formik.handleChange}
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
            {formik.errors.price_basis_desc &&
              formik.touched.price_basis_desc && (
                <VError title={formik.errors.price_basis_desc} />
              )}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-6 sm:gap-6 my-10">
          <div className="sm:col-span-2">
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
                handleChange={(e)=>onChangeExtra(e)}
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
                handleChange={(e)=>onChangeVal(e)}
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
                      className=" flex justify-center  w-1/2 px-2 my-2.5"
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
                      className=" flex justify-center  w-1/2 px-2 my-2.5"
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
                      className=" flex justify-center  w-1/2 px-2 my-2.5"
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
          <div className="sm:col-span-2">
            {/* {grand_total} */}
            {formik.values.packing_forwarding_val == "E" && (
              <TDInputTemplate
                placeholder="Total Value with GST"
                type="number"
                label="Total Value with GST"
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
          <div className="sm:col-span-3">
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
          <div className="sm:col-span-3">
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
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={3}
            />
            {formik.errors.freight_insurance_val &&
              formik.touched.freight_insurance_val && (
                <VError title={formik.errors.freight_insurance_val} />
              )}
          </div>
          {/*  */}
          <div className="sm:col-span-3">
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
            <div className="sm:col-span-3">
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
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={3}
              />
              {formik.errors.insurance_val && formik.touched.insurance_val && (
                <VError title={formik.errors.insurance_val} />
              )}
            </div>
          )}
          {/*  */}
        </div>
        <div className="grid gap-4 sm:grid-cols-10 sm:gap-6 my-10">
          <div className="sm:col-span-5">
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
          <div className="sm:col-span-5">
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
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={3}
              />
            )}
            {formik.errors.test_certificate_desc &&
              formik.touched.test_certificate_desc && (
                <VError title={formik.errors.test_certificate_desc} />
              )}
          </div>

          <div className="sm:col-span-2">
            <TDInputTemplate
              placeholder="LD applicable date"
              type="date"
              label="LD applicable date"
              name="ld_applicable_date"
              data={[
                { name: "MRN Date", code: "M" },
                { name: "Dispatch Date", code: "D" },
                { name: "Others", code: "O" },
                { name: "Not Applicable", code: "NA" },
              ]}
              disabled={
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

          <div className="sm:col-span-2">
            <TDInputTemplate
              placeholder="LD value applied on"
              type="text"
              label="LD value applied on"
              name="ld_applied_on"
              disabled={
                localStorage.getItem("po_status") == "A" ||
                localStorage.getItem("po_status") == "D" ||
                localStorage.getItem("po_status") == "L" ||
                formik.values.ld_applicable_date == "NA"
                  ? true
                  : false
              }
              data={[
                { code: "T", name: "PO Total Value(%)" },
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
          <div className="sm:col-span-2">
            <TDInputTemplate
              placeholder="LD value (%)"
              type="number"
              label="LD value (%)"
              name="ld_value"
              disabled={
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
          <div className="sm:col-span-10">
            {formik.values.ld_applicable_date == "O" && (
              <TDInputTemplate
                placeholder="Others (LD Applicable Date)"
                type="text"
                label="Others (LD Applicable Date)"
                name="others_ld"
                disabled={
                  localStorage.getItem("po_status") == "A" ||
                  localStorage.getItem("po_status") == "D" ||
                  localStorage.getItem("po_status") == "L" ||
                  formik.values.ld_applicable_date == "NA"
                    ? true
                    : false
                }
                formControlName={formik.values.others_ld}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={3}
              />
            )}
            {formik.errors.others_ld && formik.touched.others_ld && (
              <VError title={formik.errors.others_ld} />
            )}
          </div>
          <div className="sm:col-span-10">
            {formik.values.ld_applied_on == "O" &&
              formik.values.ld_applicable_date != "NA" && (
                <TDInputTemplate
                  placeholder="Others (LD Value applied on)"
                  type="text"
                  label="Others (LD Value applied on)"
                  name="others_applied"
                  disabled={
                    localStorage.getItem("po_status") == "A" ||
                    localStorage.getItem("po_status") == "D" ||
                    localStorage.getItem("po_status") == "L" ||
                    formik.values.ld_applicable_date == "NA"
                      ? true
                      : false
                  }
                  formControlName={formik.values.others_applied}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={3}
                />
              )}
            {formik.errors.others_applied && formik.touched.others_applied && (
              <VError title={formik.errors.others_applied} />
            )}
          </div>
          <div className="sm:col-span-10">
            <TDInputTemplate
              placeholder="Maximum % on PO value"
              type="number"
              label="Maximum % on PO value"
              name="po_min_value"
              disabled={
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
                { code: "W", name: "Warranty" },
                { code: "G", name: "Guarantee" },
              ]}
              disabled={
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
            {formik.values.warranty_guarantee_flag == "W" && (
              <>
                <p>
                  <Checkbox
                    checked={formik.values.dispatch_dt}
                    name="dispatch_dt"
                    disabled={
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
            )}
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
          <div className="sm:col-span-5">
            <TDInputTemplate
              placeholder="Duration Value"
              type="text"
              label="Duration Value"
              name="duration_val"
              disabled={
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
            {formik.values.om_manual_flag == "A" && (
              <TDInputTemplate
                placeholder="O&M Manual Description"
                type="text"
                label="O&M Manual Description"
                name="om_manual_desc"
                formControlName={formik.values.om_manual_desc}
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
            {formik.errors.om_manual_desc && formik.touched.om_manual_desc && (
              <VError title={formik.errors.om_manual_desc} />
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
            {formik.values.oi_flag == "A" && (
              <TDInputTemplate
                placeholder="Operation/Installation Description"
                type="text"
                label="Operation/Installation Description"
                name="oi_desc"
                formControlName={formik.values.oi_desc}
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
            {formik.errors.oi_desc && formik.touched.oi_desc && (
              <VError title={formik.errors.oi_desc} />
            )}
          </div>
          <div className="sm:col-span-5">
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

          <div className="sm:col-span-5">
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
          <div className="sm:col-span-5">
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
          <div className="sm:col-span-5">
            {formik.values.manufacture_clearance == "A" && (
              <TDInputTemplate
                placeholder="Manufacture Clearance Description"
                type="text"
                label="Manufacture Clearance Description"
                name="manufacture_clearance_desc"
                formControlName={formik.values.manufacture_clearance_desc}
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
            {formik.errors.manufacture_clearance_desc &&
              formik.touched.manufacture_clearance_desc && (
                <VError title={formik.errors.manufacture_clearance_desc} />
              )}
          </div>
        </div>
        <div className="flex pt-4 justify-between w-full">
          <button
            type="button"
            className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-[#92140C] bg-[#92140C] transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 rounded-full  dark:focus:ring-primary-900"
            onClick={pressBack}
          >
            Back
          </button>
          <button
            type="submit"
            className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default TermsConditions;
