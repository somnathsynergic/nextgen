import React from 'react'
import {motion} from 'framer-motion'
import { Tag } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
function VError({title}) {
  return (
    // <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}  transition={{delay:0.1,type:'tween',stiffness:500}} className='text-red-700 font-semibold text-sm  py-2 px-2'>{title}!</motion.div>
    <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}  transition={{delay:0.1,type:'tween',stiffness:500}} >
      {/* <Tag className='text-[12.6px] my-2' bordered={false} color="error">
     <CloseCircleFilled className='text-red-600'/> {title}!

      </Tag> */}
      <Tag className='bg-red-100 text-red-700 text-[12.6px] my-2' bordered={false}>
     <CloseCircleFilled className='bg-red-100 text-red-700'/> {title}!

      </Tag>
      </motion.div>
    // <Alert message={title} type="error" showIcon className='my-2'/>
  )
}

export default VError
