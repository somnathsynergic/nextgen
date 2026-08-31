from fastapi import APIRouter
from typing import Optional,Union
from enum import Enum
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from models.masterApiModel import db_select, db_Insert, db_Delete
from datetime import datetime
import datetime as dt
import random
from models.utils import get_hashed_password, verify_password
import json
from decimal import Decimal, ROUND_HALF_UP
from api.db_log import user_log_update

stockRouter = APIRouter()

class Stock(BaseModel):
    sl_no:int
    item_id:int
    stock_dt:str
    stock:Union[float,int]
    user:str
class getData(BaseModel):
    id:int

class CheckItem(BaseModel):
    item_id:int
    trans_no:str

class TransferItems(BaseModel):
    sl_no:int
    item_id:int
    qty:Union[float,int]
    error:int
class StockOutData(BaseModel):
     id:int
     stock_out:Union[float,int]
     req_no:str
class SaveTrans(BaseModel):
    sl_no:int
    trans_dt:str
    intended_for:str
    client_id:int
    project_id:int
    purpose:str   
    items:list[TransferItems]
    user:str
class PurchaseItems(BaseModel):
    sl_no:int
    item_id:int
    qty:float
    error:int
class SavePur(BaseModel):
    sl_no:int
    pur_dt:str
    project_id:int
    purpose:str   
    items:list[PurchaseItems]
    user:str
    intended:str

class GetStock(BaseModel):
    proj_id:int
    prod_id:int

class StockOutList(BaseModel):
     proj_id:int
     dt:str
     user:str
     items:list[StockOutData]

class SaveTransPtoP(BaseModel):
    sl_no:int
    trans_dt:str
    intended_for:str
    client_id:int
    from_project_id:int
    project_id:int
    purpose:str   
    items:list[TransferItems]
    user:str

class GetTrans(BaseModel):
     id:int

class GetPurItem(BaseModel):
     pur_no:str

class GetPurItemForPo(BaseModel):
     pur_no:str
    #  pur_no:str

class GetTransItem(BaseModel):
     trans_no:str

class ApproveItems(BaseModel):
    sl_no: int
    item_id: int
    prod_name: str
    qty: Union[float,int]
    approve_flag: str
    check: bool


class GetLog(BaseModel):
     pur_no:str
     item_id:int


class GetApproveItems(BaseModel):
     trans_no:str
     items:list[ApproveItems]
     user:str
     from_proj_id:int
     to_proj_id:int
     status:str


class PoSearch(BaseModel):
    from_proj_id:Optional[Union[int,str]]=None
    to_proj_id:Optional[Union[int,str]]=None
    make:Optional[str]=None
    part_no:Optional[str]=None
    prod_id:Optional[str]=None


@stockRouter.post("/add_edit_stock")
async def add_edit_stock(data:Stock):
    
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    table_name = "md_stock"
    fields = f"item_id='{data.item_id}', stock='{data.stock}',  modified_at = '{formatted_dt}'" if data.sl_no>0 else f"item_id,stock,stock_dt,created_by,created_at"
    values = None if data.sl_no>0 else f"'{data.item_id}','{data.stock}','{data.stock_dt}','{data.user}','{formatted_dt}'"
    where = f"sl_no='{data.sl_no}'" if data.sl_no>0 else None
    flag = 1 if data.sl_no>0 else 0
    result = await db_Insert(table_name,fields,values,where,flag)
    if(result['suc']):
        res_dt = {"suc": 1, "msg": f"Stock opened successfully!" if data.sl_no==0 else f"Stock updated successfully!"}
    else:
        res_dt = {"suc": 0, "msg": f"Error while saving!" if data.sl_no==0 else f"Error while updating"}
        # if v.sl_no not in k:
        #     print('here in delete')
        #     table_name='md_vendor_poc'
        #     wr=f"sl_no='{v.sl_no}'"
        #     result = await db_Delete(table_name, wr)
    return res_dt

@stockRouter.post("/getstock")
async def getstock(data:getData):
    print('I am logging in!')
    print(data.id)
    res_dt = {}
    # SELECT @a:=@a+1 serial_number, busi_act_name FROM md_busi_act, (SELECT @a:= 0) AS a
    select = "@a:=@a+1 serial_number,s.stock_dt,s.stock,s.created_by,s.created_at,s.modified_at,s.sl_no,i.prod_name, i.sl_no as item_id"
    # select = "@a:=@a+1 serial_number, *"
    schema = "md_stock s,md_product i,(SELECT @a:= 0) AS a"
    where = f"s.sl_no='{data.id}' and i.sl_no=s.item_id" if data.id>0 else f"s.delete_flag='N' and i.sl_no=s.item_id"
    order = "ORDER BY s.created_at DESC"
    flag = 0 if data.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result


@stockRouter.post("/check_item")
async def getstock(data:CheckItem):
    print('I am logging in!')
    res_dt = {}
    select = "i.qty,t.trans_no,t.purpose,t.to_proj_id,trans_dt,t.from_proj_id,t.req_by,t.created_by,t.created_at,(select proj_name from td_project where sl_no=t.from_proj_id) as from_proj,(select proj_name from td_project where sl_no=t.to_proj_id) as to_proj"
    schema = "td_transfer_items i,td_transfer t"
    where = f"i.item_id='{data.item_id}' and i.approve_flag='P'and t.trans_no=i.trans_no and i.trans_no like '%{data.trans_no}%'"
    order = "ORDER BY t.created_at DESC"
    flag =  1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@stockRouter.post("/save_transfer")
async def save_trans(data:SaveTrans):
    res_dt = {}
    print(data)
    current_datetime = datetime.now()
    tno = int(round(current_datetime.timestamp()))
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")


    fields= f"trans_no,trans_dt,intended_for,client_id,from_proj_id,to_proj_id,purpose,created_by,created_at,req_by"
    values = f"'TWP-{tno}', '{data.trans_dt}', '{data.intended_for}', {data.client_id},{'0'},'{data.project_id}','{data.purpose}','{data.user}','{formatted_dt}','{data.user}'"
    table_name = "td_transfer"
    whr = ""
    flag = 0
    result = await db_Insert(table_name, fields, values, whr, flag)
    lastID=result["lastId"]
    await user_log_update(data.user,'N','td_Transfer',formatted_dt,lastID)

    #========================================================================================================
    for i in data.items:
                fields= f'trans_no,item_id,qty,created_by,created_at,approved_qty,balance'
                values = f"'TWP-{tno}','{i.item_id}','{i.qty}','{data.user}','{formatted_dt}',{'0'},'{i.qty}'"
                table_name = "td_transfer_items"
                whr=""
                # flag1 = 1 if v.sl_no>0 else 0
                flag1 = 1 if data.sl_no>0 else 0
                result2 = await db_Insert(table_name, fields, values, whr, flag1)
            

                if(result2['suc']>0): 

                    res_dt2 = {"suc": 1, "msg": f"Saved Successfully"}

                else:
                    res_dt2= {"suc": 0, "msg": f"Error while inserting"}
            # else:
            #     res_dt1= {"suc": 0, "msg": f"Error while updating item"}

    #===========================================================================================================

    if result['suc']>0 :
                res_dt = {"suc": 1, "msg": f"Saved Successfully"}
    else:
                 res_dt = {"suc": 0, "msg": f"Error while updating invoice"}
            
    
    return res_dt

@stockRouter.post("/save_transfer_ptow")
async def save_trans(data:SaveTrans):
    res_dt = {}
    print(data)
    current_datetime = datetime.now()
    tno = int(round(current_datetime.timestamp()))
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")


    fields= f"trans_no,trans_dt,intended_for,client_id,from_proj_id,to_proj_id,purpose,created_by,created_at,req_by"
    values = f"'TPW-{tno}', '{data.trans_dt}', '{data.intended_for}', {data.client_id},'{data.project_id}',{'0'},'{data.purpose}','{data.user}','{formatted_dt}','{data.user}'"
    table_name = "td_transfer"
    whr = ""
    flag = 0
    result = await db_Insert(table_name, fields, values, whr, flag)
    lastID=result["lastId"]
    await user_log_update(data.user,'N','td_Transfer',formatted_dt,lastID)

    #========================================================================================================
    for i in data.items:
                fields= f'trans_no,item_id,qty,created_by,created_at,approved_qty,balance'
                values = f"'TPW-{tno}','{i.item_id}','{i.qty}','{data.user}','{formatted_dt}',{'0'},'{i.qty}'"
                table_name = "td_transfer_items"
                whr=""
                # flag1 = 1 if v.sl_no>0 else 0
                flag1 = 1 if data.sl_no>0 else 0
                result2 = await db_Insert(table_name, fields, values, whr, flag1)
            

                if(result2['suc']>0): 

                    res_dt2 = {"suc": 1, "msg": f"Saved Successfully"}

                else:
                    res_dt2= {"suc": 0, "msg": f"Error while inserting"}
            # else:
            #     res_dt1= {"suc": 0, "msg": f"Error while updating item"}

    #===========================================================================================================

    if result['suc']>0 :
                res_dt = {"suc": 1, "msg": f"Saved Successfully"}
    else:
                 res_dt = {"suc": 0, "msg": f"Error while updating invoice"}
            
    
    return res_dt


