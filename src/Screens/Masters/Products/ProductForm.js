import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import BtnComp from "../../../Components/BtnComp";
import HeadingTemplate from "../../../Components/HeadingTemplate";
import { useFormik } from "formik";
import * as Yup from "yup";
import TDInputTemplate from "../../../Components/TDInputTemplate";
import VError from "../../../Components/VError";
import axios from "axios";
import { url } from "../../../Address/BaseUrl";
import { Message } from "../../../Components/Message";
import { Spin, Tag } from "antd";
import { LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import PrintComp from "../../../Components/PrintComp";
import AuditTrail from "../../../Components/AuditTrail";
import { Popover } from "antd";
import { BlockUI } from 'primereact/blockui';
import { useReactToPrint } from "react-to-print";
  import { useRef } from "react";
import PrintHeader from "../../../Components/PrintHeader";

function ProductForm() {
  const [cat, setCat] = useState([]);
    const contentRef = useRef(null);
      const [isPrinting, setIsPrinting] = useState(true);
    
       const reactToPrintFn = useReactToPrint({
       contentRef
      });
  const navigate = useNavigate();
  const det = JSON.parse(localStorage.getItem('perm'))
   const [blocked, setBlocked] = useState(false);

  var categories = [];
  const [count, setCount] = useState(0);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [checkLoad, setCheckLoad] = useState(false);
  const [exists, setExists] = useState(0);
  const [popOpen, setPopOpen] = useState(false);
  const [same_prod, setSameProd] = useState([]);

  const initialValues = {
    cat_id: "",
    prodnm: "",
    ar_no: "",
    pr_no: "",
    md_no: "",
    hsn_code: "",
    // stk_cnt: "",
    prod_make: "",
    prod_des: "",
  };
  const [formValues, setValues] = useState(initialValues);
  const params = useParams();
  const hide = () => {
    setPopOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setPopOpen(newOpen);
  };
  const onSubmit = (values) => {
    console.log(values, exists);
    if (exists == 0 && !checkLoad) {
      setLoading(true);

      axios
        .post(url + "/api/addproduct", {
          p_id: +params.id,
          user: localStorage.getItem("email"),
          p_name: values.prodnm,
          p_cat: values.cat_id.toString(),
          p_article: values.ar_no,
          p_model: values.md_no,
          p_part: values.pr_no,
          p_hsn: values.hsn_code,
          // p_stock: values.stk_cnt.toString(),
          p_make: values.prod_make,
          p_detailed: values.prod_des,
        })
        .then((res) => {
          setLoading(false);
          setCount((prev) => prev + 1);
          if (res.data.suc > 0) {
            Message("success", res.data.msg);
            if (params.id == 0) formik.handleReset();
          } else {
            Message("error", res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          navigate("/error" + "/" + err.code + "/" + err.message);
        });
    }
  };
  const validationSchema = Yup.object({
    // cat_id: Yup.string().required("Category is required"),
    cat_id: Yup.string().required("Category is required"),
    prodnm: Yup.string().required("Product description is required"),
    // hsn_code: Yup.string()
    //   .required("HSN Code is required")
    //   .matches(/^[0-9.-]*$/, "Invalid HSN"),
    prod_make: Yup.string().required("Product make is required"),

    // stk_cnt: Yup.number().min(1),
  });

  const formik = useFormik({
    initialValues: +params.id > 0 ? formValues : initialValues,
    onSubmit,
    validate: (values) => {
      const errors = {};
      console.log(values, exists);
      // if (exists>0 && params.id==0) {
      //     errors.prodnm = "Product already exists, please make changes to save it";
      //   }
      return errors;
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });
  useEffect(() => {
    setBlocked(det.masters==1?true:false)

    setLoading(true);
    axios.post(url + "/api/getcategory", { id: 0 }).then((res) => {
      setLoading(false);
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

      axios.post(url + "/api/getproduct", { id: params.id }).then((res) => {
        console.log(res.data.msg);
        setData(res.data?.msg);
        setLoading(false);
        setValues({
          cat_id: res?.data?.msg.prod_cat,
          prodnm: res?.data?.msg.prod_name,
          ar_no: res?.data?.msg.article_no,
          pr_no: res?.data?.msg.part_no,
          md_no: res?.data?.msg.model_no,
          hsn_code: res?.data?.msg.hsn_code,
          prod_make: res?.data?.msg.prod_make,
          prod_des: res?.data?.msg.prod_desc,
        });
      });
    }
  }, [count]);
  // const onChange = (value) => {
  //   console.log(`selected ${value}`);
  // };

  // const onSearch = (value) => {
  //   console.log('search:', value);
  // };
  return (
    <section className="bg-transparent dark:bg-[#001529]">
      {/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
      <HeadingTemplate
        text={params.id > 0 ? "Update product" : "Add product"}
        mode={params.id > 0 ? 1 : 0}
        title={"Product"}
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
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <TDInputTemplate
                  placeholder="Select category..."
                  type="text"
                  label="Category"
                  name="cat_id"
                  formControlName={formik.values.cat_id}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  data={cat}
                  mode={2}
                  disabled={params.id > 0}
                />
                {formik.errors.cat_id && formik.touched.cat_id ? (
                  <VError title={formik.errors.cat_id} />
                ) : null}
              </div>
              <div className="sm:col-span-2 mb-2">
                <Popover
                  content={
                    <>
                      <ul>
                        {same_prod?.map((lst) => (
                          <li className="my-2">
                            <Tag
                              className="cursor-pointer"
                              onClick={() => {
                                console.log(lst.count);
                                formik.setFieldValue("prodnm", lst.prod_name);
                                formik.setFieldValue("prod_des", lst.prod_desc);
                                formik.setFieldValue(
                                  "prod_make",
                                  lst.prod_make
                                );
                                setExists(lst.count);

                                // handleOpenChange(false);
                                setPopOpen(false);
                              }}
                            >
                              {lst.prod_name}
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
                    placeholder="Type product name..."
                    type="text"
                    label="Product"
                    name="prodnm"
                    formControlName={formik.values.prodnm}
                    // disabled={params.id>0}   //to be changed later
                    handleChange={(e) => { 
                      formik.handleChange(e);
                      // setCheckLoad(true);
                      axios
                        .post(url + "/api/get_same_product", {
                          wrd: e.target.value,
                        })
                        .then((res) => {
                          console.log(res);
                          if (res?.data?.msg?.length) {
                            setSameProd(res.data.msg);
                            // setCheckLoad(false);
                            setPopOpen(true);
                          } else {
                            setPopOpen(false);
                          }
                        });
                    }}
                    handleBlur={(e) => {
                      formik.handleBlur(e);
                      setCheckLoad(true);
                      axios
                        .post(url + "/api/check_product", {
                          wrd: e.target.value,
                        })
                        .then((res) => {
                          console.log(res);
                          setExists(res.data.msg[0]?.count || 0);
                          setCheckLoad(false);
                          // setPopOpen(true)
                        });
                    }}
                    mode={1}
                  />
                </Popover>
                {checkLoad && (
                  <Tag icon={<SyncOutlined spin />} color="processing">
                    Checking...
                  </Tag>
                )}
                {/* {exists} */}
                {formik.errors.prodnm && formik.touched.prodnm ? (
                  <VError title={formik.errors.prodnm} />
                ) : null}

                {exists > 0 ? (
                  <VError
                    title={
                      "Product already exists, please make changes to save it"
                    }
                  />
                ) : null}
              </div>
              <div className="sm:col-span-2 mb-2">
                <TDInputTemplate
                  placeholder="Type product make..."
                  type="text"
                  label="Product make"
                  name="prod_make"
                  formControlName={formik.values.prod_make}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={1}
                  // disabled={params.id > 0} // to be changed later
                />

                {formik.errors.prod_make && formik.touched.prod_make ? (
                  <VError title={formik.errors.prod_make} />
                ) : null}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6 mb-5 ">
              <div className="w-full mt-4">
                <TDInputTemplate
                  placeholder="Type article number..."
                  type="text"
                  label="Article no."
                  name="ar_no"
                  formControlName={formik.values.ar_no}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={1}
                />

                {formik.errors.ar_no && formik.touched.ar_no ? (
                  <VError title={formik.errors.ar_no} />
                ) : null}
              </div>
              <div className="w-full mt-4">
                <TDInputTemplate
                  placeholder="Type part no./Type No."
                  type="text"
                  label="Part no./Type No."
                  name="pr_no"
                  formControlName={formik.values.pr_no}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={1}
                />

                {formik.errors.pr_no && formik.touched.pr_no ? (
                  <VError title={formik.errors.pr_no} />
                ) : null}
              </div>
              <div className="w-full mt-4">
                <TDInputTemplate
                  placeholder="Type model number..."
                  type="text"
                  label="Model no."
                  name="md_no"
                  formControlName={formik.values.md_no}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={1}
                />

                {formik.errors.md_no && formik.touched.md_no ? (
                  <VError title={formik.errors.md_no} />
                ) : null}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <TDInputTemplate
                  placeholder="Type HSN Code..."
                  type="text"
                  label="HSN Code"
                  name="hsn_code"
                  formControlName={formik.values.hsn_code}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={1}
                />

                {formik.errors.hsn_code && formik.touched.hsn_code ? (
                  <VError title={formik.errors.hsn_code} />
                ) : null}
              </div>
              {/* <div>
                <TDInputTemplate
                  placeholder="99999"
                  type="number"
                  label="Stock Count"
                  name="stk_cnt"
                  formControlName={formik.values.stk_cnt}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={1}
                />

                {formik.errors.stk_cnt && formik.touched.stk_cnt ? (
                  <VError title={formik.errors.stk_cnt} />
                ) : null}
              </div> */}
              <div className="sm:col-span-2">
                <TDInputTemplate
                  placeholder="Type description..."
                  label="Detailed description"
                  name="prod_des"
                  formControlName={formik.values.prod_des}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  mode={3}
                />
                {formik.errors.prod_des && formik.touched.prod_des ? (
                  <VError title={formik.errors.prod_des} />
                ) : null}
              </div>
              {params.id > 0 && <AuditTrail data={data} />}
            </div>
            <BtnComp
              mode={params.id > 0 ? "E" : "A"}
              onReset={formik.handleReset}
            />
          </form>
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
              <h2 className="bg-green-500 font-bold text-lg p-3 text-white">Product</h2>
              <table className="border-collapse border border-gray-300 w-full">
        <tbody>
         
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Product
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{formik.values.prodnm}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Category
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{cat?.filter(e=>e?.code==+formik.values.cat_id)[0]?.name}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Make
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{formik.values.prod_make}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Article No.
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{formik.values.ar_no}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Part No.
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{formik.values.pr_no}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Model No.
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{formik.values.md_no}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                HSN Code
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{formik.values.hsn_code}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Description
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{formik.values.prod_des}</td>
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
     
          </div>
            </div>
            </div>
    </section>
  );
}

export default ProductForm;
