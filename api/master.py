from fastapi import APIRouter, FastAPI, Depends, File, UploadFile, Form,Request
from typing import Optional, Union, Annotated
from enum import Enum
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from api.db_log import user_log_update
import uvicorn
from models.masterApiModel import db_select, db_Insert, db_Delete,db_Reset
from datetime import datetime
import datetime as dt
import random
from models.utils import get_hashed_password, verify_password
import json
import os
from typing import List
# from fastapi import APIRouter, FastAPI, Depends, File, UploadFile, Form, Optional
masterRouter = APIRouter()

UPLOAD_POC_FOLDER = "upload_file/upload_poc"
os.makedirs(UPLOAD_POC_FOLDER, exist_ok=True)

UPLOAD_FOLDER = "upload_file"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# app.mount("/uploads", StaticFiles(directory="upload_file"), name="uploads"

class getMaster(BaseModel):
    id:int
    name:str
    user:str

class getData(BaseModel):
    id:int

class getDataPg(BaseModel):
    id:int
    offset:int
    limit:int

class ProductSrch(BaseModel):
    searchVal:str

class VendorSrch(BaseModel):
    searchVal:str

class getMenu(BaseModel):
    email:str

class deleteData(BaseModel):
    id:int
    user:str
class getPocId(BaseModel):
    client_id:int

class getGst(BaseModel):
    gst_id:int
    gst_type:str
    gst_rate:float
    user:str

class addProduct(BaseModel):
      p_id:int
      p_cat:str
      p_name: str
      p_make:str
      p_part:str
      p_model:str
      p_article:str
      p_detailed:str
      p_hsn:str
      user:str
class addUser(BaseModel):
      u_id:int
      u_name: str
      u_dept:str
      u_desig:str
      u_loc:str
      u_type:str
    #   u_permission:str
      u_email:str
      u_phone:str
      user:str

class addPoc(BaseModel):
      sl_no:int
      poc_name:str
      poc_designation:str
      poc_department:str
      poc_email:str
      poc_direct_no:str
      poc_ext_no:str
      poc_ph_1:str
      poc_ph_2:str
    #   poc_doc:Optional[Union[UploadFile, None]] = None
    #   poc_address:str
      poc_location:str

class addClientLoc(BaseModel):
      sl_no:int
      c_gst:str
      c_pan:str
      c_location:str

class addClient(BaseModel):
      c_id:int
      c_name: str
      c_vendor_code:str
      c_loc:list[addClientLoc]
      c_poc:list[addPoc] 
      user:str

class approvePO(BaseModel):
    id:int
    status:str
    reason:str
    user:str

class addVPoc(BaseModel):
      sl_no:int
      poc_name:str
      poc_ph_1:str
      poc_ph_2:str
      poc_email:str
class addDeals(BaseModel):
      sl_no:int
      category_id:int
class addBank(BaseModel):
      sl_no:int
      v_banknm:str
      v_brnnm:str
      v_ifsc:str
      v_micr:str
      v_ac:str
class addVendor(BaseModel):
      v_id:int
      v_type:str
      v_name: str
      v_phone:str
      v_email:str
      v_gst:str
      v_pan:str
      v_phone:str
      v_email:str
      v_deals:list[addDeals]
      msme_flag:str 
      msme_no:Optional[str] = None
      
      v_bank:list[addBank]
      tan_no:str 
      tds_flag:str 
      tcs_flag:str 
      tds_prtg:Optional[float] = None
      tcs_prtg:Optional[float] = None 
      supply_flag:str 
      composite:Optional[str] = None
      e_r_supply:Optional[str] = None
      state:Optional[str] = None
      v_poc:list[addVPoc] 
      v_address:str
      user:str

class Permission(BaseModel):
    user_id: int
    masters: str
    purchase_req: str
    projects: str
    purchase: str
    approve_po: str
    mrn: str
    floor_req: str
    min: str
    stock: str
    user_perm:str
    user: str
   
pass_alphabets=[
    'A','B','C','D','E','F','G','H','I','J','K','L',
    'M','N','O','P','Q','R','S','T','U','V','W','X',
    'Y','Z','a','b','c','d','e','f','g','h','i','j',
    'k','l','m','n','o','p','q','r','s','t','u','v',
    'w','x','y','z','1','2','3','4','5','6','7','8',
    '9','0','/','*','+','~','@','#','%','^','&','//'
    ]
class getProfile(BaseModel):
    id:str
class getPhrase(BaseModel):
    wrd:str

@masterRouter.post('/addcategory')
async def addcategory(dt:getMaster):
    print(dt)
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    fields= f'catg_name,created_by,created_at'
    values = f'"{dt.name}","{dt.user}","{formatted_dt}"'
    table_name = "md_category"
    whr =  None
    flag = 1 if dt.id>0 else 0
    if(dt.id==0):
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": "Category saved successfully!"}
        else:
            res_dt = {"suc": 0, "msg": "Error while saving!"}

        await user_log_update(dt.user,'N','md_category',formatted_dt,result['lastId'])
        
    else:
        print(flag)
        fields=f'catg_name="{dt.name}",modified_by="{dt.user}",modified_at="{formatted_dt}"'
        whr=f'sl_no="{dt.id}"'
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": "Category updated successfully!"}
        else:
            res_dt = {"suc": 0, "msg": "Error while updating!"}

        await user_log_update(dt.user,'E','md_category',formatted_dt,dt.id)
        
    return res_dt

@masterRouter.post('/getcategory')
async def getcategory(id:getData):
    print('I am logging in!')
    print(id.id)
    res_dt = {}
    # SELECT @a:=@a+1 serial_number, busi_act_name FROM md_busi_act, (SELECT @a:= 0) AS a
    select = "@a:=@a+1 serial_number, catg_name, created_by,created_at,modified_by,modified_at,sl_no"
    # select = "@a:=@a+1 serial_number, *"
    schema = "md_category,(SELECT @a:= 0) AS a"
    where = f"sl_no='{id.id}'" if id.id>0 else f"delete_flag='N'"
    order = "ORDER BY created_at DESC"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@masterRouter.post('/getCatWithProd')
async def getCatWithProd(id:getData):
    print(id.id)
    res_dt = {}

    # select = "@a:=@a+1 serial_number, prod_name,prod_cat,prod_make,part_no,model_no,article_no,hsn_code,prod_desc,created_by,created_at,modified_by,modified_at,sl_no"
    select = "*"

    # schema = "md_product,(SELECT @a:= 0) AS a"
    schema = "md_product"
    where = f"prod_cat='{id.id}'" 
    order = "ORDER BY created_at DESC"
    flag = 1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@masterRouter.post('/deletecategory')
async def deletecategory(id:deleteData):
   current_datetime = datetime.now()
   res_dt={}
   formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")

   select = "count(*) as cnt"
   schema = "md_product"
   where = f"prod_cat='{id.id}'"
   order = ""
   flag = 0 if id.id>0 else 1
   result = await db_select(select, schema, where, order, flag)
   print(result['msg']['cnt'])
   if result['msg']['cnt']==0:
        fields=f'delete_flag="Y",deleted_by="{id.user}",deleted_at="{formatted_dt}"'
        table_name = "md_category"
        flag = 1 
        values=''
        whr=f'sl_no="{id.id}"'
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
                res_dt = {"suc": 1, "msg": "Category deleted successfully!"}
        else:
                res_dt = {"suc": 0, "msg": "Error while deleting!"}
        
   else:
            res_dt = {"suc": 0, "msg": "Item cannot be deleted, it is already in use!"}
       
   return res_dt

