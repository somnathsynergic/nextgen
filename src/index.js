import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./Screens/Auth/Auth";
import Notfound from "./Screens/Notfound/Notfound";
// import Details from "./Screens/Homescreen/Details";
import { Democontext } from "./Context/Democontext";
import Loader from "./Components/Loader";

import CircularProgress from "@mui/material/CircularProgress";
import CatchError from "./Screens/CatchError";
import CancelView from "./Screens/Stock/ApproveTransfer.js/CancelView";
const StockVal =lazy(()=>import("./Screens/Reports/StockVal"));
const SiemensMRNForm = lazy(()=>import("./Screens/Siemens/SiemensMRNForm"));
const SiemensComp =lazy(()=>import("./Screens/Siemens/SiemensComp"));
const SiemensView =lazy(()=>import("./Screens/Siemens/SiemensView"));
const SiemensForm =lazy(()=>import("./Screens/Siemens/SiemensForm"));
const MatValStockout = lazy(()=>import("./Screens/Reports/MatValStockout"));
const Pr_ord_create = lazy(()=>import("./Screens/Reports/Pr_ord_create"))
const MaterialVal =lazy(()=>import("./Screens/Reports/MaterialVal"));
const StockOutReport =lazy(()=>import("./Screens/Reports/StockOutReport"));
const PurMrnReporProj=lazy(()=>import("./Screens/Reports/PurMrnReporProj"));
// import CancelPO from "./Screens/Purchase Order/CancelPO";
// import CancelPoView from "./Screens/Purchase Order/CancelView";
// import CancelForm from "./Screens/Purchase Order/CancelForm";
const PurchaseReqComp =lazy(()=>import( "./Screens/Purchase Requisition/PurchaseReqComp"))
const PurchaseReqView =lazy(()=>import( "./Screens/Purchase Requisition/PurchaseReqView"))
const PurchaseReqForm =lazy(()=>import( "./Screens/Purchase Requisition/PurchaseReqForm"))
const PtoWComp =lazy(()=>import( "./Screens/Stock/PtoW/PtoWComp"))
const PtoWView =lazy(()=>import( "./Screens/Stock/PtoW/PtoWView"))
const PtoWForm =lazy(()=>import( "./Screens/Stock/PtoW/PtoWForm"))
const ClosePoComp =lazy(()=>import( "./Screens/Purchase Order/ClosePo/ClosePoComp"))
const ClosePoView =lazy(()=>import( "./Screens/Purchase Order/ClosePo/ClosePoView"))
const ClosePoForm =lazy(()=>import( "./Screens/Purchase Order/ClosePo/ClosePoForm"))
const PurMrnReport =lazy(()=>import( "./Screens/Reports/PurMrnReport"))
const MaterialReturnComp =lazy(()=>import("./Screens/MaterialReturn/MaterialReturnComp"))
const MaterialReturn =lazy(()=>import("./Screens/MaterialReturn/MaterialReturn"))
// const StatementandTransfer = lazy(() =>
//   import("./Screens/Stock/StatementandTransfer")
// );
const StockView = lazy(() => import("./Screens/Stock/StockView"));

const ClientDeliveryComp = lazy(() =>
  import("./Screens/ClientDelivery/ClientDeliveryComp")
);
const ClientDeliveryView = lazy(() =>
  import("./Screens/ClientDelivery/ClientDeliveryView")
);
const ClientDeliveryForm = lazy(() =>
  import("./Screens/ClientDelivery/ClientDeliveryForm")
);

const root = ReactDOM.createRoot(document.getElementById("root"));
const Home = lazy(() => import("./Screens/Homescreen/Home"));
const HomeScreen = lazy(() => import("./Screens/Homescreen/HomeScreen"));
const ForgotPass = lazy(() => import("./Screens/Auth/ForgotPass"));
// const Signup = lazy(() => import("./Screens/Auth/Signup"));
const Signin = lazy(() => import("./Screens/Auth/Signin"));
const StockIn = lazy(()=>import("./Screens/Stock/StockIn/StockIn"));
const StockOut =lazy(()=>import("./Screens/Stock/StockOut/StockOut"));

const NotificationComp = lazy(() =>
  import("./Screens/Notifications/NotificationComp")
);
const NotificationView = lazy(() =>
  import("./Screens/Notifications/NotificationView")
);