@stockRouter.post("/get_twp")
async def save_trans(data:GetTrans):
    res_dt = {}

    select = "t.trans_no,t.trans_dt,t.created_by,t.created_at,t.sl_no,p.proj_name,p.proj_id"
    schema = "td_transfer t,td_project p"
    where = f"t.sl_no='{data.id}' and t.trans_no like '%{'TWP-'}%' and p.sl_no=t.to_proj_id" if data.id>0 else f"t.trans_no like '%{'TWP-'}%' and p.sl_no=t.to_proj_id"
    order = "ORDER BY t.created_at DESC"
    flag = 0 if data.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@stockRouter.post("/get_tpw")
async def save_trans(data:GetTrans):
    res_dt = {}

    select = "t.trans_no,t.trans_dt,t.created_by,t.created_at,t.sl_no,p.proj_name,p.proj_id"
    schema = "td_transfer t,td_project p"
    where = f"t.sl_no='{data.id}' and t.trans_no like '%{'TPW-'}%' and p.sl_no=t.from_proj_id" if data.id>0 else f"t.trans_no like '%{'TPW-'}%' and p.sl_no=t.from_proj_id"
    order = "ORDER BY t.created_at DESC"
    flag = 0 if data.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@stockRouter.post("/get_twp_record")
async def save_trans(data:GetTrans):
    select1 = f"client_id"
    schema1 = "td_transfer"
    where1= f"sl_no='{data.id}'" 
    order1 = "ORDER BY created_at DESC"
    flag1 = 0 
    result1= await db_select(select1, schema1, where1, order1, flag1)
    print('client_id=',result1['msg']['client_id'])
    res_dt = {}
    select = f"t.trans_no,t.trans_dt,t.created_by,t.created_at,t.sl_no,p.proj_name,t.to_proj_id,t.purpose,t.intended_for,t.client_id,c.client_name" if result1['msg']['client_id']>0 else f"t.trans_no,t.trans_dt,t.created_by,t.created_at,t.sl_no,p.proj_name,t.to_proj_id,t.purpose,t.intended_for"
    schema = f"td_transfer t,td_project p,md_client c" if result1['msg']['client_id']>0 else "td_transfer t,td_project p"
    where = f"t.sl_no='{data.id}' and t.trans_no like '%{'TWP-'}%' and p.sl_no=t.to_proj_id and c.sl_no = t.client_id" if result1['msg']['client_id']>0 else f"t.sl_no='{data.id}' and t.trans_no like '%{'TWP-'}%' and p.sl_no=t.to_proj_id"
    order = "ORDER BY t.created_at DESC"
    flag = 0 
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@stockRouter.post("/get_trans_items")
async def save_trans(data:GetTransItem):
    res_dt = {}

    select = "*"
    schema = "td_transfer_items"
    where = f"trans_no='{data.trans_no}'"
    order = ""
    flag =  1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result




@stockRouter.post("/save_transfer_ptop")
async def save_trans(data:SaveTransPtoP):
    res_dt = {}
    print(data)
    current_datetime = datetime.now()
    tno = int(round(current_datetime.timestamp()))
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")


    fields= f"trans_no,trans_dt,intended_for,client_id,from_proj_id,to_proj_id,purpose,created_by,created_at,req_by"
    values = f"'TPP-{tno}', '{data.trans_dt}', '{data.intended_for}', {data.client_id},'{data.from_project_id}', '{data.project_id}','{data.purpose}','{data.user}','{formatted_dt}','{data.user}'"
    table_name = "td_transfer"
    whr = ""
    flag = 0
    result = await db_Insert(table_name, fields, values, whr, flag)
    lastID=result["lastId"]
    await user_log_update(data.user,'N','td_Transfer',formatted_dt,lastID)

    #========================================================================================================
    for i in data.items:
                fields= f'trans_no,item_id,qty,created_by,created_at,approved_qty,balance'
                values = f"'TPP-{tno}','{i.item_id}','{i.qty}','{data.user}','{formatted_dt}',{'0'},'{i.qty}'"
                table_name = "td_transfer_items"
                whr=""
                # flag1 = 1 if v.sl_no>0 else 0
                flag1 = 1 if data.sl_no>0 else 0
                result2 = await db_Insert(table_name, fields, values, whr, flag1)
            

                if(result2['suc']>0): 

                    res_dt2 = {"suc": 1, "msg": f"Saved Successfully"}

                else:
                    res_dt2= {"suc": 0, "msg": f"Error while inserting"}
            # else:
            #     res_dt1= {"suc": 0, "msg": f"Error while updating item"}

    #===========================================================================================================

    if result['suc']>0 :
                res_dt = {"suc": 1, "msg": f"Saved Successfully"}
    else:
                 res_dt = {"suc": 0, "msg": f"Error while updating invoice"}
            
    
    return res_dt




@stockRouter.post("/get_tpp")
async def save_trans(data:GetTrans):
    res_dt = {}

    select = "t.trans_no,t.trans_dt,t.created_by,t.created_at,t.sl_no,p.proj_name,p.proj_id as to_id,t.to_proj_id,t.from_proj_id,(select proj_name from td_project where sl_no=t.from_proj_id) as from_proj_name,(select proj_id from td_project where sl_no=t.from_proj_id) as from_id"
    schema = "td_transfer t,td_project p"
    where = f"t.sl_no='{data.id}' and t.trans_no like '%{'TPP-'}%' and p.sl_no=t.to_proj_id" if data.id>0 else f"t.trans_no like '%{'TPP-'}%' and p.sl_no=t.to_proj_id"
    order = "ORDER BY t.created_at DESC"
    flag = 0 if data.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@stockRouter.post("/get_tpp_record")
async def save_trans(data:GetTrans):
    select1 = f"client_id"
    schema1 = "td_transfer"
    where1= f"sl_no='{data.id}'" 
    order1 = "ORDER BY created_at DESC"
    flag1 = 0 
    result1= await db_select(select1, schema1, where1, order1, flag1)
    res_dt = {}
    select = f"t.trans_no,t.trans_dt,t.created_by,t.created_at,t.from_proj_id,t.sl_no,p.proj_name,t.to_proj_id,t.purpose,t.intended_for,t.client_id,c.client_name,(select proj_name from td_project where sl_no=t.from_proj_id) as from_proj_name" if result1['msg']['client_id']>0 else f"t.trans_no,t.trans_dt,t.created_by,t.created_at,t.sl_no,p.proj_name,t.to_proj_id,t.purpose,t.intended_for,(select proj_name from td_project where sl_no=t.from_proj_id) as from_proj_name"
    schema = f"td_transfer t,td_project p,md_client c" if result1['msg']['client_id']>0 else "td_transfer t,td_project p"
    where = f"t.sl_no='{data.id}' and t.trans_no like '%{'TPP-'}%' and p.sl_no=t.to_proj_id and c.sl_no = t.client_id" if result1['msg']['client_id']>0 else f"t.sl_no='{data.id}' and t.trans_no like '%{'TPP-'}%' and p.sl_no=t.to_proj_id"
    order = "ORDER BY t.created_at DESC"
    flag = 0 if data.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result


@stockRouter.post("/get_tpw_record")
async def save_trans(data:GetTrans):
    
    select = f"t.trans_no,t.trans_dt,t.created_by,t.created_at,t.sl_no,p.proj_name,t.to_proj_id,t.purpose,t.intended_for,(select proj_name from td_project where sl_no=t.from_proj_id) as from_proj_name"
    schema = f"td_transfer t,td_project p"
    where = f"t.sl_no='{data.id}' and t.trans_no like '%{'TPW-'}%' and p.sl_no=t.to_proj_id"
    order = "ORDER BY t.created_at DESC"
    flag = 0 if data.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result


@stockRouter.post("/get_transfer_stock")
async def save_trans(data:GetTrans):
    res_dt = {}

    select = "t.trans_no,t.trans_dt,t.created_by,t.created_at,t.sl_no,p.proj_name,p.proj_id as to_projid,t.to_proj_id,t.from_proj_id,(select proj_name from td_project where sl_no=t.from_proj_id) as from_proj_name,(select proj_id from td_project where sl_no=t.from_proj_id) as from_projid"
    table = "td_transfer t left join td_project p on p.sl_no=t.to_proj_id"
    where = f"t.sl_no='{data.id}' " if data.id>0 else f""
    order = "ORDER BY t.created_at DESC"
    flag = 0 if data.id>0 else 1
    result = await db_select(select, table, where, order, flag)
    print(result, 'RESULT')
    return result




