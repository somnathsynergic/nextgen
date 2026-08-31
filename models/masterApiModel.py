from core.database import connect
import mysql.connector
from models.master_model import createResponse
import time
async def db_select(select, schema, where, order, flag):
    whr = f"WHERE {where}" if where != '' else ''
    sql = f"SELECT {select} FROM {schema} {whr} {order}"
    res_dt = {}
    print('SQL======',sql,'===============')
    try:
        # print('Connecting to database...')
        # print(mysql.connector.__version__)
        # print(connect())
        t = time.perf_counter()
        conn = connect()
        print("Connect:", time.perf_counter() - t)
        t = time.perf_counter()
        cursor = conn.cursor()
        print("Cursor:", time.perf_counter() - t)
        t = time.perf_counter()

        cursor.execute(sql)
        print("Execute:", time.perf_counter() - t)

        # records = cursor.fetchall() if flag > 0 else cursor.fetchone()
        t = time.perf_counter()
        
        records = cursor.fetchall() if flag > 0 else cursor.fetchone()
        print("Fetch:", time.perf_counter() - t)

        # print('Records======',records,'===============')
    
        if(records is not None):
            t = time.perf_counter()

            result = createResponse(records, cursor.column_names, flag)
            print("Response:", time.perf_counter() - t)
            
            res_dt = {"suc": 1, "msg": result,"sql":sql}

        else:
            res_dt = {"suc": 2, "msg": "No Data Found","sql":sql}
        cursor.close()  
        conn.close()

        
    except mysql.connector.Error as err:
        # conn.close()
        # cursor.close()
        print('Error========',err)
        res_dt = {"suc": 0, "msg": err}
    
    finally:
        return res_dt

async def db_Insert(table_name, fields, values, where, flag, selectInsert = False):
    res_dt = {}
    sql = ''
    whr = f"WHERE {where}" if where != '' else ''
    msg = ''
    errMsg = ''

    if (flag > 0):
        sql = f"UPDATE {table_name} SET {fields} {whr}"
        # print('SQL======',sql)
        msg = "Updated Successfully !!"
        errMsg = "Data not updated !!"
    else:
        sql = f"INSERT INTO {table_name} ({fields}) VALUES ({values})" if(not selectInsert) else f"INSERT INTO {table_name} {fields}"
        print('SQL =======',sql)
        msg = "Inserted Successfully !!"
        errMsg = "Data not inserted  !!"

    try:
        conn = connect()
        cursor = conn.cursor()

        cursor.execute(sql)

        conn.commit()
        conn.close()
        cursor.close()
        # print(cursor.rowcount,'rowcount')
        # if cursor.rowcount>0:
        res_dt = {"suc":1, "msg":msg, "lastId":cursor.lastrowid}
        # else:
        #     res_dt = {"suc":0, "msg":errMsg, "lastId":0}

        # print(res_dt,"##############")
    except mysql.connector.Error as err:
        # conn.close()
        # cursor.close()
        #  print('Error========',err)
         res_dt =  {"suc": 0, "msg": err, "lastId":0}
         

    finally:
        return res_dt
    
async def db_Reset():
    res_dt = {}
    sql = "SET GLOBAL sql_mode = '';"
    msg = "Database Reset Successfully !!"
    errMsg = "Database not reset  !!"

    try:
        conn = connect()
        cursor = conn.cursor()

        cursor.execute(sql)

        conn.commit()
        

        res_dt = {"suc":1, "msg":msg}

        conn.close()
        cursor.close()

    except mysql.connector.Error as err:
         print(err)
         res_dt =  {"suc": 0, "msg": err}

    finally:
        return res_dt
    
async def db_Delete(table_name, where):
    res_dt = {}
    msg = ''
    errMsg = ''
    
    sql = f"DELETE FROM {table_name} WHERE {where}" if where != '' else f"DELETE FROM {table_name}"
    # print(sql)
    msg = "Deleted Successfully !!"
    errMsg = "Data not deleted  !!"

    try:
        conn = connect()
        cursor = conn.cursor()

        cursor.execute(sql)

        conn.commit()
        conn.close()
        cursor.close()

        # if cursor.rowcount>0:
        res_dt = {"suc":1, "msg":msg}
        # else:
            # res_dt = {"suc":0, "msg":errMsg}

        # print(res_dt,"##############")
    except mysql.connector.Error as err:
        # conn.close()
        # cursor.close()
        #  print(err)
         res_dt =  {"suc": 0, "msg": err}
         

    finally:
        return res_dt
    

async def populate_stock(proj_id, from_dt, to_dt):
   
    try:
        conn = connect()
        cursor = conn.cursor()

        cursor.callproc("p_pop_stock", [proj_id, from_dt, to_dt])

        conn.commit()

        result = []

        for rs in cursor.stored_results():
            result.extend(rs.fetchall())

        conn.close()
        cursor.close()

        result = {'suc': 1, 'msg': 'Stock populated successfully', 'data': result}
    except mysql.connector.Error as err:
        # conn.close()
        # cursor.close()
        #  print(err)
         result =  {"suc": 0, "msg": err}
         

    finally:
        return result