import React from 'react'
import Backbtn from './Backbtn'
import {motion} from 'framer-motion'
import PrintComp from './PrintComp'
import { FloatButton } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import { Tooltip } from '@mui/material'

function HeadingTemplate({text,mode,data,title,onPrinting}) {
  return (
    <div className="bg-transparent dark:bg-gray-800 shadow-lg relative rounded-full overflow-hidden mb-5">
    <div className="flex flex-col shadow-lg bg-green-900 dark:bg-[#22543d] w-full md:flex-row items-center justify-start gap-1  space-x-2 px-4 py-1">
    <Backbtn/>

    <motion.h2 initial={{opacity:0,y:-50}} animate={{opacity:1,y:0}} transition={{delay:0.2, type:'just'}} className="text-xl font-semibold text-white capitalize dark:text-gray-400 ">{text}</motion.h2>
    <div className='absolute right-4 mt-1'>
    {mode==1 &&
    <motion.div  initial={{opacity:0,y:-50}} animate={{opacity:1,y:0}} transition={{delay:0.5, type:'just'}} className='relative -right-2'>
          <FloatButton icon={<PrinterOutlined />} onClick={onPrinting} className='sm:hidden' type="primary" style={{ right: 24, bottom: 80 }} />
          <Tooltip title="Print">
                    <button onClick={onPrinting} className=" inline-flex items-center justify-center mr-4 sm:-mr-1  text-sm font-medium text-center text-green-900 bg-primary-700 h-9 w-9 -mt-1 bg-white hover:duration-500 hover:scale-110  rounded-full  dark:focus:ring-primary-900  dark:bg-[#22543d] dark:hover:bg-gray-600 dark:focus:ring-primary-900 hover:bg-primary-800" ><PrinterOutlined /></button>
                  </Tooltip>
          </motion.div>
    
    }
    </div>
    
    </div>
    </div>
  )
}

export default HeadingTemplate
