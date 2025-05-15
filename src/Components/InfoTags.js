import { Tag } from 'antd'
import React from 'react'

function InfoTags({icon,onPress,bgCol,textCol,text,color}) {
  return (
    <Tag color={color} className={`${bgCol} ${textCol}`} onClick={onPress}>{icon} {text}</Tag>
  )
}

export default InfoTags