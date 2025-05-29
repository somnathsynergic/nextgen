import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { useNavigate, useParams } from "react-router-dom";
import {
  Col,
  Empty,
  Popconfirm,
  Popover,
  Row,
  Segmented,
  Spin,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import ProfileInfo from "./ProfileInfo";
import PasswordComp from "./PasswordComp";
import { routePaths } from "../Assets/Data/Routes";
import "../Styles/styles.css";
import ClientInfo from "./ClientInfo";
import PocInfo from "./PocInfo";
import ProjectInfo from "./ProjectInfo";
import VendorInfo from "./VendorInfo";
import ProdInfo from "./ProdInfo";
import PoPreview from "./Steps/PoPreview";
import TDInputTemplate from "./TDInputTemplate";
import AmendPreview from "./AmendPreview";
import { Timeline } from "antd";
import { formatDate } from "../Functions/formatDate";
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleFilled,
  FileTextOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  SyncOutlined,
  QuestionCircleOutlined,
  ForwardFilled,
  PrinterOutlined,
  CloseOutlined,
  RightOutlined,
  CheckOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Alert } from "antd";
import { Chip } from "primereact/chip";
import { OverlayPanel } from "primereact/overlaypanel";
import { Fab } from "@mui/material";
import { Checkbox } from "antd";
import { url } from "../Address/BaseUrl";
import VError from "./VError";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import PrintHeader from "./PrintHeader";
import { Message } from "./Message";
import { CancelOutlined } from "@mui/icons-material";
import BtnGroupReuse from "./BtnGroupReuse";
import InfoTags from "./InfoTags";
import Pagination from "./Pagination";
import SpinComp from "./SpinComp";
const DialogBox = ({
  visible,
  flag,
  onPress,
  onDelete,
  data,
  amendPo,
  id,
  confirm,
  onDeactivate,
  onSearch,
  onVisit,
  onApprove,
  waiting,
  mode,
  onCloseApprove,
  po_status,
}) => {
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const contentMRN = useRef(null);
  const [isPrinting, setIsPrinting] = useState(true);

  const reactToPrintFn = useReactToPrint({
    contentRef,
  });
  const reactToPrintFnMrn = useReactToPrint({
    contentMRN,
  });
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };
  // const det={}
  const [po_no, setPoNo] = useState("");
  const det = JSON.parse(localStorage.getItem("perm"));
  //  "{M1:0,M2:0,PR1:0,PR2:0,P1:0,P2:0,PU1:0,PU2:0,APU1:0,APU2:0,MRN1:0,MRN2:0,R1:0,R2:0,MIN1:0,MIN2:0,S1:0,S2:0}");
  // const det = localStorage?.getItem("perm")!='undefined'?JSON.parse(localStorage?.getItem("perm")):{M1:0,M2:0,PR1:0,PR2:0,P1:0,P2:0,PU1:0,PU2:0,APU1:0,APU2:0,MRN1:0,MRN2:0,R1:0,R2:0,MIN1:0,MIN2:0,S1:0,S2:0}
  // if(localStorage?.getItem("perm")=='undefined'){
  //   localStorage.setItem("perm", '{M1:0,M2:0,PR1:0,PR2:0,P1:0,P2:0,PU1:0,PU2:0,APU1:0,APU2:0,MRN1:0,MRN2:0,R1:0,R2:0,MIN1:0,MIN2:0,S1:0,S2:0}');
  // }
  const [item_nm, setItemNm] = useState("");
  const [item_qty, setItemQty] = useState("");
  const [item_sl, setItemSl] = useState("");
  const [item_remarks, setItemRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [show, setShow] = useState(false);
  const [copy, setCopy] = useState([]);
  const [mrnList, setMrnList] = useState([]);
  const [rej_note, setRejNote] = useState("");
  const [status, setStatus] = useState("");
  const [itemInfo, setItemInfo] = useState(data?.itemInfo);
  const [count, setCount] = useState(0);
  //   const [dataCopy,setDataCopy] = useEffect([])
  const op = useRef(null);
  const [txt, setText] = useState("");
  const [po_no_code, setCode] = useState();

  // var copy=[]
  const confirmDel = (e) => {
    onDelete();
  };

  const cancel = (e) => {
    console.log(e);
    // message.error('Click on No');
  };
  useEffect(() => {
    setPoNo("");
    setCode();
    setItemInfo(data?.itemInfo);
    console.log(data?.itemInfo);
    console.log(data?.itemInfo?.every((e) => e.req_qty == e.approved_qty));
  }, []);
  const params = useParams();
  const [infoCopy, setInfoCopy] = useState(data?.info);
  console.log(data, flag);
  const content = (
    <div>
      <p>{item_sl}</p>
      <p>{item_remarks}</p>
    </div>
  );
  const onChange = (key) => {
    console.log(key, "onChange");
  };
  function print() {
    var divToPrint = document.getElementById("tablePrint");

    var WindowObject = window.open("", "Print-Window");
    WindowObject.document.open();
    WindowObject.document.writeln("<!DOCTYPE html>");
    WindowObject.document.writeln(
      '<html><head><title></title><style type="text/css">'
    );

    WindowObject.document.writeln(
      "@media print { .center { text-align: center;}" +
        "                                         .inline { display: inline; }" +
        "                                         .underline { text-decoration: underline; }" +
        "                                         .left { margin-left: 315px;} " +
        "                                         .right { margin-right: 375px; display: inline; }" +
        "                                          table { border-collapse: collapse; font-size: 10px;}" +
        "                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}" +
        "                                           th, td { }" +
        "                                         .border { border: 1px solid black; } " +
        "                                         .bottom { bottom: 5px; width: 100%; position: fixed " +
        "                                       " +
        "                                   } .p-paginator-bottom.p-paginator.p-component { display: none; } .heading{display: flex; flex-direction: column; justify-content: center; align-items: center;font-weight:800;margin-bottom:15px} } </style>"
    );
    WindowObject.document.writeln(
      '<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">'
    );
    WindowObject.document.writeln(
      '@media print {body {-webkit-print-color-adjust: exact; overflow: hidden;}  {font-family: "Lora", serif;font-optical-sizing: auto font-weight: <weight>;font-style: normal;}} </style>'
    );
    // WindowObject.document.writeln('@media print { .center { text-align: center;}' +
    //     '                                         .inline { display: inline; }' +
    //     '                                         .underline { text-decoration: underline; }' +
    //     '                                         .left { margin-left: 315px;} ' +
    //     '                                         .right { margin-right: 375px; display: inline; }' +
    //     '                                          table { border-collapse: collapse; font-size: 10px;}' +
    //     '                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}' +
    //     '                                           th, td { }' +
    //     '                                         .border { border: 1px solid black; } ' +
    //     '                                         .bottom { bottom: 5px; width: 100%; position: fixed ' +
    //     '                                       ' +
    //     '                                   } .p-paginator-bottom.p-paginator.p-component { display: none; } .heading{display: flex; flex-direction: column; justify-content: center; align-items: center;font-weight:800;margin-bottom:15px} } </style>');
    // WindowObject.document.writeln('@media print{body {font-family: "Lora", serif;font-optical-sizing: auto font-weight: <weight>;font-style: normal;}}')
    WindowObject.document.writeln(
      '<script src="https://cdn.tailwindcss.com"></scr' + "ipt>"
    );
    WindowObject.document.writeln('</head><body onload="window.print()">');
    WindowObject.document.writeln(divToPrint.innerHTML);
    WindowObject.document.writeln("</body></html>");
    WindowObject.document.close();
    setTimeout(function () {
      WindowObject.close();
    }, 10);
  }
  const itemsComp = [
    {
      key: "1",
      label: "User profile",
      children: <ProfileInfo flag={flag} />,
    },
    {
      key: "2",
      label: "Change password",
      children: <PasswordComp mode={2} onPress={onPress} />,
    },
  ];
  const timeLineItems = [];

  var dataCopy;
  if (flag == 15) {
    for (let i = 0; i < data.length; i++) {
      timeLineItems.push({
        children: (
          <>
            <span>
              Received {data[i].rc_qty} unit(s) by{" "}
              {data[i].rc_by || data[i].created_by}
            </span>
            <div className="my-2 p-2 bg-gray-200 rounded-lg flex-col justify-center items-center shadow-lg">
              <p className="font-bold text-green-900 flex justify-center items-center">
                Remarks: {data[i].remarks}
              </p>
              <p className="font-bold text-green-900 flex justify-center items-center">
                Serial No.: {data[i].sl}
              </p>
              <p className="font-bold text-green-900 flex justify-center items-center">
                MRN No.: {data[i].mrn_no}
              </p>
              <p className="font-bold text-green-900 flex justify-center items-center">
                Invoice: {data[i].invoice}
              </p>
              <p className="font-bold text-green-900 flex justify-center items-center">
                Invoice Date: {formatDate(data[i].invoice_dt)}
              </p>
            </div>
          </>
        ),
        // label:'Received on '+i.rc_at?.split('T')[0]+' at '+i.rc_at?.split('T')[1]
        label: (
          <span>
            Received on{" "}
            {data[i].rc_at?.split("T")[0] ||
              data[i].created_at?.split("T")[0] +
                " at " +
                data[i].rc_at?.split("T")[1] ||
              data[i].created_at?.split("T")[1]}
            {/* <Popconfirm
      title="Delete the item"
      description="Are you sure to delete this item?"
      zIndex={50000}
      okText="Yes"
      cancelText="No"
      onConfirm={()=>{
        {
          setLoading(true)
          axios.post(url+'/api/deleteitemdel',{po_no:params.po_no,user:localStorage.getItem('email'),item:data[i].item_sl}).then(res=>{
            setLoading(false)
            if(res?.data?.suc>0)
              {
                Message('success',res?.data?.msg)
              
                confirm(1)
                
              }
            else{
              Message('error',res?.data?.msg)
              confirm(0)
  
  
            }
          }).catch((err) => {
            console.log(err);
            setLoading(false);
            navigate("/error" + "/" + err.code + "/" + err.message);
          });
        }
  
      }}
    >
      <Tooltip title={'Delete'}>
        <DeleteOutlined className='mx-2 font-bold text-red-900'/>
        </Tooltip>
        
    </Popconfirm> */}
          </span>
        ),
      });
    }
  }
  if (flag == 11) {
    dataCopy = data;
    // setCode()
  }
  if (flag == 18) {
    for (let i = 0; i < data.length; i++) {
      timeLineItems.push({
        children: (
          <>
            <span>Issued {data[i].issue_qty} unit(s)</span>
          </>
        ),
        // label:'Received on '+i.rc_at?.split('T')[0]+' at '+i.rc_at?.split('T')[1]
        label: (
          <span>
            {" "}
            <div className="my-2 p-2 bg-gray-200 rounded-lg flex-col justify-center items-center shadow-lg">
              <p className="font-bold text-green-900 flex justify-center items-center">
                Purpose:{" "}
                {data[i].purpose == "M" ? "Manufacturing Activity" : "Resale"}
              </p>
              <p className="font-bold text-green-900 flex justify-center items-center">
                Notes: {data[i].notes}
              </p>
            </div>
          </span>
        ),
      });
    }
  }
  useEffect(() => {
    if (flag == 25) {
      setCopy(data?.info);
      console.log(":::::::::::::::", data?.info);
    }
    if (flag == 26) {
    }
  }, []);

  useEffect(() => {
    if(flag==25)
    setCopy(data.info)
  },[data])

  useEffect(() => {
    if (flag == 27) {
      setItemInfo(data?.itemInfo);
      setStatus(data?.reqInfo[0]?.approve_flag);
    }
  }, [data?.itemInfo]);

  useEffect(() => {
    if (flag == 35) {
      setItemInfo(data?.itemInfo);
      setStatus(data?.reqInfo[0]?.approve_flag);
    }
  }, [data?.itemInfo]);
  useEffect(() => {
    console.log(data?.info);
    if (flag == 32 || flag == 36) {
      setItemInfo(data?.info);
      if(flag==32)
        setStatus(data.info[0]?.approve_flag);
    }
  }, [data]);

  useEffect(() => {
    if (flag == 27) {
      setCode();
      setPoNo("");
    }
  }, [data]);

  //  if(flag==21){
  //   if(data){
  //   setLoading(true)
  //   axios.post(url+'/api/advanced_search_po',{vendor_id:data?.code_one,project_id:data?.code_two,part_no:data?.val_three,prod_id:data?.code_four,from_dt:data?.val_five,to_dt:data?.val_six}).then(res=>{
  //     console.log(res)
  //     setLoading(false)
  //     setAdvList(res?.data?.msg)

  //   })
  // }
  //  }
  const onChangeApproval = (sl_no, index, e) => {
    console.log(sl_no, index, e);
    infoCopy[index]["check"] = e.target.checked;
    infoCopy[index]["approve_flag"] = e.target.checked ? "A" : "P";

    console.log(infoCopy);
  };
  const handleDtChange = (index, event) => {
    let d = [...itemInfo];
    if (
      d[index]["balance_copy"] >= +event.target.value &&
      +event.target.value >= 0
    ) {
      d[index]["balance"] = +event.target.value;
      d[index]["error"] = 0;
    } else {
      d[index]["balance"] = +event.target.value;
      d[index]["error"] = 1;
    }
    setItemInfo(d);

    console.log(d);
  };

  const handleTransChange = (index, event) => {
    let d = [...itemInfo];
    if (
      d[index]["balance_copy"] >= +event.target.value &&
      +event.target.value >= 0
    ) {
      // d[index]["balance"] = +event.target.value;
      d[index]["qty"] = +event.target.value;
      d[index]["error"] = 0;
    } else {
      d[index]["qty"] = +event.target.value;
      // d[index]["balance"] = +event.target.value;
      d[index]["error"] = 1;
    }
    setItemInfo(d);

    console.log(d);
  };

  const handleDtCancelChange = (index, event) => {
    let d = [...itemInfo];
    if (
      d[index]["balance_copy"] >= +event.target.value &&
      +event.target.value >= 0
    ) {
      d[index]["balance"] = +event.target.value;
      d[index]["error"] = 0;
    } else {
      d[index]["balance"] = +event.target.value;
      d[index]["error"] = 1;
    }
    setItemInfo(d);

    console.log(d);
  };
  const handleDtCancelTransChange = (index, event) => {
    let d = [...itemInfo];
    if (
      d[index]["balance_copy"] >= +event.target.value &&
      +event.target.value >= 0
    ) {
      d[index]["qty"] = +event.target.value;
      d[index]["error"] = 0;
    } else {
      d[index]["qty"] = +event.target.value;
      d[index]["error"] = 1;
    }
    setItemInfo(d);

    console.log(d);
  };
  return (
    <Dialog
      closable={flag != 3 ? true : false}
      header={
        <div
          className={
            flag != 1
              ? "text-white font-bold"
              : "text-white font-bold w-20"
          }
        >
          {(flag == 1 || flag == 4 || flag == 19 || flag == 20 || flag == 31) &&
            "Warning!"}
          {(flag == 2 || flag == 3) && "Alert!"}
          {(flag == 5 ||
            flag == 6 ||
            flag == 7 ||
            flag == 8 ||
            flag == 9 ||
            flag == 16 ||
            flag == 17 ||
            flag == 34 ||
            flag == 36) &&
            "Information"}
          {(flag == 10 || flag == 14) && "Preview"}
          {flag == 11 && "PO List"}
          {(flag == 15 || flag == 18 || flag == 39 || flag == 40) && "Log"}
          {(flag == 21 ||
            flag == 22 ||
            flag == 23 ||
            flag == 24 ||
            flag == 25 ||
            flag == 28 ||
            flag == 29 ||
            flag == 33 ||
            flag == 38 ||
            flag == 37 ||
            flag == 42 ||
            flag == 30) &&
            "Search Result(s)"}
          {(flag == 26 || flag == 27 || flag == 32) && "Approve"}
          {flag == 35 && "Cancel Requisition"}
          {flag == 41 && "Close PO"}
        </div>
       
      }
      visible={visible}
      maximizable
      
      style={{
        width: "50vw",
        background: "black",

      }}
      onHide={() => {
        if (!visible) return;
        onPress();
      }}
    >
      {flag == 1 && (
        <p className="mt-2 mt-2">
          Do you want to logout?
          <div className="flex justify-center gap-2">
            {/* <button
              type="reset"
              onClick={onPress}
              className="relative disabled:bg-red-900 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            >
             
     <span class="relative z-10">

              <CloseOutlined className='mr-2'/> 
        No
        </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button> */}
             <BtnGroupReuse flag={2} text="No"  onClick={onPress} icon={<CloseOutlined className='mr-2'/> }/>
             <BtnGroupReuse flag={1} text="Yes" onClick={() => {
                localStorage.clear();
                navigate(routePaths.LANDING);
              }} icon={ <CheckOutlined className='mr-2' /> }/>
            {/* <button
              type="submit"
              onClick={() => {
                localStorage.clear();
                navigate(routePaths.LANDING);
              }}
              className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            >
               <span class="relative z-10">
        <CheckOutlined className='mr-2' />
        Yes
        </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button> */}
          </div>
        </p>
      )}
      {flag == 2 && (
        <Tabs
          defaultActiveKey="1"
          size={"large"}
          animated
          centered
          items={itemsComp}
          onChange={onChange}
        />
      )}
      {flag == 3 && <PasswordComp mode={3} onPress={onPress} />}
      {flag == 4 && (
        <p className="mt-2 mt-2">
          Do you want to delete this item?
          <div className="flex justify-center gap-2">
            {/* <button
              type="reset"
              onClick={onPress}
                    className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"

            >
              <span class="relative z-10">
                 <CloseOutlined className='mr-2'/> 
                     No
                     </span>
                     <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button> */}
             <BtnGroupReuse flag={2} text="No"  onClick={onPress} icon={<CloseOutlined className='mr-2'/> }/>
             <BtnGroupReuse flag={1} text="Yes" onClick={onDelete} icon={ <CheckOutlined className='mr-2' /> }/>
            {/* <button
              type="submit"
              onClick={onDelete}
              className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            >
              <span class="relative z-10">
        <CheckOutlined className='mr-2' />
        Yes
        </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button> */}
          </div>
        </p>
      )}
      {flag == 5 && (
        <p className="mt-2">
          <ClientInfo data={data} />
        </p>
      )}
      {flag == 6 && (
        <p className="mt-2">
          <PocInfo data={data} />
        </p>
      )}
      {flag == 7 && (
        <p className="mt-2">
          <ProjectInfo data={data} />
        </p>
      )}
      {flag == 8 && (
        <p className="mt-2">
          <VendorInfo data={data} />
        </p>
      )}
      {flag == 9 && (
        <p className="mt-2">
          <ProdInfo data={data} />
        </p>
      )}
      {flag == 10 && (
        <p className="mt-2">
          <PoPreview data={data} />
        </p>
      )}
      {flag == 11 && (
        <p className="mt-2">
          <TDInputTemplate
            placeholder="Select PO"
            type="text"
            label="Select PO"
            name="po_no"
            formControlName={po_no}
            handleFocus={(e) => op.current.show(e)}
            handleChange={(txt) => {
              setPoNo(txt.target.value);
              console.log(txt.target.value);
              dataCopy = data.filter((e) => e.name.includes(txt.target.value));
              if (txt.target.value.length) op.current.show(txt);
              else op.current.hide(txt);

              //   setCode(0)
            }}
            mode={1}
            data={data}
          />
          <OverlayPanel
            ref={op}
            className="w-[610px] border-2 bg-gray-50 border-[#C4F1BE]"
          >
            <span className="text-xs text-green-900 italic">
              Search results for: "{po_no}"
            </span>
            <ul class=" divide-y max-h-48 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
              {data.filter((e) => e.name.includes(po_no)).length > 0 &&
                data
                  .filter((e) => e.name.includes(po_no))
                  ?.map((lst) => (
                    <li
                      onClick={(e) => {
                        op.current.hide(e);
                        setPoNo(lst.name);
                        setCode(lst.code);
                        console.log(lst);
                        setLoading(true);
                        axios
                          .post(url + "/api/check_po_list", { sl_no: lst.code })
                          .then((res) => {
                            setLoading(false);
                            console.log(res);
                            setCount(res?.data?.msg?.cnt);
                          });
                      }}
                    class="pb-3 cursor-pointer  hover:bg-[#C4F1BE] group active:bg-green-900 rounded-md hover:duration-300 sm:py-1.5"

                    >
                      <div class="flex items-center rtl:space-x-reverse">
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-bold p-0.5 w-full text-green-900 truncate dark:text-white">
                            {lst.name}
                          </p>
                        </div>
                      </div>
                      {/* <Divider /> */}
                    </li>
                  ))}
              {data.filter((e) => e.name.includes(po_no)).length == 0 && (
                <Empty />
              )}
            </ul>
          </OverlayPanel>
          {po_no_code && (
            <div className="flex justify-center items-center my-3">
              <AmendPreview id={po_no_code} />
            </div>
          )}
          <div className="flex justify-end">
            {po_no_code && count == 0 && (
        //       <button
        //         disabled={loading}
        //         type="submit"
        //         className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
        //         onClick={() => amendPo(po_no_code)}
        //       >
        //        <span class="relative z-10">
        // <RightOutlined className='mr-2' />
        // Proceed
        // </span>
        // <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
        //       </button>
             <BtnGroupReuse loading={loading} disabled={loading} flag={1} text="Proceed" onClick={() => amendPo(po_no_code)} icon={<RightOutlined className='mr-2' /> }/>

            )}{" "}
          </div>
          <div className="flex justify-center">
            {count > 0 && (
              // <Tag className="bg-red-900 text-white">
              //   Cannot amend this PO as MRN has already been performed for this
              //   PO or an amended copy.
              // </Tag>
              <InfoTags text="Cannot amend this PO as MRN has already been performed for this
                PO or an amended copy." bgCol={"bg-red-900 text-white"} icon={<WarningOutlined/>}/>
            )}
          </div>
        </p>
      )}
      {flag == 12 && (
        <p className="mt-2">
          Do you want to cancel this PO?
          <div className="flex justify-center gap-2">
            {/* <button
              type="reset"
              onClick={onPress}
              className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            >
              <span class="relative z-10">
                 <CloseOutlined className='mr-2'/> 
                     No
                     </span>
                     <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button> */}
             <BtnGroupReuse flag={2} text="No"  onClick={onPress} icon={<CloseOutlined className='mr-2'/> }/>
             <BtnGroupReuse flag={1} text="Yes" onClick={onDelete} icon={ <CheckOutlined className='mr-2' /> }/>
            {/* <button
              type="submit"
              onClick={onDelete}
              className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            >
              <span class="relative z-10">
        <CheckOutlined className='mr-2' />
        Yes
        </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button> */}
          </div>
        </p>
      )}
      {flag == 13 && (
        <p className="mt-2">
          Do you want to cancel this PO without citing any reason?
          <div className="flex justify-center gap-2">
            {/* <button
              type="reset"
              onClick={onPress}
              className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            >
              <span class="relative z-10">
                 <CloseOutlined className='mr-2'/> 
                     No
                     </span>
                     <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button> */}
             <BtnGroupReuse flag={2} text="No"  onClick={onPress} icon={<CloseOutlined className='mr-2'/> }/>
             <BtnGroupReuse flag={1} text="Yes" onClick={onDelete} icon={ <CheckOutlined className='mr-2' /> }/>
            {/* <button
              type="submit"
              onClick={onDelete}
              className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            >
              <span class="relative z-10">
        <CheckOutlined className='mr-2' />
        Yes
        </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button> */}
          </div>
        </p>
      )}
      {flag == 14 && <AmendPreview id={id} />}
      {flag == 15 && (
        <div className="mt-2">
          <SpinComp
            loading={loading}
          >
            <Timeline className="my-2" mode="right" items={timeLineItems} />
          </SpinComp>
        </div>
      )}
      {flag == 16 && (
        <div className="mt-2">
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table
              id="tablePrint"
              class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
            >
              <thead class="text-xs text-white uppercase bg-green-900 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Item
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Received quantity
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Invoice
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Invoice Date
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Sl No.
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Remarks
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Log
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 &&
                  data?.map((item) => (
                    <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.prod_name}
                      </th>

                      <td class="px-6 py-4">{item.rc_qty}</td>
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.invoice}
                      </th>
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {formatDate(item.invoice_dt)}
                      </th>
                      <td class="px-6 py-4">{item.sl}</td>
                      <td class="px-6 py-4">
                        {item.approve_flag == "P"
                          ? "Pending"
                          : item.approve_flag == "A"
                          ? "Approved"
                          : "Rejected"}
                      </td>

                      <td class="px-6 py-4">{item.remarks}</td>
                      <td class="px-6 py-4">
                        {"Received by- " +
                          item.created_by +
                          " on " +
                          item.created_at?.split("T")[0] +
                          " at " +
                          item.created_at?.split("T")[1]}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div
            ref={contentRef}
            class="relative overflow-x-auto mt-4 w-11/12 mx-auto text-xs border border-green-500 p-2 rounded-md shadow-md sm:rounded-lg"
            style={{
              display: !isPrinting ? "block" : "none",
            }}
          >
            <PrintHeader />
            <table
              id="tablePrint"
              class="w-full text-sm text-left mt-3 rtl:text-right text-gray-500 dark:text-gray-400"
            >
              <thead class="text-xs text-white uppercase border border-collapse bg-green-500 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-3 py-1.5 border border-gray-300">
                    Item
                  </th>
                  <th scope="col" class="px-3 py-1.5 border border-gray-300">
                    Received quantity
                  </th>
                  <th scope="col" class="px-3 py-1.5 border border-gray-300">
                    Invoice
                  </th>
                  <th scope="col" class="px-3 py-1.5 border border-gray-300">
                    Invoice Date
                  </th>
                  <th scope="col" class="px-3 py-1.5 border border-gray-300">
                    Sl No.
                  </th>
                  <th scope="col" class="px-3 py-1.5 border border-gray-300">
                    Status
                  </th>
                  <th scope="col" class="px-3 py-1.5 border border-gray-300">
                    Remarks
                  </th>
                  <th scope="col" class="px-3 py-1.5 border border-gray-300">
                    Log
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 &&
                  data?.map((item) => (
                    <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border border-gray-300">
                      <th
                        scope="row"
                        class="px-3 py-4 border border-gray-300 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.prod_name}
                      </th>

                      <td class="px-3 py-2 border border-gray-300">
                        {item.rc_qty}
                      </td>
                      <th
                        scope="row"
                        class="px-3 py-2 border border-gray-300 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.invoice}
                      </th>
                      <th
                        scope="row"
                        class="px-3 py-2 border border-gray-300 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {formatDate(item.invoice_dt)}
                      </th>
                      <td class="px-3 py-2 border border-gray-300">
                        {item.sl}
                      </td>
                      <td class="px-3 py-2 border border-gray-300">
                        {item.approve_flag == "P"
                          ? "Pending"
                          : item.approve_flag == "A"
                          ? "Approved"
                          : "Rejected"}
                      </td>

                      <td class="px-3 py-2 border border-gray-300">
                        {item.remarks}
                      </td>
                      <td class="px-3 py-2 border border-gray-300">
                        {"Received by- " +
                          item.created_by +
                          " on " +
                          item.created_at?.split("T")[0] +
                          " at " +
                          item.created_at?.split("T")[1]}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-2">
            <Tooltip title="Print this table">
              <Fab
                color="success"
                size="small"
                aria-label="add"
                onClick={() => {
                  setIsPrinting(false);
                  setTimeout(() => {
                    reactToPrintFn();
                    setIsPrinting(true);
                  }, 5);
                }}
              >
                <PrinterOutlined />
              </Fab>
            </Tooltip>
          </div>
        </div>
      )}
      {flag == 17 && (
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-white uppercase bg-green-900 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Item
                </th>
                <th scope="col" class="px-6 py-3">
                  PO
                </th>
                <th scope="col" class="px-6 py-3">
                  Received quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 &&
                data?.map((item) => (
                  <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item.prod_name}
                    </th>
                    <td class="px-6 py-4">{item.po_no}</td>
                    <td class="px-6 py-4">{item.rc_qty}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {flag == 18 && (
        <Timeline className="my-2" mode="right" items={timeLineItems} />
      )}

      {flag == 19 && (
        <p className="mt-2">
          Do you want to deactivate this user?
          <TDInputTemplate
            placeholder="Why do you want to deactivate/block this user?"
            type="text"
            name="block"
            label="Why do you want to deactivate/block this user?"
            formControlName={reason}
            handleChange={(txt) => setReason(txt.target.value)}
            mode={3}
          />
          <div className="flex justify-center gap-2">
            {/* <button
              type="reset"
              onClick={onPress}
              className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            >
               <span class="relative z-10">
                 <CloseOutlined className='mr-2'/> 
                     No
                     </span>
                     <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button> */}
             <BtnGroupReuse flag={2} text="No"  onClick={onPress} icon={<CloseOutlined className='mr-2'/> }/>
             <BtnGroupReuse disabled={!reason} flag={1} text="Yes"  onClick={() => {
                onDeactivate(reason);
              }} icon={ <CheckOutlined className='mr-2' /> }/>
            {/* <button
              disabled={!reason}
              type="submit"
              onClick={() => {
                onDeactivate(reason);
              }}
              className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            >
               <span class="relative z-10">
        <CheckOutlined className='mr-2' />
        Yes
        </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button> */}
          </div>
        </p>
      )}

      {flag == 20 && (
        <p className="mt-2">
          Do you want to reject this requisition?
          <TDInputTemplate
            placeholder="Write a log..."
            type="text"
            name="block"
            label="Write a log"
            formControlName={reason}
            handleChange={(txt) => setReason(txt.target.value)}
            mode={3}
          />
          <div className="flex justify-center gap-2">
            {/* <button
              type="reset"
              onClick={onPress}
              className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            >
              <span class="relative z-10">
                 <CloseOutlined className='mr-2'/> 
                     No
                     </span>
                     <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button> */}
              <BtnGroupReuse flag={2} text="No"  onClick={onPress} icon={<CloseOutlined className='mr-2'/> }/>
             <BtnGroupReuse disabled={!reason} flag={1} text="Yes"  onClick={() => {
                onDeactivate(reason);
              }} icon={ <CheckOutlined className='mr-2' /> }/>
            {/* <button
              disabled={!reason}
              type="submit"
              onClick={() => {
                onDeactivate(reason);
              }}
              className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
            >
                <span class="relative z-10">
        <CheckOutlined className='mr-2' />
        Yes
        </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button> */}
          </div>
        </p>
      )}
      {flag == 21 && (
        <>
          <div className="flex gap-3 my-5">
            {data?.labels?.val_one && (
              <Chip
                className="text-xs  bg-[#C4F1BE]"
                label={data?.labels?.val_one}
              />
            )}
            {data?.labels?.val_two && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_two}
              />
            )}
            {data?.labels?.val_three && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_three}
              />
            )}
            {data?.labels?.val_four && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_four}
              />
            )}
            {data?.labels?.val_five && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_five}
              />
            )}
            {data?.labels?.val_six && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_six}
              />
            )}
            {data?.labels?.val_eight && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_eight}
              />
            )}
          </div>
          {data?.list?.length > 0 ? (
            <ul class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              {data?.list?.map((lst) => (
                <li
                  onClick={() => {
                    navigate(
                      lst.fresh_flag == "Y"
                        ? routePaths.PURCHASEORDERFORM + "F/" + lst.sl_no
                        : routePaths.PURCHASEORDERFORM + "E/" + lst.sl_no
                    );
                  }}
                  class="pb-3 p-2 sm:pb-4 cursor-pointer hover:bg-gray-200"
                >
                  <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    {/* <div class="flex-shrink-0">
            <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
         </div> */}
                    <div class="flex-1 min-w-0">
                      <p class="text-lg font-bold text-green-900  truncate dark:text-white">
                        {lst.po_no}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        Vendor:{" "}
                        <span
                          className={
                            lst.vendor_name == data?.labels?.val_one
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.vendor_name}{" "}
                        </span>
                        , Project:{" "}
                        <span
                          className={
                            lst.proj_name == data?.labels?.val_two
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {" "}
                          {lst.proj_name}
                        </span>
                        , Part No.:{" "}
                        <span
                          className={
                            lst.part_no == data?.labels?.val_three
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.part_no}{" "}
                        </span>
                        , Item:{" "}
                        <span
                          className={
                            lst.prod_name == data?.labels?.val_four
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_name}
                        </span>
                        , Make:{" "}
                        <span
                          className={
                            lst.prod_make == data?.labels?.val_eight
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_make}
                        </span>
                        , Issued:{" "}
                        <span
                          className={
                            lst.po_issue_date <= data?.labels?.val_six &&
                            lst.po_issue_date >= data?.labels?.val_five
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {formatDate(lst.po_issue_date)}
                        </span>
                      </p>
                    </div>
                    <Tooltip
                      title={
                        lst.po_status == "A"
                          ? "Approved"
                          : lst.po_status == "U"
                          ? "Pending approval"
                          : "In progress"
                      }
                    >
                      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        {lst.po_status == "A" ? (
                          <CheckCircleFilled className="text-green-900" />
                        ) : lst.po_status == "U" ? (
                          <ClockCircleFilled className="text-amber-500" />
                        ) : (
                          <FileTextOutlined className="text-blue-500" />
                        )}
                      </div>
                    </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty />
          )}
        </>
      )}
      {flag == 22 && (
        <>
          <div className="flex gap-3 my-5">
            {data?.labels?.val_one && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_one}
              />
            )}
            {data?.labels?.val_two && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_two}
              />
            )}
            {data?.labels?.val_three && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_three}
              />
            )}
            {data?.labels?.val_four && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_four}
              />
            )}
            {data?.labels?.val_five && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_five}
              />
            )}
            {data?.labels?.val_six && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_six}
              />
            )}
            {data?.labels?.val_eight && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_eight}
              />
            )}
          </div>
          {data?.list?.length > 0 ? (
            <ul class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              {data?.list?.map((lst) => (
                <li
                  onClick={() => {
                    navigate(routePaths.REQFORM + lst.sl_no);
                  }}
                  class="pb-3 p-2 sm:pb-4 cursor-pointer hover:bg-gray-200"
                >
                  <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    {/* <div class="flex-shrink-0">
            <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
         </div> */}
                    <div class="flex-1 min-w-0">
                      <p class="text-lg font-bold text-green-900  truncate dark:text-white">
                        {lst.req_no}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        Vendor:{" "}
                        <span
                          className={
                            lst.vendor_name == data?.labels?.val_one
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.vendor_name}{" "}
                        </span>
                        , Project:{" "}
                        <span
                          className={
                            lst.proj_name == data?.labels?.val_two
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {" "}
                          {lst.proj_name}
                        </span>
                        , Part No.:{" "}
                        <span
                          className={
                            lst.part_no == data?.labels?.val_three
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.part_no}{" "}
                        </span>
                        , Item:{" "}
                        <span
                          className={
                            lst.prod_name == data?.labels?.val_four
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_name}
                        </span>
                        , Make:{" "}
                        <span
                          className={
                            lst.prod_make == data?.labels?.val_eight
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_make}
                        </span>
                        , Issued:{" "}
                        <span
                          className={
                            lst.req_date <= data?.labels?.val_six &&
                            lst.req_date >= data?.labels?.val_five
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {formatDate(lst.req_date)}
                        </span>
                      </p>
                    </div>
                    <Tooltip
                      title={
                        lst.po_status == "A"
                          ? "Approved"
                          : lst.po_status == "U"
                          ? "Pending approval"
                          : "In progress"
                      }
                    >
                      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        {lst.approve_flag == "A" ? (
                          <CheckCircleFilled className="text-green-900" />
                        ) : lst.approve_flag == "U" ? (
                          <ClockCircleFilled className="text-amber-500" />
                        ) : (
                          <FileTextOutlined className="text-blue-500" />
                        )}
                      </div>
                    </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty />
          )}
        </>
      )}

      {flag == 23 && (
        <>
          <div className="flex gap-3 my-5">
            {data?.labels?.val_one && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_one}
              />
            )}
            {data?.labels?.val_two && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_two}
              />
            )}
            {data?.labels?.val_three && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_three}
              />
            )}
            {data?.labels?.val_four && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_four}
              />
            )}
            {data?.labels?.val_five && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_five}
              />
            )}
            {data?.labels?.val_six && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_six}
              />
            )}
            {data?.labels?.val_seven && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_seven}
              />
            )}
            {data?.labels?.val_eight && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_eight}
              />
            )}
          </div>
          {data?.list?.length > 0 ? (
            <ul class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              {data?.list?.map((lst) => (
                <li
                  onClick={() => {
                    navigate(
                      routePaths.DELIVERYCUSTOMERFORM +
                        lst.del_sl +
                        "/" +
                        encodeURIComponent(lst.po_no)
                    );
                  }}
                  class="pb-3 p-2 sm:pb-4 cursor-pointer hover:bg-gray-200"
                >
                  <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    {/* <div class="flex-shrink-0">
            <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
         </div> */}
                    <div class="flex-1 min-w-0">
                      <p class="text-lg font-bold text-green-900  truncate dark:text-white">
                        {lst.po_no}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        Vendor:{" "}
                        <span
                          className={
                            lst.vendor_name == data?.labels?.val_one
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.vendor_name}{" "}
                        </span>
                        , Project:{" "}
                        <span
                          className={
                            lst.proj_name == data?.labels?.val_two
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {" "}
                          {lst.proj_name}
                        </span>
                        , Part No.:{" "}
                        <span
                          className={
                            lst.part_no == data?.labels?.val_three
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.part_no}{" "}
                        </span>
                        , Item:{" "}
                        <span
                          className={
                            lst.prod_name == data?.labels?.val_four
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_name}
                        </span>
                        , Invoice:{" "}
                        <span
                          className={
                            lst.invoice == data?.labels?.val_seven
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.invoice}
                        </span>
                        , Make:{" "}
                        <span
                          className={
                            lst.prod_make == data?.labels?.val_eight
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_make}
                        </span>
                        , Invoice Date:{" "}
                        <span
                          className={
                            lst.invoice_dt <= data?.labels?.val_six &&
                            lst.invoice_dt >= data?.labels?.val_five
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {formatDate(lst.invoice_dt)}
                        </span>
                        , MRN: {lst.mrn_no}
                      </p>
                    </div>
                    {/* <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
            {lst.approve_flag=='A'?<CheckCircleFilled className="text-green-900" />:lst.approve_flag=='U'?<CloseCircleFilled className='text-red-900'/>:<ClockCircleFilled className='text-amber-500'/>}
         </div> */}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty />
          )}
        </>
      )}

      {flag == 24 && (
        <>
          <div className="flex gap-3 my-5">
            {data?.labels?.val_one && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_one}
              />
            )}
            {data?.labels?.val_two && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_two}
              />
            )}
            {data?.labels?.val_three && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_three}
              />
            )}
            {data?.labels?.val_four && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_four}
              />
            )}
            {data?.labels?.val_five && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_five}
              />
            )}
            {data?.labels?.val_six && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_six}
              />
            )}
            {data?.labels?.val_eight && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_eight}
              />
            )}
          </div>
          {data?.list?.length > 0 ? (
            <ul class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              {data?.list?.map((lst) => (
                <li
                  onClick={() => {
                    navigate(routePaths.MINFORM + lst.sl_no);
                  }}
                  class="pb-3 p-2 sm:pb-4 cursor-pointer hover:bg-gray-200"
                >
                  <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    {/* <div class="flex-shrink-0">
            <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
         </div> */}
                    <div class="flex-1 min-w-0">
                      <p class="text-lg font-bold text-green-900  truncate dark:text-white">
                        {lst.req_no}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        Vendor:{" "}
                        <span
                          className={
                            lst.vendor_name == data?.labels?.val_one
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.vendor_name}{" "}
                        </span>
                        , Project:{" "}
                        <span
                          className={
                            lst.proj_name == data?.labels?.val_two
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {" "}
                          {lst.proj_name}
                        </span>
                        , Part No.:{" "}
                        <span
                          className={
                            lst.part_no == data?.labels?.val_three
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.part_no}{" "}
                        </span>
                        , Item:{" "}
                        <span
                          className={
                            lst.prod_name == data?.labels?.val_four
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_name}
                        </span>
                        , Make:{" "}
                        <span
                          className={
                            lst.prod_make == data?.labels?.val_eight
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_make}
                        </span>
                        , Issued:{" "}
                        <span
                          className={
                            lst.po_issue_date <= data?.labels?.val_six &&
                            lst.po_issue_date >= data?.labels?.val_five
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {formatDate(lst.po_issue_date)}
                        </span>
                      </p>
                    </div>
                    <Tooltip
                      title={
                        lst.po_status == "A"
                          ? "Approved"
                          : lst.po_status == "U"
                          ? "Pending approval"
                          : "In progress"
                      }
                    >
                      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        {lst.po_status == "A" ? (
                          <CheckCircleFilled className="text-green-900" />
                        ) : lst.po_status == "U" ? (
                          <ClockCircleFilled className="text-amber-500" />
                        ) : (
                          <FileTextOutlined className="text-blue-500" />
                        )}
                      </div>
                    </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty />
          )}
        </>
      )}

      {flag == 25 && (
        <>
          <div className="flex gap-3 my-5">
            <input
              type="search"
              id="default-search"
              className="bg-green-50 border-green-50 border-2 sticky shadow-lg top-1 z-10 rounded-full  text-gray-800 text-sm  my-1 mb-2 p-2  duration-500 block w-full focus:border-gray-200 focus:ring-gray-200 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Search by items, part_no, make, article_no, model_no,description..."
              onFocus={()=>setCopy(data.info)}
              onChange={(e) => {
                console.log(e.target.value);
                setCopy(
                  data.info.filter(
                    (lst) =>
                      lst.prod_name
                        ?.toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                      lst.prod_make
                        ?.toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                        lst.model_no
                        ?.toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                        lst.article_no
                        ?.toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                        lst.prod_desc
                        ?.toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                      lst.part_no
                        ?.toLowerCase()
                        .includes(e.target.value.toLowerCase())
                  )
                );
              }}
            />
          </div>
          {copy?.length > 0 ? (
            <>
            <ul class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              {copy?.slice(first, rows + first)?.map((lst) => (
                <li
                  onClick={() => {
                    onSearch(lst.sl_no);
                  }}
                  class="pb-3 p-2 sm:pb-4 cursor-pointer  hover:bg-green-50 duration-300"
                >
                  <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    {/* <div class="flex-shrink-0">
            <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
         </div> */}
                    <div class="flex-1 min-w-0">
                      <p class="text-lg font-bold text-green-900  truncate dark:text-white">
                        {lst.prod_name}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        Part No.: {lst.part_no}, Article No.: {lst.article_no},
                        Model No.: {lst.model_no}, Make: {lst.prod_make}, HSN:{" "}
                        {lst.hsn_code}, Description: {lst.prod_desc}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
             {/* <Paginator
                          first={first}
                          rows={rows}
                          totalRecords={copy?.length}
                          rowsPerPageOptions={[3, 5, 10, 15, 20, 30, copy?.length]}
                          onPageChange={onPageChange}
                        /> */}
                        <Pagination 
                          first={first}
                          rows={rows}
                          totalRecords={copy?.length}
                          rowsPerPageOptions={[3, 5, 10, 15, 20, 30, copy?.length]}
                          onPageChange={onPageChange}
                          />
                        </>
          ) : (
            <Empty />
          )}
        </>
      )}
      {flag == 26 && (
        <>
          <div className="flex justify-end mt-2">
            <Tooltip title="Print this table">
              <Fab
                color="success"
                size="small"
                aria-label="add"
                onClick={() => reactToPrintFn()}
              >
                <PrinterOutlined />
              </Fab>
            </Tooltip>
          </div>
          <div ref={contentRef} className="px-2 pt-3">
            <div className="flex justify-start gap-6">
              {data?.details[0]?.approve_flag == "A" ? (
                // <Tag
                //   className="text-[12px] p-1 rounded-full w-36"
                //   icon={<CheckCircleOutlined />}
                //   color="success"
                // >
                //   Approved
                // </Tag>
                <InfoTags bgCol={"text-[12px] p-1 rounded-full w-36"} icon={<CheckCircleOutlined />} color={"success"} text={'Approved'}/>
              ) : data?.details[0]?.approve_flag == "P" ? (
                // <Tag
                //   className="text-[12px] p-1 rounded-full w-36"
                //   icon={<SyncOutlined spin />}
                //   color="processing"
                // >
                //   Pending
                // </Tag>
                <InfoTags bgCol={"text-[12px] p-1 rounded-full w-36"} icon={<SyncOutlined spin />} color={"processing"} text={'Pending'}/>

              ) : (
                // <Tag
                //   className="text-[12px] p-1 rounded-full w-36"
                //   icon={<CloseCircleOutlined className="animate-spin" />}
                //   color="error"
                // >
                //   Rejected
                // </Tag>
                <InfoTags bgCol={"text-[12px] p-1 rounded-full w-36"} icon={<CloseCircleOutlined className="animate-spin" />} color={"error"} text={'Rejected'}/>

              )}
            </div>

            <div className="sm:col-span-12 flex justify-end mb-2 ">
              {/* <Tag className="text-sm" color="#014737">
                PO : {data?.details[0]?.po_no} | MRN :{" "}
                {data?.details[0]?.mrn_no}
              </Tag> */}
              <InfoTags bgCol={"text-sm"} color="#014737" text={'PO : '+data?.details[0]?.po_no +' | MRN : '+ data?.details[0]?.mrn_no} />
            </div>
            <table className="w-full border-separate border border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400 sm:col-span-12">
              <thead className="text-xs bg-[#C4F1BE] font-bold uppercase text-green-900 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 w-1/4 font-bold">
                    Invoice No. <span className="text-xs text-red-600">*</span>
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/4 font-bold">
                    Invoice Date <span className="text-xs text-red-600">*</span>
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/4 font-bold">
                    LR No.
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/4 font-bold">
                    Waybill
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#DDEAE0]  border-b-2 border-white my-3 font-bold dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-4 w-1/4 py-4  text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <TDInputTemplate
                      placeholder="Invoice No."
                      type="text"
                      name="invoice"
                      formControlName={data?.details[0]?.invoice}
                      disabled={true}
                      mode={1}
                    />
                  </th>
                  <td className="px-6 py-4 w-1/4">
                    <TDInputTemplate
                      placeholder="Invoice Date"
                      type="date"
                      name="inv_dt"
                      formControlName={data?.details[0]?.invoice_dt}
                      disabled={true} //may need to change
                      mode={1}
                    />
                  </td>
                  <td className="px-6 py-4 w-1/4">
                    <TDInputTemplate
                      placeholder="LR No."
                      type="text"
                      name="lr_no"
                      formControlName={data?.details[0]?.lr_no}
                      disabled={true}
                      mode={1}
                    />
                  </td>
                  <td className="px-6 py-4 w-1/4">
                    <TDInputTemplate
                      placeholder="Waybill"
                      type="text"
                      name="waybill"
                      formControlName={data?.details[0]?.waybill}
                      disabled={true}
                      mode={1}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="bg-[#C4F1BE] px-6 py-6 mt-3 sm:col-span-12 text-green-900 font-bold text-xs uppercase">
              Documents
            </div>
            <div
              style={{ width: "100%" }}
              className="border-2 bg-[#DDEAE0] rounded-b-lg p-3 -mt-6  sm:col-span-12 border-gray-300"
            >
              <Row>
                <Col span={8}>
                  <Checkbox
                    checked={data?.details[0]?.ic == "Y" ? true : false}
                    name="ic"
                    disabled={true}
                  >
                    Insurance Certificate
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.details[0]?.og == "Y" ? true : false}
                    name="og"
                    disabled={true}
                  >
                    Original Copy
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.details[0]?.dc == "Y" ? true : false}
                    name="dc"
                    disabled={true}
                  >
                    Duplicate Copy
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.details[0]?.lr == "Y" ? true : false}
                    name="lr"
                    disabled={true}
                  >
                    LR
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.details[0]?.wb == "Y" ? true : false}
                    name="wb"
                    disabled={true}
                  >
                    Waybill
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.details[0]?.pl == "Y" ? true : false}
                    name="pl"
                    disabled={true}
                  >
                    Packing List
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.details[0]?.om == "Y" ? true : false}
                    name="om"
                    disabled={true}
                  >
                    Operation and Maintenance
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.details[0]?.om_manual == "Y" ? true : false}
                    name="om_manual"
                    disabled={true}
                  >
                    O&M Manual
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.details[0]?.ws == "Y" ? true : false}
                    name="ws"
                    disabled={true}
                  >
                    Weighing Slip
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.details[0]?.tc == "Y" ? true : false}
                    name="tc"
                    disabled={true}
                  >
                    TC
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.details[0]?.wc == "Y" ? true : false}
                    name="wc"
                    disabled={true}
                  >
                    Warranty Certificate
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.details[0]?.ot == "Y" ? true : false}
                    name="ot"
                    disabled={true}
                  >
                    Others
                  </Checkbox>
                </Col>
              </Row>
              {data.details[0]?.ot_desc && (
                <Row>
                  <Col span={24} className="my-2">
                    <TDInputTemplate
                      placeholder="Specify Document"
                      type="text"
                      name="ot_desc"
                      label="Specify Document"
                      formControlName={data?.details[0]?.ot_desc}
                      disabled={true}
                      mode={3}
                    />
                  </Col>
                </Row>
              )}
              {data?.details[0]?.ot == "Y" && (
                <Row>
                  <Col span={24} className="my-2">
                    {/* <TDInputTemplate
                        placeholder="Other Document"
                        type="file"
                        name="ot_desc"
                        label="Other Document"
                        // formControlName={ot_desc}
                       
                        mode={1}
                      /> */}
                    {data?.files?.map((item) => (
                      <div className="relative">
                        <a target="_blank" href={url + "/uploads/" + item.doc}>
                          {item?.doc?.toString().split(".")[1] == "pdf" ? (
                            <FilePdfOutlined className="text-6xl my-7 text-red-600" />
                          ) : item?.doc
                              ?.toString()
                              .split(".")[1]
                              ?.includes("doc") ? (
                            <FileWordOutlined className="text-6xl my-7 text-blue-900" />
                          ) : item?.doc
                              ?.toString()
                              .split(".")[1]
                              ?.includes("xls") ||
                            item?.doc
                              ?.toString()
                              .split(".")[1]
                              ?.includes("csv") ? (
                            <FileExcelOutlined className="text-6xl my-7 text-green-800" />
                          ) : (
                            <FileImageOutlined className="text-6xl my-7 text-yellow-500" />
                          )}
                        </a>
                      </div>
                    ))}
                  </Col>
                </Row>
              )}
            </div>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
              <table className="w-full text-xs border-separate border border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400 sm:col-span-12">
                <thead className="text-xs bg-[#C4F1BE] font-bold uppercase text-green-900 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-3 py-3 font-bold text-nowrap">
                      Item
                    </th>
                    <th scope="col" class="px-3 py-3 font-bold text-nowrap">
                      Received quantity
                    </th>
                    <th scope="col" class="px-3 py-3 font-bold text-nowrap">
                      Invoice Date
                    </th>
                    <th scope="col" class="px-3 py-3 font-bold text-nowrap">
                      Sl No.
                    </th>
                    <th scope="col" class="px-3 py-3 font-bold text-nowrap">
                      Remarks
                    </th>
                    <th scope="col" class="px-3 py-3 font-bold text-nowrap">
                      Log
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.length > 0 &&
                    data?.items?.map((item) => (
                      <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <th
                          scope="row"
                          class="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {item.prod_name}
                          <p className="text-green-900 text-wrap">
                            {" "}
                            Part No.: {item.part_no} , Article No.:{" "}
                            {item.article_no} , Model No.: {item.model_no}{" "}
                          </p>
                        </th>
                        <td class="px-3 py-4">{item.rc_qty}</td>
                        <th
                          scope="row"
                          class="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {formatDate(item.invoice_dt)}
                        </th>
                        <td class="px-3 py-4">{item.sl}</td>

                        <td class="px-3 py-4">{item.remarks}</td>
                        <td class="px-3 py-4 ">
                          {"Received by- " +
                            item.created_by +
                            " on " +
                            item.created_at?.split("T")[0] +
                            " at " +
                            item.created_at?.split("T")[1]}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="flex justify-center my-4">
                {data?.details[0]?.approve_flag == "U" && (
                  <Alert
                    message={data?.details[0]?.rejection_note}
                    type="error"
                  />
                )}
              </div>
            </div>
          </div>
          {data?.details[0]?.approve_flag == "P" && det?.mrn != 1 && (
            <div className="flex justify-center gap-5">
              <Popconfirm
                zIndex={5000}
                title="Reject the MRN?"
                description={
                  <TDInputTemplate
                    placeholder="Rejection note"
                    type="text"
                    // label="Rejection Note"
                    name="rej_note"
                    formControlName={rej_note}
                    handleChange={(txt) => {
                      setRejNote(txt.target.value);

                      //   setCode(0)
                    }}
                    mode={1}
                  />
                }
                icon={<QuestionCircleOutlined style={{ color: "white" }} />}
                onConfirm={() => onPress("U", rej_note)}
              >
                {/* <button
                  type="submit"
                  className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
                  // onClick={()=>onPress('U')}
                >
     <span class="relative z-10">

                  <CloseCircleOutlined className="mr-2" />
                  Reject
                   </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
                </button> */}
                <BtnGroupReuse flag={2} text="Reject" icon={<CloseCircleOutlined className="mr-2" />}/>
              </Popconfirm>
              {/* <button
                type="submit"
                className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
                onClick={() => onPress("A", "")}
              >
        <span class="relative z-10">

                <CheckCircleOutlined className="mr-2" />
                Approve
                </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
              </button> */}
                <BtnGroupReuse flag={1} text="Approve"  onClick={() => onPress("A", "")} icon={<CheckCircleOutlined className="mr-2" />}/>

            </div>
          )}
        </>
      )}

      {flag == 27 && (
        <>
          {/* <div className="flex justify-start gap-6">
            {data?.reqInfo[0]?.approve_flag == "A" ? (
              <Tag
                className="text-[12px] p-1 rounded-full w-36"
                icon={<CheckCircleOutlined />}
                color="success"
              >
                Approved
              </Tag>
            ) : data?.reqInfo[0]?.approve_flag == "P" ? (
              <Tag
                className="text-[12px] p-1 rounded-full w-36"
                icon={<SyncOutlined spin />}
                color="processing"
              >
                Pending
              </Tag>
            ) : data?.reqInfo[0]?.approve_flag == "H" ? (
              <Tag
                className="text-[12px] p-1 rounded-full w-36"
                icon={<SyncOutlined spin />}
                color="lime"
              >
                Partially Approved
              </Tag>
            ) : (
              <Tag
                className="text-[12px] p-1 rounded-full w-36"
                icon={<CloseCircleOutlined className="animate-spin" />}
                color="error"
              >
                Rejected
              </Tag>
            )}
          </div> */}

          <div className="sm:col-span-12 flex justify-end my-2 ">
            {/* <Tag className="text-sm" color="#014737">
              Requisition : {data?.reqInfo[0]?.min_req_no}
            </Tag> */}
            <InfoTags text={"Requisition : "+data?.reqInfo[0]?.min_req_no} bgCol={"text-sm"} color="#014737"/>
          </div>

          <div class="relative overflow-x-auto shadow-md sm:rounded-lg my-4 mb-6">
            <table className="w-full border-separate border  border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400 sm:col-span-12">
              <tbody>
                <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <th
                    scope="row"
                    class="px-6 py-4 bg-[#C4F1BE] font-bold uppercase text-green-900 whitespace-nowrap dark:text-white w-1/4"
                  >
                    Date
                  </th>
                  <td class="px-6 py-4  w-3/4 bg-gray-200 font-medium">
                    {formatDate(data?.reqInfo[0]?.req_date)}
                  </td>
                </tr>
                <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <th
                    scope="row"
                    class="px-6 py-4 bg-[#C4F1BE] font-bold uppercase text-green-900 whitespace-nowrap dark:text-white w-1/4"
                  >
                    Intended for
                  </th>
                  <td class="px-6 py-4  w-3/4 bg-gray-200 font-medium">
                    {data?.reqInfo[0]?.intended_for == "C"
                      ? "Project"
                      : "Warehouse"}
                  </td>
                </tr>

                {/* {data?.reqInfo[0]?.intended_for != "C" && (
                  <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th
                      scope="row"
                      class="px-6 py-4 bg-[#C4F1BE] font-bold uppercase text-green-900 whitespace-nowrap dark:text-white  w-1/4"
                    >
                      Client
                    </th>
                    <td class="px-6 py-4  w-3/4 bg-gray-200 font-medium">
                      {data?.client_name}
                    </td>
                  </tr>
                )} */}
                {data?.reqInfo[0]?.intended_for == "C" && (
                  <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <td class="px-6 py-4 bg-[#C4F1BE] font-bold uppercase text-green-900 whitespace-nowrap dark:text-white  w-1/4">
                      Project
                    </td>
                    <td class="px-6 py-4  w-3/4 bg-gray-200 font-medium">
                      {data?.project_name}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className=" w-full">
            <TDInputTemplate
              placeholder={"Choose status"}
              type="text"
              label={"Status"}
              name={"status"}
              formControlName={status}
              handleChange={(val) => {
                setStatus(val.target.value);
              }}
              mode={2}
              data={[
                { name: "Partial Approval", code: "H" },
                { name: "Full Approval", code: "A" },
              ]}
            />
          </div>
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full border-separate border border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400 sm:col-span-12">
              <thead className="text-xs bg-[#C4F1BE] font-bold uppercase text-green-900 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3 font-bold text-nowrap">
                    Item
                  </th>

                  <th scope="col" class="px-6 py-3 font-bold text-nowrap">
                    Received quantity
                  </th>

                  <th scope="col" class="px-6 py-3 font-bold text-nowrap">
                    Requisition quantity
                  </th>
                  <th scope="col" class="px-6 py-3 font-bold text-nowrap">
                    Quantity approved
                  </th>
                  <th scope="col" class="px-6 py-3 font-bold text-nowrap">
                    Quantity cancelled
                  </th>
                  <th scope="col" class="px-6 py-3 font-bold text-nowrap">
                    Quantity to approve
                  </th>
                </tr>
              </thead>
              <tbody>
                {itemInfo?.length > 0 &&
                  itemInfo?.map((item, index) => (
                <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.prod_name}
                        <p className="text-green-900">
                          {" "}
                          Part No.: {item.part_no} , Article No.:{" "}
                          {item.article_no} , Model No.: {item.model_no}{" "}
                        </p>
                      </th>
                      <td class="px-6 py-4">{item.rc_qty}</td>
                      <td class="px-6 py-4">{item.req_qty} </td>
                      <td class="px-6 py-4">{item.approved_qty} </td>
                      <td class="px-6 py-4">{item.cancelled_qty} </td>
                      <td class="px-6 py-4">
                        <TDInputTemplate
                          placeholder={"Quantity"}
                          type="number"
                          label={""}
                          name={"balance"}
                          formControlName={+item.balance}
                          disabled={status != "H"}
                          handleChange={(val) => {
                            handleDtChange(index, val);
                          }}
                          mode={1}
                          data={[
                            { name: "Partial Approval", code: "PA" },
                            { name: "Full Approval", code: "A" },
                          ]}
                        />
                        {item.balance > item.balance_copy && (
                          <VError title={"Invalid Value"} />
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* <div className="flex justify-center my-4">
            {data?.reqInfo[0]?.approve_flag == "R" && (
              <Alert message={data?.reqInfo[0]?.reason} type="error" />
            )}
          </div> */}
          {/* {data?.reqInfo[0]?.approve_flag == "P" 


 && ( */}
          <div className="flex justify-center gap-5">
            {/* <Popconfirm
                zIndex={5000}
                title="Reject the Requisition?"
                description={
                  <TDInputTemplate
                    placeholder="Rejection note"
                    type="text"
                    // label="Rejection Note"
                    name="rej_note"
                    formControlName={rej_note}
                    handleChange={(txt) => {
                      setRejNote(txt.target.value);

                      //   setCode(0)
                    }}
                    mode={1}
                  />
                }
                icon={<QuestionCircleOutlined style={{ color: "white" }} />}
                onConfirm={() => onPress("R", rej_note,itemInfo)}
              >
                <button
                  type="submit"
                  className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                  // onClick={()=>onPress('U')}
                  disabled = {
                    
                    itemInfo?.reduce((accumulator, currentValue) => {
                      return accumulator + currentValue.error;
                    }, 0)==1 || +(itemInfo?.filter(e=>e.req_qty==e.approved_qty)?.length==itemInfo?.length)==1
                  }
                >
                  <CloseCircleOutlined className="mr-2" />
                  Reject
                </button>
              </Popconfirm> */}
            {/* <button
              type="submit"
              onClick={() => onPress("R", "", itemInfo)}
              className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
              disabled={itemInfo?.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.approved_qty;
                  }, 0) > 0 ||  itemInfo?.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.cancelled_qty;
                  }, 0) >0}
             
            >
              <span class="relative z-10">
              <CloseCircleOutlined className="mr-2" />
              Reject
              </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>

            </button> */}
            <BtnGroupReuse onClick={() => onPress("R", "", itemInfo)}  disabled={itemInfo?.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.approved_qty;
                  }, 0) > 0 ||  itemInfo?.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.cancelled_qty;
                  }, 0) >0} icon={<CloseCircleOutlined className="mr-2" />} flag={2} text="Reject"/>
            {det?.requisition != 1 && (
        //       <button
        //         type="submit"
        //                 className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"

        //         onClick={() => onPress("A", "", itemInfo)}
        //         disabled={
        //           itemInfo?.reduce((accumulator, currentValue) => {
        //             return accumulator + currentValue.approved_qty;
        //           }, 0) > 0 ||  itemInfo?.reduce((accumulator, currentValue) => {
        //             return accumulator + currentValue.cancelled_qty;
        //           }, 0) >0 ||
        //           +(
        //             itemInfo?.filter((e) => e.req_qty == e.approved_qty)
        //               ?.length == itemInfo?.length
        //           ) == 1 
        //         }
        //       >
        // <span class="relative z-10">

        //         <CheckCircleOutlined className="mr-2" />
        //         Approve
        //          </span>
        // <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
        //       </button>
              <BtnGroupReuse text="Approve" onClick={() => onPress("A", "", itemInfo)}
                disabled={
                  itemInfo?.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.approved_qty;
                  }, 0) > 0 ||  itemInfo?.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.cancelled_qty;
                  }, 0) >0 ||
                  +(
                    itemInfo?.filter((e) => e.req_qty == e.approved_qty)
                      ?.length == itemInfo?.length
                  ) == 1 
                } icon={<CheckCircleOutlined className="mr-2" />} flag={1}/>
            )}
          </div>
          {/* )} */}
        </>
      )}

      {flag == 28 && (
        <>
          <div className="flex gap-3 my-5">
            {data?.labels?.val_one && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_one}
              />
            )}
            {data?.labels?.val_two && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_two}
              />
            )}
            {data?.labels?.val_three && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_three}
              />
            )}
            {data?.labels?.val_four && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_four}
              />
            )}
            {data?.labels?.val_five && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_five}
              />
            )}
            {data?.labels?.val_six && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_six}
              />
            )}
            {data?.labels?.val_seven && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_seven}
              />
            )}
            {data?.labels?.val_eight && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_eight}
              />
            )}
          </div>
          {data?.list?.length > 0 ? (
            <ul class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              {data?.list?.map((lst) => (
                <li
                  onClick={() => onVisit(lst)}
                  class="pb-3 p-2 sm:pb-4 cursor-pointer hover:bg-gray-200"
                >
                  <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    {/* <div class="flex-shrink-0">
            <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
         </div> */}
                    <div class="flex-1 min-w-0">
                      <p class="text-lg font-bold text-green-900  truncate dark:text-white">
                        {lst.mrn_no}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        Vendor:{" "}
                        <span
                          className={
                            lst.vendor_name == data?.labels?.val_one
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.vendor_name}{" "}
                        </span>
                        , Project:{" "}
                        <span
                          className={
                            lst.proj_name == data?.labels?.val_two
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {" "}
                          {lst.proj_name}
                        </span>
                        , Part No.:{" "}
                        <span
                          className={
                            lst.part_no == data?.labels?.val_three
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.part_no}{" "}
                        </span>
                        , Item:{" "}
                        <span
                          className={
                            lst.prod_name == data?.labels?.val_four
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_name}
                        </span>
                        , Invoice:{" "}
                        <span
                          className={
                            lst.invoice == data?.labels?.val_seven
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.invoice}
                        </span>
                        , Make:{" "}
                        <span
                          className={
                            lst.prod_make == data?.labels?.val_eight
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_make}
                        </span>
                        , Invoice Date:{" "}
                        <span
                          className={
                            lst.invoice_dt <= data?.labels?.val_six &&
                            lst.invoice_dt >= data?.labels?.val_five
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {formatDate(lst.invoice_dt)}
                        </span>
                      </p>
                    </div>
                    {/* <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
            {lst.approve_flag=='A'?<CheckCircleFilled className="text-green-900" />:lst.approve_flag=='U'?<CloseCircleFilled className='text-red-900'/>:<ClockCircleFilled className='text-amber-500'/>}
         </div> */}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty />
          )}
        </>
      )}
      {flag == 29 && (
        <>
          <div className="flex gap-3 my-5">
            {data?.labels?.val_one && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_one}
              />
            )}
            {data?.labels?.val_two && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_two}
              />
            )}
            {data?.labels?.val_three && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_three}
              />
            )}
            {data?.labels?.val_four && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_four}
              />
            )}
            {data?.labels?.val_five && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_five}
              />
            )}
            {data?.labels?.val_six && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_six}
              />
            )}
            {data?.labels?.val_eight && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_eight}
              />
            )}
          </div>
          {data?.list?.length > 0 ? (
            <ul class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              {data?.list?.map((lst) => (
                <li
                  onClick={() => {
                    onVisit(lst);
                  }}
                  class="pb-3 p-2 sm:pb-4 cursor-pointer hover:bg-gray-200"
                >
                  <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    {/* <div class="flex-shrink-0">
            <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
         </div> */}
                    <div class="flex-1 min-w-0">
                      <p class="text-lg font-bold text-green-900  truncate dark:text-white">
                        {lst.req_no}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        Vendor:{" "}
                        <span
                          className={
                            lst.vendor_name == data?.labels?.val_one
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.vendor_name}{" "}
                        </span>
                        , Project:{" "}
                        <span
                          className={
                            lst.proj_name == data?.labels?.val_two
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {" "}
                          {lst.proj_name}
                        </span>
                        , Part No.:{" "}
                        <span
                          className={
                            lst.part_no == data?.labels?.val_three
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.part_no}{" "}
                        </span>
                        , Item:{" "}
                        <span
                          className={
                            lst.prod_name == data?.labels?.val_four
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_name}
                        </span>
                        , Make:{" "}
                        <span
                          className={
                            lst.prod_make == data?.labels?.val_eight
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_make}
                        </span>
                        , Issued:{" "}
                        <span
                          className={
                            lst.req_date <= data?.labels?.val_six &&
                            lst.req_date >= data?.labels?.val_five
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {formatDate(lst.req_date)}
                        </span>
                      </p>
                    </div>
                    <Tooltip
                      title={
                        lst.po_status == "A"
                          ? "Approved"
                          : lst.po_status == "U"
                          ? "Pending approval"
                          : "In progress"
                      }
                    >
                      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        {lst.approve_flag == "A" ? (
                          <CheckCircleFilled className="text-green-900" />
                        ) : lst.approve_flag == "U" ? (
                          <ClockCircleFilled className="text-amber-500" />
                        ) : (
                          <FileTextOutlined className="text-blue-500" />
                        )}
                      </div>
                    </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty />
          )}
        </>
      )}

      {flag == 30 && (
        <>
          {waiting}
          <div className="flex gap-3 my-5">
            {data?.labels?.val_one && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_one}
              />
            )}
            {data?.labels?.val_two && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_two}
              />
            )}
            {data?.labels?.val_three && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_three}
              />
            )}
            {data?.labels?.val_four && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_four}
              />
            )}
            {data?.labels?.val_five && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_five}
              />
            )}
            {data?.labels?.val_six && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_six}
              />
            )}
            {data?.labels?.val_eight && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_eight}
              />
            )}
            {data?.labels?.val_nine && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_nine}
              />
            )}
          </div>
          {data?.list?.length > 0 ? (
            <ul class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              {data?.list?.map((lst) => (
                <li
                  onClick={() => {
                    onVisit(lst);
                  }}
                  class="pb-3 p-2 sm:pb-4 cursor-pointer hover:bg-gray-200"
                >
                  <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    {/* <div class="flex-shrink-0">
            <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
         </div> */}
                    <div class="flex-1 min-w-0">
                      <p class="text-lg font-bold text-green-900  truncate dark:text-white">
                        {lst.proj_name}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        Project Manager:{" "}
                        <span
                          className={
                            lst.user_name == data?.labels?.val_one
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.user_name}{" "}
                        </span>
                        {/* , Project:{" "}
                        <span
                          className={
                            lst.client_name == data?.labels?.val_two
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {" "}
                          {lst.proj_name}
                        </span> */}
                        , Order Value:{" "}
                        <span
                          className={
                            lst.proj_order_val >= data?.labels?.val_three &&
                            lst.proj_order_val <= data?.labels?.val_four
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.proj_order_val}{" "}
                        </span>
                        , Order Date:{" "}
                        <span
                          className={
                            lst.order_date >= data?.labels?.val_eight &&
                            lst.order_date <= data?.labels?.val_nine
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {formatDate(lst.order_date)}{" "}
                        </span>
                        , Delivery Date:{" "}
                        <span
                          className={
                            lst.proj_delivery_date >= data?.labels?.val_five &&
                            lst.proj_delivery_date <= data?.labels?.val_six
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {formatDate(lst.proj_delivery_date)}{" "}
                        </span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty />
          )}
        </>
      )}
      {flag == 31 && (
        <p className="mt-2">
          This item already has an unapproved requisition...
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-white uppercase bg-green-900 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3  text-nowrap">
                    Transaction No.
                  </th>
                  <th scope="col" class="px-6 py-3  text-nowrap">
                    Quantity
                  </th>
                  <th scope="col" class="px-6 py-3  text-nowrap">
                    Requisition Date
                  </th>
                  <th scope="col" class="px-6 py-3 text-nowrap">
                    Requisition By
                  </th>
                  <th scope="col" class="px-6 py-3 text-nowrap">
                    From
                  </th>
                  <th scope="col" class="px-6 py-3 text-nowrap">
                    To
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 &&
                  data?.map((item) => (
                    <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.trans_no}
                      </th>
                      <th
                        scope="row"
                        class="px-6 py-4  text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.qty}
                      </th>

                      <td class="px-6 py-4  text-nowrap">{formatDate(item.trans_dt)}</td>
                      <th
                        scope="row"
                        class="px-6 py-4  text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.req_by}
                      </th>
                      <th
                        scope="row"
                        class="px-6 py-4  text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.from_proj || "Warehouse"}
                      </th>
                      <th
                        scope="row"
                        class="px-6 py-4  text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.to_proj}
                      </th>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center">
            {/* <button
              type="reset"
              onClick={onPress}
                    className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"

            >
             <span class="relative z-10">
                 <CloseOutlined className='mr-2'/> 
                     Close
                     </span>
                     <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button> */}
            <BtnGroupReuse onClick={onPress} flag={2} text="Close" icon={<CloseOutlined className='mr-2'/> }/>
          </div>
        </p>
      )}

      {flag == 32 && (
        <p className="mt-2">
          <div className="sm:col-span-12 flex justify-end mb-2 ">
            {/* <Tag className="text-sm bg-green-900 text-white">
              Transfer No. : {data?.trans_no}
            </Tag> */}
            <InfoTags text={"Transfer No. : "+data?.trans_no} bgCol={"text-sm bg-green-900 text-white"}/>
          </div>
          <div className="sm:col-span-12 flex justify-center gap-2 items-center my-6 ">
            <span>
              {" "}
              <Tag className="text-sm bg-green-500 text-white">
                {data?.from_proj_name || "Warehouse"}{" "}
                {data?.from_proj_name ? "(ID: " + data?.from_projid + ")" : ""}
              </Tag>
              {/* <InfoTags text={data?.from_proj_name || "Warehouse"+' '+} */}
            </span>

            <span>
              <ForwardFilled />
            </span>
            <span>
              {" "}
              <Tag className="text-sm bg-amber-500 text-white">
                {data?.to_proj_name || "Warehouse"}{" "}
                {data?.to_proj_name ? "(ID: " + data?.to_projid + ")" : ""}
              </Tag>
            </span>
          </div>
          <div className=" w-full mb-1">
            <TDInputTemplate
              placeholder={"Choose status"}
              type="text"
              label={"Status"}
              name={"status"}
              formControlName={status}
              handleChange={(val) => {
                setStatus(val.target.value);
              }}
              mode={2}
              data={[
                { name: "Partial Approval", code: "H" },
                { name: "Full Approval", code: "A" },
              ]}
            />
          </div>
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-white uppercase bg-green-900 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3  text-nowrap">
                    Item
                  </th>
                  <th scope="col" class="px-6 py-3  text-nowrap">
                    Req. quantity
                  </th>
                  <th scope="col" class="px-6 py-3  text-nowrap">
                    Req. date
                  </th>

                  <th scope="col" class="px-6 py-3 text-nowrap">
                    Requisition By
                  </th>
                  <th scope="col" class="px-6 py-3 text-nowrap">
                    Approved Quantity
                  </th>
                  <th scope="col" class="px-6 py-3 text-nowrap">
                    Quantity to approve
                  </th>
                  <th scope="col" class="px-6 py-3 text-nowrap">
                    Approved By
                  </th>
                  <th scope="col" class="px-6 py-3  text-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {itemInfo?.length > 0 &&
                  itemInfo?.map((item, index) => (
                    <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.prod_name}
                      </th>
                      <th
                        scope="row"
                        class="px-6 py-4  text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.req_qty}
                      </th>

                      <th
                        scope="row"
                        class="px-6 py-4  text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {formatDate(item.created_at)}
                      </th>

                      <th
                        scope="row"
                        class="px-6 py-4  text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.req_by}
                      </th>
                      <th
                        scope="row"
                        class="text-center text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.approved_qty}

                        {/* {infoCopy[index]["check"] == false ? (
                          <Checkbox
                            onChange={(e) =>
                              onChangeApproval(item.sl_no, index, e)
                            }
                          ></Checkbox>
                        ) : (
                          <CheckCircleFilled className="text-green-500 text-lg" />
                        )} */}
                      </th>
                      <th
                        scope="row"
                        class="text-center text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <TDInputTemplate
                          placeholder={"Quantity to approve"}
                          type="number"
                          // label={"Status"}
                          name={"qty"}
                          formControlName={+item.qty}
                          disabled={status != "H"}
                          handleChange={(val) => {
                            handleTransChange(index, val);
                          }}
                          mode={1}
                        />
                        {item.qty > item.balance_copy && (
                          <VError title={"Invalid Value"} />
                        )}
                        {/* {infoCopy[index]["check"] == false ? (
                          <Checkbox
                            onChange={(e) =>
                              onChangeApproval(item.sl_no, index, e)
                            }
                          ></Checkbox>
                        ) : (
                          <CheckCircleFilled className="text-green-500 text-lg" />
                        )} */}
                      </th>
                      <th
                        scope="row"
                        class="px-6 py-4  text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.approved_by}
                      </th>
                      <td class="px-6 py-4  text-nowrap">
                        {item.approve_flag == "P"
                          ? "Pending"
                          : item.approve_flag == "A"
                          ? "Approved"
                          : "Rejected"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {det?.stock != 1 && (
            <div className="flex justify-center gap-3">
             {status!='H' && status!='A' && 
            //  <button
            //     type="reset"
            //     onClick={() => onApprove("R", infoCopy)}
            //     disabled={
            //        itemInfo?.reduce((accumulator, currentValue) => {
            //         return accumulator + currentValue.approved_qty;
            //       }, 0) > 0
            //     }
            //           className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"

            //   >
            //     <span class="relative z-10">
            //         <CloseOutlined className='mr-2'/> 
            //             Reject
            //             </span>
            //             <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
            //   </button>
              <BtnGroupReuse onClick={() => onApprove("R", infoCopy)} disabled={
                   itemInfo?.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.approved_qty;
                  }, 0) > 0
                } icon={<CloseOutlined className='mr-2'/> } flag={2} text="Reject"/>
}

             {/* <button
                type="reset"
                onClick={() => onApprove("A", infoCopy)}
                disabled={
                  itemInfo?.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.error;
                  }, 0) == 1 ||  itemInfo?.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.approved_qty;
                  }, 0) > 0
                }
                        className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"

              >
                 <span class="relative z-10">
        <CheckOutlined className='mr-2' />
                Approve
                 </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
              </button> */}
              <BtnGroupReuse flag={1}  onClick={() => onApprove("A", infoCopy)}
                disabled={
                  itemInfo?.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.error;
                  }, 0) == 1 ||  itemInfo?.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.approved_qty;
                  }, 0) > 0
                } icon={<CheckOutlined className='mr-2' />} text="Approve" />
            </div>
          )}
        </p>
      )}
      {flag == 33 && (
        <>
          <div className="flex gap-3 my-5">
            {data?.labels?.val_one && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_one}
              />
            )}
            {data?.labels?.val_two && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_two}
              />
            )}
            {data?.labels?.val_three && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_three}
              />
            )}
            {data?.labels?.val_four && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_four}
              />
            )}
            {data?.labels?.val_five && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_five}
              />
            )}
            {data?.labels?.val_six && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_six}
              />
            )}
            {data?.labels?.val_seven && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_seven}
              />
            )}
            {data?.labels?.val_eight && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_eight}
              />
            )}
          </div>
          {data?.list?.length > 0 ? (
            <ul class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              {data?.list?.map((lst) => (
                <li
                  onClick={() => {
                    navigate(
                      mode == "W"
                        ? routePaths.STOCKTRANSFORM + lst.sl_no
                        : mode == "P"
                        ? routePaths.STOCKTRANSFORMPROJ + lst.sl_no
                        : ""
                    );
                    if (mode == "A") onCloseApprove(lst);
                  }}
                  class="pb-3 p-2 sm:pb-4 cursor-pointer hover:bg-gray-200"
                >
                  <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    {/* <div class="flex-shrink-0">
            <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
         </div> */}
                    <div class="flex-1 min-w-0">
                      <p class="text-lg font-bold text-green-900  truncate dark:text-white">
                        {lst.trans_no}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        From:{" "}
                        <span
                          className={
                            lst.from_proj_id == data?.labels?.val_one
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.from_proj_name || "Warehouse"}{" "}
                        </span>
                        , Project:{" "}
                        <span
                          className={
                            lst.to_proj_id == data?.labels?.val_two
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {" "}
                          {lst.to_proj_name}
                        </span>
                        , Part No.:{" "}
                        <span
                          className={
                            lst.part_no == data?.labels?.val_three
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.part_no}{" "}
                        </span>
                        , Item:{" "}
                        <span
                          className={
                            lst.prod_name == data?.labels?.val_four
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_name}
                        </span>
                        , Make:{" "}
                        <span
                          className={
                            lst.prod_make == data?.labels?.val_eight
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_make}
                        </span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty />
          )}
        </>
      )}

      {flag == 34 && (
        <p className="mt-2">
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-white uppercase bg-green-900 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3  text-nowrap">
                    Requisition No.
                  </th>
                  <th scope="col" class="px-6 py-3  text-nowrap">
                    Quantity
                  </th>
                  <th scope="col" class="px-6 py-3  text-nowrap">
                    Purpose
                  </th>
                  <th scope="col" class="px-6 py-3 text-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 &&
                  data?.map((item) => (
                    <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.req_no}
                      </th>
                      <th
                        scope="row"
                        class="px-6 py-4  text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.req_qty}
                      </th>

                      <td class="px-6 py-4  text-nowrap">{item.purpose}</td>
                      <th
                        scope="row"
                        class="px-6 py-4  text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.approve_flag == "A"
                          ? "Approved"
                          : item.approve_flag == "P"
                          ? "Pending"
                          : "Rejected"}
                      </th>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center">
            {/* <button
              type="reset"
              onClick={onPress}
                    className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"

            >
               <span class="relative z-10">
                  <CloseOutlined className='mr-2'/> 
              Close
               </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button> */}
            <BtnGroupReuse  onClick={onPress} flag={2} text="Close" icon={<CloseOutlined className='mr-2'/> }/>
          </div>
        </p>
      )}

      {flag == 35 && (
        <>
          <div className="sm:col-span-12 flex justify-end mb-2 ">
            {/* <Tag className="text-sm" color="#014737">
              Requisition : {data?.reqInfo[0]?.min_req_no}
            </Tag> */}
            <InfoTags text={"Requisition : " + data?.reqInfo[0]?.min_req_no} bgCol={"text-sm"} color="#014737"/> 
          </div>
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
            <table className="w-full border-separate border border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400 sm:col-span-12">
              <tbody>
                <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <th
                    scope="row"
                    class="px-6 py-4 bg-[#C4F1BE] font-bold uppercase text-green-900 whitespace-nowrap dark:text-white w-1/4"
                  >
                    Date
                  </th>
                  <td class="px-6 py-4  w-3/4 bg-gray-200 font-medium">
                    {formatDate(data?.reqInfo[0]?.req_date)}
                  </td>
                </tr>
                <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <th
                    scope="row"
                    class="px-6 py-4 bg-[#C4F1BE] font-bold uppercase text-green-900 whitespace-nowrap dark:text-white w-1/4"
                  >
                    Intended for
                  </th>
                  <td class="px-6 py-4  w-3/4 bg-gray-200 font-medium">
                    {data?.reqInfo[0]?.intended_for == "C"
                      ? "Project"
                      : "Warehouse"}
                  </td>
                </tr>

                {/* {data?.reqInfo[0]?.intended_for != "C" && (
                  <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th
                      scope="row"
                      class="px-6 py-4 bg-[#C4F1BE] font-bold uppercase text-green-900 whitespace-nowrap dark:text-white  w-1/4"
                    >
                      Client
                    </th>
                    <td class="px-6 py-4  w-3/4 bg-gray-200 font-medium">
                      {data?.client_name}
                    </td>
                  </tr>
                )} */}
                {data?.reqInfo[0]?.intended_for == "C" && (
                  <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <td class="px-6 py-4 bg-[#C4F1BE] font-bold uppercase text-green-900 whitespace-nowrap dark:text-white  w-1/4">
                      Project
                    </td>
                    <td class="px-6 py-4  w-3/4 bg-gray-200 font-medium">
                      {data?.project_name}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className=" w-full my-4">
            <TDInputTemplate
              placeholder={"Choose status"}
              type="text"
              label={"Status"}
              name={"status"}
              formControlName={status}
              handleChange={(val) => {
                setStatus(val.target.value);
              }}
              mode={2}
              data={[
                { name: "Partial Cancellation", code: "H" },
                { name: "Full Cancellation", code: "A" },
              ]}
            />
          </div>
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
            <table className="w-full border-separate border border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400 sm:col-span-12">
              <thead className="text-xs bg-[#C4F1BE] font-bold uppercase text-green-900 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3 font-bold text-nowrap">
                    Item
                  </th>

                  <th scope="col" class="px-6 py-3 font-bold text-nowrap">
                    Received quantity
                  </th>

                  <th scope="col" class="px-6 py-3 font-bold text-nowrap">
                    Requisition quantity
                  </th>
                  <th scope="col" class="px-6 py-3 font-bold text-nowrap">
                    Quantity approved
                  </th>
                  <th scope="col" class="px-6 py-3 font-bold text-nowrap">
                    Quantity cancelled
                  </th>
                  <th scope="col" class="px-6 py-3 font-bold text-nowrap">
                    Quantity to be cancelled
                  </th>
                </tr>
              </thead>
              <tbody>
                {itemInfo?.length > 0 &&
                  itemInfo?.map((item, index) => (
                    <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.prod_name}
                        <p className="text-green-900">
                          {" "}
                          Part No.: {item.part_no} , Article No.:{" "}
                          {item.article_no} , Model No.: {item.model_no}{" "}
                        </p>
                      </th>
                      <td class="px-6 py-4">{item.rc_qty}</td>
                      <td class="px-6 py-4">{item.req_qty} </td>
                      <td class="px-6 py-4">{item.approved_qty} </td>
                      <td class="px-6 py-4">{item.cancelled_qty} </td>
                      <td class="px-6 py-4">
                        <TDInputTemplate
                          placeholder={"Quantity"}
                          type="number"
                          label={""}
                          name={"balance"}
                          formControlName={+item.balance}
                          disabled={status != "H"}
                          handleChange={(val) => {
                            handleDtCancelChange(index, val);
                          }}
                          mode={1}
                        />
                        {item.balance > item.balance_copy && (
                          <VError title={"Invalid Value"} />
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center my-4">
            {data?.reqInfo[0]?.approve_flag == "R" && (
              <Alert message={data?.reqInfo[0]?.reason} type="error" />
            )}
          </div>
          {/* {data?.reqInfo[0]?.approve_flag == "P" 


 && ( */}
          <div className="flex justify-center gap-5">
            {/* <Popconfirm
                zIndex={5000}
                title="Reject the Requisition?"
                description={
                  <TDInputTemplate
                    placeholder="Rejection note"
                    type="text"
                    // label="Rejection Note"
                    name="rej_note"
                    formControlName={rej_note}
                    handleChange={(txt) => {
                      setRejNote(txt.target.value);

                      //   setCode(0)
                    }}
                    mode={1}
                  />
                }
                icon={<QuestionCircleOutlined style={{ color: "white" }} />}
                onConfirm={() => onPress("R", rej_note,itemInfo)}
              >
                <button
                  type="submit"
                  className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
                  // onClick={()=>onPress('U')}
                  disabled = {
                    
                    itemInfo.reduce((accumulator, currentValue) => {
                      return accumulator + currentValue.error;
                    }, 0)==1
                  }
                >
                  <CloseCircleOutlined className="mr-2" />
                  Reject
                </button>
              </Popconfirm> */}
            {det?.requisition != 1 && (
        //       <button
        //         type="submit"
        //               className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"

        //         onClick={() => onPress("R", "", itemInfo)}
        //         disabled={
        //           itemInfo?.reduce((accumulator, currentValue) => {
        //             return accumulator + currentValue.error;
        //           }, 0) == 1
        //         }
        //       >
        //          <span class="relative z-10">
        //         <CloseCircleOutlined className="mr-2" />
        //         Cancel
        //         </span>
        // <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
        //       </button>
              <BtnGroupReuse  onClick={() => onPress("R", "", itemInfo)}
                disabled={
                  itemInfo?.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.error;
                  }, 0) == 1
                } icon={<CloseCircleOutlined className="mr-2" />} flag={2} text="Cancel"/>
            )}
          </div>
          {/* )} */}
        </>
      )}

      {flag == 36 && (
        <div>
          <div className="flex justify-end my-2">
            <Tooltip title="Print this table">
              <Fab
                color="success"
                size="small"
                aria-label="add"
                onClick={() => {
                  setIsPrinting(false);
                  setTimeout(() => {
                    reactToPrintFn();
                    setIsPrinting(true);
                  }, 5);
                }}
              >
                <PrinterOutlined />
              </Fab>
            </Tooltip>
          </div>
          <div
            ref={contentRef}
            className={
              !isPrinting
                ? "relative mt-2 p-2 overflow-x-auto shadow-md sm:rounded-lg"
                : "relative overflow-x-auto shadow-md sm:rounded-lg"
            }
          >
            <div
              style={{
                display: !isPrinting ? "block" : "none",
              }}
            >
              <PrintHeader />
            </div>
            {/* </div> */}
            <div className="sm:col-span-12 flex justify-end mb-2 ">
              {/* <Tag className="text-sm bg-green-900 text-white">
                Delivery No. : {data?.del_no}
              </Tag> */}
              <InfoTags text={"Delivery No. : "+data?.del_no} bgCol={"text-sm bg-green-900 text-white"}/>
            </div>
            <table className="w-full border-separate border border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400 sm:col-span-12">
              <thead className="text-xs bg-[#C4F1BE] font-bold uppercase text-green-900 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 w-1/4 font-bold">
                    Invoice No. <span className="text-xs text-red-600">*</span>
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/4 font-bold">
                    Invoice Date <span className="text-xs text-red-600">*</span>
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/4 font-bold">
                    LR No.
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/4 font-bold">
                    Waybill
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#DDEAE0]  border-b-2 border-white my-3 font-bold dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-4 w-1/4 py-4  text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <TDInputTemplate
                      placeholder="Invoice No."
                      type="text"
                      name="invoice"
                      formControlName={data?.invoice}
                      disabled={true}
                      mode={1}
                    />
                  </th>
                  <td className="px-6 py-4 w-1/4">
                    <TDInputTemplate
                      placeholder="Invoice Date"
                      type="date"
                      name="inv_dt"
                      formControlName={data?.invoice_dt}
                      disabled={true} //may need to change
                      mode={1}
                    />
                  </td>
                  <td className="px-6 py-4 w-1/4">
                    <TDInputTemplate
                      placeholder="LR No."
                      type="text"
                      name="lr_no"
                      formControlName={data?.lr_no}
                      disabled={true}
                      mode={1}
                    />
                  </td>
                  <td className="px-6 py-4 w-1/4">
                    <TDInputTemplate
                      placeholder="Waybill"
                      type="text"
                      name="waybill"
                      formControlName={data?.waybill}
                      disabled={true}
                      mode={1}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div
              style={{ width: "100%" }}
              className="border-2 bg-[#DDEAE0] rounded-b-lg p-3   sm:col-span-12 border-gray-300"
            >
              <Row>
                <Col span={8}>
                  <Checkbox
                    checked={data?.ic == "Y" ? true : false}
                    name="ic"
                    disabled={true}
                  >
                    Insurance Certificate
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.og == "Y" ? true : false}
                    name="og"
                    disabled={true}
                  >
                    Original Copy
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.dc == "Y" ? true : false}
                    name="dc"
                    disabled={true}
                  >
                    Duplicate Copy
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.lr == "Y" ? true : false}
                    name="lr"
                    disabled={true}
                  >
                    LR
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.wb == "Y" ? true : false}
                    name="wb"
                    disabled={true}
                  >
                    Waybill
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.pl == "Y" ? true : false}
                    name="pl"
                    disabled={true}
                  >
                    Packing List
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.om == "Y" ? true : false}
                    name="om"
                    disabled={true}
                  >
                    Operation and Maintenance
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.om_manual == "Y" ? true : false}
                    name="om_manual"
                    disabled={true}
                  >
                    O&M Manual
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.ws == "Y" ? true : false}
                    name="ws"
                    disabled={true}
                  >
                    Weighing Slip
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.tc == "Y" ? true : false}
                    name="tc"
                    disabled={true}
                  >
                    TC
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    checked={data?.wc == "Y" ? true : false}
                    name="wc"
                    disabled={true}
                  >
                    Warranty Certificate
                  </Checkbox>
                </Col>
                {/* <Col span={8}>
                <Checkbox
                  checked={data?.ot == "Y" ? true : false}
                  name="ot"
                  disabled={true}
                >
                  Others
                </Checkbox>
              </Col> */}
              </Row>
              {data?.fileList?.length > 0 && (
                <div className="relative">
                  <a
                    target="_blank"
                    href={url + "/uploads/" + data?.fileList[0]?.vtoc_img}
                  >
                    {data?.fileList[0]?.vtoc_img.split(".")[1] == "pdf" ? (
                      <FilePdfOutlined className="text-6xl my-7 text-red-600" />
                    ) : data?.fileList[0]?.vtoc_img
                        .split(".")[1]
                        ?.includes("doc") ? (
                      <FileWordOutlined className="text-6xl my-7 text-blue-900" />
                    ) : data?.fileList[0]?.vtoc_img
                        .split(".")[1]
                        ?.includes("xls") ||
                      data?.fileList[0]?.vtoc_img
                        .split(".")[1]
                        ?.includes("csv") ? (
                      <FileExcelOutlined className="text-6xl my-7 text-green-800" />
                    ) : data?.fileList[0]?.vtoc_img
                        .split(".")[1]
                        ?.includes("png") ||
                      data?.fileList[0]?.vtoc_img
                        .split(".")[1]
                        ?.includes("jpg") ||
                      data?.fileList[0]?.vtoc_img
                        .split(".")[1]
                        ?.includes("jpeg") ? (
                      <FileImageOutlined className="text-6xl my-7 text-yellow-500" />
                    ) : (
                      <FileTextOutlined className="text-6xl my-7 text-gray-600" />
                    )}
                  </a>
                </div>
              )}
            </div>

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
              <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-white uppercase bg-green-900 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3  text-nowrap">
                      Item
                    </th>
                    <th scope="col" class="px-6 py-3  text-nowrap">
                      Received Quantity
                    </th>
                    <th scope="col" class="px-6 py-3  text-nowrap">
                      Received On
                    </th>

                    <th scope="col" class="px-6 py-3 text-nowrap">
                      Received By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {itemInfo?.length > 0 &&
                  itemInfo?.map((item, index) => ( */}
                  <tr class="odd:bg-white text-xs odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th
                      scope="row"
                      class="px-6 py-4 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {data.prod_name}
                    </th>
                    <th
                      scope="row"
                      class="px-6 py-4  text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {data.mrn_qty}
                    </th>

                    <th
                      scope="row"
                      class="px-6 py-4  text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {formatDate(data.del_date)}
                    </th>

                    <th
                      scope="row"
                      class="px-6 py-4  text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {data.rec_by}
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* {det.stock != 1 && (
            <div className="flex justify-center gap-3">
              <button
                type="reset"
                onClick={onPress}
                className="inline-flex mr-3 bg-[#92140C] items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white border border-[#92140C] bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
              >
                Close
              </button>

              <button
                type="reset"
                onClick={() => onApprove("R", infoCopy)}
                disabled={
                  itemInfo?.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.error;
                  }, 0) == 1
                }
                className="inline-flex mr-3 bg-green-900 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white border border-green-900 bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
              >
                Cancel
              </button>
            </div>
          )} */}
        </div>
      )}
      {flag == 37 && (
        <>
          <div className="flex gap-3 my-5">
            {data?.labels?.val_one && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_one}
              />
            )}
            {data?.labels?.val_two && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_two}
              />
            )}
            {data?.labels?.val_three && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_three}
              />
            )}
            {data?.labels?.val_four && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_four}
              />
            )}
            {data?.labels?.val_five && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_five}
              />
            )}
            {data?.labels?.val_six && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_six}
              />
            )}
            {data?.labels?.val_eight && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_eight}
              />
            )}
          </div>
          {data?.list?.length > 0 ? (
            <ul class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              {data?.list?.map((lst) => (
                <li
                  onClick={() => {
                    navigate(routePaths.PURFORM + lst.sl_no);
                  }}
                  class="pb-3 p-2 sm:pb-4 cursor-pointer hover:bg-gray-200"
                >
                  <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    {/* <div class="flex-shrink-0">
            <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
         </div> */}
                    <div class="flex-1 min-w-0">
                      <p class="text-lg font-bold text-green-900  truncate dark:text-white">
                        {lst.req_no}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        {/* Vendor:{" "}
                        <span
                          className={
                            lst.vendor_name == data?.labels?.val_one
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.vendor_name}{" "}
                        </span> */}
                        Project:{" "}
                        <span
                          className={
                            lst.proj_name == data?.labels?.val_two
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {" "}
                          {lst.proj_name}
                        </span>
                        , Part No.:{" "}
                        <span
                          className={
                            lst.part_no == data?.labels?.val_three
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.part_no}{" "}
                        </span>
                        , Item:{" "}
                        <span
                          className={
                            lst.prod_name == data?.labels?.val_four
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_name}
                        </span>
                        , Make:{" "}
                        <span
                          className={
                            lst.prod_make == data?.labels?.val_eight
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_make}
                        </span>
                        , Date:{" "}
                        <span
                          className={
                            lst.req_date <= data?.labels?.val_six &&
                            lst.req_date >= data?.labels?.val_five
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {formatDate(lst.req_date)}
                        </span>
                      </p>
                    </div>
                    {/* <Tooltip
                      title={
                        lst.po_status == "A"
                          ? "Approved"
                          : lst.po_status == "U"
                          ? "Pending approval"
                          : "In progress"
                      }
                    >
                      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        {lst.po_status == "A" ? (
                          <CheckCircleFilled className="text-green-900" />
                        ) : lst.po_status == "U" ? (
                          <ClockCircleFilled className="text-amber-500" />
                        ) : (
                          <FileTextOutlined className="text-blue-500" />
                        )}
                      </div>
                    </Tooltip> */}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty />
          )}
        </>
      )}

      {flag == 38 && (
        <>
          <div className="flex gap-3 my-5">
            {data?.labels?.val_one && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_one}
              />
            )}
            {data?.labels?.val_two && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_two}
              />
            )}
            {data?.labels?.val_three && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_three}
              />
            )}
            {data?.labels?.val_four && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_four}
              />
            )}
            {data?.labels?.val_five && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_five}
              />
            )}
            {data?.labels?.val_six && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_six}
              />
            )}
            {data?.labels?.val_seven && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_seven}
              />
            )}
            {data?.labels?.val_eight && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_eight}
              />
            )}
          </div>
          {data?.list?.length > 0 ? (
            <ul class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              {data?.list?.map((lst) => (
                <li
                  onClick={() => {
                    navigate(routePaths.CLIENTDELIVERYFORM + lst.po_no);
                  }}
                  class="pb-3 p-2 sm:pb-4 cursor-pointer hover:bg-gray-200"
                >
                  <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    {/* <div class="flex-shrink-0">
            <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
         </div> */}
                    <div class="flex-1 min-w-0">
                      <p class="text-lg font-bold text-green-900  truncate dark:text-white">
                        {lst.po_no}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        Vendor:{" "}
                        <span
                          className={
                            lst.vendor_name == data?.labels?.val_one
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.vendor_name}{" "}
                        </span>
                        , Project:{" "}
                        <span
                          className={
                            lst.proj_name == data?.labels?.val_two
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {" "}
                          {lst.proj_name}
                        </span>
                        , Part No.:{" "}
                        <span
                          className={
                            lst.part_no == data?.labels?.val_three
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.part_no}{" "}
                        </span>
                        , Item:{" "}
                        <span
                          className={
                            lst.prod_name == data?.labels?.val_four
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_name}
                        </span>
                        , Invoice:{" "}
                        <span
                          className={
                            lst.invoice == data?.labels?.val_seven
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.invoice}
                        </span>
                        , Make:{" "}
                        <span
                          className={
                            lst.prod_make == data?.labels?.val_eight
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_make}
                        </span>
                        , Invoice Date:{" "}
                        <span
                          className={
                            lst.invoice_dt <= data?.labels?.val_six &&
                            lst.invoice_dt >= data?.labels?.val_five
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {formatDate(lst.invoice_dt)}
                        </span>
                        , MRN: {lst.mrn_no}
                      </p>
                    </div>
                    {/* <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
            {lst.approve_flag=='A'?<CheckCircleFilled className="text-green-900" />:lst.approve_flag=='U'?<CloseCircleFilled className='text-red-900'/>:<ClockCircleFilled className='text-amber-500'/>}
         </div> */}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty />
          )}
        </>
      )}

      {flag == 39 && (
        <>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-green-900 text-white">
                  <th className="px-4 py-2">PO</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Created By</th>
                  <th className="px-4 py-2">Created At</th>
                  <th className="px-4 py-2">Modified By</th>
                  <th className="px-4 py-2">Modified At</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr className="bg-gray-200 text-green-900">
                    <td className="px-4 py-2">{item.po_no}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">{item.created_by}</td>
                    <td className="px-4 py-2">
                      {new Date(item.created_at).toLocaleString("en-GB")}
                    </td>
                    <td className="px-4 py-2">{item.modified_by || ""}</td>
                    <td className="px-4 py-2">{item.modified_at || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {flag == 40 && (
        <>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-green-900 text-white">
                  <th className="px-4 py-2">PO</th>
                  <th className="px-4 py-2">Invoice</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Created By</th>
                  <th className="px-4 py-2">Created At</th>
                  <th className="px-4 py-2">Modified By</th>
                  <th className="px-4 py-2">Modified At</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr className="bg-gray-200 text-green-900">
                    <td className="px-4 py-2">{item.po_no}</td>
                    <td className="px-4 py-2">{item.invoice}</td>
                    <td className="px-4 py-2">{item.rc_qty}</td>
                    <td className="px-4 py-2">{item.created_by}</td>
                    <td className="px-4 py-2">
                      {new Date(item.created_at).toLocaleString("en-GB")}
                    </td>
                    <td className="px-4 py-2">{item.modified_by || ""}</td>
                    <td className="px-4 py-2">{item.modified_at || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {flag == 41 && (
        <div className="flex flex-col items-center justify-center mt-2">
          <AmendPreview id={id} />
          {po_status != "C" && po_status!='' ? (
            <SpinComp
              loading={loading}
            >
              {/* <button
                      className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"

                onClick={() => {
                  setLoading(true);
                  axios
                    .post(url + "/api/cancelpo", {
                      id: id,
                      status: "C",
                      user: localStorage.getItem("email"),
                    })
                    .then((res) => {
                      setLoading(false);
                      if (res?.data?.suc > 0) {
                        Message("success", "Order Closed Successfully");
                        onPress();
                      } else {
                        Message("error", "Error in Closing Order");
                      }
                    })
                    .catch((err) => {
                      setLoading(false);

                      Message("error", err);
                    });
                }}
              >
                 <span class="relative z-10">
                    <CloseOutlined className='mr-2'/> 
                        Close Order
                        </span>
                        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
              </button> */}
              <BtnGroupReuse   onClick={() => {
                  setLoading(true);
                  axios
                    .post(url + "/api/cancelpo", {
                      id: id,
                      status: "C",
                      user: localStorage.getItem("email"),
                    })
                    .then((res) => {
                      setLoading(false);
                      if (res?.data?.suc > 0) {
                        Message("success", "Order Closed Successfully");
                        onPress();
                      } else {
                        Message("error", "Error in Closing Order");
                      }
                    })
                    .catch((err) => {
                      setLoading(false);

                      Message("error", err);
                    });
                }} icon={<CloseOutlined className='mr-2'/> } text="Close Order" flag={2}/>
            </SpinComp>
          ) : (
            // <Tag
            //   className="text-[12px] p-1 rounded-full w-36"
            //   icon={<CancelOutlined className="text-[10px]" />}
            //   color="red"
            // >
            //   Closed
            // </Tag>
            <InfoTags bgCol="text-[12px] p-1 mt-3 rounded-full w-36"
              icon={<CancelOutlined className="text-[10px]" />}
              color="red" text="Closed"/>
          )}
        </div>
      )}
        {flag == 42 && (
        <>
          <div className="flex gap-3 my-5">
            {data?.labels?.val_one && (
              <Chip
                className="text-xs  bg-[#C4F1BE]"
                label={data?.labels?.val_one}
              />
            )}
            {data?.labels?.val_two && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_two}
              />
            )}
            {data?.labels?.val_three && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_three}
              />
            )}
            {data?.labels?.val_four && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_four}
              />
            )}
            {data?.labels?.val_five && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_five}
              />
            )}
            {data?.labels?.val_six && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_six}
              />
            )}
            {data?.labels?.val_eight && (
              <Chip
                className="text-xs bg-[#C4F1BE]"
                label={data?.labels?.val_eight}
              />
            )}
          </div>
          {data?.list?.length > 0 ? (
            <ul class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              {data?.list?.map((lst) => (
                <li
                  onClick={() => {
                   onPress(lst.sl_no);
                  }}
                  class="pb-3 p-2 sm:pb-4 cursor-pointer hover:bg-gray-200"
                >
                  <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    {/* <div class="flex-shrink-0">
            <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
         </div> */}
                    <div class="flex-1 min-w-0">
                      <p class="text-lg font-bold text-green-900  truncate dark:text-white">
                        {lst.po_no}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        Vendor:{" "}
                        <span
                          className={
                            lst.vendor_name == data?.labels?.val_one
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.vendor_name}{" "}
                        </span>
                        , Project:{" "}
                        <span
                          className={
                            lst.proj_name == data?.labels?.val_two
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {" "}
                          {lst.proj_name}
                        </span>
                        , Part No.:{" "}
                        <span
                          className={
                            lst.part_no == data?.labels?.val_three
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.part_no}{" "}
                        </span>
                        , Item:{" "}
                        <span
                          className={
                            lst.prod_name == data?.labels?.val_four
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_name}
                        </span>
                        , Make:{" "}
                        <span
                          className={
                            lst.prod_make == data?.labels?.val_eight
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {lst.prod_make}
                        </span>
                        , Issued:{" "}
                        <span
                          className={
                            lst.po_issue_date <= data?.labels?.val_six &&
                            lst.po_issue_date >= data?.labels?.val_five
                              ? "bg-yellow-300 font-bold"
                              : ""
                          }
                        >
                          {formatDate(lst.po_issue_date)}
                        </span>
                      </p>
                    </div>
                    <Tooltip
                      title={
                        lst.po_status == "A"
                          ? "Approved"
                          : lst.po_status == "U"
                          ? "Pending approval"
                          : "In progress"
                      }
                    >
                      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        {lst.po_status == "A" ? (
                          <CheckCircleFilled className="text-green-900" />
                        ) : lst.po_status == "U" ? (
                          <ClockCircleFilled className="text-amber-500" />
                        ) : (
                          <FileTextOutlined className="text-blue-500" />
                        )}
                      </div>
                    </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty />
          )}
        </>
      )}
    </Dialog>
  );
};

export default DialogBox;
