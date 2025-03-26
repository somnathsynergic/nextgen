import React from 'react'
import { Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
function Viewdetails({click}) {
  return (
    <p id="helper-text-explanation" class="mt-2.5 text-sm text-gray-500 dark:text-gray-400"><a  class="font-medium text-green-900 hover:underline dark:text-blue-500" onClick={()=>click()}>
     <Tag color="#014737"> <EyeOutlined/> View details</Tag> 
      
      </a></p>
  )
}

export default Viewdetails
