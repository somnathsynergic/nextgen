import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Message } from "../../../Components/Message";
import { url } from "../../../Address/BaseUrl";
import { Spin, Tag } from "antd";
import { LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DeliveryFormComp from "../../../Components/DeliveryFormComp";

function ToCustomerForm() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formData=new FormData()
  const onSubmit = (values) => {
    console.log(values);
      setLoading(true);
      axios
        .post(url + "/api/adddelivery", {
          user: localStorage.getItem("email"),
          id: +params.id,
          items: values.items,
          in_out_flag:1,
          po_no: values.po_no,
          ot_desc:values.ot_desc||'',
          invoice:values.invoice,
          invoice_dt:values.invoice_dt,
          lr_no:values.lr_no,
          waybill:values.waybill,
          ic:values.ic?'Y':'N',
          og:values.og?'Y':'N',
          dc:values.dc?'Y':'N',
          lr:values.lr?'Y':'N',
          wb:values.wb?'Y':'N',
          pl:values.pl?'Y':'N',
          om:values.om?'Y':'N',
          ws:values.ws?'Y':'N',
          tc:values.tc?'Y':'N',
          wc:values.wc?'Y':'N',
          ot:values.ot?'Y':'N',
          om_manual:values.om_manual?'Y':'N',
          confirm:values.confirm?'Y':'N'
        })
        .then((res) => {
          console.log(res);
          formData.append("user", localStorage.getItem("email"));
          formData.append("po_no", values.po_no);
          formData.append('invoice',values.invoice)
          if (values.doc1) formData.append("docs1", values.doc1);
          axios
            .post(url + "/api/add_delivery_files", formData)
            .then((resProjFile) => {
              setLoading(false);

              if (resProjFile.data.suc > 0) {
                Message("success", res.data.msg);
                navigate(-1)
              } else {
                Message("error", res.data.msg);
              }
            })
            .catch((err) => {
              console.log(err);
              navigate("/error" + "/" + err.code + "/" + err.message);
            });
            })
            .catch((err) => {
              console.log(err);
              navigate("/error" + "/" + err.code + "/" + err.message);
            });
    // }
  };
  return (
    <Spin
      indicator={<LoadingOutlined spin />}
      size="large"
      className="text-green-900 dark:text-gray-400"
      spinning={loading}
    >
      <DeliveryFormComp
        flag={"C"}
        title={"MRN "}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      />
    </Spin>
  );
}

export default ToCustomerForm;
