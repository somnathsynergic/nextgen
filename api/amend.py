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

import logging
amendRouter = APIRouter()


class GetPo(BaseModel):
    id:int
class amendPO(BaseModel):
    id:int
    user:str

@amendRouter.post('/getamendproject1')
async def getamendprojectpoc(id:GetPo):
    res_dt = {}

    select = "@a:=@a+1 serial_number,b.amend_flag,b.parent_po_no,b.po_no,b.po_id,b.po_date,b.po_type as type,b.po_issue_date,b.po_status,IF(b.po_status='P','In progress', IF(b.po_status='A','Approved',IF(b.po_status='U','Approval Pending',IF(b.po_status='D','Delivered','Partial Delivery')))) po_status_val, IF(b.po_type='P','Project-Specific', IF(b.po_type='G', 'General','')) po_type,b.project_id,p.proj_name,p.proj_id,b.vendor_id,b.created_by,b.created_at,b.created_by,b.created_at,b.modified_by,b.modified_at,v.vendor_name,b.sl_no,b.fresh_flag"
    schema = '''td_po_basic b
left join td_project p ON p.sl_no=b.project_id
join md_vendor v ON v.sl_no=b.vendor_id
join (SELECT @a:= 0) AS a 

JOIN (
   SELECT d.po_no
    FROM td_po_basic d WHERE d.amend_flag = 'N' AND d.po_no is NOT null
    HAVING (SELECT COUNT(*) FROM td_po_basic e WHERE e.po_no LIKE CONCAT(d.po_no, '%')) = 1
    UNION
    SELECT MAX(po_no) po_no
    FROM td_po_basic
    WHERE amend_flag = 'Y' AND po_no is NOT null
    GROUP BY SUBSTRING_INDEX(po_no,'-',1)
) c ON c.po_no=b.po_no

'''
    where = f"b.sl_no='{id.id}' and b.po_status IN ('P','U','A') AND amend_flag = 'Y'" if id.id>0 else "b.po_status IN ('P','U','A') AND amend_flag = 'Y'"
    order = "ORDER BY b.created_at DESC"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result

@amendRouter.post('/getamendproject')
async def getamendprojectpoc(id:GetPo):
    res_dt = {}

    select = "@a:=@a+1 serial_number,b.amend_flag,b.parent_po_no,b.po_no,b.po_id,b.po_date,b.po_type as type,b.po_issue_date,b.po_status,IF(b.po_status='P','In progress', IF(b.po_status='A','Approved',IF(b.po_status='U','Approval Pending',IF(b.po_status='D','Delivered','Partial Delivery')))) po_status_val, IF(b.po_type='P','Project-Specific', IF(b.po_type='G', 'General','')) po_type,b.project_id,p.proj_name,p.proj_id,b.vendor_id,b.created_by,b.created_at,b.created_by,b.created_at,b.modified_by,b.modified_at,v.vendor_name,b.sl_no,b.fresh_flag"
    schema = '''td_po_basic b
left join td_project p ON p.sl_no=b.project_id
join md_vendor v ON v.sl_no=b.vendor_id
join (SELECT @a:= 0) AS a 

JOIN (
   SELECT d.po_no
    FROM td_po_basic d WHERE d.amend_flag = 'N' AND d.po_no is NOT null
    HAVING (SELECT COUNT(*) FROM td_po_basic e WHERE e.po_no LIKE CONCAT(d.po_no, '%')) = 1
    UNION
    SELECT MAX(po_no) po_no
    FROM td_po_basic
    WHERE amend_flag = 'Y' AND po_no is NOT null
    GROUP BY SUBSTRING_INDEX(po_no,'-',1)
) c ON c.po_no=b.po_no

'''
    where = f"b.sl_no='{id.id}' and b.po_status IN ('P','U','A') AND amend_flag = 'Y'" if id.id>0 else "b.po_status IN ('P','U','A') AND amend_flag = 'Y'"
    order = "ORDER BY b.created_at DESC"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result