@masterRouter.post('/addgst')
async def addcategory(dt:getGst):
    print(dt)
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    fields= f'gst_type,gst_rate,created_by,created_at'
    values = f'"{dt.gst_type}","{dt.gst_rate}","{dt.user}","{formatted_dt}"'
    table_name = "md_gst"
    whr =  None
    flag = 1 if dt.gst_id>0 else 0
    if(dt.gst_id==0):
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": "GST saved successfully!"}
        else:
            res_dt = {"suc": 0, "msg": "Error while saving!"}
        await user_log_update(dt.user,'N','md_gst',formatted_dt,result['lastId'])
    
    else:
        print(flag)
        fields=f'gst_type="{dt.gst_type}",gst_rate="{dt.gst_rate}",modified_by="{dt.user}",modified_at="{formatted_dt}"'
        whr=f'sl_no="{dt.gst_id}"'
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": "GST updated successfully!"}
        else:
            res_dt = {"suc": 0, "msg": "Error while updating!"}
        await user_log_update(dt.user,'E','md_gst',formatted_dt,dt.gst_id)
        
    return res_dt



@masterRouter.post('/reset_db')
async def addcategory(dt:getData):
   
    result = await db_Reset()
    if(result['suc']>0):
        res_dt = {"suc": 1, "msg": "Reset successfully!"}
    else:
        res_dt = {"suc": 0, "msg": "Error while resetting!"}

    return res_dt

@masterRouter.post('/getgst')
async def getcategory(id:getData):
    print('I am logging in!')
    print(id.id)
    res_dt = {}
    # SELECT @a:=@a+1 serial_number, busi_act_name FROM md_busi_act, (SELECT @a:= 0) AS a
    select = "@a:=@a+1 serial_number,gst_type,gst_rate, created_by,created_at,modified_by,modified_at,sl_no"
    # select = "@a:=@a+1 serial_number, *"
    schema = "md_gst,(SELECT @a:= 0) AS a"
    where = f"sl_no='{id.id}'" if id.id>0 else f"delete_flag='N'"
    order = "ORDER BY created_at DESC"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@masterRouter.post('/deletegst')
async def deletecategory(id:deleteData):
   current_datetime = datetime.now()
   res_dt={}
   formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")

   fields=f'delete_flag="Y",deleted_by="{id.user}",deleted_at="{formatted_dt}"'
   table_name = "md_gst"
   flag = 1 
   values=''
   whr=f'sl_no="{id.id}"'
   result = await db_Insert(table_name, fields, values, whr, flag)
   if(result['suc']>0):
        res_dt = {"suc": 1, "msg": "GST deleted successfully!"}
   else:
        res_dt = {"suc": 0, "msg": "Error while deleting!"}

   await user_log_update(id.user,'D','md_gst',formatted_dt,id.id)
    
       
   return res_dt


@masterRouter.post('/addunit')
async def addunit(dt:getMaster):
    print(dt)
    res_dt = {}
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    fields= f'unit_name,created_by,created_at'
    values = f'"{dt.name}","{dt.user}","{formatted_dt}"'
    table_name = "md_unit"
    whr =  None
    flag = 1 if dt.id>0 else 0

    if(dt.id==0):
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": "Unit saved successfully!"}
        else:
            res_dt = {"suc": 0, "msg": "Error while saving!"}

        await user_log_update(dt.user,'N','md_unit',formatted_dt,result['lastId'])
        
    else:
        print(flag)
        fields=f'unit_name="{dt.name}",modified_by="{dt.user}",modified_at="{formatted_dt}"'
        whr=f'sl_no="{dt.id}"'
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": "Unit updated successfully!"}
        else:
            res_dt = {"suc": 0, "msg": "Error while updating!"}

        await user_log_update(dt.user,'E','md_unit',formatted_dt,dt.id)

        
    return res_dt

@masterRouter.post('/getunit')
async def getunit(id:getData):
    print('I am logging in!')
    print(id.id)
    res_dt = {}

    select = "@a:=@a+1 serial_number, unit_name, created_by,created_at,modified_by,modified_at,sl_no"
    schema = "md_unit,(SELECT @a:= 0) AS a"
    where = f"sl_no='{id.id}'" if id.id>0 else f"delete_flag='N'"
    order = "ORDER BY created_at DESC"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@masterRouter.post('/deleteunit')
async def deleteunit(id:deleteData):
   current_datetime = datetime.now()
   res_dt={}
   formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
   fields=f'delete_flag="Y",deleted_by="{id.user}",deleted_at="{formatted_dt}"'
   table_name = "md_unit"
   flag = 1 
   values=''
   whr=f'sl_no="{id.id}"'
   result = await db_Insert(table_name, fields, values, whr, flag)
   if(result['suc']>0):
        res_dt = {"suc": 1, "msg": "Unit deleted successfully!"}
   else:
        res_dt = {"suc": 0, "msg": "Error while deleting!"}

   await user_log_update(id.user,'D','md_unit',formatted_dt,id.id)
    
   return res_dt
@masterRouter.post('/adddept')
async def adddepartment(dt:getMaster):
    print(dt)
    res_dt = {}

    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    fields= f'dept_name,created_by,created_at'
    values = f'"{dt.name}","{dt.user}","{formatted_dt}"'
    table_name = "md_department"
    whr =  None
    flag = 1 if dt.id>0 else 0

    if(dt.id==0):
        result = await db_Insert(table_name, fields, values, whr, flag)
        print(result)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": "Department saved successfully!"}
        else:
            res_dt = {"suc": 0, "msg": result['msg']}

        await user_log_update(dt.user,'N','md_department',formatted_dt,result['lastId'])
    else:
        print(flag)
        fields=f'dept_name="{dt.name}",modified_by="{dt.user}",modified_at="{formatted_dt}"'
        whr=f'sl_no="{dt.id}"'
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": "Department updated successfully!"}
        else:
            res_dt = {"suc": 0, "msg": result['msg']}
        await user_log_update(dt.user,'E','md_department',formatted_dt,dt.id)

    return res_dt

@masterRouter.post('/getdept')
async def getdept(id:getData):
    print('I am logging in!')
    print(id.id)
    res_dt = {}

    select = "@a:=@a+1 serial_number, dept_name, created_by,created_at,modified_by,modified_at,sl_no"
    schema = "md_department,(SELECT @a:= 0) AS a"
    where = f"sl_no='{id.id}'" if id.id>0 else f"delete_flag='N'"
    order = "ORDER BY created_at DESC"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@masterRouter.post('/deletedept')
async def deletedept(id:deleteData):
   current_datetime = datetime.now()
   res_dt={}
   formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")

   select = "count(*) as cnt"
   schema = "md_user"
   where = f"user_dept='{id.id}'"
   order = ""
   flag = 0 if id.id>0 else 1
   result = await db_select(select, schema, where, order, flag)
   print(result['msg']['cnt'])
   if result['msg']['cnt']==0:
        fields=f'delete_flag="Y",deleted_by="{id.user}",deleted_at="{formatted_dt}"'
        table_name = "md_department"
        flag = 1 
        values=''
        whr=f'sl_no="{id.id}"'
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
                res_dt = {"suc": 1, "msg": "Department deleted successfully!"}
        else:
                res_dt = {"suc": 0, "msg": "Error while deleting!"}

        await user_log_update(id.user,'D','md_department',formatted_dt,id.id)
        
        return res_dt
    
   else:
         res_dt = {"suc": 0, "msg": "Item cannot be deleted, it is already in use!"} 
   return res_dt

