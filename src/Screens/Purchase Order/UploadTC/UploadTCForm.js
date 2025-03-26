import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Message } from "../../../Components/Message";
import { url } from "../../../Address/BaseUrl";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UploadTemplate from "../../../Components/UploadTemplate";

function UploadTCForm() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  var result;
  const onSubmit = (values) => {
    console.log(values)
    if (
      values.po_no &&
      values.doc1  &&
      values.item_no &&
      values.qty && values.qty>0 &&
      values.rcv_qty && values.rcv_qty>0 &&
      values.tc_qty && values.tc_qty>0 
    ) {
      const formData = new FormData();
      setLoading(true);
      axios
        .post(url + "/api/addtc", {
          user: localStorage.getItem("email"),
          // id: +params.id,
          id: 0,
          item_id: values.item_no,
          item: values.item_no,
          tc_quantity:values.tc_qty,
          rc_quantity:values.rcv_qty,
          quantity: values.qty,
          po_no: values.po_no,
        })
        .then((res) => {
          console.log(res);

          formData.append("test_cert_no", res.data.lastID);
          formData.append("user", localStorage.getItem("email"));
          formData.append("item_id", values.item_no);
          formData.append("po_no", values.po_no);

          if (values.doc1) formData.append("docs1", values.doc1);
          // if (values.doc2) formData.append("docs2", values.doc2);

          axios
            .post(url + "/api/add_tc_files", formData)
            .then((resProjFile) => {
              setLoading(false);

              if (resProjFile.data.suc > 0) {
                Message("success", res.data.msg);
                // onClose()
                navigate(-1);
              } else {
                Message("error", res.data.msg);
              }
            })
            .catch((err) => {
              console.log(err);
              navigate("/error" + "/" + err.code + "/" + err.message);
            });
        });
    }
    console.log(result);
  };

  return (
    <Spin
      indicator={<LoadingOutlined spin />}
      size="large"
      className="text-green-900 dark:text-gray-400"
      spinning={loading}
    >
      <UploadTemplate
        flag={"T"}
        title={"Upload Test Certificate"}
        onSubmit={(values) => onSubmit(values)}
      />
    </Spin>
  );
}

export default UploadTCForm;
