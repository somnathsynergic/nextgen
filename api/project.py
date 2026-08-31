from fastapi import APIRouter,File,UploadFile,Form
from enum import Enum
from pydantic import BaseModel
from fastapi import APIRouter
from enum import Enum
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from models.masterApiModel import db_select, db_Insert, db_Delete
from datetime import datetime
import datetime as dt
import random
from typing import Optional, Annotated, Union
import os
from api.db_log import user_log_update
import time
import logging

logging.basicConfig(level=logging.INFO)

# Define the upload folder
UPLOAD_FOLDER = "upload_file"

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

projectRouter = APIRouter()
class ProjectPoc(BaseModel):
    sl_no:int
    poc_name:str
    poc_ph_1:Optional[str]
    poc_designation:Optional[str]
    poc_email:Optional[str]
class Project(BaseModel):
     id:int
     proj_id:str
     proj_type:str
     proj_unit:str
     proj_name:str
     client_id:int
     client_location:str
     client_gst:str
     client_pan:str
     order_id:str
     order_date:str
     proj_delivery_date:str
     proj_desc:str
     proj_order_val:str
     proj_end_user:str
     proj_consultant:str
     epc_contractor:str
     price_basis:str
     ld_clause_flag:str
     ld_clause:str
     erection_responsibility:str
     erection_responsibility_val:str
     warranty:str
     proj_manager:int
     proj_poc:list[ProjectPoc]
    #  docs: Union[list[UploadFile], UploadFile, None] = None
    #  proj_remarks:str
     user:str
     

class GetProject(BaseModel):
     id:int

class GetProjectPg(BaseModel):
     id:int
     offset:int
     limit:int
class ProjSrch(BaseModel):
     searchVal:str

class GetPoc(BaseModel):
     id:str

class GetProjectId(BaseModel):
     id:str

class clientSearch(BaseModel):
     client:str
     project_manager:str
     order_val_to:int
     order_val_from:int
     delivery_dt_from:str
     delivery_dt_to:str
     order_dt_from:str
     order_dt_to:str


# @projectRouter.post('/addproject')
# async def addproject(dt:Project):
#     print(dt)
#     res_dt={}
#     current_datetime = datetime.now()
#     formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
#     fields= f'proj_id,proj_name,client_id,client_location,client_gst,client_pan,order_id,order_date,proj_delivery_date,proj_desc,proj_order_val,proj_end_user,proj_consultant,epc_contractor,price_basis,ld_clause,ld_clause_flag,erection_responsibility,warranty,created_by,created_at'
#     values = f'"{dt.proj_id}","{dt.proj_name}","{dt.client_id}","{dt.client_location}","{dt.client_gst}","{dt.client_pan}","{dt.order_id}","{dt.order_date}","{dt.proj_delivery_date}","{dt.proj_desc}","{dt.proj_order_val}","{dt.proj_end_user}","{dt.proj_consultant}","{dt.epc_contractor}","{dt.price_basis}","{dt.ld_clause}","{dt.ld_clause_flag}","{dt.erection_responsibility}","{dt.warranty}","{dt.user}","{formatted_dt}"' 
#     table_name = "td_project"
#     whr =  None
#     flag = 1 if dt.id>0 else 0
#     if(dt.id==0):
#         result = await db_Insert(table_name, fields, values, whr, flag)
#         if(result['suc']>0):
#             fields1= f'proj_id,proj_manager,created_by,created_at'
#             values1 = f'"{dt.proj_id}","{dt.proj_manager}","{dt.user}","{formatted_dt}"'
#             table_name1 = "td_project_assign"
#             whr1 =  None
#             flag1 = 1 if dt.id>0 else 0
#             result1 = await db_Insert(table_name1, fields1, values1, whr1, flag1)

#             # fields2= f'proj_id,proj_remarks,created_by,created_at'
#             # values2 = f'"{dt.proj_id}","{dt.proj_remarks}","{dt.user}","{formatted_dt}"'
#             # table_name2 = "td_project_remarks"
#             # whr2 =  None
#             # flag2 = 1 if dt.id>0 else 0
#             # result2 = await db_Insert(table_name2, fields2, values2, whr2, flag2)

#             if result1['suc']>0 :
#                 res_dt = {"suc": 1, "msg": "Project inserted successfully!"}
#             else:
#                 res_dt = {"suc": 0, "msg": "Error while inserting!"}
#         else:
#             res_dt = {"suc": 0, "msg": "Error while inserting!"}
    
