import './Steps.css'

import React, { useEffect, useState } from "react";
import TDInputTemplate from "../TDInputTemplate";
import VError from "../../Components/VError";
import { useParams } from "react-router-dom";
import { Popover, Tag } from "antd";
import { url } from "../../Address/BaseUrl";
import axios from "axios";
import { ArrowLeftOutlined, ArrowRightOutlined, FileExcelOutlined, FileImageOutlined, FilePdfOutlined, FileTextOutlined, FileWordOutlined, LockFilled, UnlockFilled } from "@ant-design/icons";
import BtnGroupReuse from '../BtnGroupReuse';
import BlockComp from '../BlockComp';

function More({ pressNext, pressBack, type,data,onMdccChange,onInspChange,onDrawChange }) {
  const [insp_flag, setInspFlag] = useState(data.insp_flag?data.insp_flag:"N");
  const [insp, setInsp] = useState(data.insp?data.insp:"");
  const [drawing_flag, setDrawingFlag] = useState(data.drawing_flag?data.drawing_flag:"N");
  const [drawing, setDrawing] = useState(data.drawing?data.drawing:"");
  const [mdcc_flag, setMdccFlag] = useState(data.mdcc_flag?data.mdcc_flag:"N");
  const [mdcc, setMdcc] = useState(data.mdcc?data.mdcc:"");
  const [drawingDate, setDrawingDate] = useState(data.drawingDate?data.drawingDate:'');
  const [mdccDescVal,setMdccDescVal]=useState([])
  const [inspDescVal,setInspDescVal]=useState([])
  const [drawDescVal,setDrawDescVal]=useState([])
  const [popmdccOpen, setmdccPopOpen] = useState(false);
  const [popinspOpen, setinspPopOpen] = useState(false);
  const [popdrawOpen, setdrawPopOpen] = useState(false);
  const [dtls,setDtls] = useState([])
  const [mdcc_doc, setMdccDoc] = useState();
  const [insp_doc, setInspDoc] = useState();
  const [draw_doc, setDrawDoc] = useState();
  const params = useParams();
  const [blocked, setBlocked] = useState(false);
  const det = JSON.parse(localStorage.getItem('perm'))

  useEffect(()=>{
    // setBlocked((det.po == 1 || (localStorage.getItem('manager_email')!='FFABC123' && localStorage.getItem('manager_email')!=localStorage.getItem('email'))) ? true : false);
    // 
    setBlocked(det.po == 1 || (localStorage.getItem('email')!=localStorage.getItem("po_created_by") && localStorage.getItem("po_created_by")) ?true:false)
    // setBlocked(false)
    // 

    
  },[])

  const hidemdcc = () => {
    setmdccPopOpen(false);
  };

  const handlemdccOpenChange = (newOpen) => {
    setmdccPopOpen(newOpen);
  };
  const hideinsp = () => {
    setinspPopOpen(false);
  };

  const handleinspOpenChange = (newOpen) => {
    setinspPopOpen(newOpen);
  };
  const hidedraw = () => {
    setdrawPopOpen(false);
  };

  const handledrawOpenChange = (newOpen) => {
    setdrawPopOpen(newOpen);
  };
  const onSubmit = () => {
    console.log(drawingDate);

    if (
      mdcc_flag == "MDCC" ||
      !insp_flag == "Inspection required?" ||
      drawing_flag == "Drawing/Datasheet?" ||
      (mdcc_flag == "Y" && !mdcc) ||
      (insp_flag == "Y" && !insp) ||
      (drawing_flag == "Y" && !drawing)
    ) {
    } else {
      console.log(drawingDate);
      pressNext({
        mdcc_flag: mdcc_flag,
        mdcc: mdcc,
        drawing_flag: drawing_flag,
        drawing: drawing,
        insp_flag: insp_flag,
        insp: insp,
        drawingDate:drawingDate,
        mdcc_doc:mdcc_doc,
        insp_doc:insp_doc,
        draw_doc:draw_doc
      });
    }
  };
  return (
    <>
          <BlockComp blocked={blocked} template={
                                              <div className='relative  w-full h-full 0 z-10'>
                                                <span className='absolute top-1 right-2 font-bold italic text-gray-500'><LockFilled className='text-green-900 '/> Locked</span>
                                                 <span className='absolute bottom-0 right-1 font-bold italic text-gray-500'><UnlockFilled className='text-green-900 '/> Accessible to {localStorage.getItem("po_created_by")}</span>
                                              </div>
                                            }>
    
      <div className={!blocked?"grid gap-4 sm:grid-cols-3 sm:gap-6":"grid gap-4 sm:grid-cols-3 sm:gap-6 p-2"}>
        <div className="flex flex-col sm:col-span-1 gap-3 mt-5">
       
          <TDInputTemplate
            placeholder="MDCC"
            type="text"
            label="MDCC"
            name="mdcc"
            data={[
              { name: "Yes", code: "Y" },
              { name: "No", code: "N" },
            ]}
            formControlName={mdcc_flag}
            handleChange={(e) => {
              setMdccFlag(e.target.value);
              console.log(mdcc_flag)
              localStorage.setItem('mdcc_flag',e.target.value);
              
            }}
            mode={2}
            disabled={localStorage.getItem('po_status')=='A' ||localStorage.getItem('po_status')=='D'||localStorage.getItem('po_status')=='L'?true:false}

          />
          {mdcc_flag == "MDCC" && <VError title={"MDCC is required"} />}
        </div>
        <div className="flex flex-col sm:col-span-1 gap-3 mt-5">
          <TDInputTemplate
            placeholder="Inspection required?"
            type="text"
            label="Inspection required?"
            name="insp_flag"
            handleChange={(e) => {
              setInspFlag(e.target.value);
              console.log(insp_flag);
              localStorage.setItem('insp_flag',e.target.value)
            }}
            formControlName={insp_flag}
            data={[
              { name: "Yes", code: "Y" },
              { name: "No", code: "N" },
            ]}
            mode={2}
            disabled={localStorage.getItem('po_status')=='A'||localStorage.getItem('po_status')=='D'||localStorage.getItem('po_status')=='L'?true:false}

          />
          {insp_flag == "Inspection required?" && (
            <VError title={"Inspection flag is required"} />
          )}
         
        </div>
        <div className="flex flex-col sm:col-span-1 gap-3 mt-5">
          <TDInputTemplate
            placeholder="Drawing/Datasheet?"
            type="text"
            label="Drawing/Datasheet?"
            name="drawing"
            data={[
              { name: "Yes", code: "Y" },
              { name: "No", code: "N" },
            ]}
            mode={2}
            disabled={localStorage.getItem('po_status')=='A'||localStorage.getItem('po_status')=='D'||localStorage.getItem('po_status')=='L'?true:false}

            handleChange={(e) => {
              setDrawingFlag(e.target.value);
              console.log(drawing_flag);
              localStorage.setItem('drawing_flag',e.target.value)
            }}
            formControlName={drawing_flag}
          />
          {drawing_flag == "Drawing/Datasheet?" && (
            <VError title={"Drawing/Datasheet flag is required"} />
          )}
          
        </div>
        <div  className="flex flex-col sm:col-span-3 gap-3 mt-5"> 
        {/* <Popover
            content={
              <>
                <ul>
                  {mdccDescVal?.map((price) => (
                    <li className="my-2">
                      <Tag
                        className="cursor-pointer"
                        onClick={() => {
                         setMdcc(price.mdcc)
                          handlemdccOpenChange(false);
                        }}
                      >
                        {price.mdcc}
                      </Tag>
                    </li>
                  ))}
                </ul>
                <a onClick={hidemdcc}>Close</a>
              </>
            }
            title="Do you mean?"
            trigger="click"
            open={popmdccOpen}
            onOpenChange={handlemdccOpenChange}
          > */}
        {mdcc_flag == "Y" && (
           <Popover
           content={<>
           <ul>
           {dtls?.map(price=><li className="my-2">
             <Tag className="cursor-pointer" onClick={()=>{
               setMdcc(price.mdcc_scope)
               localStorage.setItem('mdcc',price.mdcc_scope)
               // console.log() 
               handlemdccOpenChange(false)
               }} >
             {price.mdcc_scope}
               
               </Tag>  
             </li>)}
     
           </ul>
          <a onClick={hidemdcc}>Close</a>  
           </>}
           title="Do you mean?"
           trigger="click"
           open={popmdccOpen}
           onOpenChange={handlemdccOpenChange}
         >
            <TDInputTemplate
              placeholder="MDCC Scope"
              type="text"
              label="MDCC Scope"
              name="mdcc"

              formControlName={mdcc}
              handleChange={(text) => {setMdcc(text.target.value); localStorage.setItem('mdcc',text.target.value)
             if(text.target.value.length>=3){
                axios.post(url+'/api/get_mdcc_scope',{wrd:text.target.value}).then(res=>{
                  if(res.data.msg.length>0){
                    setDtls(res.data.msg)
                    handlemdccOpenChange(true)
                  }
                })
              }

              }}
              disabled={localStorage.getItem('po_status')=='A'||localStorage.getItem('po_status')=='D'||localStorage.getItem('po_status')=='L'?true:false}

              mode={3}
            />
            </Popover>
          )}
           {mdcc_flag == "Y" && (
              <TDInputTemplate
              placeholder="MDCC Scope"
              type="file"
              label="MDCC "
              name="mdcc_doc"
              // formControlName={mdcc}
              accept={"application/pdf"}
              handleChange={e=>{setMdccDoc(e.target.files[0]); onMdccChange(e.target.files[0])}}
            //   handleChange={(text) => {setMdcc(text.target.value); localStorage.setItem('mdcc',text.target.value)
            //  if(text.target.value.length>=3){
            //     axios.post(url+'/api/get_mdcc_scope',{wrd:text.target.value}).then(res=>{
            //       if(res.data.msg.length>0){
            //         setDtls(res.data.msg)
            //         handlemdccOpenChange(true)
            //       }
            //     })
            //   }

            //   }}
              disabled={localStorage.getItem('po_status')=='A'||localStorage.getItem('po_status')=='D'||localStorage.getItem('po_status')=='L'?true:false}

              mode={1}
            />
            
           )}

{localStorage.getItem('mdcc_doc') && localStorage.getItem('mdcc_doc')!='null' && (
                      <div className="relative">
                        
                        <a
                          target="_blank"
                          href={url + "/uploads/" + localStorage.getItem('mdcc_doc')}
                        >
                          {localStorage.getItem('mdcc_doc') && localStorage.getItem('mdcc_doc')?.split(".")[1] == "pdf" ? (
                            <FilePdfOutlined className="text-6xl my-7 text-red-600" />
                          ) : localStorage.getItem('mdcc_doc')
                              .split(".")[1]
                              ?.includes("doc") ? (
                            <FileWordOutlined className="text-6xl my-7 text-blue-900" />
                          ) : localStorage.getItem('mdcc_doc')
                              .split(".")[1]
                              ?.includes("xls") ||
                            localStorage.getItem('mdcc_doc')
                              .split(".")[1]
                              ?.includes("csv") ? (
                            <FileExcelOutlined className="text-6xl my-7 text-green-800" />
                          ) : localStorage.getItem('mdcc_doc')
                              .split(".")[1]
                              ?.includes("png") ||
                            localStorage.getItem('mdcc_doc')
                              .split(".")[1]
                              ?.includes("jpg") ||
                            localStorage.getItem('mdcc_doc')
                              .split(".")[1]
                              ?.includes("jpeg") ? (
                            <FileImageOutlined className="text-6xl my-7 text-yellow-500" />
                          ) : (
                            <FileTextOutlined className="text-6xl my-7 text-gray-600" />
                          )}
                        </a>
                        </div>)}
          {mdcc_flag == "Y" && !mdcc && (
            <VError title={"MDCC scope is required"} />
          )} 
          {/* </Popover> */}
          <Popover
            content={
              <>
                <ul>
                  {inspDescVal?.map((price) => (
                    <li className="my-2">
                      <Tag
                        className="cursor-pointer"
                        onClick={() => {
                         setInsp(price.inspection_scope)
                          handleinspOpenChange(false);
                          localStorage.setItem('insp',price.inspection_scope)
                        }}
                      >
                        {price.inspection_scope}
                      </Tag>
                    </li>
                  ))}
                </ul>
                <a onClick={hideinsp}>Close</a>
              </>
            }
            title="Do you mean?"
            trigger="click"
            open={popinspOpen}
            onOpenChange={handleinspOpenChange}
          >
         {insp_flag == "Y" && (
            <TDInputTemplate
              placeholder="Inspection Scope"
              type="text"
              formControlName={insp}
              handleChange={(text) => {setInsp(text.target.value);localStorage.setItem('insp',text.target.value)
                if(text.target.value.length>=3){
                axios.post(url+'/api/get_inspection_scope',{wrd:text.target.value}).then(res=>{
                  if(res.data.msg.length>0){
                    setInspDescVal(res.data.msg)
                    handlemdccOpenChange(true)
              }})
            }

              }}
              label="Inspection Scope"
              disabled={localStorage.getItem('po_status')=='A'||localStorage.getItem('po_status')=='D'||localStorage.getItem('po_status')=='L'?true:false}
          
              name="insp"
              mode={3}
            />
          )}
            {insp_flag == "Y" && (
              <TDInputTemplate
              placeholder="Inspection Document"
              type="file"
              label="Inspection Document "
              name="insp_doc"
              accept={"application/pdf"}
              handleChange={e=>{setInspDoc(e.target.files[0]);  onInspChange(e.target.files[0])}}

              // formControlName={mdcc}
            //   handleChange={(text) => {setMdcc(text.target.value); localStorage.setItem('mdcc',text.target.value)
            //  if(text.target.value.length>=3){
            //     axios.post(url+'/api/get_mdcc_scope',{wrd:text.target.value}).then(res=>{
            //       if(res.data.msg.length>0){
            //         setDtls(res.data.msg)
            //         handlemdccOpenChange(true)
            //       }
            //     })
            //   }

            //   }}
              disabled={localStorage.getItem('po_status')=='A'||localStorage.getItem('po_status')=='D'||localStorage.getItem('po_status')=='L'?true:false}

              mode={1}
            />
           )}
           {localStorage.getItem('insp_doc') && localStorage.getItem('insp_doc')!='null' && (
                      <div className="relative">
                        
                        <a
                          target="_blank"
                          href={url + "/uploads/" + localStorage.getItem('insp_doc')}
                        >
                          {localStorage.getItem('insp_doc') && localStorage.getItem('insp_doc')?.split(".")[1] == "pdf" ? (
                            <FilePdfOutlined className="text-6xl my-7 text-red-600" />
                          ) : localStorage.getItem('insp_doc')
                              .split(".")[1]
                              ?.includes("doc") ? (
                            <FileWordOutlined className="text-6xl my-7 text-blue-900" />
                          ) : localStorage.getItem('insp_doc')
                              .split(".")[1]
                              ?.includes("xls") ||
                            localStorage.getItem('insp_doc')
                              .split(".")[1]
                              ?.includes("csv") ? (
                            <FileExcelOutlined className="text-6xl my-7 text-green-800" />
                          ) : localStorage.getItem('insp_doc')
                              .split(".")[1]
                              ?.includes("png") ||
                            localStorage.getItem('insp_doc')
                              .split(".")[1]
                              ?.includes("jpg") ||
                            localStorage.getItem('insp_doc')
                              .split(".")[1]
                              ?.includes("jpeg") ? (
                            <FileImageOutlined className="text-6xl my-7 text-yellow-500" />
                          ) : (
                            <FileTextOutlined className="text-6xl my-7 text-gray-600" />
                          )}
                        </a>
                        </div>)}
          {insp_flag == "Y" && !insp && (
            <VError title={"Inspection scope is required"} />
          )}
          </Popover>
        {drawing_flag == "Y" && (

            <>
              <Popover
            content={
              <>
                <ul>
                  {drawDescVal?.map((price) => (
                    <li className="my-2">
                      <Tag
                        className="cursor-pointer"
                        onClick={() => {
                          setDrawing(price.draw_scope)
                          handledrawOpenChange(false);
                          localStorage.setItem('drawing',price.draw_scope)
                        }}
                      >
                        {price.draw_scope}
                      </Tag>
                    </li>
                  ))}
                </ul>
                <a onClick={hidedraw}>Close</a>
              </>
            }
            title="Do you mean?"
            trigger="click"
            open={popdrawOpen}
            onOpenChange={handledrawOpenChange}
          >
              <TDInputTemplate
                placeholder="Drawing/Datasheet Scope"
                type="text"
                formControlName={drawing}
                handleChange={(e) => {setDrawing(e.target.value);localStorage.setItem('drawing',e.target.value)

                  if(e.target.value.length>=3){
                  axios.post(url+'/api/get_draw_scope',{wrd:e.target.value}).then(res=>{
                    if(res.data.msg.length>0){
                      setDrawDescVal(res.data.msg)
                      handledrawOpenChange(true)
                }})
              }

                }}
                label="Drawing/Datasheet Scope"
                disabled={localStorage.getItem('po_status')=='A'||localStorage.getItem('po_status')=='D'||localStorage.getItem('po_status')=='L'?true:false}

                name="drawing"
                mode={3}
              />
              {drawing_flag == "Y" && !drawing && (
                <VError title={"Drawing scope is required"} />
              )}
                </Popover>

                <>
                  {" "}
                  <div  className="flex-col justify-between">
                    
                    <TDInputTemplate
                      placeholder=""
                      type="text"
                      formControlName={drawingDate}
                      handleChange={(event) => {setDrawingDate(event.target.value);localStorage.setItem('dt',event.target.value)}}
                      // handleChange={e=>setDrawing(e.target.value)}
                disabled={localStorage.getItem('po_status')=='A'||localStorage.getItem('po_status')=='D'||localStorage.getItem('po_status')=='L'?true:false}

                      label="Drawing submission date"
                      name="dt"
                      mode={3}
                    />
                  </div>
                </>
            </>
          )}
            {drawing_flag == "Y" && (
              <TDInputTemplate
              placeholder="Drawing document"
              type="file"
              label="Drawing document "
              name="draw_doc"
              handleChange={e=>{setDrawDoc(e.target.files[0]);  onDrawChange(e.target.files[0])}}
              accept={"application/pdf"}

              // formControlName={mdcc}
            //   handleChange={(text) => {setMdcc(text.target.value); localStorage.setItem('mdcc',text.target.value)
            //  if(text.target.value.length>=3){
            //     axios.post(url+'/api/get_mdcc_scope',{wrd:text.target.value}).then(res=>{
            //       if(res.data.msg.length>0){
            //         setDtls(res.data.msg)
            //         handlemdccOpenChange(true)
            //       }
            //     })
            //   }

            //   }}
              disabled={localStorage.getItem('po_status')=='A'||localStorage.getItem('po_status')=='D'||localStorage.getItem('po_status')=='L'?true:false}

              mode={1}
            />
           )}
           {localStorage.getItem('draw_doc') && localStorage.getItem('draw_doc')!='null'  && (
                      <div className="relative">
                        
                        <a
                          target="_blank"
                          href={url + "/uploads/" + localStorage.getItem('draw_doc')}
                        >
                          {localStorage.getItem('draw_doc') && localStorage.getItem('draw_doc')?.split(".")[1] == "pdf" ? (
                            <FilePdfOutlined className="text-6xl my-7 text-red-600" />
                          ) : localStorage.getItem('draw_doc')
                              .split(".")[1]
                              ?.includes("doc") ? (
                            <FileWordOutlined className="text-6xl my-7 text-blue-900" />
                          ) : localStorage.getItem('draw_doc')
                              .split(".")[1]
                              ?.includes("xls") ||
                            localStorage.getItem('draw_doc')
                              .split(".")[1]
                              ?.includes("csv") ? (
                            <FileExcelOutlined className="text-6xl my-7 text-green-800" />
                          ) : localStorage.getItem('draw_doc')
                              .split(".")[1]
                              ?.includes("png") ||
                            localStorage.getItem('draw_doc')
                              .split(".")[1]
                              ?.includes("jpg") ||
                            localStorage.getItem('draw_doc')
                              .split(".")[1]
                              ?.includes("jpeg") ? (
                            <FileImageOutlined className="text-6xl my-7 text-yellow-500" />
                          ) : (
                            <FileTextOutlined className="text-6xl my-7 text-gray-600" />
                          )}
                        </a>
                        </div>)}
       </div>
      </div>
      </BlockComp>
      <div className="flex pt-4 justify-between w-full">
        {/* <button
          className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
          onClick={pressBack}
        >
          <span class="relative z-10">
          <ArrowLeftOutlined className="mr-1"/>
          Back
          </span>
          <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
        </button> */}
        <BtnGroupReuse text="Back" icon={ <ArrowLeftOutlined className="mr-2"/>} flag={2} onClick={pressBack} />
        <BtnGroupReuse text="Next" icon={ <ArrowRightOutlined className="mr-2"/>} flag={1} onClick={() => onSubmit()} />
        {/* <button
          type="submit"
          className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
          onClick={() => onSubmit()}
        >
          <span class="relative z-10">
          Next <ArrowRightOutlined className="ml-1"/>
          </span>
          <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
        </button> */}
      </div>
    </>
  );
}

export default More;