@masterRouter.post('/adddesig')
async def adddesignation(dt:getMaster):
    print(dt)
    res_dt = {}

    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    fields= f'desig_name,created_by,created_at'
    values = f'"{dt.name}","{dt.user}","{formatted_dt}"'
    table_name = "md_designation"
    whr =  None
    flag = 1 if dt.id>0 else 0

    if(dt.id==0):
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": "Designation saved successfully!"}
        else:
            res_dt = {"suc": 0, "msg": "Error while saving!"}
    else:
        print(flag)
        fields=f'desig_name="{dt.name}",modified_by="{dt.user}",modified_at="{formatted_dt}"'
        whr=f'sl_no="{dt.id}"'
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": "Designation updated successfully!"}
        else:
            res_dt = {"suc": 0, "msg": "Error while updating!"}
    return res_dt

@masterRouter.post('/getdesig')
async def getunit(id:getData):
    print('I am logging in!')
    print(id.id)
    res_dt = {}

    select = "@a:=@a+1 serial_number, desig_name, created_by,created_at,modified_by,modified_at,sl_no"
    schema = "md_designation,(SELECT @a:= 0) AS a"
    where = f"sl_no='{id.id}'" if id.id>0 else f"delete_flag='N'"
    order = "ORDER BY created_at DESC"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@masterRouter.post('/deletedesig')
async def deletedesig(id:deleteData):
   current_datetime = datetime.now()
   res_dt={}
   formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
   select = "count(*) as cnt"
   schema = "md_user"
   where = f"user_desig='{id.id}'"
   order = ""
   flag = 0 if id.id>0 else 1
   result = await db_select(select, schema, where, order, flag)
   print(result['msg']['cnt'])
   if result['msg']['cnt']==0:
        fields=f'delete_flag="Y",deleted_by="{id.user}",deleted_at="{formatted_dt}"'
        table_name = "md_designation"
        flag = 1 
        values=''
        whr=f'sl_no="{id.id}"'
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
                res_dt = {"suc": 1, "msg": "Designation deleted successfully!"}
        else:
                res_dt = {"suc": 0, "msg": "Error while deleting!"}
   else:
        res_dt = {"suc": 0, "msg": "Item cannot be deleted, it is already in use!"}
       
   return res_dt

# @masterRouter.post('/addvendor')
# async def addvendor(data:addVendor):
#     print(data)
#     res_dt = {}

#     current_datetime = datetime.now()
#     formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
#     fields= f'vendor_name,vendor_email,vendor_contact,vendor_phone,vendor_gst,vendor_pan,vendor_reg,vendor_remarks, vendor_address,created_by,created_at'
#     values = f'"{data.v_name}","{data.v_email}","{data.v_contact}","{data.v_phone}","{data.v_gst}","{data.v_pan}","{data.v_reg}","{data.v_remarks}","{data.v_address}","{data.user}","{formatted_dt}"'
#     table_name = "md_vendor"
#     whr =  None
#     flag = 1 if data.v_id>0 else 0

#     if(data.v_id==0):
#         result = await db_Insert(table_name, fields, values, whr, flag)
#         if(result['suc']>0):
#             res_dt = {"suc": 1, "msg": "Vendor saved successfully!"}
#         else:
#             res_dt = {"suc": 0, "msg": "Error while saving!"}
#     else:
#         print(flag)
#         fields=f'vendor_name="{data.v_name}",vendor_email="{data.v_email}",vendor_contact="{data.v_contact}",vendor_phone="{data.v_phone}",vendor_gst="{data.v_gst}",vendor_pan="{data.v_pan}",vendor_reg="{data.v_reg}",vendor_remarks="{data.v_remarks}",vendor_address="{data.v_address}",modified_by="{data.user}",modified_at="{formatted_dt}"'
#         whr=f'sl_no="{data.v_id}"'
#         result = await db_Insert(table_name, fields, values, whr, flag)
#         if(result['suc']>0):
#             res_dt = {"suc": 1, "msg": "Vendor updated successfully!"}
#         else:
#             res_dt = {"suc": 0, "msg": "Error while updating!"}
#     return res_dt

@masterRouter.post('/getvendor')
async def getvendor(id:getData):
    print(id.id)
    res_dt = {}

    select = "@a:=@a+1 serial_number,sl_no,vendor_name,vendor_type,vendor_email,vendor_phone,vendor_gst,vendor_pan,vendor_address,msme_flag,msme_no,org_type,tan_no,tcs_flag,tds_flag,tds_prtg,tcs_prtg,state,supply_flag,e_r_supply,bank_details,created_by,created_at,modified_by,modified_at"
    schema = "md_vendor,(SELECT @a:= 0) AS a"
    where = f"sl_no='{id.id}'" if id.id>0 else f"delete_flag='N'"
    order = "ORDER BY created_at DESC"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result


@masterRouter.post('/getvendor_pg')
async def getvendor(id:getDataPg):
    print(id.id)
    res_dt = {}
    select = "count(*) as total_count"
    schema = "md_vendor "
    where = f""
    order = f""
    flag = 0 if id.id>0 else 1
    result1 = await db_select(select, schema, where, order, flag)


    select = "@a:=@a+1 serial_number,sl_no,vendor_name,vendor_type,vendor_email,vendor_phone,vendor_gst,vendor_pan,vendor_address,msme_flag,msme_no,org_type,tan_no,tcs_flag,tds_flag,tds_prtg,tcs_prtg,state,supply_flag,e_r_supply,bank_details,created_by,created_at,modified_by,modified_at"
    schema = "md_vendor,(SELECT @a:= 0) AS a"
    where = f"sl_no='{id.id}'" if id.id>0 else f"delete_flag='N'"
    order = f"ORDER BY created_at DESC LIMIT {id.limit} OFFSET {id.offset}"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    # return result
    return {"total_count": result1, "vendors": result}

@masterRouter.post('/getvendorbank')
async def getvendorbank(id:getData):
    print(id.id)
    res_dt = {}

    select = "*"
    schema = "md_vendor_bank"
    where = f"vendor_id='{id.id}'" if id.id>0 else ""
    order = ""
    # flag = 1 if id.id>0 else 0
    flag = 1 if id.id>0 else 0
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result

@masterRouter.post('/getvendordeals')
async def getvendordeals(id:getData):
    print(id.id)
    res_dt = {}

    select = "*"
    schema = "md_vendor_deals"
    where = f"vendor_id='{id.id}'" if id.id>0 else ""
    order = ""
    flag = 1 if id.id>0 else 0
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result

@masterRouter.post('/getvendordealsinfo')
async def getvendordealsinfo(id:getData):
    print(id.id)
    res_dt = {}

    select = "v.sl_no,v.category_id,v.vendor_id,v.created_at,v.created_by,v.modified_at,v.modified_by,c.catg_name as name"
    schema = "md_vendor_deals v, md_category c"
    where = f"v.vendor_id='{id.id}' and v.category_id=c.sl_no" if id.id>0 else "v.category_id=c.sl_no"
    order = ""
    flag = 1 if id.id>0 else 0
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result