@stockRouter.post("/get_transfer_stock_items")
async def save_trans(data:GetTransItem):
    res_dt = {}
    select = "t.sl_no,t.trans_no,t.item_id,t.qty, t.created_at, t.approve_flag,p.prod_name,t.balance,t.approved_qty,t.cancelled_qty,t.approve_flag,t.cancelled_by,t.cancel_flag,t.approved_by,p.model_no,p.article_no,p.part_no"
    schema = "td_transfer_items t,md_product p"
    where = f"t.trans_no='{data.trans_no}' and p.sl_no=t.item_id"
    order = "ORDER BY t.created_at DESC"
    flag =  1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@stockRouter.post('/get_logical_stock')
async def getprojectpoc(id:GetStock):
    # print(id.id)
    res_dt = {}
    select1 = f"sum(i.qty) as req_stock"
    schema1 = "td_transfer t,td_transfer_items i"
    where1 = f"i.item_id={id.prod_id} and t.from_proj_id ={id.proj_id} and i.approve_flag='P' and i.trans_no=t.trans_no"
    order1 = ""
    flag1 = 0 
    result1 = await db_select(select1, schema1, where1, order1, flag1)
    print("qty=======",result1['msg']['req_stock'])

    # select = f"SUM(qty*in_out_flag) project_stock, (SELECT SUM(qty*in_out_flag) project_stock FROM td_stock_new where item_id={id.prod_id} and proj_id = 0) as warehouse_stock, sum(req_qty*in_out_flag) req_qty"
    select = f"(SELECT SUM(qty*in_out_flag)  td_stock_new where item_id={id.prod_id} and proj_id = {id.proj_id} and proj_id!=0) project_stock, (SELECT SUM(qty*in_out_flag) project_stock FROM td_stock_new where item_id={id.prod_id} and proj_id = 0) as warehouse_stock, sum(req_qty*in_out_flag) req_qty"
    schema = "td_stock_new"
    where = f"item_id={id.prod_id} and proj_id ={id.proj_id}"
    order = ""
    flag = 1 
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return {"result":result,"req_stock":result1['msg']['req_stock']}

@stockRouter.post('/get_logical_stock_req')
async def getprojectpoc(id:GetStock):
    # print(id.id)
    res_dt = {}
    # select1 = f"sum(i.req_qty) as req_stock"
    select1 = f"sum(i.req_qty) as req_stock"
    schema1 = "td_requisition t,td_requisition_items i"
    # where1 = f"i.item_id={id.prod_id} and t.project_id ={id.proj_id} and i.approve_flag='P' and i.req_no=t.req_no"
    where1 = f"i.item_id={id.prod_id} and t.project_id ={id.proj_id} and i.req_no=t.req_no"
    order1 = ""
    flag1 = 0 
    result1 = await db_select(select1, schema1, where1, order1, flag1)

    select_tot = f"sum(i.req_qty) as tot_stock"
    schema_tot = "td_requisition t,td_requisition_items i"
    where_tot = f"i.item_id={id.prod_id} and t.project_id ={id.proj_id} and i.req_no=t.req_no"
    order_tot = ""
    flag_tot = 0 
    result_tot = await db_select(select_tot, schema_tot, where_tot, order_tot, flag_tot)
    print("tot_stock=======",result_tot['msg']['tot_stock'])

    select2 = f"sum(qty) as del_stock"
    schema2 = "td_stock_new"
    where2 = f"item_id={id.prod_id} and proj_id ={id.proj_id} and in_out_flag=-1 and ref_no not like 'T%'"
    order2 = ""
    flag2 = 0 
    result2 = await db_select(select2, schema2, where2, order2, flag2)
    print(result2)

    select = f"(SELECT SUM(qty*in_out_flag) td_stock_new where item_id={id.prod_id} and proj_id = {id.proj_id} and proj_id!=0) project_stock, (SELECT SUM(qty*in_out_flag) project_stock FROM td_stock_new where item_id={id.prod_id} and proj_id = 0) as warehouse_stock, sum(req_qty*in_out_flag) req_qty"
    schema = "td_stock_new"
    where = f"item_id={id.prod_id} and proj_id ={id.proj_id}"
    order = ""
    flag =1 
    result = await db_select(select, schema, where, order, flag)
    if result1['suc']>0:
      
    #    cancel_stock= result_can['msg']['can_stock'] if result_can['msg']['can_stock'] else 0
    #    return {"result":result,"req_stock":result1['msg']['req_stock'],"cancel_stock":cancel_stock ,"tot_stock":int(result_tot['msg']['tot_stock']) - result2['msg']['del_stock'] if int(result_tot['msg']['tot_stock']) and result2['msg']['del_stock'] else int(result_tot['msg']['tot_stock']) if int(result_tot['msg']['tot_stock']) else 0}
       return {"project_stock":result['msg'][0]['project_stock'],"warehouse_stock":result['msg'][0]['warehouse_stock'],"req_stock":result1['msg']['req_stock'],"tot_stock":result_tot['msg']['tot_stock'] if result_tot else 0,"del_stock":result2['msg']['del_stock'] if result2 else 0}
    else:
       return {"result":result,"req_stock":0,"tot_stock":0,"can_stock":0}
    

# @stockRouter.post("/approve_transfer_items")
# async def save_trans(data:GetApproveItems):
#     current_datetime = datetime.now()
#     formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
#     formatted_appr_dt= current_datetime.strftime("%Y-%m-%d")
#     stock_in = 1
#     stock_out = -1
#     for i in data.items:
#             select1 = f"approve_flag"
#             schema1 = "td_transfer_items"
#             where1= f"sl_no='{i.sl_no}'" 
#             order1 = "ORDER BY created_at DESC"
#             flag1 = 0 
#             result1= await db_select(select1, schema1, where1, order1, flag1)
#             if i.approve_flag=='A' and (result1['msg']['approve_flag']!='A' or result1['msg']['approve_flag']!='H') :
#                 fields= f"approve_flag='{i.approve_flag}',approved_by='{data.user}',approved_at='{formatted_dt}', approved_qty={i.qty}"
#                 values = f''
#                 table_name = "td_transfer_items"
#                 whr=f"trans_no='{data.trans_no}' and sl_no={i.sl_no}"   
#                 flag1 = 1 
#                 result2 = await db_Insert(table_name, fields, values, whr, flag1)
#                 if result2['suc']>0:
#                   res_dt = {"suc": 1, "msg": f"Successfully saved!"}
                
#                 else:
#                   res_dt = {"suc": 0, "msg": f"Error while saving!"}


                  


                  


#                 # ======================================================

#             select_stck = f"max(date) as max_dt"
#             schema_stck = "td_stock_new"
#             where_stck= f"proj_id='{data.to_proj_id}' and item_id='{i.item_id}'" 
#             order_stck = ""
#             flag_stck = 0 
#             result_stck= await db_select(select_stck, schema_stck, where_stck, order_stck, flag_stck)

#             select_stck1 = f"max(sl_no) as max_sl"
#             schema_stck1 = "td_stock_new"
#             where_stck1= f"proj_id='{data.to_proj_id}' and item_id='{i.item_id}'" 
#             order_stck1 = ""
#             flag_stck1 = 0 
#             result_stck1= await db_select(select_stck1, schema_stck1, where_stck1, order_stck1, flag_stck1)

#             print(result_stck['msg']['max_dt'],result_stck1['msg']['max_sl'])

#             if result_stck['msg']['max_dt'] and result_stck1['msg']['max_sl']:
#                  select_stck2 = f"balance,count(balance) as cnt"
#                  schema_stck2 = "td_stock_new"
#                  where_stck2= f"proj_id='{data.to_proj_id}' and item_id='{i.item_id}' and date='{result_stck['msg']['max_dt']}' and sl_no='{result_stck1['msg']['max_sl']}'" 
#                  order_stck2 = ""
#                  flag_stck2 = 0 
#                  result_stck2= await db_select(select_stck2, schema_stck2, where_stck2, order_stck2, flag_stck2)
#                  qty = result_stck2['msg']['balance'] + i.qty 
#             else:
#                  qty=i.qty

#             flds= f'date,ref_no,proj_id,item_id,qty,in_out_flag,balance,created_by,created_at'
#             val = f'"{formatted_appr_dt}","{data.trans_no}","{data.to_proj_id}",{i.item_id},{i.qty},{stock_in},{qty},"{data.user}","{formatted_dt}"'
#             table = "td_stock_new"
#             whr=f""
#             flag2 =  0
#             result3 = await db_Insert(table, flds, val, whr, flag2)
#             if(result3['suc']>0): 
#                 stock_save = 1
#                 res_dt2 = {"suc": 1, "msg": f"Updated Successfully And Inserted to stock"}