#     else:
#         print(flag)
#         fields=f'proj_name="{dt.proj_name}",client_id="{dt.client_id}",client_location="{dt.client_location}",client_gst="{dt.client_gst}",client_pan="{dt.client_pan}",order_id="{dt.order_id}" order_date="{dt.order_date}",proj_delivery_date="{dt.proj_delivery_date}",proj_desc="{dt.proj_desc}",proj_order_val="{dt.proj_order_val}",proj_end_user="{dt.proj_end_user}",proj_consultant="{dt.proj_consultant}",epc_contractor="{dt.epc_contractor}",,price_basis="{dt.price_basis}",ld_clause="{dt.ld_clause}",ld_clause_flag="{dt.ld_clause_flag}",erection_responsibility="{dt.erection_responsibility}",warranty="{dt.warranty}",modified_by="{dt.user}",modified_at="{formatted_dt}"'
#         whr=f'sl_no="{dt.id}"'
#         result = await db_Insert(table_name, fields, values, whr, flag)
#         if(result['suc']>0):
#             fields1= f'proj_manager="{dt.proj_manager}",modified_by="{dt.user}",modified_at="{formatted_dt}"'
#             values1=''
#             table_name1 = "td_project_assign"
#             whr1=f'proj_id="{dt.proj_id}"'
#             flag1 = 1 if dt.id>0 else 0
#             result1 = await db_Insert(table_name1, fields1, values1, whr1, flag1)

            

#             if result1['suc']>0 :
#                 res_dt = {"suc": 1, "msg": "Project updated successfully!"}
#             else:
#                 res_dt = {"suc": 0, "msg": "Error while updating!"}
#         else:
#             res_dt = {"suc": 0, "msg": "Error while updating!"}


#     return res_dt

@projectRouter.post('/add_proj_files')
async def add_proj_files(proj_id:str = Form(...), user:str = Form(...), docs:Optional[Union[UploadFile, None]] = None, docs1:Optional[Union[UploadFile, None]] = None, docs2:Optional[Union[UploadFile, None]] = None):
    fileName = ''
    res_dt = {}
    files = []
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    if not docs and not docs1 and not docs2:
        return {"suc": 1, "msg": "No file sent"}
    else:
        if docs:
            files.append(docs)
        if docs1:
            files.append(docs1)
        if docs2:
            files.append(docs2)

        logging.info(f"Number of files received: {len(files)}")
        logging.info(f"Type of files received: {type(files)}")

        if(len(files) > 0):
            for f in files:
                fileName = ''
                fileName = None if not f else await uploadfileToLocal(f)
                fields3= f'proj_id,proj_doc,created_by,created_at'
                values3 = f'"{proj_id}","{fileName}","{user}","{formatted_dt}"' 
                table_name3 = "td_project_doc"
                whr3 =  ""
                flag3 = 0
                # if(id==0):
                result3 = await db_Insert(table_name3, fields3, values3, whr3, flag3)
                res_dt = result3
        return res_dt

        # if(type(files) != list):
        #     fileName = None if not files else await uploadfileToLocal(files)
        #     fields3= f'proj_id,proj_doc,created_by,created_at'
        #     values3 = f'"{proj_id}","{fileName}","{user}","{formatted_dt}"' 
        #     table_name3 = "td_project_doc"
        #     whr3 =  ""
        #     flag3 = 0
        #     # if(id==0):
        #     result3 = await db_Insert(table_name3, fields3, values3, whr3, flag3)
        #     res_dt = result3
        # else:
        #     # print(docs)
        #     for f in files:
        #         fileName = ''
        #         fileName = None if not f else await uploadfileToLocal(f)
        #         fields3= f'proj_id,proj_doc,created_by,created_at'
        #         values3 = f'"{proj_id}","{fileName}","{user}","{formatted_dt}"' 
        #         table_name3 = "td_project_doc"
        #         whr3 =  ""
        #         flag3 = 0
        #         # if(id==0):
        #         result3 = await db_Insert(table_name3, fields3, values3, whr3, flag3)
        #         res_dt = result3
        # return res_dt

async def uploadfileToLocal(file):
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