@masterRouter.post('/deletevendor')
async def deletevendor(id:deleteData):
   current_datetime = datetime.now()
   res_dt={}
   formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
   fields=f'delete_flag="Y",deleted_by="{id.user}",deleted_at="{formatted_dt}"'
   table_name = "md_vendor"
   flag = 1 
   values=''
   whr=f'sl_no="{id.id}"'
   result = await db_Insert(table_name, fields, values, whr, flag)
   if(result['suc']>0):
        res_dt = {"suc": 1, "msg": "Vendor deleted successfully!"}
   else:
        res_dt = {"suc": 0, "msg": "Error while deleting!"}
   return res_dt

@masterRouter.post('/addproduct')
async def addproduct(data:addProduct):
    print(data, f'''"{'\\"'.join(data.p_detailed.split('"'))}"''', '---------------------')
    res_dt = {}

    p_detailed = data.p_detailed.replace('"', '\\"')
    p_name = data.p_name.replace('"', '\\"')
    p_make = data.p_make.replace('"', '\\"')
    print(p_detailed, p_name, p_make, '---------------------')
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    fields= f'prod_name,prod_cat,prod_make,part_no,model_no,article_no,hsn_code, prod_desc,created_by,created_at'
    values = f'''"{p_name}","{data.p_cat}","{p_make}","{data.p_part}","{data.p_model}","{data.p_article}","{data.p_hsn}","{p_detailed}","{data.user}","{formatted_dt}"'''
    table_name = "md_product"
    whr =  None
    flag = 1 if data.p_id>0 else 0

    if(data.p_id==0):
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": "Product saved successfully!"}
        else:
            res_dt = {"suc": 0, "msg": "Error while saving!"}

        # await user_log_update(dt.user,'E','md_gst',formatted_dt,dt.gst_id)
        await user_log_update(data.user,'N','md_product',formatted_dt,result['lastId'])

        
    else:
        print(flag)
        fields=f'''prod_name="{p_name}",prod_cat="{data.p_cat}",prod_make="{p_make}",part_no="{data.p_part}",model_no="{data.p_model}",article_no="{data.p_article}",hsn_code="{data.p_hsn}",prod_desc="{p_detailed}",modified_by="{data.user}",modified_at="{formatted_dt}"'''
        whr=f'sl_no="{data.p_id}"'
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": "Product updated successfully!"}
        else:
            res_dt = {"suc": 0, "msg": "Error while updating!"}

        await user_log_update(data.user,'E','md_product',formatted_dt,data.p_id)
        
    return res_dt

@masterRouter.post('/getproduct')
async def getproduct(id:getData):
    print(id.id)
    select = "@a:=@a+1 serial_number, p.prod_name,p.prod_cat,p.prod_make,p.part_no,p.model_no,p.article_no,p.hsn_code,p.prod_desc,p.created_by,p.created_at,p.modified_by,p.modified_at,p.sl_no,c.catg_name"

    schema = "md_product p,md_category c,(SELECT @a:= 0) AS a"
    where = f"p.sl_no='{id.id}' and p.prod_cat=c.sl_no" if id.id>0 else f"p.delete_flag='N' and p.prod_cat=c.sl_no"
    order = "ORDER BY p.created_at DESC"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result

@masterRouter.post('/getproduct_pg')
async def getproduct(id:getDataPg):
    print(id.id)
    select = "count(*) as total_count"
    schema = "md_product "
    where = f""
    order = f""
    flag = 0 if id.id>0 else 1
    result1 = await db_select(select, schema, where, order, flag)


    select = "@a:=@a+1 serial_number, p.prod_name,p.prod_cat,p.prod_make,p.part_no,p.model_no,p.article_no,p.hsn_code,p.prod_desc,p.created_by,p.created_at,p.modified_by,p.modified_at,p.sl_no,c.catg_name"

    schema = "md_product p,md_category c,(SELECT @a:= 0) AS a"
    where = f"p.sl_no='{id.id}' and p.prod_cat=c.sl_no" if id.id>0 else f"p.delete_flag='N' and p.prod_cat=c.sl_no"
    order = f"ORDER BY p.created_at DESC LIMIT {id.limit} OFFSET {id.offset}"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    # return result
    return {"total_count": result1, "products": result}



@masterRouter.post('/searchproduct')
async def getproduct(id:ProductSrch):
    
    select = "sl_no,prod_name,model_no,article_no,part_no,prod_make,prod_desc"
    schema = "md_product"
    where =  f"prod_name LIKE '%{id.searchVal}%' or part_no LIKE '%{id.searchVal}%' or article_no LIKE '%{id.searchVal}%' or model_no LIKE '%{id.searchVal}%' or prod_make LIKE '%{id.searchVal}%' or prod_desc LIKE '%{id.searchVal}%'"
    order = f"ORDER BY created_at DESC"
    flag = 1
    result = await db_select(select, schema, where, order, flag)
    # return { "projects": result}
    return result

@masterRouter.post('/searchproduct')
async def getproduct(id:VendorSrch):
    
    select = "sl_no,vendor_name,vendor_email,vendor_phone,vendor_gst,vendor_pan,vendor_address"
    schema = "md_vendor"
    where =  f"vendor_name LIKE '%{id.searchVal}%' "
    order = f"ORDER BY created_at DESC"
    flag = 1
    result = await db_select(select, schema, where, order, flag)
    # return { "projects": result}
    return result



@masterRouter.post('/deleteproduct')
async def deleteproduct(id:deleteData):
   current_datetime = datetime.now()
   res_dt={}
   formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
   fields=f'delete_flag="Y",deleted_by="{id.user}",deleted_at="{formatted_dt}"'
   table_name = "md_product"
   flag = 1 
   values=''
   whr=f'sl_no="{id.id}"'
   result = await db_Insert(table_name, fields, values, whr, flag)
   if(result['suc']>0):
        res_dt = {"suc": 1, "msg": "Product deleted successfully!"}
   else:
        res_dt = {"suc": 0, "msg": "Error while deleting!"}
   return res_dt

@masterRouter.post('/adduser')
async def adduser(data:addUser):
    print(data)
    res_dt = {}

    current_datetime = datetime.now()
    password=random.choice(pass_alphabets)+random.choice(pass_alphabets)+random.choice(pass_alphabets)+random.choice(pass_alphabets)+random.choice(pass_alphabets)+random.choice(pass_alphabets)
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    fields= f'user_name,user_location,user_dept,user_desig,user_phone,user_email,user_password, user_type,first_login_flag,created_by,created_at'
    values = f'"{data.u_name}","{data.u_loc}","{data.u_dept}","{data.u_desig}","{data.u_phone}","{data.u_email}","{get_hashed_password("1234")}","{data.u_type}","Y","{data.user}","{formatted_dt}"'
    table_name = "md_user"
    whr =  None
    flag = 1 if data.u_id>0 else 0

    if(data.u_id==0):
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": "User saved successfully!"}
        else:
            res_dt = {"suc": 0, "msg": "Error while saving!"}

        await user_log_update(data.user,'N','md_user',formatted_dt,result['lastId'])
        
    else:
        print(flag)
        fields=f'user_name="{data.u_name}",user_location="{data.u_loc}",user_dept="{data.u_dept}",user_desig="{data.u_desig}",user_phone="{data.u_phone}",user_email="{data.u_email}",user_type="{data.u_type}",modified_by="{data.user}",modified_at="{formatted_dt}"'
        whr=f'sl_no="{data.u_id}"'
        result = await db_Insert(table_name, fields, values, whr, flag)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": "User updated successfully!"}
        else:
            res_dt = {"suc": 0, "msg": "Error while updating!"}

        await user_log_update(data.user,'E','md_user',formatted_dt,data.u_id)
        
    return res_dt


