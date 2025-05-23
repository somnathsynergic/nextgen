import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { url } from '../../Address/BaseUrl'
import { routePaths } from "../../Assets/Data/Routes";
import { Link, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { Paginator } from "primereact/paginator";
import { motion } from "framer-motion";
import { Button, Popover } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  SyncOutlined,
  TruckOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Pagination from '../../Components/Pagination';
function StockView() {
const [products,setProducts] = useState([])
const [first, setFirst] = useState(0);
const [rows, setRows] = useState(10);
const [open, setOpen] = useState(false);
const [mode, setMode] = useState(0);
const [id, setId] = useState(0);
const [po, setPO] = useState(0);
const navigate=useNavigate()
const onPageChange = (event) => {
  setFirst(event.first);
  setRows(event.rows);
};
useEffect(()=>{
    // axios.post(url+'/api/getproduct',{id:0}).then(res=>{
    //     console.log(res)
    //     setProducts(res?.data?.msg)
    
    // })
    axios.post(url+'/api/allitemwise',{dt:new Date()}).then(res=>{
        console.log(res)
        setProducts(res?.data?.msg)
    
        console.log(res)})
},[])
  return (
    <div>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
      >
        <div class="flex flex-col p-1 bg-green-900 rounded-full my-3 dark:bg-[#22543d] md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 ">
          <div class="w-full">
            <div class="flex items-center justify-between">
              <motion.h2
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, type: "just" }}
                class="text-xl w-48 capitalize text-nowrap font-bold text-white dark:text-white sm:block hidden mx-5"
              >
                View Stock
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
                //   onChange={(text) => setSearch(text.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
      >
        <table class="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400">
          <thead class=" text-md  text-gray-700 capitalize   bg-[#C4F1BE] dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="p-4">
                #
              </th>
              <th scope="col" class="p-4">
                Item
              </th>
              <th scope="col" class="p-4">
                Warehouse Stock
              </th>
              <th scope="col" class="p-4">
                Project
              </th>
              <th scope="col" class="p-4">
                Project Stock
              </th>
              {/* <th scope="col" class="p-4">
                Status
              </th> */}

              {/* <th scope="col" class="p-4">
                Created By
              </th> */}
              <th scope="col" class="p-4">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products?.slice(first, rows + first).map((item) => (
                <tr
                //  onClick={()=>{
                //   if(item.fresh_flag == "Y")
                //   navigate(routePaths.PURCHASEORDERFORM + "F/" + item.sl_no)
                // else
                //   navigate(routePaths.PURCHASEORDERFORM + "E/" + item.sl_no)
                //  }}
                  className={
                  
                    "bg-white border-b hover:text-green-900 cursor-pointer hover:duration-500 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700  text-nowrap"
                  }
                >
                  <th
                    scope="row"
                    class="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {/* <Tag color="#4FB477" className="rounded-full text-xs"> {item.serial_number} </Tag> */}
                   {item.serial_number}
                  </th>
                  <td class="px-3 py-4">
                    <span className="flex gap-2 text-green-900 font-bold">
                      {" "}
                      {item.prod_name}{" "}
                     
                    </span>
                   
                  </td>
                  <td class="px-3 py-4 text-gray-600">{item.warehouse_stock||0}</td>
                  <td class="px-3 py-4 text-gray-600">
                    {item.proj_name}
                    {/* {item.fresh_flag} */}
                  </td>
                
                  <td class="px-3 py-4 text-gray-600">{item.project_stock}</td>
                  <td class="px-1 py-4 text-nowrap">
                    <Link
                      to={
                           routePaths.STATEMENT + item.item_id
                      }
                    >
                      <EditOutlined class="text-md ml-7 text-green-900" />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* <Paginator
          first={first}
          rows={rows}
          totalRecords={products?.length}
          rowsPerPageOptions={[3, 5, 10, 15, 20, 30, products?.length]}
          onPageChange={onPageChange}
        /> */}
        <Pagination  first={first}
          rows={rows}
          totalRecords={products?.length}
          rowsPerPageOptions={[3, 5, 10, 15, 20, 30, products?.length]}
          onPageChange={onPageChange}
          />
      </motion.section>
    </div>
  )
}

export default StockView