@amendRouter.post('/getamendprojectpm')
async def getamendprojectpoc(id:GetPo):
    # print(id.id)
    res_dt = {}

    select = "@a:=@a+1 serial_number,b.po_no,b.po_id,b.po_date,b.po_type as type,b.po_issue_date,b.po_status,IF(b.po_status='P','In progress', IF(b.po_status='A','Approved',IF(b.po_status='U','Approval Pending',IF(b.po_status='D','Delivered','Partial Delivery')))) po_status_val, IF(b.po_type='P','Project-Specific', IF(b.po_type='G', 'General','')) po_type,b.project_id,u.user_email,c.proj_manager,p.proj_name,b.vendor_id,b.created_by,b.created_at,b.created_by,b.created_at,b.modified_by,b.modified_at,v.vendor_name,b.sl_no,b.fresh_flag"
    schema = '''td_po_basic b
left join td_project p ON p.sl_no=b.project_id
join md_vendor v ON v.sl_no=b.vendor_id left join td_project_assign c on c.sl_no=p.sl_no left join md_user u on u.sl_no = c.proj_manager
join (SELECT @a:= 0) AS a '''
    where = f"b.sl_no='{id.id}' and b.po_status IN ('P','U','A') AND amend_flag = 'Y'" if id.id>0 else "b.po_status IN ('P','U','A') AND amend_flag = 'Y'"
    order = "ORDER BY b.created_at DESC"
    flag = 0 if id.id>0 else 1
    result = await db_select(select, schema, where, order, flag)
    # print(result, 'RESULT')
    return result

@amendRouter.post('/addpoamend')
async def addpoamend(data:amendPO):
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    po_dt = current_datetime.strftime("%Y-%m-%d")
    amend_flag = await db_select("amend_flag","td_po_basic", f"sl_no = {data.id}","",0)
    parent_po = await db_select("po_no","td_po_basic", f"sl_no = {data.id}","",0) 

    if amend_flag['msg']['amend_flag']=='Y':
        txt = str(parent_po['msg']['po_no'])
        x = txt.split("-")
        joined_string = "-".join(x[:-1])
        print('joined string',joined_string,amend_flag)
        
    am_po_row = await db_select("ifnull(MAX(SUBSTRING_INDEX(po_no, '-', -1))+1,1) po_no","td_po_basic", f"po_no like '{parent_po['msg']['po_no']}-%'","",0) if amend_flag['msg']['amend_flag']=='N' else await db_select("ifnull(MAX(SUBSTRING_INDEX(po_no, '-', -1))+1,1) po_no","td_po_basic", f"po_no like '{joined_string}-%'","",0)

    # am_po_row = await db_select("ifnull(MAX(SUBSTRING_INDEX(po_no, '-', -1))+1,1) po_no","td_po_basic", f"po_no like '{parent_po['msg']['po_no']}-%'","",0) 
    print(am_po_row['msg']['po_no'], '-----------------------')
    am_po_no = f'{parent_po['msg']['po_no']}-{str(am_po_row['msg']['po_no']).split('.')[0]}' if amend_flag['msg']['amend_flag']=='N' else f'{joined_string}-{str(am_po_row['msg']['po_no']).split('.')[0]}'
    print('am_po_no',am_po_no)
    
    fields= f'''SELECT NULL sl_no, po_id, "{am_po_no}" po_no, "{po_dt}" po_date, po_type,  "{po_dt}" po_issue_date, project_id, vendor_id, vendor_address, vend_ref, 'P' po_status, 'Y' fresh_flag, 0 active_step, po_no parent_po_no, 'Y' amend_flag, amend_note, pur_req, created_by, "{formatted_dt}" created_at, NULL modified_by, NULL modified_at FROM td_po_basic WHERE sl_no = {data.id}'''
    table_name = "td_po_basic"
    po_save = await db_Insert(table_name, fields, None, None, 0, True)
    lastID=po_save["lastId"]


    try:
        if(lastID > 0):
            fields1= f'SELECT NULL sl_no, "{lastID}" po_sl_no,bill_to,ware_house_flag,del_flag,ship_to,po_notes,created_by,created_at, NULL modified_by, NULL modified_at FROM td_po_delivery WHERE po_sl_no = "{data.id}"'
            table_name1 = "td_po_delivery"
            result1 = await db_Insert(table_name1, fields1, None, None, 0, True)

            fields2= f'SELECT NULL sl_no, "{lastID}" po_sl_no,mdcc,mdcc_scope,inspection,inspection_scope,draw,draw_scope,draw_period,mdcc_doc,insp_doc,draw_doc,created_by,created_dt, NULL modified_by, NULL modified_at FROM td_po_more WHERE po_sl_no = "{data.id}"'
            table_name2 = "td_po_more"
            result2 = await db_Insert(table_name2, fields2, None, None, 0, True)

            fields3= f'SELECT NULL sl_no, "{lastID}" po_sl_no, item_id, quantity,item_rt, currency,discount_percent, discount, unit_id, cgst_id, sgst_id, igst_id, delivery_dt,delivery_to,created_by,created_at, NULL modified_by, NULL modified_at FROM td_po_items WHERE po_sl_no = "{data.id}"'
            table_name3 = "td_po_items"
            result3 = await db_Insert(table_name3, fields3, None, None, 0, True)

            fields4= f'SELECT NULL sl_no, "{lastID}" po_sl_no, stage_no, terms_dtls,created_by,created_at, NULL modified_by, NULL modified_at FROM td_po_payment_dtls WHERE po_sl_no = "{data.id}"'
            table_name4 = "td_po_payment_dtls"
            result4 = await db_Insert(table_name4, fields4, None, None, 0, True)

            fields5= f'SELECT NULL sl_no, "{lastID}" po_sl_no, price_basis, price_basis_desc, packing_fwd_extra, packing_fwd_extra_val, packing_fwd_val,pf_currency, pf_cgst,pf_sgst,pf_igst, freight_ins, freight_ins_val,freight_extra,freight_extra_val,freight_currency,freight_cgst,freight_sgst,freight_igst,ins, ins_val, ins_extra,ins_extra_val,ins_currency,ins_cgst,ins_sgst,ins_igst, test_certificate, test_certificate_desc,ld_date, ld_date_desc, ld_val, ld_val_desc, ld_val_per, min_per, warranty_guarantee, dispatch_dt,comm_dt, duration, duration_value,duration_value_to, o_m_manual, o_m_desc, operation_installation, operation_installation_desc, packing_type,packing_val, manufacture_clearance, manufacture_clearance_desc,created_by,created_at, NULL modified_by, NULL modified_at FROM td_po_terms_condition WHERE po_sl_no = "{data.id}"'
            table_name5 = "td_po_terms_condition"
            result5 = await db_Insert(table_name5, fields5, None, None, 0, True)
            await user_log_update(data.user,'M','td_po_basic',formatted_dt,str(data.id)+' amended to '+str(lastID))


    except:
        print('Error While saving')

    return po_save