@masterRouter.post('/getuser')
async def getuser(id:getData):
    print(id.id)
    res_dt = {}

    select = "@a:=@a+1 serial_number, user_name,user_location,user_dept,user_desig,user_phone,user_email,user_password, user_type,first_login_flag,user_profile_pic,created_by,created_at,modified_by,modified_at,sl_no,active_flag"

    schema = "md_user,(SELECT @a:= 0) AS a"
    where = f"sl_no='{id.id}'" if id.id>0 else f"delete_flag='N'"
    order = "ORDER BY created_at DESC"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@masterRouter.post('/deleteuser')
async def deleteuser(id:deleteData):
   current_datetime = datetime.now()
   res_dt={}
   formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
   fields=f'delete_flag="Y",deleted_by="{id.user}",deleted_at="{formatted_dt}"'
   table_name = "md_user"
   flag = 1 
   values=''
   whr=f'sl_no="{id.id}"'
   result = await db_Insert(table_name, fields, values, whr, flag)
   if(result['suc']>0):
        res_dt = {"suc": 1, "msg": "User deleted successfully!"}
   else:
        res_dt = {"suc": 0, "msg": "Error while deleting!"}
   return res_dt

@masterRouter.post('/addclient')
# poc_doc: Optional[List[UploadFile]] = File(None)
# poc_doc:List[UploadFile] = File(...)
# async def addclient(request: Request,client_data:str = Form(...), poc_doc: Optional[List[UploadFile]] = File(None)):
async def addclient(request: Request,client_data:str = Form(...)):
    res_dt = {}  
    # print('poc_doc_outside=',request)
    data = json.loads(client_data)
    form_data = await request.form()
    files = []
    for key, value in form_data.items():
        if key.startswith("poc_doc[") :
            files.append(value)

    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    fields= f'client_name="{data['c_name']}",vendor_code="{data['c_vendor_code']}",modified_by="{data['user']}",modified_at="{formatted_dt}"' if data['c_id'] > 0 else f'client_name,vendor_code,created_by,created_at'
    values = f'"{data['c_name']}","{data['c_vendor_code']}","{data['user']}","{formatted_dt}"'
    table_name = "md_client"
    whr = f'sl_no="{data['c_id']}"' if data['c_id'] > 0 else None
    flag = 1 if data['c_id']>0 else 0

    result = await db_Insert(table_name, fields, values, whr, flag)

    lastID=data['c_id'] if data['c_id']>0 else result["lastId"]

   


    # del_table_name = 'md_client_poc'
    # del_whr = f"sl_no not in()"
    # del_qry = await db_Delete(del_table_name, del_whr)
    # return data['c_loc']

    if(data['c_id'] > 0):
        loc_ids = ",".join(str(dt['sl_no']) for dt in data['c_loc'])
        try:
            del_table_name = 'md_client_loc'
            del_whr = f"client_id = {lastID} AND sl_no not in({loc_ids})"
            del_qry = await db_Delete(del_table_name, del_whr)
        except:
            print('Error while delete md_client_loc')

    for c in data['c_loc']:
        fields= f'c_loc="{c['c_location']}",c_gst="{c['c_gst']}",c_pan="{c['c_pan']}",modified_by="{data['user']}",modified_at="{formatted_dt}"' if c['sl_no'] > 0 else f'client_id,c_loc,c_gst,c_pan,created_by,created_at'
        values = f'"{lastID}","{c['c_location']}","{c['c_gst']}","{c['c_pan']}","{data['user']}","{formatted_dt}"'
        table_name = "md_client_loc"
        whr =  f'sl_no="{c['sl_no']}"' if c['sl_no'] > 0 else None
        flag1 = 1 if c['sl_no']>0 else 0
        result = await db_Insert(table_name, fields, values, whr, flag1)


    if(data['c_id'] > 0):
        poc_ids = ",".join(str(dt['sl_no']) for dt in data['c_poc'])
        try:
            del_table_name = 'md_client_poc'
            del_whr = f"client_id = {lastID} AND sl_no not in({poc_ids})"
            del_qry = await db_Delete(del_table_name, del_whr)

        except:
            print('Error while delete md_client_poc')
   
    index = 0
    for c in data['c_poc']:
        fileName = ''
        print('files=',files)
        try:
            fileName = '' if not files[index] else  await uploadfileToLocal(files[index], UPLOAD_POC_FOLDER)
            print('file_name=',fileName)
        except Exception as e:
            print(e, '///////////////////////////////')
            fileName = ""
        finally:
            if fileName:
                 fileName = f"upload_poc/{fileName}"

        fields= f'poc_name="{c['poc_name']}",poc_email="{c['poc_email']}",poc_designation="{c['poc_designation']}",poc_department="{c['poc_department']}",poc_direct_no="{c['poc_direct_no']}",poc_ext_no="{c['poc_ext_no']}", poc_ph_1="{c['poc_ph_1']}",poc_ph_2="{c['poc_ph_2']}",poc_location="{c['poc_location']}" {f", poc_file = '{fileName}'" if fileName != '' else ''},modified_by="{data['user']}",modified_at="{formatted_dt}"' if c['sl_no'] > 0 else f'client_id,poc_name,poc_email,poc_designation,poc_department,poc_direct_no,poc_ext_no,poc_ph_1,poc_ph_2,poc_location {f", poc_file" if fileName != '' else ''},created_by,created_at'
        values = f'"{lastID}","{c['poc_name']}","{c['poc_email']}","{c['poc_designation']}","{c['poc_department']}","{c['poc_direct_no']}","{c['poc_ext_no']}","{c['poc_ph_1']}","{c['poc_ph_2']}","{c['poc_location']}" {f", '{fileName}'" if fileName != '' else ''},"{data['user']}","{formatted_dt}"'
        table_name = "md_client_poc"
        whr =  f'sl_no="{c['sl_no']}"' if c['sl_no'] > 0 else None
        flag1 = 1 if c['sl_no']>0 else 0
        result = await db_Insert(table_name, fields, values, whr, flag1)
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": f"Client saved successfully!" if c['sl_no']==0 else f"Client updated successfully!"}
        else:
            res_dt = {"suc": 0, "msg": f"Error while saving!" if c['sl_no']==0 else f"Error while updating"}
        index += 1

    if data['c_id']>0:
        await user_log_update(data['user'],'E','md_client',formatted_dt, data['c_id'])
    else:
        await user_log_update(data['user'],'N','md_client',formatted_dt,lastID)

    return res_dt

    
async def uploadfileToLocal(file, upPath):
    current_datetime = datetime.now()
    receipt = int(round(current_datetime.timestamp()))
    modified_filename = f"{receipt}_{file.filename}"
    res = ""
    try:
        file_location = os.path.join(upPath, modified_filename)
        print('location=',file_location)
        
        with open(file_location, "wb") as f:
            f.write(await file.read())
        
        res = modified_filename
        print(res)
    except Exception as e:
        # res = e.args
        res = ""
    finally:
        return res


@masterRouter.post('/getclient')
async def getclient(id:getData):
    print(id.id)
    res_dt = {}

    select = "@a:=@a+1 serial_number,client_name,vendor_code,created_by,created_at,created_by,created_at,modified_by,modified_at,sl_no"
    schema = "md_client,(SELECT @a:= 0) AS a"
    where = f"sl_no='{id.id}'" if id.id>0 else f"delete_flag='N'"
    order = "ORDER BY created_at DESC"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result
