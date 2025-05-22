import { LoadingOutlined } from '@ant-design/icons'
import React from 'react'

function BtnGroupReuse({ icon, text, flag, onClick, disabled,loading }) {
    return (
        <>
            <button
                onClick={onClick}
                className={flag == 1 ? "relative disabled:bg-[#C4F1BE] disabled:border-[#C4F1BE] disabled:cursor-not-allowed group shadow-xl border border-green-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:bg-white hover:border hover:border-green-900 hover:shadow-2xl hover:text-green-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600" : "relative disabled:bg-red-300 disabled:border-red-300 disabled:cursor-not-allowed group shadow-xl border border-red-900 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:bg-white hover:border hover:border-red-900 hover:shadow-2xl hover:text-red-900  duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 hover:font-bold dark:bg-[#22543d] dark:hover:bg-gray-600"}
                disabled={disabled}
            >
                <span class="relative z-10">
                    {!loading?icon:<LoadingOutlined spin className='text-white mr-2'/>}
                    {text}
                </span>
              <span class={flag == 1 ? "absolute left-0 rounded-full top-0 h-full w-0 bg-white text-green-900 transition-all duration-300 group-hover:w-full z-0 " : "absolute left-0 rounded-full top-0 h-full w-0 bg-white text-red-900 transition-all duration-300 group-hover:w-full  z-0"}></span>
            </button>

        </>
    )
}

export default BtnGroupReuse