#             else:
#                 stock_save = 0

#                 res_dt2= {"suc": 0, "msg": f"Error while inserting into td_stock_new"}
            
#             select_stck = f"max(date) as max_dt"
#             schema_stck = "td_stock_new"
#             where_stck= f"proj_id='{data.from_proj_id}' and item_id='{i.item_id}'" 
#             order_stck = ""
#             flag_stck = 0 
#             result_stck= await db_select(select_stck, schema_stck, where_stck, order_stck, flag_stck)

#             select_stck1 = f"max(sl_no) as max_sl"
#             schema_stck1 = "td_stock_new"
#             where_stck1= f"proj_id='{data.from_proj_id}' and item_id='{i.item_id}'" 
#             order_stck1 = ""
#             flag_stck1 = 0 
#             result_stck1= await db_select(select_stck1, schema_stck1, where_stck1, order_stck1, flag_stck1)

#             print(result_stck['msg']['max_dt'],result_stck1['msg']['max_sl'])


#             select_stck2 = f"balance"
#             schema_stck2 = "td_stock_new"
#             where_stck2= f"proj_id='{data.from_proj_id}' and item_id='{i.item_id}' and date='{result_stck['msg']['max_dt']}' and sl_no='{result_stck1['msg']['max_sl']}'" 
#             order_stck2 = ""
#             flag_stck2 = 0 
#             result_stck2= await db_select(select_stck2, schema_stck2, where_stck2, order_stck2, flag_stck2)

#             qty = result_stck2['msg']['balance'] - i.qty

#             flds_out= f'date,ref_no,proj_id,item_id,qty,in_out_flag,balance,created_by,created_at'
#             val_out= f'"{formatted_appr_dt}","{data.trans_no}","{data.from_proj_id}",{i.item_id},{i.qty},{stock_out},{qty},"{data.user}","{formatted_dt}"'
#             table_out= "td_stock_new"
#             whr_out=f""
#             flag2_out=  0
#             result3_out= await db_Insert(table_out, flds_out, val_out, whr_out, flag2_out)
#             if(result3_out['suc']>0): 
#                 stock_save = 1
#                 res_dt2_out = {"suc": 1, "msg": f"Updated Successfully And Inserted to stock"}

#             else:
#                 stock_save = 0

#                 res_dt2_out= {"suc": 0, "msg": f"Error while inserting into td_stock_new"}

#                 # ======================================================
    
#     res_dt = {"suc": 1, "msg": res_dt2_out['msg']}
   
#     return res_dt


@stockRouter.post('/get_logical_stock_req_all')
async def getprojectpoc(id:GetStock):
    # print(id.id)
    # SELECT sum(st.qty*st.in_out_flag) as stock,st.item_id,p.prod_name,(r.req_qty) as req_qty FROM td_stock_new st left join td_requisition_items r on r.project_id=st.proj_id left join md_product p on st.item_id=p.sl_no where st.proj_id=8 group by st.item_id;
    res_dt = {}
    # select = f"sum(st.qty*st.in_out_flag) as stock,(select sum(st.qty) from td_stock_new where in_out_flag=-1 and proj_id={id.proj_id}) as del_stock,st.item_id,p.prod_name,(r.req_qty) as req_qty"
    # schema = "td_stock_new st left join td_requisition_items r on r.project_id=st.proj_id left join md_product p on st.item_id=p.sl_no"
    # where = f"st.proj_id={id.proj_id} group by st.item_id"
    # order = ""
    # flag =1 
    # result = await db_select(select, schema, where, order, flag)
    select = f"st.item_id,concat(p.prod_name,' (Part No.: ',p.part_no,' Article No.: ',p.article_no,' Model No.: ',p.model_no,' Desc: ',p.prod_desc,') ') prod_name,SUM(st.qty * st.in_out_flag) AS stock,COALESCE(ds.del_stock, 0)AS del_stock,COALESCE(rq.req_qty, 0) AS req_qty"
    where = f"st.proj_id={id.proj_id} group by st.item_id, p.prod_name,ds.del_stock, rq.req_qty"
    schema = f"td_stock_new st LEFT JOIN  (SELECT item_id, proj_id, SUM(qty) AS del_stock FROM td_stock_new WHERE in_out_flag = -1 and ref_no not like 'T%' and proj_id={id.proj_id} GROUP BY item_id, proj_id) ds ON ds.item_id = st.item_id AND ds.proj_id = st.proj_id LEFT JOIN (SELECT item_id, project_id, SUM(req_qty) AS req_qty FROM td_requisition_items GROUP BY item_id, project_id) rq ON rq.project_id = st.proj_id AND rq.item_id = st.item_id LEFT JOIN  md_product p ON st.item_id = p.sl_no"
    order = ""
    flag =1 
    result = await db_select(select, schema, where, order, flag)
    return result
    
     
   