@projectRouter.post('/addproject')
async def addproject(dt:Project):
    print(dt)
    res_dt={}
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    fields= f'proj_id,proj_type,proj_unit,proj_name,client_id,client_location,client_gst,client_pan,order_id,order_date,proj_delivery_date,proj_desc,proj_order_val,proj_end_user,proj_consultant,epc_contractor,price_basis,ld_clause,ld_clause_flag,erection_responsibility,erection_responsibility_val,warranty,created_by,created_at'if dt.id==0 else f'proj_type="{dt.proj_type}",proj_unit="{dt.proj_unit}",proj_name="{dt.proj_name}",client_id="{dt.client_id}",client_location="{dt.client_location}",client_gst="{dt.client_gst}",client_pan="{dt.client_pan}",order_id="{dt.order_id}",order_date="{dt.order_date}",proj_delivery_date="{dt.proj_delivery_date}",proj_desc="{dt.proj_desc}",proj_order_val="{dt.proj_order_val}",proj_end_user="{dt.proj_end_user}",proj_consultant="{dt.proj_consultant}",epc_contractor="{dt.epc_contractor}",price_basis="{dt.price_basis}",ld_clause="{dt.ld_clause}",ld_clause_flag="{dt.ld_clause_flag}",erection_responsibility="{dt.erection_responsibility}",erection_responsibility_val="{dt.erection_responsibility_val}",warranty="{dt.warranty}",modified_by="{dt.user}",modified_at="{formatted_dt}"'
    values = f'"{dt.proj_id}","{dt.proj_type}","{dt.proj_unit}","{dt.proj_name}","{dt.client_id}","{dt.client_location}","{dt.client_gst}","{dt.client_pan}","{dt.order_id}","{dt.order_date}","{dt.proj_delivery_date}","{dt.proj_desc}","{dt.proj_order_val}","{dt.proj_end_user}","{dt.proj_consultant}","{dt.epc_contractor}","{dt.price_basis}","{dt.ld_clause}","{dt.ld_clause_flag}","{dt.erection_responsibility}","{dt.erection_responsibility_val}","{dt.warranty}","{dt.user}","{formatted_dt}"' 
    table_name = "td_project"
    whr =  f'sl_no="{dt.id}"' if dt.id>0 else ""
    flag = 1 if dt.id>0 else 0
    # if(dt.id==0):
    result = await db_Insert(table_name, fields, values, whr, flag)
    lastID=dt.id if dt.id>0 else result["lastId"]

   

    if(result['suc']>0):
        fields1= f'proj_id,proj_manager,created_by,created_at' if dt.id==0 else f'proj_manager="{dt.proj_manager}",modified_by="{dt.user}",modified_at="{formatted_dt}"'
        values1 = f'"{dt.proj_id}","{dt.proj_manager}","{dt.user}","{formatted_dt}"'
        table_name1 = "td_project_assign"
        whr1 =f'proj_id="{dt.proj_id}"' if dt.id>0 else None
        flag1 = 1 if dt.id>0 else 0
        result1 = await db_Insert(table_name1, fields1, values1, whr1, flag1)

        # fields2= f'proj_id,proj_remarks,created_by,created_at'
        # values2 = f'"{dt.proj_id}","{dt.proj_remarks}","{dt.user}","{formatted_dt}"'
        # table_name2 = "td_project_remarks"
        # whr2 =  None
        # flag2 = 1 if dt.id>0 else 0
        # result2 = await db_Insert(table_name2, fields2, values2, whr2, flag2)

        if(dt.id > 0):
            poc_ids = ",".join(str(p.sl_no) for p in dt.proj_poc)
            try:
                del_table_name = 'td_project_poc'
                del_whr = f"proj_id = '{dt.proj_id}' AND sl_no not in({poc_ids})"
                del_qry = await db_Delete(del_table_name, del_whr)
            except:
                print('Error while delete td_project_poc')

        for v in dt.proj_poc:
            fields= f'poc_name="{v.poc_name}", poc_email="{v.poc_email}",poc_phone_1="{v.poc_ph_1}",poc_designation="{v.poc_designation}",poc_email="{v.poc_email}",modified_by="{dt.user}",modified_at="{formatted_dt}"' if v.sl_no > 0 else f'proj_id,poc_name,poc_email,poc_phone_1,poc_designation,created_by,created_at'
            values = f'"{dt.proj_id}","{v.poc_name}","{v.poc_email}","{v.poc_ph_1}","{v.poc_designation}","{dt.user}","{formatted_dt}"'
            table_name = "td_project_poc"
            whr =  f'sl_no="{v.sl_no}"' if v.sl_no > 0 else None
            flag2 = 1 if v.sl_no>0 else 0
            result2 = await db_Insert(table_name, fields, values, whr, flag2)

        if result1['suc'] and result2['suc']>0 :
            res_dt = {"suc": 1, "msg": f"Project saved successfully!" if dt.id==0 else  f"Project updated successfully!", "proj_id": dt.proj_id }
        else:
            res_dt = {"suc": 0, "msg": result1}
    else:
        res_dt = {"suc": 0, "msg": result1}
    
    if dt.id>0:
        await user_log_update(dt.user,'E','td_project',formatted_dt, dt.id)
    else:
        await user_log_update(dt.user,'N','td_project',formatted_dt,lastID)
    return res_dt




