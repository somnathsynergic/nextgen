import React, { useEffect, useState } from "react";
import IMG from "../Assets/Images/Logo.png";

import { Skeleton } from "primereact/skeleton";
import axios from "axios";
import { url } from "../Address/BaseUrl";
import { useNavigate } from "react-router-dom";
import { Divider } from "antd";

function AmendPreview({ id }) {
  console.log(id)
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [floatShow, setFloatShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [delivery, setDeliveryAdd] = useState("");
  const [order_type, setOrderType] = useState("");
  const [b_order_dt, setBOrderDt] = useState("");
  const [proj_name, setProjectName] = useState("");
  const [vendor_name, setVendorName] = useState("");
  const [vend_ref, setVendRef] = useState("");
  const [po_issue_date, setPoIssueDate] = useState("");
  const [order_id, setOrderId] = useState("");
  const [itemList, setItemList] = useState([]);
  const [termList, setTermList] = useState([]);
  const [notes, setNotes] = useState("");

  const [insp_flag, setInspFlag] = useState("N");
  const [insp, setInsp] = useState("");
  const [drawing_flag, setDrawingFlag] = useState("N");
  const [drawing, setDrawing] = useState("");
  const [mdcc_flag, setMdccFlag] = useState("N");

  const [mdcc, setMdcc] = useState("");
  const [drawingDate, setDrawingDate] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [price_basis_flag, setPriceBasisFlag] = useState("");
  const [price_basis_desc, setPriceBasisDesc] = useState("");
  const [packing_forwarding, setPackingForwarding] = useState("");
  const [packing_forwardingExtra, setPackingForwardingExtra] = useState("");
  const [packing_forwardingExtraVal, setPackingForwardingExtraVal] =
    useState("");
  const [pf_cgst, setpfcgst] = useState("");
  const [pf_sgst, setpfsgst] = useState("");
  const [pf_igst, setpfigst] = useState("");
  const [freight_insurance, setFreightInsurance] = useState("");
  const [freight_insurance_val, setFreightInsuranceVal] = useState("");
  const [freight_insurance_extra_val, setFreightInsuranceExtraVal] =
    useState("");
  const [freight_cgst, setfreightcgst] = useState("");
  const [freight_sgst, setfreightsgst] = useState("");
  const [freight_igst, setfreightigst] = useState("");
  const [insurance, setInsurance] = useState("");
  const [insurance_val, setInsuranceVal] = useState("");
  const [ins_extra_val, setinsExtraVal] = useState("");
  const [freight_extra, setFreightExtra] = useState("");
  const [ins_extra, setInsExtra] = useState("");

  const [ins_cgst, setinscgst] = useState("");
  const [ins_sgst, setinssgst] = useState("");
  const [ins_igst, setinsigst] = useState("");
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

  const [v_name, setVName] = useState("");
  const [v_address, setVAddress] = useState("");
  const [v_email, setVEmail] = useState("");
  const [v_phone, setVPhone] = useState("");
  const [v_gst, setVGST] = useState("");
  const [v_pan, setVPAN] = useState("");
  const [prodInfo, setProdInfo] = useState();
  const [grandTot, setGrandTot] = useState(0);
  const [dispatch_dt, setdispatchdt] = useState(false);
  const [comm_dt, setcommdt] = useState(false);
  //  const [po_no,setPoNo]=useState('')
  const [totVal, setTotVal] = useState(0);
  var tot = 0;
  useEffect(() => {
    setLoading(true);
    axios
      .post(url + "/api/getvendor", { id: 0 })
      .then((resvendor) => {
        setLoading(true);
        console.log(resvendor);
        setVendors(resvendor?.data?.msg);
        // setVName(res?.data?.msg?.vendor_name)
        // setVAddress(res?.data?.msg?.vendor_address)
        // setVEmail(res?.data?.msg?.vendor_email)
        // setVPhone(res?.data?.msg?.vendor_phone)
        // setVGST(res?.data?.msg?.vendor_gst)
        // setVPAN(res?.data?.msg?.vendor_pan)
        axios
          .post(url + "/api/getpreviewitems", { id: id })
          .then((resItems) => {
            console.log(resItems);
            tot = 0;
            setProdInfo(resItems?.data?.msg);
            console.log(prodInfo);
            for (let item of resItems?.data?.msg) {
              if (item.sgst_id) {
                tot += (item.item_rt - item.discount) * item.quantity;
              } else {
                tot += (item.item_rt - item.discount) * item.quantity;
              }
            }
            console.log(tot);

            setGrandTot(tot.toFixed(2));
            tot = 0;
            // "prod_name": "Prod_2",
            // "prod_make": "Make_2",
            // "catg_name": "Misc",
            // "part_no": "Part_2",
            // "model_no": "Model_2",
            // "article_no": "Ar_2",
            // "hsn_code": "444445",
            // "prod_desc": "Desc",
            // "quantity": 10,
            // "item_rt": 7.0,
            // "discount": 4.0,
            // "unit_name": "Gm"

            // setLoading(true)
            // console.log(res)
            // setVName(res?.data?.msg?.vendor_name)
            // setVAddress(res?.data?.msg?.vendor_address)
            // setVEmail(res?.data?.msg?.vendor_email)
            // setVPhone(res?.data?.msg?.vendor_phone)
            // setVGST(res?.data?.msg?.vendor_gst)
            // setVPAN(res?.data?.msg?.vendor_pan)
            // setLoading(false)
            // axios.post(url+'/api/getpo',{id:localStorage.getItem('id')}).then(res=>{
            //     console.log(res)
            //     setPoNo(res?.data?.msg?.po_no)
            // setLoading(false)
          })
          .catch((err) =>
            navigate("/error" + "/" + err.code + "/" + err.message)
          );

        // })
        axios
          .post(url + "/api/po_list_to_amend", { id: id })
          .then((res) => {
            console.log(res);
            //   localStorage.setItem('id',params.id)
            //   localStorage.setItem("order_id",res?.data?.msg?.po_id)
            //   localStorage.setItem("order_date",res?.data?.msg?.po_date)
            //   localStorage.setItem("order_type",res?.data?.msg?.type)
            //   localStorage.setItem("proj_name",res?.data?.msg?.project_id)
            //   localStorage.setItem("vendor_name",res?.data?.msg?.vendor_id)
            //   localStorage.setItem("po_status",res?.data?.msg?.po_status)
            //   localStorage.setItem("po_issue_date",res?.data?.msg?.po_issue_date)
            //   localStorage.setItem('po_no',res?.data?.msg?.po_no)
            //   console.log('type   ',typeof(localStorage.getItem('po_no')))
            setClickFlag(res?.data?.msg?.po_status);
            setBOrderDt(res?.data?.msg?.po_date);
            setOrderType(res?.data?.msg?.type);
            setOrderId(res?.data?.msg?.po_id);
            setProjectName(res?.data?.msg?.project_id);
            setVendorName(res?.data?.msg?.vendor_id);
            setVendRef(res?.data?.msg?.vend_ref);
            setPoIssueDate(res?.data?.msg?.po_issue_date);
            setPoNo(res?.data?.msg?.po_no);
            console.log(resvendor?.data?.msg);

            setVName(
              resvendor?.data?.msg?.filter(
                (e) => e.sl_no == res?.data?.msg?.vendor_id
              )[0]?.vendor_name
            );
            setVAddress(
              resvendor?.data?.msg?.filter(
                (e) => e.sl_no == res?.data?.msg?.vendor_id
              )[0]?.vendor_address
            );
            setVEmail(
              resvendor?.data?.msg?.filter(
                (e) => e.sl_no == res?.data?.msg?.vendor_id
              )[0]?.vendor_email
            );
            setVPhone(
              resvendor?.data?.msg?.filter(
                (e) => e.sl_no == res?.data?.msg?.vendor_id
              )[0]?.vendor_phone
            );
            setVGST(
              resvendor?.data?.msg?.filter(
                (e) => e.sl_no == res?.data?.msg?.vendor_id
              )[0]?.vendor_gst
            );
            setVPAN(
              resvendor?.data?.msg?.filter(
                (e) => e.sl_no == res?.data?.msg?.vendor_id
              )[0]?.vendor_pan
            );
            axios
              .post(url + "/api/getpoitem", { id: id })
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
                    SGST: resItem?.data?.msg[i].sgst_id,
                    CGST: resItem?.data?.msg[i].cgst_id,
                    IGST: resItem?.data?.msg[i].igst_id,
                    delivery_dt: resItem?.data?.msg[i].delivery_dt,
                    delivery_to: resItem?.data?.msg[i].delivery_to,
                    unit_price:
                      resItem?.data?.msg[i].item_rt -
                      resItem?.data?.msg[i].discount,
                    delivery_date: resItem?.data?.msg[i].delivery_dt,
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
                  .post(url + "/api/getpoterms", { id: id })
                  .then((resTerm) => {
                    console.log(resTerm);
                    setPriceBasisFlag(resTerm?.data?.msg[0]?.price_basis);
                    setPriceBasisDesc(resTerm?.data?.msg[0]?.price_basis_desc);
                    setPackingForwarding(
                      resTerm?.data?.msg[0]?.packing_fwd_val
                    );
                    setPackingForwardingExtra(
                      resTerm?.data?.msg[0]?.packing_fwd_extra
                    );
                    setPackingForwardingExtraVal(
                      resTerm?.data?.msg[0]?.packing_fwd_extra_val
                    );
                    setpfcgst(resTerm?.data?.msg[0]?.pf_cgst);
                    setpfsgst(resTerm?.data?.msg[0]?.pf_sgst);
                    setpfigst(resTerm?.data?.msg[0]?.pf_igst);
                    setFreightInsurance(resTerm?.data?.msg[0]?.freight_ins);
                    setFreightInsuranceVal(
                      resTerm?.data?.msg[0]?.freight_ins_val
                    );
                    setFreightInsuranceExtraVal(
                      resTerm?.data?.msg[0]?.freight_extra_val
                    );
                    setfreightcgst(resTerm?.data?.msg[0]?.freight_cgst);
                    setfreightsgst(resTerm?.data?.msg[0]?.freight_sgst);
                    setfreightigst(resTerm?.data?.msg[0]?.freight_igst);
                    setInsurance(resTerm?.data?.msg[0]?.ins);
                    setInsuranceVal(resTerm?.data?.msg[0]?.ins_val);
                    setinsExtraVal(resTerm?.data?.msg[0]?.ins_extra_val);
                    setFreightExtra(resTerm?.data?.msg[0]?.freight_extra);
                    setInsExtra(resTerm?.data?.msg[0]?.ins_extra);

                    setinscgst(resTerm?.data?.msg[0]?.ins_cgst);
                    setinssgst(resTerm?.data?.msg[0]?.ins_sgst);
                    setinsigst(resTerm?.data?.msg[0]?.ins_igst);
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
                    setDurationVal(resTerm?.data?.msg[0]?.duration_value);
                    setOMFlag(resTerm?.data?.msg[0]?.o_m_manual);
                    setOMDesc(resTerm?.data?.msg[0]?.o_m_desc);
                    setOIFlag(resTerm?.data?.msg[0]?.operation_installation);
                    setOIDesc(
                      resTerm?.data?.msg[0]?.operation_installation_desc
                    );
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
                      freight_insurance: resTerm?.data?.msg[0]?.freight_ins,
                      freight_insurance_val:
                        resTerm?.data?.msg[0]?.freight_ins_val,
                      insurance: resTerm?.data?.msg[0]?.ins,
                      insurance_val: resTerm?.data?.msg[0]?.ins_val,
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
                      om_manual_flag: resTerm?.data?.msg[0]?.o_m_manual,
                      om_manual_desc: resTerm?.data?.msg[0]?.o_m_desc,
                      oi_flag: resTerm?.data?.msg[0]?.operation_installation,
                      oi_desc:
                        resTerm?.data?.msg[0]?.operation_installation_desc,
                      packing_type: resTerm?.data?.msg[0]?.packing_type,
                      packing_val: resTerm?.data?.msg[0]?.packing_val,
                      manufacture_clearance:
                        resTerm?.data?.msg[0]?.manufacture_clearance,
                      manufacture_clearance_desc:
                        resTerm?.data?.msg[0]?.manufacture_clearance_desc,
                    };
                    console.log(terms_conditions);
                    //   localStorage.setItem('terms',JSON.stringify(terms_conditions))
                  })
                  .catch((err) =>
                    navigate("/error" + "/" + err.code + "/" + err.message)
                  );
                axios
                  .post(url + "/api/getpopayterms", { id: id })
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
                    // localStorage.setItem('termList',JSON.stringify(termList))
                    axios
                      .post(url + "/api/getpodelivery", { id: id })
                      .then((resDel) => {
                        console.log(resDel);
                        setDeliveryAdd(resDel?.data?.msg[0]?.ship_to);

                        // const [first, ...rest] = resDel?.data?.msg[0]?.ship_to?.split(",");
                        //   localStorage.setItem('ship_to',resDel?.data?.msg[0]?.ship_to)
                        setWareHouse(resDel?.data?.msg[0]?.ware_house_flag);
                        //   localStorage.setItem('ware_house_flag',resDel?.data?.msg[0]?.ware_house_flag)
                        setNotes(resDel?.data?.msg[0]?.po_notes);
                        //   localStorage.setItem('notes',resDel?.data?.msg[0]?.po_notes)
                        axios
                          .post(url + "/api/getpomore", { id: id })
                          .then((resMore) => {
                            console.log(resMore);
                            setInspFlag(resMore?.data?.msg[0]?.inspection);
                            setInsp(resMore?.data?.msg[0]?.inspection_scope);
                            setMdccFlag(resMore?.data?.msg[0]?.mdcc);
                            setMdcc(resMore?.data?.msg[0]?.mdcc_scope);
                            setDrawingFlag(resMore?.data?.msg[0]?.draw);
                            setDrawing(resMore?.data?.msg[0]?.draw_scope);
                            setDrawingDate(resMore?.data?.msg[0]?.draw_period);
                            // localStorage.setItem("mdcc_flag",resMore?.data?.msg[0]?.mdcc)
                            // localStorage.setItem("mdcc",resMore?.data?.msg[0]?.mdcc_scope)
                            // localStorage.setItem("insp_flag",resMore?.data?.msg[0]?.inspection)
                            // localStorage.setItem("insp",resMore?.data?.msg[0]?.inspection_scope)
                            // localStorage.setItem("drawing_flag",resMore?.data?.msg[0]?.draw)
                            // localStorage.setItem("drawing",resMore?.data?.msg[0]?.draw_scope)
                            // localStorage.setItem("dt",resMore?.data?.msg[0]?.draw_period)
                            axios
                              .post(url + "/api/getpocomments", { id: id })
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
                                      resCom?.data?.msg[
                                        i
                                      ].created_by.toString(),
                                  });
                                }
                                setTimeline(timeline);
                                console.log(timeline);
                                setLoading(false);
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
      })
      .catch((err) => navigate("/error" + "/" + err.code + "/" + err.message));
  }, [id]);

  return (
    <div>
      {/* {id} */}

      {loading && (
        <div className="w-full">
          <Skeleton
            width="60rem"
            className="mb-2 w-full bg-gray-300"
          ></Skeleton>
          <Skeleton
            width="60rem"
            className="mb-2 w-full bg-gray-300"
          ></Skeleton>
          <Skeleton
            width="60rem"
            className="mb-2 w-full bg-gray-300"
          ></Skeleton>
          <Skeleton
            width="60rem"
            className="mb-2 w-full bg-gray-300"
          ></Skeleton>
          <Skeleton
            width="60rem"
            className="mb-2 w-full bg-gray-300"
            height="4rem"
          ></Skeleton>
        </div>
      )}

      {!loading && (
        // <div className="h-full  border-2  mx-auto w-6/12 px-5 rounded-md border-green-500">
        <div className="h-full border p-3 border-green-500 rounded-md">
          <div className="flex justify-center items-center">
            <span className="text-xl text-green-500 font-extrabold  mb-2 ">
              Purchase Order
            </span>
          </div>
          <div className="grid grid-cols-12 items-center px-3 w-full">
            <div className="col-span-6 flex flex-col text-xs gap-2  text-gray-800 ">
            <div className="text-gray-800 font-bold">
                    <span className=" font-bold text-green-700">PO No.: </span>{" "}
                    {po_no ? po_no : ""}
                  </div>
              <div className="text-gray-800 font-bold">
                                 <span className=" font-bold text-green-700">PO Date:</span>{" "}
                                {po_issue_date}
                               </div>
              {po_no?.split("-").length > 2 && (
                                <div className="text-gray-800 font-bold">
                                  <span className=" font-bold text-green-700">
                                    Amendement No.:{" "}
                                  </span>
                                  {po_no?.split("-")[2]}{" "}
                                </div>
                              )}
                              {po_no?.split("-").length > 2 && (
                                <div className="text-gray-800 font-bold">
                                  <span className=" font-bold text-green-700">
                                    Parent PO:{" "}
                                  </span>{" "}
                                  {po_no?.split("-")[0]}-{po_no?.split("-")[1]} 
                                
                                </div>
                              )}
              {/* <p className="uppercase font-extrabold">Latest Amendement No:</p> */}
              {/* <p className="uppercase font-extrabold">Amendment Date:</p> */}
              {/* <p className="uppercase font-extrabold">Value: {grandTot}</p> */}
              {/* <span className="uppercase font-extrabold">Status No:  {localStorage.getItem('po_status')=='P'?'In Progress':localStorage.getItem('po_status')=='U'?'Unapproved':localStorage.getItem('po_status')=='A'?'Approved':localStorage.getItem('po_status')=='D'?'Delivered':'Partial Delivery'}</span> */}
            </div>
            <div className="col-span-6 flex flex-col text-xs gap-2  text-gray-800 items-end justify-end">
                  <img src={IMG} className="sm:h-16 h-12" alt="Flowbite Logo" />
                  <span className="my-5 mx-3 mb-5 text-xs">
                    <p>NextGen Automation Pvt Ltd,</p>
                    <p>Unit - 102, 1st Floor, PS PACE 1/1A,</p>{" "}
                    <p> Mahendra Roy Lane Kolkata 700046 </p>
                    <p> Ph-033 4068 6032/6450 0535</p>
                    <p>Email:info@ngapl.com</p>
                    {/* <p>/susanta.karanjai@ngapl.com</p> */}
                    <p>GSTIN: 19AABCN5744L1Z1</p>
                  </span>
                </div>
          </div>
          <Divider />

          <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2">
                 
                 <div className="my-2 w-full py-1 px-3 text-gray-50 font-semibold border border-green-500 bg-green-500 ">
                   Vendor Details
                 </div>
                 <div className="flex flex-col text-xs gap-1 text-gray-800 px-3 ">
                   <div className="text-bold">
                     {" "}
                     <span className=" font-bold text-green-700">Name: </span>
                     {v_name}
                   </div>
                   <div className="text-bold">
                     {" "}
                     <span className=" font-bold text-green-700">
                       {" "}
                       Address:
                     </span>{" "}
                     {v_address}
                   </div>
                   <div className="text-bold">
                     {" "}
                     <span className=" font-bold text-green-700">
                       {" "}
                       Email:{" "}
                     </span>{" "}
                     {v_email}
                   </div>
                   <div className="text-bold">
                     {" "}
                     <span className=" font-bold text-green-700">Phone: </span>
                     {v_phone}
                   </div>
                   <div className="text-bold">
                     {" "}
                     <span className=" font-bold text-green-700">
                       GST:
                     </span>{" "}
                     {v_gst}
                   </div>
                   <div className="text-bold">
                     {" "}
                     <span className=" font-bold text-green-700">
                       {" "}
                       PAN:{" "}
                     </span>{" "}
                     {v_pan}
                   </div>
                   <div className="text-bold">
                     {" "}
                     <span className=" font-bold text-green-700">
                       {" "}
                       Reference:
                     </span>{" "}
                     {localStorage.getItem("vend_ref")}
                   </div>
                   <div className="text-bold">
                     {" "}
                     <span className=" font-bold text-xs text-green-700">
                       {" "}
                       Vendor Contact Person(s):
                     </span>{" "}
                     {/* <ul>
                       {" "}
                       {vpoc?.map((item) => (
                         <li>
                           {item?.poc_name},{item?.poc_email} {item?.poc_ph_1}
                           {item?.poc_ph_2 ? "/" + item?.poc_ph_2 : ""}{" "}
                         </li>
                       ))}{" "}
                     </ul> */}
                   </div>
                 </div>
               </div>
          </div>
          <Divider />

          <div className="grid grid-cols-2 gap-2 my-2">
            <div className="col-span-1 border border-gray-300">
              <div className="w-full px-3 py-1 mb-1  text-gray-50 font-semibold bg-green-500  border border-green-500 ">
                Bill To
              </div>
              <p className="text-xs px-3 py-1 mt-1">
                    {" "}
                    NextGen Automation Pvt Ltd
                  </p>
              <p className="text-xs px-3 py-1 mt-1">
                {" "}
                Unit - 102, 1st Floor, PS PACE 1/1A, Mahendra Roy Lane Kolkata
                700046
              </p>{" "}
              <p className="text-xs  px-3 py-1"> Ph-033 4068 6032/6450 0535</p>{" "}
              <p className="text-xs  px-3 py-1"> Email: info@ngapl.com</p>
            </div>
            <div className="col-span-1 border border-gray-300  ">
              <div className="w-full px-3 py-1 mb-1  text-gray-50 font-semibold bg-green-500  border border-green-500 ">
                Ship To
              </div>
              <p className="text-xs py-1 px-3"> {delivery} </p>
            </div>
          </div>
          <Divider />

          <p className="mb-5">
            <div className="my-2 w-full p-2 text-black font-semibold  border-2 border-green-500 bg-green-500 ">
              Item Description
            </div>

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
                <thead className="text-xs text-nowrap font-bold text-green-500 uppercase bg-white dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Sl. No.
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Item-Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Rate
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Discount(%)
                    </th>
                    <th scope="col" className="px-1 py-3">
                      CGST
                    </th>
                    <th scope="col" className="px-1 py-3">
                      SGST
                    </th>
                    <th scope="col" className="px-1 py-3">
                      IGST
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Total GST
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Unit Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prodInfo?.length > 0 &&
                    prodInfo?.map((item, index) => (
                      <>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-1 py-1 text-xs" rowSpan={2}>
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 flex flex-col gap-1 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {item.prod_name}
                          </td>
                          <td className="px-6 py-4" rowSpan={2}>
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4" rowSpan={2}>
                            {item.item_rt}
                          </td>
                          <td className="px-6 py-4" rowSpan={2}>
                            {item.discount} ({item.discount_percent}%)
                          </td>
                          <td className="px-1 py-1 text-xs" rowSpan={2}>
                            {item.cgst_id > 0
                              ? (
                                  (+item.item_rt - +item.discount) *
                                  +item.quantity *
                                  (+item.cgst_id / 100)
                                ).toFixed(2)
                              : ""}{" "}
                            {item.cgst_id > 0 ? "(" + item.cgst_id + "%)" : ""}
                          </td>
                          <td className="px-1 py-1 text-xs" rowSpan={2}>
                            {item.sgst_id > 0
                              ? (
                                  (+item.item_rt - +item.discount) *
                                  +item.quantity *
                                  (+item.sgst_id / 100)
                                ).toFixed(2)
                              : ""}{" "}
                            {item.sgst_id > 0 ? "(" + item.sgst_id + "%)" : ""}
                          </td>
                          <td className="px-1 py-1 text-xs" rowSpan={2}>
                            {+item.igst_id > 0
                              ? (
                                  (+item.item_rt - +item.discount) *
                                  +item.quantity *
                                  (+item.igst_id / 100)
                                ).toFixed(2)
                              : ""}{" "}
                            {item.igst_id > 0 ? "(" + item.igst_id + "%)" : ""}
                          </td>

                          <td className="px-1 py-1 text-xs " rowSpan={2}>
                            {item.sgst_id > 0
                              ? (
                                  (+item.item_rt - +item.discount) *
                                    +item.quantity *
                                    (+item.cgst_id / 100) +
                                  (+item.item_rt - +item.discount) *
                                    +item.quantity *
                                    (+item.sgst_id / 100)
                                ).toFixed(2)
                              : (
                                  (+item.item_rt - +item.discount) *
                                    +item.quantity *
                                    (+item.igst_id / 100) +
                                  (item.item_rt - item.discount) * item.quantity
                                ).toFixed(2)}
                          </td>
                          <td className="px-6 py-4" rowSpan={2}>
                            {+item.item_rt - +item.discount}
                          </td>
                          <td className="px-6 py-4" rowSpan={2}>
                            {item.sgst_id > 0
                              ? (
                                  (+item.item_rt - +item.discount) *
                                    +item.quantity *
                                    (+item.cgst_id / 100) +
                                  (+item.item_rt - +item.discount) *
                                    +item.quantity *
                                    (+item.sgst_id / 100) +
                                  (item.item_rt - item.discount) * item.quantity
                                ).toFixed(2)
                              : (
                                  (+item.item_rt - +item.discount) *
                                    +item.quantity *
                                    (+item.igst_id / 100) +
                                  (item.item_rt - item.discount) * item.quantity
                                ).toFixed(2)}
                          </td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-6 py-4 text-xs gap-3">
                            <p>Make: {item.prod_make} </p>
                            <p>Category: {item.catg_name} </p>
                            <p> UOM: {item.unit_name}</p>
                            <p> Part No./Type No.: {item.part_no} </p>
                            <p>Model No.: {item.model_no} </p>
                            <p> Article No.: {item.article_no}</p>
                            <p>HSN: {item.hsn_code} </p>
                            <p>Desc: {item.prod_desc} </p>
                            <p>Delivery from: {item.delivery_dt} to {item.delivery_to} </p>
                           
                          </td>
                        </tr>
                      </>
                    ))}
                </tbody>
                <tfoot>
                  <tr class="font-semibold text-gray-900 dark:text-white">
                    <th
                      scope="row"
                      class="px-6 py-3 text-base font-bold"
                      colSpan={10}
                    >
                      Total
                    </th>
                    <th class="px-6 py-3 text-base font-bold">{grandTot}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </p>
          <Divider />

          <p className="mb-5">
            <div className="my-2 w-full p-2 text-black font-semibold  border-2 border-green-500 bg-green-500 ">
              Payment Terms
            </div>
            <ul className="space-y-1 text-gray-700 p-2 list-disc list-inside dark:text-gray-400">
              {termList.length > 0 &&
                termList.map((item) => (
                  <li>
                    {item.stage} - {item.term}
                  </li>
                ))}
            </ul>
          </p>
          <Divider />

          <p className="mb-5">
            <div className="my-2 w-full p-2 text-black font-semibold  border-2 border-green-500 bg-green-500 ">
              Terms & Conditions
            </div>

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
                <tbody>
                  <tr className="bg-white border-b text-nowrap dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Price Basis
                    </th>
                    <td className="px-6 py-4">
                      {price_basis_flag == "F" ? "FOR" : "EX-WORKS"},{" "}
                      {price_basis_desc}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Packing & Forwarding
                    </th>
                    <td className="px-6 py-4">
                      {packing_forwarding == "I"
                        ? "Inclusive"
                        : `Extra  ${packing_forwardingExtra}% - ${(
                            (grandTot * packing_forwardingExtra) /
                            100
                          ).toFixed(2)}
                (CGST-${(
                  (pf_cgst * packing_forwardingExtra * grandTot) /
                  10000
                ).toFixed(2)} SGST-${(
                            (pf_sgst * packing_forwardingExtra * grandTot) /
                            10000
                          ).toFixed(2)} IGST-${(
                            (pf_igst * packing_forwardingExtra * grandTot) /
                            10000
                          ).toFixed(2)})
                
                `}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Freight
                    </th>
                    <td className="px-6 py-4">
                      {freight_insurance == "I" ? "Inclusive" : "Extra"} -
                      {freight_extra}% {freight_insurance_extra_val}
                      {/* {(grandTot * freight_insurance_extra_val/100).toFixed(2)} */}
                      {freight_extra > 0 && freight_insurance != "I" && (
                        <span>
                          {" "}
                          (CGST-
                          {(
                            (freight_cgst * freight_insurance_extra_val) /
                            100
                          ).toFixed(2)}{" "}
                          SGST-
                          {(
                            (freight_sgst * freight_insurance_extra_val) /
                            100
                          ).toFixed(2)}{" "}
                          IGST-
                          {(
                            (freight_igst * freight_insurance_extra_val) /
                            100
                          ).toFixed(2)}
                          )
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Insurance
                    </th>
                    {ins_extra > 0 ? (
                      <td className="px-6 py-4">
                        {insurance == "Y"
                          ? `${insurance_val}${ins_extra}% ${ins_extra_val} 
                
                (CGST-${((ins_cgst * ins_extra_val) / 100).toFixed(2)} SGST ${(
                              (ins_sgst * ins_extra_val) /
                              100
                            ).toFixed(2)} IGST ${(
                              (ins_igst * ins_extra_val) /
                              100
                            ).toFixed(2)})`
                          : "N/A"}

                        {/* (CGST-{(freight_cgst*freight_insurance_val/100).toFixed(2)} SGST-{(freight_sgst*freight_insurance_val/100).toFixed(2)} IGST-{(freight_igst*freight_insurance_val/100).toFixed(2)}) */}
                      </td>
                    ) : (
                      <td className="px-6 py-4">
                        {insurance == "Y" ? `${insurance_val}` : "N/A"}

                        {/* (CGST-{(freight_cgst*freight_insurance_val/100).toFixed(2)} SGST-{(freight_sgst*freight_insurance_val/100).toFixed(2)} IGST-{(freight_igst*freight_insurance_val/100).toFixed(2)}) */}
                      </td>
                    )}
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Test Certificate
                    </th>
                    <td className="px-6 py-4">
                      {test_certificate == "Y"
                        ? "Yes, " + test_certificate_desc
                        : "N/A"}
                    </td>
                  </tr>

                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Warranty/Guarantee
                    </th>
                    <td className="px-6 py-4">
                      {/* {warranty_guarantee_flag=='W'?'Warranty':'Guarantee'} duration: {duration_val} {duration=='M'?'month(s)':duration=='D'?'day(s)':'year(s)'} */}
                      {/* {comm_dt && ' from the date of commission'}
                {comm_dt && dispatch_dt ? ' or from the date of dispatch':!comm_dt && !dispatch_dt?'':dispatch_dt?'from the date of dispatch.':''}
                {comm_dt && dispatch_dt && ' ,whichever is earlier.'} */}
                      <p className="block">
                        At the time of dispatch, vendor will issue{" "}
                        {warranty_guarantee_flag == "W" ? (
                          <span>
                            Warranty Certificate of 18 months from the date of
                            dispatch or 12 months from the date of installation
                            whichever is earlier
                          </span>
                        ) : (
                          <span>
                            Guarantee Certificate of 18 months from the date of
                            dispatch or 12 months from the date of installation
                            whichever is earlier.
                          </span>
                        )}
                      </p>
                    </td>
                  </tr>

                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      O & M Manual
                    </th>
                    <td className="px-6 py-4">
                      {om_manual_flag == "A"
                        ? "Applicable. " + om_manual_desc
                        : "N/A"}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Operation/Installation
                    </th>
                    <td className="px-6 py-4">
                      {oi_flag == "A" ? "Applicable. " + oi_desc : "N/A"}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Packing Type
                    </th>
                    <td className="px-6 py-4">
                      {packing_type == "W"
                        ? "Wooden"
                        : packing_type == "C"
                        ? "Crate Packing"
                        : packing_type == "S"
                        ? "Steel-worthy"
                        : packing_type == "P"
                        ? "Plastic Wrap"
                        : packing_type == "O"
                        ? packing_val
                        : ""}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Manufacture Clearance
                    </th>
                    <td className="px-6 py-4">
                      {manufacture_clearance == "A"
                        ? "Applicable. " + manufacture_clearance_desc
                        : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </p>

          <p className="mb-5">
            <div className="my-2 w-full p-2 text-black font-semibold  border-2 border-green-500 bg-green-500 ">
              Liquidity Damages
            </div>

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
                {/* <thead className="text-xs text-nowrap font-bold text-green-500 uppercase bg-white dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    LD Applicable date
                </th>
                <th scope="col" className="px-6 py-3">
                    LD applied on
                </th>
                <th scope="col" className="px-6 py-3">
                    Ld value(%)
                </th>
                <th scope="col" className="px-6 py-3">
                    Maximum (%) on PO value
                </th>
                
            </tr>
        </thead> */}
                <tbody>
                  <tr className="bg-white border-b text-nowrap dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      LD Applicable date:
                    </th>
                    <td className="px-6 py-4">
                      {ld_applicable_date == "O"
                        ? `Others - ${others_ld}`
                        : ld_applicable_date == "M"
                        ? "MRN Date"
                        : ld_applicable_date == "NA"
                        ? "N/A"
                        : "Dispatch Date"}
                    </td>
                  </tr>
                  <tr className="bg-white border-b text-nowrap dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      LD applied on:
                    </th>
                    <td className="px-6 py-4">
                      {ld_applied_on == "O"
                        ? `Others - ${others_applied}`
                        : ld_applicable_date == "P"
                        ? "Pending Material Value"
                        : ld_applicable_date == "NA"
                        ? ""
                        : "PO Total Value(%)"}
                    </td>
                  </tr>
                  <tr className="bg-white border-b text-nowrap dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Ld value(%):
                    </th>
                    <td className="px-6 py-4 text-wrap">
                      {ld_applicable_date == "NA"
                        ? ""
                        : "LD @" +
                          ld_value +
                          "% per week to a maximum of" +
                          po_min_value +
                          "% of the order value would be applicable for any delay beyond the stipulated delivery period."}
                    </td>
                  </tr>
                  <tr className="bg-white border-b text-nowrap dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Maximum (%) on PO value:
                    </th>
                    <td className="px-6 py-4">
                      {ld_applicable_date == "NA" ? "" : po_min_value+'%'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Divider />
            <table className="w-full my-10 text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
              <tbody>
                <tr className="bg-white border-b text-nowrap dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    MDCC
                  </th>
                  <td className="px-6 py-4">
                    {localStorage.getItem("mdcc_flag") == "Y"
                      ? "Yes. " + localStorage.getItem("mdcc")
                      : "N/A"}
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Inspection
                  </th>
                  <td className="px-6 py-4">
                    {localStorage.getItem("insp_flag") == "Y"
                      ? "Yes. " + localStorage.getItem("insp")
                      : "N/A"}
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Drawing/Datasheet
                  </th>
                  <td className="px-6 py-4">
                    {localStorage.getItem("drawing_flag") == "Y"
                      ? "Yes . " +
                        localStorage.getItem("drawing") +
                        ", " +
                        localStorage.getItem("dt")
                      : "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </p>
          <Divider />
          <p className="mb-5">
            <div className="my-2 w-full p-2 text-black font-semibold  border-2 border-green-500 bg-green-500 ">
              Notes
            </div>
            <span className="p-2">{localStorage.getItem("notes")}</span>
          </p>

          <Divider />
          <p className="mb-5">
            <h3>Default Note:</h3>
            <table className="border-2 border-gray-300 border-collapse my-1 p-3">
              <tr className="border-2 border-gray-300">
                <td rowspan="2" className="border-2 border-gray-300">
                  Tax Invoice shall be of minimum three (3) copies with—
                  <br />
                  1. GSTIN of supplier
                  <br />
                  2. HSN/ SAC code of each & every materials/goods
                  <br />
                  3. Description of goods as per HSN/ SAC code
                  <br />
                  4. Description of goods as per ordered/ offered/ standard
                  practice (or convenient name)
                </td>
                <td className="border-2 border-gray-300">
                  Original for recipient (to be submitted directly to the
                  purchaser)
                </td>
              </tr>
              <tr className="border-2 border-gray-300">
                <td className="border-2 border-gray-300">
                  Duplicate for transporter (to be moved with materials/goods &
                  deliver to consignee)
                </td>
              </tr>
              <tr className="border-2 border-gray-300">
                <td rowspan="2" className="border-2 border-gray-300">
                  Payment of GST & ITC credit, if not available as per GST Act
                  within the specific time period —
                </td>
                <td>
                  1. Amount will be deducted from supplier’s any Tax invoice
                  without any intimation & will be non-refundable.
                </td>
              </tr>
              <tr>
                <td>
                  2. For any violation against norms of GST, supplier shall be
                  solely responsible for matter related to tax invoice.
                </td>
              </tr>
              <tr className="border-2 border-gray-300">
                <td className="border-2 border-gray-300">
                  MDCC (Material Dispatch Clearance Certificate)
                </td>
                <td className="border-2 border-gray-300">
                  To be strictly followed before movement of the goods or raise
                  invoice.
                </td>
              </tr>
            </table>
          </p>
        </div>
      )}
    </div>
  );
}

export default AmendPreview;