@stockRouter.post("/approve_transfer_items")
async def save_trans(data:GetApproveItems):
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    formatted_appr_dt= current_datetime.strftime("%Y-%m-%d")
    stock_in = 1
    stock_out = -1
    for i in data.items:
            select1 = f"approve_flag"
            schema1 = "td_transfer_items"
            where1= f"sl_no='{i.sl_no}'" 
            order1 = "ORDER BY created_at DESC"
            flag1 = 0 
            result1= await db_select(select1, schema1, where1, order1, flag1)
            if data.status=='A':
                fields= f"approve_flag='{i.approve_flag}',approved_by='{data.user}',approved_at='{formatted_dt}'"
                values = f''
                table_name = "td_transfer_items"
                whr=f"trans_no='{data.trans_no}' and sl_no={i.sl_no}"   
                flag1 = 1 
                result2 = await db_Insert(table_name, fields, values, whr, flag1)
                if result2['suc']>0:
                  res_dt = {"suc": 1, "msg": f"Successfully saved!"}
                else:
                  res_dt = {"suc": 0, "msg": f"Error while saving!"}


                select = "balance"
                table = "td_transfer_items"
                where = f"sl_no={i.sl_no}"
                order = ""
                flag = 0 
                res_dt = await db_select(select,table,where,order,flag)
                print('dfdfdfdf',res_dt['msg'])

                _select = "approved_qty"
                _table = "td_transfer_items"
                _where = f"sl_no={i.sl_no}"
                _order = ""
                _flag = 0 
                _res_dt = await db_select(_select,_table,_where,_order,_flag)
                print('dfdfdfdf',_res_dt['msg'])
                if i.qty>0:
                    balance = int(res_dt['msg']['balance']) - i.qty if int(res_dt['msg']['balance'])>0 else i.qty
                    approved_qty = int(_res_dt['msg']['approved_qty']) + i.qty if int(_res_dt['msg']['approved_qty'])>0 else i.qty
                    # approve_flag = 'A'  if approved_qty == i.req_qty else 'H'
                    approve_flag = 'A'  
                    fields1= f'approved_qty={approved_qty},balance={balance},modified_by="{data.user}",modified_at="{formatted_dt}",approve_flag="{approve_flag}"'
                    values1 = f''
                    table_name1 = "td_transfer_items"
                    whr1 = f'sl_no="{i.sl_no}"' 

                    flag2 = 1 

                    result3 = await db_Insert(table_name1, fields1, values1, whr1, flag2)

                # ======================================================

                    # select_stck = f"max(date) as max_dt"
                    # schema_stck = "td_stock_new"
                    # where_stck= f"proj_id='{data.to_proj_id}' and item_id='{i.item_id}'" 
                    # order_stck = ""
                    # flag_stck = 0 
                    # result_stck= await db_select(select_stck, schema_stck, where_stck, order_stck, flag_stck)
                    
                    select_stck1 = f"max(sl_no) as max_sl"
                    schema_stck1 = "td_stock_new"
                    where_stck1= f"proj_id='{data.to_proj_id}' and item_id='{i.item_id}'" 
                    order_stck1 = ""
                    flag_stck1 = 0 
                    result_stck1= await db_select(select_stck1, schema_stck1, where_stck1, order_stck1, flag_stck1)
                    
                    if result_stck1['msg']['max_sl']:
                        select_stck = f"max(date) as max_dt"
                        schema_stck = "td_stock_new"
                        where_stck= f"proj_id='{data.to_proj_id}' and item_id='{i.item_id}' and sl_no = {result_stck1['msg']['max_sl']}" 
                        order_stck = ""
                        flag_stck = 0 
                        result_stck= await db_select(select_stck, schema_stck, where_stck, order_stck, flag_stck)

                    if result_stck1['msg']['max_sl']:
                        select_stck2 = f"balance,count(balance) as cnt"
                        schema_stck2 = "td_stock_new"
                        where_stck2= f"proj_id='{data.to_proj_id}' and item_id='{i.item_id}' and date='{result_stck['msg']['max_dt']}' and sl_no='{result_stck1['msg']['max_sl']}'" 
                        order_stck2 = ""
                        flag_stck2 = 0 
                        result_stck2= await db_select(select_stck2, schema_stck2, where_stck2, order_stck2, flag_stck2)
                        qty = result_stck2['msg']['balance'] + Decimal(i.qty) 
                    else:
                        qty=i.qty

                    flds= f'date,ref_no,proj_id,item_id,qty,in_out_flag,balance,created_by,created_at'
                    val = f'"{formatted_appr_dt}","{data.trans_no}","{data.to_proj_id}",{i.item_id},{i.qty},{stock_in},{qty},"{data.user}","{formatted_dt}"'
                    table = "td_stock_new"
                    whr=f""
                    flag2 =  0
                    result3 = await db_Insert(table, flds, val, whr, flag2)
                    if(result3['suc']>0): 
                        stock_save = 1
                        res_dt2 = {"suc": 1, "msg": f"Updated Successfully And Inserted to stock"}

                    else:
                        stock_save = 0

                        res_dt2= {"suc": 0, "msg": f"Error while inserting into td_stock_new"}
                    
                    # select_stck = f"max(date) as max_dt"
                    # schema_stck = "td_stock_new"
                    # where_stck= f"proj_id='{data.from_proj_id}' and item_id='{i.item_id}'" 
                    # order_stck = ""
                    # flag_stck = 0 
                    # result_stck= await db_select(select_stck, schema_stck, where_stck, order_stck, flag_stck)

                    select_stck1 = f"max(sl_no) as max_sl"
                    schema_stck1 = "td_stock_new"
                    where_stck1= f"proj_id='{data.from_proj_id}' and item_id='{i.item_id}'" 
                    order_stck1 = ""
                    flag_stck1 = 0 
                    result_stck1= await db_select(select_stck1, schema_stck1, where_stck1, order_stck1, flag_stck1)

                    select_stck = f"max(date) as max_dt"
                    schema_stck = "td_stock_new"
                    where_stck= f"proj_id='{data.from_proj_id}' and item_id='{i.item_id}' and sl_no={result_stck1['msg']['max_sl']}" 
                    order_stck = ""
                    flag_stck = 0 
                    result_stck= await db_select(select_stck, schema_stck, where_stck, order_stck, flag_stck)
                    


                    select_stck2 = f"balance"
                    schema_stck2 = "td_stock_new"
                    where_stck2= f"proj_id='{data.from_proj_id}' and item_id='{i.item_id}' and date='{result_stck['msg']['max_dt']}' and sl_no='{result_stck1['msg']['max_sl']}'" 
                    order_stck2 = ""
                    flag_stck2 = 0 
                    result_stck2= await db_select(select_stck2, schema_stck2, where_stck2, order_stck2, flag_stck2)

                    qty = result_stck2['msg']['balance'] - Decimal(i.qty)

                    flds_out= f'date,ref_no,proj_id,item_id,qty,in_out_flag,balance,created_by,created_at'
                    val_out= f'"{formatted_appr_dt}","{data.trans_no}","{data.from_proj_id}",{i.item_id},{i.qty},{stock_out},{qty},"{data.user}","{formatted_dt}"'
                    table_out= "td_stock_new"
                    whr_out=f""
                    flag2_out=  0
                    result3_out= await db_Insert(table_out, flds_out, val_out, whr_out, flag2_out)

                    # if balance>0:
                    #     select_stck = f"max(date) as max_dt"
                    #     schema_stck = "td_stock_new"
                    #     where_stck= f"proj_id='{data.from_proj_id}' and item_id='{i.item_id}'" 
                    #     order_stck = ""
                    #     flag_stck = 0 
                    #     result_stck= await db_select(select_stck, schema_stck, where_stck, order_stck, flag_stck)

                    #     select_stck1 = f"max(sl_no) as max_sl"
                    #     schema_stck1 = "td_stock_new"
                    #     where_stck1= f"proj_id='{data.from_proj_id}' and item_id='{i.item_id}'" 
                    #     order_stck1 = ""
                    #     flag_stck1 = 0 
                    #     result_stck1= await db_select(select_stck1, schema_stck1, where_stck1, order_stck1, flag_stck1)
                    
                    #     flds_out= f'date,ref_no,proj_id,item_id,qty,in_out_flag,balance,created_by,created_at'
                        
                    #     val_out= f'"{formatted_appr_dt}","{data.trans_no}","{data.from_proj_id}",{i.item_id},{i.qty},{stock_in},{balance},"{data.user}","{formatted_dt}"'
                    #     table_out= "td_stock_new"
                    #     whr_out=f""
                    #     flag2_out=  0
                    #     result3_out= await db_Insert(table_out, flds_out, val_out, whr_out, flag2_out)
                    # print(result3_out)
                    if(result3_out['suc']>0): 
                        stock_save = 1
                        res_dt2_out = {"suc": 1, "msg": f"Updated Successfully And Inserted to stock"}

                    else:
                        stock_save = 0

                        res_dt2_out= {"suc": 0, "msg": f"Error while inserting into td_stock_new"}

                        # ======================================================
        
            else:
                # fields= f"cancel_flag='{i.approve_flag}',cancelled_by='{data.user}',cancelled_at='{formatted_dt}'"
                # values = f''
                # table_name = "td_transfer_items"
                # whr=f"trans_no='{data.trans_no}' and sl_no={i.sl_no}"   
                # flag1 = 1 
                # result2 = await db_Insert(table_name, fields, values, whr, flag1)
                # if result2['suc']>0:
                #   res_dt = {"suc": 1, "msg": f"Successfully saved!"}
                
                # else:
                #   res_dt = {"suc": 0, "msg": f"Error while saving!"}


                # select = "balance"
                # table = "td_transfer_items"
                # where = f"sl_no={i.sl_no}"
                # order = ""
                # flag = 0 
                # res_dt = await db_select(select,table,where,order,flag)
                # print('dfdfdfdf',res_dt['msg'])

                # _select = "cancelled_qty"
                # _table = "td_transfer_items"
                # _where = f"sl_no={i.sl_no}"
                # _order = ""
                # _flag = 0 
                # _res_dt = await db_select(_select,_table,_where,_order,_flag)
                # print('dfdfdfdf',_res_dt['msg'])
                # if i.qty>0:
                #     balance = int(res_dt['msg']['balance']) - i.qty if int(res_dt['msg']['balance'])>0 else i.qty
                #     cancelled_qty = int(_res_dt['msg']['cancelled_qty']) + i.qty if int(_res_dt['msg']['cancelled_qty'])>0 else i.qty
                #     cancel_flag = 'A'  if cancelled_qty == i.qty else 'H'
                #     # cancell_flag = 'A'  
                #     fields1= f'cancelled_qty={cancelled_qty},balance={balance},modified_by="{data.user}",modified_at="{formatted_dt}",cancel_flag="{cancel_flag}"'
                #     values1 = f''
                #     table_name1 = "td_transfer_items"
                #     whr1 = f'sl_no="{i.sl_no}"' 

                #     flag2 = 1 

                #     result3 = await db_Insert(table_name1, fields1, values1, whr1, flag2)
                #     if result3['suc']>0:
                #         res_dt = {"suc": 1, "msg": f"Successfully saved!"}
                
                #     else:
                #         res_dt = {"suc": 0, "msg": f"Error while saving!"}

            # for i in id.items:

            #     select = "balance"
            #     table = "td_requisition_items"
            #     where = f"sl_no={i.sl_no}"
            #     order = ""
            #     flag = 0 
            #     res_dt = await db_select(select,table,where,order,flag)
            #     print('dfdfdfdf',res_dt['msg'])

            #     _select = "cancelled_qty"
            #     _table = "td_requisition_items"
            #     _where = f"sl_no={i.sl_no}"
            #     _order = ""
            #     _flag = 0 
            #     _res_dt = await db_select(_select,_table,_where,_order,_flag)

            #     _select1 = "req_qty"
            #     _table1 = "td_requisition_items"
            #     _where1 = f"sl_no={i.sl_no}"
            #     _order1 = ""
            #     _flag1 = 0 
            #     _res_dt1 = await db_select(_select1,_table1,_where1,_order1,_flag1)
            #     if i.qty>0:
            #         balance = int(res_dt['msg']['balance']) - i.qty if int(res_dt['msg']['balance'])>0 else i.req_qty - i.qty
            #         cancelled_qty = int(_res_dt['msg']['cancelled_qty']) + i.qty if int(_res_dt['msg']['cancelled_qty'])>0 else i.qty
            #         req_qty = int(_res_dt1['msg']['req_qty']) - i.qty if int(_res_dt1['msg']['req_qty'])>0 else i.qty
            #         cancel_flag = 'R'  if cancelled_qty == i.req_qty else 'H'
            #         fields1= f'req_qty="{req_qty}",cancelled_qty="{cancelled_qty}",balance={balance},modified_by="{id.user}",modified_at="{formatted_dt}",approve_flag="{cancel_flag}", deleted_by="{id.user}",deleted_at="{formatted_dt}"'
            #         values1 = f''
            #         table_name1 = "td_requisition_items"
            #         whr1 = f'sl_no="{i.sl_no}"' 

            #         flag2 = 1 

            #         result3 = await db_Insert(table_name1, fields1, values1, whr1, flag2)
            # else:

                current_datetime = datetime.now()
                res_dt={}
                formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")

                    

                fields_insert1= f'SELECT * FROM td_transfer WHERE trans_no = "{data.trans_no}"'
                table_names_insert1 = "td_transfer_cancel"
                results_insert1 = await db_Insert(table_names_insert1, fields_insert1, None, None, 0, True)

                fields=f''
                table_name = "td_transfer"
                flag = 1 
                values=''
                whr=f'trans_no="{data.trans_no}"'
                result = await db_Delete(table_name, whr)

                fields_insert2= f'SELECT * FROM td_transfer_items WHERE trans_no = "{data.trans_no}"'
                table_names_insert2 = "td_transfer_items_cancel"
                results_insert2 = await db_Insert(table_names_insert2, fields_insert2, None, None, 0, True)
                    
                fields1=f''
                table_name1 = "td_transfer_items"
                flag1 = 1 
                values1=''
                whr1=f'trans_no="{data.trans_no}"'
                result1 = await db_Delete(table_name1, whr1)

                
                if result1['suc']>0 and result['suc']>0:
                        res_dt={'suc':1,'msg':'Cancelled successfully!'}
                else:
                        res_dt={'suc':0,'msg':'Error while deleting!'}
                 
    res_dt = {"suc": 1, "msg": "Action Successful!"}
    await user_log_update(data.user,'A' if data.status=='A' else 'C','td_Transfer',formatted_dt,data.trans_no)

   
    return res_dt