@masterRouter.post('/deleteclient')
async def deleteclient(id:deleteData):
   current_datetime = datetime.now()
   res_dt={}
   formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
   fields=f'delete_flag="Y",deleted_by="{id.user}",deleted_at="{formatted_dt}"'
   table_name = "md_client"
   flag = 1 
   values=''
   whr=f'sl_no="{id.id}"'
   result = await db_Insert(table_name, fields, values, whr, flag)
   if(result['suc']>0):
        res_dt = {"suc": 1, "msg": "Client deleted successfully!"}
   else:
        res_dt = {"suc": 0, "msg": "Error while deleting!"}
   return res_dt

@masterRouter.post('/getclientpoc')
async def getclientpoc(id:getData):
    print(id.id)
    res_dt = {}

    select = "*"
    schema = "md_client_poc"
    where = f"client_id='{id.id}'" if id.id>0 else ""
    order = ""
    flag = 1 if id.id>0 else 0
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@masterRouter.post('/getclientloc')
async def getclientpoc(id:getData):
    print(id.id)
    res_dt = {}

    select = "*"
    schema = "md_client_loc"
    where = f"client_id='{id.id}'" if id.id>0 else ""
    order = ""
    flag = 1 if id.id>0 else 0
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@masterRouter.post('/getvendorpoc')
async def getvendorpoc(id:getData):
    print(id.id)
    res_dt = {}

    select = "*"
    schema = "md_vendor_poc"
    where = f"vendor_id='{id.id}'" if id.id>0 else ""
    order = ""
    flag = 1 if id.id>0 else 0
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result


@masterRouter.post('/addVendor')
async def addvendor(data:addVendor):
    res_dt = {}
    print(data)
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    fields= f'vendor_type="{data.v_type}",vendor_name="{data.v_name}",vendor_gst="{data.v_gst}",vendor_pan="{data.v_pan}",vendor_phone="{data.v_phone}",vendor_email="{data.v_email}",vendor_address="{data.v_address}",msme_flag="{data.msme_flag}",msme_no="{data.msme_no}",org_type="{data.composite}",tds_flag="{data.tds_flag}",tcs_flag="{data.tcs_flag}",tds_prtg="{data.tds_prtg}",tcs_prtg="{data.tcs_prtg}",e_r_supply="{data.e_r_supply}",tan_no="{data.tan_no}",supply_flag="{data.supply_flag}",state="{data.state}",modified_by="{data.user}",modified_at="{formatted_dt}"' if data.v_id > 0 else f'vendor_type,vendor_name,vendor_gst,vendor_pan,vendor_phone,vendor_email,vendor_address,msme_flag,msme_no,org_type,tan_no,tcs_flag,tds_flag,tds_prtg,tcs_prtg,state,supply_flag,e_r_supply,created_by,created_at'
    values = f'"{data.v_type}","{data.v_name}","{data.v_gst}","{data.v_pan}","{data.v_phone}","{data.v_email}","{data.v_address}","{data.msme_flag}","{data.msme_no}","{data.composite}","{data.tan_no}","{data.tcs_flag}","{data.tds_flag}","{data.tds_prtg}","{data.tcs_prtg}","{data.state}","{data.supply_flag}","{data.e_r_supply}","{data.user}","{formatted_dt}"'
    table_name = "md_vendor"
    whr = f'sl_no="{data.v_id}"' if data.v_id > 0 else None
    flag = 1 if data.v_id>0 else 0

    result = await db_Insert(table_name, fields, values, whr, flag)

    lastID=data.v_id if data.v_id>0 else result["lastId"]

    # del_table_name = 'md_client_poc'
    # del_whr = f"sl_no not in()"
    # del_qry = await db_Delete(del_table_name, del_whr)

   

    # 
    if(data.v_id > 0):
        catg_ids = ",".join(str(dt.sl_no) for dt in data.v_bank)
        try:
            del_table_name = 'md_vendor_bank'
            del_whr = f"vendor_id = {lastID} AND sl_no not in({catg_ids})"
            del_qry = await db_Delete(del_table_name, del_whr)
        except:
            print('Error while delete md_vendor_deals')

    for b in data.v_bank:
        fields1= f'bank_name="{b.v_banknm}",branch_name="{b.v_brnnm}",ac_no="{b.v_ac}",ifsc="{b.v_ifsc}",micr_code="{b.v_micr}",modified_by="{data.user}",modified_at="{formatted_dt}"' if b.sl_no > 0 else f'vendor_id,bank_name,branch_name,ac_no,ifsc,micr_code,created_by,created_at'
        values1 = f'"{lastID}","{b.v_banknm}","{b.v_brnnm}","{b.v_ac}","{b.v_ifsc}","{b.v_micr}","{data.user}","{formatted_dt}"'
        table_name1 = "md_vendor_bank"
        whr1 = f'sl_no="{b.sl_no}"' if b.sl_no > 0 else None
        flag2 = 1 if b.sl_no>0 else 0

        result = await db_Insert(table_name1, fields1, values1, whr1, flag2)

    # 
    select_u = "*"
    schema_u = "md_vendor_poc"
    where_u = f"vendor_id='{data.v_id}'" if data.v_id>0 else None
    order_u = ""
    rows =await db_select(select_u, schema_u, where_u, order_u, flag)
    # k=list()
    # for r in rows['msg']:
    #     k.append(r['sl_no'])
    # print(k,'rows')

    if(data.v_id > 0):
        catg_ids = ",".join(str(dt.sl_no) for dt in data.v_deals)
        try:
            del_table_name = 'md_vendor_deals'
            del_whr = f"vendor_id = {lastID} AND sl_no not in({catg_ids})"
            del_qry = await db_Delete(del_table_name, del_whr)
        except:
            print('Error while delete md_vendor_deals')

    for v in data.v_deals:
        fields= f'category_id="{v.category_id}",modified_by="{data.user}",modified_at="{formatted_dt}"' if v.sl_no > 0 else f'vendor_id,category_id,created_by,created_at'
        values = f'"{lastID}","{v.category_id}","{data.user}","{formatted_dt}"'
        table_name = "md_vendor_deals"
        whr =  f'sl_no="{v.sl_no}"' if v.sl_no > 0 else None
        flag1 = 1 if v.sl_no>0 else 0
        result = await db_Insert(table_name, fields, values, whr, flag1)
        
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": f"Vendor deals saved successfully!" if v.sl_no==0 else f"Vendor deals updated successfully!"}
        else:
            res_dt = {"suc": 0, "msg": f"Error while saving!" if v.sl_no==0 else f"Error while updating"}

    if(data.v_id > 0):
        poc_ids = ",".join(str(dt.sl_no) for dt in data.v_poc)
        try:
            del_table_name = 'md_vendor_poc'
            del_whr = f"vendor_id = {lastID} AND sl_no not in({poc_ids})"
            del_qry = await db_Delete(del_table_name, del_whr)
        except:
            print('Error while delete md_vendor_poc')

    for v in data.v_poc:
        fields= f'poc_name="{v.poc_name}", poc_email="{v.poc_email}",poc_ph_1="{v.poc_ph_1}",poc_ph_2="{v.poc_ph_2}",poc_email="{v.poc_email}",modified_by="{data.user}",modified_at="{formatted_dt}"' if v.sl_no > 0 else f'vendor_id,poc_name,poc_email, poc_ph_1,poc_ph_2,created_by,created_at'
        values = f'"{lastID}","{v.poc_name}","{v.poc_email}","{v.poc_ph_1}","{v.poc_ph_2}","{data.user}","{formatted_dt}"'
        table_name = "md_vendor_poc"
        whr =  f'sl_no="{v.sl_no}"' if v.sl_no > 0 else None
        flag1 = 1 if v.sl_no>0 else 0
        result = await db_Insert(table_name, fields, values, whr, flag1)
        
        if(result['suc']>0):
            res_dt = {"suc": 1, "msg": f"Vendor saved successfully!" if v.sl_no==0 else f"Vendor updated successfully!"}
        else:
            res_dt = {"suc": 0, "msg": f"Error while saving!" if v.sl_no==0 else f"Error while updating"}
    
    if data.v_id>0:
        await user_log_update(data.user,'E','md_vendor',formatted_dt, data.v_id)
    else:
        await user_log_update(data.user,'N','md_vendor',formatted_dt,lastID)
    return res_dt


