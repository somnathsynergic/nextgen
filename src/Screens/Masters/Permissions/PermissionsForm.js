import { Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import HeadingTemplate from "../../../Components/HeadingTemplate";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../../../Address/BaseUrl";
import { LockFilled, SaveOutlined } from "@ant-design/icons";
import { Message } from "../../../Components/Message";
import { useReactToPrint } from "react-to-print";
  import { useRef } from "react";
import PrintHeader from "../../../Components/PrintHeader";
import SpinComp from "../../../Components/SpinComp";
import InfoTags from "../../../Components/InfoTags";
import BlockComp from "../../../Components/BlockComp";
function PermissionsForm() {
  const params = useParams();
     const [blocked, setBlocked] = useState(false);
     const det = JSON.parse(localStorage.getItem('perm'))
  
  const [user_type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [masters, setMasters] = useState(false);
  const [purchase, setPurchase] = useState(false);
  const [client_orders, setOrders] = useState(false);
  const [vendor_orders, setVOrders] = useState(false);
  const [mrn, setMrn] = useState(false);
  const [req, setReq] = useState(false);
  const [min, setMin] = useState(false);
  const [stock, setStock] = useState(false);
  const [preq, setPReq] = useState(false);
  const [created_by,setCreated_by] = useState('')
  const [modified_by,setModified_by] = useState('')
  const [created_at,setCreated_at] = useState('')
  const [modified_at,setModified_at] = useState('')
  
   const contentRef = useRef(null);
      const [isPrinting, setIsPrinting] = useState(true);
    
       const reactToPrintFn = useReactToPrint({
       contentRef
      });
  const [permissions,setPermissions] = useState({
    M1:false,
    M2:false,
    PR1:false,
    PR2:false,
    P1:false,
    P2:false,
    PU1:false,
    PU2:false,
    APU1:false,
    APU2:false,
    MRN1:false,
    MRN2:false,
    R1:false,
    R2:false,
    MIN1:false,
    MIN2:false,
    S1:false,
    S2:false,
    UPERM1:false,
    UPERM2:false,
  })
  const navigate = useNavigate();
  var countMaster = 0
  var countPurchase = 0
  useEffect(() => {
    setBlocked(det.user_perm==1?true:false)

    setLoading(true);
    axios.post(url + "/api/getuser", { id: +params.id }).then((res) => {
      console.log(res);
      setLoading(false);
      setType(res?.data?.msg.user_name);
      axios
        .post(url + "/api/fetch_permission", { id: +params.id })
        .then((res) => {
          console.log(res);
          setCreated_by(res?.data?.msg[0]?.created_by)
          setModified_by(res?.data?.msg[0]?.modified_by)
          setCreated_at(res?.data?.msg[0]?.created_at)
          setModified_at(res?.data?.msg[0]?.modified_at)
          var perm = {
            M1:res?.data?.msg[0]?.masters=="1"?true:false,
            M2:res?.data?.msg[0]?.masters=="2"?true:false,
            PR1:res?.data?.msg[0]?.purchase_req=="1"?true:false,
            PR2:res?.data?.msg[0]?.purchase_req=="2"?true:false,
            P1:res?.data?.msg[0]?.project=="1"?true:false,
            P2:res?.data?.msg[0]?.project=="2"?true:false,
            PU1:res?.data?.msg[0]?.po=="1"?true:false,
            PU2:res?.data?.msg[0]?.po=="2"?true:false,
            APU1:res?.data?.msg[0]?.approve_po=="1"?true:false,
            APU2:res?.data?.msg[0]?.approve_po=="2"?true:false,
            MRN1:res?.data?.msg[0]?.mrn=="1"?true:false,
            MRN2:res?.data?.msg[0]?.mrn=="2"?true:false,
            R1:res?.data?.msg[0]?.requisition=="1"?true:false,
            R2:res?.data?.msg[0]?.requisition=="2"?true:false,
            MIN1:res?.data?.msg[0]?.min=="1"?true:false,
            MIN2:res?.data?.msg[0]?.min=="2"?true:false,
            S1:res?.data?.msg[0]?.stock=="1"?true:false,
            S2:res?.data?.msg[0]?.stock=="2"?true:false,
            UPERM1:res?.data?.msg[0]?.user_perm=="1"?true:false,
            UPERM2:res?.data?.msg[0]?.user_perm=="2"?true:false,
          }

          setPermissions(perm)
          // setMasters(res?.data?.msg[0]?.masters == "Y" ? true : false);
          // setPurchase(res?.data?.msg[0]?.purchase == "Y" ? true : false);
          // setDepartments(res?.data?.msg[0]?.department == "Y" ? true : false);
          // setCategories(res?.data?.msg[0]?.prod_catg == "Y" ? true : false);
          // setProducts(res?.data?.msg[0]?.product == "Y" ? true : false);
          // setGst(res?.data?.msg[0]?.gst == "Y" ? true : false);
          // setClients(res?.data?.msg[0]?.client == "Y" ? true : false);
          // setUnits(res?.data?.msg[0]?.unit == "Y" ? true : false);
          // setVendors(res?.data?.msg[0]?.vendor == "Y" ? true : false);
          // setPermissions(res?.data?.msg[0]?.permission == "Y" ? true : false);
          // setUsers(res?.data?.msg[0]?.comp_user == "Y" ? true : false);
          // setOrders(res?.data?.msg[0]?.client_orders == "Y" ? true : false);
          // setVOrders(res?.data?.msg[0]?.vendor_orders == "Y" ? true : false);
          // setExisting(res?.data?.msg[0]?.existing_po == "Y" ? true : false);
          // setAmend(res?.data?.msg[0]?.amend_po == "Y" ? true : false);
          // setApprove(res?.data?.msg[0]?.approve_po == "Y" ? true : false);
          // setTc(res?.data?.msg[0]?.certificate == "Y" ? true : false);
          // setMrn(res?.data?.msg[0]?.mrn == "Y" ? true : false);
          // setMin(res?.data?.msg[0]?.min == "Y" ? true : false);
          // setReq(res?.data?.msg[0]?.requisition == "Y" ? true : false);
          // setReports(res?.data?.msg[0]?.reports == "Y" ? true : false);
          // setApproveMrn(res?.data?.msg[0]?.approve_mrn == "Y" ? true : false);
          // setApproveReq(res?.data?.msg[0]?.approve_req == "Y" ? true : false);
          // setPReq(res?.data?.msg[0]?.purchase_requisition == "Y" ? true : false);
        });
    });
  }, []);
  
  const onUpdate = () => {
    setLoading(true);
    axios
      .post(url + "/api/add_edit_permissions", {
        user_id: +params.id,
        masters: permissions['M2'] ? "2" :  permissions['M1']?"1": "0",
        purchase_req: permissions['PR2'] ? "2" : permissions['PR1'] ?"1":"0",
        projects: permissions['P2'] ? "2" : permissions['P1']?"1":"0",
        purchase: permissions['PU2'] ? "2" :permissions['PU1']? "1":"0",
        approve_po: permissions['APU2'] ? "2" :permissions['APU1']? "1":"0",
        mrn: permissions['MRN2'] ? "2" : permissions['MRN1']?"1":"0",
        floor_req: permissions['R2'] ? "2" :permissions['R1'] ?"1":"0",
        min: permissions['MIN2'] ? "2" : permissions['MIN1']?"1":"0",
        stock: permissions['S2'] ? "2" : permissions['S1']?"1":"0",
        user_perm: permissions['UPERM2'] ? "2" : permissions['UPERM1']?"1":"0",
        user: localStorage.getItem("email"),
      })
      .then((res) => {
        setLoading(false);
        console.log(res);
        if (res?.data?.suc > 0) {
          Message("success", res?.data?.msg);
        } else {
          Message("error", res?.data?.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/error" + "/" + err.code + "/" + err.message);
      });
  };
  // const onChangeMenu = (e) => {
  //   if (e.target.name == "masters") {
  //     setMasters(e.target.checked);
  //     setDepartments(e.target.checked);
  //     setCategories(e.target.checked);
  //     setProducts(e.target.checked);
  //     setUnits(e.target.checked);
  //     setUsers(e.target.checked);
  //     setVendors(e.target.checked);
  //     setClients(e.target.checked);
  //     setGst(e.target.checked);
  //     setPermissions(e.target.checked);
  //   }
  //   if (e.target.name == "purchase") {
  //     setPurchase(e.target.checked);
  //     setVOrders(e.target.checked);
  //     setExisting(e.target.checked);
  //     setApprove(e.target.checked);
  //     setAmend(e.target.checked);
  //     setTc(e.target.checked);
  //   }
  //   console.log(departments,categories,products,units,permissions,gst,vendors,clients,users)
  //   if(!departments && !categories && !products && !units && !permissions && !gst && !vendors && !clients && !users && e.target.name!='masters'  && e.target.name!='purchase'){
     
  //     setMasters(true)
  //   }
  //   // if(departments && categories && products && units && permissions && gst && vendors && clients && users && e.target.name!='masters' && e.target.name!='purchase'){
  //   //   setMasters(false)
  //   // }
  //   // if(!vendor_orders && !existing && !amend && !approve && e.target.name!='purchase'&& e.target.name!='masters'){
  //   //   setPurchase(true)
  //   // }
  //   // if(vendor_orders && existing && amend && approve && e.target.name!='purchase'&& e.target.name!='masters'){
  //   //   setPurchase(false)
  //   // }
  // };
  const onChangeIc = (e) => {
    console.log("checked = ", e.target.id,e.target.checked);
    setPermissions({...permissions,[e.target.id]:e.target.checked})
  };
  return (
    <section className="bg-transparent dark:bg-[#001529]">
      {/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
      <HeadingTemplate
        text={"Update permissions"}
        mode={1}
        title={"Permissions"}
        onPrinting={()=>{setIsPrinting(false);
          setTimeout(() => {
            reactToPrintFn();
            setIsPrinting(true);
            }, 5);}
          }
        //   data={params.id && data?data:''}
      />
            <BlockComp blocked={blocked}
             template={
                                                                                        <div className='relative  w-full h-full 0 z-10'>
                                                                                          <span className='absolute top-1 right-1 font-bold italic text-gray-500'><LockFilled className='text-green-900 '/> Locked (Readonly)</span>
                                                                                     
                                                                                        </div>
                                                                                      }>
      
      <SpinComp
        loading={loading}
      >
        <div className="w-full bg-white p-6 rounded-2xl">
          <InfoTags text={user_type} color="#014737" bgCol="my-2 text-base"/>
          
          
          <div class="overflow-x-auto">
  <table class="min-w-full border border-gray-300">
    <thead>
      <tr class="bg-gray-200">
        <th class="px-4 py-2 border bg-[#C4F1BE]"></th>
        <th class="px-4 py-2 border bg-[#C4F1BE] text-green-900 font-semibold">View</th>
        <th class="px-4 py-2 border bg-[#C4F1BE] text-green-900 font-semibold">View/Modify</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="px-4 py-2 border font-semibold bg-[#C4F1BE] text-green-900">Master</td>
        <td class="px-4 py-2 border text-center"><Checkbox id="M1" onChange={(e)=>onChangeIc(e)} checked={permissions['M1']}></Checkbox></td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="M2" onChange={(e)=>onChangeIc(e)} checked={permissions['M2']}></Checkbox></td>
      </tr>
      <tr class="bg-gray-100">
        <td class="px-4 py-2 border font-semibold bg-[#C4F1BE] text-green-900">Purchase Requisition</td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="PR1" onChange={(e)=>onChangeIc(e)} checked={permissions['PR1']}></Checkbox></td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="PR2" onChange={(e)=>onChangeIc(e)} checked={permissions['PR2']}></Checkbox></td>
      </tr>
      <tr>
        <td class="px-4 py-2 border font-semibold bg-[#C4F1BE] text-green-900">Projects</td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="P1" onChange={(e)=>onChangeIc(e)} checked={permissions['P1']}></Checkbox></td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="P2" onChange={(e)=>onChangeIc(e)} checked={permissions['P2']}></Checkbox></td>
      </tr>
      <tr class="bg-gray-100">
        <td class="px-4 py-2 border font-semibold bg-[#C4F1BE] text-green-900">Approve PO</td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="APU1" onChange={(e)=>onChangeIc(e)} checked={permissions['APU1']}></Checkbox></td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="APU2" onChange={(e)=>onChangeIc(e)} checked={permissions['APU2']}></Checkbox></td>
      </tr>
      <tr class="bg-gray-100">
        <td class="px-4 py-2 border font-semibold bg-[#C4F1BE] text-green-900">Rest of the Purchase Module</td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="PU1" onChange={(e)=>onChangeIc(e)} checked={permissions['PU1']}></Checkbox></td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="PU2" onChange={(e)=>onChangeIc(e)} checked={permissions['PU2']}></Checkbox></td>
      </tr>
     
      <tr>
        <td class="px-4 py-2 border font-semibold bg-[#C4F1BE] text-green-900">MRN</td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="MRN1" onChange={(e)=>onChangeIc(e)} checked={permissions['MRN1']}></Checkbox></td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="MRN2" onChange={(e)=>onChangeIc(e)} checked={permissions['MRN2']}></Checkbox></td>
      </tr>
      <tr class="bg-gray-100">
        <td class="px-4 py-2 border font-semibold bg-[#C4F1BE] text-green-900">Floor Requisition</td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="R1" onChange={(e)=>onChangeIc(e)} checked={permissions['R1']}></Checkbox></td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="R2" onChange={(e)=>onChangeIc(e)} checked={permissions['R2']}></Checkbox></td>
      </tr>
      <tr>
        <td class="px-4 py-2 border font-semibold bg-[#C4F1BE] text-green-900">Material Issue Note</td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="MIN1" onChange={(e)=>onChangeIc(e)} checked={permissions['MIN1']}></Checkbox></td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="MIN2" onChange={(e)=>onChangeIc(e)} checked={permissions['MIN2']}></Checkbox></td>
      </tr>
      <tr class="bg-gray-100">
        <td class="px-4 py-2 border font-semibold bg-[#C4F1BE] text-green-900">Stock</td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="S1" onChange={(e)=>onChangeIc(e)} checked={permissions['S1']}></Checkbox></td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="S2" onChange={(e)=>onChangeIc(e)} checked={permissions['S2']}></Checkbox></td>
      </tr>
      <tr class="bg-gray-100">
        <td class="px-4 py-2 border font-semibold bg-[#C4F1BE] text-green-900">Users & Permissions</td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="UPERM1" onChange={(e)=>onChangeIc(e)} checked={permissions['UPERM1']}></Checkbox></td>
        <td class="px-4 py-2 border  text-center"><Checkbox id="UPERM2" onChange={(e)=>onChangeIc(e)} checked={permissions['UPERM2']}></Checkbox></td>
      </tr>
    </tbody>
  </table>
  <p class="text-xs text-gray-500 dark:text-gray-300 my-2" id="file_input_help">Once a view/modify checkbox is clicked, the view column is  included automatically, there's no need to check it explicitly</p>
</div>

        
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"
              onClick={() => onUpdate()}
            >
              <span class="relative z-10">
                     <SaveOutlined className='mr-2' />
                     Submit
                     </span>
                     <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
            </button>
          </div>
        </div>
      </SpinComp>
      </BlockComp>

      <div ref={contentRef}  style={{
          display: !isPrinting ? "block" : "none",
        }} >
            <div className="grid  gap-4 p-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
              <PrintHeader/>
            </div>
            <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
              <h2 className="bg-green-500 font-bold text-lg p-3 text-white">Permissions for {user_type}</h2>
              <table className="border-collapse border border-gray-300 w-full">
        <tbody>
         
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Master
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{permissions['M2']==true?'View/Modify':permissions['M1']==true?'View':''}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Purchase Requisition
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{permissions['PR2']==true?'View/Modify':permissions['PR1']==true?'View':''}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Projects
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{permissions['P2']==true?'View/Modify':permissions['P1']==true?'View':''}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Approve PO
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{permissions['APU2']==true?'View/Modify':permissions['APU1']==true?'View':''}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Rest of the purchase module
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{permissions['PU2']==true?'View/Modify':permissions['PU1']==true?'View':''}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                MRN
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{permissions['MRN2']==true?'View/Modify':permissions['MRN1']==true?'View':''}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Floor Requisition
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{permissions['R2']==true?'View/Modify':permissions['R1']==true?'View':''}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Material Issue Note
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{permissions['MIN2']==true?'View/Modify':permissions['MIN1']==true?'View':''}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Stock
              </td>
              <td className="border text-gray-600 border-gray-300 p-2">{permissions['S2']==true?'View/Modify':permissions['S1']==true?'View':''}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Created By
              </td>
              <td className="border border-gray-300 p-2 text-gray-600 ">{created_by}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Created At
              </td>
              <td className="border border-gray-300 text-gray-600 p-2">{created_at}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Modified By
              </td>
              <td className="border border-gray-300 text-gray-600 p-2">{modified_by}</td>
            </tr>
            <tr  className="border border-gray-300">
              <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                Modified At
              </td>
              <td className="border border-gray-300 text-gray-600 p-2">{modified_at}</td>
            </tr>
          
        </tbody>
      </table>
     
          </div>
            </div>
            </div>
    </section>
  );
}

export default PermissionsForm;
