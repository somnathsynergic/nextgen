import React, { useEffect } from "react";
import {
  BlockOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
  SolutionOutlined,
  PercentageOutlined,
  DockerOutlined,
  DatabaseFilled,
  BankFilled,
  PayCircleFilled,
  ToolFilled,
  ShopFilled,
  InteractionFilled,
  AccountBookFilled,
  CheckCircleFilled,
  SignatureFilled,
  DiffFilled,
  FundFilled,
  FileMarkdownFilled,
  ProfileFilled,
  PieChartFilled,
  TruckFilled,
  MergeFilled,
  DropboxCircleFilled,
  DropboxOutlined,
  EyeOutlined,
  PullRequestOutlined,
  SwapRightOutlined,
  SwapLeftOutlined,
  CloseCircleFilled,
  EnterOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { routePaths } from "../Assets/Data/Routes";
import { CheckOutlined, LockOpenOutlined, UploadFileOutlined } from "@mui/icons-material";


function Menus({ theme,data,shrink }) {
  const [current, setCurrent] = React.useState("sub1");
 console.log(data)
  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const items = [
    {
      key: "sub1",
      icon: <FundFilled />,
      label: <Link to={""}>Dashboard </Link>,
      
      
    },
    {
      label: "Masters",
      key: "sub2",
      icon: <DatabaseFilled />,
      disabled: data?.masters=='0'|| data==undefined?true:false,
      children: [
        {
          key: "masters:dept",
          icon: <BankFilled />,
          label: <Link disabled={data?.masters=='0'|| data==undefined?true:false} to={data?.masters!='0' && data!=undefined?routePaths.DEPARTMENTS:'#'}>Department</Link>,
          disabled:data?.masters=='0'|| data==undefined?true:false

        },
        // {
        //   key: "masters:desig",
        //   icon: <IdcardOutlined />,
        //   label: <Link to={routePaths.DESIGNATIONS}>Designation</Link>,
        // },
        {
          key: "masters:cat",
          icon: <BlockOutlined />,
          label: <Link disabled={data?.masters=='0' || data==undefined?true:false} to={data?.masters!='0' && data!=undefined?routePaths.CATEGORIES:'#'}>Product Category</Link>,
          disabled:data?.masters=='0'|| data==undefined?true:false
        },
        // {
        //   key: "masters:3",
        //   icon: <ProjectOutlined />,
        //   label: <Link to={routePaths.PROJECTS}>Projects</Link>,
        // },

        {
          key: "masters:unit",
          icon: <PayCircleFilled />,
          label: <Link disabled={data?.masters=='0'  || data==undefined?true:false} to={data?.masters!='0' && data!=undefined?routePaths.UNITS:'#'}>Unit</Link>,
          disabled:data?.masters=='0'|| data==undefined?true:false

        },
        {
          key: "masters:product",
          icon: <ToolFilled />,
          label: <Link disabled={data?.masters=='0'  || data==undefined?true:false} to={data?.masters!='0' && data!=undefined?routePaths.PRODUCTS:'#'}>Product</Link>,
          disabled:data?.masters=='0'|| data==undefined?true:false

        },
        {
          key: "masters:vendor",
          icon: <ShopFilled />,
          label: <Link disabled={data?.masters=='0' || data==undefined?true:false} to={data?.masters!='0' && data!=undefined?routePaths.VENDORS:'#'}>Vendor</Link>,
          disabled:data?.masters=='0'|| data==undefined?true:false
        },
        {
          key: "masters:client",
          icon: <UserSwitchOutlined />,
          label: <Link disabled={data?.masters=='0'  || data==undefined?true:false} to={data?.masters!='0' && data!=undefined?routePaths.CLIENTS:'#'}>Client </Link>,
          disabled:data?.masters=='0'|| data==undefined?true:false

        },
        {
          key: "masters:gst",
          icon: <PercentageOutlined />,
          label: <Link disabled={data?.masters=='0' || data==undefined?true:false} to={data?.masters!='0' && data!=undefined?routePaths.GST:'#'}>GST </Link>,
          disabled:data?.masters=='0'|| data==undefined?true:false

        },
        {
          key: "masters:user",
          icon: <UserAddOutlined />,
          label: <Link  disabled={data?.masters=='0' || data==undefined?true:false} to={data?.masters!='0' && data!=undefined?routePaths.USERS:'#'}>Company Users </Link>,
          disabled:data?.masters=='0'|| data==undefined?true:false

        },
        {
          key: "masters:permissions",
          icon: <LockOpenOutlined />,
          label: <Link disabled={data?.masters=='0' || data==undefined?true:false} to={data?.masters!='0' && data!=undefined?routePaths.PERMISSIONS:'#'}>Permissions</Link>,
          disabled:data?.masters=='0'|| data==undefined?true:false

        },
      ],
    },
    {
      label: <Link disabled={data?.purchase_req=='0' || data==undefined?true:false} to={data?.purchase_req!='0' && data!=undefined?routePaths.PURVIEW:'#'}>Purchase Requisition</Link>,
      key: "purchase-requisition",
      icon: <MergeFilled/>,
      disabled:data?.purchase_req=='0'|| data==undefined?true:false

    },
    {
      label: "Orders",
      key: "sub4",
      icon: <ProfileFilled />,
      children: [
        {
          key: "master:projects",
          icon: <DockerOutlined />,
          label: "Projects",

          children: [
            {
              // key: "client-order",
              // icon: <UserOutlined />,
              // label: <Link to={routePaths.CLIENTORDER}>Client Orders</Link>,
              key: "master:client-orders",
              icon: <UserSwitchOutlined />,
              label: <Link disabled={data?.project=='0' || data==undefined?true:false} to={data?.project!='0' && data!=undefined?routePaths.PROJECTS:'#'}>Client Orders</Link>,
              disabled:data?.project=='0'|| data==undefined?true:false

            },
          ],
        },
       
        {
          // key: "client-order",
          // icon: <UserOutlined />,
          // label: <Link to={routePaths.CLIENTORDER}>Client Orders</Link>,
          key: "master:purchase",
          icon: <AccountBookFilled />,
          label: "Purchase",

          children: [
            {
              label: (
                <Link disabled={data?.po=='0'|| data==undefined?true:false} to={data?.po!='0' && data!=undefined?routePaths.PURCHASEORDER + "/P":'#'}>Vendor Orders</Link>
              ),
              key: "purchase-order",
              icon: <SolutionOutlined />,
              disabled:data?.po=='0'|| data==undefined?true:false

            },

            {
              label: (
                <Link disabled={data?.po=='0'|| data==undefined?true:false} to={data?.po!='0' && data!=undefined?routePaths.EXISTINGORDER:'#'}>
                  Existing Purchase Orders
                </Link>
              ),
              key: "existing-order",
              icon: <CheckCircleFilled />,
              disabled:data?.po=='0'|| data==undefined?true:false

            },
            {
              label: (
                <Link disabled={data?.po=='0'|| data==undefined?true:false} to={data?.po!='0' && data!=undefined?routePaths.AMENDORDER:'#'}>Amend Purchase Orders</Link>
              ),
              key: "amend-order",
              icon: <SignatureFilled />,
              disabled:data?.po=='0'|| data==undefined?true:false


            },
            {
              label: (
                <Link disabled={data?.approve_po=='0'|| data==undefined?true:false} to={data?.approve_po!='0' && data!=undefined?routePaths.APPROVEORDER:'#'}>Approve Vendor Orders</Link>
              ),
              key: "approve-purchase-order",
              icon: <CheckCircleFilled />,
              disabled:data?.approve_po=='0'|| data==undefined?true:false


            },
            {
              label: (
                <Link disabled={data?.po=='0'|| data==undefined?true:false} to={data?.po!='0' && data!=undefined?routePaths.TESTCERTHOME:'#'}>
                  Upload Test Certificate
                </Link>
              ),
              key: "uploadtc-purchase-order",
              icon: <UploadFileOutlined />,
              disabled:data?.po=='0'|| data==undefined?true:false


            },

            // {
            //   label: <Link to={routePaths.CANCELHOME}>Cancel Purchase Orders</Link>,
            //   key: "cancel-purchase-order",
            //   icon: <CloseCircleOutlined />,
          ],
        },
      ],
      // children: [
      //   {
      //     // key: "client-order",
      //     // icon: <UserOutlined />,
      //     // label: <Link to={routePaths.CLIENTORDER}>Client Orders</Link>,
      //     key: "master:projects",
      //     icon: <UserSwitchOutlined />,
      //     label: <Link to={routePaths.PROJECTS}>Client Orders</Link>,
      //   },
      //   {
      //     label: <Link to={routePaths.PURCHASEORDER+'/P'}>Vendor Orders</Link>,
      //     key: "purchase-order",
      //     icon: <SolutionOutlined />,
      //   },

      //   {
      //     label: <Link to={routePaths.EXISTINGORDER}>Existing Purchase Orders</Link>,
      //     key: "existing-order",
      //     icon: <CheckCircleOutlined />,
      //   },
      //   {
      //     label: <Link to={routePaths.AMENDORDER}>Amend Purchase Orders</Link>,
      //     key: "amend-order",
      //     icon: <SignatureOutlined />,
      //   },
      //   {
      //     // label: <Link to={routePaths.PURCHASEORDER+'/A'}>Approve Vendor Orders</Link>,
      //     label: <Link to={routePaths.APPROVEORDER}>Approve Vendor Orders</Link>,
      //     key: "approve-purchase-order",
      //     icon: <CheckOutlined />,
      //   },

      //   // {
      //   //   label: <Link to={routePaths.CANCELHOME}>Cancel Purchase Orders</Link>,
      //   //   key: "cancel-purchase-order",
      //   //   icon: <CloseCircleOutlined />,
      //   // }

      // ],
    },

    // {
    //   label: <Link to={routePaths.MDCCHOME}>Upload MDCC</Link>,
    //   key: "mdcc-purchase-order",
    //   icon: <UploadFileOutlined />,
    // },
    {
      label:  "MRN",
      key: "material-delivery",
      icon: <FileMarkdownFilled />,
      children: [
        {
          key: "mrn:cr-mrn",
          icon: <DiffFilled/>,
          label:<Link disabled={data?.mrn=='0'|| data==undefined?true:false} to={data?.mrn!='0' && data!=undefined?routePaths.DELIVERYCUSTOMERVIEW:'#'}>Create MRN</Link>,
          disabled:data?.mrn=='0'|| data==undefined?true:false

        },
     
          {
            key: "mrn:appr-mrn",
            icon: <CheckCircleFilled />,
            label:<Link disabled={data?.mrn=='0'?true:false} to={data?.mrn!='0' && data!=undefined?routePaths.APPROVEMRN:'#'}>Approve MRN</Link>,
            disabled:data?.mrn=='0'|| data==undefined?true:false

  
          },
          {
            key: "dirdel",
            icon: <TruckFilled />,
            label: <Link disabled={data?.mrn=='0'|| data==undefined?true:false} to={data?.mrn!='0' && data!=undefined?routePaths.CLIENTDELIVERYVIEW:'#'}>Vendor To Client Direct Delivery </Link>,
            disabled:data?.mrn=='0'|| data==undefined?true:false

            
          },
      ]

    },
    {
      label: 'Floor Requisition',
      key: "material-requisition",
      icon: <InteractionFilled />,
      children: [
        {
          key: "req:cr-req",
          icon: <DiffFilled/>,
          label: <Link disabled={data?.requisition=='0'|| data==undefined?true:false} to={data?.requisition!='0' && data!=undefined?routePaths.REQVIEW:'#'}>Create Requisition </Link>,
          disabled:data?.requisition=='0'|| data==undefined?true:false

        },
          {
            key: "req:appr-req",
            icon: <CheckCircleFilled />,
            label:<Link disabled={data?.requisition=='0'|| data==undefined?true:false} to={data?.requisition!='0' && data!=undefined?routePaths.APPROVEREQ:'#'}>Approve Requisition</Link>,
            disabled:data?.requisition=='0'|| data==undefined?true:false

  
          },
          // {
          //   key: "req:can-req",
          //   icon: <CloseCircleFilled />,
          //   label:<Link disabled={data?.requisition=='0'?true:false} to={data?.requisition!='0'?routePaths.CANCELREQ:'#'}>Cancel Requisition</Link>,
          //   disabled:data?.requisition=='0'?true:false

  
          // },
          {
            label: <Link disabled={data?.requisition=='0'|| data==undefined?true:false} to={data?.requisition!='0' && data!=undefined?routePaths.RETFORM:'#'}> Material Return </Link>,
            key: "material-return",
            icon: <EnterOutlined />,
            disabled:data?.requisition=='0'|| data==undefined?true:false
          },

    ]
  },
   
    {
      label: <Link disabled={data?.min=='0'|| data==undefined?true:false} to={data?.min!='0' && data!=undefined?routePaths.MINVIEW:'#'}> Material Issue Note </Link>,
      key: "material-issue",
      icon: <FileMarkdownFilled />,
      disabled:data?.min=='0'|| data==undefined?true:false

    },
    // {
    //   label: "Stock",
    //   key: "sub5",
    //   icon: <DropboxOutlined />,
    //   children: [
    //     {
    //       label: <Link to={routePaths.STOCKUPDATE}>Open/Update Stock</Link>,
    //       key: "stock-update",
    //       icon: <DropboxOutlined />,
    //     },

    //     {
    //       label: <Link to={routePaths.STOCKASSIGNVIEW}>Assign</Link>,
    //       key: "stock-assign",
    //       icon: <ReconciliationOutlined />,
    //     },
    //     {
    //       label: <Link to={routePaths.STOCKINVIEW}>Stock In</Link>,
    //       key: "stock-in",
    //       icon: <ArrowRightOutlined />,
    //     },
    //     {
    //       label: <Link to={routePaths.STOCKOUTVIEW}>Stock Out</Link>,
    //       key: "stock-out",
    //       icon: <ArrowLeftOutlined />,
    //     },
    //     {
    //       label: "Transfer",
    //       key: "stock-trans",
    //       icon: <SwapOutlined />,
    //       children: [
    //         {
    //           label: (
    //             <Link to={routePaths.REQUISITIONSENTVIEW}>
    //               Requisitions sent
    //             </Link>
    //           ),
    //           key: "req-mk",
    //           icon: <NodeExpandOutlined />,
    //         },
    //         {
    //           label: (
    //             <Link to={routePaths.REQUISITIONRCVDVIEW}>
    //               Requisitions received
    //             </Link>
    //           ),
    //           key: "req-rec",
    //           icon: <NodeCollapseOutlined />,
    //         },
    //       ],
    //     },
    //   ],
    // },
   
    {
      label: "Stock",
      key: "stk1",
      icon:<DropboxOutlined />,
      children: [
        // {
        //   key: "rep:view-stock",
        //   icon: <EyeOutlined />,
        //   label:<Link to={routePaths.VIEWSTOCK}> View Stock</Link>,
        //   disabled:data?.department=='Y'?false:true

        // },
         {
          key: "rep:stock-in",
          icon: <SwapRightOutlined />,
          label:<Link disabled={data?.stock=='0'|| data==undefined?true:false} to={data?.stock!='0' && data!=undefined?routePaths.STOCKIN:'#'}> Stock In</Link>,
          disabled:data?.stock=='0'|| data==undefined?true:false


        },
        {
          key: "rep:stock-out",
          icon: <SwapLeftOutlined />,
          label:<Link disabled={data?.stock=='0'|| data==undefined?true:false} to={data?.stock!='0' && data!=undefined?routePaths.STOCKOUT:'#'}> Stock Out</Link>,
          disabled:data?.stock=='0'|| data==undefined?true:false


        },
        {
          key: "rep:transstock",
          icon: <PullRequestOutlined />,
          label:'Transfer Stock',
          children: [
            {
              key: "rep:trans-wtop",
              icon: <PullRequestOutlined />,
              label:<Link disabled={data?.stock=='0'|| data==undefined?true:false} to={data?.stock!='0' && data!=undefined?routePaths.STOCKTRANSVIEW:'#'}> Warehouse To Project</Link>,
              disabled:data?.stock=='0'|| data==undefined?true:false

    
            },
            {
              key: "rep:trans-ptop",
              icon:<PullRequestOutlined />,
              label:<Link disabled={data?.stock=='0'|| data==undefined?true:false} to={data?.stock!='0' && data!=undefined?routePaths.STOCKTRANSVIEWPROJ:'#'}> Project To Project</Link>,
              disabled:data?.stock=='0'|| data==undefined?true:false

    
            },
            {
              key: "rep:trans-ptow",
              icon:<PullRequestOutlined />,
              label:<Link disabled={data?.stock=='0'|| data==undefined?true:false} to={data?.stock!='0' && data!=undefined?routePaths.STOCKTRANSVIEWTOW:'#'}> Project To Warehouse</Link>,
              disabled:data?.stock=='0'|| data==undefined?true:false

    
            },
            {
              key: "rep:trans-appr",
              icon:<CheckCircleFilled />,
              label:<Link disabled={data?.stock=='0'|| data==undefined?true:false} to={data?.stock!='0' && data!=undefined?routePaths.STOCKTRANSAPPROVE:'#'}> Approve Transfer</Link>,
              disabled:data?.stock=='0'|| data==undefined?true:false

    
            },
            // {
            //   key: "rep:trans-can",
            //   icon:<CloseCircleFilled />,
            //   label:<Link disabled={data?.stock=='0'?true:false} to={data?.stock!='0'?routePaths.STOCKTRANSCANCEL:'#'}> Cancel Transfer</Link>,
            //   disabled:data?.stock=='0'?true:false

    
            // },
          
          ]

        },
          
        

    ]

    },
    // {
    //   label: <Link disabled={data?.min=='Y'?false:true} to={data?.min=='Y'?routePaths.RETFORM:'#'}> Material Return </Link>,
    //   key: "material-return",
    //   icon: <EnterOutlined />,
    //   disabled:data?.min=='Y'?false:true

    // },
    {
      label: "Reports",
      key: "sub6",
      icon:<PieChartFilled />,
      children: [
        {
          key: "rep:all-stock",
          icon: <PieChartFilled />,
          label:<Link to={routePaths.ALLSTOCKREPORT}> All-Stock Report</Link>,

        },
          // {
          //   key: "rep:proj",
          //   icon: <PieChartFilled />,
          //   label:<Link to={routePaths.PROJECTWISE}>Projectwise Stock Report</Link>,
          //   disabled:data?.department=='Y'?false:true
  
          // },
          ,
          {
            key: "rep:item",
            icon: <PieChartFilled />,
            label:<Link to={routePaths.ITEMWISE}>Itemwise Stock Report</Link>,
  
          },

    ]

    },
  ];

  return (
    <div>
      <Menu inlineCollapsed={shrink} onClick={onClick} selectedKeys={[current]} items={items} />
    </div>
  );
}

export default Menus;
