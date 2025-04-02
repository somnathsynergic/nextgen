import React, { useState,useRef,useEffect } from "react";
import { routePaths } from "../Assets/Data/Routes";
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
import { Tag } from "antd";
import DrawerComp from "./DrawerComp";
import { useReactToPrint } from "react-to-print";
import PrintHeader from "../Components/PrintHeader";
function POTableView({ po_data, setSearch, title,print }) {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(0);
  const [id, setId] = useState(0);
  const [po, setPO] = useState(0);
  const [isPrinting, setIsPrinting] = useState(true);
      const contentRef = useRef(null);
    
      const reactToPrintFn = useReactToPrint({
        contentRef,
      });
  const navigate=useNavigate()
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
  useEffect(() => {
    if(print){
      setIsPrinting(false);
      setTimeout(() => {
        setRows(po_data?.length);
        
        reactToPrintFn();
        setIsPrinting(true);
        }, 5);
    }
   }, [print]);
  return (
    <>
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
      </motion.section>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
      >
        <div ref={contentRef} className={isPrinting?"w-full":"w-full p-5"}>
           <div className={isPrinting?"hidden rounded-md w-full":"w-full border  border-green-500 rounded-md"}>
                        <PrintHeader />
                        </div>
        <table class={isPrinting?"w-full text-sm text-left rtl:text-right shadow-lg text-green-900 dark:text-gray-400":"w-full mt-2 mx-auto text-sm text-left rtl:text-right shadow-lg text-green-900 dark:text-gray-400"}>
          <thead class={isPrinting?" text-md  text-gray-700 capitalize   bg-[#C4F1BE] dark:bg-gray-700 dark:text-gray-400":" text-md  text-white capitalize   bg-green-500 dark:bg-gray-700 dark:text-gray-400"}>
            <tr>
              <th scope="col" class="p-4">
                #
              </th>
              <th scope="col" class="p-4">
                PO No.
              </th>
              <th scope="col" class="p-4">
                Date
              </th>
              <th scope="col" class="p-4">
                Vendor
              </th>
              <th scope="col" class="p-4">
                Intended For
              </th>
              <th scope="col" class="p-4">
                Status
              </th>

              <th scope="col" class="p-4">
                Created By
              </th>
              {isPrinting && <th scope="col" class="p-4">
                Action
              </th>}
            </tr>
          </thead>
          <tbody>
            {po_data &&
              po_data?.slice(first, rows + first).map((item) => (
                <tr
               
                  className={
                    item.modified_at == null
                      ? +Math.floor(
                          (new Date().getTime() -
                            new Date(item.created_at).getTime()) /
                            1000
                        ) < 1800
                        ? "bg-[#ffe4c4] cursor-pointer duration-500 hover:bg-gray-200 hover:duration-500 delay-700 border-b dark:bg-gray-800 hover:text-green-900 dark:border-gray-700 text-nowrap"
                        : "bg-white border-b hover:text-green-900 cursor-pointer hover:bg-gray-200 dark:bg-gray-800 hover:duration-500 dark:border-gray-700  text-nowrap"
                      : +Math.floor(
                          (new Date().getTime() -
                            new Date(item.modified_at).getTime()) /
                            1000
                        ) < 1800
                      ? "bg-[#ffe4c4] border-b hover:text-green-900 cursor-pointer dark:bg-gray-800 hover:bg-gray-200 duration-500 hover:duration-500 dark:border-gray-700  text-nowrap"
                      : "bg-white border-b hover:text-green-900 cursor-pointer hover:duration-500 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700  text-nowrap"
                  }
                >
                  <th
                    scope="row"
                    class="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {/* <Tag color="#4FB477" className="rounded-full text-xs"> {item.serial_number} </Tag> */}
                   {item.serial_number}
                  </th>
                  <td class="px-4 py-4 text-sm">
                    <span className="flex gap-2 text-green-900 font-bold">
                      {" "}
                      {item.po_no || "----------------------"}{" "}
                      {item.po_status == "A" && (
                        <Popover
                          content={content}
                          title={"Documents for " + item.po_no}
                        >
                          {isPrinting?  <UploadOutlined
                              onMouseEnter={() => {
                                setId(item.sl_no);
                                setPO(item.po_no);
                              }}
                              className="cursor-pointer"
                            />:null}
                        </Popover>
                      )}
                    </span>
                   {isPrinting && <p class="text-[10.5px] text-gray-500 italic">
                      {item.modified_at == null ? (
                        <span>
                          {" "}
                          Created{" "}
                          {+Math.floor(
                            (new Date().getTime() -
                              new Date(item.created_at).getTime()) /
                              1000
                          ) < 60
                            ? +Math.floor(
                                (new Date().getTime() -
                                  new Date(item.created_at).getTime()) /
                                  1000
                              ).toFixed(0) + " second(s) ago"
                            : +Math.floor(
                                (new Date().getTime() -
                                  new Date(item.created_at).getTime()) /
                                  1000
                              ) /
                                60 <
                              60
                            ? (
                                +Math.floor(
                                  (new Date().getTime() -
                                    new Date(item.created_at).getTime()) /
                                    1000
                                ) / 60
                              ).toFixed(0) + " minute(s) ago"
                            : +Math.floor(
                                (new Date().getTime() -
                                  new Date(item.created_at).getTime()) /
                                  1000
                              ) /
                                3600 <
                              24
                            ? (
                                +Math.floor(
                                  (new Date().getTime() -
                                    new Date(item.created_at).getTime()) /
                                    1000
                                ) / 3600
                              ).toFixed(0) + " hour(s) ago"
                            : +Math.floor(
                                (new Date().getTime() -
                                  new Date(item.created_at).getTime()) /
                                  1000
                              ) /
                                (3600 * 24) <
                              31
                            ? (
                                +Math.floor(
                                  (new Date().getTime() -
                                    new Date(item.created_at).getTime()) /
                                    1000
                                ) /
                                (3600 * 24)
                              ).toFixed(0) + " day(s) ago"
                            : (
                                +Math.floor(
                                  (new Date().getTime() -
                                    new Date(item.created_at).getTime()) /
                                    1000
                                ) /
                                (3600 * 24 * 31)
                              ).toFixed(0) + " month(s) ago"}
                        </span>
                      ) : (
                        <span>
                          {" "}
                          Modified{" "}
                          {+Math.floor(
                            (new Date().getTime() -
                              new Date(item.modified_at).getTime()) /
                              1000
                          ) < 60
                            ? +Math.floor(
                                (new Date().getTime() -
                                  new Date(item.modified_at).getTime()) /
                                  1000
                              ).toFixed(0) + " second(s) ago"
                            : +Math.floor(
                                (new Date().getTime() -
                                  new Date(item.modified_at).getTime()) /
                                  1000
                              ) /
                                60 <
                              60
                            ? (
                                +Math.floor(
                                  (new Date().getTime() -
                                    new Date(item.modified_at).getTime()) /
                                    1000
                                ) / 60
                              ).toFixed(0) + " minute(s) ago"
                            : +Math.floor(
                                (new Date().getTime() -
                                  new Date(item.modified_at).getTime()) /
                                  1000
                              ) /
                                3600 <
                              24
                            ? (
                                +Math.floor(
                                  (new Date().getTime() -
                                    new Date(item.modified_at).getTime()) /
                                    1000
                                ) / 3600
                              ).toFixed(0) + " hour(s) ago"
                            : +Math.floor(
                                (new Date().getTime() -
                                  new Date(item.modified_at).getTime()) /
                                  1000
                              ) /
                                (3600 * 24) <
                              31
                            ? (
                                +Math.floor(
                                  (new Date().getTime() -
                                    new Date(item.modified_at).getTime()) /
                                    1000
                                ) /
                                (3600 * 24)
                              ).toFixed(0) + " day(s) ago"
                            : (
                                +Math.floor(
                                  (new Date().getTime() -
                                    new Date(item.modified_at).getTime()) /
                                    1000
                                ) /
                                (3600 * 24 * 31)
                              ).toFixed(0) + " month(s) ago"}
                        </span>
                      )}
                    </p>}
                  </td>
                  <td class="px-4 py-4 text-gray-600">{item.po_issue_date}</td>
                  <td class="px-4 py-4 text-gray-600 text-wrap text-sm">{item.vendor_name}</td>
                  <td class="px-4 py-4 text-gray-600 text-wrap text-sm">
                    {item.proj_name? item.proj_name+'('+item.proj_id+')' : 'Warehouse'}
                  </td>
                  <td class="px-13 py-4">
                    {item.po_status == "P" ? (
                      <Tag
                        className="text-[12px] p-1 rounded-full w-36"
                        icon={<SyncOutlined spin />}
                        color="processing"
                      >
                        In Progress
                        <Tooltip title="Draft saved">
                          {" "}
                          <FileTextOutlined className="text-red-500 ml-7" />
                        </Tooltip>{" "}
                      </Tag>
                    ) : item.po_status == "A" ? (
                      <Tag
                        className="text-[12px] p-1 rounded-full w-36"
                        icon={<CheckCircleOutlined />}
                        color="success"
                      >
                        Approved
                      </Tag>
                    ) : item.po_status == "U" ? (
                      <Tag
                        className="text-[12px] p-1 rounded-full w-36"
                        icon={<ClockCircleOutlined className="animate-pulse" />}
                        color="error"
                      >
                        Pending Approval
                      </Tag>
                    ) : item.po_status == "D" ? (
                      <Tag
                        className="text-[12px] p-1 rounded-full w-36"
                        icon={<TruckOutlined />}
                        color="lime"
                      >
                        Delivered
                      </Tag>
                    ) : (
                      <Tag
                        className="text-[12px] p-1 rounded-full w-36"
                        icon={<TruckOutlined />}
                        color="lime"
                      >
                        {" "}
                        Partially Delivered{" "}
                      </Tag>
                    )}
                  </td>
                  <td class="px-3 py-4 text-gray-600">{item.created_by}</td>
                  {isPrinting && <td class="px-1 py-4 text-nowrap">
                    <Link
                      to={
                        item.fresh_flag == "Y"
                          ? routePaths.PURCHASEORDERFORM + "F/" + item.sl_no
                          : routePaths.PURCHASEORDERFORM + "E/" + item.sl_no
                      }
                    >
                      <EditOutlined class="text-md ml-7 text-green-900" />
                    </Link>
                  </td>}
                </tr>
              ))}
          </tbody>
        </table>
        </div>
        <Paginator
          first={first}
          rows={rows}
          totalRecords={po_data?.length}
          rowsPerPageOptions={[3, 5, 10, 15, 20, 30, po_data?.length]}
          onPageChange={onPageChange}
        />
      </motion.section>
      <DrawerComp
        open={open}
        flag={mode}
        data={{ id: id, po: po }}
        onClose={() => onClose()}
      />
    </>
  );
}

export default POTableView;