@stockRouter.post('/advanced_search_transfer')
async def getprojectpoc(id:PoSearch):
   
    res_dt = {}

    select = "t.sl_no,t.trans_no,t.from_proj_id,t.to_proj_id,i.item_id,p.prod_name,p.prod_make,p.part_no,(select proj_name from td_project where sl_no=t.to_proj_id) to_proj_name,(select proj_name from td_project where sl_no=t.from_proj_id) from_proj_name"
    schema = '''td_transfer t left join td_transfer_items i on t.trans_no=i.trans_no
left join md_product p ON p.sl_no=i.item_id 
'''
    where = ""
    if(id.from_proj_id != 0 and id.from_proj_id != ""):
        where += f"t.from_proj_id='{id.from_proj_id}' {"AND " if(id.to_proj_id != '' or id.part_no != '' or id.prod_id != '' or id.make!='') else ''}"
    if(id.to_proj_id != 0 and id.to_proj_id != ""):
        where += f"t.to_proj_id='{id.to_proj_id}' {"AND " if(id.part_no != '' or id.prod_id != '' or id.make!='') else ''}"
    if(id.part_no != ''):
        where += f"p.part_no like '%{id.part_no}%' {"AND " if(id.prod_id != '' or id.make!='') else ''}"
    if(id.prod_id != ''):
        where += f"i.item_id='{id.prod_id}' {"AND " if id.make else ''}"
    if(id.make):
         where += f"p.prod_make like '%{id.make}%' "
    # if(id.to_dt != '' or id.from_dt != ''):
    #     where += f'''(b.po_issue_date BETWEEN "{f'{id.from_dt}' if(id.from_dt != '') else ''}" and "{f'{id.to_dt}' if(id.to_dt != '') else ''}") 
        
        
    #     '''

    where = f"{f'({where}) AND ' if(where != '') else ''}" + f"(t.from_proj_id IS NOT NULL AND t.to_proj_id IS NOT NULL AND p.part_no IS NOT NULL and i.item_id is not null and p.prod_make is not null)"
    
    order = "ORDER BY t.created_at DESC"
    flag = 1
    result = await db_select(select, schema, where, order, flag)
    return result




@stockRouter.post("/get_req_log")
async def save_trans(data:GetStock):
    res_dt = {}
    select = "r.req_no,r.req_date,i.approve_flag,i.rc_qty,r.reason,r.purpose,i.req_qty"
    schema = "td_requisition r,td_requisition_items i"
    where = f"i.item_id='{data.prod_id}' and r.project_id='{data.proj_id}' and r.req_no=i.req_no and i.approve_flag='P'"
    order = "ORDER BY r.created_at DESC"
    flag =  1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@stockRouter.post("/save_stock_out")
async def save_stock_out(data:StockOutList):
        current_datetime = datetime.now()
        
        formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
        
        for i in data.items:
            # select_stck = f"max(date) as max_dt"
            # schema_stck = "td_stock_new"
            # where_stck= f"proj_id='{data.proj_id}' and item_id='{i.id}'" 
            # order_stck = ""
            # flag_stck = 0 
            # result_stck= await db_select(select_stck, schema_stck, where_stck, order_stck, flag_stck)

            select_stck1 = f"max(sl_no) as max_sl"
            schema_stck1 = "td_stock_new"
            where_stck1= f"proj_id='{data.proj_id}' and item_id='{i.id}'" 
            order_stck1 = ""
            flag_stck1 = 0 
            result_stck1= await db_select(select_stck1, schema_stck1, where_stck1, order_stck1, flag_stck1)

            select_stck = f"max(date) as max_dt"
            schema_stck = "td_stock_new"
            where_stck= f"proj_id='{data.proj_id}' and item_id='{i.id}' and sl_no = {result_stck1['msg']['max_sl']}" 
            order_stck = ""
            flag_stck = 0 
            result_stck= await db_select(select_stck, schema_stck, where_stck, order_stck, flag_stck)
            
            # print(result_stck['msg']['max_dt'],result_stck1['msg']['max_sl'])


            select_stck2 = f"balance"
            schema_stck2 = "td_stock_new"
            where_stck2= f"proj_id='{data.proj_id}' and item_id='{i.id}' and date='{result_stck['msg']['max_dt']}' and sl_no='{result_stck1['msg']['max_sl']}'" 
            order_stck2 = ""
            flag_stck2 = 0 
            result_stck2= await db_select(select_stck2, schema_stck2, where_stck2, order_stck2, flag_stck2)
            stock_out=-1
            qty = Decimal(result_stck2['msg']['balance']) - Decimal(i.stock_out)

            flds_out= f'date,ref_no,proj_id,item_id,qty,in_out_flag,balance,created_by,created_at'
            val_out= f'"{formatted_dt}","{i.req_no}","{data.proj_id}",{i.id},{i.stock_out},{stock_out},{qty},"{data.user}","{formatted_dt}"'
            table_out= "td_stock_new"
            whr_out=f""
            flag2_out=  0
            result3_out= await db_Insert(table_out, flds_out, val_out, whr_out, flag2_out)
            await user_log_update(data.user,'E','td_stock_new',formatted_dt, i.req_no)

        return result3_out


