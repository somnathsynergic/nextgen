import React from 'react'
import {SaveOutlined,DeleteOutlined,ReloadOutlined} from '@ant-design/icons'
function BtnComp({onReset,mode,onDelete}) {
  return (
    <div className="flex justify-center gap-2">
    {mode=='A' &&  <button
        type="reset"

      className="relative disabled:bg-gray-400 group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"

        onClick={onReset}
    >   
     <span class="relative z-10">
    <ReloadOutlined className='mr-2'/> 
        Reset
        </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full z-0"></span>
    </button>}
    {/* {mode=='E' &&  <button
        type="button"

       className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-[#92140C] bg-[#92140C] transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 rounded-full  dark:focus:ring-primary-900"

        onClick={onDelete}
    >    
    <DeleteOutlined className='mr-2'/>
        Delete
    </button>} */}
    {/* <button class="relative overflow-hidden px-6 py-2 bg-gray-800 text-white rounded-lg group">
  <span class="relative z-10">Hover Me</span>
  <span class="absolute left-0 top-0 h-full w-0 bg-teal-500 transition-all duration-300 group-hover:w-full z-0"></span>
</button> */}
    <button
        type="submit"
        className="relative disabled:bg-gray-400 group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"

    >
        <span class="relative z-10">
        <SaveOutlined className='mr-2' />
        Submit
        </span>
        <span class="absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0"></span>
    </button>
</div>
  )
}

export default BtnComp
