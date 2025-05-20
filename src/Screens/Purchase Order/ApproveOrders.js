import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { masterheaders } from "../../Assets/Data/ColumnData";
import { url } from "../../Address/BaseUrl";
import axios from "axios";
import { motion } from "framer-motion";
import nodata from "../../../src/Assets/Images/nodata.png";
import SkeletonLoading from "../../Components/SkeletonLoading";
import CompositeSearch from "../../Components/CompositeSearch";
import Radiobtn from "../../Components/Radiobtn";
import POTableView from "../../Components/POTableView";
import DialogBox from "../../Components/DialogBox";

function ApproveOrders() {
  const [loading, setLoading] = useState(false);

  const rdBtn = [
    { label: "Approved", value: 1 },
    { label: "Pending", value: 2 },
  ];
  const locationpath = useLocation();
  const [value, setValue] = useState(0);
  const [po_data, setPoData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [adv_search_lst,setAdvList] = useState([])
  const [labels,setLabels] = useState()
  const [copy, setCopy] = useState([]);
  const [visible,setVisible] = useState(false)

  const navigate = useNavigate();
  var template =
    locationpath.pathname.split("/")[
      locationpath.pathname.split("/").length - 1
    ];
  console.log(
    locationpath.pathname.split("/")[
      locationpath.pathname.split("/").length - 1
    ]
  );
  const onChange = (e) => {
    console.log("radio checked", e);
    // setValue(e);
    if (e == 1) {
      // setPoData(copy.filter(e=>(e.po_status=='A'||e.po_status=='U') && e.fresh_flag=='Y'))
      setPoData(copy.filter((e) => e.po_status == "A"));
      console.log(po_data);
    } else {
      setPoData(copy.filter((e) => e.po_status == "U"));
      console.log(po_data);
    }
  };
  var templateData = masterheaders[template];
  useEffect(() => {
    setLoading(true);

    setValue(
      [
        locationpath.pathname.split("/")[
          locationpath.pathname.split("/").length - 1
        ],
      ] == "P"
        ? 2
        : 1
    );
    axios
      .post(url + "/api/getpo", { id: 0 })
      .then((res) => {
        console.log(res);
        setLoading(false);
      //   if(localStorage.getItem('user_type')!='5'){
      //   setCopy(
      //     res?.data?.msg.filter((e) => (e.po_status == "A" || e.po_status == "U") && e.created_by==localStorage.getItem('email'))
      //   );
      //   setPoData(res?.data?.msg?.filter((e) => e.po_status == "A"  && e.created_by==localStorage.getItem('email')));
      // }
      // else{
        setLoading(false);
        setCopy(res?.data?.msg.filter((e) => (e.po_status == "A" || e.po_status == "U")));
        setPoData(res?.data?.msg?.filter((e) => e.po_status == "A"));
    // }
      })
      .catch((err) => {
        console.log(err);
        navigate("/error" + "/" + err.code + "/" + err.message);
      });
  }, [
    locationpath.pathname.split("/")[
      locationpath.pathname.split("/").length - 1
    ],
  ]);
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
    localStorage.removeItem("vend_ref");
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
    localStorage.removeItem('amend_flag')
    localStorage.removeItem('amend_note')
    localStorage.removeItem('pur_req')
    localStorage.removeItem("po_created_by");
    localStorage.getItem("pur_req_by")
       localStorage.removeItem("drawing_doc");
    localStorage.removeItem("mdcc_doc");
    localStorage.removeItem("insp_doc");



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
  const setSearch = (word) => {
    setValue(0);
    setPoData(
      copy?.filter(
        (e) =>
          e?.po_no?.toLowerCase().includes(word?.toLowerCase()) ||
          e?.vendor_name?.toLowerCase().includes(word?.toLowerCase()) ||
          e?.proj_name?.toLowerCase().includes(word?.toLowerCase()) ||
          e?.po_issue_date?.toLowerCase().includes(word?.toLowerCase()) ||
        (!e?.proj_name && 'Warehouse'.toLowerCase().includes(word?.toLowerCase())) ||

          e?.created_by?.toLowerCase().includes(word?.toLowerCase())
      )
    );
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
    axios.post(url+'/api/advanced_search_po',{vendor_id:val1,project_id:val2,part_no:val3,prod_id:val4,from_dt:val5,to_dt:val6,make:val7}).then(res=>{
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
  return (
    <>
      <div className="flex items-center  justify-end h-14 -mt-[72px] w-auto dark:bg-[#22543d] md:flex-row space-y-3 md:space-y-0 rounded-lg"></div>
      <div className="flex justify-between items-center">
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
            set_eight_lbl:'Make',
            set_eight:''
          }}
          onReset={() => {
            // setPoData(copy);
            setValue(2);
          }}
          onSubmit={(values) => {
            console.log(values);
            setLabels(values)
            setVisible(true)
            onAdvSearch(values.code_one, values.code_two,values.val_three,values.code_four,values.val_five,values.val_six,values.val_eight);
          }}
        />
      </div>

      {loading && <SkeletonLoading />}

      {copy.length > 0 && !loading && (
        <POTableView
          po_data={po_data}
          title={"Approve Orders"}
          setSearch={(values) => setSearch(values)}
        />
      )}
      {copy.length == 0 && loading == false && (
        <div className="flex-col ml-72 mx-auto justify-center items-center">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, type: "spring" }}
            src={nodata}
            className="h-96 w-96 2xl:ml-48 2xl:h-full"
            alt="Flowbite Logo"
          />
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, type: "spring" }}
            className="h-12 text-green-900 -mt-16 ml-9 2xl:ml-48 2xl:h-24 font-bold"
          >
            Please create something to view data here!!
          </motion.h2>
        </div>
      )}
       <DialogBox
        visible={visible}
        flag={21}
        data={{list:adv_search_lst,labels:labels}}
        onPress={() => setVisible(false)}
      />
    </>
  );
}

export default ApproveOrders;
