// import React, { useState } from 'react'
// import { Timeline } from 'antd';
// import HeadingTemplate from '../../Components/HeadingTemplate';
// import { Tabs } from 'antd';
// import moment from 'moment';
// import TDInputTemplate from '../../Components/TDInputTemplate';
// import { Radio } from 'antd';
function StatementandTransfer() {
//     const [value, setValue] = useState(1);

//     const onChangeRad = (e) => {
//       console.log('radio checked', e.target.value);
//       setValue(e.target.value);
//     };

// const onChange = (key) => {
//   console.log(key);
// };

// const items= [
//   {
//     key: '1',
//     label: 'Statement',
//     children:  <Timeline
//     items={[
//       {
//         children: 'Create a services site 2015-09-01',
//       },
//       {
//         children: 'Solve initial network problems 2015-09-01',
//       },
//       {
//         children: 'Technical testing 2015-09-01',
//       },
//       {
//         children: 'Network problems being solved 2015-09-01',
//       },
//     ]}
//   />,
//   },
//   {
//     key: '2',
//     label: 'Transfer',
//     children:  <section className="bg-transparent dark:bg-[#001529]">
    
  
//       <div className="grid grid-cols-12 gap-2">
//         <div className={"w-full col-span-12 bg-white p-6 rounded-2xl"}>
//           {/* <span className="flex justify-start my-2">
//             </span> */}
//           <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
           
//             <div
//               className={"sm:col-span-12"}
//             >
//               <TDInputTemplate
//                 placeholder="Search items by name, article no., part no., model no."
//                 type="text"
//                 label="Item"
//                 name="dt"
//                 min={moment(
//                   new Date(
//                     new Date().setFullYear(new Date().getFullYear() - 3)
//                   )
//                 ).format("yyyy-MM-DD")} //may need to change
//                 // formControlName={
//                 //   params.id > 0
//                 //     ? req_date
//                 //     : moment(new Date()).format("yyyy-MM-DD")
//                 // }
//                 max={moment(new Date()).format("yyyy-MM-DD")}
//                 // formControlName={params.po_no}
//                 disabled={true}
//                 mode={1}
//               />
//             </div>
//             <div className='sm:col-span-12'>
//               <p className='block my-2 text-green-900 font-bold'> Transfer from {"       "} </p>  
//             <Radio.Group onChange={onChangeRad} value={value}>
//       <Radio value={1}>Warehouse</Radio>
//       <Radio value={2}>Project</Radio>
//     </Radio.Group>
//             </div>
//             <div
//               className={"sm:col-span-6"}
//             >
//               <TDInputTemplate
//                 placeholder="Project"
//                 type="text"
//                 label="Project"
//                 name="dt"
//                 min={moment(
//                   new Date(
//                     new Date().setFullYear(new Date().getFullYear() - 3)
//                   )
//                 ).format("yyyy-MM-DD")} //may need to change
//                 // formControlName={
//                 //   params.id > 0
//                 //     ? req_date
//                 //     : moment(new Date()).format("yyyy-MM-DD")
//                 // }
//                 max={moment(new Date()).format("yyyy-MM-DD")}
//                 // formControlName={params.po_no}
//                 disabled={true}
//                 mode={1}
//               />
//             </div> 
//             <div
//               className={"sm:col-span-6"}
//             >
//               <TDInputTemplate
//                 placeholder="Project"
//                 type="text"
//                 label="Project"
//                 name="dt"
//                 min={moment(
//                   new Date(
//                     new Date().setFullYear(new Date().getFullYear() - 3)
//                   )
//                 ).format("yyyy-MM-DD")} //may need to change
//                 // formControlName={
//                 //   params.id > 0
//                 //     ? req_date
//                 //     : moment(new Date()).format("yyyy-MM-DD")
//                 // }
//                 max={moment(new Date()).format("yyyy-MM-DD")}
//                 // formControlName={params.po_no}
//                 disabled={true}
//                 mode={1}
//               />
//             </div>
//             </div>
//             </div>
//             </div>
//             </section>
//   }

// ];
//   return (
//     <section  className="bg-transparent dark:bg-[#001529]">
//              <HeadingTemplate
//                 text={"Stock History"}
//                 // mode={params.id>0?1:0}
//                 title={'Stock History'}
//                 // data={params.id && data?data:''}
//               />
//             <div className="w-full bg-white p-6 rounded-2xl">
//             <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

//     </div>
//     </section>
//   )
}

export default StatementandTransfer
