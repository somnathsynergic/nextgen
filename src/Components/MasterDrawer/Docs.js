import React, { useEffect, useState } from "react";
import TDInputTemplate from "../TDInputTemplate";
import { Message } from "../Message";
import { Navigate } from "react-router-dom";
import { url } from "../../Address/BaseUrl";
import axios from "axios";
import {
  DeleteOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileWordOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import DialogBox from "../DialogBox";
import { Tooltip } from "@mui/material";

function Docs({ onClose, data ,onLoading}) {
  console.log(data);
  const [doc, setDoc] = useState();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [visible,setVisible]=useState(false)
  const [id,setId]=useState()
  useEffect(()=>{onLoading(loading)},[loading])

  useEffect(() => {
    setDoc(null);
    setLoading(true)
    console.log("hello");
    axios.post(url + "/api/getreceiptdoc", { id: data.id }).then((res) => {
      console.log(res);
      setLoading(false)
    //   file.length = 0;
      setFile([]);
      if (res?.data?.msg?.length && res?.data?.msg[0]?.doc1)
        setFile([
          { sl_no: res?.data?.msg[0]?.sl_no, doc: res?.data?.msg[0]?.doc1 },
        ]);
    });
  }, [data]);
  const uploadFile = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("user", localStorage.getItem("email"));
    formData.append("po_sl_no", data.id);

    if (doc) formData.append("docs1", doc);

    axios
      .post(url + "/api/add_vendor_receipt", formData)
      .then((resProjFile) => {
        setLoading(false);

        if (resProjFile.data.suc > 0) {
          Message("success", resProjFile.data.msg);
          onClose();
        } else {
          Message("error", resProjFile.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        Navigate("/error" + "/" + err.code + "/" + err.message);
      });
  };
  const deleteItem=()=>{
    setLoading(true)
        axios.post(url+'/api/deletevendorreceipt',{id:id,user:localStorage.getItem('email')}).then(res=>{
            setLoading(false)
            setVisible(false)
            if(res?.data?.suc>0){
                Message('success',res?.data?.msg)
                setFile([])
            }
            else{
                Message('error',res?.data?.msg)
            }
        })
  }
  return (
    <Spin
      indicator={<LoadingOutlined spin />}
      size="large"
      className="text-green-900 dark:text-gray-400"
      spinning={loading}
    >
      <div className="flex-col justify-center items-center gap-2 mx-auto">
        {/* <span className="my-2"> */}
       {file?.length==0 &&
        <>   
       
       <TDInputTemplate
            placeholder="Vendor Receipt"
            type="file"
            label="Vendor Receipt"
            name="vendor_receipt"
            accept={"application/pdf"}
            handleChange={(txt) =>
              { 
                if(txt.target.files[0].name.split('.')[1].toLowerCase()=='pdf')
                setDoc(txt.target.files[0])
                else
                Message('warning','File format not supported!')
              
              }}
            mode={1}
          />
        <button
          onClick={() => uploadFile()}
          disabled={!doc}
          className="ml-24 disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
        >
          Submit
        </button>
       </>   
}

       
        <span className="mx-auto">
          {file?.map((item, index) => (
            <>
           {/* <p className="text-xs font-bold text-green-900 mt-4">{item.doc?.split("_")[2]}  </p>  */}
              <a target="_blank" className="mx-auto mt-10" href={url + "/uploads/" + item.doc}>
                {item.doc?.split(".")[1] == "pdf" ? (
                  <FilePdfOutlined className="text-[200px] font-bold my-7 text-red-600" />
                ) : item.doc?.split(".")[1]?.includes("doc") ? (
                  <FileWordOutlined className="text-[200px] font-bold my-7 text-blue-900" />
                ) : item.doc?.split(".")[1]?.includes("xls") ||
                  item.doc?.split(".")[1]?.includes("csv") ? (
                  <FileExcelOutlined className="text-[200px] font-bold my-7 text-green-800" />
                ) : item.doc?.split(".")[1]?.includes("png") ||
                  item.doc?.split(".")[1]?.includes("jpg") ||
                  item.doc?.split(".")[1]?.includes("jpeg") ? (
                  <FileImageOutlined className="text-[200px] font-bold my-7 text-yellow-500" />
                ) : (
                  <FileTextOutlined className="text-[200px] font-bold my-7 text-gray-600" />
                )}
              </a>
              <Tooltip title="Delete">
              <DeleteOutlined
                className="text-red-800 text-lg"
                onClick={()=>{setId(item.sl_no);setVisible(4)}}
              />
              </Tooltip>
            </>
          ))}
        </span>
      </div>
      <DialogBox
        visible={visible}
        flag={4}
        id={id}
        onPress={() => setVisible(false)}
        onDelete={() => deleteItem()}
      />
    </Spin>
  );
}

export default Docs;
