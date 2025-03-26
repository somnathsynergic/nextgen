import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";

import { motion } from "framer-motion";
import { Empty, Segmented, Spin } from "antd";
import {
  InfoCircleOutlined,
  SettingOutlined,
  CloseOutlined,
  SolutionOutlined,
  ProjectOutlined,
  BellOutlined,
  UserAddOutlined,
  SwapOutlined,
  InboxOutlined,
  UserSwitchOutlined,
  FileSearchOutlined,
  BarChartOutlined,
  ExceptionOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { Flex, Progress } from "antd";
import { WidthFull } from "@mui/icons-material";
import DialogBox from "../../Components/DialogBox";
import { routePaths } from "../../Assets/Data/Routes";
import { Link } from "react-router-dom";
import axios from "axios";
import { url } from "../../Address/BaseUrl";
function HomeScreen() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [visible, setVisible] = useState(false);
  const [flag, setFlag] = useState(2);
  const [loading,setLoading] = useState(false)
  const [dashboard_data,setDashboardData] = useState({})
  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("#08453c");
    const textColorSecondary = documentStyle.getPropertyValue("#08453c");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "First Dataset",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: "#15803D",
          tension: 0.4,
        },
        {
          label: "Second Dataset",
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: "#EAB308",
          tension: 0.4,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  useEffect(()=>{
    setLoading(true)
    axios.post(url+'/api/get_dashboard_data',{wrd:''}).then(res=>{
      console.log(res)
      setDashboardData(res?.data)
      setLoading(false)
    })
  },[])

  return (
    <main class="px-4 h-auto ">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Link to={routePaths.PROJECTS} class="relative cursor-pointer  border-dashed transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 2xl:h-32 flex  items-center">
       
          <div class="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-[#92140C]">
            <ProjectOutlined class="text-white text-5xl" />
          </div>
          <div class="text-gray-800 text-sm 2xl:text-2xl  absolute right-3 top-3 font-bold">
            Projects Opened
          </div>
          <Spin
                        indicator={<LoadingOutlined spin />}
                        size="large"
                        className="text-red-900 ml-7 mt-5 dark:text-gray-400"
                        spinning={loading}
                      >
          <div class="text-[#92140C] text-4xl ml-14 mt-9 font-bold">{dashboard_data?.project}</div>
          {/* <div class="text-[#92140C] text-4xl ml-14 mt-9 font-bold">0</div> */}
          </Spin>
        </Link>
        <Link to={routePaths.PURCHASEORDER+'/P'} class="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center">
          <div class="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-yellow-500">
            <ExceptionOutlined class="text-white text-5xl" />
          </div>
          <div class="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
            Pending POs
          </div>
          <Spin
                        indicator={<LoadingOutlined spin />}
                        size="large"
                        className="text-yellow-500 ml-7 mt-5 dark:text-gray-400"
                        spinning={loading}
                      >
          <div class="text-yellow-500 text-4xl ml-14 mt-9 font-bold">{dashboard_data?.po}</div>
          {/* <div class="text-yellow-500 text-4xl ml-14 mt-9 font-bold">0</div> */}
          </Spin>
        </Link>
        <Link to={routePaths.REQVIEW} class="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center">
          <div class="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-green-500">
            <ExceptionOutlined class="text-white text-5xl" />
          </div>
          <div class="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
            Requisitions
          </div>
          <Spin
                        indicator={<LoadingOutlined spin />}
                        size="large"
                        className="text-green-500 ml-7 mt-5 dark:text-gray-400"
                        spinning={loading}
                      >
          <div class="text-green-500 text-4xl ml-14 mt-9 font-bold">{dashboard_data?.req}</div>
          {/* <div class="text-green-500 text-4xl ml-14 mt-9 font-bold">0</div> */}
          </Spin>
        </Link>
        <Link to={routePaths.APPROVEMRN} class="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center">
          <div class="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-amber-500">
            <ExceptionOutlined class="text-white text-5xl" />
          </div>
          <div class="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
            Pending MRN(s)
          </div>
          <Spin
                        indicator={<LoadingOutlined spin />}
                        size="large"
                        className="text-amber-500 ml-7 mt-5 dark:text-gray-400"
                        spinning={loading}
                      >
          <div class="text-amber-500 text-4xl ml-14 mt-9 font-bold">{dashboard_data?.mrn}</div>
          {/* <div class="text-amber-500 text-4xl ml-14 mt-9 font-bold">0</div> */}
          </Spin>
        </Link>
        <Link to={routePaths.PURCHASEORDER} class="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center">
          <div class="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-emerald-600">
            <ExceptionOutlined class="text-white text-5xl" />
          </div>
          <div class="text-gray-800 text-xs ml-4 2xl:text-2xl absolute right-1 top-3 font-bold">
            Outstanding from client(s)
          </div>
          <div class="text-emerald-600 text-4xl ml-14 mt-9 font-bold">0</div>
        </Link>
        <Link to={routePaths.PURCHASEORDER} class="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center">
          <div class="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-rose-500">
            <ExceptionOutlined class="text-white text-5xl" />
          </div>
          <div class="text-gray-800  text-xs 2xl:text-2xl text-wrap absolute right-1 top-3 font-bold">
            Outstanding from vendor(s)
          </div>
          <div class="text-rose-500 text-4xl ml-14 mt-9 font-bold">0</div>
        </Link>
        <Link to={routePaths.USERS} class="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center">
          <div class="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-green-700">
            <UserAddOutlined class="text-white text-5xl" />
          </div>
          <div class="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
            Users
          </div>
          <Spin
                        indicator={<LoadingOutlined spin />}
                        size="large"
                        className="text-green-700 ml-7 mt-5 dark:text-gray-400"
                        spinning={loading}
                      >
          <div class="text-green-700 text-4xl ml-14 mt-9 font-bold">{dashboard_data?.user}</div>
          {/* <div class="text-green-700 text-4xl ml-14 mt-9 font-bold">0</div> */}
          
          </Spin>
        </Link>
        <Link to={routePaths.VENDORS} class="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center">
          <div class="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-teal-500">
            <InboxOutlined class="text-white text-5xl" />
          </div>
          <div class="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
            Vendors
          </div>
          <Spin
                        indicator={<LoadingOutlined spin />}
                        size="large"
                        className="text-teal-500 ml-7 mt-5 dark:text-gray-400"
                        spinning={loading}
                      >
          <div class="text-teal-500 text-4xl ml-14 mt-9 font-bold">{dashboard_data?.vendor}</div>
          {/* <div class="text-teal-500 text-4xl ml-14 mt-9 font-bold">0</div> */}
          </Spin>
        </Link>
        <Link to={routePaths.CLIENTS} class="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center">
          <div class="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-[#6564DB]">
            <UserSwitchOutlined class="text-white text-5xl" />
          </div>
          <div class="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
            Clients
          </div>
          <Spin
                        indicator={<LoadingOutlined spin />}
                        size="large"
                        className="text-[#6564DB] ml-7 mt-5 dark:text-gray-400"
                        spinning={loading}
                      >
          <div class="text-[#6564DB] text-4xl ml-14 mt-9 font-bold">{dashboard_data?.client}</div>
          {/* <div class="text-[#6564DB] text-4xl ml-14 mt-9 font-bold">0</div> */}
          </Spin>
        </Link>
        <Link to={routePaths.PURCHASEORDER} class="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center">
          <div class="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-green-700">
            <FileSearchOutlined class="text-white text-5xl" />
          </div>
          <div class="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
            Inspections
          </div>
          <div class="text-green-700 text-4xl ml-14 mt-9 font-bold">0</div>
        </Link>
        <Link to={routePaths.STOCKASSIGNVIEW} class="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center">
          <div class="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-[#6564DB]">
            <BarChartOutlined class="text-white text-5xl" />
          </div>
          <div class="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
            Stock Levels
          </div>
          <Spin
                        indicator={<LoadingOutlined spin />}
                        size="large"
                        className="text-[#6564DB] ml-7 mt-5 dark:text-gray-400"
                        spinning={loading}
                      >
          <div class="text-[#6564DB] text-4xl ml-14 mt-9 font-bold">{dashboard_data?.stock_cnt?dashboard_data.stock_cnt:loading?'':0}</div>
          {/* <div class="text-[#6564DB] text-4xl ml-14 mt-9 font-bold">0</div> */}
          </Spin>
        </Link>
        <Link to={routePaths.PROJECTS} class="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center">
          <div class="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-[#92140C]">
            <ProjectOutlined class="text-white text-5xl" />
          </div>
          <div class="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
            Projects Running
          </div>
          <Spin
                        indicator={<LoadingOutlined spin />}
                        size="large"
                        className="text-[#92140C] ml-7 mt-5 dark:text-gray-400"
                        spinning={loading}
                      >
          <div class="text-[#92140C] text-4xl ml-14 mt-9 font-bold">{dashboard_data?.project}</div>
          {/* <div class="text-[#92140C] text-4xl ml-14 mt-9 font-bold">0</div> */}
          </Spin>
        </Link>
        {/* <Link to={routePaths.PURCHASEORDER} class="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center">
          <div class="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-yellow-500">
            <ExceptionOutlined class="text-white text-5xl" />
          </div>
          <div class="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
            Pending POs
          </div>
          <div class="text-yellow-500 text-4xl ml-14 mt-9 font-bold">15</div>
        </Link> */}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* <div
          initial={{ x: -500 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 20 }}
          class="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 rounded-lg flex justify-center py-5 dark:border-gray-600 h-32 md:h-64 shadow-2xl cursor-pointer"
          onClick={() => setVisible(true)}
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, type: "tween", duration: 1.5 }}
            class="text-emerald-100 font-sans text-lg font-thin"
          >
            Welcome {localStorage.getItem("user_name")}
          </motion.h2>

          <img
            class="absolute bottom-0 p-2 h-52 w-full"
            src={`${HELLO}`}
            alt=""
          />
        </div>  */}

        {/* <div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.5,
            type: "spring",
            stiffness: 20,
          }}
          class=" rounded-lg bg-transparent col-span-1 dark:border-gray-600 p-4 h-44 md:h-64"
        >
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 10 }}
            class="card flex-col text-xs flex-wrap items-center justify-evenly space-y-2 gap-4  max-h-full -mt-3"
          >
            <div class="px-5 bg-white text-emerald-800 font-thin text-sm h-14 w-full rounded-lg flex justify-start items-center shadow-xl">
              <SettingOutlined class="mr-4 bg-emerald-700 text-white rounded-full text-normal p-2" />{" "}
              Materials delivered
            </div>
            <div class="px-5 bg-white text-emerald-800 h-14 w-full rounded-lg text-sm flex justify-start items-center shadow-xl">
              <CloseOutlined class="mr-4 bg-purple-950 text-white rounded-full text-normal p-2" />{" "}
              Date nearing
            </div>
            <div class="px-5 bg-white text-emerald-800 h-14 w-full rounded-lg flex justify-start items-center shadow-xl ">
              <InfoCircleOutlined class="mr-4 bg-emerald-300 text-white rounded-full text-normal p-2" />{" "}
              New project opened
            </div>
            <div class="px-5 bg-white text-emerald-800 font-thin h-14 w-full rounded-lg flex justify-start items-center shadow-xl text-sm">
              <SettingOutlined class="mr-4 bg-[#F4EF88] text-emerald-700 rounded-full text-normal p-2" />{" "}
              Nut bolts delivered
            </div>
          </div>
        </div>
        {/* <div class=" flex rounded-lg col-span-2 bg-transparent dark:border-gray-600  h-32 md:h-64">
          <div class="flex flex-col">
            <div
              whileHover={{ scale: 1.1, backgroundColor: "#C05746" }}
              initial={{ y: -600 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 20 }}
              class="hover:-translate-y-1 hover:scale-110 bg-gradient-to-tr from-white to-gray-100 h-40 sm:w-32 2xl:w-56 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer"
            >
              <span class="text-5xl mb-2 text-emerald-700">32</span>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, type: "tween" }}
                class="text-emerald-700 font-sans "
              >
                Clients
              </motion.h2>
            </div>
            <div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 20 }}
              class="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 h-20 mt-3 w-32 2xl:w-56 rounded-lg shadow-lg flex flex-col items-center justify-center"
            >
              <span class="text-2xl mb-2 text-white">78</span>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, type: "tween" }}
                class="text-gray-300 text-sm "
              >
                Vendors
              </motion.h2>
            </div>
          </div>
          <div class="ml-3 flex flex-col">
            <div
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 20 }}
              class="bg-[#F3DE8A] h-20 w-32 2xl:w-56 shadow-lg rounded-lg flex flex-col items-center justify-center"
            >
              <span class="text-3xl mb-1 text-emerald-700">12</span>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, type: "tween" }}
                class="text-emerald-700 text-sm "
              >
                Running projects
              </motion.h2>
            </div>

            <div
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 20 }}
              class="bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-800  h-40 mt-3 w-32 2xl:w-56 shadow-lg rounded-lg flex flex-col justify-center items-center"
            >
              <span class="text-5xl  text-gray-300">8</span>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, type: "tween" }}
                class="text-gray-300 text-sm "
              >
                Pending POs
              </motion.h2>
            </div>
          </div>
          <div class="ml-3 flex flex-col">
            <div
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 20 }}
              class="bg-gradient-to-t from-emerald-600 via-emerald-700 to-emerald-800 h-32 w-56 2xl:w-60 rounded-lg shadow-lg flex flex-col items-center justify-center"
            >
              <span class="text-5xl  text-gray-300">2393</span>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, type: "tween" }}
                class="text-gray-300 text-sm "
              >
                Stock Levels
              </motion.h2>
            </div>
            <div class="flex mt-3">
              <div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, type: "spring", stiffness: 20 }}
                class="bg-gradient-to-tr from-white to-gray-100 mr-3 h-28 w-1/2 2xl:w-3/4 shadow-lg rounded-lg flex flex-col items-center justify-center"
              >
                <span class="text-2xl mb-2 text-emerald-700">5</span>

                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, type: "tween" }}
                  class="text-emerald-700 text-xs "
                >
                  Pending Deliveries
                </motion.h2>
              </div>
              <div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, type: "spring", stiffness: 20 }}
                class="bg-[#F3DE8A] h-28 w-1/2 2xl:w-3/4 shadow-lg rounded-lg flex flex-col justify-center items-center"
              >
                <span class="text-2xl mb-2 text-emerald-700">5</span>

                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, type: "tween" }}
                  class="text-emerald-700 text-xs "
                >
                  Inspections
                </motion.h2>
              </div>
            </div>
          </div>
        </div> */}

        <div class="col-span-4 space-y-2">
          <Segmented
            itemActiveBg="#08453c"
            options={["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]}
            onChange={(value) => {
              console.log(value); // string
            }}
          />
        </div>
        <div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 20 }}
          class="bg-white rounded-lg shadow-lg dark:border-gray-600 h-32 md:h-64"
        >
          <Chart
            type="line"
            class="h-64"
            data={chartData}
            options={chartOptions}
          />
        </div>
        <div
          initial={{ opacity: 0, x: 600 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 20 }}
          class="bg-green-700 flex justify-center col-span-1 items-center shadow-lg rounded-lg border-white dark:border-gray-600 h-32 md:h-64"
        >
          <Progress
            strokeLinecap="butt"
            type="circle"
            strokeColor={"white"}
            percent={75}
          />
        </div>
        <div class="col-span-2 overflow-x-auto bg-white shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-white bg-green-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Product name
                </th>
                <th scope="col" class="px-6 py-3">
                  Part No.
                </th>
                <th scope="col" class="px-6 py-3">
                  Category
                </th>
                
              </tr>
            </thead>
            <tbody>
         {dashboard_data?.products?.length>0 ? <>
          {dashboard_data?.products?.map(item=>
              <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item?.prod_name?.length<=15?item?.prod_name:item?.prod_name?.substring(0,15)+'...'}
                </th>
                <td class="px-6 py-4">{item?.part_no?.length<=15?item?.part_no:item?.part_no?.substring(0,15)+'...'}</td>
                <td class="px-6 py-4">{item?.catg_name?.length<=15?item?.catg_name:item?.catg_name?.substring(0,15)+'...'}</td>
              </tr>)
}
              </>:loading?<div className="mt-16 text-3xl ml-56 mx-auto">
                <LoadingOutlined className="text-3xl text-green-900" spin/>
              </div>:<Empty/>
}
             
            </tbody>
          </table>
        </div>
        <div class="col-span-2 overflow-x-auto bg-white shadow-md sm:rounded-lg">
          <Chart
            type="line"
            class="h-64"
            data={chartData}
            options={chartOptions}
          />
        </div>
        <div class="col-span-2 overflow-x-auto bg-white shadow-md sm:rounded-lg">
          <Chart
            type="bar"
            class="h-64"
            data={chartData}
            options={chartOptions}
          />
        </div>
      </div>
    
      {/* <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
        <div class="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
        <div class="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
        <div class="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
      </div>
      <div class="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-96 mb-4"></div>
      <div class="grid grid-cols-2 gap-4">
        <div class="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
        <div class="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
        <div class="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
        <div class="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
      </div> */}
      <DialogBox
        visible={visible}
        flag={flag}
        onPress={() => setVisible(false)}
      />
    </main>
  );
}

export default HomeScreen;
