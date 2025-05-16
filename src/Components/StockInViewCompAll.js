import React, { useState,useRef } from "react";
import { Paginator } from "primereact/paginator";
import { motion } from "framer-motion";
import { EyeOutlined, LoadingOutlined, PrinterOutlined, StockOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import axios from "axios";
import { url } from "../Address/BaseUrl";
import { useNavigate } from "react-router-dom";
import DialogBox from "./DialogBox";
import { useReactToPrint } from "react-to-print";
import PrintHeader from "./PrintHeader";
import { Fab, Tooltip } from "@mui/material";

function StockInViewCompAll({
    headers,
    data,
    info,
    flag,
    wStock,
    title,
    setSearch,
    proj_id,
    item_id,
    project,
    product,
  }) {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(0);
  const [id, setId] = useState(0);
  const [po, setPO] = useState(0);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(true);
  
    const reactToPrintFn = useReactToPrint({
      contentRef,
    });
  console.log(data,proj_id);
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
  const viewLog = () => {
    setLoading(true);
    axios
      .post(url + "/api/get_req_log", {
        prod_id: item_id,
        proj_id: proj_id,
      })
      .then((res) => {
        console.log(res);
        setLoading(false);

        setLogData(res?.data?.msg);
        setVisible(true);
      });
  };
  return (
    <>
      {/* <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
        >
          <div class="flex flex-col p-1 bg-green-900 rounded-full my-3 dark:bg-[#22543d] md:flex-row items-center justify-between space-y-3 md:space-y-0  ">
            <div class="w-full">
              <div class="flex items-center justify-between">
                <motion.h2
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, type: "just" }}
                  class="text-xl w-48 capitalize text-nowrap font-bold text-white dark:text-white sm:block hidden mx-5"
                >
                  {title}
                </motion.h2>
  
                <label for="simple-search" class="sr-only">
                  Search
                </label>
                <div class="relative w-full -right-6 2xl:-right-12">
                  <div class="absolute inset-y-0 left-0 flex items-center md:ml-4 pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewbox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <motion.input
                    type="text"
                    id="simple-search"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "95%" }}
                    transition={{ delay: 1.1, type: "just" }}
                    class="bg-white border rounded-full border-emerald-500 text-gray-800 text-sm  block w-full  pl-10 dark:bg-gray-800 md:ml-4  duration-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search"
                    required=""
                    onChange={(text) => setSearch(text.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section> */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
      >
        <table className="w-full border-separate border border-[#C4F1BE] overflow-x-scroll text-sm text-left rtl:text-right shadow-lg text-gray-500 dark:text-gray-400">
          <thead className="text-xs bg-[#C4F1BE] font-bold uppercase text-green-900 dark:bg-gray-700 dark:text-gray-400">
            <tr>
            <td className="px-6 py-1.5 text-center text-nowrap w-1/6 font-bold">
              #
              </td>
              <td className="px-6 py-1.5 text-center text-nowrap w-1/6 font-bold">
              Item
              </td>
             {proj_id!=0 && <th
                scope="col"
                className="px-6 py-1.5 text-center text-nowrap w-1/6 font-bold"
              >
                Project Quantity
              </th>}
             {proj_id==0 && <th
                scope="col"
                className="px-6 py-1.5 text-center text-nowrap w-1/6 font-bold"
              >
                Warehouse Quantity
              </th>
}

              <th
                scope="col"
                className="px-6 py-1.5 text-center text-nowrap w-1/6 font-bold"
              >
                Requisition Quantity
              </th>

              <th
                scope="col"
                className="px-6 py-1.5 text-center text-nowrap w-1/6 font-bold"
              >
                Free For Requisition 
              </th>

              
            </tr>
          </thead>
          <tbody>
            {data?.map((item,index)=> item?.stock>0 &&
            <tr className="bg-[#DDEAE0] border-b-2 mt-1 text-lg border-white my-3 font-bold  dark:bg-gray-800 dark:border-gray-700">
                 <td
                scope="row"
                className="px-4 w-1/6 py-1.5 text-center flex-wrap text-wrap justify-between gap-10 items-center text-sm text-gray-900 whitespace-nowrap dark:text-white"
              >
                {index+1}
              </td>
                <td
                scope="row"
                className="px-4 w-1/6 py-1.5 text-center flex-wrap text-wrap justify-between gap-10 items-center text-sm text-gray-900 whitespace-nowrap dark:text-white"
              >
                {item?.prod_name}
              </td>
             {proj_id!=0 && <td
                scope="row"
                className="px-4 w-1/6 py-1.5 text-center flex-wrap justify-between gap-10 items-center text-sm text-gray-900 whitespace-nowrap dark:text-white"
              >
                {item?.stock || 0}
              </td>}
              {proj_id==0 && <td
                  scope="row"
                  className="px-4 w-1/6 py-1.5 text-center flex-wrap justify-between gap-10 items-center text-sm text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item?.stock || 0}
                </td>
}
              <td
                scope="row"
                className="px-4 w-1/6 py-1.5 text-center flex-wrap justify-between gap-10 items-center text-sm text-gray-900 whitespace-nowrap dark:text-white"
              >
                {item?.req_qty - item?.del_stock || 0}
              </td>

              <td
                scope="row"
                className="px-4 w-1/6 py-1.5 text-center flex-wrap justify-between gap-10 items-center text-sm text-gray-900 whitespace-nowrap dark:text-white"
              >
                {Math.abs(item?.req_qty - (item?.del_stock || 0)-(item?.stock || 0))}
              </td>
              {/* <td
                scope="row"
                className="px-4 w-1/6 py-1.5 text-center flex-wrap justify-between gap-10 items-center text-sm text-gray-900 whitespace-nowrap dark:text-white"
              >
               
              </td> */}
            </tr>)}
          </tbody>
        </table>
        <div className="flex justify-center my-4">
            <Tooltip title="Print this table">
              <Fab
                color="success"
                size="small"
                aria-label="add"
                onClick={() =>{setIsPrinting(false);
                  setTimeout(() => {
                    reactToPrintFn();
                    setIsPrinting(true);
                    }, 5);}}
              >
                <PrinterOutlined />
              </Fab>
            </Tooltip>
          </div>
          <div ref={contentRef}  style={{
                      display: !isPrinting ? "block" : "none",
                    }} >
                        <div className="grid  gap-4 p-4 sm:grid-cols-2 sm:gap-6">
                        <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
                          <PrintHeader/>
                        </div>
                        <div className="sm:col-span-2 p-2 border border-green-600 rounded-md h-full">
                          <h2 className="bg-green-500 font-bold text-lg p-3 text-white">Stock In Details</h2>
                          <table className="border-collapse border border-gray-300 w-full">
                    <tbody>
                     
                        <tr  className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                           Intended For
                          </td>
                          <td className="border text-gray-600 border-gray-300 p-2">{project||'Warehouse'}</td>
                        </tr>
                        {/* <tr  className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-semibold capitalize text-green-500">
                            Item 
                          </td>
                          <td className="border text-gray-600 border-gray-300 p-2">{product}</td>
                        </tr> */}
                       
                       

                       
                    </tbody>
                  </table>
                  <div className="sm:col-span-2 p-2 rounded-md h-full">
                  <h2 className="bg-green-500 font-bold text-lg p-3 mt-2 text-white">Item Details</h2>
                     
            
            <table className="border-collapse border border-gray-500 w-full text-center">
            <thead>
           
            <tr className="text-green-500 font-bold text-center">
            <th  className="border border-gray-300 p-2 capitalize">
               #
              </th>
              <th  className="border border-gray-300 p-2 capitalize">
               Item
              </th>
              {proj_id!=0 && <th  className="border border-gray-300 p-2 capitalize">
                Project Quantity 
              </th>}
             {proj_id==0 && <th  className="border border-gray-300 p-2 capitalize">
                Warehouse Quantity
              </th>
}
              
             
              <th  className="border border-gray-300 p-2 capitalize">
                Requisition Quantity
              </th>
              <th  className="border border-gray-300 p-2 capitalize">
                Free For Requisition 
              </th>
             
             
            </tr>
            </thead>
            <tbody className="text-gray-600 text-xs">
            {data?.map((item,index)=> <tr>
               <td className="border border-gray-300 p-2">
              {index+1}
              </td>
                <td className="border border-gray-300 p-2">
              {item?.prod_name}
              </td>
              {proj_id!=0 && <td className="border flex flex-col justify-center items-center border-gray-300 p-2">
                {item?.stock || 0}
              </td>
}

{proj_id==0 && <td className="border border-gray-300 p-2">
    {item?.stock || 0}
              </td>
}
             
              <td className="border border-gray-300 p-2">
              {data?.req_stock - data?.del_stock || 0}
              </td>

             
             
             
              <td className="border border-gray-300 p-2">
              {Math.abs(item?.req_qty - (item?.del_stock || 0)-(item?.stock || 0))}
              </td>
             
            
            </tr>)}
            </tbody>
            </table>
            
                        </div>
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

export default StockInViewCompAll