const MastersComp = lazy(() => import("./Screens/Masters/MastersComp"));
const UserComp = lazy(() => import("./Screens/Masters/Users/UserComp"));
const UserView = lazy(() => import("./Screens/Masters/Users/UserView"));
const UserAddForm = lazy(() => import("./Screens/Masters/Users/UserAddForm"));

const ClientComp = lazy(() => import("./Screens/Masters/Clients/ClientComp"));
const ClientView = lazy(() => import("./Screens/Masters/Clients/ClientView"));
const ClientForm = lazy(() => import("./Screens/Masters/Clients/ClientForm"));

const ProjectComp = lazy(() =>
  import("./Screens/Masters/Projects/ProjectComp")
);
const ProjectView = lazy(() =>
  import("./Screens/Masters/Projects/ProjectView")
);
const ProjectForm = lazy(() =>
  import("./Screens/Masters/Projects/ProjectForm")
);

const ProductComp = lazy(() =>
  import("./Screens/Masters/Products/ProductComp")
);
const ProductView = lazy(() =>
  import("./Screens/Masters/Products/ProductView")
);
const ProductForm = lazy(() =>
  import("./Screens/Masters/Products/ProductForm")
);

const VendorComp = lazy(() => import("./Screens/Masters/Vendors/VendorComp"));
const VendorView = lazy(() => import("./Screens/Masters/Vendors/VendorView"));
const VendorForm = lazy(() => import("./Screens/Masters/Vendors/VendorForm"));

const CategoryComp = lazy(() =>
  import("./Screens/Masters/Categories/CategoryComp")
);
const CategoryView = lazy(() =>
  import("./Screens/Masters/Categories/CategoryView")
);
const CategoryForm = lazy(() =>
  import("./Screens/Masters/Categories/CategoryForm")
);

const UnitComp = lazy(() => import("./Screens/Masters/Units/UnitComp"));
const UnitView = lazy(() => import("./Screens/Masters/Units/UnitView"));
const UnitForm = lazy(() => import("./Screens/Masters/Units/UnitForm"));

const DeptComp = lazy(() => import("./Screens/Masters/Department/DeptComp"));
const DeptView = lazy(() => import("./Screens/Masters/Department/DeptView"));
const DeptForm = lazy(() => import("./Screens/Masters/Department/DeptForm"));

const GstComp = lazy(() => import("./Screens/Masters/Gst/GstComp"));
const GstView = lazy(() => import("./Screens/Masters/Gst/GstView"));
const GstForm = lazy(() => import("./Screens/Masters/Gst/GstForm"));

const ApproveOrders = lazy(() =>
  import("./Screens/Purchase Order/ApproveOrders")
);
const ApproveMrn = lazy(() => import("./Screens/MRN/ApproveMrn"));
const ApproveRequisition = lazy(() =>
  import("./Screens/Requisition/ApproveRequisition")
);

const UploadTC = lazy(() =>
  import("./Screens/Purchase Order/UploadTC/UploadTC")
);
const UploadTCView = lazy(() =>
  import("./Screens/Purchase Order/UploadTC/UploadTCView")
);
const UploadTCForm = lazy(() =>
  import("./Screens/Purchase Order/UploadTC/UploadTCForm")
);

const DesignationComp = lazy(() =>
  import("./Screens/Masters/Designation/DesignationComp")
);
const DesignationView = lazy(() =>
  import("./Screens/Masters/Designation/DesignationView")
);
const DesignationForm = lazy(() =>
  import("./Screens/Masters/Designation/DesignationForm")
);

const PurchaseOrderComp = lazy(() =>
  import("./Screens/Purchase Order/PurchaseOrderComp")
);
const PurchaseOrderView = lazy(() =>
  import("./Screens/Purchase Order/PurchaseOrderView")
);
const PurchaseOrderForm = lazy(() =>
  import("./Screens/Purchase Order/PurchaseOrderForm")
);

const ExistingPoView = lazy(() =>
  import("./Screens/Purchase Order/ExistingPoView")
);
const AmendView = lazy(() => import("./Screens/Purchase Order/AmendView"));

// const OrderView = lazy(() => import("./Screens/Purchase Order/OrderView"));
// const OrderForm = lazy(() => import("./Screens/Purchase Order/OrderForm"));
const ApproveView =lazy(()=>import("./Screens/Stock/ApproveTransfer.js/ApproveView"))