@projectRouter.post('/getproject')
async def getproject(id:GetProject):
    print('I am logging in!')
    print(id.id)
    res_dt = {}
    # SELECT @a:=@a+1 serial_number, busi_act_name FROM md_busi_act, (SELECT @a:= 0) AS a
    select = "@a:=@a+1 serial_number,p.proj_type,p.proj_unit,p.proj_id,p.proj_name,p.client_id,p.client_location,p.client_gst,p.client_pan,p.proj_delivery_date,p.order_id,p.order_date,p.proj_desc,p.proj_order_val,p.proj_end_user,p.proj_consultant,p.epc_contractor,p.price_basis,p.ld_clause,p.ld_clause_flag,p.erection_responsibility,p.erection_responsibility_val,p.warranty,pa.proj_manager,u.user_name as proj_manager_name,u.user_email as manager_email,p.created_by,p.created_at,p.modified_by,p.modified_at,p.sl_no,c.client_name"
    # select = "@a:=@a+1 serial_number, *"
    schema = "td_project p,td_project_assign pa,md_user u,md_client c,(SELECT @a:= 0) AS a"
    where = f"pa.proj_id=p.proj_id and pa.proj_manager=u.sl_no and p.sl_no='{id.id}' and p.client_id=c.sl_no" if id.id>0 else f"pa.proj_id=p.proj_id and pa.proj_manager=u.sl_no and p.client_id=c.sl_no"
    # where = f"p.sl_no='{id.id}'" if id.id>0 else f"pa.proj_id=p.proj_id and pa.proj_manager=u.sl_no"
    order = "ORDER BY created_at DESC"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result

@projectRouter.post('/getproject_pg')
async def getproject(id:GetProjectPg):
    print('I am logging in!')
    t = time.perf_counter()
    print(id.id)
    select = "count(*) as total_count"
    schema = "td_project "
    where = f""
    order = f""
    flag = 0 if id.id>0 else 1
    result1 = await db_select(select, schema, where, order, flag)
    t = time.perf_counter()
    print("Count:", time.perf_counter() - t)

    select = "sl_no,proj_id,proj_name,client_id"
    schema = "td_project"
    where =  f""
    order = f"ORDER BY created_at DESC LIMIT {id.limit} OFFSET {id.offset}"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    t = time.perf_counter()
    print("Data:", time.perf_counter() - t)
    # return { "projects": result}
    return {"total_count":result1, "projects": result}


@projectRouter.post('/searchproject')
async def getproject(id:ProjSrch):
    
    select = "sl_no,proj_id,proj_name,client_id"
    schema = "td_project"
    where =  f"proj_name LIKE '%{id.searchVal}%' or proj_id LIKE '%{id.searchVal}%' or client_id LIKE '%{id.searchVal}%'"
    order = f"ORDER BY created_at DESC"
    flag = 1
    result = await db_select(select, schema, where, order, flag)
    t = time.perf_counter()
    print("Data:", time.perf_counter() - t)
    # return { "projects": result}
    return result




@projectRouter.post('/getprojectpoc')
async def getprojectpoc(id:GetPoc):
    print(id.id)
    res_dt = {}

    select = "*"
    schema = "td_project_poc"
    where = f"proj_id='{id.id}'"
    order = ""
    flag = 1 if id.id else 0
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result

