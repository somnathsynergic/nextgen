import React, { useState } from 'react'
import { Drawer } from 'antd';
import VendorMaster from './MasterDrawer/VendorMaster';
import ProjectMaster from './MasterDrawer/ProjectMaster';
import ProductMaster from './MasterDrawer/ProductMaster';
import ClientMaster from './MasterDrawer/ClientMaster';
import UnitMaster from './MasterDrawer/UnitMaster';
import GSTMaster from './MasterDrawer/GSTMaster';
import Docs from './MasterDrawer/Docs';
import VendorMDCC from './MasterDrawer/VendorMDCC';
import ForgotPass from './ForgotPass';
function DrawerComp({open,onClose,flag,data}) {
  console.log(data)
  const [loading,setLoading] = useState(false)
  return (
    <Drawer keyboard={loading?false:true} maskClosable={loading?false:true} closeIcon={loading?false:true} width={flag!=7 && flag!=8?900:300} title={flag==1?"Add Vendor":flag==2?"Add Project":flag==3?"Add Item":flag==4?"Add Client":flag==5?"Add Unit":flag==6?"Add GST":flag==7?'Upload/View Vendor Receipt (PO: '+data.po+')':flag==8?'Upload/View Vendor MDCC (PO: '+data.po+')':'Reset Password'} onClose={onClose} open={open}>
    {flag==1 && <VendorMaster onClose={onClose}  onLoading={(loading)=>setLoading(loading)}/>}
    {flag==2 && <ProjectMaster onClose={onClose}  onLoading={(loading)=>setLoading(loading)}/>}
    {flag==3 && <ProductMaster onClose={onClose}  onLoading={(loading)=>setLoading(loading)}/>}
    {flag==4 && <ClientMaster onClose={onClose}  onLoading={(loading)=>setLoading(loading)}/>}
    {flag==5 && <UnitMaster onClose={onClose}  onLoading={(loading)=>setLoading(loading)}/>}
    {flag==6 && <GSTMaster onClose={onClose}  onLoading={(loading)=>setLoading(loading)}/>}
    {flag==7 && <Docs onClose={onClose} data={data}  onLoading={(loading)=>setLoading(loading)}/>}
    {flag==8 && <VendorMDCC onClose={onClose} data={data} onLoading={(loading)=>setLoading(loading)}/>}
    {flag==9 && <ForgotPass onClose={onClose} data={data}  onLoading={(loading)=>setLoading(loading)}/>}
  </Drawer>
  )
}

export default DrawerComp
