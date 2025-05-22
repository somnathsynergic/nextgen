import React, { useEffect, useState,useRef } from "react";
import { routePaths } from "../../Assets/Data/Routes";
import { Link, useNavigate, useParams } from "react-router-dom";
import { url } from "../../Address/BaseUrl";
import axios from "axios";
import { Paginator } from "primereact/paginator";
import { motion } from "framer-motion";
import nodata from "../../../src/Assets/Images/nodata.png";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  InteractionOutlined,
  PrinterOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import SkeletonLoading from "../../Components/SkeletonLoading";
import PrintHeader from "../../Components/PrintHeader";
import { Tooltip } from "@mui/material";
import { Tag } from "antd";
import CompositeSearch from "../../Components/CompositeSearch";
import Radiobtn from "../../Components/Radiobtn";
import DialogBox from "../../Components/DialogBox";
import CompositeSearchReq from "../../Components/CompositeSearchReq";
import moment from "moment";


function RequisitionView() {
  const [value, setValue] = useState(2);
 const [isPrinting, setIsPrinting] = useState(true);
      const contentRef = useRef(null);
    
      const reactToPrintFn = useReactToPrint({
        contentRef,
      });
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [searchVal, setSearchVal] = useState("");
    const [loading, setLoading] = useState(false);
    const [delFlag,setDelFlag]=useState()
    const [vendors, setVendors] = useState([]);
    const [vendorList, setVendorList] = useState([]);
    const [projects, setProjects] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [adv_search_lst,setAdvList] = useState([])
    const det = JSON.parse(localStorage.getItem('perm'))

    const [labels,setLabels] = useState()
    const [visible,setVisible] = useState(false)
    const onPageChange = (event) => {
      setFirst(event.first);
      setRows(event.rows);
    };
    const rdBtn = [
      { label: "Approved/Rejected", value: 1 },
      { label: "Pending", value: 2 },
    ];
    const [po_data, setPoData] = useState([]);
    const [copy, setCopy] = useState([]);
    const params=useParams()
    const navigate = useNavigate();
  
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
      setLoading(true)
      // axios.post(url + "/api/getpo", { id:0 }).then((res) => {
      //   console.log(res);
      //   setLoading(false);
      //   setCopy(res?.data?.msg.filter(e=>e.po_status=='A'));
      //   setPoData(res?.data?.msg.filter(e=>e.po_status=='A'));
      // });
      axios.post(url + "/api/get_requisition", { id:0 }).then((res) => {
        console.log(res);
        setLoading(false);
        // if(localStorage.getItem('user_type')!='2'){
        // setCopy(res?.data?.msg.filter(e=>e.created_by==localStorage.getItem('email')));
        // setPoData(res?.data?.msg.filter(e=>e.created_by==localStorage.getItem('email')));
        // }
        // if(localStorage.getItem('user_type')=='5'||localStorage.getItem('user_type')=='4'){
          setCopy(res?.data?.msg);
          setPoData(res?.data?.msg);
          // }
      });
  // console.log
    }, []);
    
    useState(() => {
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
    }, []);
    const onChange = (e) => {
      console.log("radio checked", e);
      // setValue(e);
      if (e == 1) {
        setPoData(
          copy.filter(
            (e) =>
              (e.approve_flag=='A' || e.approve_flag=='R')
          )
        );
        console.log(po_data);
      } else if(e==2) {
        setPoData(
          copy.filter(
            (e) =>(e.approve_flag=='P')
          )
        );
        console.log(po_data);
      }
      // else{
      //   setPoData(
      //     copy.filter(
      //       (e) =>
      //         (e.po_status == "D" || e.po_status == "L") && e.fresh_flag == "Y"
      //     )
      //   );
      // }
    };
    const onAdvSearch = (val1, val2,val3,val4,val5,val6,val7) => {
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
      axios.post(url+'/api/advanced_search_requisition',{vendor_id:val1,project_id:val2,part_no:val3,prod_id:val4,from_dt:val5,to_dt:val6,make:val7}).then(res=>{
        console.log(res)
        setAdvList(res?.data?.msg)
        if(res?.data?.msg?.length)
        setVisible(true)
      
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
    const setSearch = (word) => {
      setPoData(
        copy?.filter(
          (e) =>
            e?.req_no?.toLowerCase().includes(word?.toLowerCase()) ||
                      e?.created_by?.toLowerCase().includes(word?.toLowerCase())||
                      e?.proj_id?.toLowerCase().includes(word?.toLowerCase())||
                      e?.proj_name?.toLowerCase().includes(word?.toLowerCase())||
                     (!e?.proj_name && 'Warehouse'.toLowerCase().includes(word?.toLowerCase())) ||

                      e?.req_date?.toLowerCase().includes(word?.toLowerCase())
        )
      );
    };
    return (
      <>
      {det.requisition!=1 && 
          <div className="flex items-center  justify-end h-14 -mt-[72px] w-auto dark:bg-[#22543d] md:flex-row space-y-3 md:space-y-0 rounded-lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, type: "just" }}
            className="w-full hidden md:block  md:w-auto sm:flex sm:flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0"
          >
            <Tooltip title={"Make a floor requisition"}>
              <Link
                to={routePaths.REQFORM  + 0}
                type="submit"
                className="flex items-center justify-center border-2 border-white border-r-0 text-white bg-green-900 hover:bg-primary-800 text-nowrap rounded-l-md transition ease-in-out  active:scale-90 text-sm p-1 px-2 dark:bg-gray-800 dark:text-white dark:hover:bg-primary-700 focus:outline-none shadow-lg  hover:duration-500 hover:shadow-lg dark:focus:ring-primary-800 ml-2 capitalize"
              >
                <InteractionOutlined className="text-sm" /> {"Make a floor requisition"}
              </Link>
            </Tooltip>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, type: "just" }}
            onClick={()=>{setIsPrinting(false);
            setTimeout(() => {
              setRows(po_data?.length);
              
              reactToPrintFn();
              setIsPrinting(true);
              }, 5);}}
            className={
              "bg-white border-2 border-l-0 text-green-900 font-semibold text-lg rounded-r-full p-0.5 shadow-lg"
            }
          >
            <Tooltip title="Print this table" arrow>
              <PrinterOutlined />
            </Tooltip>
          </motion.button>
        </div>
}
        <div className="flex justify-end items-center">
        {/* <Radiobtn
          data={rdBtn}
          val={value}
          onChangeVal={(value) => {
            console.log(value);
            onChange(value);
          }}
        /> */}
        <CompositeSearchReq
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
              set_eight_lbl:'Make',
            set_eight:''
          }}
          onReset={() => {
            // setPoData(copy);
            setValue(0);
          }}
          onSubmit={(values) => {
            console.log(values);
            setLabels(values)
            setVisible(true)
            onAdvSearch(values.code_one, values.code_two,values.val_three,values.code_four,values.val_five,values.val_six,values.val_eight);
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
                  {'Floor Requisition'}
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
                    class="bg-white border rounded-full border-emerald-500 text-gray-800 text-sm  block w-full  pl-10 dark:bg-gray-800 md:ml-4  duration-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search "
                    required=""
                    onChange={(text) => setSearch(text.target.value)}
                  />
                </div>
              
              </div>
            </div>
          </div>
        </motion.section>
        {loading && <SkeletonLoading />}
  
        {copy.length == 0 && loading == false && (
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
        )}
        <div class="relative overflow-x-auto">
          {!loading && copy.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
            >
              <div ref={contentRef} className={isPrinting?"w-full":"w-full p-5"}>
           <div className={isPrinting?"hidden rounded-md w-full":"w-full border  border-green-500 rounded-md"}>
                        <PrintHeader />
                        </div>
        <table class={isPrinting?"w-full text-sm text-left rtl:text-right shadow-lg text-green-900 dark:text-gray-400":"w-full mt-2 mx-auto text-sm text-left rtl:text-right shadow-lg text-green-900 dark:text-gray-400"}>
                <thead  class={isPrinting?" text-md  text-gray-700 capitalize   bg-[#C4F1BE] dark:bg-gray-700 dark:text-gray-400":" text-md  text-white capitalize   bg-green-500 dark:bg-gray-700 dark:text-gray-400"}>
                  <tr>
                    <th scope="col" class="p-4">
                      #
                    </th>
                    <th scope="col" class="p-4">
                      Requisition No.
                    </th>
                    <th scope="col" class="p-4">
                      Intended For
                    </th>
                    <th scope="col" class="p-4">
                      Date
                    </th>
                   
                    <th scope="col" class="p-4">
                      Created By
                    </th>
                   {isPrinting && <th scope="col" class="p-4">
                      Action
                    </th>}
                  </tr>
                </thead>
                <tbody>
                  {po_data &&
                    po_data?.slice(first, rows + first).map((item) => (
                      <tr onClick={()=>{ navigate(routePaths.REQFORM + item.sl_no) }} 
                      // class="bg-white  cursor-pointer hover:text-green-900 hover:duration-500 hover:bg-gray-200 text-nowrap border-b dark:bg-gray-800 dark:border-gray-700"
                        className={
                    +Math.floor(
                          (new Date().getTime() -
                            new Date(item.created_at).getTime()) /
                            1000
                        ) < 1800
                        ? "bg-[#ffe4c4] px-4 py-4 w-1/6 text-green-900 font-bold text-[12.5] cursor-pointer duration-500 hover:bg-gray-200 hover:duration-500 delay-700 border-b dark:bg-gray-800 hover:text-green-900 dark:border-gray-700 text-nowrap"
                        : "bg-white border-b px-4 py-4 w-1/6 text-green-900 font-bold text-[12.5] hover:text-green-900 cursor-pointer hover:bg-gray-200 dark:bg-gray-800 hover:duration-500 dark:border-gray-700  text-nowrap"
                     
                  }
                      >
                        <th
                          scope="row"
                          class="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {item.sl_no}
                        </th>
                        <td class="px-4 py-4 text-green-900 font-bold text-[12.5px]">
                          
                          
                          {item.req_no}
                          <p class="text-[10.5px] text-gray-500 italic">
                       <span>
                          {" "}
                        Created{" "}
                          {+Math.floor(
                            (new Date().getTime() -
                              new Date(item.created_at).getTime()) /
                              1000
                          ) < 60
                            ? +Math.floor(
                                (new Date().getTime() -
                                  new Date(item.created_at).getTime()) /
                                  1000
                              ).toFixed(0) + " second(s) ago"
                            : +Math.floor(
                                (new Date().getTime() -
                                  new Date(item.created_at).getTime()) /
                                  1000
                              ) /
                                60 <
                              60
                            ? (
                                +Math.floor(
                                  (new Date().getTime() -
                                    new Date(item.created_at).getTime()) /
                                    1000
                                ) / 60
                              ).toFixed(0) + " minute(s) ago"
                            : +Math.floor(
                                (new Date().getTime() -
                                  new Date(item.created_at).getTime()) /
                                  1000
                              ) /
                                3600 <
                              24
                            ? (
                                +Math.floor(
                                  (new Date().getTime() -
                                    new Date(item.created_at).getTime()) /
                                    1000
                                ) / 3600
                              ).toFixed(0) + " hour(s) ago"
                            : +Math.floor(
                                (new Date().getTime() -
                                  new Date(item.created_at).getTime()) /
                                  1000
                              ) /
                                (3600 * 24) <
                              31
                            ? (
                                +Math.floor(
                                  (new Date().getTime() -
                                    new Date(item.created_at).getTime()) /
                                    1000
                                ) /
                                (3600 * 24)
                              ).toFixed(0) + " day(s) ago":""}
                              </span>
                              </p>
                          
                          
                          </td>
                        <td class="px-4 py-4 text-gray-600 text-wrap text-xs">{item.proj_name?item.proj_name+'('+item.proj_id+')': 'Warehouse'}</td>
                        <td class="px-4 py-4 text-gray-600 text-xs">{moment(item.req_date).format('DD/MM/YYYY')}</td>
                        {/* <td class="px-6 py-4">{item.approve_flag=='A'?
                         <Tag
                         className="text-[12px] p-1 rounded-full w-36"
                         icon={<CheckCircleOutlined />}
                         color="success"
                       >
                        Approved
                        </Tag>
                        :
                        item.approve_flag=='P'?
                        <Tag
                        className="text-[12px] p-1 rounded-full w-36"
                        icon={<SyncOutlined spin />}
                        color="processing"
                      >
                        Pending
                        </Tag>
                        :
                        <Tag
                        className="text-[12px] p-1 rounded-full w-36"
                        icon={<CloseCircleOutlined className="animate-spin" />}
                        color="error"
                      >
                        Rejected
                        </Tag>
                        
                        }</td> */}
                        <td class="px-6 py-4 text-xs text-gray-600 text-wrap">{item.created_by}({item.created_at?.split('T')[0]}-{item.created_at?.split('T')[1]})</td>
                       {isPrinting && <td class="px-3 tex-xs py-4 flex gap-3">
                        
                          <Link
                            to={
                              routePaths.REQFORM + item.sl_no
                            }
                          >
                            <EditOutlined class="text-md text-green-900" />
                          </Link>
                        </td>}
                      </tr>
                    ))}
                </tbody>
              </table>
              </div>
              <Paginator
                first={first}
                rows={rows}
                totalRecords={po_data?.length}
                rowsPerPageOptions={[3, 5, 10, 15, 20, 30, po_data?.length]}
                onPageChange={onPageChange}
              />
            </motion.section>
          )}
        </div>
        <DialogBox
        visible={visible}
        flag={22}
        data={{list:adv_search_lst,labels:labels}}
        onPress={() => setVisible(false)}
      />
      </>
    );
}

export default RequisitionView