const StockComp = lazy(() => import("./Screens/Stock/StockComp"));
const Transfer =lazy(()=>import("./Screens/Stock/Transfer"));
const WtoWComp =lazy(()=>import("./Screens/Stock/WtoW/WtoWComp"));
const WtoWView =lazy(()=>import("./Screens/Stock/WtoW/WtoWView"));
const WtoWForm =lazy(()=>import("./Screens/Stock/WtoW/WtoWForm"));
const PtoPComp =lazy(()=>import("./Screens/Stock/PtoP/PtoPComp"));
const PtoPView =lazy(()=>import("./Screens/Stock/PtoP/PtoPView"));
const PtoPForm =lazy(()=>import("./Screens/Stock/PtoP/PtoPForm"));

const MDCC = lazy(() => import("./Screens/Purchase Order/UploadMDCC/MDCC"));
const MDCCView = lazy(() =>
  import("./Screens/Purchase Order/UploadMDCC/MDCCView")
);
const MDCCForm = lazy(() =>
  import("./Screens/Purchase Order/UploadMDCC/MDCCForm")
);

const PermissionsComp = lazy(() =>
  import("./Screens/Masters/Permissions/PermissionsComp")
);
const PermissionsView = lazy(() =>
  import("./Screens/Masters/Permissions/PermissionsView")
);
const PermissionsForm = lazy(() =>
  import("./Screens/Masters/Permissions/PermissionsForm")
);
const CancelRequisition =lazy(()=> import("./Screens/Requisition/CancelRequisition"));

const ReportComp = lazy(() => import("./Screens/Reports/ReportComp"));
const AllStock = lazy(() => import("./Screens/Reports/AllStock"));
const Itemwise = lazy(() => import("./Screens/Reports/Itemwise"));
const Projectwise = lazy(() => import("./Screens/Reports/Projectwise"));

// const RequisitionSentView = lazy(() =>
//   import("./Screens/Stock/RequisitionSentView")
// );
// const RequisitionRcvdView = lazy(() =>
//   import("./Screens/Stock/RequisitionRcvdView")
// );
// const ReqSendForm = lazy(() => import("./Screens/Stock/ReqSendForm"));
// const ReqRcvdForm = lazy(() => import("./Screens/Stock/ReqRcvdForm"));

const ToCustomer = lazy(() =>
  import("./Screens/Delivery/ToCustomer/ToCustomer")
);
const ToCustomerView = lazy(() =>
  import("./Screens/Delivery/ToCustomer/ToCustomerView")
);
const ToCustomerForm = lazy(() =>
  import("./Screens/Delivery/ToCustomer/ToCustomerForm")
);

const MinComp = lazy(() => import("./Screens/Min/MinComp"));
const MinForm = lazy(() => import("./Screens/Min/MinForm"));
const MinView = lazy(() => import("./Screens/Min/MinView"));

const Requisition = lazy(() => import("./Screens/Requisition/Requisition"));
const RequisitionView = lazy(() =>
  import("./Screens/Requisition/RequisitionView")
);
const RequisitionForm = lazy(() =>
  import("./Screens/Requisition/RequisitionForm")
);

