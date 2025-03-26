import React from "react";
import IMG from "../Assets/Images/Logo.png";

function PrintHeader() {
  return (
    <div className="flex-col items-center justify-center my-5 mb-5 py-2 px-24">
         <img
              src={IMG }
              className="sm:h-14 h-9 mx-auto mb-2"
              alt="Flowbite Logo"
            />
      {/* <h2 className="mb-4 text-xl font-bold text-[#22543d]  dark:text-gray-400 ">
        NextGen Automation Pvt Ltd
      </h2> */}
     <span className="my-5 mb-5 mx-auto w-1/4 tex-wrap">
     Unit - 102, 1st Floor, PS PACE 1/1A, Mahendra Roy Lane Kolkata 700046
     Ph-033 4068 6032/6450 0535 Email: info@ngapl.com
        </span> 
    </div>
  );
}

export default PrintHeader;