@stockRouter.post("/save_pur_req")
async def save_trans(data:SavePur):
    res_dt = {}
    print(data)
    current_datetime = datetime.now()
    purno = int(round(current_datetime.timestamp()))
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    select_fnd = "pur_no"
    schema_fnd = "td_purchase_req"
    where_fnd = f"sl_no='{data.sl_no}'"
    order_fnd = ""
    flag_fnd =  1
    result_fnd = await db_select(select_fnd, schema_fnd, where_fnd, order_fnd, flag_fnd)

    fields= f"pur_no,pur_date,pur_proj,pur_by,created_at,created_by,intended" if data.sl_no==0 else f'pur_date="{data.pur_dt}",pur_proj="{data.project_id}",pur_by="{data.user}",modified_by="{data.user}",modified_at="{formatted_dt}"'
    values = f"'PR-{purno}','{data.pur_dt}','{data.project_id}', '{data.user}','{formatted_dt}','{data.user}','{data.intended}'"
    table_name = "td_purchase_req"
    whr = "" if data.sl_no==0 else f'sl_no="{data.sl_no}"'
    flag = 0 if data.sl_no==0 else 1
    result = await db_Insert(table_name, fields, values, whr, flag)
    lastID=result["lastId"]
    #========================================================================================================
    pur=''
    if(data.sl_no > 0):
        item_id = ",".join(str(dt.sl_no) for dt in data.items)
        print('item_id=',item_id,lastID)
        pur = result_fnd['msg'][0]['pur_no']
        try:
            del_table_name = 'td_purchase_items'
            del_whr = f"pur_no = '{pur}' AND sl_no not in({item_id})"
            del_qry = await db_Delete(del_table_name, del_whr)
            print('deleted=',del_qry)
        except:
            print('Error while delete md_vendor_deals')
    for i in data.items:
                fields= f'pur_no,item_id,qty,created_by,created_at' if i.sl_no==0 else f'item_id={i.item_id},qty={i.qty},modified_by="{data.user}",modified_at="{formatted_dt}"'
                values = f"'{pur}','{i.item_id}','{i.qty}','{data.user}','{formatted_dt}'"  if pur else f"'PR-{purno}','{i.item_id}','{i.qty}','{data.user}','{formatted_dt}'" 
                table_name = "td_purchase_items"
                whr="" if i.sl_no==0 else f'sl_no="{i.sl_no}"'
                # flag1 = 1 if v.sl_no>0 else 0
                flag1 = 1 if i.sl_no>0 else 0
                result2 = await db_Insert(table_name, fields, values, whr, flag1)
            

                if(result2['suc']>0): 

                    res_dt2 = {"suc": 1, "msg": f"Saved Successfully"}

                else:
                    res_dt2= {"suc": 0, "msg": f"Error while inserting"}
            # else:
            #     res_dt1= {"suc": 0, "msg": f"Error while updating item"}

    #===========================================================================================================

    if result['suc']>0 :
                res_dt = {"suc": 1, "msg": f"Saved Successfully"}
    else:
                 res_dt = {"suc": 0, "msg": f"Error while updating invoice"}
            
    if data.sl_no>0:
        await user_log_update(data.user,'E','td_purchase_req',formatted_dt, data.sl_no)
    else:
        await user_log_update(data.user,'N','td_purchase_req',formatted_dt,lastID)
    
    return res_dt


@stockRouter.post("/get_purchase_req")
async def save_trans(data:GetTrans):
    res_dt = []
    if(data.id==0):
            select = "t.pur_no,t.pur_date,t.intended,t.created_by,t.created_at,t.sl_no,p.proj_id as ID,p.proj_name,p.proj_name as proj_id,p.sl_no as p_id"
            schema = "td_purchase_req t,td_project p"
            where = f"t.sl_no='{data.id}' and p.sl_no=t.pur_proj"  if data.id>0 else f"p.sl_no=t.pur_proj"
            order = "ORDER BY t.created_at DESC"
            flag = 0 if data.id>0 else 1
            result = await db_select(select, schema, where, order, flag)
            print(result, 'RESULT')
            for i in result['msg']:
                res_dt.append(i)
            # res_dt.append(result['msg'])
            
            select_w = "pur_no,pur_date,intended,created_by,created_at,sl_no"
            schema_w = "td_purchase_req"
            where_w = f"sl_no='{data.id}' and pur_proj=0"  if data.id>0 else f"pur_proj=0"
            order_w = "ORDER BY created_at DESC"
            flag_w = 0 if data.id>0 else 1
            result_w = await db_select(select_w, schema_w, where_w, order_w, flag_w)

            print(result_w['msg'], 'RESULT_w')
            for i in result_w['msg']:
                res_dt.append(i)
            res = {"suc": 1, "msg": res_dt}

            return res
    else:
            select = "t.pur_no,t.pur_date,t.intended,t.created_by,t.created_at,t.sl_no,p.proj_name,p.proj_name as proj_id,p.sl_no as p_id"
            schema = "td_purchase_req t,td_project p"
            where = f"t.sl_no='{data.id}' and p.sl_no=t.pur_proj"  if data.id>0 else f"p.sl_no=t.pur_proj"
            order = "ORDER BY t.created_at DESC"
            flag = 0 if data.id>0 else 1
            result = await db_select(select, schema, where, order, flag)
            print(result, 'RESULT')
            if result['suc']==1 :
               return result
            else:
                select_w = "pur_no,pur_date,intended,created_by,created_at,sl_no"
                schema_w = "td_purchase_req"
                where_w = f"sl_no='{data.id}' and pur_proj=0"  if data.id>0 else f"pur_proj=0"
                order_w = "ORDER BY created_at DESC"
                flag_w = 0 if data.id>0 else 1
                result_w = await db_select(select_w, schema_w, where_w, order_w, flag_w)

                print(result_w['msg'], 'RESULT_w')
                return result_w


@stockRouter.post("/get_purchase_req_items_for_po")
async def save_trans(data:GetPurItemForPo):
    print("pur_nooooooooooooooooooooooooooooooooooooooooooo", str(data).split('=')[1].rstrip(','))
    dt = str(data).split('=')[1].rstrip(',').strip("'")
    pur_no= ','.join(f"'{item}'" for item in dt.split(','))
    select1 = "sum(qty-ordered_qty) as qty,sum(qty-ordered_qty) as copy_qty,item_id"
    schema1 = "td_purchase_items"
    where1 = f"pur_no in ({pur_no}) group by item_id"
    order1 = ""
    flag1 =  1
    result1 = await db_select(select1, schema1, where1, order1, flag1)
    
    # select2 = "mrn_no"
    # schema2 = "td_item_delivery_invoice"
    # where2 = f"po_no='{result1['msg'][0]['po_no']}'" if result1['msg'] else f"po_no='0'"
    # order2 = ""
    # flag2 =  1
    # result2 = await db_select(select2, schema2, where2, order2, flag2)
    # print('res====================',result2['msg'])

    # for i in range(0,len(result2['msg'])):
    #      mrn_dt+=f"'{result2['msg'][i]['mrn_no']}'," if i != len(result2['msg'])-1 else f"'{result2['msg'][i]['mrn_no']}'"


    # select = "p.sl_no as item_sl,p.pur_no,p.item_id,p.qty,p.created_by,p.created_at,p.status,p.modified_at,p.modified_by,b.*,sum(m.rc_qty) tot_rc" if mrn_dt else "p.sl_no as item_sl,p.pur_no,p.item_id,p.qty,p.created_by,p.created_at,p.status,p.modified_at,p.modified_by,b.*, 0 as tot_rc"
    # schema = f"td_purchase_items p left join td_po_basic b on p.pur_no=b.pur_req left join td_item_delivery_invoice d on b.po_no=d.po_no left join td_item_delivery_details m on m.mrn_no=d.mrn_no" if mrn_dt else f"td_purchase_items p left join td_po_basic b on p.pur_no=b.pur_req"
    # where = f"pur_no in '({pur_no})' and m.mrn_no in ({mrn_dt}) group by m.item_id" if mrn_dt else f"pur_no in '({pur_no})'"
    # order = ""
    # flag =  1
    # result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result1

@stockRouter.post("/get_purchase_req_items")
async def save_trans(data:GetPurItem):
    mrn_dt = ""
    select1 = "po_no"
    schema1 = "td_po_basic"
    where1 = f"pur_req='{data.pur_no}'"
    order1 = ""
    flag1 =  1
    result1 = await db_select(select1, schema1, where1, order1, flag1)
    print('result1 ===================================',result1)
    
    select2 = "mrn_no"
    schema2 = "td_item_delivery_invoice"
    where2 = f"po_no='{result1['msg'][0]['po_no']}'" if result1['msg'] else f"po_no='0'"
    order2 = ""
    flag2 =  1
    result2 = await db_select(select2, schema2, where2, order2, flag2)
    print('res====================',result2['msg'])

    for i in range(0,len(result2['msg'])):
         mrn_dt+=f"'{result2['msg'][i]['mrn_no']}'," if i != len(result2['msg'])-1 else f"'{result2['msg'][i]['mrn_no']}'"


    select = "p.sl_no as item_sl,p.ordered_qty,p.pur_no,p.item_id,p.qty,p.created_by,p.created_at,p.status,p.modified_at,p.modified_by,b.po_no,sum(m.rc_qty) tot_rc" if mrn_dt else "p.sl_no as item_sl,p.pur_no,p.item_id,p.qty,p.ordered_qty,p.created_by,p.created_at,p.status,p.modified_at,p.modified_by,b.po_no, 0 as tot_rc"
    schema = f" td_po_basic b left join td_purchase_items p on p.pur_no=b.pur_req left join td_item_delivery_invoice d on b.po_no=d.po_no left join td_item_delivery_details m on m.mrn_no=d.mrn_no" if mrn_dt else f" td_po_basic b left join td_purchase_items p  on p.pur_no=b.pur_req"
    where = f"pur_no='{data.pur_no}' and m.mrn_no in ({mrn_dt}) group by m.item_id" if mrn_dt else f"pur_no='{data.pur_no}'"
    order = ""
    flag =  1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@stockRouter.post("/get_purchase_req_items_for_edit")