window.addEventListener("beforeunload", (ev) => {
  ev.preventDefault();
  alert("hii");
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Auth />,
        children: [
          {
            path: "",
            element: <Signin />,
          },
          // {
          //   path: "signup",
          //   element: <Signup />,
          // },
          {
            path: "forgotpassword",
            element: <ForgotPass />,
          },
        ],
      },
      {
        path: "home",
        element: <Home />,
        children: [
          {
            path: "",
            element: <HomeScreen />,
          },
          {
            path: "notificationComp",
            element: <NotificationComp />,
            children: [
              {
                path: "notifications",
                element: <NotificationView />,
              },
            ],
          },
          {
            path: "mastersComp",
            element: <MastersComp />,
            children: [
              {
                path: "users",
                element: <UserComp />,
                children: [
                  {
                    path: "",
                    element: <UserView />,
                  },
                  {
                    path: "useraddform/:id",
                    element: <UserAddForm />,
                  },
                ],
              },
              {
                path: "permissions",
                element: <PermissionsComp />,
                children: [
                  {
                    path: "",
                    element: <PermissionsView />,
                  },
                  {
                    path: "permissionsform/:id",
                    element: <PermissionsForm />,
                  },
                ],
              },
              {
                path: "clients",
                element: <ClientComp />,
                children: [
                  {
                    path: "",
                    element: <ClientView />,
                  },
                  {
                    path: "clientaddform/:id",
                    element: <ClientForm />,
                  },
                ],
              },
              {
                path: "Gst",
                element: <GstComp />,
                children: [
                  {
                    path: "",
                    element: <GstView />,
                  },
                  {
                    path: "gstaddform/:id",
                    element: <GstForm />,
                  },
                ],
              },
              {
                path: "designations",
                element: <DesignationComp />,
                children: [
                  {
                    path: "",
                    element: <DesignationView />,
                  },
                  {
                    path: "designationaddform/:id",
                    element: <DesignationForm />,
                  },
                ],
              },

              {
                path: "products",
                element: <ProductComp />,
                children: [
                  {
                    path: "",
                    element: <ProductView />,
                  },
                  {
                    path: "productaddform/:id",
                    element: <ProductForm />,
                  },
                ],
              },
              ,
              {
                path: "units",
                element: <UnitComp />,
                children: [
                  {
                    path: "",
                    element: <UnitView />,
                  },
                  {
                    path: "unitaddform/:id",
                    element: <UnitForm />,
                  },
                ],
              },
              {
                path: "vendors",
                element: <VendorComp />,
                children: [
                  {
                    path: "",
                    element: <VendorView />,
                  },
                  {
                    path: "vendoraddform/:id",
                    element: <VendorForm />,
                  },
                ],
              },
              {
                path: "departments",
                element: <DeptComp />,
                children: [
                  {
                    path: "",
                    element: <DeptView />,
                  },
                  {
                    path: "departmentaddform/:id",
                    element: <DeptForm />,
                  },
                ],
              },
              {
                path: "categories",
                element: <CategoryComp />,
                children: [
                  {
                    path: "",
                    element: <CategoryView />,
                  },
                  {
                    path: "categoryform/:id",
                    element: <CategoryForm />,
                  },
                ],
              },
            ],
          },
          {
            path: "poComp",
            element: <PurchaseOrderComp />,
            children: [
              // {
              //   path: "clientorder",
              //   element: <OrderView />,
              // },
              // {
              //   path: "orderform/:id",
              //   element: <OrderForm />,
              // },
              {
                path: "projects",
                element: <ProjectComp />,
                children: [
                  {
                    path: "",
                    element: <ProjectView />,
                  },
                  {
                    path: "projectaddform/:id",
                    element: <ProjectForm />,
                  },
                ],
              },
              {
                path: "purchaseorder/:flag",
                element: <PurchaseOrderView />,
              },
              {
                path: "approveorders",
                element: <ApproveOrders />,
              },
              {
                path: "purchaseorderform/:flag/:id",
                element: <PurchaseOrderForm />,
              },
              {
                path: "existingorder",
                element: <ExistingPoView />,
              },
              {
                path: "amendorder",
                element: <AmendView />,
              },
              {
                path: "uploadtc",
                element: <UploadTC />,
                children: [
                  {
                    path: "",
                    element: <UploadTCView />,
                  },
                  {
                    path: "upload/:id/:po_no",
                    element: <UploadTCForm />,
                  },
                ],
              },
              {
                path: "uploadmdcc",
                element: <MDCC />,
                children: [
                  {
                    path: "",
                    element: <MDCCView />,
                  },
                  {
                    path: "mdccupload/:id",
                    element: <MDCCForm />,
                  },
                ],
              },
              {
                path: "cancelorder",
                element: <ClosePoComp />,
                children: [
                  {
                    path: "",
                    element: <ClosePoView />,
                  },{
                        path:'cancelorderform/:id',
                        element:<ClosePoForm/>
                      },

                ]
              },
            ],
          },
          {
            path: "deliveryComp",
            element: <ToCustomer />,
            children: [
              {
                path: "deliverycustomerview",
                element: <ToCustomerView />,
              },
              {
                path: "deliverycustomerform/:id/:po_no",
                element: <ToCustomerForm />,
              },
              {
                path: "approvemrn",
                element: <ApproveMrn />,
              },
            ],
          },
          {
            path: "stockComp",
            element: <StockComp />,
            children: [
              {
                path: "stockview",
                element: <StockView />,
              },
              // {
              //   path: "statementandtransfer/:id",
              //   element: <StatementandTransfer />,
              // },
              {
                path: "transfer",
                element: <Transfer />,
                children: [
                  {
                    path: "wtop",
                    element: <WtoWComp />,
                    children: [
                     
                      {
                        path: "",
                        element: <WtoWView />,
                      },
                      {
                        path: "wtopform/:id",
                        element: <WtoWForm />,
                      },
                    ],
                  },
                  {
                    path: "ptop",
                    element: <PtoPComp />,
                    children: [
                      {
                        path: "",
                        element: <PtoPView />,
                      },
                      {
                        path: "ptopform/:id",
                        element: <PtoPForm />,
                      },
                    ],
                  },
                  {
                    path: "ptow",
                    element: <PtoWComp />,
                    children: [
                      {
                        path: "",
                        element: <PtoWView />,
                      },
                      {
                        path: "ptowform/:id",
                        element: <PtoWForm />,
                      },
                    ],
                  },
                  {
                    path: "approvetransfer",
                    element: <ApproveView />,
                   
                  },
                  {
                    path: "canceltransfer",
                    element: <CancelView />,
                   
                  }
                ],
              },
              {
                path: "stockin",
                element: <StockIn />,
              },
              {
                path: "stockout",
                element: <StockOut />,
              },
            ],
          },
          {
            path: "purComp",
            element: <PurchaseReqComp />,
            children: [
              {
                path: "purView",
                element: <PurchaseReqView />,
              },
              {
                path: "purForm/:id",
                element: <PurchaseReqForm />,
              },
            ],
          },
           {
            path: "siemensComp",
            element: <SiemensComp />,
            children: [
              {
                path: "siemensView",
                element: <SiemensView />,
              },
              {
                path: "siemensForm/:id",
                element: <SiemensForm />,
              },
               {
                path: "siemensMRNForm/:id/:po_no",
                element: <SiemensMRNForm />,
              },
            ],
          },
          {
            path: "minComp",
            element: <MinComp />,
            children: [
              {
                path: "minView",
                element: <MinView />,
              },
              {
                path: "minForm/:id",
                element: <MinForm />,
              },
            ],
          },
          {
            path: "returnComp",
            element: <MaterialReturnComp />,
            children: [
              {
                path: "returnForm",
                element: <MaterialReturn />,
              },
             
            ],
          },
          {
            path: "reqComp",
            element: <Requisition />,
            children: [
              {
                path: "reqView",
                element: <RequisitionView />,
              },
              {
                path: "reqForm/:id",
                element: <RequisitionForm />,
              },
              {
                path: "approvereq",
                element: <ApproveRequisition />,
              },
              {
                path: "cancelreq",
                element: <CancelRequisition />,
              },
             
            ],
          },
          {
            path: "clientDelComp",
            element: <ClientDeliveryComp />,
            children: [
              {
                path: "clientDelView",
                element: <ClientDeliveryView />,
              },
              {
                path: "clientDelForm/:po_no",
                element: <ClientDeliveryForm />,
              },
            ],
          },
          {
            path: "reportComp",
            element: <ReportComp />,
            children: [
              {
                path: "allstock",
                element: <AllStock />,
              },
              {
                path: "itemwise",
                element: <Itemwise />,
              },
              {
                path: "projectwise",
                element: <Projectwise />,
              },
              {
                path: "mrnwise_one",
                element: <PurMrnReport />,
              },
              {
                path: "mrnwise_two",
                element: <PurMrnReporProj />,
              },
              {
                path: "stock_out_report",
                element: <StockOutReport />,
              },
              {
                path: "stock_val_report",
                element: <StockVal />,
              },
               {
                path: "mat_val_report",
                element: <MaterialVal />,
              },
              {
                path: "pr_ord_create",
                element: <Pr_ord_create />,
              },
              {
                path: "mat_val_stockout",
                element: <MatValStockout />,
              },
            ],
          },
          // {
          //   path: "details",
          //   element: <Details />,
          // },
        ],
      },
    ],
  },
  {
    path: "error/:id/:message",
    element: <CatchError />,
  },
  {
    path: "*",
    element: <Notfound />,
  },
]);

root.render(
  <Democontext>
    <Suspense
      fallback={
        <div className="bg-gray-200 h-screen flex justify-center items-center">
          <CircularProgress disableShrink color="success" />
        </div>
      }
    >
      <Loader />
      <RouterProvider router={router} />
    </Suspense>
  </Democontext>
);

{
  /* <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode> */
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
