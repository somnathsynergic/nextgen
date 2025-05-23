import React, { useEffect, useState } from "react";
import IMG from "../../Assets/Images/Logo.png";
import Divider from "@mui/material/Divider";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useRef } from "react";
import { PrinterOutlined } from "@ant-design/icons";
import Fab from "@mui/material/Fab";
import axios from "axios";
import { url } from "../../Address/BaseUrl";
import { useReactToPrint } from "react-to-print";
import { use } from "react";
import moment from "moment";
import { formatDate } from "../../Functions/formatDate";
function PoPreview({ data }) {
  var tot = 0;
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [isPrinting, setIsPrinting] = useState(true);
  //  const reactToPrintFn = useReactToPrint({  content: () => contentRef.current,
  //     copyStyles: true, });
  const [loading, setLoading] = useState(false);
  const [v_name, setVName] = useState("");
  const [v_address, setVAddress] = useState("");
  const [v_email, setVEmail] = useState("");
  const [v_phone, setVPhone] = useState("");
  const [v_gst, setVGST] = useState("");
  const [v_pan, setVPAN] = useState("");
  const [prodInfo, setProdInfo] = useState();
  const [grandTot, setGrandTot] = useState(0);
  const [po_no, setPoNo] = useState("");
  const [subTot, setSubTot] = useState("");
  const [totVal, setTotVal] = useState(0);
  const [vpoc, setvpoc] = useState([]);
  const [grandTotUnit, setGrandTotUnit] = useState("");
  const [parent_po_dt, setParentPoDt] = useState("");
  const [first, ...rest] = localStorage.getItem("ship_to")?.split(",");
  useEffect(() => {
    axios
      .post(url + "/api/getvendor", {
        id: +localStorage.getItem("vendor_name"),
      })
      .then((res) => {
        setLoading(true);
        console.log(res);
        setVName(res?.data?.msg?.vendor_name);
        setVAddress(res?.data?.msg?.vendor_address);
        setVEmail(res?.data?.msg?.vendor_email);
        setVPhone(res?.data?.msg?.vendor_phone);
        setVGST(res?.data?.msg?.vendor_gst);
        setVPAN(res?.data?.msg?.vendor_pan);
        axios
          .post(url + "/api/getvendorpoc", {
            id: +localStorage.getItem("vendor_name"),
          })
          .then((resPoc) => {
            setvpoc(resPoc?.data?.msg);
            axios
              .post(url + "/api/getpreviewitems", {
                id: +localStorage.getItem("id"),
              })
              .then((resItems) => {
                console.log(resItems);
                tot = 0;
                setProdInfo(resItems?.data?.msg);
                setGrandTotUnit(resItems?.data?.msg[0]?.currency);
                console.log(prodInfo);
                for (let item of resItems?.data?.msg) {
                  if (item.sgst_id) {
                    tot +=
                      ((item.item_rt - item.discount) *
                        item.quantity *
                        item.cgst_id) /
                        100 +
                      (item.item_rt - item.discount) *
                        item.quantity *
                        (item.sgst_id / 100) +
                      (item.item_rt - item.discount) * item.quantity;
                  } else {
                    tot +=
                      ((item.item_rt - item.discount) *
                        item.quantity *
                        item.igst_id) /
                        100 +
                      (item.item_rt - item.discount) * item.quantity;
                  }
                }
                console.log(tot);

                setGrandTot(tot.toFixed(2));
                tot = 0;
                for (let item of resItems?.data?.msg) {
                  tot += (item.item_rt - item.discount) * item.quantity;
                }
                setSubTot(tot);
                tot = 0;

                // "prod_name": "Prod_2",
                // "prod_make": "Make_2",
                // "catg_name": "Misc",
                // "part_no": "Part_2",
                // "model_no": "Model_2",
                // "article_no": "Ar_2",
                // "hsn_code": "444445",
                // "prod_desc": "Desc",
                // "quantity": 10,
                // "item_rt": 7.0,
                // "discount": 4.0,
                // "unit_name": "Gm"

                // setLoading(true)
                // console.log(res)
                // setVName(res?.data?.msg?.vendor_name)
                // setVAddress(res?.data?.msg?.vendor_address)
                // setVEmail(res?.data?.msg?.vendor_email)
                // setVPhone(res?.data?.msg?.vendor_phone)
                // setVGST(res?.data?.msg?.vendor_gst)
                // setVPAN(res?.data?.msg?.vendor_pan)
                // setLoading(false)
                axios
                  .post(url + "/api/getpo", { id: localStorage.getItem("id") })
                  .then((res) => {
                    console.log(res);
                    setPoNo(res?.data?.msg?.po_no);
                    axios
                      .post(url + "/api/get_parent_po_date", {
                        po_no: res?.data?.msg?.po_no || "",
                      })
                      .then((resParent) => {
                        console.log(resParent);
                        setParentPoDt(resParent?.data?.msg[0]?.po_issue_date);
                        setLoading(false);
                      });
                  });
              });
          });
      });
  }, []);

  //   const numberToWords = (num) => {
  //     const a = [
  //       '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  //       'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  //       'Seventeen', 'Eighteen', 'Nineteen'
  //     ];
  //     const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  //     const inWords = (n) => {
  //       if (n < 20) return a[n];
  //       if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
  //       if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + inWords(n % 100) : '');
  //       if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + inWords(n % 1000) : '');
  //       if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + inWords(n % 100000) : '');
  //       return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + inWords(n % 10000000) : '');
  //     };

  //     return num == 0 ? 'Zero' : inWords(Number(num));
  //   };

  const numberToWords = (num) => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const inWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100)
        return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000)
        return (
          a[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " " + inWords(n % 100) : "")
        );
      if (n < 100000)
        return (
          inWords(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + inWords(n % 1000) : "")
        );
      if (n < 10000000)
        return (
          inWords(Math.floor(n / 100000)) +
          " Lakh" +
          (n % 100000 ? " " + inWords(n % 100000) : "")
        );
      return (
        inWords(Math.floor(n / 10000000)) +
        " Crore" +
        (n % 10000000 ? " " + inWords(n % 10000000) : "")
      );
    };

    const [intPart, decimalPart] = num.toString().split(".");

    let words = +intPart === 0 ? "Zero" : inWords(Number(intPart));
    // words = words+ grandTotUnit=='INR'?' Rupees':grandTotUnit=='USD'?' Dollars':' Euros'
    const decimalNumber = Number(decimalPart);
    if (decimalPart && +decimalPart > 0) {
      const decimalNum = parseInt(decimalPart.padEnd(2, "0").slice(0, 2)); // Treat as 2-digit number
      //   words += ' And ' + inWords(decimalNum)
    }
    const curr =
      grandTotUnit == "I"
        ? " Paise"
        : grandTotUnit == "U"
        ? " Cents"
        : " Cents";
    const paiseWords =
      decimalNumber > 0 ? ` And ${inWords(decimalNumber)} ${curr} ` : "";
    return (
      words +
      (grandTotUnit == "I"
        ? " Rupees "
        : grandTotUnit == "U"
        ? " Dollars "
        : " Euros ") +
      paiseWords
    );
  };
  //   if (typeof num === 'string') num = parseFloat(num);
  //   if (isNaN(num)) return '';

  //   const [rupees, paise] = num.toFixed(2).split('.');

  //   let result = '';
  //   if (parseInt(rupees) > 0) result += getWords(parseInt(rupees)) + ' Rupees';
  //   if (parseInt(paise) > 0) result += (result ? ' and ' : '') + getWords(parseInt(paise)) + ' Paise';
  //   if (!result) result = 'Zero Rupees';

  //   return result + ' Only';
  // }
  const formatNumber = (amount, currency) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  function print() {
    var divToPrint = document.getElementById("divtoprint");

    var WindowObject = window.open("", "Print-Window");
    WindowObject.document.open();
    WindowObject.document.writeln("<!DOCTYPE html>");
    WindowObject.document.writeln("<html><head><title></title>");
    WindowObject.document.writeln('<style type="text/css">');
    // WindowObject.document.writeln('<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">')
    WindowObject.document.writeln(
      '<link rel="preconnect" href="https://fonts.googleapis.com">'
    );
    WindowObject.document.writeln(
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    );
    WindowObject.document.writeln(
      '<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">'
    );
    WindowObject.document.writeln(
      '@media print {body {-webkit-print-color-adjust: exact;    print-color-adjust: exact; overflow: hidden;}  {font-family: "Lora", serif;font-optical-sizing: auto font-weight: <weight>;font-style: normal;}} </style>'
    );
    // WindowObject.document.writeln('@media print { .center { text-align: center;}' +
    //     '                                         .inline { display: inline; }' +
    //     '                                         .underline { text-decoration: underline; }' +
    //     '                                         .left { margin-left: 315px;} ' +
    //     '                                         .right { margin-right: 375px; display: inline; }' +
    //     '                                          table { border-collapse: collapse; font-size: 10px;}' +
    //     '                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}' +
    //     '                                           th, td { }' +
    //     '                                         .border { border: 1px solid black; } ' +
    //     '                                         .bottom { bottom: 5px; width: 100%; position: fixed ' +
    //     '                                       ' +
    //     '                                   } .p-paginator-bottom.p-paginator.p-component { display: none; } .heading{display: flex; flex-direction: column; justify-content: center; align-items: center;font-weight:800;margin-bottom:15px} } </style>');
    // WindowObject.document.writeln('@media print{body {font-family: "Lora", serif;font-optical-sizing: auto font-weight: <weight>;font-style: normal;}}')
    WindowObject.document.writeln(
      '<script src="https://cdn.tailwindcss.com"></scr' + "ipt>"
    );

    // WindowObject.document.writeln('</head><body onload="window.print()">');
    WindowObject.document.writeln(
      '</head><body onload="setTimeout(() => window.print(), 100)">'
    );
    WindowObject.document.writeln(divToPrint.innerHTML);
    WindowObject.document.writeln("</body></html>");
    WindowObject.document.close();
    // setTimeout(function () {
    //     WindowObject.close();
    // }, 10);
  }
  return (
    // <div className="h-full border-2 p-3 border-blue-300">
    <>
      <div className="flex gap-5 justify-end sticky top-0 z-10">
        {localStorage.getItem("po_status") != "P" && (
          //  <Fab color="success" size="small" aria-label="add" onClick={()=>print()}>
          <Fab
            color="success"
            size="small"
            aria-label="add"
            onClick={() => {
              setIsPrinting(false);
              setTimeout(() => {
                reactToPrintFn();
                setIsPrinting(true);
              }, 5);
            }}
          >
            <PrinterOutlined />
          </Fab>
        )}
      </div>
      <div
        ref={contentRef}
        style={{ fontFamily: '"Lora", sans-serif' }}
        className="px-3 py-2"
      >
        <style>
          {`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap');
      `}
        </style>
        <div className="h-full border p-3 border-green-500 rounded-md">
          <Spin
            indicator={<LoadingOutlined spin />}
            size="large"
            className="text-green-700 dark:text-gray-400"
            spinning={loading}
          >
            <div id="divtoprint">
              <div className="flex flex-col justify-center items-center">
                {/* <span className="text-xl text-blue-500 font-extrabold  my-3 "> */}
                <div className="text-xl text-green-500 font-extrabold mb-2 ">
                  Purchase Order
                </div>
                {localStorage.getItem("po_status") == "U" && (
                  <div className="text-xs block text-red-500 font-extrabold mb-2 ">
                    Draft Copy
                  </div>
                )}
              </div>
              <div className="grid grid-cols-12 items-center px-3 w-full">
                <div className="col-span-6 flex flex-col text-xs gap-2  text-gray-800 ">
                  <div className="text-gray-800 font-bold">
                    <span className=" font-bold text-green-700">PO No.: </span>{" "}
                    {po_no ? po_no : ""}
                  </div>
                  <div className="text-gray-800 font-bold">
                    <span className=" font-bold text-green-700">PO Date:</span>{" "}
                    {formatDate(localStorage.getItem("po_issue_date"),
                      "DD/MM/yyyy"
                    )}
                  </div>
                  {po_no?.split("-").length > 2 && parent_po_dt && (
                    <div className="text-gray-800 font-bold">
                      <span className=" font-bold text-green-700">
                        Amendement No.:{" "}
                      </span>
                      {po_no?.split("-")[2]}{" "}
                    </div>
                  )}
                  {po_no?.split("-").length > 2 && parent_po_dt && (
                    <div className="text-gray-800 font-bold">
                      <span className=" font-bold text-green-700">
                        Parent PO:{" "}
                      </span>{" "}
                      {po_no?.split("-")[0]}-{po_no?.split("-")[1]} (Date:{" "}
                      {formatDate(parent_po_dt)})
                    </div>
                  )}
                  {/* <div  className="text-gray-800 font-bold"><span className=" font-bold text-green-700">Value:</span>  {grandTot}</div> */}
                </div>
                <div className="col-span-6 flex flex-col text-xs gap-2  text-gray-800 items-end justify-end">
                  <img src={IMG} className="sm:h-16 h-12" alt="Flowbite Logo" />
                  <span className="my-5 mx-3 mb-5 text-xs">
                    <p>NextGen Automation Pvt Ltd,</p>
                    <p>Unit - 102, 1st Floor, PS PACE 1/1A,</p>{" "}
                    <p> Mahendra Roy Lane Kolkata 700046 </p>
                    <p> Ph-033 4068 6032/6450 0535</p>
                    <p>Email:info@ngapl.com</p>
                    {/* <p>/susanta.karanjai@ngapl.com</p> */}
                    <p>GSTIN: 19AABCN5744L1Z1</p>
                  </span>
                </div>
              </div>
              <Divider />

              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <div className="my-2 w-full py-1 px-3 text-gray-50 font-semibold border border-green-500 bg-green-500 ">
                    Vendor Details
                  </div>
                  <div className="flex flex-col text-xs gap-1 text-gray-800 px-3 text-xs">
                    <div className="text-bold">
                      {" "}
                      <span className=" font-bold text-green-700">Name: </span>
                      {v_name}
                    </div>
                    <div className="text-bold">
                      {" "}
                      <span className=" font-bold text-green-700">
                        {" "}
                        Address:
                      </span>{" "}
                      {v_address}
                    </div>
                    <div className="text-bold">
                      {" "}
                      <span className=" font-bold text-green-700">
                        {" "}
                        Email:{" "}
                      </span>{" "}
                      {v_email}
                    </div>
                    <div className="text-bold">
                      {" "}
                      <span className=" font-bold text-green-700">Phone: </span>
                      {v_phone}
                    </div>
                    <div className="text-bold">
                      {" "}
                      <span className=" font-bold text-green-700">
                        GST:
                      </span>{" "}
                      {v_gst}
                    </div>
                    <div className="text-bold">
                      {" "}
                      <span className=" font-bold text-green-700">
                        {" "}
                        PAN:{" "}
                      </span>{" "}
                      {v_pan}
                    </div>
                    <div className="text-bold">
                      {" "}
                      <span className=" font-bold text-green-700">
                        {" "}
                        Reference:
                      </span>{" "}
                      {localStorage.getItem("vend_ref")}
                    </div>
                    <div className="text-bold">
                      {" "}
                      <span className=" font-bold text-xs text-green-700">
                        {" "}
                        Vendor Contact Person(s):
                      </span>{" "}
                      <ul>
                        {" "}
                        {vpoc?.map((item) => (
                          <li>
                            {item?.poc_name},{item?.poc_email}, {item?.poc_ph_1}
                            {item?.poc_ph_2 ? "/" + item?.poc_ph_2 : ""}{" "}
                          </li>
                        ))}{" "}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <Divider />

              <div className="grid grid-cols-2 gap-2 my-2">
                {/* <div className="col-span-1 border-2 border-blue-300  px-2 py-1"> */}
                <div className="col-span-1 border border-gray-300">
                  <div className="w-full px-3 py-1 mb-1  text-gray-50 font-semibold bg-green-500  border border-green-500 ">
                    Bill To
                  </div>
                  <p className="text-xs px-3 py-1 mt-1">
                    {" "}
                    NextGen Automation Pvt Ltd
                  </p>
                  <p className="text-xs px-3 py-1 mt-1">
                    {" "}
                    Unit - 102, 1st Floor, PS PACE 1/1A, Mahendra Roy Lane
                    Kolkata 700046,GSTIN- 19AABCN5744L1Z1
                  </p>{" "}
                  <p className="text-xs  px-3 py-1">
                    {" "}
                    Ph-033 4068 6032/6450 0535
                  </p>{" "}
                  <p className="text-xs  px-3 py-1"> Email: info@ngapl.com</p>
                </div>
                {/* <div className="col-span-1 border-2 border-blue-300  p-2"> */}
                <div className="col-span-1 border border-gray-300  ">
                  {/* <div className="w-full p-2 text-gray-800 font-semibold  border-2 border-blue-400 bg-blue-400 "> */}
                  <div className="w-full px-3 py-1 mb-1  text-gray-50 font-semibold bg-green-500  border border-green-500 ">
                    Ship To
                  </div>
                  <p className="text-xs py-1 px-3"> {first.trim()} </p>
                  <p className="text-xs -mt-1 p-3"> {rest.join(",").trim()} </p>
                </div>
              </div>
              <Divider />

              {/* <p className="mb-5"> */}
              {/* <div className="my-2 w-full p-2 text-gray-800 font-semibold  border-2 border-blue-400 bg-blue-400 "> */}
              <div className="mt-2 w-full px-3 py-1 text-gray-50 font-semibold  border border-green-500 bg-green-500">
                Item Description
              </div>

              <div className="relative overflow-x-auto ">
                <table className="w-full table-fixed border-collapse border border-gray-300 text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400 ">
                  <colgroup>
                    {/* "Sl. No." column: fixed narrow width */}
                    <col style={{ width: "40px" }} />
                    {/* "Item-Description": no fixed width so it uses the remaining space; force wrapping */}
                    <col style={{ width: "auto" }} />
                    {/* The other eight columns: assign each fixed width */}
                    <col style={{ width: "60px" }} />
                    <col style={{ width: "60px" }} />
                    <col style={{ width: "60px" }} />
                    <col style={{ width: "60px" }} />
                    <col style={{ width: "60px" }} />
                    <col style={{ width: "60px" }} />
                    <col style={{ width: "60px" }} />
                    <col style={{ width: "60px" }} />
                  </colgroup>

                  {/* <thead  className="text-xs text-nowrap font-bold text-blue-500 captalize bg-white dark:bg-gray-700 dark:text-gray-400"> */}
                  <thead className="text-xs text-nowrap font-bold text-green-500 captalize bg-white dark:bg-gray-700 dark:text-gray-400 ">
                    <tr>
                      <th
                        scope="col"
                        className="px-1 py-2  text-center border border-gray-300"
                      >
                        Sl. No.
                      </th>
                      <th
                        scope="col"
                        className="px-1 py-2 text-center border border-gray-300"
                      >
                        Item-Description
                      </th>
                      <th
                        scope="col"
                        className="px-1 py-2 text-center border border-gray-300"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-1 py-2 text-center border border-gray-300"
                      >
                        Rate
                      </th>
                      <th
                        scope="col"
                        className="px-1 py-2 text-center border border-gray-300"
                      >
                        Discount
                      </th>
                      <th
                        scope="col"
                        className="px-1 py-2 text-xs text-wrap text-center border border-gray-300"
                      >
                        Net Unit Price
                      </th>
                      <th
                        scope="col"
                        className="px-1 py-2 text-center border border-gray-300"
                      >
                        CGST
                      </th>
                      <th
                        scope="col"
                        className="px-1 py-2 text-center border border-gray-300"
                      >
                        SGST
                      </th>
                      <th
                        scope="col"
                        className="px-1 py-2 text-center border border-gray-300"
                      >
                        IGST
                      </th>
                      {/* <th scope="col" className="px-1 py-2 text-center border border-gray-300">
                   Total GST
                </th> */}

                      <th
                        scope="col"
                        className="px-1 py-2 text-center border border-gray-300"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {prodInfo?.length > 0 &&
                      prodInfo?.map((item, index) => (
                        <>
                          {/* <tr class="print-page-break-buffer hidden print:table-row">
    <td colspan="100" class="h-6"></td>
    
  </tr> */}

                          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 break-inside-avoid print:break-inside-avoid print:mt-2">
                            <td
                              className="px-1 py-1  text-[9px]  text-center border border-gray-300"
                              rowSpan={2}
                            >
                              {index + 1}
                            </td>
                            <td className="  py-1 px-1 text-xs whitespace-normal break-words text-green-700 font-bold flex flex-col gap-1 text-wrap text-sm text-gray-900 whitespace-nowrap dark:text-white">
                              {item.prod_name}
                            </td>
                            <td
                              className="  py-1 px-1 text-[8px]  text-center border  text-nowrap border-gray-300"
                              rowSpan={2}
                            >
                              {item.quantity} ({item.unit_name})
                            </td>
                            <td
                              className="  py-1 px-1 text-[8px] text-right border border-gray-300"
                              rowSpan={2}
                            >
                              {parseFloat(item.item_rt).toFixed(2)}
                            </td>
                            <td
                              className=" py-1 px-1 text-[8px] text-right border border-gray-300"
                              rowSpan={2}
                            >
                              {item.discount} <br />{" "}
                              {item.discount
                                ? "(" +
                                  parseFloat(item.discount_percent)?.toFixed(
                                    2
                                  ) +
                                  "%)"
                                : ""}
                            </td>
                            <td
                              className=" py-1 px-1 text-[8px] text-right border text-wrap border-gray-300"
                              rowSpan={2}
                            >
                              {/* {parseFloat(+item.item_rt-(+item.discount))?.toFixed(2)} */}
                              {formatNumber(
                                (+item.item_rt - +item.discount)*item.quantity,
                                item?.currency == "I"
                                  ? "INR"
                                  : item?.currency == "U"
                                  ? "USD"
                                  : "EUR"
                              )}
                            </td>
                            <td
                              className=" py-1 px-1 text-[8px] text-right border text-wrap border-gray-300"
                              rowSpan={2}
                            >
                              {item.cgst_id > 0
                                ? formatNumber(
                                    (+item.item_rt - +item.discount) *
                                      +item.quantity *
                                      (+item.cgst_id / 100),
                                    item?.currency == "I"
                                      ? "INR"
                                      : item?.currency == "U"
                                      ? "USD"
                                      : "EUR"
                                  )
                                : 0}
                              <br />
                              {/* {+item.cgst_id>0?item?.currency=='I'?'(₹)':item?.currency=='U'?'($)':'(€)':''} */}
                              {item.cgst_id > 0
                                ? "(" + item.cgst_id?.toFixed(2) + "%)"
                                : ""}
                            </td>
                            <td
                              className=" py-1 px-1 text-[8px] text-right border text-wrap border-gray-300"
                              rowSpan={2}
                            >
                              {item.sgst_id > 0
                                ? formatNumber(
                                    (+item.item_rt - +item.discount) *
                                      +item.quantity *
                                      (+item.sgst_id / 100),
                                    item?.currency == "I"
                                      ? "INR"
                                      : item?.currency == "U"
                                      ? "USD"
                                      : "EUR"
                                  )
                                : 0}
                              <br />

                              {item.sgst_id > 0
                                ? "(" + item.sgst_id?.toFixed(2) + "%)"
                                : ""}
                            </td>
                            <td
                              className=" py-1 px-1  text-[8px] text-right text-wrap break-words whitespace-normal border border-gray-300"
                              rowSpan={2}
                            >
                              {+item.igst_id > 0
                                ? formatNumber(
                                    (+item.item_rt - +item.discount) *
                                      +item.quantity *
                                      (+item.igst_id / 100),
                                    item?.currency == "I"
                                      ? "INR"
                                      : item?.currency == "U"
                                      ? "USD"
                                      : "EUR"
                                  )
                                : 0}
                              {/* {+item.igst_id>0?item.currency=='I'?'(₹)':item.currency=='U'?'($)':'(€)':''}  */}
                              <br />

                              {item.igst_id > 0
                                ? "(" + item.igst_id?.toFixed(2) + "%)"
                                : ""}
                            </td>

                            <td
                              className=" py-1 px-1  text-[7px] text-right border border-gray-300"
                              rowSpan={2}
                            >
                              {item.sgst_id > 0
                                ? formatNumber(
                                    (+item.item_rt - +item.discount) *
                                      +item.quantity *
                                      (+item.cgst_id / 100) +
                                      (+item.item_rt - +item.discount) *
                                        +item.quantity *
                                        (+item.sgst_id / 100) +
                                      (item.item_rt - item.discount) *
                                        item.quantity,
                                    item?.currency == "I"
                                      ? "INR"
                                      : item?.currency == "U"
                                      ? "USD"
                                      : "EUR"
                                  )
                                : // formatNumber(((+item.item_rt-(+item.discount))*(+item.quantity)*(+item.igst_id/100)),item?.currency=='I'?'INR':item?.currency=='U'?'USD':'EUR')}
                                  formatNumber(
                                    (+item.item_rt - +item.discount) *
                                      +item.quantity *
                                      (+item.igst_id / 100) +
                                      (item.item_rt - item.discount) *
                                        item.quantity,
                                    item?.currency == "I"
                                      ? "INR"
                                      : item?.currency == "U"
                                      ? "USD"
                                      : "EUR"
                                  )}

                              {/* {item.currency=='I'?'(₹)':item.currency=='U'?'($)':'(€)'} */}
                            </td>
                          </tr>
                          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 break-inside-avoid print:break-inside-avoid print:mt-2">
                            <td className="px-1 text-[9px]">
                              {item.prod_make && (
                                <>
                                  <span className="font-bold text-green-700">
                                    Make:
                                  </span>{" "}
                                  {item.prod_make},{" "}
                                </>
                              )}
                              {item.catg_name && (
                                <>
                                  <span className="font-bold text-green-700">
                                    Category:
                                  </span>{" "}
                                  {item.catg_name},{" "}
                                </>
                              )}
                              {/* {item.unit_name &&   <> <span className="font-bold text-green-700">UOM:</span> {item.unit_name},</> } */}
                              {item.part_no && (
                                <>
                                  {" "}
                                  <span className="font-bold text-green-700">
                                    Part No./Type No.:
                                  </span>{" "}
                                  {item.part_no},{" "}
                                </>
                              )}
                              {item.model_no && (
                                <>
                                  <span className="font-bold text-green-700">
                                    Model No.:
                                  </span>{" "}
                                  {item.model_no},{" "}
                                </>
                              )}
                              {item.article_no && (
                                <>
                                  {" "}
                                  <span className="font-bold text-green-700">
                                    Article No.:
                                  </span>{" "}
                                  {item.article_no},
                                </>
                              )}
                              {item.hsn_code && (
                                <>
                                  <span className="font-bold text-green-700">
                                    HSN:
                                  </span>{" "}
                                  {item.hsn_code},{" "}
                                </>
                              )}
                              {item.prod_desc && (
                                <>
                                  <span className="font-bold text-green-700">
                                    Desc:
                                  </span>{" "}
                                  {item.prod_desc},{" "}
                                </>
                              )}
                              <>
                                <span className="font-bold text-green-700">
                                  Delivery from:
                                </span>{" "}
                                {formatDate(item.delivery_dt)}{" "}
                                <span className="font-bold text-green-700">
                                  to{" "}
                                </span>{" "}
                                {formatDate(item.delivery_to)}{" "}
                              </>
                            </td>
                          </tr>
                        </>
                      ))}
                  </tbody>
                  {/* <tfoot> */}
                  <tr class="font-semibold border-2 border-b-gray-200 text-gray-900 dark:text-white py-3">
                  
                    <th
                      scope="row"
                      class="px-2 py-1  text-end pb-3 text-[10px] text-green-700 font-bold"
                      colspan={10}
                    >
                      Total Basic Value: {formatNumber(
                        prodInfo?.map((item) => {
                            const rate = parseFloat(item.item_rt) || 0;
                            const discount = parseFloat(item.discount) || 0;
                            const quantity = parseFloat(item.quantity) || 0;
                            return quantity * (rate - discount);
                          })
                          .reduce((acc, curr) => acc + curr, 0),
                        grandTotUnit == "I"
                          ? "INR"
                          : grandTotUnit == "U"
                          ? "USD"
                          : "EUR"
                      )}
                     &nbsp; &nbsp; Total Discount: {formatNumber(
                        prodInfo
                          ?.map((item) => item.discount * item.quantity)
                          .reduce((acc, curr) => acc + curr, 0),
                        grandTotUnit == "I"
                          ? "INR"
                          : grandTotUnit == "U"
                          ? "USD"
                          : "EUR"
                      )}
                   
                   
                     {/* Total Basic Value: {formatNumber(
                        prodInfo?.map((item) => {
                            const rate = parseFloat(item.item_rt) || 0;
                            const discount = parseFloat(item.discount) || 0;
                            const quantity = parseFloat(item.quantity) || 0;
                            return quantity * (rate - discount);
                          })
                          .reduce((acc, curr) => acc + curr, 0),
                        grandTotUnit == "I"
                          ? "INR"
                          : grandTotUnit == "U"
                          ? "USD"
                          : "EUR"
                      )} */}
                   </th>
                    {/* <th
                      class=" pb-3 py-1 px-1 text-[10px] flaot-end font-bold text-wrap text-green-700 break-words whitespace-normal"
                      colspan={1}
                    >
                      {formatNumber(
                        grandTot,
                        grandTotUnit == "I"
                          ? "INR"
                          : grandTotUnit == "U"
                          ? "USD"
                          : "EUR"
                      )}{" "}
                     
                    </th> */}
                  </tr>
                  <tr class="font-semibold text-gray-900 dark:text-white py-3">
                    <th
                      scope="row"
                      class="px-10 py-1  pb-3 text-[10px] text-green-700 font-bold"
                      colspan={9}
                    >
                      Grand Total : ({numberToWords(grandTot)}
                      Only)
                    </th>
                    <th
                      // class=" pb-3 py-1 px-1 text-[10px] flaot-end font-bold text-wrap text-green-700 break-words whitespace-normal"
                      class=" pb-3 py-1 px-2 text-[10px] float-end font-bold text-nowrap text-green-700 break-words whitespace-normal"
                      colspan={1}
                    >
                      {formatNumber(
                        grandTot,
                        grandTotUnit == "I"
                          ? "INR"
                          : grandTotUnit == "U"
                          ? "USD"
                          : "EUR"
                      )}{" "}
                      {/* ({numberToWords(grandTot)}
                      Only) */}
                      {/* {grandTotUnit=='I'?'Rupees':grandTotUnit=='U'?'Dollars':'Euros'}  */}
                      {/* item?.currency=='I'?'₹':item?.currency=='U'?'$':'€':'' */}
                      {/* ({grandTotUnit=='I'?'₹':grandTotUnit=='U'?'$':'€'}) */}
                    </th>
                  </tr>
                  {/* </tfoot> */}
                </table>
              </div>

              <div className="print:[break-before:page] print:mt-5">
                {JSON.parse(localStorage.getItem("termList"))?.length > 0 && (
                  <>
                    {/* <p className="mb-5"> */}
                    <Divider className="mt-2" />
                    <div>
                      <div className="mt-2 w-full px-3 py-1 text-gray-50 font-semibold  border border-green-500 bg-green-500 ">
                        Payment Terms
                      </div>
                      <ul className=" space-y-1 text-gray-700 p-2 list-disc  list-inside dark:text-gray-400">
                        {JSON.parse(localStorage.getItem("termList"))?.length >
                          0 &&
                          JSON.parse(localStorage.getItem("termList"))?.map(
                            (item) => <li className="text-xs">{item.term}</li>
                          )}
                      </ul>
                    </div>
                  </>
                )}
                {/* </p> */}
                <Divider />

                <div className="mt-3 w-full px-3 py-1 text-gray-50 font-semibold  border-green-500 bg-green-500 ">
                  Terms & Conditions
                </div>

                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-gray-300 text-left rtl:text-right text-gray-700 dark:text-gray-400">
                    <tbody>
                      <tr className="bg-white border-b text-nowrap dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-1 w-1/4 py-1 text-xs border border-gray-300 text-green-700 font-bold whitespace-nowrap dark:text-white"
                        >
                          Price Basis
                        </th>
                        <td className="px-1 w-3/4 py-1 text-xs border border-gray-300">
                          {JSON.parse(localStorage.getItem("terms"))
                            .price_basis_flag == "F"
                            ? "FOR"
                            : "Ex-Works"}{" "}
                          {JSON.parse(localStorage.getItem("terms"))
                            .price_basis_desc
                            ? JSON.parse(localStorage.getItem("terms"))
                                .price_basis_desc + ","
                            : ""}
                        </td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-1 py-1 text-xs border border-gray-300 font-bold text-green-700 whitespace-nowrap dark:text-white"
                        >
                          Packing & Forwarding
                        </th>
                        <td className="px-1 py-1 text-xs border border-gray-300">
                          {JSON.parse(localStorage.getItem("terms"))
                            .packing_forwarding_val == "I"
                            ? "Inclusive"
                            : `Extra  ${
                                JSON.parse(localStorage.getItem("terms"))
                                  .packing_forwarding_extra
                              }% - ${(
                                // (subTot *
                                //   // (grandTot *
                                //   JSON.parse(localStorage.getItem("terms"))
                                //     .packing_forwarding_extra) /
                                // 100
                                parseFloat(JSON.parse(localStorage.getItem("terms"))
                                .packing_forwarding_extra_val)
                              )?.toFixed(2)}  (CGST-${(
                                (JSON.parse(localStorage.getItem("terms"))
                                  .pf_cgst *
                                  JSON.parse(localStorage.getItem("terms"))
                                    .packing_forwarding_extra_val) /
                                100
                              ).toFixed(2)} SGST-${(
                                (JSON.parse(localStorage.getItem("terms"))
                                  .pf_sgst *
                                  JSON.parse(localStorage.getItem("terms"))
                                    .packing_forwarding_extra_val) /
                                100
                              ).toFixed(2)} IGST-${(
                                (JSON.parse(localStorage.getItem("terms"))
                                  .pf_igst *
                                  JSON.parse(localStorage.getItem("terms"))
                                    .packing_forwarding_extra_val) /
                                100
                              ).toFixed(2)}) `}
                        </td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-1 py-1 text-xs border border-gray-300 font-bold text-green-700 whitespace-nowrap dark:text-white"
                        >
                          Freight
                        </th>
                        <td className="px-1 py-1 text-xs border border-gray-300">
                          {JSON.parse(localStorage.getItem("terms"))
                            .freight_insurance == "I"
                            ? "Inclusive"
                            : `Extra ${
                                JSON.parse(localStorage.getItem("terms"))
                                  .freight_insurance_val
                              }, ${
                                JSON.parse(localStorage.getItem("terms"))
                                  .freight_extra
                              }% - ${(
                                // (subTot *
                                //   // (grandTot *
                                //   JSON.parse(localStorage.getItem("terms"))
                                //     .freight_extra) /
                               
                                // 100
                                parseFloat(JSON.parse(localStorage.getItem("terms"))
                                .freight_extra_val)
                              )?.toFixed(2)} (CGST-${(
                                (JSON.parse(localStorage.getItem("terms"))
                                  .freight_cgst *
                                  JSON.parse(localStorage.getItem("terms"))
                                    .freight_extra_val) /
                                100
                              ).toFixed(2)} SGST-${(
                                (JSON.parse(localStorage.getItem("terms"))
                                  .freight_sgst *
                                  JSON.parse(localStorage.getItem("terms"))
                                    .freight_extra_val) /
                                100
                              ).toFixed(2)} IGST-${(
                                (JSON.parse(localStorage.getItem("terms"))
                                  .freight_igst *
                                  JSON.parse(localStorage.getItem("terms"))
                                    .freight_extra_val) /
                                100
                              ).toFixed(2)})`}
                        </td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-1 py-1 text-xs border border-gray-300 font-bold text-green-700 whitespace-nowrap dark:text-white"
                        >
                          Insurance
                        </th>
                        {JSON.parse(localStorage.getItem("terms")).ins_extra >
                          0 && (
                          <td className="px-1 py-1 text-xs border border-gray-300">
                            {JSON.parse(localStorage.getItem("terms"))
                              .insurance == "Y"
                              ? JSON.parse(localStorage.getItem("terms"))
                                  .insurance_val +
                                ` ${
                                  JSON.parse(localStorage.getItem("terms"))
                                    .ins_extra
                                }% - ${(
                                  // (subTot *
                                  //   // (grandTot *
                                  //   JSON.parse(localStorage.getItem("terms"))
                                  //     .ins_extra) /
                                  parseFloat(JSON.parse(localStorage.getItem("terms"))
                                      .ins_extra_val)
                                  // 100
                                )?.toFixed(2)}  (CGST-${(
                                  (JSON.parse(localStorage.getItem("terms"))
                                    .ins_cgst *
                                    JSON.parse(localStorage.getItem("terms"))
                                      .ins_extra_val) /
                                  100
                                ).toFixed(2)} SGST-${(
                                  (JSON.parse(localStorage.getItem("terms"))
                                    .ins_sgst *
                                    JSON.parse(localStorage.getItem("terms"))
                                      .ins_extra_val) /
                                  100
                                ).toFixed(2)} IGST-${(
                                  (JSON.parse(localStorage.getItem("terms"))
                                    .ins_igst *
                                    JSON.parse(localStorage.getItem("terms"))
                                      .ins_extra_val) /
                                  100
                                ).toFixed(2)})`
                              : "N/A"}
                          </td>
                        )}
                        {JSON.parse(localStorage.getItem("terms")).ins_extra ==
                          0 && (
                          <td className="px-1 py-1 text-xs border border-gray-300">
                            {JSON.parse(localStorage.getItem("terms"))
                              .insurance == "Y"
                              ? JSON.parse(localStorage.getItem("terms"))
                                  .insurance_val
                              : "N/A"}
                          </td>
                        )}
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-1 py-1 text-xs border border-gray-300 font-bold text-green-700 whitespace-nowrap dark:text-white"
                        >
                          Test Certificate
                        </th>
                        <td className="px-1 py-1 text-xs border border-gray-300">
                          {JSON.parse(localStorage.getItem("terms"))
                            .test_certificate == "Y"
                            ? "Yes, " +
                              JSON.parse(localStorage.getItem("terms"))
                                .test_certificate_desc
                            : "N/A"}
                        </td>
                      </tr>

                      {(JSON.parse(localStorage.getItem("terms")).duration_val >
                        0 ||
                        JSON.parse(localStorage.getItem("terms"))
                          .duration_val) && (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-1 py-1 text-xs border border-gray-300 font-bold text-green-700 whitespace-nowrap dark:text-white"
                          >
                            Warranty/Guarantee
                          </th>
                          <td className="px-1 py-1 text-xs border border-gray-300 text-wrap">
                            {JSON.parse(localStorage.getItem("terms"))
                              .warranty_guarantee_flag == "W"
                              ? "Warranty"
                              : JSON.parse(localStorage.getItem("terms"))
                                  .warranty_guarantee_flag == "G"
                              ? "Guarantee"
                              : ""}{" "}
                            {JSON.parse(localStorage.getItem("terms"))
                              .warranty_guarantee_flag != "N" && (
                              <span>
                                Duration:{" "}
                                {
                                  JSON.parse(localStorage.getItem("terms"))
                                    .duration_val
                                }{" "}
                                {JSON.parse(localStorage.getItem("terms"))
                                  .duration == "M"
                                  ? "month(s)"
                                  : JSON.parse(localStorage.getItem("terms"))
                                      .duration == "D"
                                  ? "day(s)"
                                  : "year(s)"}{" "}
                              </span>
                            )}
                            {/* ===================================================== */}
                            {JSON.parse(localStorage.getItem("terms"))
                              .warranty_guarantee_flag == "N" && (
                              <span>
                                {
                                  JSON.parse(localStorage.getItem("terms"))
                                    .duration_val
                                }{" "}
                                {JSON.parse(localStorage.getItem("terms"))
                                  .duration == "M"
                                  ? "month(s)"
                                  : JSON.parse(localStorage.getItem("terms"))
                                      .duration == "D"
                                  ? "day(s)"
                                  : "year(s)"}{" "}
                                from the date of commission or
                                {
                                  JSON.parse(localStorage.getItem("terms"))
                                    .duration_val_to
                                }{" "}
                                {JSON.parse(localStorage.getItem("terms"))
                                  .duration == "M"
                                  ? "month(s)"
                                  : JSON.parse(localStorage.getItem("terms"))
                                      .duration == "D"
                                  ? "day(s)"
                                  : "year(s)"}{" "}
                                from the date of dispatch ,whichever is earlier.
                              </span>
                            )}
                          </td>
                        </tr>
                      )}
                      {(JSON.parse(localStorage.getItem("terms"))
                        .duration_val == 0 ||
                        !JSON.parse(localStorage.getItem("terms"))
                          .duration_val) && (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-1 py-1 text-xs border border-gray-300 font-bold text-green-700 whitespace-nowrap dark:text-white"
                          >
                            Warranty/Guarantee
                          </th>
                          <td className="px-1 py-1 text-xs border border-gray-300 text-wrap">
                            {JSON.parse(localStorage.getItem("terms"))
                              .warranty_guarantee_flag == "W"
                              ? "Warranty"
                              : "Guarantee"}{" "}
                            Duration:{" "}
                            {
                              JSON.parse(localStorage.getItem("terms"))
                                .duration_val
                            }{" "}
                            {JSON.parse(localStorage.getItem("terms"))
                              .duration == "M"
                              ? "month(s)"
                              : JSON.parse(localStorage.getItem("terms"))
                                  .duration == "D"
                              ? "day(s)"
                              : "year(s)"}
                            {/* ===================================================== */}
                            {JSON.parse(localStorage.getItem("terms"))
                              .comm_dt && " from the date of commission"}
                            {JSON.parse(localStorage.getItem("terms"))
                              .comm_dt &&
                            JSON.parse(localStorage.getItem("terms"))
                              .dispatch_dt
                              ? " or from the date of dispatch"
                              : !JSON.parse(localStorage.getItem("terms"))
                                  .comm_dt &&
                                !JSON.parse(localStorage.getItem("terms"))
                                  .dispatch_dt
                              ? ""
                              : JSON.parse(localStorage.getItem("terms"))
                                  .dispatch_dt
                              ? " from the date of dispatch."
                              : ""}
                            {JSON.parse(localStorage.getItem("terms"))
                              .comm_dt &&
                              JSON.parse(localStorage.getItem("terms"))
                                .dispatch_dt &&
                              " ,whichever is earlier."}
                          </td>
                        </tr>
                      )}

                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-1 py-1 text-xs border border-gray-300 font-bold text-green-700 whitespace-nowrap dark:text-white"
                        >
                          O & M Manual
                        </th>
                        <td className="px-1 py-1 text-xs border border-gray-300">
                          {JSON.parse(localStorage.getItem("terms"))
                            .om_manual_flag == "A"
                            ? "Applicable. " +
                              JSON.parse(localStorage.getItem("terms"))
                                .om_manual_desc
                            : "N/A"}
                        </td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-1 py-1 text-xs border border-gray-300 font-bold text-green-700 whitespace-nowrap dark:text-white"
                        >
                          Operation/Installation
                        </th>
                        <td className="px-1 py-1 text-xs border border-gray-300">
                          {JSON.parse(localStorage.getItem("terms")).oi_flag ==
                          "A"
                            ? "Applicable. " +
                              JSON.parse(localStorage.getItem("terms")).oi_desc
                            : "N/A"}
                        </td>
                      </tr>
                      {/* {JSON.parse(localStorage.getItem('terms')).packing_val} */}

                      <tr className="bg-white border-b dark:bg-gray-800 text-gray-700 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-1 py-1 text-xs border border-gray-300 font-bold text-green-700 whitespace-nowrap dark:text-white"
                        >
                          Packing Type
                        </th>
                        <td className="px-1 py-1 text-xs text-gray-700 border border-gray-300">
                          {JSON.parse(localStorage.getItem("terms"))
                            .packing_type == "W"
                            ? "Wooden"
                            : JSON.parse(localStorage.getItem("terms"))
                                .packing_type == "C"
                            ? "Crate Packing"
                            : JSON.parse(localStorage.getItem("terms"))
                                .packing_type == "P"
                            ? "Plastic Wrap"
                            : JSON.parse(localStorage.getItem("terms"))
                                .packing_type == "S"
                            ? "Steel-worthy"
                            : JSON.parse(localStorage.getItem("terms"))
                                .packing_type == "O"
                            ? JSON.parse(localStorage.getItem("terms"))
                                .packing_val
                            : ""}
                        </td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-1 py-1 text-xs border border-gray-300 font-bold text-green-700 whitespace-nowrap dark:text-white"
                        >
                          Manufacturing Clearance
                        </th>
                        <td className="px-1 py-1 text-xs border border-gray-300">
                          {JSON.parse(localStorage.getItem("terms"))
                            .manufacture_clearance == "A"
                            ? "Applicable. " +
                              JSON.parse(localStorage.getItem("terms"))
                                .manufacture_clearance_desc
                            : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 w-full px-3 py-1 text-gray-50 font-semibold  border border-green-500 bg-green-500 ">
                  Liquidity Damages
                </div>

                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left border border-collapse text-xs rtl:text-right text-gray-50 dark:text-gray-400">
                    <tbody className="text-gray-700 ">
                      <tr className="bg-white border-b ">
                        <th
                          scope="row"
                          className="px-1 w-1/4 py-1 border border-gray-300  font-bold text-green-700 whitespace-nowrap dark:text-white"
                        >
                          LD Applicable date:
                        </th>
                        <td className="px-1 py-1 w-3/4 border border-gray-300">
                          {JSON.parse(localStorage.getItem("terms"))
                            .ld_applicable_date == "O"
                            ? `Others - ${
                                JSON.parse(localStorage.getItem("terms"))
                                  .others_ld
                              }`
                            : JSON.parse(localStorage.getItem("terms"))
                                .ld_applicable_date == "M"
                            ? "Required Delivery Date"
                            : JSON.parse(localStorage.getItem("terms"))
                                .ld_applicable_date == "NA"
                            ? "Not applicable"
                            : "Dispatch Date"}
                        </td>
                      </tr>
                      <tr className="bg-white border-b ">
                        <th
                          scope="row"
                          className="px-1 py-1 w-1/4 border border-gray-300  font-bold text-green-700 whitespace-nowrap dark:text-white"
                        >
                          LD applied on:
                        </th>
                        <td className="px-1 py-1 w-3/4 border border-gray-300">
                          {JSON.parse(localStorage.getItem("terms"))
                            .ld_applied_on == "O"
                            ? `Others - ${
                                JSON.parse(localStorage.getItem("terms"))
                                  .others_applied
                              }`
                            : JSON.parse(localStorage.getItem("terms"))
                                .ld_applied_on == "P"
                            ? "Pending Material Value"
                            : JSON.parse(localStorage.getItem("terms"))
                                .ld_applicable_date == "NA"
                            ? ""
                            : "PO Total Value"}
                        </td>
                      </tr>
                      <tr className="bg-white border-b ">
                        <th
                          scope="row"
                          className="px-1 py-1 w-1/4 border border-gray-300  font-bold text-green-700 whitespace-nowrap dark:text-white"
                        >
                          LD value(%):
                        </th>
                        <td className="py-1 px-1 w-3/4 text-wrap border border-gray-300">
                          {JSON.parse(localStorage.getItem("terms"))
                            .ld_applicable_date == "NA"
                            ? ""
                            : JSON.parse(localStorage.getItem("terms"))
                                .ld_value &&
                              JSON.parse(localStorage.getItem("terms"))
                                .po_min_value
                            ? "LD @" +
                              JSON.parse(localStorage.getItem("terms"))
                                .ld_value +
                              "% per week to a maximum of " +
                              JSON.parse(localStorage.getItem("terms"))
                                .po_min_value +
                              "% of the order value would be applicable for any delay beyond the stipulated delivery period."
                            : ""}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* <Divider className='mt-2'/> */}
                <table className="w-full my-3 text-xs border border-collapse text-left rtl:text-right text-gray-700 dark:text-gray-400">
                  <tbody>
                    <tr className="bg-white border-b text-nowrap dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-1 w-1/4 py-1 border border-gray-300 text-xs font-bold text-green-700 whitespace-nowrap dark:text-white"
                      >
                        MDCC
                      </th>
                      <td className="px-1 py-1 w-3/4 border border-gray-300 text-xs">
                        {localStorage.getItem("mdcc_flag") == "Y"
                          ? "Yes. " + localStorage.getItem("mdcc")
                          : "N/A"}
                      </td>
                    </tr>
                    <tr className="bg-white border-b w-1/4 dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-1 py-1 border border-gray-300 text-xs font-bold text-green-700 whitespace-nowrap dark:text-white"
                      >
                        Inspection
                      </th>
                      <td className="px-1 py-1 w-3/4 border border-gray-300 text-xs">
                        {localStorage.getItem("insp_flag") == "Y"
                          ? "Yes. " + localStorage.getItem("insp")
                          : "N/A"}
                      </td>
                    </tr>
                    <tr className="bg-white border-b w-1/4 dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-1 py-1 border border-gray-300 text-xs font-bold text-green-700 whitespace-nowrap dark:text-white"
                      >
                        Drawing/Datasheet
                      </th>
                      <td className="px-1 py-1 w-3/4 border border-gray-300 text-xs">
                        {localStorage.getItem("drawing_flag") == "Y"
                          ? "Yes. ":'N/A' }
                            {localStorage.getItem("drawing")!='None' &&  localStorage.getItem("drawing")?
                            localStorage.getItem("drawing")+' ':'' }
                            {localStorage.getItem("dt")!='None' && localStorage.getItem("dt")?'(Date: '+localStorage.getItem("dt")+')':''}
                           
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* </p> */}

                {localStorage.getItem("notes") != "None" && (
                  <>
                    {" "}
                    <div className="mt-2 mb-1 w-full px-3 py-1  text-gray-50 font-semibold  border border-green-500 bg-green-500 ">
                      Notes
                    </div>
                    <span className="p-2 text-xs">
                      {localStorage.getItem("notes")}
                    </span>
                    <Divider />
                  </>
                )}

                <h3 className="text-green-700 mt-2 font-bold text-sm">
                  Default Note:
                </h3>
                <table className="border w-full text-gray-800 px-1 text-xs border-gray-300 border-collapse text-sm my-1 px-3 py-1">
                  <tr className="border border-gray-300">
                    <td rowspan="2" className="border border-gray-300">
                      Tax Invoice shall be of minimum three (3) copies with—
                      <br />
                      1. GSTIN of supplier
                      <br />
                      2. HSN/ SAC code of each & every materials/goods
                      <br />
                      3. Description of goods as per HSN/ SAC code
                      <br />
                      4. Description of goods as per ordered/ offered/ standard
                      practice (or convenient name)
                    </td>
                    <td className="border border-gray-300">
                      Original for recipient (to be submitted directly to the
                      purchaser)
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300">
                      Duplicate for transporter (to be moved with
                      materials/goods & deliver to consignee)
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td rowspan="2" className="borde border-gray-300">
                      Payment of GST & ITC credit, if not available as per GST
                      Act within the specific time period —
                    </td>
                    <td>
                      1. Amount will be deducted from supplier’s any Tax invoice
                      without any intimation & will be non-refundable.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      2. For any violation against norms of GST, supplier shall
                      be solely responsible for matter related to tax invoice.
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300">
                      MDCC (Material Dispatch Clearance Certificate)
                    </td>
                    <td className="border border-gray-300">
                      To be strictly followed before movement of the goods or
                      raise invoice.
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </Spin>
        </div>
        <p className="text-[11px] text-gray-600 font-semibold">
          This is a computer generated purchase order. No signature is required.
        </p>
      </div>
    </>
  );
}

export default PoPreview;