# @masterRouter.post('/getpoc')
# async def getunit(id:getPocId):
#     print(id.client_id)
#     res_dt = {}

#     select = "*"
#     schema = "md_client_poc"
#     where = f"client_id='{id.client_id}'" 
#     order = ""
#     flag = 0 if id.client_id>0 else 1
#     result = await db_select(select, schema, where, order, flag)
#     print(result, 'RESULT')
#     return result

@masterRouter.post('/get_warranty')  
async def getreceiptdoc(wrd:getPhrase):
    print('I am logging in!')
    # print(id.id)
    res_dt = {}
    select = "distinct warranty"
    schema = "td_project"
    where = f"warranty like '%{wrd.wrd}%'"
    order = "ORDER BY modified_at,created_at DESC"
    flag =  1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@masterRouter.post('/get_ld_clause')  
async def getreceiptdoc(wrd:getPhrase):
    print('I am logging in!')
    # print(id.id)
    res_dt = {}
    select = "distinct ld_clause"
    schema = "td_project"
    where = f"ld_clause like '%{wrd.wrd}%'"
    order = "ORDER BY modified_at,created_at DESC"
    flag =  1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result


@masterRouter.post('/activate_user')
async def approvepo(id:approvePO):
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    fields= f'active_flag="{id.status}",block_desc="{id.reason}",modified_by="{id.user}",modified_at="{formatted_dt}"'
    values = f''
    table_name = "md_user"
    whr = f'sl_no="{id.id}"' if id.id > 0 else None
    flag = 1 if id.id>0 else 0

    result = await db_Insert(table_name, fields, values, whr, flag)
    if result['suc']:
        res_dt = {"suc": 1, "msg": f"Action Successful!"}
    else:
        res_dt = {"suc": 0, "msg": f"Error while saving!"}


    if id.id>0:
        await user_log_update(id.user,'E','md_user',formatted_dt, id.id)
    # else:
    #     await user_log_update(id.user,'N','md_vendor',formatted_dt,result['lastId'])
  
    return res_dt


@masterRouter.post('/edit_user')
async def edit_user(
    user_name: str = Form(...),
    # user_location: str = Form(...),
    # user_dept: str = Form(...),
    # user_desig:str = Form(...),
    user_phone:str = Form(...),
    file: Optional[Union[UploadFile,str,None]] = File(None),
    user_email:str = Form(...),
    # modified_by:str = Form(...) 
    ):
    print(file)
    fileName = None if not file else await uploadfile(file)
    # return {"body":data,"file":file}
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    table_name = "md_user"
    prof_pic = f", user_profile_pic = '/uploads/{fileName}'" if fileName != None else ''
    # catg_pic1 = f",'/uploads/{fileName}'" if fileName != None else ', ""'
    # fields = f"user_name ='{user_name}', user_location='{user_location}', user_dept='{user_dept}', user_desig='{user_desig}', user_phone='{user_phone}' {prof_pic}, modified_by = '{modified_by}', modified_at = '{formatted_dt}'" 
    fields = f"user_name ='{user_name}', user_phone='{user_phone}' {prof_pic}, modified_by = '{user_email}', modified_at = '{formatted_dt}'" 
    values = None
    where = f"user_email='{user_email}'" 
    flag = 1 
    res_dt = await db_Insert(table_name,fields,values,where,flag)
    
    return res_dt


async def uploadfile(file):
    current_datetime = datetime.now()
    receipt = int(round(current_datetime.timestamp()))
    modified_filename = f"{receipt}_{file.filename}"
    res = ""
    try:
        file_location = os.path.join(UPLOAD_FOLDER, modified_filename)
        print(file_location)
        
        with open(file_location, "wb") as f:
            f.write(await file.read())
        
        res = modified_filename
        print(res)
    except Exception as e:
        # res = e.args
        res = ""
    finally:
        return res
    

@masterRouter.post('/getprofile')
async def getuser(id:getProfile):
    print(id.id)
    res_dt = {}

    select = "@a:=@a+1 serial_number, user_name,user_location,user_dept,user_desig,user_phone,user_email,user_password, user_type,first_login_flag,user_profile_pic,created_by,created_at,modified_by,modified_at,sl_no,active_flag"

    schema = "md_user,(SELECT @a:= 0) AS a"
    where = f"user_email='{id.id}'" 
    order = "ORDER BY created_at DESC"
    flag = 0 
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result


@masterRouter.post("/user_type")
async def item_dtls(id:getData):
    select = "*"
    table = "md_user_type"
    where = f"sl_no={id.id}" if id.id>0 else f""
    order = ""
    flag = 1 
    res_dt = await db_select(select,table,where,order,flag)
    return res_dt


# @masterRouter.post('/add_edit_permissions')
# async def add_edit_permissions(data:Permission):
#     # result = {}
#     # print(data)
#     current_datetime = datetime.now()
#     formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")

#     select = "COUNT(user_type_id) sl_no"
#     table = "td_permission"
#     where =f"user_type_id={data.user_type_id}"
#     order = ""
#     flag1 = 1 
   
#     res_dt = await db_select(select,table,where,order,flag1)
#     print(res_dt["msg"][0]["sl_no"])
    

#     fields= f"department='{data.department}', prod_catg='{data.prod_catg}', unit='{data.unit}', product='{data.product}', vendor='{data.vendor}', masters='{data.masters}', purchase='{data.purchase}', client='{data.client}', gst='{data.gst}', comp_user='{data.comp_user}',purchase_requisition='{data.purchase_requisition}',client_orders='{data.client_orders}', vendor_orders='{data.vendor_orders}', existing_po='{data.existing_po}', amend_po='{data.amend_po}', approve_po='{data.approve_po}', certificate='{data.certificate}', mrn='{data.mrn}',approve_mrn='{data.approve_mrn}', requisition='{data.requisition}',approve_req='{data.approve_req}', min='{data.min}', reports='{data.reports}', permission='{data.prm}', modified_at='{formatted_dt}'" if res_dt["msg"][0]["sl_no"] > 0 else f"user_type_id, department, prod_catg, unit, product, vendor, masters,purchase, client, gst, comp_user, purchase_requisition, client_orders, vendor_orders, existing_po, amend_po, approve_po, certificate, mrn, approve_mrn, requisition, approve_req, min, reports, permission, created_by, created_at"

