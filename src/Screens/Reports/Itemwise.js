import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import HeadingTemplate from "../../Components/HeadingTemplate";
import VError from "../../Components/VError";
import TDInputTemplate from "../../Components/TDInputTemplate";
import axios from "axios";
import { Message } from "../../Components/Message";
import { url } from "../../Address/BaseUrl";
import { Empty, Spin, Tag, Tooltip} from 'antd';
import { ArrowUpOutlined, BorderOutlined, LoadingOutlined, MinusCircleOutlined, SaveOutlined, SnippetsOutlined } from '@ant-design/icons';
import PrintComp from "../../Components/PrintComp";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { OverlayPanel } from "primereact/overlaypanel";
import ReportTemplate from "../../Components/ReportTemplate";
import moment from "moment";

function Itemwise() {
    const params = useParams();
    const [loading,setLoading]=useState(false)
    const [products,setProducts] = useState([])
    const [prodList,setProdList] = useState([])
    const [showProd,setShowProd] = useState(false)
    const [prodVal,setProdVal] = useState("")
    const [prodCode,setProdCode] = useState()
    const [dt,setDt] = useState(moment(new Date()).format("yyyy-MM-DD"))
    const [clicked,setClicked] = useState(true)
    const op = useRef(null);
  const [reportData,setReportData] = useState([])
  const [info,setInfo] = useState([])

    const headers= [
        { name:'serial_number',value:'#'},
        { name: "prod_name", value: "Product" },
        { name: "proj_name", value: "Project" },
        { name: "project_stock", value: "Project quantity" },
    
        // { name: "created_by", value: "Created by" },
      ]
    useEffect(() => {
       
            setLoading(true)
        axios.post(url + "/api/getproduct", { id: 0 }).then((res) => {
          console.log(res);
          setLoading(false)
          setProducts(res?.data?.msg);
          for (let i of res?.data?.msg) {
            prodList.push({ code: i.sl_no, name: i.prod_name,part_no:i.part_no,make:i.prod_make,article_no:i.article_no,model_no:i.model_no});
          }
        });
    },[])
    const onSubmit = (values) => {
      setInfo([{key:'1',label:'Date',children:<p>{dt}</p>},{key:'2',label:'Item',children:<p>{prodVal}</p>}])
        setLoading(true);
        axios
          .post(url + "/api/itemwise", { item_id: prodCode, dt: dt })
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
     
      <section  className="bg-transparent dark:bg-[#001529]">
            {/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
            <HeadingTemplate
                text={"Itemwise Stock Report"}
                mode={2}
                title={'Report'}
                // data={params.id && data?data:''}
              />
               {/* <div className="float-end">
                
                {clicked &&<Tooltip title='Minimize'> <button className="h-4  w-4 flex justify-center items-center  rounded-full bg-green-900 text-white" onClick={()=>{setClicked(!clicked)}}>
               <MinusCircleOutlined  className="z-50 text-xs" />
                </button>
                </Tooltip>
}


                </div> */}
              <div className="grid grid-cols-6 gap-2">
              <div className="ml-1 -mb-11 z-50">
          {clicked && (
            <Tooltip title="Minimize">
              {" "}
              <button
                className="h-5 w-5 flex justify-center items-center  rounded-full bg-gray-300 text-gray-600"
                onClick={() => {
                  setClicked(!clicked);
                }}
              >
                <ArrowUpOutlined className="z-50 text-sm" />
              </button>
            </Tooltip>
          )}
        </div>
              <div  onClick={()=>{
                if(!clicked)
                setClicked(!clicked)
            }} className={clicked?'w-full -mt-3 col-span-6  bg-white p-6 rounded-2xl delay-100 duration-300':'w-8 rounded-full col-span-6 h-8 flex justify-center items-center z-50 delay-100 text-white duration-300 cursor-pointer bg-green-900 p-1 -mb-8'}>
           
               {clicked &&
                <Spin indicator={<LoadingOutlined spin />} size="large" className="text-green-900 dark:text-gray-400" spinning={loading}>
          <form >
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-1">
                
                <TDInputTemplate
                  placeholder="From"
                  type="date"
                  label="From"
                  name="dt"
                  formControlName={dt}
                  handleChange={txt=>setDt(txt.target.value)}
                  mode={1}
                  min={moment(
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 3)
                    )
                  ).format("yyyy-MM-DD")} //may need to change
                  max={moment(new Date()).format("yyyy-MM-DD")} 
                />
  
                {!dt ? (
                  <VError title={'Required'} />
                ) : null}
              </div>
              
            <div className="sm:col-span-1">
             <TDInputTemplate
                    placeholder="Search by item, part no., model no., article no., make..."
                    type="text"
                    label="Items"
                    name="prod"
                    // disabled={params.id > 0 || (intended=='W' && !clientcode)}
                    formControlName={prodVal}
                    handleFocus={e=>op.current.show(e)}
                    handleChange={(txt) => {
                      console.log(txt);
                      setProdVal(txt.target.value);
                      if(txt.target.value.length)
                        op.current.show(txt)
                      else{
                      op.current.hide(txt)
                      setProdCode()
                      }
                      // setLoading(true);
                      // getItemDetails(txt.target.value);
                    }}
                    data={prodList}
                    mode={1}
                  />
                    {!prodCode ? <VError title={"Required"} /> : null}
                

<OverlayPanel ref={op} className='w-[480px] border-2 bg-gray-50 border-[#C4F1BE]'>
   <span className='text-xs text-green-900 italic'>Search results for: "{prodVal}"</span>
        <ul class=" divide-y max-h-48 overflow-y-scroll mt-2 divide-gray-200 dark:divide-gray-700">
        {prodList?.filter(e=>e.name?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.part_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.part_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.model_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.article_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.make?.toLowerCase().includes(prodVal?.toLowerCase()) ).length>0 && prodList?.filter(e=>e.name?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.part_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.part_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.model_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.article_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.make?.toLowerCase().includes(prodVal?.toLowerCase()) )?.map(lst=><li onClick={(e)=>{op.current.hide(e);setProdVal(lst.name);setProdCode(lst.code) }}                                 class="pb-3 cursor-pointer  hover:bg-[#C4F1BE] group active:bg-green-900 rounded-md hover:duration-300 sm:py-1.5"
>
            <div class="flex items-center rtl:space-x-reverse">
            
             <div class="flex-1 min-w-0">
                <p class="text-sm p-0.5 w-full text-green-900 group-active:text-white truncate dark:text-white">
                 {lst.name}
                </p>
               
              </div>
            
            </div>
            {/* <hr className=" border-gray-100"/> */}
          </li>)}
         {prodList.filter(e=>e.name?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.part_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.part_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.model_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.article_no?.toLowerCase().includes(prodVal?.toLowerCase()) ||e.make?.toLowerCase().includes(prodVal?.toLowerCase()) ).length==0 && <Empty/>}
        </ul>
      </OverlayPanel>
              </div>
              
            </div>
                
  
      
            {/* <BtnComp mode={params.id>0?'E':'A'} onReset={formik.handleReset}/> */}
           
          </form>
          <div className="flex justify-center items-center">
          <button
          disabled={!dt || !prodCode}
        type="submit"
        className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
         onClick={()=>onSubmit()}
    >
        <span class="relative z-10">
               <SaveOutlined className='mr-2' />
               Submit
               </span>
               <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
    </button>
    </div>
          </Spin>
}
          {!clicked &&
          <SnippetsOutlined />
          
          }
        </div>
    
              </div>
              {reportData.length>0 &&   <div className={clicked?"grid grid-cols-6 gap-2 my-3":"grid grid-cols-6 gap-2"}>
              <div className='w-full col-span-6 bg-white p-2 rounded-2xl '>
         

              <div className="w-full col-span-6 bg-white p-6 rounded-2xl ">
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          {/* <Tag color="#014737">Warehouse quantity of this product: {reportData[0].warehouse_stock || 0}</Tag> */}
          
            <ReportTemplate data={reportData} headers={headers} info={info} wStock={reportData[0].warehouse_stock || 0} flag={2}/>
          </div>
        </div>

        </div>
    
              </div>
           
        }
      </section>
    );
  };

export default Itemwise
