import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LOGO from "../Assets/Images/inverted.png";
import LOGOCROP from "../Assets/Images/inverted-crop.png";
import Menus from "./Menus";
import { Divider } from "@mui/material";
import { Drawer } from "antd";
import { motion } from "framer-motion";
import { url } from "../Address/BaseUrl";
import axios from "axios";

function Sidebar({shrink,close}) {
  const location = useLocation();
  const [current, setCurrent] = React.useState("mail");
  const [theme, setTheme] = useState(localStorage.getItem("col"));
  const paths = location.pathname.split("/");
  const [open, setOpen] = useState(false);
  const [menuData, setMenuData] = useState();
  useState(() => {
    setTheme(localStorage.getItem("col"));
  }, [localStorage.getItem("col")]);
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const drawerWidth = 257;

  useEffect(() => {
    axios
      .post(url + "/api/fetch_menus", { email: localStorage.getItem("email") })
      .then((res) => {
        console.log(res);
        setMenuData(res?.data?.msg[0]);
        localStorage.setItem('perm',JSON.stringify(res?.data?.msg[0] || '{M1:false,M2:false,PR1:false,PR2:false,P1:false,P2:false,PU1:false,PU2:false,APU1:false,APU2:false,MRN1:false,MRN2:false,R1:false,R2:false,MIN1:false,MIN2:false,S1:false,S2:false}') )
      });
  }, []);
  return (
    <div className="bg-gray-200 dark:bg-gray-800 ">
      <button
        onClick={showDrawer}
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      <Drawer
        className="md:hidden w-72 p-0"
        placement={"left"}
        closable={true}
        onClose={onClose}
        open={open}
        key={"left"}
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="flex items-center justify-center p-3"
        >
          <img src={LOGO} className="h-16" alt="Flowbite Logo" />
        </motion.div>
        <Divider />
        <Menus mode={"vertical"} theme={"light"} />

        <Divider />
      </Drawer>
      <aside
        id="sidebar-multi-level-sidebar"
        className={!shrink?"fixed top-0 left-0 duration-500 z-40 w-64 h-screen ":"fixed top-0 duration-500 left-0 z-40 w-24 h-screen "}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-green-900 dark:bg-gray-800">
          <div className="flex items-center justify-start p-3">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              src={!shrink?LOGO:LOGOCROP}
              className={!shrink?"h-14 mb-5 duration-500":"mb-5 h-10 duration-500"}
              alt="Flowbite Logo"
            />
          </div>
          <Menus shrink={shrink} data={menuData} />
          {/* <img className='absolute bottom-0 h-40 blur-1' src={sidebar2} alt="Flowbite Logo" /> */}
        </div>
        {/* <motion.img initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5, type:'spring'
              }} src={sidebar1} className="h-14" alt="Flowbite Logo" /> */}
      </aside>
    </div>
  );
}

export default Sidebar;