async def save_trans(data:GetPurItem):
    # select2 = "prod_id,sum(quantity) as total_ordered,sum(rc_qty) as total_received"
    # schema2 = "td_item_delivery_details"
    # where2 = f"po_no in (select po_no from td_po_basic where pur_req like '%{data.pur_no.lstrip('PR-')}%') group by prod_id" 
    # order2 = ""
    # flag2 =  1
    # result2 = await db_select(select2, schema2, where2, order2, flag2)
    # print('result1 ===================================',result2)

    select2 = "d.prod_id as prod_id,sum(d.quantity) as total_ordered,sum(d.rc_qty) as total_received"
    schema2 = "td_item_delivery_details d left join td_item_delivery_invoice i on d.mrn_no=i.mrn_no"
    where2 = f"d.po_no in (select po_no from td_po_basic where pur_req like '%{data.pur_no.lstrip('PR-')}%')  and i.approve_flag='A' group by d.prod_id" 
    order2 = ""
    flag2 =  1
    result2 = await db_select(select2, schema2, where2, order2, flag2)
    print('result1 ===================================',result2)

    select3 = "d.item_id as prod_id,sum(d.qty) as total_ordered,sum(d.qty) as total_received"
    schema3 = "td_vtoc_items d left join td_vendor_to_client i on d.del_no=i.del_no"
    where3 = f"d.po_no in (select po_no from td_po_basic where pur_req like '%{data.pur_no.lstrip('PR-')}%')  group by d.item_id" 
    order3 = ""
    flag3 =  1
    result3 = await db_select(select3, schema3, where3, order3, flag3)
    print('result1 ===================================',result3)
   

    select = f"sl_no as item_sl,ordered_qty,approved_ord_qty,pur_no,item_id,qty,created_by,created_at,status,modified_at,modified_by,0 as tot_rc" 
    schema = f"td_purchase_items" 
    where = f"pur_no='{data.pur_no}'" 
    order = ""
    flag =  1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    delivery_data = {}
    if result2['msg']:
      delivery_data = {row['prod_id']: int(row['total_received']) for row in result2['msg']}
    if result3['msg']:
      delivery_data = {row['prod_id']: int(row['total_received']) for row in result3['msg']}
    # print('delivery_data',delivery_data)
    # for row in result2['msg']:
    #      print('row',row)

# Merge the total_received value into result based on item_id
    for row in result['msg']:
       row['tot_rc'] = delivery_data.get(row['item_id'], 0) if delivery_data else 0
    return result

    # select = f"p.sl_no as item_sl,p.ordered_qty,p.pur_no,p.item_id,p.qty,p.created_by,p.created_at,p.status,p.modified_at,p.modified_by,sum(m.qty) as tot_rc" 
    # schema = f"td_purchase_items p where p.item_id=m.prod_id" 
    # where = f"p.pur_no='{data.pur_no}' and m.po_no in (select po_no from td_po_basic where pur_req like '%{data.pur_no.lstrip('PR-')}%') group by prod_id" 
    # order = ""
    # flag =  1
    # result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    # return result

# @stockRouter.post("/get_purchase_req_items_for_edit")
# async def save_trans(data:GetPurItem):
#      # Secure query using parameterized input
#         pur_no_value = data.pur_no.lstrip("PR-")

#         select2 = "prod_id, SUM(quantity) AS total_qty"
#         schema2 = "td_item_delivery_details"
#         where2 = """
#             po_no IN (
#                 SELECT po_no FROM td_po_basic WHERE pur_req LIKE %s
#             )
#             GROUP BY prod_id
#         """
#         order2 = ""
#         flag2 = 1

#         result2 = await db_select(select2, schema2, where2, order2, flag2, params=(f"%{pur_no_value}%",))
#         print("Result1 ===================================", result2)

#         # Convert result2 to a dictionary for quick lookup
#         delivery_data = {row["prod_id"]: row["total_qty"] for row in result2} if result2 else {}

#         # Query for purchase items
#         select = """
#             sl_no AS item_sl, ordered_qty, pur_no, item_id, qty, 
#             created_by, created_at, status, modified_at, modified_by, 0 AS tot_rc
#         """
#         schema = "td_purchase_items"
#         where = "pur_no=%s"
#         order = ""
#         flag = 1

#         result = await db_select(select, schema, where, order, flag, params=(data.pur_no,))
#         print(result, "RESULT")

#         # Merge delivery quantity into purchase items based on item_id matching prod_id
#         for row in result:
#             row["tot_rc"] = delivery_data.get(row["item_id"], 0)  # Default to 0 if no match

#         print("Final Merged Result:", result)
#         return result



@stockRouter.post("/get_order_log")
async def save_trans(data:GetLog):
    
    select = "b.sl_no,b.po_no,i.item_id,i.quantity,b.created_by,b.created_at,b.modified_by,b.modified_at" 
    schema = f"td_po_basic b join td_po_items i on i.po_sl_no=b.sl_no and i.item_id = {data.item_id}" 
    where = f"pur_req like '%{data.pur_no.lstrip('PR-')}%'" 
    order = ""
    flag =  1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result


@stockRouter.post("/get_receive_log")
async def save_trans(data:GetLog):

    select1 = "mrn_no,po_no" 
    schema1 = f"td_item_delivery_invoice" 
    where1 = f"po_no in (select po_no from td_po_basic where pur_req like '%{data.pur_no.lstrip('PR-')}%') and approve_flag='A'" 
    order1 = ""
    flag1 =  1
    result1 = await db_select(select1, schema1, where1, order1, flag1)
    
    select2 = "sl_no" 
    schema2 = f"td_po_basic" 
    where2 = f"po_no ='{result1['msg'][0]['po_no']}'" if result1['msg'] else f""
    order2 = ""
    flag2 =  1
    result2 = await db_select(select2, schema2, where2, order2, flag2)

    select3 = "del_flag" 
    schema3 = f"td_po_delivery" 
    where3 = f"po_sl_no ='{result2['msg'][0]['sl_no']}'" if result2['msg'] else f""
    order3 = ""
    flag3 =  1
    result3 = await db_select(select3, schema3, where3, order3, flag3)
    print(result3)

   
    if result3['msg'][0]['del_flag'] != '3':
        select = "*" 
        schema = f"td_item_delivery_details" 
        where =f"mrn_no in (select mrn_no from td_item_delivery_invoice where po_no in  (select po_no from td_po_basic where pur_req like '%{data.pur_no.lstrip('PR-')}%' and approve_flag='A')) and prod_id = {data.item_id}"
        order = ""
        flag =  1
        result = await db_select(select, schema, where, order, flag)
        print(result, 'RESULT')
    else:
        select = "i.po_no,i.del_no as invoice,i.item_id as prod_id,i.qty as rc_qty,v.created_by,v.created_at,v.modified_by,v.modified_at" 
        schema = f"td_vtoc_items i, td_vendor_to_client v" 
        where =f"v.del_no=i.del_no and i.del_no in (select del_no from td_vtoc_items where po_no in  (select po_no from td_po_basic where pur_req like '%{data.pur_no.lstrip('PR-')}%' and po_status='A')) and i.item_id = {data.item_id}"
        order = ""
        flag =  1
        result = await db_select(select, schema, where, order, flag)
        print(result, 'RESULT')
    return result


@stockRouter.post("/get_purchase_req_items_search")
async def save_trans(data:GetPurItem):
    select = "t.pur_no,t.pur_proj, GROUP_CONCAT(i.item_id) AS item_id,GROUP_CONCAT(p.prod_name) AS prod_name,tp.proj_name, GROUP_CONCAT(p.prod_make) AS prod_make,GROUP_CONCAT(p.part_no) AS part_no, GROUP_CONCAT(p.article_no) AS article_no,GROUP_CONCAT(p.model_no) AS model_no,sum(i.qty) as qty, sum(i.ordered_qty) as ordered_qty"
    schema = f"td_purchase_req t left join td_purchase_items i on t.pur_no=i.pur_no left join md_product p on i.item_id=p.sl_no left join td_project tp on t.pur_proj=tp.sl_no GROUP BY t.pur_no, t.pur_proj, tp.proj_name"
    where = f""
    order = ""
    flag =  1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@stockRouter.post("/check_existing_purchase_req")
async def save_trans(data:GetPurItem):

    select = "count(pur_no) as cnt"
    schema = f"td_po_basic"
    where = f"pur_no='{data.pur_no}'"
    order = ""
    flag =  1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result

@stockRouter.post("/stock_levels_by_date")
async def save_trans(data:GetPurItem):

    select = "date,sum(qty*in_out_flag) as qty"
    schema = f"td_stock_new group by date"
    where = f""
    order = ""
    flag =  1
    result = await db_select(select, schema, where, order, flag)
    print(result, 'RESULT')
    return result


     












