import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React from 'react'

function SpinComp({ children, loading, classname, size }) {
    return (
        <Spin
            indicator={<LoadingOutlined spin/>}       //this component is used as a global loader
            size={size || "large"}
            className={classname ||"text-emerald-600 w-52 cursor-pointer dark:text-gray-400"}
            spinning={loading}
        >{children}

        </Spin>
    )
}

export default SpinComp