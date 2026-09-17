import React, { useEffect, useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import BtnComp from "./BtnComp";
import { ProgressBar } from 'primereact/progressbar';
import { LoadingOutlined } from "@ant-design/icons";
function SearchResult(data, onPress, value, show, event,className,onHandleScroll,totCount) {
  const op = useRef(null);
  console.log(data.totCount)
  console.log(data)
  const [onScrollLoad,setOnScrollLoad] = useState(false);
  const [txt, setText] = useState("");
  useEffect(() => {
    console.log(show,event)
    if (data.show) op.current.show(data.event);
    else op.current.hide(data.event);

  }, [data.show]);
  useEffect(() => {
    setOnScrollLoad(false);
  }, [data.data.length]);
  const handleScroll = (e) => {
      setOnScrollLoad(false);

    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 20) {
        if( data.data.length < data.totCount){
        data.onHandleScroll();

        setOnScrollLoad(true);
        }
    }
    else{
      setOnScrollLoad(false);
    }
};
  return (
      <OverlayPanel ref={op} classNames={data?.className} >
        {data?.event?.target?.value && <small className="text-gray-500 dark:text-gray-400">Search results for:  "{data.event?.target.value}"</small>}
        <ul onScroll={(e)=>handleScroll(e)} className="divide-y max-h-48  overflow-y-scroll mt-2 divide-gray-100 dark:divide-gray-700">
        { data.data?.map(lst=><li onClick={()=>data?.onPress(lst)} class="pb-3 sm:pb-4 cursor-pointer hover:bg-green-100 dark:hover:bg-gray-700" key={lst.id}>
            <div class="flex items-center space-x-4 rtl:space-x-reverse">
             <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-green-900 truncate my-1 dark:text-white">
                 {lst.name}
                </p>
              </div>
            </div>
          </li>)} 
        </ul>
        { onScrollLoad==true? <LoadingOutlined spin />:null}
       
      </OverlayPanel>
  );
}

export default SearchResult;
