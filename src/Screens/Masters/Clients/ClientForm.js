import '../Steps.css'
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import BtnComp from "../../../Components/BtnComp";
import HeadingTemplate from "../../../Components/HeadingTemplate";
import TDInputTemplate from "../../../Components/TDInputTemplate";
import { FieldArray, Formik } from "formik";
import * as Yup from "yup";
import VError from "../../../Components/VError";
import { PlusOutlined, MinusOutlined, LockFilled } from "@ant-design/icons";
import { Button } from "antd";
import { url } from "../../../Address/BaseUrl";
import { Message } from "../../../Components/Message";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import PrintHeader from "../../../Components/PrintHeader";
import axios from "axios";
import AuditTrail from "../../../Components/AuditTrail";
import { Image } from "antd";
import SpinComp from '../../../Components/SpinComp';
import BlockComp from '../../../Components/BlockComp';

function ClientForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const contentRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(true);

  const reactToPrintFn = useReactToPrint({
    contentRef
  });
  // const [vendor, setVendor] = useState([]);
  var vendorList = [];
  var fileArray = [];
  const params = useParams();
  console.log(params, "params");
  const [data, setData] = useState();
  const [clientpoclist, setclientpoclist] = useState([]);
  const [clientloclist, setClientloclist] = useState([]);
  const [clientpocitems, setClientpocitems] = useState([]);
  const det = JSON.parse(localStorage.getItem('perm'))
  // var clientpoclist=[]
  const [formValues, setValues] = useState({
    clnt_name: "",
    c_location: "",
    c_vendor_code: "",
    locationFields: [
      {
        sl_no: 0,
        c_location: "",
        c_gst: "",
        c_pan: "",
      },
    ],
    dynamicFields: [
      {
        sl_no: 0,
        poc_name: "",
        poc_designation: "",
        poc_department: "",
        poc_email: "",
        poc_direct_no: "",
        poc_ext_no: "",
        poc_ph_1: "",
        poc_ph_2: "",
        poc_location: "",
        poc_doc1: "",
      },
    ],
  });

  const initialValues = {
    clnt_name: "",
    c_vendor_code: "",
    locationFields: [
      {
        sl_no: params.id > 0 ? 0 : formValues.dynamicFields[0].sl_no,
        c_location: "",
        c_gst: "",
        c_pan: "",
      },
    ],
    dynamicFields: [
      {
        sl_no: params.id <= 0 ? 0 : formValues.dynamicFields[0].sl_no,
        poc_name: "",
        poc_designation: "",
        poc_department: "",
        poc_email: "",
        poc_direct_no: "",
        poc_ext_no: "",
        poc_ph_1: "",
        poc_ph_2: "",
        poc_location: "",
        poc_doc1: "",

      },
    ],
  };

  const onSubmit = (values) => {
    console.log("onSubmit");
    setLoading(true);
    console.log(values);
    console.log(fileArray);
    var client_data = JSON.stringify({
      c_id: +params.id,
      user: localStorage.getItem("email"),
      c_name: values.clnt_name,
      c_vendor_code: values.c_vendor_code.toString(),
      c_loc: values.locationFields,
      c_poc: values.dynamicFields,
    });
    var formData = new FormData();
    // formData.append("client_data", client_data);
    var newFileaArr = []

    for (let i = 0; i < fileArray.length; i++) {
      // for (let i = 0; i < newFileaArr.length; i++) {
      // newFileaArr.push(fileArray[i].doc)
      formData.append(`poc_doc[${i}]`, fileArray[i].doc);
      // formData.append(`poc_doc[${i}]`,newFileaArr[i].doc);
      console.log(fileArray[i].doc.size)


    }
    formData.append("client_data", client_data);

    // formData.append('poc_doc[]',newFileaArr);
    console.log(newFileaArr)
    axios
      .post(url + "/api/addclient", formData)
      .then((res) => {
        setLoading(false);
        setData(res.data?.msg);
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
  const validationSchema = Yup.object({
    clnt_name: Yup.string().required("Client's name is required"),

    locationFields: Yup.array().of(
      Yup.object().shape({
        c_location: Yup.string().required("Client address/location is required"),
        c_gst: Yup.string().matches(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
          "Incorrect format!"
        ),
        // .required("Client GST is required"),
        c_pan: Yup.string().matches(
          /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
          "Incorrect format!"
        )
        // .required("Client PAN is required"),
      })
    ),
    dynamicFields: Yup.array().of(
      Yup.object().shape({
        // poc_name: Yup.string().required("Please enter name"),
        poc_name: Yup.string(),
        poc_designation: Yup.string().optional(),
        // poc_department: Yup.string().required("Please enter department"),
        poc_department: Yup.string(),
        poc_email: Yup.string()
          // .required("Please enter email")
          .email("Incorrect email format"),

        poc_direct_no: Yup.string().optional(),
        poc_ext_no: Yup.string().optional(),
        poc_ph_1: Yup.string()
          // .required("Please enter primary number")
          .length(10, "Must be 10 digits!")
          .matches(/^[1-9][0-9]{9}$/, "Invalid phone no."),
        poc_ph_2: Yup.string()
          .length(10, "Must be 10 digits!")
          .matches(/^[1-9][0-9]{9}$/, "Invalid phone no."),
        // poc_location: Yup.string().required("Location is required!"),
        poc_location: Yup.string(),
      })
    ),
  });
  useEffect(() => {
    setBlocked(det.masters == 1 ? true : false)

    if (+params.id > 0) {
      setLoading(true);
      axios
        .post(url + "/api/getclient", { id: params.id })
        .then((res) => {
          console.log(res.data.msg, "getclient show");
          setData(res.data?.msg);
          setLoading(false);
          setValues({
            ...initialValues,
            clnt_name: res.data.msg.client_name,
            c_vendor_code: res.data.msg.vendor_code,
            c_gst: res?.data?.msg.client_gst,
            c_pan: res?.data?.msg.client_pan,
            c_location: res?.data?.msg.client_location,
          });
          axios
            .post(url + "/api/getclientpoc", {
              id: params.id,
            })
            .then((res) => {
              setLoading(false);
              setClientpocitems(res.data.msg)
              // setclientpoclist(res.data.msg);
              // clientpoclist=res.data.msg'
              clientpoclist.length = 0
              for (let i = 0; i < res?.data?.msg?.length; i++) {
                clientpoclist.push({
                  sl_no: res?.data?.msg[i]?.sl_no,
                  doc: res?.data?.msg[i]?.poc_file
                })
                // fileArray.push({
                //   sl_no:0,
                //   doc:''
                // })
              }
              setclientpoclist(clientpoclist)

              console.log(clientpoclist, fileArray);
              //debugger
              setValues((prevValues) => ({
                ...prevValues,
                dynamicFields: res.data.msg.map((item, index) => ({
                  sl_no: item.sl_no,
                  poc_name: item.poc_name,
                  poc_designation: item.poc_designation,
                  poc_department: item.poc_department,
                  poc_email: item.poc_email,
                  poc_direct_no: item.poc_direct_no,
                  poc_ext_no: item.poc_ext_no,
                  poc_ph_1: item.poc_ph_1,
                  poc_ph_2: item.poc_ph_2,
                  poc_location: item.poc_location,
                  poc_doc1: ""
                })),
              }));
              axios
                .post(url + "/api/getclientloc", {
                  id: params.id,
                })
                .then((res) => {
                  setLoading(false);
                  console.log(res.data.msg[0], "res");
                  setClientloclist(res.data.msg)
                  setValues((prevValues) => ({
                    ...prevValues,
                    locationFields: res.data.msg.map((item, index) => ({
                      sl_no: item.sl_no,
                      c_location: item.c_loc,
                      c_gst: item.c_gst,
                      c_pan: item.c_pan,
                    })),
                  }));
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
        })
        .catch((err) => {
          console.log(err);
          navigate("/error" + "/" + err.code + "/" + err.message);
        });
      // axios
      //   .post(url + "/api/getclientpoc", {
      //     id: params.id,
      //   })
      //   .then((res) => {
      //     setLoading(false);
      //     // setclientpoclist(res.data.msg);
      //     // clientpoclist=res.data.msg'
      //     clientpoclist.length=0
      //     for(let i=0;i<res?.data?.msg?.length;i++){
      //       clientpoclist.push({
      //         sl_no:res?.data?.msg[i]?.sl_no,
      //         doc:res?.data?.msg[i]?.poc_file
      //       })
      //       // fileArray.push({
      //       //   sl_no:0,
      //       //   doc:''
      //       // })
      //     }
      //     setclientpoclist(clientpoclist)
      //     console.log(clientpoclist,fileArray);
      //     //debugger
      //     setValues((prevValues) => ({
      //       ...prevValues,
      //       dynamicFields: res.data.msg.map((item, index) => ({
      //         sl_no: item.sl_no,
      //         poc_name: item.poc_name,
      //         poc_designation: item.poc_designation,
      //         poc_department: item.poc_department,
      //         poc_email: item.poc_email,
      //         poc_direct_no: item.poc_direct_no,
      //         poc_ext_no: item.poc_ext_no,
      //         poc_ph_1: item.poc_ph_1,
      //         poc_ph_2: item.poc_ph_2,
      //         poc_location: item.poc_location,
      //         poc_doc1:""
      //       })),
      //     }));
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     navigate("/error" + "/" + err.code + "/" + err.message);
      //   });
      // axios
      //   .post(url + "/api/getclientloc", {
      //     id: params.id,
      //   })
      //   .then((res) => {
      //     setLoading(false);
      //     console.log(res.data.msg[0], "res");
      //     setValues((prevValues) => ({
      //       ...prevValues,
      //       locationFields: res.data.msg.map((item, index) => ({
      //         sl_no: item.sl_no,
      //         c_location: item.c_loc,
      //         c_gst: item.c_gst,
      //         c_pan: item.c_pan,
      //       })),
      //     }));
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     navigate("/error" + "/" + err.code + "/" + err.message);
      //   });
    }
    console.log(formValues, "formValues");
    console.log(params.id, "params.id");
  }, [params.id, count]);
  return (
    <section className="bg-transparent dark:bg-[#001529]">
      <HeadingTemplate
        text={params.id > 0 ? "Update client" : "Add client"}
        mode={params.id > 0 ? 1 : 0}
        title={"Client"}
        data={params.id && data ? data : ""}
        onPrinting={() => {
          setIsPrinting(false);
          setTimeout(() => {
            reactToPrintFn();
            setIsPrinting(true);
          }, 5);
        }
        }
      />
      <BlockComp blocked={blocked} template={
        <div className='relative  w-full h-full 0 z-10'>
          <span className='absolute top-1 right-1 font-bold italic text-gray-500'><LockFilled className='text-green-900 ' /> Locked (Readonly)</span>

        </div>
      }>
        <div className="w-full bg-white p-6 rounded-2xl">
          <SpinComp
            loading={loading}
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
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset,
                errors,
                touched,
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-6 sm:gap-6">
                    <div className="sm:col-span-3">
                      <TDInputTemplate
                        placeholder="Type user name..."
                        type="text"
                        label="Client name"
                        name="clnt_name"
                        formControlName={values.clnt_name}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        mode={1}
                      />
                      {errors.clnt_name && touched.clnt_name && (
                        <VError title={errors.clnt_name} />
                      )}
                    </div>
                    <div className="sm:col-span-3">
                      <TDInputTemplate
                        placeholder="NGAPL Vendor code..."
                        type="text"
                        label="NGAPL Vendor Code"
                        name="c_vendor_code"
                        formControlName={values.c_vendor_code}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        // data={vendor}
                        mode={1}
                      // disabled={params.id > 0}
                      />
                      {errors.c_vendor_code && touched.c_vendor_code && (
                        <VError title={errors.c_vendor_code} />
                      )}
                    </div>
                    <FieldArray name="locationFields">
                      {({ push, remove }) => (
                        <>
                          {values.locationFields.map((field, index) => (
                            <React.Fragment key={index}>
                              {/* <div className="sm:col-span-2 flex gap-2 justify-end my-2"> */}
                              <div className="sm:col-span-6 flex gap-2 justify-end  mt-6 -mb-6">
                                {values.locationFields?.length > 1 && (
                                  <Button
                                    className="rounded-full text-white bg-red-800 border-red-800"
                                    onClick={() => remove(index)}
                                    icon={<MinusOutlined />}
                                  ></Button>
                                )}
                                <Button
                                  className="rounded-full bg-green-900 text-white"
                                  onClick={() => {
                                    push({
                                      sl_no: 0,
                                      c_location: "",
                                      c_gst: "",
                                      c_pan: "",
                                    })
                                    // fileArray.push({sl:0,doc:''})
                                  }
                                  }
                                  icon={<PlusOutlined />}
                                ></Button>
                              </div>
                              {/* <div className="grid grid-cols-3"> */}
                              <div className="sm:col-span-2">
                                <TDInputTemplate
                                  placeholder="Type Client Address/Location..."
                                  type="text"
                                  label="Client Address/Location"
                                  name={`locationFields[${index}].c_location`}
                                  formControlName={
                                    values.locationFields[index]?.c_location
                                  }
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.locationFields?.[index]?.c_location &&
                                  touched.locationFields?.[index]?.c_location && (
                                    <VError
                                      title={
                                        errors.locationFields[index].c_location
                                      }
                                    />
                                  )}
                              </div>
                              <div className="sm:col-span-2">
                                <TDInputTemplate
                                  placeholder="Type GST"
                                  type="text"
                                  label="GST"
                                  name={`locationFields[${index}].c_gst`}
                                  formControlName={
                                    values.locationFields[index]?.c_gst
                                  }
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.locationFields?.[index]?.c_gst &&
                                  touched.locationFields?.[index]?.c_gst && (
                                    <VError
                                      title={errors.locationFields[index].c_gst}
                                    />
                                  )}
                              </div>
                              <div className="sm:col-span-2">
                                <TDInputTemplate
                                  placeholder="Type PAN"
                                  type="text"
                                  label="PAN"
                                  name={`locationFields[${index}].c_pan`}
                                  formControlName={
                                    values.locationFields[index]?.c_pan
                                  }
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.locationFields?.[index]?.c_pan &&
                                  touched.locationFields?.[index]?.c_pan && (
                                    <VError
                                      title={errors.locationFields[index].c_pan}
                                    />
                                  )}
                              </div>
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </FieldArray>

                    <FieldArray name="dynamicFields">
                      {({ push, remove }) => (
                        <>
                          {values.dynamicFields.map((field, index) => (
                            <React.Fragment key={index}>
                              <div className="sm:col-span-6 flex gap-2 justify-end mt-6 -mb-6">
                                {values.dynamicFields?.length > 1 && (
                                  <Button
                                    className="rounded-full text-white bg-red-800 border-red-800"
                                    onClick={() => remove(index)}
                                    icon={<MinusOutlined />}
                                  ></Button>
                                )}

                                <Button
                                  className="rounded-full bg-green-900 text-white"
                                  onClick={() => {
                                    push({
                                      sl_no: 0,
                                      poc_name: "",
                                      poc_designation: "",
                                      poc_department: values.dynamicFields[index]?.poc_department,
                                      poc_email: "",
                                      poc_direct_no: "",
                                      poc_ext_no: "",
                                      poc_ph_1: "",
                                      poc_ph_2: "",
                                      poc_location: "",
                                      poc_doc1: "",
                                    })
                                    // fileArray.push({sl:0,doc:''})
                                  }
                                  }
                                  icon={<PlusOutlined />}
                                ></Button>
                              </div>
                              <div className="sm:col-span-6">
                                <TDInputTemplate
                                  placeholder="Type department..."
                                  type="text"
                                  label="Department"
                                  name={`dynamicFields[${index}].poc_department`}
                                  formControlName={
                                    values.dynamicFields[index]?.poc_department ||
                                    ""
                                  }
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields?.[index]?.poc_department &&
                                  touched.dynamicFields?.[index]?.poc_department && (
                                    <VError
                                      title={errors.dynamicFields[index].poc_department}
                                    />
                                  )}
                              </div>
                              <div className="sm:col-span-3">
                                <TDInputTemplate
                                  placeholder="Type the name of Contact Person..."
                                  type="text"
                                  label="Contact Person"
                                  name={`dynamicFields[${index}].poc_name`}
                                  formControlName={
                                    values.dynamicFields[index]?.poc_name || ""
                                  }
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields?.[index]?.poc_name &&
                                  touched.dynamicFields?.[index]?.poc_name && (
                                    <VError
                                      title={errors.dynamicFields[index].poc_name}
                                    />
                                  )}
                              </div>
                              <div className="sm:col-span-3">
                                <TDInputTemplate
                                  placeholder="Type Designation..."
                                  type="text"
                                  label="Designation"
                                  name={`dynamicFields[${index}].poc_designation`}
                                  formControlName={
                                    values.dynamicFields[index]?.poc_designation
                                  }
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {/* {formik.errors.dynamicFields && formik.errors.dynamicFields[index] && formik.errors.dynamicFields[index].designation && formik.touched.dynamicFields && formik.touched.dynamicFields[index] && formik.touched.dynamicFields[index].designation ? (
                                                        <VError title={formik.errors.dynamicFields[index].designation} />
                                                    ) : null} */}
                              </div>

                              <div className="sm:col-span-2">
                                <TDInputTemplate
                                  placeholder="Type Email..."
                                  type="text"
                                  label="Email"
                                  name={`dynamicFields[${index}].poc_email`}
                                  formControlName={
                                    values.dynamicFields[index]?.poc_email || ""
                                  }
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields?.[index]?.poc_email &&
                                  touched.dynamicFields?.[index]?.poc_email && (
                                    <VError
                                      title={
                                        errors.dynamicFields[index].poc_email
                                      }
                                    />
                                  )}
                              </div>
                              <div className="sm:col-span-2">
                                <TDInputTemplate
                                  placeholder="Type Direct No."
                                  type="text"
                                  label="Direct No"
                                  name={`dynamicFields[${index}].poc_direct_no`}
                                  formControlName={
                                    values.dynamicFields[index]?.poc_direct_no ||
                                    ""
                                  }
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <TDInputTemplate
                                  placeholder="Type Extension No."
                                  type="text"
                                  label="Extension No"
                                  name={`dynamicFields[${index}].poc_ext_no`}
                                  formControlName={
                                    values.dynamicFields[index]?.poc_ext_no || ""
                                  }
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <TDInputTemplate
                                  placeholder="Type Primary Phone No."
                                  type="text"
                                  label="Primary Phone No."
                                  name={`dynamicFields[${index}].poc_ph_1`}
                                  formControlName={
                                    values.dynamicFields[index]?.poc_ph_1 || ""
                                  }
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields?.[index]?.poc_ph_1 &&
                                  touched.dynamicFields?.[index]?.poc_ph_1 && (
                                    <VError
                                      title={errors.dynamicFields[index].poc_ph_1}
                                    />
                                  )}
                              </div>
                              <div className="sm:col-span-2">
                                <TDInputTemplate
                                  placeholder="Type Secondary Phone No."
                                  type="text"
                                  label="Secondary Phone No."
                                  name={`dynamicFields[${index}].poc_ph_2`}
                                  formControlName={
                                    values.dynamicFields[index]?.poc_ph_2 || ""
                                  }
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields?.[index]?.poc_ph_2 &&
                                  touched.dynamicFields?.[index]?.poc_ph_2 && (
                                    <VError
                                      title={errors.dynamicFields[index].poc_ph_2}
                                    />
                                  )}
                              </div>
                              <div className="sm:col-span-2">
                                <TDInputTemplate
                                  placeholder="Type Location..."
                                  type="text"
                                  label="Location"
                                  name={`dynamicFields[${index}].poc_location`}
                                  formControlName={
                                    values.dynamicFields[index]?.poc_location ||
                                    ""
                                  }
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {errors.dynamicFields?.[index]?.poc_location &&
                                  touched.dynamicFields?.[index]
                                    ?.poc_location && (
                                    <VError
                                      title={
                                        errors.dynamicFields[index].poc_location
                                      }
                                    />
                                  )}
                              </div>
                              <div className="sm:col-span-6 border-2 border-gray-300 p-3 rounded-lg">
                                <TDInputTemplate
                                  placeholder="Client picture"
                                  type="file"
                                  label="Client Picture"
                                  accept={"image/*"}
                                  name={`dynamicFields[${index}].poc_doc1`}
                                  formControlName={
                                    values.dynamicFields[index]?.poc_doc1 || ""
                                  }
                                  handleChange={(e) => {
                                    console.log(e.target.files[0]);
                                    handleChange(e);
                                    fileArray.push({
                                      sl_no: index,
                                      doc: e.target.files[0],
                                    });
                                    console.log(fileArray)
                                    // fileArray[index].sl_no=index
                                    // fileArray[index].doc=e.target.files[0]
                                  }}
                                  handleBlur={handleBlur}
                                  mode={1}
                                />
                                {clientpoclist.length > 0 && <Image
                                  width={105}
                                  src={
                                    url + "/uploads/" + clientpoclist[index]?.doc
                                  }
                                />}
                              </div>
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </FieldArray>
                    {params.id > 0 && <AuditTrail data={data} />}
                  </div>
                  <BtnComp
                    mode={params.id > 0 ? "E" : "A"}
                    onReset={handleReset}
                  />
                </form>
              )}
            </Formik>
          </SpinComp>
        </div>
      </BlockComp>
      <div ref={contentRef} style={{
        display: !isPrinting ? "block" : "none",
      }} >
        <div className="grid  gap-4 p-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
            <PrintHeader />
          </div>
          <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
            <h2 className="bg-green-500 font-bold text-lg p-3 text-white">Client</h2>
            <table className="border-collapse border border-gray-300 w-full">
              <tbody>

                <tr className="border border-gray-300">
                  <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                    Client
                  </td>
                  <td className="border text-gray-600 border-gray-300 p-2">{data?.client_name}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                    NGAPL Vendor Code
                  </td>
                  <td className="border text-gray-600 border-gray-300 p-2">{data?.vendor_code}</td>
                </tr>

                <tr className="border border-gray-300">
                  <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                    Created By
                  </td>
                  <td className="border border-gray-300 p-2 text-gray-600 ">{data?.created_by}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                    Created At
                  </td>
                  <td className="border border-gray-300 text-gray-600 p-2">{data?.created_at}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                    Modified By
                  </td>
                  <td className="border border-gray-300 text-gray-600 p-2">{data?.modified_by}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                    Modified At
                  </td>
                  <td className="border border-gray-300 text-gray-600 p-2">{data?.modified_at}</td>
                </tr>
              </tbody>
            </table>
            <h2 className="bg-green-500 font-bold text-lg p-3 mt-2 text-white">Location Details</h2>

            <table className="border-collapse border border-gray-500 w-full text-center">
              <thead>
                <tr className="text-green-500 font-bold text-center">
                  <th className="border border-gray-300 p-2 capitalize">
                    Location
                  </th>
                  <th className="border border-gray-300 p-2 capitalize">
                    GST
                  </th>
                  <th className="border border-gray-300 p-2 capitalize">
                    PAN
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-xs">
                {clientloclist.map(item => <tr>
                  <td className="border border-gray-300 p-2">
                    {item.c_loc}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.c_gst}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.c_pan}
                  </td>
                </tr>)}
              </tbody>
            </table>

            <h2 className="bg-green-500 font-bold text-lg p-3 mt-2 text-white">Contact Person Details</h2>

            <table className="border-collapse border border-gray-500 w-full text-center">
              <thead>
                <tr className="text-green-500 font-bold text-center">
                  <th className="border border-gray-300 p-2 capitalize">
                    Department
                  </th>
                  <th className="border border-gray-300 p-2 capitalize">
                    Contact Person
                  </th>
                  <th className="border border-gray-300 p-2 capitalize">
                    Designation
                  </th>
                  <th className="border border-gray-300 p-2 capitalize">
                    Phone
                  </th>

                  <th className="border border-gray-300 p-2 capitalize">
                    Email
                  </th>
                  <th className="border border-gray-300 p-2 capitalize">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-xs">
                {clientpocitems.map(item => <tr>
                  <td className="border border-gray-300 p-2">
                    {item.poc_department}
                  </td>
                  <td className="border flex flex-col justify-center items-center border-gray-300 p-2">
                    {item.poc_name}
                    <Image
                      width={105}
                      src={
                        url + "/uploads/" + item.poc_file
                      }
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.poc_designation}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.poc_ph_1} {item.poc_ph_2 ? '/ ' + item.poc_ph_2 : ''}
                  </td>

                  <td className="border border-gray-300 p-2">
                    {item.email}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.location}
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

export default ClientForm;
