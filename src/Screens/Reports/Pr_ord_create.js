import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import HeadingTemplate from "../../Components/HeadingTemplate";
import VError from "../../Components/VError";
import TDInputTemplate from "../../Components/TDInputTemplate";
import axios from "axios";
import { Message } from "../../Components/Message";
import { url } from "../../Address/BaseUrl";
import { Empty, Spin, Tooltip } from "antd";
import {
    ArrowUpOutlined,
  LoadingOutlined,
  SaveOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { OverlayPanel } from "primereact/overlaypanel";
import ReportTemplate from "../../Components/ReportTemplate";
import InfoTags from "../../Components/InfoTags";
import BtnGroupReuse from "../../Components/BtnGroupReuse";
import { formatDate } from "../../Functions/formatDate";
import SpinComp from "../../Components/SpinComp";

function Pr_ord_create() {
  const params = useParams();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [showProj, setShowProj] = useState(false);
    const [purCode, setPurCode] = useState();

    const [projVal, setProjVal] = useState("");
    const [projCode, setProjCode] = useState();
    const [type, setType] = useState("");
    const [dt, setDt] = useState(formatDate(new Date(),"yyyy-MM-DD"));
    const [clicked, setClicked] = useState(true);
    const [reportData,setReportData] = useState([])
    const [pur_req__list, setPurReqList] = useState([]);
    const [pur_req__listCopy, setPurReqListCopy] = useState([]);
    const [pur_req_items, setPurReqItems] = useState([]);
    const [pur_req, setPurReq] = useState("");
    const op = useRef(null);
    const op_pur_req = useRef(null);
    
    const [info,setInfo] = useState([])
    const [projId,setProjId] = useState("")
    const headers= [
      { name: "pur_no", value: "PR No." },
      { name: "proj_name", value: "Intended For" },
      { name: "status", value: "Status" },
      { name: "pur_date", value: "Requisition Date" },
      { name: "created_by", value: "Requisition By" },
      // { name: "proj_name", value: "Intended For" },
      // { name: "qty", value: "PR Quantity" },
      // { name: "po_no", value: "PO No.(s)" },
      // { name: "ordered_qty", value: "Ordered Quantity" },
      // { name: "free_qty", value: "Free For Requisition" },

      // { name: "approved_ord_qty", value: "Approved Quantity" },

    ]
    useEffect(() => {
        axios
        .post(url + "/api/get_purchase_req_items_search", { pur_no: "" })
        .then((resPur) => {
          console.log(resPur);
          setPurReqList(
            resPur?.data?.msg
          );
          setPurReqListCopy(
            resPur?.data?.msg
          );
          setLoading(false);
        });
      if (type == "P") {
        setLoading(true);
        projectList.length=0
        // setProjectList([])
        axios.post(url + "/api/getproject", { id: 0 }).then((res) => {
          console.log(res);
          setLoading(false);
          setProjects(res?.data?.msg);
          for (let i of res?.data?.msg) {
            projectList.push({
              code: i.sl_no,
              name: i.proj_name,
              client: i.client_id,
              proj_id:i.proj_id
            });
          }
        });
      }
    }, [type]);
    useEffect(()=>{
      onSubmit()
    },[])
    const onSubmit = () => {
      setInfo([{key:'1',label:'Date',children:<p>{dt}</p>},{key:'2',label:type=='P'?'Project Stock for ':'Warehouse Stock',children:<p>{type=='P'?projVal:'N/A'}</p>}])
      setLoading(true);
      axios
        .post(url + "/api/pending_ord_create", { pur_no: purCode||''})
        .then((res) => {
          console.log(res);
          setReportData(res?.data?.msg)
          setLoading(false);
          if(res?.data?.msg?.length==0){
              Message('error','No Data')
          }
          // else{
          //     setClicked(!clicked)
          // }
        });
    };
  
    return (
      <section className="bg-transparent dark:bg-[#001529]">
        <HeadingTemplate
          text={"Pending Order Creation Against PR"}
          mode={2}
          title={"Report"}
        />
     
       
         <SpinComp
                loading={loading}
              >
        {reportData.length>0 &&   <div className={clicked?"grid grid-cols-6 gap-2 my-3":"grid grid-cols-6 gap-2"}>
                <div className='w-full col-span-6 bg-white p-2 rounded-2xl '>
           
  
                <div className="w-full col-span-6 bg-white p-6 rounded-2xl ">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <InfoTags color="white" text='Warehouse quantity of this product: ' />
             
              <ReportTemplate reportHeader={'Pending Order Creation Report'} data={reportData} headers={headers} info={info} flag={6}/>
          
            </div>
          </div>
  
          </div>
      
                </div>
             
          }
          </SpinComp>
      </section>
    );
  
}

export default Pr_ord_create