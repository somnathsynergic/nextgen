import React, { useEffect, useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";

function SearchResult(data, onClick, value, show, event) {
    console.log(data,value,event,show)
  const op = useRef(null);
  console.log(value)
  const [txt, setText] = useState("");
  useEffect(() => {
    if (show) op.current.show(event);
    else op.current.hide(event);

    console.log(show)
  }, [show]);

  return (
    <div className="card flex justify-content-center">
      <OverlayPanel ref={op}>
        <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        {data.length>0 && data?.map(lst=><li class="pb-3 sm:pb-4">
            <div class="flex items-center space-x-4 rtl:space-x-reverse">
              {/* <div class="flex-shrink-0">
                <img
                  class="w-8 h-8 rounded-full"
                  src="/docs/images/people/profile-picture-1.jpg"
                  alt="Neil image"
                />
              </div> */}
             <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                 {lst.name}
                </p>
                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                  email@flowbite.com
                </p>
              </div>
              {/* <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                $320
              </div>  */}
            </div>
          </li>)}
         
        </ul>
      </OverlayPanel>
    </div>
  );
}

export default SearchResult;