@projectRouter.post('/getprojectpocinfo')
async def getprojectpocinfo(id:GetPoc):
    print(id.id)
    res_dt = {}

    select = "p.sl_no,p.proj_id,p.poc_name,p.poc_phone_1,p.poc_designation,p.poc_email,p.modified_by,p.created_by,p.modified_at,p.modified_by,c.poc_name as name"
    schema = "td_project_poc p,md_client_poc c"
    where = f"p.proj_id='{id.id}' and c.sl_no=p.poc_name"
    order = ""
    flag = 1 if id.id else 0
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result

@projectRouter.post('/get_proj_files')
async def getprojectpoc(id:GetPoc):
    print(id.id)

    sel = "sl_no, proj_doc"
    sel_frm = "td_project_doc"
    whr = f"proj_id='{id.id}'"
    flg = 1
    file_res = await db_select(sel, sel_frm, whr, "", flg)
    # print(file_res, 'RESULT')
    return file_res

@projectRouter.post('/del_proj_files')
async def getprojectpoc(id:GetProject):
    print(id.id)

    del_table_name = 'td_project_doc'
    del_whr = f"sl_no = {id.id}"
    del_qry = await db_Delete(del_table_name, del_whr)
    return del_qry

@projectRouter.post('/check_proj_id')
async def check_proj_id(proj_id:GetProjectId):
    print(proj_id.id)
    res_dt = {}

    select = "count(*) as count"
    schema = "td_project"
    where = f"proj_id='{proj_id.id}'"
    order = ""
    flag = 1 if proj_id.id else 0
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result


@projectRouter.post('/getInvoice')
async def getprojectpocinfo(id:GetPoc):
    print(id.id)
    res_dt = {}

    select = "*"
    schema = "td_item_delivery_invoice"
    where = f"po_no='{id.id}'"
    order = ""
    flag = 1 if id.id else 0
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result


@projectRouter.post('/advanced_search_client')
async def getprojectpoc(id:clientSearch):
   
    res_dt = {}

    select = "p.sl_no,p.proj_name,p.proj_id,p.client_id,c.client_name,u.user_name,p.order_date,p.proj_delivery_date,p.proj_order_val"
    schema = '''td_project p left join td_project_assign a on p.proj_id = a.proj_id
left join md_user u ON u.sl_no=a.proj_manager left join md_client c on c.sl_no=p.client_id
'''
    where = ""
    if(id.project_manager != 0 and id.project_manager != ""):
        where += f"a.proj_manager='{id.project_manager}' {"AND " if(id.client != ''  or id.delivery_dt_to != '' or id.delivery_dt_from != ''  or id.order_dt_to != '' or id.order_dt_from != ''  or id.order_val_to != 0 or id.order_val_from != 0 ) else ''}"
    if(id.client != 0 and id.client != ""):
        where += f"p.client_id='{id.client}' {"AND " if(id.delivery_dt_to != '' or id.delivery_dt_from != ''  or id.order_dt_to != '' or id.order_dt_from != ''  or id.order_val_to != 0 or id.order_val_from != 0 ) else ''}"
    if(id.order_val_from != 0):
        where += f'''(p.proj_order_val BETWEEN {f'{id.order_val_from}' if(id.order_val_from != 0) else 0} and {f'{id.order_val_to}' if(id.order_val_to != 0) else 0}) {"AND " if(id.delivery_dt_to != '' or id.delivery_dt_from != ''  or id.order_dt_to != '' or id.order_dt_from != '') else ''}'''
    if(id.order_dt_from != '' or id.order_dt_from != ''):
        where += f'''(p.order_date BETWEEN "{f'{id.order_dt_from}' if(id.order_dt_from != '') else ''}" and "{f'{id.order_dt_to}' if(id.order_dt_to != '') else ''}") {"AND " if(id.delivery_dt_to != '' or id.delivery_dt_from != '') else ''}'''
    if(id.delivery_dt_from != '' or id.delivery_dt_from != ''):
        where += f'''(p.proj_delivery_date BETWEEN "{f'{id.delivery_dt_from}' if(id.delivery_dt_from != '') else ''}" and "{f'{id.delivery_dt_to}' if(id.delivery_dt_to != '') else ''}") '''

    where = f"{f'({where}) AND ' if(where != '') else ''}" + f"(a.proj_manager IS NOT NULL AND p.client_id IS NOT NULL AND p.proj_order_val IS NOT NULL and p.order_date is not null and p.proj_delivery_date is not null)"
    
    order = "ORDER BY p.created_at DESC"
    flag = 1
    result = await db_select(select, schema, where, order, flag)
    return result