#     values = None if res_dt["msg"][0]["sl_no"] > 0 else f"{data.user_type_id}, '{data.department}', '{data.prod_catg}','{data.unit}', '{data.product}', '{data.vendor}','{data.masters}','{data.purchase}', '{data.client}','{data.gst}', '{data.comp_user}', '{data.client_orders}', '{data.vendor_orders}', '{data.existing_po}', '{data.amend_po}', '{data.approve_po}', '{data.certificate}', '{data.mrn}', '{data.requisition}', '{data.min}', '{data.reports}', '{data.prm}','{data.user}', '{formatted_dt}'"

#     table_name = "td_permission"

#     whr = f"user_type_id={data.user_type_id}" if res_dt["msg"][0]["sl_no"] > 0 else f""
#     flag = 1 if res_dt["msg"][0]["sl_no"] > 0 else 0
#     result = await db_Insert(table_name, fields, values, whr, flag)

#     return result


@masterRouter.post('/add_edit_permissions')
async def add_edit_permissions(data:Permission):
    # result = {}
    # print(data)
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")

    select = "COUNT(user_id) sl_no"
    table = "td_permission"
    where =f"user_id={data.user_id}"
    order = ""
    flag1 = 1 
   
    res_dt = await db_select(select,table,where,order,flag1)
    print(res_dt["msg"][0]["sl_no"])
    

    fields= f"masters='{data.masters}', po='{data.purchase}',approve_po='{data.approve_po}',project='{data.projects}', purchase_req='{data.purchase_req}', mrn='{data.mrn}', requisition='{data.floor_req}', min='{data.min}',stock='{data.stock}',user_perm='{data.user_perm}', modified_at='{formatted_dt}'" if res_dt["msg"][0]["sl_no"] > 0 else f"user_id, masters, po, purchase_req, mrn, requisition, min, stock,user_perm, project, created_by, created_at"

    values = None if res_dt["msg"][0]["sl_no"] > 0 else f"{data.user_id}, '{data.masters}', '{data.purchase}','{data.purchase_req}', '{data.mrn}', '{data.floor_req}','{data.min}','{data.stock}','{data.user_perm}', '{data.projects}','{data.user}', '{formatted_dt}'"

    table_name = "td_permission"

    whr = f"user_id={data.user_id}" if res_dt["msg"][0]["sl_no"] > 0 else f""
    flag = 1 if res_dt["msg"][0]["sl_no"] > 0 else 0
    result = await db_Insert(table_name, fields, values, whr, flag)


    if res_dt["msg"][0]["sl_no"]>0:
        await user_log_update(data.user,'E','td_permission',formatted_dt,data.user_id)
    else:
        await user_log_update(data.user,'N','td_permission',formatted_dt,result['lastId'])

    return result


# @masterRouter.post("/fetch_permission")
# async def fetch_permission(user_type_id:getData):
#     select = "*"
#     table = "td_permission"
#     where = f"user_type_id={user_type_id.id}" if user_type_id.id>0 else f""
#     order = ""
#     flag = 1 
#     res_dt = await db_select(select,table,where,order,flag)
#     return res_dt

@masterRouter.post("/fetch_permission")
async def fetch_permission(user_id:getData):
    select = "*"
    table = "td_permission"
    where = f"user_id={user_id.id}" if user_id.id>0 else f""
    order = ""
    flag = 1 
    res_dt = await db_select(select,table,where,order,flag)
    return res_dt

@masterRouter.post("/fetch_menus")
async def fetch_permission(user_id:getMenu):
    select = "*"
    table = "td_permission"
    where = f"user_id=(select sl_no from md_user where user_email='{user_id.email}')" 
    order = ""
    flag = 1 
    res_dt = await db_select(select,table,where,order,flag)
    return res_dt



@masterRouter.post('/check_product')
async def check_product(wrd:getPhrase):
    select = "count(*) as count,prod_name,prod_desc,prod_make"
    schema = "md_product"
    where = f"prod_name='{wrd.wrd}' group by prod_name,prod_desc,prod_make"
    order = ""
    flag = 1 
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result


@masterRouter.post('/get_same_product')
async def check_product(wrd:getPhrase):
    select = "count(*) as count,prod_name,prod_desc,prod_make"
    schema = "md_product"
    where = f"prod_name like '%{wrd.wrd}%' group by prod_name,prod_desc,prod_make"
    order = ""
    flag = 1 
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@masterRouter.post('/get_dashboard_data')
async def check_product(wrd:getPhrase):
    select_project = "count(*) as proj_cnt"
    schema_project = "td_project"
    where_project = f""
    order_project = ""
    flag_project = 1 
    result_project = await db_select(select_project, schema_project, where_project, order_project, flag_project)
    print(result_project, 'RESULT')

    select_po = "count(*) as po_cnt"
    schema_po = "td_po_basic"
    where_po = f"po_status='U'"
    order_po = ""
    flag_po = 1 
    result_po = await db_select(select_po, schema_po, where_po, order_po, flag_po)
    print(result_po, 'RESULT')

    select_req = "count(*) as req_cnt"
    schema_req = "td_requisition"
    where_req = f""
    order_req = ""
    flag_req = 1 
    result_req = await db_select(select_req, schema_req, where_req, order_req, flag_req)
    print(result_req, 'RESULT')

    select_mrn = "count(*) as mrn_cnt"
    schema_mrn = "td_item_delivery_invoice"
    where_mrn = f"approve_flag='P'"
    order_mrn = ""
    flag_mrn = 1 
    result_mrn = await db_select(select_mrn, schema_mrn, where_mrn, order_mrn, flag_mrn)
    print(result_mrn, 'RESULT')

    select_user = "count(*) as user_cnt"
    schema_user = "md_user"
    where_user = f""
    order_user = ""
    flag_user = 1 
    result_user = await db_select(select_user, schema_user, where_user, order_user, flag_user)
    print(result_user, 'RESULT')

    select_vendor = "count(*) as vendor_cnt"
    schema_vendor = "md_vendor"
    where_vendor = f""
    order_vendor = ""
    flag_vendor = 1 
    result_vendor = await db_select(select_vendor, schema_vendor, where_vendor, order_vendor, flag_vendor)
    print(result_vendor, 'RESULT')

    select_client = "count(*) as client_cnt"
    schema_client = "md_client"
    where_client = f""
    order_client = ""
    flag_client = 1 
    result_client = await db_select(select_client, schema_client, where_client, order_client, flag_client)
    print(result_client, 'RESULT')


    select_stock = "sum(qty*in_out_flag) as stock_cnt"
    schema_stock = "td_stock_new"
    where_stock = f""
    order_stock = ""
    flag_stock = 1 
    result_stock = await db_select(select_stock, schema_stock, where_stock, order_stock, flag_stock)
    print(result_stock, 'RESULT')
    
    select_prod = "p.sl_no,p.prod_name,c.catg_name,p.part_no "
    schema_prod = "md_product p,md_category c"
    where_prod = f"p.prod_cat=c.sl_no "
    order_prod = "order by p.created_by desc limit 4"
    flag_prod = 1 
    result_prod = await db_select(select_prod, schema_prod, where_prod, order_prod, flag_prod)


    return {'project':result_project['msg'][0]['proj_cnt'],'po':result_po['msg'][0]['po_cnt'],'req':result_req['msg'][0]['req_cnt'],'mrn':result_mrn['msg'][0]['mrn_cnt'],'user':result_user['msg'][0]['user_cnt'],'vendor':result_vendor['msg'][0]['vendor_cnt'],'client':result_client['msg'][0]['client_cnt'],'stock_cnt':result_stock['msg'][0]['stock_cnt'],'products':result_prod['msg']}


    # return result


