import React from 'react'
import { message } from 'antd';
export const Message = (type, msg) => {
  message.open({
    type: type,
    content: msg
  });
}

// export default Message