@amendRouter.post('/addpoamend_trial')
async def addpoamend(data:GetPo):
    current_datetime = datetime.now()
    formatted_dt = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    po_dt = current_datetime.strftime("%Y-%m-%d")
    amend_flag = await db_select("amend_flag","td_po_basic", f"sl_no = {data.id}","",0)
    parent_po = await db_select("po_no","td_po_basic", f"sl_no = {data.id}","",0) 

    if amend_flag['msg']['amend_flag']=='Y':
        txt = str(parent_po['msg']['po_no'])
        x = txt.split("-")
        joined_string = "-".join(x[:-1])
        print('joined string',joined_string,amend_flag)
    am_po_row = await db_select("ifnull(MAX(SUBSTRING_INDEX(po_no, '-', -1))+1,1) po_no","td_po_basic", f"po_no like '{parent_po['msg']['po_no']}-%'","",0) if amend_flag['msg']['amend_flag']=='N' else await db_select("ifnull(MAX(SUBSTRING_INDEX(po_no, '-', -1))+1,1) po_no","td_po_basic", f"po_no like '{joined_string}-%'","",0)
    # am_po_row = await db_select("ifnull(MAX(SUBSTRING_INDEX(po_no, '-', -1))+1,1) po_no","td_po_basic", f"po_no like '{parent_po['msg']['po_no']}-%'","",0) 
    print(am_po_row['msg']['po_no'], '-----------------------')
    am_po_no = f'{parent_po['msg']['po_no']}-{str(am_po_row['msg']['po_no']).split('.')[0]}' if amend_flag['msg']['amend_flag']=='N' else f'{joined_string}-{str(am_po_row['msg']['po_no']).split('.')[0]}'
    # am_po_no = await db_select(f"CONCAT((SELECT po_no FROM td_po_basic WHERE sl_no = {data.id}), '-', IF(LENGTH(po_no)-LENGTH(replace(po_no,'-',''))> 1, MAX(SUBSTRING_INDEX(po_no, '-', -1))+1, 1)) am_po", "td_po_basic", f"SUBSTRING_INDEX(po_no, '-', 2) = (SELECT po_no FROM td_po_basic WHERE sl_no = {data.id})", "", 0)

    print('am_po_no',am_po_no)
    return am_po_no,am_po_row

