import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { url } from "../../Address/BaseUrl";
import axios from "axios";
import { motion } from "framer-motion";
import nodata from "../../../src/Assets/Images/nodata.png";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import SkeletonLoading from "../../Components/SkeletonLoading";
import CompositeSearch from "../../Components/CompositeSearch";
import DialogBox from "../../Components/DialogBox";
import { Tag } from "antd";
import Radiobtn from "../../Components/Radiobtn";
import { Message } from "../../Components/Message";
import Pagination from "../../Components/Pagination";
import { Tabs } from 'antd';

function ApproveMrn() {
    const [viewKey,setViewKey] = useState(1)
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [searchVal, setSearchVal] = useState("");
    const [loading, setLoading] = useState(false);
    const [delFlag, setDelFlag] = useState();
    const [invoice,setInvoice] = useState()
    const [po_no,setPoNo] = useState()
    const [mrnDetails, setMrnDetails] = useState([]);
    const [itemInfo,setItemInfo] = useState([])
  const [fileList, setFileList] = useState([]);
  const [itemStock,setItemStock] = useState([])
  const [clickFlag,setClickFlag] = useState(0)
  const [flag,setFlag] = useState(0)
   const items= [
  {
    key: '1',
    label: 'Non-Siemens',
    children: '',
  },
  {
    key: '2',
    label: 'Siemens',
    children: '',
  },
 
];
  const onChoiceChange = (key) => {
  console.log(key);
  setViewKey(key)
  setLoading(true)
  if(key==1){
    axios.post(url + "/api/getdeliveryapproval", { id: 0 }).then((res) => {
        console.log(res);
        setLoading(false);
      
            setCopy(res?.data?.msg.filter(e=>e.po_status=='A' &&  e.invoice_count>0 ));
            setPoData(res?.data?.msg.filter(e=>e.po_status=='A' &&  e.invoice_count>0 && e.approve_flag=='P'
              ));
            
      });
  }
  else{
 axios.post(url + "/api/getsiemensdeliveryapproval", { id: 0 }).then((res) => {
        console.log(res);
        setLoading(false);
      
            setCopy(res?.data?.msg);
            setPoData(res?.data?.msg);
            
      });
  }
};
    const onPageChange = (event) => {
      setFirst(event.first);
      setRows(event.rows);
    };
    const rdBtn = [
      { label: "Approved/Unapproved", value: 1 },
      { label: "Pending", value: 2 },
    ];
    const [value, setValue] = useState(2);
    const [po_data, setPoData] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [vendorList, setVendorList] = useState([]);
    const [projects, setProjects] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [copy, setCopy] = useState([]);
    const [productList, setProductList] = useState([]);
    const [adv_search_lst,setAdvList] = useState([])
    const [labels,setLabels] = useState()
    const [visible,setVisible] = useState(false)
    const [invoice_dt,setInvDt] = useState(false)
    const params = useParams();
    const [sl,setSl] = useState(0)
  const [count,setCount] = useState(0)

    const navigate = useNavigate();
    const onChange = (e) => {
        console.log("radio checked", e);
        // setValue(e);
        if (e == 1) {
          setPoData(
            copy.filter(
              (e) =>e.approve_flag == "A" || e.approve_flag=='U'
            )
          );
          console.log(po_data);
        } else if(e==2) {
          setPoData(
            copy.filter(
              (e) => e.approve_flag =='P'
            )
          );
          console.log(po_data);
        }
        else{
          setPoData(
            copy.filter(
              (e) =>
                (e.po_status == "D" || e.po_status == "L") && e.fresh_flag == "Y"
            )
          );
        }
      };
   const getData =() => {
      axios
        .post(url + "/api/getvendor", { id: 0 })
        .then((res) => {
          console.log(res);
          setVendors(res?.data.msg);
          vendorList.length = 0;
          setVendorList([]);
          for (let i of res?.data?.msg) {
            vendorList.push({
              name: i.vendor_name,
              code: i.sl_no,
            });
          }
          setVendorList(vendorList);
        })
        .catch((err) => {
          console.log(err);
          navigate("/error" + "/" + err.code + "/" + err.message);
        });
      axios.post(url + "/api/getproject", { id: 0 }).then((res) => {
        console.log(res);
        setProjects(res?.data.msg);
        setProjectList([]);
        projectList.length = 0;
        for (let i of res?.data?.msg) {
          projectList.push({
            name: i.proj_name,
            code: i.sl_no,
          });
        }
        setProjectList(projectList);
      });
      axios.post(url + "/api/getproduct", { id: 0 }).then((res) => {
        console.log(res);
        setProductList(res?.data.msg);
        setProductList([]);
        productList.length = 0;
        for (let i of res?.data?.msg) {
          productList.push({
            name: i.prod_name,
            code: i.sl_no,
          });
        }
        setProductList(productList);
      });
    }
    const onAdvSearch = (val1, val2,val3,val4,val5,val6,val7,val8) => {
      console.log(val1, val2);
      // let labels = {
      //   vendor_id:val1,
      //   project_id:val2,
      //   vendor_id:val1,
      //   vendor_id:val1,
      //   vendor_id:val1,
      //   vendor_id:val1,
      // }
      setValue(0);
      // setVisible(true)
      axios.post(url+'/api/advanced_search_delivery',{vendor_id:val1,project_id:val2,part_no:val3,prod_id:val4,from_dt:val5,to_dt:val6,invoice:val7,make:val8}).then(res=>{
        console.log(res)
        setAdvList(res?.data?.msg)
        if(res?.data?.msg?.length){
          setFlag(28)
        setVisible(true)
        }
      
      })
      // setPoData(
      //   copy?.filter(
      //     (e) =>
      //       e?.vendor_name?.toLowerCase().includes(val1?.toLowerCase()) &&
      //       e?.proj_name?.toLowerCase().includes(val2?.toLowerCase()) &&
      //       e.fresh_flag == "Y"
      //   )
      // );
    };
    useEffect(() => {
      localStorage.removeItem("id");
      localStorage.removeItem("po_issue_date");
      localStorage.removeItem("po_status");
      localStorage.removeItem("po_no");
      localStorage.removeItem("po_comments");
      localStorage.removeItem("order_id");
      localStorage.removeItem("order_date");
      localStorage.removeItem("order_type");
      localStorage.removeItem("proj_name");
      localStorage.removeItem("vendor_name");
      localStorage.removeItem("itemList");
      localStorage.removeItem("terms");
      localStorage.removeItem("termList");
      localStorage.removeItem("ship_to");
      localStorage.removeItem("bill_to");
      localStorage.removeItem("ware_house_flag");
      localStorage.removeItem("notes");
      localStorage.removeItem("mdcc_flag");
      localStorage.removeItem("mdcc");
      localStorage.removeItem("insp_flag");
      localStorage.removeItem("insp");
      localStorage.removeItem("drawing_flag");
      localStorage.removeItem("drawing");
      localStorage.removeItem("dt");
      setLoading(true);
      // axios.post(url + "/api/getpo", { id:0 }).then((res) => {
      //   console.log(res);
      //   setLoading(false);
      //   setCopy(res?.data?.msg.filter(e=>e.po_status=='A'));
      //   setPoData(res?.data?.msg.filter(e=>e.po_status=='A'));
      // });
      axios.post(url + "/api/getdeliveryapproval", { id: 0 }).then((res) => {
        console.log(res);
        setLoading(false);
        // if(localStorage.getItem('user_type')=='2'){
        //   setCopy(res?.data?.msg.filter(e=>e.po_status=='A' && e.created_by==localStorage.getItem('email') && e.ware_house_flag=='Y' &&  e.invoice_count>0 ));
        //   setPoData(res?.data?.msg.filter(e=>e.po_status=='A' &&  e.created_by==localStorage.getItem('email') && e.ware_house_flag=='Y' &&  e.invoice_count>0 && e.approve_flag=='P'
        //   ));
        //   }
        //   if(localStorage.getItem('user_type')=='5'){
            setCopy(res?.data?.msg.filter(e=>e.po_status=='A' &&  e.invoice_count>0 ));
            setPoData(res?.data?.msg.filter(e=>e.po_status=='A' &&  e.invoice_count>0 && e.approve_flag=='P'
              ));
              getData()
            // }
      });
    }, [count]);
  
    // const search = (value) => {
    //   setLoading(true);
    //   if (flag == "C") {
    //     axios.post(url + "/api/getdelbypo", { po: value }).then((res) => {
    //       console.log(res);
    //       setLoading(false);
    //       setCopy(res?.data?.msg);
    //       setPoData(res?.data?.msg);
    //     });
    //   } else {
    //     axios.post(url + "/api/getmdccbypo", { po: value }).then((res) => {
    //       console.log(res);
    //       setLoading(false);
    //       setCopy(res?.data?.msg);
    //       setPoData(res?.data?.msg);
    //     });
    //   }
    // };
    const setSearch = (word) => {
      setPoData(
        copy?.filter(
          (e) =>
            e?.invoice?.toLowerCase().includes(word?.toLowerCase()) ||
          e?.mrn_no?.toLowerCase().includes(word?.toLowerCase()) ||
            e?.created_by?.toLowerCase().includes(word?.toLowerCase())
        )
      );
    };
    const getApprovalDetails = (item)=>{
      setLoading(true)
      console.log(item.sl_no,item.del_sl,sl)
      console.log(item)
      setInvoice(item.invoice)
      setSl(item.del_sl!=undefined?item.del_sl:item.sl_no)
      setPoNo(item.po_no)
      // debugger
      // console.log(clickFlag)
      // debugger
      axios
      .post(url + "/api/get_mrn_list", { last_req_id: item.po_no })
      .then((res) => {
        console.log(res);
        setMrnDetails(res.data.msg.filter(e=>e.invoice==item.invoice))
        setInvDt(res.data.msg.filter(e=>e.invoice==item.invoice)[0].invoice_dt)
        if(viewKey==1){
        axios
        .post(url + "/api/get_received_items", { invoice: item.invoice, id: item.del_sl!=undefined?item.del_sl:item.sl_no})
        .then((res) => {
          console.log(res);
          setItemInfo(res?.data?.msg);
          itemStock.length=0
          for(let i of res?.data?.msg){
            itemStock.push({
              rc_qty:i.rc_qty,
              item_id:i.item_id
            })
          }
          axios
          .post(url + "/api/getdeliverydoc", { po_no: item.invoice })
          .then((resDoc) => {
            console.log(resDoc);
            for (let i of resDoc?.data?.msg) {
              fileList.push({
                sl_no: i.sl_no,
                doc: i.doc,
              });
            }
          setFileList(fileList);
          setFlag(26)
          setVisible(true);
          setLoading(false)
        });
       })
      }
      else{
         axios
        .post(url + "/api/get_received_items_siemens", { invoice: item.invoice, id: item.del_sl!=undefined?item.del_sl:item.sl_no})
        .then((res) => {
          console.log(res);
          setItemInfo(res?.data?.msg);
          itemStock.length=0
          for(let i of res?.data?.msg){
            itemStock.push({
              rc_qty:i.rc_qty,
              item_id:i.item_id
            })
          }
          axios
          .post(url + "/api/getdeliverydoc", { po_no: item.invoice })
          .then((resDoc) => {
            console.log(resDoc);
            for (let i of resDoc?.data?.msg) {
              fileList.push({
                sl_no: i.sl_no,
                doc: i.doc,
              });
            }
          setFileList(fileList);
          setFlag(26)
          setVisible(true);
          setLoading(false)
        });
       })
      }
   //    setVisible(true)

      })
    
    }
    return (
      <>
      <div className="flex justify-between"> 
      <Radiobtn
          data={rdBtn}
          val={value}
          onChangeVal={(value) => {
            console.log(value);
            onChange(value);
          }}
        />
      <CompositeSearch
            data={{
              set_one: vendorList,
              set_two: projectList,
              set_one_lbl: "Vendors",
              set_two_lbl: "Projects",
  
              set_three: '',
              set_four: productList,
              set_three_lbl: "Part No./Type No.",
              set_four_lbl: "Items",
  
              set_five: '',
              set_six: '',
              set_five_lbl: "From",
              set_six_lbl: "To",
  
              set_seven: '',
              set_seven_lbl: "Invoice No.",
  
               set_eight_lbl:'Make',
              set_eight:''
            }}
            flag={2}
            onReset={() => {
              // setPoData(copy);
              setValue(0);
            }}
            onSubmit={(values) => {
              console.log(values);
              setLabels(values)
              setVisible(true)
              onAdvSearch(values.code_one, values.code_two,values.val_three,values.code_four,values.val_five,values.val_six,values.val_seven,values.val_eight);
            }}
          />
      </div>
        
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
        >
          <div class="flex flex-col p-1 bg-green-900 rounded-full my-3 dark:bg-[#22543d] md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 ">
            <div class="w-full relative flex justify-normal">
              <div class="flex items-center justify-between w-11/12">
                <motion.h2
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, type: "just" }}
                  class="text-xl w-48 capitalize text-nowrap font-bold text-white dark:text-white sm:block hidden mx-5"
                >
                  {"Approve MRN"}
                </motion.h2>
  
                <label for="simple-search" class="sr-only">
                  Search
                </label>
                <div class="relative w-full -right-6 2xl:-right-12">
                  <div class="absolute inset-y-0 left-0 flex items-center md:ml-4 pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewbox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <motion.input
                    type="text"
                    id="simple-search"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "106%" }}
                    transition={{ delay: 1.1, type: "just" }}
                    class="bg-white border rounded-full  border-emerald-500 text-gray-800 text-sm  block w-full  pl-10 dark:bg-gray-800 md:ml-4  duration-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search"
                    required=""
                    onChange={(text) => setSearch(text.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>
        {loading && <SkeletonLoading />}
  
        {/* {copy.length == 0 && loading == false && (
          <div class="flex-col ml-72 mx-auto justify-center items-center">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, type: "spring" }}
              src={nodata}
              class="h-96 w-96 2xl:ml-48 2xl:h-full"
              alt="Flowbite Logo"
            />
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, type: "spring" }}
              class="h-12 text-green-900 -mt-16  2xl:ml-48 2xl:h-24 font-bold"
            >
              You can either create or search to view any record here!
            </motion.h2>
          </div>
        )} */}

        <div class="relative overflow-x-auto flex w-full">
         <Tabs defaultActiveKey="1" style={{background:'white', width:150, padding:10,borderTopLeftRadius:10,borderBottomLeftRadius:10,height:'10%',boxShadow:' 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} items={items} tabPosition="left" onChange={onChoiceChange} />
          {!loading && copy.length > 0 && viewKey == 1 && (
            // viewKey == 1
             <div className="flex w-full">
             
            <motion.section
            className="flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
            >
              <table class="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400">
                <thead class=" text-md  text-gray-700 capitalize   bg-[#C4F1BE] dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="p-4 w-1/3">
                      #
                    </th>
                    {/* <th scope="col" class="p-4 w-1/3">
                      PO No.
                    </th> */}
                     <th scope="col" class="p-4 w-1/3">
                      MRN No.
                    </th>
                    <th scope="col" class="p-4 w-1/3">
                      Invoice
                    </th>
                   
                    <th scope="col" class="p-4 w-1/3">
                      Status
                    </th>
                    <th scope="col" class="p-4 w-1/3">
                      Created By
                    </th>
                    {/* <th scope="col" class="p-4 w-1/3">
                      Action
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {po_data &&
                    po_data?.slice(first, rows + first).map((item) => (
                       <tr onClick = {()=>{
                        setSl(item.sl_no)
                        console.log(item.sl_no)
                        setClickFlag(1)
                        // setLoading(true)
                        console.log(item)
                        getApprovalDetails(item)
                        //    setInvoice(item.invoice)
                        //    setPoNo(item.po_no)
                         
                        //    axios
                        //    .post(url + "/api/get_mrn_list", { last_req_id: item.po_no })
                        //    .then((res) => {
                        //      console.log(res);
                        //      setMrnDetails(res.data.msg.filter(e=>e.invoice==item.invoice))
                        //      setInvDt(res.data.msg.filter(e=>e.invoice==item.invoice)[0].invoice_dt)
                        //      axios
                        //      .post(url + "/api/get_received_items", { invoice: item.invoice, id: item.sl_no })
                        //      .then((res) => {
                        //        console.log(res);
                        //        setItemInfo(res?.data?.msg);
                        //        itemStock.length=0
                        //        for(let i of res?.data?.msg){
                        //          itemStock.push({
                        //            rc_qty:i.rc_qty,
                        //            item_id:i.item_id
                        //          })
                        //        }
                        //        axios
                        //        .post(url + "/api/getdeliverydoc", { po_no: item.invoice })
                        //        .then((resDoc) => {
                        //          console.log(resDoc);
                        //          for (let i of resDoc?.data?.msg) {
                        //            fileList.push({
                        //              sl_no: i.sl_no,
                        //              doc: i.doc,
                        //            });
                        //          }
                        //        setFileList(fileList);
                        //        setFlag(26)
                        //        setVisible(true);
                        //        setLoading(false)
                        //      });
                        //     })
                        // //    setVisible(true)

                        //    })
                        // if(flag == "C")
                        //       navigate(routePaths.DELIVERYCUSTOMERFORM +
                        //           item.sl_no +
                        //           "/" +
                        //           item.po_no)
                        //         else navigate(routePaths.TESTCERTFORM + item.sl_no)
                      }} class="bg-white hover:duration-500 hover:text-green-900 cursor-pointer hover:bg-gray-200 text-nowrap border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          class="px-6 py-4 w-1/5 font-medium text-xs text-gray-900 whitespace-nowrap dark:text-white"
                        >
                        {/* <Tag color="#4FB477" className="rounded-full"> {item.sl_no}</Tag>  */}
                        {item.serial_number}
                        </th>
                        {/* <td class="px-6 py-4 w-1/3 text-green-900 font-bold">{item.po_no}</td> */}
                        <td class="px-4 py-4 w-1/3 text-green-900 font-bold text-[12.5px]">{item.mrn_no}</td>
                        <td class="px-4 py-4 w-1/3 text-gray-600 text-xs">{item.invoice}</td>

                        <td class="px-4 py-4 w-1/3">{item.approve_flag=='A'?
                         <Tag
                                                className="text-[12px]  w-24  bg-green-900 text-white"
                                                icon={<CheckCircleOutlined />}
                                                color="#014737"
                                                // color="success"
                                              >
                                                Approved
                                              </Tag>
                        :
                        item.approve_flag=='P'?
                        <Tag
                        className="text-[12px] w-24"
                        icon={<ClockCircleOutlined className="animate-pulse" />}
                        color="#82181a"
                        // color="error"
                      >
                        Pending 
                      </Tag>
                        :
                        <Tag
                        className="text-[9px] w-24"
                        icon={<ClockCircleOutlined className="animate-pulse" />}
                        color="#82181a"
                        // color="error"
                      >
                        Rejected
                      </Tag>
                        
                        }</td>
                        <td class="px-6 py-4 w-1/3 text-gray-600 text-xs">{item.created_by}</td>
                        {/* <td class="px-3 py-4 w-1/3 text-gray-600 flex gap-3"> */}
                          {/* <Link
                            to={
                              flag == "C"
                                ? routePaths.DELIVERYCUSTOMERFORM +
                                  item.sl_no +
                                  "/" +
                                  item.po_no
                                : routePaths.TESTCERTFORM + item.sl_no
                            }
                          >
                            <EditOutlined class="text-md text-green-900" />
                          </Link> */}
                        {/* </td> */}
                      </tr>
                      
                    ))}
                </tbody>
              </table>
             
              <Pagination  first={first}
                rows={rows}
                totalRecords={po_data?.length}
                rowsPerPageOptions={[3, 5, 10, 15, 20, 30, po_data?.length]}
                onPageChange={onPageChange}
                />
            </motion.section>
            </div>
          )}

            {!loading && copy.length > 0 && viewKey == 2 && (
            // viewKey == 1
             <div className="flex w-full">
            <motion.section
            className="flex-1"

              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
            >
              <table class="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400">
                <thead class=" text-md  text-gray-700 capitalize   bg-[#C4F1BE] dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="p-4 w-1/3">
                      #
                    </th>
                    {/* <th scope="col" class="p-4 w-1/3">
                      PO No.
                    </th> */}
                     <th scope="col" class="p-4 w-1/3">
                      MRN No.
                    </th>
                    <th scope="col" class="p-4 w-1/3">
                      Invoice
                    </th>
                   
                    <th scope="col" class="p-4 w-1/3">
                      Status
                    </th>
                    <th scope="col" class="p-4 w-1/3">
                      Created By
                    </th>
                    {/* <th scope="col" class="p-4 w-1/3">
                      Action
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {po_data &&
                    po_data?.slice(first, rows + first).map((item) => (
                       <tr onClick = {()=>{
                        setSl(item.sl_no)
                        console.log(item.sl_no)
                        setClickFlag(1)
                        // setLoading(true)
                        console.log(item)
                        getApprovalDetails(item)
                        //    setInvoice(item.invoice)
                        //    setPoNo(item.po_no)
                         
                        //    axios
                        //    .post(url + "/api/get_mrn_list", { last_req_id: item.po_no })
                        //    .then((res) => {
                        //      console.log(res);
                        //      setMrnDetails(res.data.msg.filter(e=>e.invoice==item.invoice))
                        //      setInvDt(res.data.msg.filter(e=>e.invoice==item.invoice)[0].invoice_dt)
                        //      axios
                        //      .post(url + "/api/get_received_items", { invoice: item.invoice, id: item.sl_no })
                        //      .then((res) => {
                        //        console.log(res);
                        //        setItemInfo(res?.data?.msg);
                        //        itemStock.length=0
                        //        for(let i of res?.data?.msg){
                        //          itemStock.push({
                        //            rc_qty:i.rc_qty,
                        //            item_id:i.item_id
                        //          })
                        //        }
                        //        axios
                        //        .post(url + "/api/getdeliverydoc", { po_no: item.invoice })
                        //        .then((resDoc) => {
                        //          console.log(resDoc);
                        //          for (let i of resDoc?.data?.msg) {
                        //            fileList.push({
                        //              sl_no: i.sl_no,
                        //              doc: i.doc,
                        //            });
                        //          }
                        //        setFileList(fileList);
                        //        setFlag(26)
                        //        setVisible(true);
                        //        setLoading(false)
                        //      });
                        //     })
                        // //    setVisible(true)

                        //    })
                        // if(flag == "C")
                        //       navigate(routePaths.DELIVERYCUSTOMERFORM +
                        //           item.sl_no +
                        //           "/" +
                        //           item.po_no)
                        //         else navigate(routePaths.TESTCERTFORM + item.sl_no)
                      }} class="bg-white hover:duration-500 hover:text-green-900 cursor-pointer hover:bg-gray-200 text-nowrap border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          class="px-6 py-4 w-1/5 font-medium text-xs text-gray-900 whitespace-nowrap dark:text-white"
                        >
                        {/* <Tag color="#4FB477" className="rounded-full"> {item.sl_no}</Tag>  */}
                        {item.serial_number}
                        </th>
                        {/* <td class="px-6 py-4 w-1/3 text-green-900 font-bold">{item.po_no}</td> */}
                        <td class="px-4 py-4 w-1/3 text-green-900 font-bold text-[12.5px]">{item.mrn_no}</td>
                        <td class="px-4 py-4 w-1/3 text-gray-600 text-xs">{item.invoice}</td>

                        <td class="px-4 py-4 w-1/3">{item.approve_flag=='A'?
                         <Tag
                                                className="text-[12px]  w-24  bg-green-900 text-white"
                                                icon={<CheckCircleOutlined />}
                                                color="#014737"
                                                // color="success"
                                              >
                                                Approved
                                              </Tag>
                        :
                        item.approve_flag=='P'?
                        <Tag
                        className="text-[12px] w-24"
                        icon={<ClockCircleOutlined className="animate-pulse" />}
                        color="#82181a"
                        // color="error"
                      >
                        Pending 
                      </Tag>
                        :
                        <Tag
                        className="text-[9px] w-24"
                        icon={<ClockCircleOutlined className="animate-pulse" />}
                        color="#82181a"
                        // color="error"
                      >
                        Rejected
                      </Tag>
                        
                        }</td>
                        <td class="px-6 py-4 w-1/3 text-gray-600 text-xs">{item.created_by}</td>
                        {/* <td class="px-3 py-4 w-1/3 text-gray-600 flex gap-3"> */}
                          {/* <Link
                            to={
                              flag == "C"
                                ? routePaths.DELIVERYCUSTOMERFORM +
                                  item.sl_no +
                                  "/" +
                                  item.po_no
                                : routePaths.TESTCERTFORM + item.sl_no
                            }
                          >
                            <EditOutlined class="text-md text-green-900" />
                          </Link> */}
                        {/* </td> */}
                      </tr>
                      
                    ))}
                </tbody>
              </table>
             
              <Pagination  first={first}
                rows={rows}
                totalRecords={po_data?.length}
                rowsPerPageOptions={[3, 5, 10, 15, 20, 30, po_data?.length]}
                onPageChange={onPageChange}
                />
            </motion.section>
            </div>
            
          )}
        
        </div>
        <DialogBox
          visible={visible}
          flag={flag}
          data={flag!=28?{details:mrnDetails,items:itemInfo,files:fileList}:{list:adv_search_lst,labels:labels}}
          onPress={(status,rej_note) => {
            setVisible(false)
           if(status){
            setLoading(true)
           if(viewKey==1){
            axios.post(url+'/api/approvemrn',{inv_no:invoice,user:localStorage.getItem('email'),status:status,po_no:po_no,invoice_dt:invoice_dt,rej_note:rej_note,in_out_flag:1,items:itemStock}).then(res=>{console.log(res)
              setLoading(false)
                if(res.data.suc>0){
                    Message('success',res?.data?.msg)
                    setCount(prev=>prev+1)
                }
                else{
                    Message('error',res?.data?.msg)

                }
            })
          }
          else{
             axios.post(url+'/api/approvemrnsiemens',{inv_no:invoice,user:localStorage.getItem('email'),status:status,po_no:po_no,invoice_dt:invoice_dt,rej_note:rej_note,in_out_flag:1,items:itemStock}).then(res=>{console.log(res)
              setLoading(false)
                if(res.data.suc>0){
                    Message('success',res?.data?.msg)
                    setCount(prev=>prev+1)
                }
                else{
                    Message('error',res?.data?.msg)

                }
            })
          }
          }
        
        }}
onVisit={(item)=>{setSl(item.del_sl);setClickFlag(2);setVisible(false);getApprovalDetails(item)}}
        />
      </>
    );
}

export default ApproveMrn
