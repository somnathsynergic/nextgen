import './Steps.css'

import React, { useEffect, useState } from 'react'
import TDInputTemplate from '../TDInputTemplate'
import { useParams } from 'react-router-dom';
import { ArrowLeftOutlined, LockFilled, UnlockFilled } from '@ant-design/icons';
import { ArrowRightOutlined } from '@ant-design/icons';
import { BlockUI } from 'primereact/blockui';

function Notes({pressBack,pressNext,data}) {
  const params = useParams();

const [notes,setNotes]=useState(data.notes?data.notes:'')
  const [blocked, setBlocked] = useState(false);
  const det = JSON.parse(localStorage.getItem('perm'))
useEffect(()=>{
  // setBlocked((det.po == 1 || (localStorage.getItem('manager_email')!='FFABC123' && localStorage.getItem('manager_email')!=localStorage.getItem('email'))) ? true : false);
  setBlocked(det.po == 1 || (localStorage.getItem('email')!=localStorage.getItem("po_created_by") && localStorage.getItem("po_created_by")) ?true:false)


},[])
  return (
    <div>
            <BlockUI blocked={blocked} template={
                                                <div className='relative  w-full h-full 0 z-10'>
                                                  <span className='absolute top-1 right-2 font-bold italic text-gray-500'><LockFilled className='text-green-900 '/> Locked</span>
                                                   <span className='absolute bottom-0 right-1 font-bold italic text-gray-500'><UnlockFilled className='text-green-900 '/> Accessible to {localStorage.getItem("po_created_by")}</span>
                                                
                                                </div>
                                              }>
      <div className={blocked?'p-2':''}>
       <TDInputTemplate
                                placeholder="Notes"
                                type="text"
                                label="Notes"
                                name='notes'
                                formControlName={notes}
                                handleChange={(notes)=>{setNotes(notes.target.value);localStorage.setItem('notes',notes.target.value)}}
                                mode={3}
                disabled={localStorage.getItem('po_status')=='A'||localStorage.getItem('po_status')=='D'||localStorage.getItem('po_status')=='L'?true:false}

                              />
                              </div>

                              </BlockUI>
                                         <div className="flex pt-4 justify-between w-full">
        <button
          className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-[#92140C] bg-[#92140C] transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 rounded-full  dark:focus:ring-primary-900"
          onClick={pressBack}
        >
          <ArrowLeftOutlined className='mr-1'/>
          Back
        </button>
        <button
          type="submit"
          className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
          onClick={()=>pressNext(notes)}
        >
          Next <ArrowRightOutlined className='ml-1'/>
        </button>
      </div>
    </div>
  )
}

export default Notes
