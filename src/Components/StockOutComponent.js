import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SaveOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import axios from "axios";
import { url } from "../Address/BaseUrl";
import { useNavigate } from "react-router-dom";
import DialogBox from "./DialogBox";
import TDInputTemplate from "./TDInputTemplate";
import VError from "./VError";
import BtnGroupReuse from "./BtnGroupReuse";
import Pagination from "./Pagination";

function StockOutComponent({
  headers,
  data,
  info,
  flag,
  wStock,
  title,
  setSearch,
  proj_id,
  onPress,
}) {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(0);
  const [id, setId] = useState(0);
  const [po, setPO] = useState(0);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const det = JSON.parse(localStorage.getItem('perm'))

  const [logData, setLogData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [req_list, setReqList] = useState([]);
  const [lst, setLst] = useState([]);
  useEffect(() => {
    console.log(data);
    setDataCopy(data);
    console.log(dataCopy);
  }, [data]);
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };
  const onClose = () => {
    setOpen(false);
  };
  const content = (
    <div className="grid grid-cols-2 gap-3 p-3 bg-green-100 rounded-lg">
      <Tag
        onClick={() => {
          setMode(7);
          setOpen(true);
        }}
        className="cursor-pointer col-span-1 p-2 shadow-lg"
        color="#4FB477"
      >
        Upload/View Vendor Receipt
      </Tag>
      <Tag
        onClick={() => {
          setMode(8);
          setOpen(true);
        }}
        className="cursor-pointer col-span-1 p-2 shadow-lg"
        color="#014737"
      >
        Upload/View MDCC
      </Tag>
    </div>
  );
  const viewLog = (item) => {
    axios
      .post(url + "/api/get_req_log", {
        prod_id: item.item.id,
        proj_id: item.proj_id,
      })
      .then((res) => {
        console.log(res);

        setLogData(res?.data?.msg);
        setVisible(true);
      });
  };
  const handleDtChange = (event, index_req, index) => {
    let dt = [...dataCopy];
    dt[index].req_list[index_req]["req_qty"] = event.target.value;
    console.log(dt);
    setLst(dt);
    setDataCopy(dt);
    if(dt[index].req_list[index_req]["req_qty"]>(dt[index].req_list[index_req]["copy_qty"]-dt[index].req_list[index_req]["del_qty"]))
      dt[index]['error']=1
    else
      dt[index]['error']=0
    // let dt=[...dataCopy]
    // dt[index][event.target.name] = event.target.value
    // if(event.target.value>dt[index]['stock']-dt[index]['req_stock'])
    //     dt[index]['error']=1
    // else
    //     dt[index]['error']=0

    // setDataCopy(dt)
  };
  const onSubmit = () => {
    console.log(lst);
    var stock = [];
    dataCopy.forEach((e) => {
      if (e.req_list.length) stock.push(...e.req_list);
    });
    console.log(stock);
    console.log(req_list);
    onPress(
      stock.map((e) => {
        return { id: e.item_id, stock_out: +e.req_qty||0, req_no: e.req_no };
      })
    );
  };
  return (
    <>
    
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
      >
        {/* <Tag color="#014737">
          Warehouse quantity of this product: {data[0]?.warehouse_stock || 0}
        </Tag> */}
        <table class="w-full text-sm text-left rtl:text-right shadow-lg text-green-900 dark:text-gray-400">
          <thead class=" text-md  text-gray-700 capitalize   bg-[#C4F1BE] dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="py-4 px-1.5">
                #
              </th>
              <th scope="col" class="py-4 px-1.5">
                Item
              </th>
              <th scope="col" class="py-4 px-1.5">
                Total Physical Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {dataCopy &&
              dataCopy?.slice(first, rows + first).map((item, index) => item.stock>0 && (
                <>
                  <tr className="border-b-gray-100 border-b-2">
                    <th
                      scope="row"
                      class="px-1.5  py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item.id}
                    </th>
                    <td class="px-1.5 py-4 ">{item.name}</td>
                    <td class="px-1.5 py-4  text-gray-600">{item.stock} </td>
                  
                  </tr>
                  {item.req_list?.map((item_req, index_req) => (
                    
                    <tr className="border-b-gray-100 border-b-2 bg-[#C4F1BE] ">
                      <td class="px-1.5 py-4 ">
                        <span className="font-bold">Requisition No: </span>
                        {item_req.req_no}</td>
                      <td class="">  <span className="font-bold">Approved Quantity: </span> {item_req.copy_qty - item_req.del_qty}</td>
                      <td class="px-1.5 py-4 flex-col">
                        <TDInputTemplate
                          placeholder="Stock Out Quantity"
                          type="number"
                          name="req_qty"
                          formControlName={item_req.req_qty}
                          handleChange={(event) =>
                            handleDtChange(event, index_req, first+index)
                          }
                          mode={1}
                        />
                      </td>
                      {item_req.req_qty>(item_req.copy_qty - item_req.del_qty) && <VError title='Invalid Quantity'/>}
                    </tr>
                        
                  ))}
                </>
              ))}
          </tbody>
        </table>
        {/* <Paginator
          first={first}
          rows={rows}
          totalRecords={data?.length}
          rowsPerPageOptions={[3, 5, 10, 15, 20, 30, data?.length]}
          onPageChange={onPageChange}
        /> */}
        <Pagination  first={first}
          rows={rows}
          totalRecords={data?.length}
          rowsPerPageOptions={[3, 5, 10, 15, 20, 30, data?.length]}
          onPageChange={onPageChange}
          />
        <div className="flex justify-center gap-3 items-center">
          <div className="mx-auto">
            <div className="flex justify-center gap-2 items-center mx-auto mb-2">
              {/* <button
                onClick={() => onSubmit()}
                        className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"

                disabled={
                  // !proj_id ||
                  dataCopy.reduce((accumulator, item) => {
                    return accumulator + item.error;
                  }, 0) > 0
                  ||
                  dataCopy.filter(e=>e.req_list?.length>0)?.length==0 || det.stock==1
                }
              >
                <span class="relative z-10">
                        <SaveOutlined className='mr-2' />
                Submit
                  </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
              </button> */} 
   {det?.stock == 2 &&

              <BtnGroupReuse text="Submit" onClick={() => onSubmit()}  disabled={
                  // !proj_id ||
                  dataCopy.reduce((accumulator, item) => {
                    return accumulator + item.error;
                  }, 0) > 0
                  ||
                  dataCopy.filter(e=>e.req_list?.length>0)?.length==0 || det.stock==1
                } icon={<SaveOutlined className='mr-2' />} flag={1}/>}
            </div>
          </div>
        </div>
      </motion.section>
      <DialogBox
        visible={visible}
        flag={34}
        data={logData}
        onPress={() => setVisible(false)}
      />
    </>
  );
}

export default StockOutComponent;
