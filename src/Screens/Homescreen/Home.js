import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import BreadCrumbComp from "../../Components/BreadCrumbComp";
import { ScrollTop } from "primereact/scrolltop";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../../Components/Error";
import DialogBox from "../../Components/DialogBox";
import { CloseCircleFilled, LeftOutlined, MenuFoldOutlined, MenuUnfoldOutlined, RightOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
function Home() {
  const location = useLocation();
  const paths = location.pathname.split("/");
  const navigate=useNavigate()
  const [visible,setVisible]=useState(false)
  const [shrink,setShrink] = useState(false)
  const [close,setClose] = useState(false)

  console.log(paths);
 

  return (
    <div>
      <Header />
      <Sidebar shrink={shrink} />
      <div className={!shrink?"px-6 w-auto duration-500 sm:ml-60 bg-[#DDEAE0] dark:bg-gray-800 min-h-screen  ":"px-6 w-auto duration-500 sm:ml-20 bg-[#DDEAE0] dark:bg-gray-800 min-h-screen "}>
      {/* <div className="px-6 w-auto sm:ml-60 bg-hello bg-no-repeat bg-cover bg-fixed bg-blend-darken dark:bg-gray-800 min-h-screen "> */}
      
      <div className="flex justify-start fixed">
           {!shrink?
           <>
           <Tooltip title="Collapse"><button className="  bg-gray-400 p-1 text-white -ml-2 mt-16 -mb-11 rounded-r-full cursor-pointer flex items-center " onClick={()=>setShrink(!shrink)}> 
            <LeftOutlined className="text-xs active:animate-spin" /> 
            
            </button>
            </Tooltip>
            
          
             </>
            : <Tooltip title="Expand"><button className="bg-gray-400 p-1 -ml-2 mt-16 text-white -mb-11 rounded-r-full cursor-pointer  flex items-center " onClick={()=>setShrink(!shrink)}> 
            <RightOutlined  className="text-xs  active:animate-spin" /> 
            
            </button>
            </Tooltip>
}
              
               </div>
        <div
          className={
            "p-4 h-auto rounded-3xl bg-transparent dark:border-gray-700 dark:bg-transparent dark:text-white min-w-screen-xl"
          }
        >
          {!(paths.length == 2 && paths[1] == "home") && <BreadCrumbComp  />}
          <ErrorBoundary
            FallbackComponent={Error}
            onError={(error) => {
              console.error(error);
            }}
          >
            <ScrollTop style={{ backgroundColor: "#92140C" }} />
         
          <Outlet />
          </ErrorBoundary>
         
        </div>
      </div>
      <DialogBox
        visible={visible}
        flag={1}
        onPress={() => setVisible(false)}
      />
    </div>
  );
}

export default Home;
